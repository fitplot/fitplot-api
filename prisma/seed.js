const { PrismaClient } = require('@prisma/client');
const dayjs = require('dayjs');

const { generateId } = require('../lib/id');

const prisma = new PrismaClient();

/**
 * Seed script to be run with:
 *
 * ```sh
 * npx prisma db seed
 * ```
 * @see {@link https://www.prisma.io/docs/guides/migrate/seed-database}
 */
async function main() {
  console.log('🌱  Beginning seed.\n');

  console.log('🫂  Creating Users');
  const oliver = await prisma.user.upsert({
    where: { email: 'oliver@prisma.io' },
    update: {},
    create: {
      id: await generateId(),
      email: 'oliver@prisma.io',
      firstName: 'Oliver',
    },
  });
  const athena = await prisma.user.upsert({
    where: { email: 'athena@prisma.io' },
    update: {},
    create: {
      id: await generateId(),
      email: 'athena@prisma.io',
      firstName: 'Athena',
    },
  });
  const winky = await prisma.user.upsert({
    where: { email: 'winky@prisma.io' },
    update: {},
    create: {
      id: await generateId(),
      email: 'winky@prisma.io',
      firstName: 'Winky',
    },
  });
  const users = [oliver, athena, winky];
  console.log(`✅  Created ${users.length} Users`);

  console.log('🏃‍♂️  Creating Workouts');
  await prisma.workout.deleteMany({});
  const workouts = [];
  for (const user of users) {
    const total = Math.floor(Math.random() * 25) + 1;
    let ago = 0;
    for (let number = 1; number <= total; number++) {
      const workout = await prisma.workout.create({
        data: {
          id: await generateId(),
          name: `My Workout ${number}`,
          createdAt: dayjs().subtract(ago, 'day').toDate(),
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      });
      ago += Math.floor(Math.random() * 3) + 2;
      workouts.push(workout);
    }
  }
  console.log(`✅  Created ${workouts.length} Workouts`);

  console.log('🏃‍♂️  Creating Units');
  const pounds = await prisma.amountUnit.upsert({
    where: { delimiter: 'lbs' },
    update: {},
    create: {
      id: await generateId(),
      name: 'Pounds',
      delimiter: 'lbs',
    },
  });
  const kilograms = await prisma.amountUnit.upsert({
    where: { delimiter: 'kgs' },
    update: {},
    create: {
      id: await generateId(),
      name: 'Kilograms',
      delimiter: 'kgs',
    },
  });
  console.log(`✅  Created Units`);

  console.log('🏃‍♂️  Creating Exercises');
  await prisma.exercise.deleteMany({});
  const exercises = [];
  const exercisePrefixes = ['Machine', 'Dumbbell', 'Barbell', 'Cable'];
  const exerciseSuffixes = ['Row', 'Press', 'Curl', 'Extension'];
  for (const user of users) {
    for (const prefix of exercisePrefixes) {
      for (const suffix of exerciseSuffixes) {
        const exercise = await prisma.exercise.create({
          data: {
            id: await generateId(),
            name: `${prefix} ${suffix}`,
            user: {
              connect: {
                id: user.id,
              },
            },
          },
        });
        exercises.push(exercise);
      }
    }
  }
  console.log(`✅  Created ${exercises.length} Exercises`);

  console.log('🏃‍♂️  Creating Sets');
  await prisma.set.deleteMany({});
  const setsToCreate = [];
  for (const user of users) {
    for (const workout of workouts) {
      const numberOfExercises = Math.floor(Math.random() * 4) + 2;
      for (
        let exerciseIndex = 0;
        exerciseIndex < numberOfExercises;
        exerciseIndex++
      ) {
        const numberOfSets = Math.floor(Math.random() * 5) + 1;
        const unit = Math.random() >= 0.5 ? pounds : kilograms;
        const exercise =
          exercises[Math.floor(Math.random() * exercises.length)];
        for (let setIndex = 0; setIndex < numberOfSets; setIndex++) {
          sets.push({
            data: {
              id: await generateId(),
              createdAt: workout.createdAt,
              amount: Math.floor(Math.random() * 39) * 5 + 5,
              volume: Math.floor(Math.random() * 11) + 1,
              user: {
                connect: {
                  id: user.id,
                },
              },
              unit: {
                connect: {
                  id: unit.id,
                },
              },
              exercise: {
                connect: {
                  id: exercise.id,
                },
              },
              workout: {
                connect: {
                  id: workout.id,
                },
              },
            },
          });
        }
      }
    }
  }
  const sets = await prisma.set.createMany({ data: setsToCreate });
  console.log(`✅  Created ${sets.length} Sets`);
}

/* eslint-disable unicorn/prefer-top-level-await */
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();

    /* eslint-disable-next-line unicorn/no-process-exit */
    process.exit(1);
  });
