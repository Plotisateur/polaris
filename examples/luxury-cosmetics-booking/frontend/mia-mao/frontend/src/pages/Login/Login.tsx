import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/');
  };

  return (
    <div className='grid h-screen w-full place-items-center bg-primary'>
      <Button variant='primary' onClick={handleLogin}>
        Login
      </Button>
    </div>
  );
}
