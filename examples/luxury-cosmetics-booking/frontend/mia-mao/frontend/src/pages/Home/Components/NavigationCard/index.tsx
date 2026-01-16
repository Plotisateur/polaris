import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { dataLayerClick } from '../../../../hooks/useDataLayer';
import { Text } from '../../../../components/ui/text';

interface NavigationCardProps {
  dataLayerType?: string;
  dataLayerValue?: string;
  icon: ReactNode;
  title: string;
  description?: string;
  destination?: string;
  buttonProps?: any;
}

export default function NavigationCard({
  dataLayerType,
  dataLayerValue,
  icon,
  title,
  description,
  destination,
  buttonProps,
}: NavigationCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (dataLayerType && dataLayerValue) {
      dataLayerClick({ type: dataLayerType, value: dataLayerValue });
    }
    if (destination) {
      navigate(destination);
    }
    if (buttonProps?.onClick) {
      buttonProps.onClick();
    }
  };

  return (
    <Button
      variant='ghost'
      className='w-full p-0 h-auto hover:bg-transparent'
      onClick={handleClick}
      {...buttonProps}
    >
      <Card className='w-full hover:bg-accent transition-colors'>
        <CardHeader>
          <div className='flex items-center gap-4'>
            {icon}
            <div className='flex flex-col items-start'>
              <Text variant='h3'>{title}</Text>
              {description && <Text variant='subtitle-14'>{description}</Text>}
            </div>
          </div>
        </CardHeader>
      </Card>
    </Button>
  );
}
