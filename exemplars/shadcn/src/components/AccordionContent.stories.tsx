import type { Meta, StoryObj } from '@storybook/react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from './Accordion';
import { Button } from './Button';
import { Input } from './Input';
import { Label } from './Label';

const meta: Meta<typeof AccordionContent> = {
  title: '4-components/Accordion/AccordionContent',
  component: AccordionContent,
  tags: ['autodocs', '!dev'],
  parameters: {
    docs: {
      description: {
        component:
          'The body that reveals when the matching `AccordionTrigger` is open. Renders `role="region"` and links back to the trigger via `aria-labelledby`. Hidden via the native `hidden` attribute when collapsed — focus-safe.',
      },
      bestPractices: {
        do: [
          'Hold any markup — prose, forms, lists, code blocks.',
          'Use complete sentences — answers should stand alone without re-stating the question.',
        ],
        dont: [
          'Stuff multi-page content inside — promote long answers to dedicated pages.',
          'Render content unconditionally — keep `hidden` semantics intact for focus management.',
        ],
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof AccordionContent>;

/** Plain prose body. */
export const Default: Story = {
  render: () => (
    <Accordion type="single" collapsible defaultValue="i-1" style={{ width: 480 }}>
      <AccordionItem value="i-1">
        <AccordionTrigger>What&apos;s in here?</AccordionTrigger>
        <AccordionContent>
          Prose copy. Use complete sentences; the answer should stand on its own without the trigger
          re-stating the question.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

/** With form fields inside. */
export const WithForm: Story = {
  render: () => (
    <Accordion type="single" collapsible defaultValue="i-1" style={{ width: 480 }}>
      <AccordionItem value="i-1">
        <AccordionTrigger>Shipping address</AccordionTrigger>
        <AccordionContent>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Label htmlFor="ac-street">Street</Label>
            <Input id="ac-street" defaultValue="123 Main St" />
            <Label htmlFor="ac-city" style={{ marginTop: '0.5rem' }}>
              City
            </Label>
            <Input id="ac-city" defaultValue="Pittsburgh" />
            <div style={{ marginTop: '0.5rem' }}>
              <Button>Save</Button>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="i-2">
        <AccordionTrigger>Billing address</AccordionTrigger>
        <AccordionContent>Same as shipping.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Forms work cleanly inside `AccordionContent` — fields stay accessible, focus visits them in DOM order. Don\'t hide required fields behind a closed accordion if the form must be submitted.',
      },
    },
  },
};

/** Long-form content. */
export const LongForm: Story = {
  render: () => (
    <Accordion type="single" collapsible defaultValue="i-1" style={{ width: 480 }}>
      <AccordionItem value="i-1">
        <AccordionTrigger>Privacy policy summary</AccordionTrigger>
        <AccordionContent>
          <p style={{ margin: '0 0 0.75rem' }}>
            We collect the data you provide directly — your name, email, and the records you create
            inside the product. No tracking pixels, no third-party analytics on user data.
          </p>
          <p style={{ margin: 0 }}>
            Data is stored encrypted at rest and in transit. You can export or delete everything at
            any time from <a href="#" style={{ color: 'inherit' }}>Settings → Privacy</a>.
          </p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Multi-paragraph content — keep the accordion item the right size for the longest answer. If a single answer needs scrolling, consider promoting it to its own page.',
      },
    },
  },
};
