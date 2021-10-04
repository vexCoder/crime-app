import { Portal } from '@chakra-ui/portal';
import React from 'react';
import { ToastContainer, toast, ToastOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface IToastContextProps {
  children: React.ReactChild[] | React.ReactChild;
}

type ToastFn = Record<
  'error' | 'success' | 'warn',
  (message: string | React.ReactNode, opts?: ToastOptions) => void
>;

interface IToastContextValue {
  toast: ToastFn;
}

interface ToastDefaults {
  defaultMsg?: string | React.ReactNode;
  defaultOpts?: ToastOptions;
}

const initialData: IToastContextValue = {
  toast: {
    success: () => null,
    error: () => null,
    warn: () => null,
  },
};

const ToastContext = React.createContext<IToastContextValue>(initialData);

const ToastProvider: React.FunctionComponent<IToastContextProps> = ({
  children,
}) => {
  const handleToast = ({ defaultMsg, defaultOpts }: ToastDefaults) => {
    return (message: string | React.ReactNode, opts?: ToastOptions) =>
      toast(defaultMsg || message, { ...defaultOpts, ...opts });
  };

  const defaultOptions: ToastOptions = {
    containerId: 'absolute',
    autoClose: 3000,
    pauseOnHover: true,
    draggablePercent: 100,
    style: {
      width: 'auto',
    },
    bodyStyle: {
      fontFamily: 'Montserrat',
      color: 'white',
    },
    progressStyle: {
      margin: '5px',
      width: 'calc(100% - 10px)',
      borderRadius: '5px',
    },
  };

  const tst = {
    success: handleToast({
      defaultOpts: {
        ...defaultOptions,
        type: 'success',
        style: {
          background: '#68D391',
        },
        bodyStyle: {
          color: 'white',
        },
      },
    }),
    error: handleToast({
      defaultOpts: {
        ...defaultOptions,
        type: 'error',
        style: {
          background: '#F56565',
        },
        bodyStyle: {
          color: 'white',
        },
      },
    }),
    warn: handleToast({
      defaultOpts: {
        ...defaultOptions,
        type: 'error',
        style: {
          background: '#F6AD55',
        },
        bodyStyle: {
          color: 'white',
        },
      },
    }),
  };

  return (
    <ToastContext.Provider value={{ toast: tst }}>
      <Portal>
        <ToastContainer />
      </Portal>
      {children}
    </ToastContext.Provider>
  );
};

const useToast = (): ToastFn => {
  const context: IToastContextValue = React.useContext(ToastContext);
  if (context === undefined) {
    throw new Error('Context must be used within a ToastProvider');
  }
  return context.toast;
};

export { ToastProvider, useToast };
