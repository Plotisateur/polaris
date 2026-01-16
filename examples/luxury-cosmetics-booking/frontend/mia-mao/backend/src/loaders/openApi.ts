import { initContract } from '@ts-rest/core';
import { authContract } from '../api/modules/auth/schema';

const contract = initContract();
export const openapiContract = contract.router({
  auth: authContract,
});
