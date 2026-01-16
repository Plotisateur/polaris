import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UserForm } from 'src/pages/Login/type';
import axios, { baseUrlApi } from '../axios';
import { getHeaders } from '../utils/headers';

const useCreateUserMutation = () => {
  const headers = getHeaders();
  return useMutation({
    mutationFn: async (user: UserForm) => {
      const response = await axios.post(`${baseUrlApi}/api/user/create`, user, {
        headers,
      });

      return response.data;
    },
  });
};

const useUpdateUserMutation = () => {
  const headers = getHeaders();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, user }: { id: string; user: UserForm }) => {
      const response = await axios.put(
        `${baseUrlApi}/api/user/${id}`,
        { ...user },
        {
          headers,
        }
      );

      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(['user']);
    },
  });
};

const useValidateUserMutation = () => {
  const headers = getHeaders();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.put(
        `${baseUrlApi}/api/user/${id}/validate`,
        {},
        {
          headers,
        }
      );

      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(['user']);
    },
  });
};

export { useCreateUserMutation, useValidateUserMutation, useUpdateUserMutation };
