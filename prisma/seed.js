import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clear existing data
  await prisma.completion.deleteMany();
  await prisma.reminder.deleteMany();
  await prisma.pet.deleteMany();

  const browny = await prisma.pet.create({
    data: { name: 'Browny', avatarUrl: null },
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await prisma.reminder.createMany({
    data: [
      {
        petId: browny.id,
        category: 'Lifestyle',
        title: 'Morning Walk',
        notes: null,
        startDate: today,
        startTime: '2:00 pm',
        frequency: 'Everyday',
        isCompleted: false,
      },
      {
        petId: browny.id,
        category: 'Lifestyle',
        title: 'Evening Walk',
        notes: null,
        startDate: today,
        startTime: '2:00 pm',
        frequency: 'Everyday',
        isCompleted: false,
      },
      {
        petId: browny.id,
        category: 'General',
        title: 'Breakfast',
        notes: null,
        startDate: today,
        startTime: '2:00 pm',
        frequency: 'Everyday',
        isCompleted: false,
      },
      {
        petId: browny.id,
        category: 'General',
        title: 'Lunch',
        notes: null,
        startDate: today,
        startTime: '2:00 pm',
        frequency: 'Everyday',
        isCompleted: false,
      },
      {
        petId: browny.id,
        category: 'Health',
        title: 'Vet visit',
        notes: 'Annual checkup',
        startDate: today,
        startTime: '2:00 pm',
        frequency: 'Everyday',
        isCompleted: false,
      },
    ],
  });

  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
