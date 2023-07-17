import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.admin.upsert({
    where: {
      email: 'user1@robinhood.co.th',
    },
    update: {},
    create: {
      name: 'โรบินฮู้ด',
      email: 'user1@robinhood.co.th',
    },
  });

  const candidate1 = await prisma.candidate.upsert({
    where: {
      name: 'แบทแมน',
    },
    update: {},
    create: {
      name: 'แบทแมน',
    },
  });

  const candidate2 = await prisma.candidate.upsert({
    where: {
      name: 'แคทวูแมน',
    },
    update: {},
    create: {
      name: 'แคทวูแมน',
    },
  });

  const appointmentIds = [];

  for (const i in Array.from({ length: 21 }, (_, i) => i)) {
    const appointment = await prisma.appointment.upsert({
      select: {
        id: true,
      },
      where: {
        name: `นัดสัมภาษณ์งาน #${i + 1}`,
      },
      update: {},
      create: {
        name: `นัดสัมภาษณ์งาน #${i + 1}`,
        description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
        creatorId: admin.id,
      },
    });

    appointmentIds.push(appointment.id);
  }

  for (const i in appointmentIds.keys()) {
    const appointmentId = appointments[i];

    const commentCount = await prisma.comment.count({
      where: { appointmentId },
    });

    if (commentCount > 0) {
      continue;
    }

    await prisma.comment.createMany({
      data: [
        {
          appointmentId,
          text: `ment #1`,
          commentOwnableType: 'Candidate',
          commentOwnableId: candidate1.id,
        },
        {
          appointmentId,
          text: `ment #2`,
          commentOwnableType: 'Candidate',
          commentOwnableId: candidate2.id,
        },
        {
          appointmentId,
          text: `ment #3`,
          commentOwnableType: 'Candidate',
          commentOwnableId: candidate1.id,
        },
      ],
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log('db seed successfull');
  })
  .catch(async (e) => {
    console.error('db seed failed', e);
    await prisma.$disconnect();
    process.exit(1);
  });
