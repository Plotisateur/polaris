import { ReactComponent as PerimeterIcon } from '../../pages/components/SideBar/icons/perimeter.svg';
import NavigationCard from './Components/NavigationCard';
import PageLayout from '../components/Layout/PageLayout';
import Section from '../components/Layout/Section';
import { Text } from '../../components/ui/text';

export default function Home() {
  return (
    <PageLayout
      headerProps={{
        title: (
          <div className='flex flex-row items-center'>
            <Text variant='h1'>Welcome to L oreal</Text>
          </div>
        ),
      }}
    >
      <Section containerClassName='px-8 py-10'>
        <div className='flex flex-col lg:flex-row gap-8 justify-center lg:justify-start'>
          <div className='flex flex-col gap-4 flex-1 max-w-[616px]'>
            <NavigationCard
              dataLayerType='login'
              dataLayerValue='login'
              icon={<PerimeterIcon width='52' height='52' />}
              title='Login'
              description='Go to login page'
              destination='/login'
            />
          </div>
        </div>
      </Section>
    </PageLayout>
  );
}
