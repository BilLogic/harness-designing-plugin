#!/usr/bin/env python3
"""detect.py — deterministic harness + tooling detection for hd:setup.

Replaces the v1 detect-mode.sh. Emits JSON matching schema v2 (see
`references/hd-config-schema.md`). Exit 0 on success (even if no harness
detected — "greenfield" is a valid result). Non-zero only on I/O failure.

Usage:
    cd <user's repo root>
    python3 .../skills/hd-setup/scripts/detect.py

Sections below match ideation doc
`docs/plans/2026-04-17-009-v1.1-skill-ideation.md` IDs C1-C4.
"""

from __future__ import annotations

import datetime
import json
import os
import re
import subprocess
import sys
from pathlib import Path

# --- thresholds (mirror bloat-detection.md) -----------------------------------
TIER_1_BUDGET = 200
SINGLE_FILE_BLOAT = 500
PLACEHOLDER_MIN_HITS = 3
PLANS_CONVENTION_MIN = 3

REPO = Path(".").resolve()

# --- C1: other-tool harness detection -----------------------------------------


def detect_other_harnesses() -> dict:
    """Detect harness machinery built by other tools (plus-uno, compound, etc).

    Advanced-mode signals — presence of any means we DO NOT scaffold from zero.
    """
    signals = {
        "has_claude_dir": (REPO / ".claude").is_dir(),
        "has_codex_dir": (REPO / ".codex").is_dir(),
        "has_agent_dir": (REPO / ".agent").is_dir(),
        "has_external_skills": False,
        "has_plans_convention": False,
    }

    # Count actual skill files (SKILL.md OR top-level .md) under each skills dir.
    # Previously counted directory entries, which over-reported (pilot #5 lightning
    # has 5 skill .md files but 8 directory entries including worktrees/).
    # Take max across sibling skills dirs — .cursor/skills is often a mirror of
    # .claude/skills; summing would double-count. Count SKILL.md files plus
    # bare top-level .md files (lightning pilot mixes both conventions).
    skill_md_count = 0
    for base in (".claude/skills", ".codex/skills", ".cursor/skills"):
        p = REPO / base
        if not p.is_dir():
            continue
        skill_mds = list(p.rglob("SKILL.md"))
        bare_mds = [f for f in p.iterdir() if f.is_file() and f.suffix == ".md"]
        local = len(skill_mds) + len(bare_mds)
        if not skill_mds and not bare_mds:
            # deeper flat convention (nested *.md files under the skills dir)
            local = sum(1 for f in p.rglob("*.md") if f.is_file())
        if local > skill_md_count:
            skill_md_count = local
    signals["has_external_skills"] = skill_md_count >= 1
    signals["external_skills_count"] = skill_md_count

    plans_dir = REPO / "docs" / "plans"
    if plans_dir.is_dir():
        pattern = re.compile(r"^\d{4}-\d{2}-\d{2}-\d{3}-.+-plan\.md$")
        plans = [f for f in plans_dir.iterdir() if f.is_file() and pattern.match(f.name)]
        signals["has_plans_convention"] = len(plans) >= PLANS_CONVENTION_MIN
        signals["plans_convention_count"] = len(plans)
    else:
        signals["plans_convention_count"] = 0

    return signals


# --- C2: MCP configuration detection ------------------------------------------


def detect_mcp_servers() -> list[str]:
    """Parse every mcp.json in the repo; return sorted unique server names."""
    candidates = [
        ".mcp.json",
        ".cursor/mcp.json",
        ".codex/mcp.json",
        ".claude/mcp.json",
    ]
    servers: set[str] = set()
    for rel in candidates:
        p = REPO / rel
        if not p.is_file():
            continue
        try:
            data = json.loads(p.read_text(encoding="utf-8", errors="replace"))
        except (json.JSONDecodeError, UnicodeDecodeError):
            continue
        mcp_servers = data.get("mcpServers") or data.get("mcp_servers") or {}
        if isinstance(mcp_servers, dict):
            servers.update(mcp_servers.keys())
    return sorted(servers)


# --- C3: external-tool category detection -------------------------------------

