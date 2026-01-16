import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { dataLayerClick } from '../hooks/useDataLayer';

export default function NotFoundPage() {
  const navigate = useNavigate();

  const handleClick = () => {
    dataLayerClick({ type: 'back-homepage', value: 'back-homepage' });
    navigate('/');
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-background'>
      <div className='text-center'>
        <h1 className='text-4xl font-bold mb-4'>404</h1>
        <p className='text-muted-foreground'>We didn&apos;t find what you&apos;re looking for!</p>
        <p className='text-muted-foreground'>The URL you requested was not found</p>
        <div className='mt-10'>
          <Button
            variant='secondary'
            className='hover:bg-white hover:text-secondary-dark'
            onClick={handleClick}
          >
            Back to homepage
          </Button>
        </div>
      </div>
    </div>
  );
}
