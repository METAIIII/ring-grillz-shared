import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import _ from 'lodash';

const prisma = new PrismaClient();

async function main() {
  // Drop all records
  await dropAllRecords();

  // Seed Users
  await seedUsers();

  // Seed RingShapes
  await seedRingShapes();

  // Seed RingMaterials
  await seedRingMaterials();

  // Seed GrillzMaterials
  await seedGrillzMaterials();

  // Seed Orders
  await seedOrders();
}

async function dropAllRecords() {
  // Disable foreign key checks, truncate all tables, then re-enable foreign key checks
  await prisma.$executeRaw`
    DO $$ 
    DECLARE
      r RECORD;
    BEGIN
      -- Disable all triggers
      EXECUTE 'SET session_replication_role = replica';
      
      FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'TRUNCATE TABLE ' || quote_ident(r.tablename) || ' CASCADE';
      END LOOP;

      -- Re-enable all triggers
      EXECUTE 'SET session_replication_role = DEFAULT';
    END $$;
  `;
}

async function seedUsers() {
  // Create 1 admin user
  await prisma.user.create({
    data: {
      name: faker.person.fullName(),
      email: process.env.NEXT_PUBLIC_ADMIN_EMAIL,
      phone: faker.phone.number(),
      street: faker.location.streetAddress(),
      suburb: faker.location.city(),
      state: faker.helpers.arrayElement(['WA', 'NT', 'SA', 'QLD', 'NSW', 'VIC', 'TAS', 'ACT']),
      postcode: faker.location.zipCode(),
      role: 'ADMIN',
    },
  });

  // Create 10 customer users
  for (let i = 0; i < 10; i++) {
    await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        street: faker.location.streetAddress(),
        suburb: faker.location.city(),
        state: faker.helpers.arrayElement(['WA', 'NT', 'SA', 'QLD', 'NSW', 'VIC', 'TAS', 'ACT']),
        postcode: faker.location.zipCode(),
        role: 'CUSTOMER',
      },
    });
  }
}

async function seedRingShapes() {
  const shapes = ['Round', 'Square', 'Oval', 'Heart'];
  for (const shape of shapes) {
    await prisma.ringShape.create({
      data: {
        name: shape,
        previewImage: faker.image.url(),
        modelUrl: faker.internet.url(),
        price: faker.number.int({ min: 50, max: 500 }),
      },
    });
  }
}

async function seedRingMaterials() {
  const materials = ['Gold', 'Silver', 'Platinum', 'Rose Gold'];
  for (const material of materials) {
    await prisma.ringMaterial.create({
      data: {
        name: material,
        previewImage: faker.image.url(),
        price: faker.number.int({ min: 100, max: 1000 }),
      },
    });
  }
}

async function seedGrillzMaterials() {
  const materials = ['Chrome', 'Faux Gold', 'Gold', 'Premium'];
  for (const material of materials) {
    const grillzMaterial = await prisma.grillzMaterial.create({
      data: {
        name: material,
        hasOptions: material === 'Gold',
        labourCost: faker.number.int({ min: 50, max: 200 }),
        optionsHeading: material === 'Gold' ? 'Carats' : null,
      },
    });

    if (material === 'Chrome' || material === 'Faux Gold') {
      const variants = ['Polished', 'OpenFace'];
      for (const variant of variants) {
        await prisma.grillzMaterialVariant.create({
          data: {
            name: variant,
            previewImage: faker.image.url(),
            price: faker.number.int({ min: 200, max: 2000 }),
            singleRowOnly: faker.datatype.boolean(),
            baseMaterialId: grillzMaterial.id,
            bgImage: `/img/toothmasks/${_.camelCase(material)}_${_.camelCase(variant)}.jpg`,
          },
        });
      }
    }
    // Create carat options for Gold
    if (material === 'Gold') {
      const variants = ['Polished', 'OpenFace', 'Pineapple'];
      for (const variant of variants) {
        await prisma.grillzMaterialVariant.create({
          data: {
            name: variant,
            previewImage: faker.image.url(),
            price: faker.number.int({ min: 200, max: 2000 }),
            singleRowOnly: faker.datatype.boolean(),
            baseMaterialId: grillzMaterial.id,
            bgImage: `/img/toothmasks/${_.camelCase(material)}_${_.camelCase(variant)}.jpg`,
          },
        });
      }

      const caratOptions = [
        { name: '10K', price: faker.number.int({ min: 100, max: 500 }) },
        { name: '14K', price: faker.number.int({ min: 200, max: 800 }) },
        { name: '18K', price: faker.number.int({ min: 300, max: 1200 }) },
      ];

      for (const option of caratOptions) {
        await prisma.grillzMaterialOption.create({
          data: {
            name: option.name,
            price: option.price,
            baseMaterialId: grillzMaterial.id,
            previewImage: faker.image.url(),
          },
        });
      }
    }

    if (material === 'Premium') {
      const variants = ['Silver', 'Diamond', 'Laser', 'Moissanite', 'White Gold'];
      for (const variant of variants) {
        await prisma.grillzMaterialVariant.create({
          data: {
            name: variant,
            previewImage: faker.image.url(),
            price: faker.number.int({ min: 200, max: 2000 }),
            singleRowOnly: faker.datatype.boolean(),
            baseMaterialId: grillzMaterial.id,
            bgImage: `/img/toothmasks/${_.camelCase(material)}_${_.camelCase(variant)}.jpg`,
          },
        });
      }
    }
  }
}

async function seedOrders() {
  const users = await prisma.user.findMany();
  for (let i = 0; i < 20; i++) {
    const user = faker.helpers.arrayElement(users);
    await prisma.order.create({
      data: {
        status: faker.helpers.arrayElement([
          'UNPAID',
          'PENDING',
          'PAID',
          'SHIPPED',
          'COMPLETED',
          'CANCELED',
        ]),
        type: faker.helpers.arrayElement(['GRILLZ', 'RING']),
        paymentType: faker.helpers.arrayElement(['DEPOSIT', 'FULL_PAYMENT', 'PARTIAL_PAYMENT']),
        paymentAmount: faker.number.int({ min: 100, max: 5000 }),
        email: user.email!,
        phone: user.phone,
        customerNotes: faker.lorem.paragraph(),
        userId: user.id,
        items: {
          create: [
            {
              amount: faker.number.int({ min: 1, max: 5 }),
              metadata: {},
            },
          ],
        },
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