CATEGORY_PATTERNS: dict[str, dict[str, re.Pattern[str]]] = {
    "docs": {
        "notion": re.compile(r"(?:notion\.so|notion\.com)\b", re.I),
        "google_docs": re.compile(r"docs\.google\.com", re.I),
        "confluence": re.compile(r"\.atlassian\.net/wiki|confluence\.", re.I),
        "coda": re.compile(r"coda\.io", re.I),
        "obsidian": re.compile(r"obsidian\.md", re.I),
    },
    "design": {
        "figma": re.compile(r"figma\.com/(?:file|design|proto)", re.I),
        "paper": re.compile(r"paper\.design", re.I),
        "pencildev": re.compile(r"pencil\.dev", re.I),
        "sketch": re.compile(r"sketch\.com", re.I),
    },
    "diagramming": {
        "excalidraw": re.compile(r"excalidraw\.com", re.I),
        "miro": re.compile(r"miro\.com", re.I),
        "whimsical": re.compile(r"whimsical\.com", re.I),
        "lucidchart": re.compile(r"lucid\.app", re.I),
        "figjam": re.compile(r"figma\.com/board", re.I),
    },
    "analytics": {
        "amplitude": re.compile(r"amplitude\.com", re.I),
        "mixpanel": re.compile(r"mixpanel\.com", re.I),
        "posthog": re.compile(r"posthog\.com", re.I),
        "metabase": re.compile(r"\bmetabase\b", re.I),
        "hotjar": re.compile(r"hotjar\.com", re.I),
        "fullstory": re.compile(r"fullstory\.com", re.I),
    },
    "pm": {
        "linear": re.compile(r"linear\.app", re.I),
        "jira": re.compile(r"\.atlassian\.net/browse|/jira/", re.I),
        "github_issues": re.compile(r"github\.com/[^/]+/[^/]+/issues", re.I),
        "asana": re.compile(r"asana\.com", re.I),
        "monday": re.compile(r"monday\.com", re.I),
    },
    "comms": {
        "slack": re.compile(r"slack\.com|\.slack\.com", re.I),
        "discord": re.compile(r"discord\.(?:com|gg)", re.I),
        "loom": re.compile(r"loom\.com", re.I),
    },
}

SEARCH_EXTENSIONS = {
    ".md", ".mdx", ".mdc", ".json", ".yml", ".yaml",
    ".ts", ".tsx", ".js", ".jsx", ".html", ".txt",
}
SKIP_DIRS = {
    ".git", "node_modules", "dist", "build", ".next", ".turbo",
    "coverage", "__pycache__", ".venv", "venv",
    "skills",   # our own skills shouldn't contaminate detection
    "plans",    # meta-harness docs mention tools abstractly
    "knowledge",
}


def detect_team_tooling() -> dict[str, list[str]]:
    """Grep the repo for URL + reference signals per category.

    Only scans small-ish files with known extensions. Skips generated dirs.
    Returns { category: [tool, ...] } with tools sorted + deduped.
    """
    hits: dict[str, set[str]] = {cat: set() for cat in CATEGORY_PATTERNS}

    for root, dirs, files in os.walk(REPO):
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS and not d.startswith(".cursor")]
        # allow .cursor/ files since they often contain MCP refs, but not its
        # generated subdirs. Easiest: filter by name above but keep going.
        for fname in files:
            if not any(fname.endswith(ext) for ext in SEARCH_EXTENSIONS):
                continue
            fpath = Path(root) / fname
            try:
                if fpath.stat().st_size > 512 * 1024:  # cap 512 KB / file
                    continue
                text = fpath.read_text(encoding="utf-8", errors="replace")
            except (OSError, UnicodeDecodeError):
                continue
            for cat, tools in CATEGORY_PATTERNS.items():
                for tool, pat in tools.items():
                    if tool in hits[cat]:
                        continue  # already found
                    if pat.search(text):
                        hits[cat].add(tool)

    return {cat: sorted(tools) for cat, tools in hits.items()}


# --- C4: token + figma config signals -----------------------------------------


