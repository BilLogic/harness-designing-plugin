import type { Meta, StoryObj } from '@storybook/react';
import { Settings, Search, ArrowRight } from 'lucide-react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: '4-components/Button',
  component: Button,
  // Fluent pattern: stories render INSIDE the docs page, but don't appear as
  // separate sidebar entries. The user navigates to the component, reads the
  // docs page; individual stories are documentation, not destinations.
  tags: ['autodocs', '!dev'],
  args: { children: 'Button' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline', 'ghost', 'link'],
    },
    size: { control: 'select', options: ['default', 'sm', 'lg', 'icon'] },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A click target. Six variants for action emphasis, four sizes for density.',
      },
      bestPractices: {
        do: [
          'Use one `default` button per region — primary actions are scarce by design.',
          'Pair `default` with `outline` or `secondary` for the alternative — never two primaries.',
          'Pick the variant by **meaning**: `destructive` for delete, `link` for navigation rendered as a button.',
          'Always set `aria-label` on `size="icon"` buttons — the icon alone isn\'t a name.',
        ],
        dont: [
          'Use color alone to convey meaning — keep variant + label aligned.',
          'Restyle `default` inline to fake a new variant — fork it instead.',
          'Stack two `destructive` buttons in the same view.',
          'Use `Click here` as a label — name the verb (`Open`, `Save`, `Delete`).',
        ],
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

const row: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  columnGap: '0.625rem',
  rowGap: '0.625rem',
};

/** Canonical example. The story drives the args panel. */
export const Default: Story = {
  args: { children: 'Button' },
};

/** All six variants in one row — one story per axis (Fluent pattern). */
export const Appearance: Story = {
  render: () => (
    <div style={row}>
      <Button variant="default">Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Six variants — `default` for primary CTAs, `secondary`/`outline` paired with primary, `destructive` for permanent actions, `ghost` in toolbars, `link` for navigation rendered as a button.',
      },
    },
  },
};

/** All four sizes in one row. */
export const Size: Story = {
  render: () => (
    <div style={row}>
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon" aria-label="Settings">
        <Settings size={16} />
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Four sizes — `sm`, `default`, `lg`, and `icon`. Icon-only buttons MUST set `aria-label`.',
      },
    },
  },
};

/** With leading or trailing icon. */
export const Icon: Story = {
  render: () => (
    <div style={row}>
      <Button>
        <Search size={16} />
        Search
      </Button>
      <Button variant="outline">
        Continue
        <ArrowRight size={16} />
      </Button>
      <Button variant="ghost" size="icon" aria-label="Settings">
        <Settings size={16} />
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Buttons can render with leading or trailing icons. Icon-only buttons require `aria-label`.',
      },
    },
  },
};

/** Disabled across variants. */
export const Disabled: Story = {
  render: () => (
    <div style={row}>
      <Button disabled>Default</Button>
      <Button variant="outline" disabled>
        Outline
      </Button>
      <Button variant="destructive" disabled>
        Destructive
      </Button>
      <Button variant="ghost" disabled>
        Ghost
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Disabled state across variants. `aria-disabled` mirrors `disabled` for screen readers; native cursor and click prevention come from the `disabled` attribute.',
      },
    },
  },
};
