import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import jwt from 'jsonwebtoken';

import type { Request } from 'express';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const jwtToken = request.headers.authorization?.split(' ')[1];

    const verifiedJwt = jwt.verify(jwtToken, process.env.JWT_SECRET);

    if (!verifiedJwt || !verifiedJwt['role']) {
      return null;
    }

    return {
      id: verifiedJwt.sub,
      role: verifiedJwt['role'],
    };
  },
);
