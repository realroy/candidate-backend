import { config } from 'dotenv';
import { beforeEach } from 'vitest';

config({ path: '.env.test' });

import resetDb from './reset-prisma';

beforeEach(async () => {
  await resetDb();
});
