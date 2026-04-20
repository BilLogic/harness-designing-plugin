#!/usr/bin/env python3
"""detect.py — deterministic harness + tooling detection for hd:setup.

Replaces the v1 detect-mode.sh. Emits JSON matching schema v4 (see
`references/hd-config-schema.md`). Exit 0 on success (even if no harness
detected — "greenfield" is a valid result). Non-zero only on I/O failure.

Schema v4 (3l.3) adds:
- Probes for .agents/, .cursor/skills/, .windsurf/, .roo/
- Content-based L1 detection (PRD-shaped filenames, tech-stack docs,
  design-system dirs scattered across docs/)
- layers_present_scattered[] field distinguishing scattered from canonical
- scattered_l1_signals sub-object with evidence

Usage:
    cd <user's repo root>
    python3 .../skills/hd-setup/scripts/detect.py

Sections below match ideation doc
`docs/plans/2026-04-17-009-v1.1-skill-ideation.md` IDs C1-C4.
"""

from __future__ import annotations

import argparse
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
        "has_agents_dir": (REPO / ".agents").is_dir(),      # 3l.3: some teams pluralize
        "has_cursor_skills_dir": (REPO / ".cursor" / "skills").is_dir(),  # 3l.3
        "has_windsurf_dir": (REPO / ".windsurf").is_dir(),  # 3l.3
        "has_roo_dir": (REPO / ".roo").is_dir(),            # 3l.3 (Roo Code)
        "has_external_skills": False,
        "has_plans_convention": False,
    }

    # Count actual skill files (SKILL.md OR top-level .md) under each skills dir.
    # Probe all sibling skills locations (.agents/ included per 3l.3).
    skill_md_count = 0
    for base in (".claude/skills", ".codex/skills", ".cursor/skills", ".agent/skills", ".agents/skills"):
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


def _parse_mcp_file(path: Path) -> set[str] | None:
    """Parse one MCP config file; return server-name set, or None if malformed.

    Returns empty set if file has no mcpServers key but is valid JSON.
    Returns None on JSON/Unicode error (caller may warn).
    """
    try:
        data = json.loads(path.read_text(encoding="utf-8", errors="replace"))
    except (json.JSONDecodeError, UnicodeDecodeError):
        return None
    mcp_servers = data.get("mcpServers") or data.get("mcp_servers") or {}
    if isinstance(mcp_servers, dict):
        return set(mcp_servers.keys())
    return set()


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
        names = _parse_mcp_file(p)
        if names is None:
            continue
        servers.update(names)
    return sorted(servers)


def detect_user_mcp_servers() -> tuple[list[str], list[str]]:
    """Parse user-level mcp.json files. Return (sorted server names, sources read).

    Reads ~/.claude/mcp.json and ~/.codex/mcp.json. Emits a stderr warn line
    for each malformed file. Missing files are silent (not an error).
    """
    user_candidates = [
        os.path.expanduser("~/.claude/mcp.json"),
        os.path.expanduser("~/.codex/mcp.json"),
    ]
    servers: set[str] = set()
    sources: list[str] = []
    for path_str in user_candidates:
        p = Path(path_str)
        if not p.is_file():
            continue
        names = _parse_mcp_file(p)
        if names is None:
            sys.stderr.write(f"warn: malformed user MCP config at {path_str}\n")
            continue
        servers.update(names)
        sources.append(path_str)
    return sorted(servers), sources


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


# --- E2.5: other-tool harness enumeration (generic) ---------------------------


def _compound_entry() -> dict | None:
    """Detect compound-engineering footprint; return generic harness entry or None."""
    probe_paths = [
        "docs/solutions",
        "docs/ideation",
        "docs/brainstorms",
        "docs/plans",
    ]
    paths_found = [p + "/" for p in probe_paths if (REPO / p).is_dir()]
    config_path = REPO / "compound-engineering.local.md"
    config_file = "compound-engineering.local.md" if config_path.is_file() else None
    if not paths_found and config_file is None:
        return None
    entry: dict = {
        "name": "compound-engineering",
        "type": "plugin",
        "paths_found": paths_found,
    }
    if config_file is not None:
        entry["config_file"] = config_file
    return entry


