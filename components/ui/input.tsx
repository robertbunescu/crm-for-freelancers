import * as React from 'react';

import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          'flex h-9 w-full rounded-md px-3 text-[13.5px]',
          'bg-surface-inset text-text-primary placeholder:text-text-tertiary',
          'border border-border-default',
          'transition-[background-color,border-color,box-shadow] duration-base ease-out-expo',
          'hover:border-border-strong',
          'focus:outline-none focus:border-accent focus:shadow-focus focus:bg-surface-1',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-text-primary',
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
