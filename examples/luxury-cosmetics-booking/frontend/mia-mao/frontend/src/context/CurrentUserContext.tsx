import React from 'react';
import { UserResponse } from '@/api/type/user';
import { useAuthCookies } from '@/hooks/useAuthCookies';

export type ContextValues = {
  user: UserResponse | null;
  isLoading: boolean;
};

export type CurrentUserContextType = ContextValues & {
  updateViewType?: (type: string) => void;
};

export const CurrentUserContext = React.createContext<CurrentUserContextType>({
  user: null,
  isLoading: false,
});

export const CurrentUserProvider = ({ children }: { children: React.ReactNode }) => {
  const [values, setValues] = React.useState<Omit<ContextValues, 'isLoading'>>({
    user: null,
  });

  const { setCookie, getCookie, deleteCookie } = useAuthCookies();

  // TO DO: Guarded route - Get current user from backend
  // const { data, isFetching, isLoading, isInitialLoading } = useQuery<CurrentUserResponse>({
  //   queryKey: ['user/currentUser'],
  //   enabled: isAuthenticated && !isRefreshing,
  // });

  // TO DO: Guarded route - We mocked the data just to make the file work but it needs to be replaced by the above code
  const data = { id: '4', email: 'mia.nsarkhneisser@loreal.com', name: 'Mia khneisser' };
  const isFetching = false;
  const isLoading = false;
  const isInitialLoading = false;

  const updateViewType = () => {
    setValues({
      ...values,
    });
  };

  React.useEffect(() => {
    if (data) {
      // TO DO: Guarded route - Uncomment below code once we remove all mocking data
      // setValues({
      //   ...values,
      //   user: data,
      // });

      if (!getCookie('userid') || getCookie('userid') !== data.id) {
        setCookie('userid', data.id);
      }
    }
  }, [data]);

  React.useEffect(() => {
    if (values?.user) {
      // TO DO: Guarded route - Uncomment below code once we remove all mocking data
      // setValues({
      //   ...values,
      //   user: null,
      // });
      deleteCookie('userid');
    }
  }, []);

  const providerValues = React.useMemo(
    () => ({
      ...values,
      updateViewType,
      isLoading: isFetching || isLoading || isInitialLoading,
    }),
    [values, updateViewType, isFetching, isLoading, isInitialLoading]
  );

  return (
    <CurrentUserContext.Provider value={providerValues}>{children}</CurrentUserContext.Provider>
  );
};

export default CurrentUserContext;
