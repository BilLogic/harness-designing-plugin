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

const meta: Meta<typeof DialogFooter> = {
  title: '4-components/Dialog/DialogFooter',
  component: DialogFooter,
  tags: ['autodocs', '!dev'],
  parameters: {
    docs: {
      description: {
        component:
          'The action region at the bottom of `DialogContent`. Right-aligned by default — primary action on the right (natural Enter target), secondary or cancel on the left.',
      },
      bestPractices: {
        do: [
          'Right-align — the primary action is the natural Enter target.',
          'For destructive confirmations, use `outline` Cancel + `destructive` Confirm pair.',
          'For three-action footers, override `justifyContent: space-between` and group primary pair right.',
        ],
        dont: [
          'Stack four+ buttons — promote complex flows out of the dialog.',
          'Center-align the actions — right is the convention; users scan there.',
        ],
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof DialogFooter>;

/** Two-action default — Cancel + Confirm. */
export const Default: Story = {
  render: () => (
    <Dialog defaultOpen>
      <DialogTrigger>
        <Button>Toggle</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm</DialogTitle>
          <DialogDescription>Two-button shape — outline cancel, default confirm.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

/** Destructive confirmation. */
export const Destructive: Story = {
  render: () => (
    <Dialog defaultOpen>
      <DialogTrigger>
        <Button variant="destructive">Delete account</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete account?</DialogTitle>
          <DialogDescription>
            This permanently removes your data. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button variant="destructive">Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'For destructive confirmations, the right-side button uses the `destructive` variant and the cancel sits left so it isn\'t the natural Enter target.',
      },
    },
  },
};

/** Three actions — secondary alternative on the left. */
export const ThreeActions: Story = {
  render: () => (
    <Dialog defaultOpen>
      <DialogTrigger>
        <Button>Save changes?</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save changes?</DialogTitle>
          <DialogDescription>You have unsaved edits.</DialogDescription>
        </DialogHeader>
        <DialogFooter style={{ justifyContent: 'space-between' }}>
          <Button variant="ghost">Don&apos;t save</Button>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button variant="outline">Cancel</Button>
            <Button>Save</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'When you need a third action (e.g., "Don\'t save" alongside Cancel and Save), override `justifyContent: space-between` and group the primary pair on the right.',
      },
    },
  },
};
