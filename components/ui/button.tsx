import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  [
    'relative inline-flex items-center justify-center gap-1.5 whitespace-nowrap select-none',
    'font-medium tracking-[-0.005em] rounded-md',
    'transition-all duration-base ease-out-expo',
    'focus-visible:outline-none focus-visible:shadow-focus',
    'disabled:pointer-events-none disabled:opacity-50',
    'active:translate-y-px',
  ].join(' '),
  {
    variants: {
      variant: {
        // Primary — iris gradient, inner highlight, 1px crisp outline via shadow
        primary: [
          'text-white',
          'bg-[linear-gradient(180deg,hsl(var(--accent))_0%,hsl(var(--accent-hover))_100%)]',
          'shadow-[inset_0_1px_0_rgb(255_255_255_/_0.16),0_1px_2px_rgb(0_0_0_/_0.20),0_0_0_1px_hsl(var(--accent-hover))]',
          'hover:brightness-[1.06]',
          'hover:shadow-[inset_0_1px_0_rgb(255_255_255_/_0.20),0_1px_2px_rgb(0_0_0_/_0.25),0_0_0_1px_hsl(var(--accent-hover)),0_8px_24px_-8px_hsl(var(--accent)/0.5)]',
        ].join(' '),

        // Secondary — surface chip with hairline
        secondary: [
          'bg-surface-1 text-text-primary',
          'border border-border-default',
          'shadow-xs',
          'hover:bg-surface-2 hover:border-border-strong',
        ].join(' '),

        // Ghost — transparent until hover
        ghost: [
          'text-text-secondary',
          'hover:text-text-primary hover:bg-surface-2',
        ].join(' '),

        // Subtle — tinted chip (toolbar actions)
        subtle: [
          'bg-surface-2 text-text-primary',
          'hover:bg-surface-3',
        ].join(' '),

        // Outline — transparent with border
        outline: [
          'bg-transparent text-text-primary',
          'border border-border-default',
          'hover:bg-surface-2 hover:border-border-strong',
        ].join(' '),

        // Danger
        danger: [
          'text-white',
          'bg-[linear-gradient(180deg,hsl(var(--danger))_0%,hsl(0_72%_48%)_100%)]',
          'shadow-[inset_0_1px_0_rgb(255_255_255_/_0.14),0_1px_2px_rgb(0_0_0_/_0.20)]',
          'hover:brightness-[1.05]',
        ].join(' '),

        // Link — text only
        link: 'text-accent underline-offset-4 hover:underline',

        // shadcn-compat aliases
        default: [
          'text-white',
          'bg-[linear-gradient(180deg,hsl(var(--accent))_0%,hsl(var(--accent-hover))_100%)]',
          'shadow-[inset_0_1px_0_rgb(255_255_255_/_0.16),0_1px_2px_rgb(0_0_0_/_0.20),0_0_0_1px_hsl(var(--accent-hover))]',
          'hover:brightness-[1.06]',
        ].join(' '),
        destructive: [
          'text-white',
          'bg-[linear-gradient(180deg,hsl(var(--danger))_0%,hsl(0_72%_48%)_100%)]',
          'shadow-[inset_0_1px_0_rgb(255_255_255_/_0.14),0_1px_2px_rgb(0_0_0_/_0.20)]',
          'hover:brightness-[1.05]',
        ].join(' '),
      },
      size: {
        xs: 'h-7 px-2.5 text-[12px]',
        sm: 'h-8 px-3 text-[13px]',
        md: 'h-9 px-3.5 text-[13px]',
        lg: 'h-10 px-4 text-[14px]',
        xl: 'h-11 px-5 text-[14px]',
        icon: 'h-9 w-9',
        'icon-sm': 'h-8 w-8',
        'icon-xs': 'h-7 w-7',
        default: 'h-9 px-3.5 text-[13px]',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
