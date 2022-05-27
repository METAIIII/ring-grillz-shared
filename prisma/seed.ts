import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // DR GRILLZ
  await prisma.teethMaterial.create({
    data: {
      name: 'Chrome',
      hasOptions: false,
      labourCost: 40000,
      variants: {
        create: [
          {
            name: 'Polished',
            previewImage: '/img/examples/chrome_polished.jpg',
            toothBgImage: '/img/toothmasks/chrome_polished.jpg',
            price: 5000,
            singleRowOnly: true,
          },
          {
            name: 'Open-Face',
            previewImage: '/img/examples/chrome_openFace.jpg',
            toothBgImage: '/img/toothmasks/chrome_polished.jpg',
            price: 5000,
            singleRowOnly: true,
          },
        ],
      },
    },
  });

  await prisma.teethMaterial.create({
    data: {
      name: 'Faux Gold',
      hasOptions: false,
      labourCost: 40000,
      variants: {
        create: [
          {
            name: 'Polished',
            previewImage: '/img/examples/fauxGold_polished.jpg',
            toothBgImage: '/img/toothmasks/fauxGold_polished.jpg',
            price: 5000,
            singleRowOnly: true,
          },
          {
            name: 'Open-Face',
            previewImage: '/img/examples/fauxGold_openFace.jpg',
            toothBgImage: '/img/toothmasks/fauxGold_polished.jpg',
            price: 5000,
            singleRowOnly: true,
          },
        ],
      },
    },
  });

  await prisma.teethMaterial.create({
    data: {
      name: 'Gold',
      hasOptions: true,
      labourCost: 30000,
      variants: {
        create: [
          {
            name: 'Polished',
            previewImage: '/img/examples/gold_polished.jpg',
            toothBgImage: '/img/toothmasks/gold_polished.jpg',
            price: 0,
            singleRowOnly: false,
          },
          {
            name: 'Open-Face',
            previewImage: '/img/examples/gold_openFace.jpg',
            toothBgImage: '/img/toothmasks/gold_polished.jpg',
            price: 0,
            singleRowOnly: false,
          },
          {
            name: 'Pineapple',
            previewImage: '/img/examples/gold_pineapple.jpg',
            toothBgImage: '/img/toothmasks/gold_pineapple.jpg',
            price: 0,
            singleRowOnly: false,
          },
        ],
      },
      options: {
        create: [
          {
            name: '10k',
            previewImage: '/img/examples/gold_polished_10k.jpg',
            price: 15000,
          },
          {
            name: '14k',
            previewImage: '/img/examples/gold_polished_14k.jpg',
            price: 20000,
          },
          {
            name: '18k',
            previewImage: '/img/examples/gold_polished_18k.jpg',
            price: 25000,
          },
        ],
      },
    },
  });

  await prisma.teethMaterial.create({
    data: {
      name: 'Premium',
      hasOptions: false,
      labourCost: 30000,
      variants: {
        create: [
          {
            name: 'Silver',
            previewImage: '/img/examples/premium_silver.jpg',
            toothBgImage: '/img/toothmasks/premium_silver.jpg',
            price: 10000,
            singleRowOnly: false,
          },
          {
            name: 'White Gold',
            previewImage: '/img/examples/premium_whiteGold.jpg',
            toothBgImage: '/img/toothmasks/premium_whiteGold.jpg',
            price: 10000,
            singleRowOnly: false,
          },
          {
            name: 'LV',
            previewImage: '/img/examples/premium_LV.jpg',
            toothBgImage: '/img/toothmasks/premium_LV.jpg',
            price: 10000,
            singleRowOnly: false,
          },
          {
            name: 'CZ',
            previewImage: '/img/examples/premium_CZ.jpg',
            toothBgImage: '/img/toothmasks/premium_diamond.jpg',
            price: 80000,
            singleRowOnly: false,
          },
          {
            name: 'Diamond',
            previewImage: '/img/examples/premium_diamond.jpg',
            toothBgImage: '/img/toothmasks/premium_diamond.jpg',
            price: 120000,
            singleRowOnly: false,
          },
        ],
      },
    },
  });

  // RING KINGZ
  const goldMaterial = await prisma.ringMaterial.create({
    data: {
      name: 'Gold 14k',
      baseColor: '#FFD700',
      metallic: '1',
      roughness: '0.01',
      price: 35000,
    },
  });
  const silverMaterial = await prisma.ringMaterial.create({
    data: {
      name: 'Silver',
      baseColor: '#C0C0C0',
      metallic: '1',
      roughness: '0.01',
      price: 15000,
    },
  });
  const whiteGoldMaterial = await prisma.ringMaterial.create({
    data: {
      name: 'White Gold',
      baseColor: '#FFFDD1',
      metallic: '1',
      roughness: '0.2',
      price: 25000,
    },
  });

  await prisma.ringShape.create({
    data: {
      order: 0,
      name: 'Simple',
      previewImage:
        'https://res.cloudinary.com/meta-iiii/image/upload/v1645433213/ring-kingz/simple_preview_eu8jqa.png',
      variants: {
        create: {
          name: 'Lasered Band',
          modelUrl:
            'https://res.cloudinary.com/meta-iiii/image/upload/v1650814386/ring-kingz/simple_iqyexa.glb',
          previewImage:
            'https://res.cloudinary.com/meta-iiii/image/upload/v1650965822/ring-kingz/simplelaser_s9s1j3.jpg',
          hasEngraving: true,
          hasJewels: false,
          price: 10000,
          materials: {
            connect: [
              { id: goldMaterial.id },
              { id: silverMaterial.id },
              { id: whiteGoldMaterial.id },
            ],
          },
        },
      },
    },
  });

  await prisma.ringShape.create({
    data: {
      order: 1,
      name: 'Circle',
      previewImage:
        'https://res.cloudinary.com/meta-iiii/image/upload/v1645433213/ring-kingz/circle_preview_e37hn6.png',
      variants: {
        create: [
          {
            name: 'Circle 1-Face',
            modelUrl:
              'https://res.cloudinary.com/meta-iiii/image/upload/v1653139626/ring-kingz/circle_mwwm0d.glb',
            previewImage:
              'https://res.cloudinary.com/meta-iiii/image/upload/v1650965821/ring-kingz/circle_yllez1.jpg',
            hasEngraving: true,
            hasJewels: false,
            price: 15000,
            materials: {
              connect: [
                { id: goldMaterial.id },
                { id: silverMaterial.id },
                { id: whiteGoldMaterial.id },
              ],
            },
          },
          {
            name: 'Circle 3-Face',
            modelUrl:
              'https://res.cloudinary.com/meta-iiii/image/upload/v1653139626/ring-kingz/circle_mwwm0d.glb',
            previewImage: '',
            hasEngraving: true,
            hasJewels: false,
            price: 17500,
            materials: {
              connect: [
                { id: goldMaterial.id },
                { id: silverMaterial.id },
                { id: whiteGoldMaterial.id },
              ],
            },
          },
        ],
      },
    },
  });

  await prisma.ringShape.create({
    data: {
      order: 2,
      name: 'Oval',
      previewImage:
        'https://res.cloudinary.com/meta-iiii/image/upload/v1645433212/ring-kingz/oval_preview_lquccc.png',
      variants: {
        create: [
          {
            name: 'Oval 1-Face',
            modelUrl:
              'https://res.cloudinary.com/meta-iiii/image/upload/v1645437638/ring-kingz/oval_khuiy1.glb',
            previewImage: '',
            hasEngraving: true,
            hasJewels: false,
            price: 15000,
            materials: {
              connect: [
                { id: goldMaterial.id },
                { id: silverMaterial.id },
                { id: whiteGoldMaterial.id },
              ],
            },
          },
          {
            name: 'Oval 3-Face',
            modelUrl:
              'https://res.cloudinary.com/meta-iiii/image/upload/v1645437638/ring-kingz/oval_khuiy1.glb',
            previewImage: '',
            hasEngraving: true,
            hasJewels: false,
            price: 17500,
            materials: {
              connect: [
                { id: goldMaterial.id },
                { id: silverMaterial.id },
                { id: whiteGoldMaterial.id },
              ],
            },
          },
        ],
      },
    },
  });

  await prisma.ringShape.create({
    data: {
      order: 3,
      name: 'Square',
      previewImage:
        'https://res.cloudinary.com/meta-iiii/image/upload/v1645433212/ring-kingz/square_preview_v3vtek.png',
      variants: {
        create: [
          {
            name: 'Square 1-Face',
            modelUrl:
              'https://res.cloudinary.com/meta-iiii/image/upload/v1650814386/ring-kingz/square_ctfgmh.glb',
            previewImage:
              'https://res.cloudinary.com/meta-iiii/image/upload/v1650965821/ring-kingz/square1_sp9vrh.jpg',
            hasEngraving: true,
            hasJewels: false,
            price: 15000,
            materials: {
              connect: [
                { id: goldMaterial.id },
                { id: silverMaterial.id },
                { id: whiteGoldMaterial.id },
              ],
            },
          },
          {
            name: 'Square 3-Face',
            modelUrl:
              'https://res.cloudinary.com/meta-iiii/image/upload/v1650814386/ring-kingz/square_ctfgmh.glb',
            previewImage: '',
            hasEngraving: true,
            hasJewels: false,
            price: 17500,
            materials: {
              connect: [
                { id: goldMaterial.id },
                { id: silverMaterial.id },
                { id: whiteGoldMaterial.id },
              ],
            },
          },
        ],
      },
    },
  });

  await prisma.ringShape.create({
    data: {
      order: 4,
      name: 'Cushion',
      previewImage:
        'https://res.cloudinary.com/meta-iiii/image/upload/v1645433214/ring-kingz/cushion_preview_pjozyi.png',
      variants: {
        create: [
          {
            name: 'Cushion 1-Face',
            modelUrl:
              'https://res.cloudinary.com/meta-iiii/image/upload/v1645437634/ring-kingz/cushion_cvik9x.glb',
            previewImage: '',
            hasEngraving: true,
            hasJewels: false,
            price: 15000,
            materials: {
              connect: [
                { id: goldMaterial.id },
                { id: silverMaterial.id },
                { id: whiteGoldMaterial.id },
              ],
            },
          },
          {
            name: 'Cushion 3-Face',
            modelUrl:
              'https://res.cloudinary.com/meta-iiii/image/upload/v1645437634/ring-kingz/cushion_cvik9x.glb',
            previewImage: '',
            hasEngraving: true,
            hasJewels: false,
            price: 17500,
            materials: {
              connect: [
                { id: goldMaterial.id },
                { id: silverMaterial.id },
                { id: whiteGoldMaterial.id },
              ],
            },
          },
        ],
      },
    },
  });

  await prisma.ringShape.create({
    data: {
      order: 5,
      name: 'Hexagon',
      previewImage:
        'https://res.cloudinary.com/meta-iiii/image/upload/v1645433213/ring-kingz/hexagon_preview_isy00x.png',
      variants: {
        create: [
          {
            name: 'Hexagon 1-Face',
            modelUrl:
              'https://res.cloudinary.com/meta-iiii/image/upload/v1645437635/ring-kingz/hexagon_fqhqkd.glb',
            previewImage: '',
            hasEngraving: true,
            hasJewels: false,
            price: 15000,
            materials: {
              connect: [
                { id: goldMaterial.id },
                { id: silverMaterial.id },
                { id: whiteGoldMaterial.id },
              ],
            },
          },
          {
            name: 'Hexagon 3-Face',
            modelUrl:
              'https://res.cloudinary.com/meta-iiii/image/upload/v1645437635/ring-kingz/hexagon_fqhqkd.glb',
            previewImage: '',
            hasEngraving: true,
            hasJewels: false,
            price: 17500,
            materials: {
              connect: [
                { id: goldMaterial.id },
                { id: silverMaterial.id },
                { id: whiteGoldMaterial.id },
              ],
            },
          },
        ],
      },
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
