import axios from 'axios';
import axiosMockInstance from '../api/mocks/axiosMock';

const baseUrlApi = import.meta.env.VITE_ENV === 'development' ? 'http://localhost:3000' : '';

export { baseUrlApi };
export default import.meta.env.VITE_AXIOS_MOCK ? axiosMockInstance : axios.create();
