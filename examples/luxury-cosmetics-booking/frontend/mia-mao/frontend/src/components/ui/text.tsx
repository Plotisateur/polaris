import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';

const textVariants = cva('inline-flex text-grey-900', {
  variants: {
    variant: {
      h1: 'text-5xl font-semibold leading-none',
      h2: 'text-3xl font-semibold leading-none',
      h3: 'text-2xl font-semibold leading-none',
      h4: 'text-xl font-semibold leading-none',
      h5: 'text-lg font-semibold leading-none',
      'subtitle-16': 'text-base font-medium leading-none',
      'subtitle-14': 'text-sm font-medium leading-none',
      'subtitle-12': 'text-xs font-medium leading-none',
      'body-16': 'text-base font-normal leading-none',
      'body-14': 'text-sm font-normal leading-none',
      'body-12': 'text-xs font-normal leading-none',
      'link-16': 'text-base font-normal leading-none underline',
      'link-14': 'text-sm font-normal leading-none underline',
      'link-12': 'text-xs font-normal leading-none underline',
      muted: 'text-xs leading-5 font-normal text-grey-600',
      'checkbox-label': 'text-sm leading-4 font-medium',
    },
  },
  defaultVariants: {
    variant: 'body-14',
  },
});

const defaultComp = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  'subtitle-16': 'p',
  'subtitle-14': 'p',
  'subtitle-12': 'p',
  'body-16': 'p',
  'body-14': 'p',
  'body-12': 'p',
  'link-16': 'span',
  'link-14': 'span',
  'link-12': 'span',
  'checkbox-label': 'label',
  muted: 'span',
};

export interface TextProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof textVariants> {
  asChild?: boolean;
}

const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  ({ className, variant, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : defaultComp[variant ?? 'body-14'];

    return <Comp ref={ref} className={cn(textVariants({ variant, className }))} {...props} />;
  }
);

Text.displayName = 'Text';

export { Text, textVariants };
