import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  [
    'inline-flex items-center h-5 px-1.5 rounded-sm',
    'text-[11px] font-semibold tracking-[-0.005em] leading-none',
    'transition-colors duration-base ease-out-expo',
  ].join(' '),
  {
    variants: {
      variant: {
        neutral: 'bg-surface-2 text-text-secondary',
        accent: 'bg-accent-soft text-accent',
        success: 'bg-success-soft text-success',
        warning: 'bg-warning-soft text-warning',
        danger: 'bg-danger-soft text-danger',
        info: 'bg-info-soft text-info',
        outline: 'border border-border-default text-text-secondary',
        // shadcn-compat
        default: 'bg-accent-soft text-accent',
        secondary: 'bg-surface-2 text-text-secondary',
        destructive: 'bg-danger-soft text-danger',
      },
      size: {
        sm: 'h-[18px] px-1.5 text-[10.5px]',
        md: 'h-5 px-1.5 text-[11px]',
        lg: 'h-6 px-2 text-[12px]',
      },
    },
    defaultVariants: {
      variant: 'neutral',
      size: 'md',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
