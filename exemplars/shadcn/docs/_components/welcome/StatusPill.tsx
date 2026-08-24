import type { Status } from '../types';
import { Icon, resolveStatusIcon } from '../icons';

const LABEL: Record<Status, string> = {
  filled: 'Filled',
  'in-progress': 'In progress',
  placeholder: 'Placeholder',
  empty: 'Empty',
};

export interface StatusPillProps {
  status?: Status;
}

export function StatusPill({ status = 'empty' }: StatusPillProps) {
  return (
    <span className="hd-status-pill" data-status={status}>
      <Icon name={resolveStatusIcon(status)} size={12} />
      <span className="hd-status-pill-label">{LABEL[status]}</span>
    </span>
  );
}
