import type { Meta, StoryObj } from '@storybook/react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from './Accordion';

const meta: Meta<typeof AccordionTrigger> = {
  title: '4-components/Accordion/AccordionTrigger',
  component: AccordionTrigger,
  tags: ['autodocs', '!dev'],
  parameters: {
    docs: {
      description: {
        component:
          'The clickable header of an `AccordionItem`. Wrapped in `<h3>` for semantic structure. Carries `aria-expanded` and `aria-controls` to expose state to assistive tech. Chevron rotates 180° on open.',
      },
      bestPractices: {
        do: [
          'Phrase triggers as questions or named sections ("Is it accessible?", "Shipping address").',
          'Layer metadata next to the headline (count, status, timestamp) — wrap children freely.',
        ],
        dont: [
          'Hide the chevron — it\'s the visual affordance for "this expands".',
          'Use a trigger label that doesn\'t describe what opens — users hate guessing.',
        ],
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof AccordionTrigger>;

/** Default — short label. */
export const Default: Story = {
  render: () => (
    <Accordion type="single" collapsible defaultValue="i-1" style={{ width: 480 }}>
      <AccordionItem value="i-1">
        <AccordionTrigger>Open me</AccordionTrigger>
        <AccordionContent>Content</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

/** Trigger with leading metadata. */
export const WithMetadata: Story = {
  render: () => (
    <Accordion type="single" collapsible style={{ width: 480 }}>
      <AccordionItem value="i-1">
        <AccordionTrigger>
          <span>
            <span style={{ fontWeight: 600 }}>Order #1042 </span>
            <span style={{ color: 'var(--muted-foreground)', fontWeight: 400, marginLeft: '0.375rem' }}>
              · 3 items · $124.50
            </span>
          </span>
        </AccordionTrigger>
        <AccordionContent>Order details</AccordionContent>
      </AccordionItem>
      <AccordionItem value="i-2">
        <AccordionTrigger>
          <span>
            <span style={{ fontWeight: 600 }}>Order #1041 </span>
            <span style={{ color: 'var(--muted-foreground)', fontWeight: 400, marginLeft: '0.375rem' }}>
              · 1 item · $34.00
            </span>
          </span>
        </AccordionTrigger>
        <AccordionContent>Order details</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Triggers accept any markup — wrap the children to layer in a status, count, or timestamp alongside the headline.',
      },
    },
  },
};

/** Multi-line trigger. */
export const Multiline: Story = {
  render: () => (
    <Accordion type="single" collapsible style={{ width: 320 }}>
      <AccordionItem value="i-1">
        <AccordionTrigger>
          A long question that runs to two lines so the chevron stays aligned with the first line
        </AccordionTrigger>
        <AccordionContent>
          The chevron sits at flex-start of the cross axis — the answer body wraps freely below.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Long triggers wrap; the chevron stays visually anchored. Vertical alignment is `align-items: center` by default — switch to `flex-start` if your trigger is very tall.',
      },
    },
  },
};
