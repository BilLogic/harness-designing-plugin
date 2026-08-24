import type { Meta, StoryObj } from '@storybook/react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from './Accordion';

const meta: Meta<typeof AccordionItem> = {
  title: '4-components/Accordion/AccordionItem',
  component: AccordionItem,
  tags: ['autodocs', '!dev'],
  parameters: {
    docs: {
      description: {
        component:
          'A single expandable section. Pass a unique `value` — that\'s how `Accordion` tracks which items are open. Wraps an `AccordionTrigger` and an `AccordionContent`.',
      },
      bestPractices: {
        do: [
          'Pass a stable, unique `value` — it persists in URL state.',
          'Pair with exactly one `AccordionTrigger` and one `AccordionContent`.',
          'Override `borderBottom: none` when nesting inside a card to avoid double-rules.',
        ],
        dont: [
          'Reuse a `value` across items — open-state breaks.',
          'Embed multiple triggers per item — promote to two siblings instead.',
        ],
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof AccordionItem>;

/** Default — one item inside an accordion. */
export const Default: Story = {
  render: () => (
    <Accordion type="single" collapsible defaultValue="i-1" style={{ width: 480 }}>
      <AccordionItem value="i-1">
        <AccordionTrigger>Item one</AccordionTrigger>
        <AccordionContent>Body of item one.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

/** Multiple items — the typical shape. */
export const Multiple: Story = {
  render: () => (
    <Accordion type="single" collapsible style={{ width: 480 }}>
      <AccordionItem value="alpha">
        <AccordionTrigger>Alpha</AccordionTrigger>
        <AccordionContent>First section</AccordionContent>
      </AccordionItem>
      <AccordionItem value="beta">
        <AccordionTrigger>Beta</AccordionTrigger>
        <AccordionContent>Second section</AccordionContent>
      </AccordionItem>
      <AccordionItem value="gamma">
        <AccordionTrigger>Gamma</AccordionTrigger>
        <AccordionContent>Third section</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Each item gets a unique `value`. The bottom border between items comes from `AccordionItem` itself — last-of-type retains it for visual consistency.',
      },
    },
  },
};

/** Custom border styling. */
export const NoBottomBorder: Story = {
  render: () => (
    <Accordion type="single" collapsible style={{ width: 480 }}>
      <AccordionItem value="i-1" style={{ borderBottom: 'none' }}>
        <AccordionTrigger>Standalone item</AccordionTrigger>
        <AccordionContent>No border below this item.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Override `borderBottom` inline if the accordion sits inside a card that already supplies a containing border — avoid double-rules.',
      },
    },
  },
};
