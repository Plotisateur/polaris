import { axiosMock, baseUrlMockApi } from '../../mocks/axiosMock';

const login = {
  id: 'wUPiqJkdpQvHVebrNuRi',
  rights: [],
  email: 'mock.user@loreal.com',
};
const initLoginMockApi = () => {
  const baseUrl = `${baseUrlMockApi}/api/auth/login`;
  const url = new RegExp(`${baseUrl}*`);
  axiosMock.onGet(url).reply(200, login);
};

export default initLoginMockApi;
