import { cn } from '@/lib/utils';

type SectionProps = {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
};

export default function Section({ children, className, containerClassName }: SectionProps) {
  return (
    <div
      className={cn(
        'w-full flex justify-center max-w-[1200px]', // theme.contentSize.content
        containerClassName
      )}
    >
      <div
        className={cn(
          'w-full max-w-[960px]', // theme.contentSize.section
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}
