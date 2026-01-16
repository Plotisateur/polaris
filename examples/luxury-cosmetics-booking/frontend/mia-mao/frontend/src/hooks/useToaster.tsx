import React from 'react';
import { toast as toastifyToast } from 'react-toastify';
import { ReactComponent as SuccessIcon } from '@/shared-components/Feedback/ToastsContainer/icons/success.svg';
import { ReactComponent as ErrorIcon } from '@/shared-components/Feedback/ToastsContainer/icons/error.svg';
import { ReactComponent as InfoIcon } from '@/shared-components/Feedback/ToastsContainer/icons/info.svg';

const toastDefaultOptions = {
  autoClose: 5000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: false,
  progress: undefined,
};

function useToaster() {
  const getToastIcon = React.useCallback((type: 'success' | 'error' | 'info' | 'warning') => {
    switch (type) {
      case 'success':
        return <SuccessIcon />;
      case 'error':
        return <ErrorIcon />;
      default:
        return <InfoIcon />;
    }
  }, []);

  const triggerToast = React.useCallback(
    ({
      message,
      type,
      onClose,
      onClick,
      duration,
      icon,
    }: {
      message: string | React.ReactNode;
      type: 'success' | 'error' | 'info' | 'warning';
      onClose?: () => void;
      onClick?: () => void;
      duration?: number;
      icon?: React.ReactNode;
    }) => {
      toastifyToast(message, {
        type,
        position: 'bottom-right',
        icon: icon || getToastIcon(type),
        onClose,
        onClick,
        ...toastDefaultOptions,
        autoClose: duration ?? toastDefaultOptions.autoClose,
      });
    },
    []
  );

  return triggerToast;
}

export default useToaster;
