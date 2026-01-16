import { ReactNode } from 'react';

export type HeaderProps = {
  title?: string | ReactNode;
  secondaryAction?: ReactNode;
  additionalContent?: ReactNode;
};

export default function Header({ title, secondaryAction, additionalContent }: HeaderProps) {
  return (
    <header className='w-full p-4 bg-primary z-50'>
      <div className='flex justify-between items-center'>
        <h2 className='text-2xl font-medium text-white'>{title}</h2>
        {secondaryAction}
      </div>

      <div>{additionalContent}</div>
    </header>
  );
}
