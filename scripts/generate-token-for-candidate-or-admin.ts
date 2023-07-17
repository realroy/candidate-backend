import * as jwt from 'jsonwebtoken';
import { config } from 'dotenv';

config();

function main() {
  try {
    const candidateOrAdminId = process.argv[2];
    const role = process.argv[3];

    if (!candidateOrAdminId) {
      throw new Error(
        'Require candidate or admin id! For example node ./scripts/generate-token-for-candidate-or-admin.mjs 911',
      );
    }

    if (!['ADMIN', 'Candidate'].includes(role)) {
      throw new Error(
        'Unsupported role (ADMIN, CADIDATE)! For example node ./scripts/generate-token-for-candidate-or-admin.mjs 911 ADMIN',
      );
    }

    const token = jwt.sign(
      { sub: +candidateOrAdminId, role },
      process.env.JWT_SECRET,
      {
        expiresIn: '15m',
      },
    );

    console.log('generate token successfully 🎉🎉🎉');
    console.log(token);
  } catch (error) {
    console.error(error);
  }
}

main();
