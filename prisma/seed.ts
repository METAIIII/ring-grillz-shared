import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // DELETE ALL DATA
  await prisma.user.deleteMany();
  await prisma.session.deleteMany();
  await prisma.order.deleteMany();
  await prisma.lineItem.deleteMany();
  await prisma.grillzMaterial.deleteMany();
  await prisma.grillzMaterialOption.deleteMany();
  await prisma.grillzMaterialVariant.deleteMany();
  await prisma.ringEngraving.deleteMany();
  await prisma.ringEngravingPreset.deleteMany();
  await prisma.ringShape.deleteMany();
  await prisma.ringShapeExample.deleteMany();
  await prisma.ringMaterial.deleteMany();

  // Users
  await prisma.user.create({
    data: {
      name: 'Maheer',
      email: 'info@drgrillz.com',
      role: 'ADMIN',
    },
  });
  await prisma.user.create({
    data: {
      name: 'IIII ADMIN',
      email: 'dev@metaiiii.online',
      role: 'ADMIN',
    },
  });
  await prisma.user.create({
    data: {
      name: 'IIII USER',
      email: 'jai@metaiiii.online',
      role: 'CUSTOMER',
    },
  });

  // DR GRILLZ
  await prisma.grillzMaterial.create({
    data: {
      name: 'Chrome',
      hasOptions: false,
      labourCost: 40000,
      variants: {
        create: [
          {
            name: 'Polished',
            previewImage: '/img/examples/chrome_polished.jpg',
            bgImage: '/img/toothmasks/chrome_polished.jpg',
            price: 5000,
            singleRowOnly: true,
          },
          {
            name: 'Open-Face',
            previewImage: '/img/examples/chrome_openFace.jpg',
            bgImage: '/img/toothmasks/chrome_polished.jpg',
            price: 10000,
            singleRowOnly: true,
          },
        ],
      },
    },
  });

  await prisma.grillzMaterial.create({
    data: {
      name: 'Faux Gold',
      hasOptions: false,
      labourCost: 40000,
      variants: {
        create: [
          {
            name: 'Polished',
            previewImage: '/img/examples/fauxGold_polished.jpg',
            bgImage: '/img/toothmasks/fauxGold_polished.jpg',
            price: 5000,
            singleRowOnly: true,
          },
          {
            name: 'Open-Face',
            previewImage: '/img/examples/fauxGold_openFace.jpg',
            bgImage: '/img/toothmasks/fauxGold_polished.jpg',
            price: 10000,
            singleRowOnly: true,
          },
        ],
      },
    },
  });

  await prisma.grillzMaterial.create({
    data: {
      name: 'Gold',
      hasOptions: true,
      labourCost: 30000,
      variants: {
        create: [
          {
            name: 'Polished',
            previewImage: '/img/examples/gold_polished.jpg',
            bgImage: '/img/toothmasks/gold_polished.jpg',
            price: 0,
            singleRowOnly: false,
          },
          {
            name: 'Open-Face',
            previewImage: '/img/examples/gold_openFace.jpg',
            bgImage: '/img/toothmasks/gold_polished.jpg',
            price: 5000,
            singleRowOnly: false,
          },
          {
            name: 'Pineapple',
            previewImage: '/img/examples/gold_pineapple.jpg',
            bgImage: '/img/toothmasks/gold_pineapple.jpg',
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

  await prisma.grillzMaterial.create({
    data: {
      name: 'Premium',
      hasOptions: false,
      labourCost: 30000,
      variants: {
        create: [
          {
            name: 'Silver',
            previewImage: '/img/examples/premium_silver.jpg',
            bgImage: '/img/toothmasks/premium_silver.jpg',
            price: 5000,
            singleRowOnly: false,
          },
          {
            name: 'White Gold',
            previewImage: '/img/examples/premium_whiteGold.jpg',
            bgImage: '/img/toothmasks/premium_whiteGold.jpg',
            price: 20000,
            singleRowOnly: false,
          },
          {
            name: 'LV',
            previewImage: '/img/examples/premium_LV.jpg',
            bgImage: '/img/toothmasks/premium_LV.jpg',
            price: 25000,
            singleRowOnly: false,
          },
          {
            name: 'CZ',
            previewImage: '/img/examples/premium_CZ.jpg',
            bgImage: '/img/toothmasks/premium_diamond.jpg',
            price: 80000,
            singleRowOnly: false,
          },
          {
            name: 'Diamond',
            previewImage: '/img/examples/premium_diamond.jpg',
            bgImage: '/img/toothmasks/premium_diamond.jpg',
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

  const simpleRing = await prisma.ringShape.create({
    data: {
      order: 0,
      name: 'Simple',
      previewImage:
        'https://res.cloudinary.com/meta-iiii/image/upload/v1645433213/ring-kingz/simple_preview_eu8jqa.png',
      modelUrl:
        'https://res.cloudinary.com/meta-iiii/image/upload/v1668182786/ring-kingz/simple_escj8e.glb',
      templateFront:
        'https://res.cloudinary.com/meta-iiii/image/upload/v1668182745/ring-kingz/SIMPLE_FRONT_ohbkyt.png',
      price: 10000,
      materials: {
        connect: [{ id: goldMaterial.id }, { id: silverMaterial.id }, { id: whiteGoldMaterial.id }],
      },
    },
  });

  const squareRing = await prisma.ringShape.create({
    data: {
      order: 1,
      name: 'Circle',
      previewImage:
        'https://res.cloudinary.com/meta-iiii/image/upload/v1645433213/ring-kingz/circle_preview_e37hn6.png',
      modelUrl:
        'https://res.cloudinary.com/meta-iiii/image/upload/v1656265643/ring-kingz/circle_i2pe5h.glb',
      price: 15000,
      materials: {
        connect: [{ id: goldMaterial.id }, { id: silverMaterial.id }, { id: whiteGoldMaterial.id }],
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
        connect: [{ id: goldMaterial.id }, { id: silverMaterial.id }, { id: whiteGoldMaterial.id }],
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
        'https://res.cloudinary.com/meta-iiii/image/upload/v1668182786/ring-kingz/square_bv84mr.glb',
      templateFront:
        'https://res.cloudinary.com/meta-iiii/image/upload/v1668182745/ring-kingz/SQUARE_FRONT_pvvhyu.png',
      templateInner: '',
      templateSide1:
        'https://res.cloudinary.com/meta-iiii/image/upload/v1668182746/ring-kingz/SQUARE_SIDE1_il19i3.png',
      templateSide2:
        'https://res.cloudinary.com/meta-iiii/image/upload/v1668182746/ring-kingz/SQUARE_SIDE2_kopits.png',
      price: 15000,
      materials: {
        connect: [{ id: goldMaterial.id }, { id: silverMaterial.id }, { id: whiteGoldMaterial.id }],
      },
    },
  });

  const circleRing = await prisma.ringShape.create({
    data: {
      order: 2,
      name: 'Circle',
      previewImage:
        'https://res.cloudinary.com/meta-iiii/image/upload/v1645433213/ring-kingz/circle_preview_e37hn6.png',
      modelUrl:
        'https://res.cloudinary.com/meta-iiii/image/upload/v1668182790/ring-kingz/circle_ronjlb.glb',
      templateFront:
        'https://res.cloudinary.com/meta-iiii/image/upload/v1668182744/ring-kingz/CIRCLE_FRONT_j0fcjs.png',
      templateInner: '',
      templateSide1:
        'https://res.cloudinary.com/meta-iiii/image/upload/v1668182745/ring-kingz/CIRCLE_SIDE1_rb27b7.png',
      templateSide2:
        'https://res.cloudinary.com/meta-iiii/image/upload/v1668182745/ring-kingz/CIRCLE_SIDE2_z4v1m5.png',
      price: 15000,
      materials: {
        connect: [{ id: goldMaterial.id }, { id: silverMaterial.id }, { id: whiteGoldMaterial.id }],
      },
    },
  });

  const bigCircleRing = await prisma.ringShape.create({
    data: {
      order: 3,
      name: 'Big Circle',
      previewImage:
        'https://res.cloudinary.com/meta-iiii/image/upload/v1645433212/ring-kingz/oval_preview_lquccc.png',
      modelUrl:
        'https://res.cloudinary.com/meta-iiii/image/upload/v1668182781/ring-kingz/bigcircle_mnd637.glb',
      templateFront:
        'https://res.cloudinary.com/meta-iiii/image/upload/v1668182744/ring-kingz/BIGCIRCLE_FRONT_jzj0ie.png',
      templateSide1:
        'https://res.cloudinary.com/meta-iiii/image/upload/v1668182745/ring-kingz/BIGCIRCLE_SIDE1_xtuvbc.png',
      templateSide2:
        'https://res.cloudinary.com/meta-iiii/image/upload/v1668182744/ring-kingz/BIGCIRCLE_SIDE2_bzivtd.png',
      price: 20000,
      materials: {
        connect: [{ id: goldMaterial.id }, { id: silverMaterial.id }, { id: whiteGoldMaterial.id }],
      },
    },
  });

  // await prisma.ringShape.create({
  //   data: {
  //     order: 4,
  //     name: 'Cushion',
  //     previewImage:
  //       'https://res.cloudinary.com/meta-iiii/image/upload/v1645433214/ring-kingz/cushion_preview_pjozyi.png',
  //     modelUrl: '',
  //     price: 15000,
  //     materials: {
  //       connect: [
  //         { id: goldMaterial.id },
  //         { id: silverMaterial.id },
  //         { id: whiteGoldMaterial.id },
  //       ],
  //     },
  //   },
  // });

  const hexagonRing = await prisma.ringShape.create({
    data: {
      order: 5,
      name: 'Hexagon',
      previewImage:
        'https://res.cloudinary.com/meta-iiii/image/upload/v1645433213/ring-kingz/hexagon_preview_isy00x.png',
      modelUrl:
        'https://res.cloudinary.com/meta-iiii/image/upload/v1668182800/ring-kingz/hexagon_ifmqjc.glb',
      price: 15000,
      templateFront:
        'https://res.cloudinary.com/meta-iiii/image/upload/v1668182746/ring-kingz/HEXAGON_FRONT_ivkmhz.png',
      templateSide1:
        'https://res.cloudinary.com/meta-iiii/image/upload/v1668182746/ring-kingz/HEXAGON_SIDE1_uarrg2.png',
      templateSide2:
        'https://res.cloudinary.com/meta-iiii/image/upload/v1668182745/ring-kingz/HEXAGON_SIDE2_hx0zxz.png',
      materials: {
        connect: [{ id: goldMaterial.id }, { id: silverMaterial.id }, { id: whiteGoldMaterial.id }],
      },
    },
  });

  // Simple band ring
  const simpleRingID = { id: simpleRing.id };

  // Rings with a big flat face (e.g. square, circle, hexagon)
  const signetRingIDs = [squareRing, circleRing, bigCircleRing, hexagonRing].map((ring) => ({
    id: ring.id,
  }));

  // Simple Presets
  await prisma.ringEngravingPreset.create({
    data: {
      name: 'One Ring',
      imageUrl:
        'https://res.cloudinary.com/meta-iiii/image/upload/v1668172190/ring-kingz-presets/innerfront_lotr_lqinr6.png',
      order: 1,
      face: 'FRONT',
      shapes: { connect: simpleRingID },
    },
  });

  // Signet Presets
  await prisma.ringEngravingPreset.create({
    data: {
      name: 'Alien',
      imageUrl:
        'https://res.cloudinary.com/meta-iiii/image/upload/v1668172190/ring-kingz-presets/side_alien_imwfq3.png',
      order: 1,
      face: 'FRONT',
      shapes: { connect: signetRingIDs },
    },
  });
  await prisma.ringEngravingPreset.create({
    data: {
      name: 'Anchor',
      imageUrl:
        'https://res.cloudinary.com/meta-iiii/image/upload/v1668172191/ring-kingz-presets/side_anchor_xvb1ig.png',
      order: 2,
      face: 'FRONT',
      shapes: { connect: signetRingIDs },
    },
  });
  await prisma.ringEngravingPreset.create({
    data: {
      name: 'Eye',
      imageUrl:
        'https://res.cloudinary.com/meta-iiii/image/upload/v1668172191/ring-kingz-presets/side_eye_yqhykp.png',
      order: 3,
      face: 'FRONT',
      shapes: { connect: signetRingIDs },
    },
  });
  await prisma.ringEngravingPreset.create({
    data: {
      name: 'Heart',
      imageUrl:
        'https://res.cloudinary.com/meta-iiii/image/upload/v1668172191/ring-kingz-presets/side_heart_c2d6zq.png',
      order: 4,
      face: 'FRONT',
      shapes: { connect: signetRingIDs },
    },
  });
  await prisma.ringEngravingPreset.create({
    data: {
      name: 'Moon',
      imageUrl:
        'https://res.cloudinary.com/meta-iiii/image/upload/v1668172191/ring-kingz-presets/side_moon_nw4bjz.png',
      order: 5,
      face: 'FRONT',
      shapes: { connect: signetRingIDs },
    },
  });
  await prisma.ringEngravingPreset.create({
    data: {
      name: 'Music',
      imageUrl:
        'https://res.cloudinary.com/meta-iiii/image/upload/v1668172191/ring-kingz-presets/side_music_e18ezr.png',
      order: 6,
      face: 'FRONT',
      shapes: { connect: signetRingIDs },
    },
  });
  await prisma.ringEngravingPreset.create({
    data: {
      name: 'Skull',
      imageUrl:
        'https://res.cloudinary.com/meta-iiii/image/upload/v1668172191/ring-kingz-presets/side_skull_h3hdmr.png',
      order: 7,
      face: 'FRONT',
      shapes: { connect: signetRingIDs },
    },
  });
  await prisma.ringEngravingPreset.create({
    data: {
      name: 'Star',
      imageUrl:
        'https://res.cloudinary.com/meta-iiii/image/upload/v1668172191/ring-kingz-presets/side_star_aqhxzo.png',
      order: 8,
      face: 'FRONT',
      shapes: { connect: signetRingIDs },
    },
  });
  await prisma.ringEngravingPreset.create({
    data: {
      name: 'Sun',
      imageUrl:
        'https://res.cloudinary.com/meta-iiii/image/upload/v1668172191/ring-kingz-presets/side_sun_ixk8oo.png',
      order: 9,
      face: 'FRONT',
      shapes: { connect: signetRingIDs },
    },
  });
  await prisma.ringEngravingPreset.create({
    data: {
      name: 'Web',
      imageUrl:
        'https://res.cloudinary.com/meta-iiii/image/upload/v1668172192/ring-kingz-presets/side_web_oekzse.png',
      order: 10,
      face: 'FRONT',
      shapes: { connect: signetRingIDs },
    },
  });
  await prisma.ringEngravingPreset.create({
    data: {
      name: 'Yin Yang',
      imageUrl:
        'https://res.cloudinary.com/meta-iiii/image/upload/v1668172192/ring-kingz-presets/side_yinyang_mymenl.png',
      order: 11,
      face: 'FRONT',
      shapes: { connect: signetRingIDs },
    },
  });
  await prisma.ringEngravingPreset.create({
    data: {
      name: 'S',
      imageUrl:
        'https://res.cloudinary.com/meta-iiii/image/upload/v1668172189/ring-kingz-presets/front_s_ksgreg.png',
      order: 12,
      face: 'FRONT',
      shapes: { connect: signetRingIDs },
    },
  });
  await prisma.ringEngravingPreset.create({
    data: {
      name: 'Peach',
      imageUrl:
        'https://res.cloudinary.com/meta-iiii/image/upload/v1668172189/ring-kingz-presets/front_peach_kqx1y9.png',
      order: 13,
      face: 'FRONT',
      shapes: { connect: signetRingIDs },
    },
  });
  await prisma.ringEngravingPreset.create({
    data: {
      name: 'Cat',
      imageUrl:
        'https://res.cloudinary.com/meta-iiii/image/upload/v1668172189/ring-kingz-presets/front_cat_igxehw.png',
      order: 14,
      face: 'FRONT',
      shapes: { connect: signetRingIDs },
    },
  });
  await prisma.ringEngravingPreset.create({
    data: {
      name: 'Portal',
      imageUrl:
        'https://res.cloudinary.com/meta-iiii/image/upload/v1668172189/ring-kingz-presets/front_portal_qsd2aj.png',
      order: 15,
      face: 'FRONT',
      shapes: { connect: signetRingIDs },
    },
  });

  // Side Presets
  await prisma.ringEngravingPreset.create({
    data: {
      name: 'Alien',
      imageUrl:
        'https://res.cloudinary.com/meta-iiii/image/upload/v1668172190/ring-kingz-presets/side_alien_imwfq3.png',
      order: 1,
      face: 'SIDE1',
      shapes: { connect: signetRingIDs },
    },
  });
  await prisma.ringEngravingPreset.create({
    data: {
      name: 'Anchor',
      imageUrl:
        'https://res.cloudinary.com/meta-iiii/image/upload/v1668172191/ring-kingz-presets/side_anchor_xvb1ig.png',
      order: 2,
      face: 'SIDE1',
      shapes: { connect: signetRingIDs },
    },
  });
  await prisma.ringEngravingPreset.create({
    data: {
      name: 'Eye',
      imageUrl:
        'https://res.cloudinary.com/meta-iiii/image/upload/v1668172191/ring-kingz-presets/side_eye_yqhykp.png',
      order: 3,
      face: 'SIDE1',
      shapes: { connect: signetRingIDs },
    },
  });
  await prisma.ringEngravingPreset.create({
    data: {
      name: 'Heart',
      imageUrl:
        'https://res.cloudinary.com/meta-iiii/image/upload/v1668172191/ring-kingz-presets/side_heart_c2d6zq.png',
      order: 4,
      face: 'SIDE1',
      shapes: { connect: signetRingIDs },
    },
  });
  await prisma.ringEngravingPreset.create({
    data: {
      name: 'Moon',
      imageUrl:
        'https://res.cloudinary.com/meta-iiii/image/upload/v1668172191/ring-kingz-presets/side_moon_nw4bjz.png',
      order: 5,
      face: 'SIDE1',
      shapes: { connect: signetRingIDs },
    },
  });
  await prisma.ringEngravingPreset.create({
    data: {
      name: 'Music',
      imageUrl:
        'https://res.cloudinary.com/meta-iiii/image/upload/v1668172191/ring-kingz-presets/side_music_e18ezr.png',
      order: 6,
      face: 'SIDE1',
      shapes: { connect: signetRingIDs },
    },
  });
  await prisma.ringEngravingPreset.create({
    data: {
      name: 'Skull',
      imageUrl:
        'https://res.cloudinary.com/meta-iiii/image/upload/v1668172191/ring-kingz-presets/side_skull_h3hdmr.png',
      order: 7,
      face: 'SIDE1',
      shapes: { connect: signetRingIDs },
    },
  });
  await prisma.ringEngravingPreset.create({
    data: {
      name: 'Star',
      imageUrl:
        'https://res.cloudinary.com/meta-iiii/image/upload/v1668172191/ring-kingz-presets/side_star_aqhxzo.png',
      order: 8,
      face: 'SIDE1',
      shapes: { connect: signetRingIDs },
    },
  });
  await prisma.ringEngravingPreset.create({
    data: {
      name: 'Sun',
      imageUrl:
        'https://res.cloudinary.com/meta-iiii/image/upload/v1668172191/ring-kingz-presets/side_sun_ixk8oo.png',
      order: 9,
      face: 'SIDE1',
      shapes: { connect: signetRingIDs },
    },
  });
  await prisma.ringEngravingPreset.create({
    data: {
      name: 'Web',
      imageUrl:
        'https://res.cloudinary.com/meta-iiii/image/upload/v1668172192/ring-kingz-presets/side_web_oekzse.png',
      order: 10,
      face: 'SIDE1',
      shapes: { connect: signetRingIDs },
    },
  });
  await prisma.ringEngravingPreset.create({
    data: {
      name: 'Yin Yang',
      imageUrl:
        'https://res.cloudinary.com/meta-iiii/image/upload/v1668172192/ring-kingz-presets/side_yinyang_mymenl.png',
      order: 11,
      face: 'SIDE1',
      shapes: { connect: signetRingIDs },
    },
  });
  await prisma.ringEngravingPreset.create({
    data: {
      name: 'Flourish 1',
      imageUrl:
        'https://res.cloudinary.com/meta-iiii/image/upload/v1668172190/ring-kingz-presets/side_2_eaxaug.png',
      order: 12,
      face: 'SIDE1',
      shapes: { connect: signetRingIDs },
    },
  });
  await prisma.ringEngravingPreset.create({
    data: {
      name: 'Flourish 2',
      imageUrl:
        'https://res.cloudinary.com/meta-iiii/image/upload/v1668172190/ring-kingz-presets/side_3_mkumf0.png',
      order: 13,
      face: 'SIDE1',
      shapes: { connect: signetRingIDs },
    },
  });
  await prisma.ringEngravingPreset.create({
    data: {
      name: 'Flourish 3',
      imageUrl:
        'https://res.cloudinary.com/meta-iiii/image/upload/v1668172189/ring-kingz-presets/side_1_nctnxk.png',
      order: 14,
      face: 'SIDE1',
      shapes: { connect: signetRingIDs },
    },
  });
  await prisma.ringEngravingPreset.create({
    data: {
      name: 'Flourish 4',
      imageUrl:
        'https://res.cloudinary.com/meta-iiii/image/upload/v1668172190/ring-kingz-presets/side_4_hicq4l.png',
      order: 15,
      face: 'SIDE1',
      shapes: { connect: signetRingIDs },
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
