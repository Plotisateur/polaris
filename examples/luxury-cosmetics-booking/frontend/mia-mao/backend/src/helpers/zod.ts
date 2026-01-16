import { extendZodWithOpenApi } from 'zod-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export default z;