def detect_config_sot() -> dict:
    """Token-package + figma.config signals. (Storybook → v2, not here.)

    Token detection tries (in order):
    1. Top-level explicit paths (`tokens/` dir, `style-dictionary.config.*`, `tokens.config.json`)
    2. Recursive `tokens.json` search up to depth 3, excluding build/vendor dirs

    Emits `tokens_package_paths: [...]` so downstream can reference actual paths.
    """
    tokens_signals = [
        REPO / "tokens",
        REPO / "style-dictionary.config.js",
        REPO / "style-dictionary.config.cjs",
        REPO / "style-dictionary.config.ts",
        REPO / "tokens.config.json",
    ]
    top_level_hit = any(
        (p.is_dir() if p.name == "tokens" else p.is_file()) for p in tokens_signals
    )
    tokens_package_paths: list[str] = []
    if top_level_hit:
        for p in tokens_signals:
            if (p.is_dir() if p.name == "tokens" else p.is_file()):
                tokens_package_paths.append(str(p.relative_to(REPO)))

    # Recursive tokens.json search (G1 — sds has scripts/tokens/tokens.json)
    SKIP = {"node_modules", "dist", "build", ".next", "__pycache__", ".git",
            ".turbo", "coverage", ".venv", "venv"}
    for candidate in REPO.rglob("tokens.json"):
        rel_parts = candidate.relative_to(REPO).parts
        if any(part in SKIP for part in rel_parts):
            continue
        if len(rel_parts) > 3:
            continue
        rel = str(candidate.relative_to(REPO))
        if rel not in tokens_package_paths:
            tokens_package_paths.append(rel)
        if len(tokens_package_paths) >= 5:  # cap output
            break

    has_tokens = top_level_hit or len(tokens_package_paths) > 0

    has_figma_config = any(
        (REPO / name).is_file()
        for name in ("figma.config.json", "figma-config.json")
    )

    return {
        "has_tokens_package": has_tokens,
        "has_figma_config": has_figma_config,
        "tokens_package_paths": tokens_package_paths,
    }


# --- C2 (extended): a11y-framework detection via package.json deps -----------


A11Y_FRAMEWORK_PATTERNS = [
    # react-aria family (Adobe) — matches react-aria, react-aria-components,
    # react-aria-next, @react-aria/*, @react-stately/*, @react-types/*
    re.compile(r"^react-aria(-|$)"),
    re.compile(r"^@react-(aria|stately|types)/"),
    re.compile(r"^react-stately(-|$)"),
    # react-spectrum family
    re.compile(r"^react-spectrum(-|$)"),
    re.compile(r"^@adobe/react-spectrum"),
    # radix-ui family (E2.3)
    re.compile(r"^@radix-ui/"),
    re.compile(r"^radix-ui$"),
    # headlessui family (E2.3)
    re.compile(r"^@headlessui/"),
    # reach-ui (E2.3)
    re.compile(r"^@reach/"),
    # react-bootstrap (E2.3)
    re.compile(r"^react-bootstrap$"),
    # reakit
    re.compile(r"^reakit(-|$)"),
    # base-ui / MUI headless primitives
    re.compile(r"^@mui/base"),
    re.compile(r"^@base-ui-components/"),
    re.compile(r"^@base-ui/"),
    # ariakit (successor to reakit)
    re.compile(r"^ariakit(-|$)"),
    re.compile(r"^@ariakit/"),
]

# E2.2: managed design-system detection. First match wins.
MANAGED_DS_PATTERNS: list[tuple[re.Pattern[str], str]] = [
    (re.compile(r"^antd$"), "ant-design"),
    (re.compile(r"^@ant-design/"), "ant-design"),
    (re.compile(r"^@chakra-ui/"), "chakra"),
    (re.compile(r"^@mantine/"), "mantine"),
    (re.compile(r"^@mui/material$"), "mui"),
    (re.compile(r"^@mui/"), "mui"),
]

PKG_JSON_SKIP = {
    "node_modules", "dist", "build", ".next", "__pycache__", ".git",
    ".turbo", "coverage", ".venv", "venv",
}


