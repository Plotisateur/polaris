import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-hidden focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        primary:
          'bg-secondary text-white hover:backdrop-blur-lg hover:shadow-glassmorph data-[loading=true]:bg-grey-700 data-[loading=true]:text-white',
        destructive:
          'bg-alert-600 text-white hover:bg-alert-700 hover:shadow-glassmorph data-[loading=true]:bg-alert-700 data-[loading=true]:text-white',
        secondary:
          'border bg-white border-grey-200 text-grey-900 hover:shadow-glassmorph hover:border-none hover:backdrop-blur-lg hover:shadow-400 active:border-grey-900 disabled:border-none',
        secondaryDestructive:
          'border bg-white border-grey-200 text-alert-700 hover:shadow-glassmorph hover:border-alert-700 hover:bg-alert-100 active:border-alert-700 disabled:border-none',
        ghost:
          '!h-8 !p-2 text-grey-900 hover:shadow-glassmorph active:border-grey-900 disabled:bg-white disabled:border-none',
        ghostDestructive:
          '!h-8 !p-2 text-alert-700 border border-grey-200 hover:shadow-glassmorph rounded-xl hover:border-alert-700 hover:bg-alert-100 active:border-alert-700 disabled:bg-white disabled:border-none',
        ghostIcon:
          '!h-6 !w-6 !p-1 text-grey-900 rounded-full hover:shadow-glassmorph active:border active:border-grey-900 disabled:bg-white disabled:border-none',
        ghostIconDestructive:
          '!h-6 !w-6 !p-1 text-alert-700 rounded-full hover:shadow-glassmorph hover:bg-alert-100 active:shadow-100 disabled:bg-white disabled:border-none',
        link: '!h-6 !py-1 !px-2 gap-2.5 text-xs bg-grey-50 text-grey-900 rounded-xl hover:bg-grey-100',
        linkSecondary:
          '!h-6 !py-1 !px-2 gap-2.5 text-xs bg-grey-50 text-grey-900 rounded-xl hover:bg-grey-100',
        clickableIcon:
          '!h-6 !w-6 !p-1 text-grey-900 rounded-full border border-transparent hover:border-grey-200 hover:bg-grey-100 active:shadow-100',
      },
      size: {
        default: 'h-10 px-4 py-2',
        icon: 'h-10 w-10 !rounded-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot='button'
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