def _meta_harness_entry(dirname: str) -> dict | None:
    """Detect a meta-harness directory (.agent, .claude, .codex, etc.) at repo root.

    3m.1: requires content substance, not just directory existence. A meta-harness
    must have AT LEAST ONE of:
      - skills/ with ≥1 SKILL.md or *.md
      - rules/ with ≥1 *.md
      - agents/ with ≥1 *.md
      - commands/ with ≥1 *.md
      - settings.json or settings.local.json with ≥5 non-blank lines
      - AGENTS.md or AGENT.md with ≥20 non-blank lines

    Metadata-only dirs (e.g. .claude/worktrees/ alone, .claude/logs/ alone,
    empty settings.local.json) return None — they don't count as a harness.
    """
    root = REPO / dirname
    if not root.is_dir():
        return None
    paths_found: list[str] = []
    skill_count = 0
    rule_count = 0
    has_substance = False

    skills_dir = root / "skills"
    if skills_dir.is_dir():
        skill_mds = list(skills_dir.rglob("SKILL.md"))
        bare_mds = [f for f in skills_dir.iterdir() if f.is_file() and f.suffix == ".md"]
        skill_count = len(skill_mds) + len(bare_mds)
        if skill_count == 0:
            skill_count = sum(1 for f in skills_dir.rglob("*.md") if f.is_file())
        if skill_count > 0:
            paths_found.append(f"{dirname}/skills/")
            has_substance = True

    rules_dir = root / "rules"
    if rules_dir.is_dir():
        rule_count = sum(1 for f in rules_dir.rglob("*.md") if f.is_file())
        if rule_count > 0:
            paths_found.append(f"{dirname}/rules/")
            has_substance = True

    commands_dir = root / "commands"
    if commands_dir.is_dir():
        cmd_count = sum(1 for f in commands_dir.rglob("*.md") if f.is_file())
        if cmd_count > 0:
            paths_found.append(f"{dirname}/commands/")
            has_substance = True

    agents_dir = root / "agents"
    if agents_dir.is_dir():
        agent_count = sum(1 for f in agents_dir.rglob("*.md") if f.is_file())
        if agent_count > 0:
            paths_found.append(f"{dirname}/agents/")
            has_substance = True

    # settings.json / settings.local.json with non-trivial content
    for settings_name in ("settings.json", "settings.local.json"):
        settings_path = root / settings_name
        if settings_path.is_file():
            try:
                lines = [
                    line for line in settings_path.read_text(encoding="utf-8").splitlines()
                    if line.strip()
                ]
                if len(lines) >= 5:
                    paths_found.append(f"{dirname}/{settings_name}")
                    has_substance = True
            except (OSError, UnicodeDecodeError):
                pass

    # AGENTS.md / AGENT.md inside this dir with ≥20 non-blank lines
    for agents_md_name in ("AGENTS.md", "AGENT.md"):
        agents_md_path = root / agents_md_name
        if agents_md_path.is_file():
            try:
                lines = [
                    line for line in agents_md_path.read_text(encoding="utf-8").splitlines()
                    if line.strip()
                ]
                if len(lines) >= 20:
                    paths_found.append(f"{dirname}/{agents_md_name}")
                    has_substance = True
            except (OSError, UnicodeDecodeError):
                pass

    if not has_substance:
        # Dir exists but only contains metadata (worktrees/, logs/, etc.) or
        # empty/stub configs. NOT a real harness.
        return None

    entry: dict = {
        "name": dirname,
        "type": "meta-harness",
        "paths_found": paths_found,
    }
    if skill_count:
        entry["skill_count"] = skill_count
    if rule_count:
        entry["rule_count"] = rule_count
    return entry


def detect_other_tool_harnesses() -> list[dict]:
    """Generic enumeration — returns unified array of detected other-tool harnesses.

    Schema v4 (3l.3): probes expanded to include .agents/ (plural), .cursor/skills/,
    .windsurf/, .roo/ in addition to the original three.
    """
    entries: list[dict] = []
    comp = _compound_entry()
    if comp is not None:
        entries.append(comp)
    for dname in (".agent", ".agents", ".claude", ".codex", ".cursor", ".windsurf", ".roo"):
        e = _meta_harness_entry(dname)
        if e is not None:
            entries.append(e)
    return entries


# --- 3l.3: scattered L1 content detection -------------------------------------


_PRD_FILENAME_RE = re.compile(
    r"^(PRD[_-].*\.md|.*[_-]PRD\.md|.*-prd\.md|PRD\.md|requirements\.md)$", re.I
)
_TECH_STACK_FILENAME_RE = re.compile(
    r"^(TECH[_-]STACK\.md|tech-stack\.md|ARCHITECTURE\.md|architecture\.md|STACK\.md)$", re.I
)


