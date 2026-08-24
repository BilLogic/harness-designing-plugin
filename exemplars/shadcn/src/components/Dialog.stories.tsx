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
import { Input } from './Input';
import { Label } from './Label';

const meta: Meta<typeof Dialog> = {
  title: '4-components/Dialog/Dialog',
  component: Dialog,
  tags: ['autodocs', '!dev'],
  parameters: {
    docs: {
      description: {
        component:
          'Modal overlay for focused tasks — confirmations, short forms, detail views. Composes with `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter` (each on their own page). Esc closes; backdrop click closes.',
      },
      bestPractices: {
        do: [
          'Reserve for short, focused tasks — confirmations, single-form edits, detail peeks.',
          'Always include `DialogTitle` — `aria-labelledby` points to it.',
          'For destructive actions, the right-side button is `destructive` and Cancel sits left.',
        ],
        dont: [
          'Use a dialog for multi-step flows — promote to a dedicated page.',
          'Open a dialog from inside another dialog — modal-on-modal is a smell.',
          'Disable Esc to close — users expect it.',
        ],
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Dialog>;

/** Canonical example — trigger button opens a confirmation dialog. */
export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger>
        <Button>Open dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. The selected items will be permanently removed.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button variant="destructive">Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

/** Form dialog — small flow inside the modal. */
export const Form: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger>
        <Button>Edit profile</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>Update your display name and email. Click save when you&apos;re done.</DialogDescription>
        </DialogHeader>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          <Label htmlFor="dialog-name">Name</Label>
          <Input id="dialog-name" defaultValue="Avery Brooks" />
          <Label htmlFor="dialog-email" style={{ marginTop: '0.5rem' }}>
            Email
          </Label>
          <Input id="dialog-email" type="email" defaultValue="avery@example.com" />
        </div>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Short forms — name change, address update, billing tweak. For multi-step or long-form flows, prefer a dedicated page over a dialog.',
      },
    },
  },
};

/** Default-open — useful for controlled flows. */
export const DefaultOpen: Story = {
  render: () => (
    <Dialog defaultOpen>
      <DialogTrigger>
        <Button variant="outline">Toggle</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Welcome back</DialogTitle>
          <DialogDescription>This dialog opens by default for the story.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button>Got it</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`defaultOpen` forces the dialog to render open on mount — handy for documentation, route-driven dialogs, or onboarding moments.',
      },
    },
  },
};
