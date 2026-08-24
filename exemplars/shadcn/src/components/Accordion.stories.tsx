import type { Meta, StoryObj } from '@storybook/react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from './Accordion';

const meta: Meta<typeof Accordion> = {
  title: '4-components/Accordion/Accordion',
  component: Accordion,
  tags: ['autodocs', '!dev'],
  argTypes: {
    type: { control: 'select', options: ['single', 'multiple'] },
    collapsible: { control: 'boolean' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Composition primitive — the root that owns open-state. Wraps multiple `AccordionItem`. Two modes: `single` (one open at a time, optional `collapsible`) and `multiple` (any subset open).',
      },
      bestPractices: {
        do: [
          'Pick `single` for FAQ/help patterns; `multiple` for filter and settings panels.',
          'Add `collapsible` to `single` when any panel may be closed.',
          'Use stable, unique `value` strings — they\'re part of the URL/state.',
        ],
        dont: [
          'Hide form controls that are required for submit inside a closed accordion.',
          'Use accordion for more than ~10 items — long lists belong in a sidebar.',
        ],
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Accordion>;

const items = [
  { value: 'item-1', q: 'Is it accessible?', a: 'Yes. Triggers carry `aria-expanded`; content regions reference their trigger via `aria-labelledby`.' },
  { value: 'item-2', q: 'Is it styled?', a: 'Yes. Uses shadcn tokens — chevron rotates on open, hairline border between items.' },
  { value: 'item-3', q: 'Can I customize the chevron?', a: 'Override the trigger\'s children — anything you put inside renders alongside the chevron.' },
];

/** Single mode, collapsible — the canonical shape. */
export const Default: Story = {
  render: () => (
    <Accordion type="single" collapsible defaultValue="item-1" style={{ width: 480 }}>
      {items.map((item) => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger>{item.q}</AccordionTrigger>
          <AccordionContent>{item.a}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
};

/** Single, non-collapsible — one item is always open. */
export const SingleNonCollapsible: Story = {
  render: () => (
    <Accordion type="single" defaultValue="item-1" style={{ width: 480 }}>
      {items.map((item) => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger>{item.q}</AccordionTrigger>
          <AccordionContent>{item.a}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Without `collapsible`, the open item can\'t be closed by clicking it again — you can only open another. Use when one panel must always be visible.',
      },
    },
  },
};

/** Multiple mode — any subset open. */
export const Multiple: Story = {
  render: () => (
    <Accordion type="multiple" defaultValue={['item-1', 'item-3']} style={{ width: 480 }}>
      {items.map((item) => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger>{item.q}</AccordionTrigger>
          <AccordionContent>{item.a}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'In `multiple` mode, any combination of items can be open. Pass an array to `defaultValue` to seed multiple expanded items.',
      },
    },
  },
};