def detect_scattered_l1() -> dict:
    """3l.3: find scattered Layer 1 content that doesn't live in docs/context/.

    Catches repos where real context exists as PRD docs, tech-stack files,
    or a design-system folder outside the canonical docs/context/ tree.
    Oracle-chat example: docs/TECH_STACK.md + docs/PRD_MVP.md + docs/design-system/
    were present but detect.py reported layers_present: [].
    """
    docs_dir = REPO / "docs"
    if not docs_dir.is_dir():
        return {
            "prd_files": [],
            "tech_stack_files": [],
            "design_system_dirs": [],
        }

    prd_files: list[str] = []
    tech_stack_files: list[str] = []

    # Shallow scan — docs/ top-level + one level deep
    try:
        entries = list(docs_dir.iterdir())
    except OSError:
        return {"prd_files": [], "tech_stack_files": [], "design_system_dirs": []}

    for entry in entries:
        if entry.is_file():
            if _PRD_FILENAME_RE.match(entry.name):
                prd_files.append(str(entry.relative_to(REPO)))
            elif _TECH_STACK_FILENAME_RE.match(entry.name):
                tech_stack_files.append(str(entry.relative_to(REPO)))

    # Check docs/design-system/ + docs/design_system/ (legacy)
    design_system_dirs: list[str] = []
    for candidate in ("design-system", "design_system", "design-tokens"):
        p = docs_dir / candidate
        if p.is_dir():
            design_system_dirs.append(str(p.relative_to(REPO)))

    # Also probe src/ + app/ for design-system
    for src_parent in (REPO / "src", REPO / "app"):
        if src_parent.is_dir():
            for candidate in ("design-system", "design_system"):
                p = src_parent / candidate
                if p.is_dir():
                    design_system_dirs.append(str(p.relative_to(REPO)))

    return {
        "prd_files": sorted(prd_files)[:10],
        "tech_stack_files": sorted(tech_stack_files)[:5],
        "design_system_dirs": sorted(design_system_dirs)[:5],
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
    parser = argparse.ArgumentParser(
        description="Deterministic harness + tooling detection for hd:setup.",
    )
    parser.add_argument(
        "--include-user-mcps",
        action="store_true",
        help=(
            "Also scan user-level MCP configs (~/.claude/mcp.json, "
            "~/.codex/mcp.json). Default: repo-scoped only."
        ),
    )
    args = parser.parse_args()

    v1 = detect_v1_signals()
    other_h = detect_other_harnesses()
    mcp_servers = detect_mcp_servers()
    user_mcp_sources: list[str] = []
    if args.include_user_mcps:
        user_names, user_mcp_sources = detect_user_mcp_servers()
        if user_names:
            merged = set(mcp_servers) | set(user_names)
            mcp_servers = sorted(merged)
    team_tooling = detect_team_tooling()
    config_sot = detect_config_sot()
    deps = collect_package_deps()
    a11y = detect_a11y_framework(deps)
    managed_ds = detect_managed_design_system(deps)
    maturity = detect_maturity_signals(v1["has_ai_docs"])
    other_tool_harnesses = detect_other_tool_harnesses()
    scattered_l1 = detect_scattered_l1()  # 3l.3

    # 3l.3: compute layers_present_scattered — layers that exist in scattered
    # form but not in the canonical docs/context/ tree.
    layers_scattered: list[str] = []
    has_scattered_l1 = bool(
        scattered_l1["prd_files"]
        or scattered_l1["tech_stack_files"]
        or scattered_l1["design_system_dirs"]
    )
    has_canonical_l1 = "L1" in maturity["layers_present"]
    if has_scattered_l1 and not has_canonical_l1:
        layers_scattered.append("L1")
    # L3 scattered: plans/ikideation/brainstorms conventions without docs/orchestration/
    if other_h["has_plans_convention"]:
        layers_scattered.append("L3")

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
        "has_agents_dir": other_h["has_agents_dir"],          # 3l.3
        "has_cursor_skills_dir": other_h["has_cursor_skills_dir"],  # 3l.3
        "has_windsurf_dir": other_h["has_windsurf_dir"],      # 3l.3
        "has_roo_dir": other_h["has_roo_dir"],                # 3l.3
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
        "layers_present_scattered": layers_scattered,       # 3l.3
        "scattered_l1_signals": scattered_l1,               # 3l.3
        # E2.2 — managed DS
        "managed_design_system": managed_ds,
        # G3 — user-level MCP scoping (opt-in via --include-user-mcps)
        "user_mcps_included": args.include_user_mcps,
        "user_mcp_sources": user_mcp_sources,
        # E2.5 — generic array of detected other-tool harnesses (schema v3)
        "other_tool_harnesses_detected": other_tool_harnesses,
        # Plug-in install signal (separate from repo-level detection)
        "compound_installed": v1["compound_installed"],
    }

    output = {
        "schema_version": "4",
        "mode": mode,
        "priority_matched": priority,
        "signals": signals,
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
