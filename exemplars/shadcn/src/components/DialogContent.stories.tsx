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

const meta: Meta<typeof DialogContent> = {
  title: '4-components/Dialog/DialogContent',
  component: DialogContent,
  tags: ['autodocs', '!dev'],
  parameters: {
    docs: {
      description: {
        component:
          'The panel that renders when the dialog is open. Hosts the backdrop, the surface, and the close button. Renders `role="dialog"` with `aria-modal="true"`.',
      },
      bestPractices: {
        do: [
          'Default `maxWidth: 480` — bump to 640 only when content needs more horizontal room.',
          'Trust the built-in close affordances: backdrop, X button, Esc.',
        ],
        dont: [
          'Stretch beyond 720px — at that point a sheet or full page is the right surface.',
          'Manually layer a custom backdrop — the component owns this.',
        ],
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof DialogContent>;

/** Default — inherits the standard panel surface. */
export const Default: Story = {
  render: () => (
    <Dialog defaultOpen>
      <DialogTrigger>
        <Button>Toggle</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Default content</DialogTitle>
          <DialogDescription>Standard padding, border, popover surface.</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  ),
};

/** Wider content — for forms or detail views. */
export const Wider: Story = {
  render: () => (
    <Dialog defaultOpen>
      <DialogTrigger>
        <Button>Toggle</Button>
      </DialogTrigger>
      <DialogContent style={{ maxWidth: 640 }}>
        <DialogHeader>
          <DialogTitle>Detail view</DialogTitle>
          <DialogDescription>
            Override `maxWidth` inline when content needs more horizontal room — tables, complex
            forms, side-by-side comparisons.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Default `maxWidth` is 480px. Bump to 640px or 720px for content that needs more room. Avoid going wider — beyond the viewport edge it becomes a sheet, not a dialog.',
      },
    },
  },
};

/** Without a header. */
export const HeaderOnly: Story = {
  render: () => (
    <Dialog defaultOpen>
      <DialogTrigger>
        <Button>Toggle</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Just a title</DialogTitle>
          <DialogDescription>The body region is implicit — header sits flush with the close button.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button>OK</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
