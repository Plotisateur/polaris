import { useLocation } from 'react-router-dom';
import React from 'react';
import { dataLayerPageView } from '../../../hooks/useDataLayer';
import SideBar from '../SideBar/SideBar';
import Header, { HeaderProps } from './Header';
import Footer from './Footer';
import { useAuthCookies } from '../../../hooks/useAuthCookies';
import { cn } from '../../../lib/utils';

type PageLayoutType = {
  children?: React.ReactNode;
  headerProps?: HeaderProps;
  className?: string;
};

export default function PageLayout({ children, headerProps, className }: PageLayoutType) {
  const location = useLocation();
  const { isExist } = useAuthCookies();

  React.useEffect(() => {
    if (isExist('gcpiapuserid')) {
      dataLayerPageView();
    }
  }, [location]);

  return (
    <div className='grid w-full max-w-[100vw] min-h-screen bg-zinc-50'>
      <div className='grid grid-cols-[240px_1fr]'>
        <SideBar />
        <div
          className={cn(
            'grid grid-cols-1 grid-rows-[minmax(148px,auto)_1fr] bg-zinc-50 max-w-[1200px]',
            className
          )}
        >
          <Header {...headerProps} />
          {children}
          <Footer />
        </div>
      </div>
    </div>
  );
}
