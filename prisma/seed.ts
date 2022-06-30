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
            price: 10000,
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
            price: 10000,
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
            price: 5000,
            singleRowOnly: false,
          },
          {
            name: 'Pineapple',
            previewImage: '/img/examples/gold_pineapple.jpg',
            toothBgImage: '/img/toothmasks/gold_pineapple.jpg',
            price: 2500,
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
            price: 5000,
            singleRowOnly: false,
          },
          {
            name: 'White Gold',
            previewImage: '/img/examples/premium_whiteGold.jpg',
            toothBgImage: '/img/toothmasks/premium_whiteGold.jpg',
            price: 20000,
            singleRowOnly: false,
          },
          {
            name: 'LV',
            previewImage: '/img/examples/premium_LV.jpg',
            toothBgImage: '/img/toothmasks/premium_LV.jpg',
            price: 25000,
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
      previewImage:
        'https://res.cloudinary.com/meta-iiii/image/upload/v1653665067/ring-kingz/material_gold_cpwubk.png',
    },
  });
  const silverMaterial = await prisma.ringMaterial.create({
    data: {
      name: 'Silver',
      baseColor: '#C0C0C0',
      metallic: '1',
      roughness: '0.01',
      price: 15000,
      previewImage:
        'https://res.cloudinary.com/meta-iiii/image/upload/v1653665067/ring-kingz/material_silver_yhgept.png',
    },
  });
  const whiteGoldMaterial = await prisma.ringMaterial.create({
    data: {
      name: 'White Gold',
      baseColor: '#FFFDD1',
      metallic: '1',
      roughness: '0.05',
      price: 25000,
      previewImage:
        'https://res.cloudinary.com/meta-iiii/image/upload/v1653665068/ring-kingz/material_whitegold_jqrqmq.png',
    },
  });

  await prisma.ringShape.create({
    data: {
      order: 0,
      name: 'Simple',
      previewImage:
        'https://res.cloudinary.com/meta-iiii/image/upload/v1645433213/ring-kingz/simple_preview_eu8jqa.png',

      modelUrl:
        'https://res.cloudinary.com/meta-iiii/image/upload/v1653665441/ring-kingz/simple_uagu58.glb',
      price: 10000,
      materials: {
        connect: [
          { id: goldMaterial.id },
          { id: silverMaterial.id },
          { id: whiteGoldMaterial.id },
        ],
      },
    },
  });

  await prisma.ringShape.create({
    data: {
      order: 1,
      name: 'Circle',
      previewImage:
        'https://res.cloudinary.com/meta-iiii/image/upload/v1645433213/ring-kingz/circle_preview_e37hn6.png',
      modelUrl:
        'https://res.cloudinary.com/meta-iiii/image/upload/v1656337889/ring-kingz/circle_bftrlt.glb',
      price: 15000,
      materials: {
        connect: [
          { id: goldMaterial.id },
          { id: silverMaterial.id },
          { id: whiteGoldMaterial.id },
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
      modelUrl:
        'https://res.cloudinary.com/meta-iiii/image/upload/v1653665976/ring-kingz/oval_o6uppq.glb',
      price: 15000,
      materials: {
        connect: [
          { id: goldMaterial.id },
          { id: silverMaterial.id },
          { id: whiteGoldMaterial.id },
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
      modelUrl:
        'https://res.cloudinary.com/meta-iiii/image/upload/v1656336773/ring-kingz/square_spbrpk.glb',
      price: 15000,
      materials: {
        connect: [
          { id: goldMaterial.id },
          { id: silverMaterial.id },
          { id: whiteGoldMaterial.id },
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
      modelUrl: '',
      price: 15000,
      materials: {
        connect: [
          { id: goldMaterial.id },
          { id: silverMaterial.id },
          { id: whiteGoldMaterial.id },
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
      modelUrl:
        'https://res.cloudinary.com/meta-iiii/image/upload/v1653665980/ring-kingz/hexagon_lthcrl.glb',
      price: 15000,
      materials: {
        connect: [
          { id: goldMaterial.id },
          { id: silverMaterial.id },
          { id: whiteGoldMaterial.id },
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