def collect_package_deps() -> set[str]:
    """Walk the repo (depth-limited) collecting dependency names from every
    package.json — top-level AND nested workspace roots (e.g. oracle-chat/web/).

    Capped at 5 package.json files to stay fast.
    """
    deps: set[str] = set()
    count = 0
    for candidate in REPO.rglob("package.json"):
        rel_parts = candidate.relative_to(REPO).parts
        if any(part in PKG_JSON_SKIP for part in rel_parts):
            continue
        if len(rel_parts) > 4:
            continue
        try:
            data = json.loads(candidate.read_text(encoding="utf-8", errors="replace"))
        except (json.JSONDecodeError, UnicodeDecodeError, OSError):
            continue
        for field in ("dependencies", "devDependencies", "peerDependencies"):
            d = data.get(field) or {}
            if isinstance(d, dict):
                deps.update(d.keys())
        count += 1
        if count >= 5:
            break
    return deps


def detect_managed_design_system(deps: set[str]) -> str | None:
    """E2.2: return library key of first matched managed DS, else None."""
    for dep in sorted(deps):
        for pat, key in MANAGED_DS_PATTERNS:
            if pat.match(dep):
                return key
    return None


def detect_a11y_framework(deps: set[str]) -> dict:
    """Match collected deps against A11Y_FRAMEWORK_PATTERNS.

    Emits a11y_framework_in_use: bool + detected_a11y_packages: [pkg-name, ...]
    Used by Layer 4 default to elevate accessibility-wcag-aa rubric rationale.
    """
    if not deps:
        return {"a11y_framework_in_use": False, "detected_a11y_packages": []}

    detected: list[str] = []
    for dep in sorted(deps):
        for pat in A11Y_FRAMEWORK_PATTERNS:
            if pat.match(dep):
                detected.append(dep)
                break
        if len(detected) >= 10:  # cap
            break

    return {
        "a11y_framework_in_use": len(detected) > 0,
        "detected_a11y_packages": detected,
    }


# --- E2.1: L4/L5 maturity signals ---------------------------------------------

# Match `memory_type:` or `type:` (fallback) in YAML frontmatter
_MEMORY_TYPE_RE = re.compile(r"^(?:memory_type|type)\s*:\s*(\S+)", re.MULTILINE)


def detect_maturity_signals(has_ai_docs: bool) -> dict:
    """E2.1: L4 (rubrics/) + L5 (knowledge/) maturity signals."""
    rubrics_dir = REPO / "docs" / "rubrics"
    rubrics_mds: list[Path] = []
    if rubrics_dir.is_dir():
        rubrics_mds = [f for f in rubrics_dir.rglob("*.md") if f.is_file()]
    has_rubrics_dir = len(rubrics_mds) >= 1

    knowledge_dir = REPO / "docs" / "knowledge"
    has_knowledge_dir = knowledge_dir.is_dir() and (
        (knowledge_dir / "INDEX.md").is_file() or (knowledge_dir / "lessons").is_dir()
    )
    knowledge_mds: list[Path] = []
    if knowledge_dir.is_dir():
        knowledge_mds = [f for f in knowledge_dir.rglob("*.md") if f.is_file()]

    memory_types: set[str] = set()
    for f in knowledge_mds:
        try:
            if f.stat().st_size > 256 * 1024:
                continue
            text = f.read_text(encoding="utf-8", errors="replace")
        except (OSError, UnicodeDecodeError):
            continue
        # only look inside leading YAML frontmatter block
        if text.startswith("---"):
            end = text.find("\n---", 3)
            block = text[:end] if end != -1 else text[:1024]
        else:
            block = text[:1024]
        for m in _MEMORY_TYPE_RE.finditer(block):
            memory_types.add(m.group(1).strip().strip("\"'"))

    layers: list[str] = []
    if has_ai_docs:
        layers.append("L1")
    if (REPO / "docs" / "context").is_dir():
        if "L1" not in layers:
            layers.append("L1")
    if has_rubrics_dir:
        layers.append("L4")
    if has_knowledge_dir:
        layers.append("L5")

    return {
        "has_rubrics_dir": has_rubrics_dir,
        "rubrics_file_count": len(rubrics_mds),
        "has_knowledge_dir": has_knowledge_dir,
        "knowledge_file_count": len(knowledge_mds),
        "memory_types_present": sorted(memory_types),
        "layers_present": layers,
    }


