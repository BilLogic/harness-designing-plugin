import type { Meta, StoryObj } from '@storybook/react';
import { Settings, Info, Trash2 } from 'lucide-react';
import { Tooltip } from './Tooltip';
import { Button } from './Button';

const meta: Meta<typeof Tooltip> = {
  title: '4-components/Tooltip',
  component: Tooltip,
  tags: ['autodocs', '!dev'],
  argTypes: {
    side: { control: 'select', options: ['top', 'right', 'bottom', 'left'] },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Brief contextual hint on hover or focus. Use only for **supplementary** info — never put critical instructions in tooltips (touch users can\'t hover, and screen readers may skip them).',
      },
      bestPractices: {
        do: [
          'Use for supplementary info — names of icon-only buttons, definitions of abbreviations.',
          'Pair `aria-label` (always set) with the visible tooltip — both are required for icon-only.',
          'Make trigger elements focusable — keyboard users need access too.',
        ],
        dont: [
          'Hide critical instructions inside tooltips — touch users can\'t hover.',
          'Use tooltips for actionable buttons or links — interactivity-in-tooltip is fragile.',
          'Show tooltips on plain text — they obstruct reading.',
        ],
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Tooltip>;

const row: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '2rem',
  padding: '2.5rem 0',
};

/** Canonical example. */
export const Default: Story = {
  render: () => (
    <div style={{ padding: '2rem' }}>
      <Tooltip content="Open settings">
        <Button variant="ghost" size="icon" aria-label="Settings">
          <Settings size={16} />
        </Button>
      </Tooltip>
    </div>
  ),
};

/** All four sides. */
export const Sides: Story = {
  render: () => (
    <div style={row}>
      {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
        <Tooltip key={side} content={`Side: ${side}`} side={side}>
          <Button variant="outline">{side}</Button>
        </Tooltip>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Four sides — `top` is the default. In real usage, prefer Radix\'s collision-aware variant which auto-flips when the chosen side overflows the viewport.',
      },
    },
  },
};

/** On an icon-only button — the most common use. */
export const IconButtons: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem', padding: '2rem 0' }}>
      <Tooltip content="View details">
        <Button variant="ghost" size="icon" aria-label="Details">
          <Info size={16} />
        </Button>
      </Tooltip>
      <Tooltip content="Settings">
        <Button variant="ghost" size="icon" aria-label="Settings">
          <Settings size={16} />
        </Button>
      </Tooltip>
      <Tooltip content="Delete permanently" side="bottom">
        <Button variant="ghost" size="icon" aria-label="Delete">
          <Trash2 size={16} />
        </Button>
      </Tooltip>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Tooltips on icon-only buttons supply visual help — the `aria-label` still does the screen-reader work. Both are required: tooltip for sighted hover users, label for AT users.',
      },
    },
  },
};

/** Inline help on a label. */
export const InlineHelp: Story = {
  render: () => (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '2rem 0' }}>
      <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>API key</span>
      <Tooltip content="Found under Settings → Developer">
        <span
          tabIndex={0}
          aria-label="What is an API key?"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '0.875rem',
            height: '0.875rem',
            borderRadius: '50%',
            border: '1px solid var(--muted-foreground)',
            color: 'var(--muted-foreground)',
            fontSize: '0.625rem',
            cursor: 'help',
          }}
        >
          ?
        </span>
      </Tooltip>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Inline help glyph next to a field label — the trigger is `tabindex="0"` so keyboard users reach it. Don\'t bury anything required to use the field here.',
      },
    },
  },
};
