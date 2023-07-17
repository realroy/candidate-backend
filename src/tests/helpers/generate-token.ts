import * as jwt from 'jsonwebtoken';

import type { CurrentUser } from '../../../src/app.type';

export function generateToken(currentUser: CurrentUser) {
  const token = jwt.sign(
    { sub: +currentUser.id, role: currentUser.role },
    process.env.JWT_SECRET,
    {
      expiresIn: '1d',
    },
  );

  return token;
}