# --- E2.5: compound-engineering footprint enrichment --------------------------


def detect_compound_footprint() -> dict:
    """Replace `coexistence.compound_engineering: bool` with a richer dict."""
    probe_paths = [
        "docs/solutions",
        "docs/ideation",
        "docs/brainstorms",
        "docs/plans",
    ]
    paths_found = [p for p in probe_paths if (REPO / p).is_dir()]
    config_path = REPO / "compound-engineering.local.md"
    config_file = "compound-engineering.local.md" if config_path.is_file() else None
    present = bool(paths_found) or config_file is not None
    return {
        "present": present,
        "paths_found": paths_found,
        "config_file": config_file,
    }


# --- E2.6: markdown-todos PM signal -------------------------------------------

_TODO_FILE_RE = re.compile(r"\d{3}-\w+.*\.md")


def detect_markdown_todos() -> bool:
    todos_dir = REPO / "todos"
    if not todos_dir.is_dir():
        return False
    matches = [f for f in todos_dir.iterdir() if f.is_file() and _TODO_FILE_RE.match(f.name)]
    return len(matches) >= 2


# --- existing v1 signals (preserved for backward compat) ----------------------


def detect_v1_signals() -> dict:
    """Original detect-mode.sh v1 signals. Preserved byte-for-byte semantics."""
    has_local_md = (REPO / "hd-config.md").is_file()

    # placeholders: {{UPPER_SNAKE_CASE}} in non-skill non-plan non-knowledge files
    placeholder_hits = 0
    placeholder_re = re.compile(r"\{\{[A-Z][A-Z0-9_]+\}\}")
    for root, dirs, files in os.walk(REPO):
        dirs[:] = [
            d for d in dirs
            if d not in SKIP_DIRS and d not in {".git", "node_modules"}
        ]
        for fname in files:
            if fname.endswith(".template"):
                continue
            fpath = Path(root) / fname
            try:
                if fpath.stat().st_size > 512 * 1024:
                    continue
                text = fpath.read_text(encoding="utf-8", errors="replace")
            except (OSError, UnicodeDecodeError):
                continue
            if placeholder_re.search(text):
                placeholder_hits += 1
                if placeholder_hits >= PLACEHOLDER_MIN_HITS:
                    break
        if placeholder_hits >= PLACEHOLDER_MIN_HITS:
            break
    has_placeholders = placeholder_hits >= PLACEHOLDER_MIN_HITS

    has_layer_folders = (REPO / "docs" / "context").is_dir() and (
        REPO / "docs" / "knowledge"
    ).is_dir()

    ai_doc_paths = [
        "AGENTS.md", "CLAUDE.md", ".cursor/rules", ".windsurf/rules",
        ".github/copilot-instructions.md", "DESIGN.md",
    ]
    has_ai_docs = any((REPO / p).exists() for p in ai_doc_paths)

    # bloat check
    single_bloat = False
    combined = 0
    for name in ("AGENTS.md", "CLAUDE.md", "DESIGN.md"):
        p = REPO / name
        if p.is_file():
            lines = sum(1 for _ in p.open("rb"))
            if lines > SINGLE_FILE_BLOAT:
                single_bloat = True
            combined += lines
    combined_bloat = combined > TIER_1_BUDGET
    has_bloat = single_bloat or combined_bloat

    compound_installed = Path(
        os.path.expanduser("~/.claude/plugins/cache/compound-engineering-plugin")
    ).is_dir()

    return {
        "has_local_md": has_local_md,
        "has_placeholders": has_placeholders,
        "has_layer_folders": has_layer_folders,
        "has_ai_docs": has_ai_docs,
        "has_bloat": has_bloat,
        "compound_installed": compound_installed,
    }


# --- mode decision ------------------------------------------------------------


