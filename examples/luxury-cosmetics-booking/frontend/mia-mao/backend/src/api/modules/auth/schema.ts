import z from '../../../helpers/zod';
import { initContract } from '@ts-rest/core';

export const schema = z
  .object({
    accessToken: z.string(),
    refreshToken: z.string(),
    expireAt: z.number(),
  })
  .openapi({
    description: 'Auth',
    example: {
      accessToken: '',
      refreshToken: '',
      expireAt: 0,
    },
  });

const contract = initContract();

export const authContract = contract.router({
  login: {
    method: 'GET',
    path: '/api/auth/login',
    responses: {
      200: schema,
    },
  },
});
