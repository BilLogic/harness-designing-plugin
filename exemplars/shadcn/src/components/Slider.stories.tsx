import type { Meta, StoryObj } from '@storybook/react';
import { Slider } from './Slider';
import { Label } from './Label';

const meta: Meta<typeof Slider> = {
  title: '4-components/Slider',
  component: Slider,
  tags: ['autodocs', '!dev'],
  args: { min: 0, max: 100, defaultValue: 50 },
  argTypes: {
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    defaultValue: { control: 'number' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Continuous numeric input. Use for values where you want approximate, not precise — volume, opacity, brightness. Pair with a numeric readout when precision matters.',
      },
      bestPractices: {
        do: [
          'Pair with a label and a tabular-nums numeric readout — slider gives feel, readout gives exact.',
          'Use `step` for discrete scales (1-5 ratings, hour ranges).',
          'Apply the change live so the user sees the effect — sliders are for settings, not commits.',
        ],
        dont: [
          'Use a slider when the user needs precision — give them a number input.',
          'Default to `min=0 max=100` for non-percent ranges — set the real bounds.',
          'Hide the value — without a readout the user can\'t describe the state.',
        ],
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Slider>;

const stack: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.625rem',
  width: 320,
};

/** Canonical example. */
export const Default: Story = {
  args: { defaultValue: 50 },
};

/** With a label and a numeric readout. */
export const WithLabelAndReadout: Story = {
  render: () => (
    <div style={stack}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Label htmlFor="slider-volume">Volume</Label>
        <span style={{ fontSize: 'var(--text-sm)', fontVariantNumeric: 'tabular-nums', color: 'var(--muted-foreground)' }}>
          50
        </span>
      </div>
      <Slider id="slider-volume" defaultValue={50} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Pair the label with a tabular-nums numeric readout — the slider gives approximate, the readout gives exact.',
      },
    },
  },
};

/** Custom range with step. */
export const Stepped: Story = {
  render: () => (
    <div style={stack}>
      <Label htmlFor="slider-step">Hours per day</Label>
      <Slider id="slider-step" min={0} max={24} step={1} defaultValue={8} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Custom `min` / `max` / `step` constraints — useful for discrete scales (1-5 ratings, hour ranges, etc.).',
      },
    },
  },
};

/** Disabled state. */
export const Disabled: Story = {
  render: () => (
    <div style={stack}>
      <Label htmlFor="slider-disabled" style={{ opacity: 0.5 }}>
        Brightness
      </Label>
      <Slider id="slider-disabled" defaultValue={70} disabled />
    </div>
  ),
};