def decide_mode(v1: dict, other_h: dict) -> tuple[str, int]:
    """Priority order (first match wins, lowest priority_matched = highest):

    1 — local.md present (prior run)
    2 — NEW: other-tool harness present (.claude/, .codex/, .agent/, external
        skills, plans-convention) → advanced, never scaffold
    3 — placeholders ≥3 → localize
    4 — layer folders (docs/context + docs/knowledge) → advanced
    5 — AI docs present → scattered (+ bloat_overlay if applicable)
    6 — nothing → greenfield
    """
    if v1["has_local_md"]:
        return "advanced", 1
    if any([
        other_h["has_claude_dir"],
        other_h["has_codex_dir"],
        other_h["has_agent_dir"],
        other_h["has_external_skills"],
        other_h["has_plans_convention"],
    ]):
        return "advanced", 2
    if v1["has_placeholders"]:
        return "localize", 3
    if v1["has_layer_folders"]:
        return "advanced", 4
    if v1["has_ai_docs"]:
        return "scattered", 5
    return "greenfield", 6


# --- emission -----------------------------------------------------------------


def main() -> int:
    v1 = detect_v1_signals()
    other_h = detect_other_harnesses()
    mcp_servers = detect_mcp_servers()
    team_tooling = detect_team_tooling()
    config_sot = detect_config_sot()
    deps = collect_package_deps()
    a11y = detect_a11y_framework(deps)
    managed_ds = detect_managed_design_system(deps)
    maturity = detect_maturity_signals(v1["has_ai_docs"])
    compound_footprint = detect_compound_footprint()

    # E2.6: append markdown-todos to team_tooling.pm if signal fires
    if detect_markdown_todos():
        pm = list(team_tooling.get("pm", []))
        if "markdown-todos" not in pm:
            pm.append("markdown-todos")
            pm.sort()
        team_tooling["pm"] = pm

    mode, priority = decide_mode(v1, other_h)
    bloat_overlay = v1["has_bloat"] and mode == "scattered"

    # Merge signal flags (v1 + C1 + C4 + a11y + E2.1/E2.2) into single signals dict
    signals = {
        "has_local_md": v1["has_local_md"],
        "has_placeholders": v1["has_placeholders"],
        "has_layer_folders": v1["has_layer_folders"],
        "has_ai_docs": v1["has_ai_docs"],
        "has_bloat": v1["has_bloat"],
        "has_claude_dir": other_h["has_claude_dir"],
        "has_codex_dir": other_h["has_codex_dir"],
        "has_agent_dir": other_h["has_agent_dir"],
        "has_external_skills": other_h["has_external_skills"],
        "external_skills_count": other_h["external_skills_count"],
        "has_plans_convention": other_h["has_plans_convention"],
        "plans_convention_count": other_h["plans_convention_count"],
        "has_tokens_package": config_sot["has_tokens_package"],
        "a11y_framework_in_use": a11y["a11y_framework_in_use"],
        "has_figma_config": config_sot["has_figma_config"],
        # E2.1 — L4/L5 maturity
        "has_rubrics_dir": maturity["has_rubrics_dir"],
        "rubrics_file_count": maturity["rubrics_file_count"],
        "has_knowledge_dir": maturity["has_knowledge_dir"],
        "knowledge_file_count": maturity["knowledge_file_count"],
        "memory_types_present": maturity["memory_types_present"],
        "layers_present": maturity["layers_present"],
        # E2.2 — managed DS
        "managed_design_system": managed_ds,
    }

    output = {
        "schema_version": "2",
        "mode": mode,
        "priority_matched": priority,
        "signals": signals,
        "coexistence": {
            # E2.5 — enriched compound-engineering footprint
            "compound_engineering": compound_footprint,
            "compound_installed": v1["compound_installed"],
        },
        "bloat_overlay": bloat_overlay,
        "mcp_servers": mcp_servers,
        "team_tooling": team_tooling,
        "tokens_package_paths": config_sot["tokens_package_paths"],
        "detected_a11y_packages": a11y["detected_a11y_packages"],
        "detected_at": datetime.datetime.now(datetime.timezone.utc).strftime(
            "%Y-%m-%dT%H:%M:%SZ"
        ),
    }

    json.dump(output, sys.stdout, indent=2)
    sys.stdout.write("\n")
    return 0


if __name__ == "__main__":
    sys.exit(main())
