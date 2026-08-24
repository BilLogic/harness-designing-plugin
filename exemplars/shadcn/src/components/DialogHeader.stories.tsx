import type { Meta, StoryObj } from '@storybook/react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './Dialog';
import { Button } from './Button';

const meta: Meta<typeof DialogHeader> = {
  title: '4-components/Dialog/DialogHeader',
  component: DialogHeader,
  tags: ['autodocs', '!dev'],
  parameters: {
    docs: {
      description: {
        component:
          'The top region inside `DialogContent`. Hosts `DialogTitle` (the heading) and `DialogDescription` (sub-copy). Always include — the title is what `aria-labelledby` points at.',
      },
      bestPractices: {
        do: [
          'Always wrap `DialogTitle` — it\'s the accessible name for the dialog.',
          'Use `DialogDescription` for sub-copy when the title alone leaves the user guessing.',
        ],
        dont: [
          'Drop the header to save space — without a title, screen readers can\'t name the dialog.',
        ],
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof DialogHeader>;

/** Title + description — the canonical shape. */
export const Default: Story = {
  render: () => (
    <Dialog defaultOpen>
      <DialogTrigger>
        <Button>Toggle</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save changes?</DialogTitle>
          <DialogDescription>You have unsaved edits. Save now to preserve them.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline">Discard</Button>
          <Button>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

/** Title-only — drop the description. */
export const TitleOnly: Story = {
  render: () => (
    <Dialog defaultOpen>
      <DialogTrigger>
        <Button>Toggle</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm action</DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'When the title alone is enough — short confirmations where the action buttons clarify the choice.',
      },
    },
  },
};
