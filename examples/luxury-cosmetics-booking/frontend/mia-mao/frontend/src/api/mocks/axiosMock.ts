import axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';
import initLoginMockApi from './modules/login';

const baseUrlMockApi = 'http://localhost:3000';
const axiosMockInstance = axios.create();
const axiosMock = new AxiosMockAdapter(axiosMockInstance, {
  delayResponse: 0,
  onNoMatch: 'passthrough',
});

initLoginMockApi();

export default axiosMockInstance;
export { baseUrlMockApi, axiosMock };
