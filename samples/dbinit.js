import dotenv from "dotenv";
import logger from "../utils/logger.js";

// 기본 .env 파일 로딩(package.json에서 로딩함)
// dotenv.config({ path: '.env' });
// 환경별 .env 파일 로딩
logger.log("NODE_ENV", process.env.NODE_ENV);
if (process.env.NODE_ENV) {
  dotenv.config({ override: true, path: `.env.${process.env.NODE_ENV}` });
}

import moment from "moment";
import db, { getClient, nextSeq } from "../utils/dbUtil.js";

async function main() {
  await db.dropDatabase();
  logger.info("DB 삭제.");
  await initDB();
  return "DB 초기화 완료.";
}

main()
  .then(logger.info)
  .catch(logger.error)
  .finally(() => getClient().close());

async function initDB() {
  // 시퀀스 등록
  await registSeq();
  console.info("1. 시퀀스 등록 완료.");

  // 회원 등록
  await registUser();
  console.info("2. 회원 등록 완료.");

  // 상품 등록
  await registProduct();
  console.info("3. 상품 등록 완료.");

  // 장바구니 등록
  await registCart();
  console.info("4. 장바구니 등록 완료.");

  // 구매 등록
  await registOrder();
  console.info("5. 구매 등록 완료.");

  // 후기 등록
  await registReply();
  console.info("6. 후기 등록 완료.");

  // 코드 등록
  await registCode();
  console.info("7. 코드 등록 완료.");

  // 북마크 등록
  await registBookmark();
  console.info("8. 북마크 등록 완료.");

  // config
  await registConfig();
  console.info("9. config 등록 완료.");

  // 상품 조회
  await productList();
}

function getDay(day = 0) {
  return moment().add(day, "days").format("YYYY.MM.DD");
}
function getTime(day = 0, second = 0) {
  return moment()
    .add(day, "days")
    .add(second, "seconds")
    .format("YYYY.MM.DD HH:mm:ss");
}

// 시퀀스 등록
async function registSeq() {
  const seqList = ["user", "product", "cart", "order", "reply", "bookmark"];
  const data = seqList.map((_id) => ({ _id, no: 1 }));
  await db.seq.insertMany(data);
}

// 회원 등록
async function registUser() {
  var data = [
    {
      _id: await nextSeq("user"),
      email: "admin@market.com",
      password: "$2b$10$S.8GNMDyvUF0xzujPtHBu.j5gtS19.OhRmYbpJBnCHg2S83WLx1T2",
      name: "무지",
      phone: "01011112222",
      address: "서울시 강남구 역삼동 123",
      type: "admin",
      createdAt: getTime(-100, -60 * 60 * 3),
      updatedAt: getTime(-100, -60 * 60 * 3),
      extra: {
        birthday: "03-23",
        membershipClass: "MC03",
        addressBook: [
          {
            id: 1,
            name: "집",
            value: "서울시 강남구 역삼동 123",
          },
          {
            id: 2,
            name: "회사",
            value: "서울시 강남구 신사동 234",
          },
        ],
      },
    },
    {
      _id: await nextSeq("user"),
      email: "s1@market.com",
      password: "$2b$10$S.8GNMDyvUF0xzujPtHBu.j5gtS19.OhRmYbpJBnCHg2S83WLx1T2",
      name: "네오",
      phone: "01022223333",
      address: "서울시 강남구 삼성동 456",
      type: "seller",
      createdAt: getTime(-50),
      updatedAt: getTime(-30, -60 * 60 * 3),
      extra: {
        birthday: "11-23",
        membershipClass: "MC01",
        addressBook: [
          {
            id: 1,
            name: "회사",
            value: "서울시 강남구 삼성동 567",
          },
          {
            id: 2,
            name: "학교",
            value: "서울시 강남구 역삼동 234",
          },
        ],
      },
    },
    {
      _id: await nextSeq("user"),
      email: "s2@market.com",
      password: "$2b$10$S.8GNMDyvUF0xzujPtHBu.j5gtS19.OhRmYbpJBnCHg2S83WLx1T2",
      name: "어피치",
      phone: "01033334444",
      address: "서울시 강남구 도곡동 789",
      type: "seller",
      createdAt: getTime(-40, -60 * 30),
      updatedAt: getTime(-30, -60 * 20),
      extra: {
        confirm: false, // 관리자 승인이 안됨
        birthday: "11-24",
        membershipClass: "MC02",
        addressBook: [
          {
            id: 1,
            name: "회사",
            value: "서울시 마포구 연희동 123",
          },
          {
            id: 2,
            name: "가게",
            value: "서울시 강남구 학동 234",
          },
        ],
      },
    },
    {
      _id: await nextSeq("user"),
      email: "u1@market.com",
      password: "$2b$10$S.8GNMDyvUF0xzujPtHBu.j5gtS19.OhRmYbpJBnCHg2S83WLx1T2",
      name: "제이지",
      phone: "01044445555",
      address: "서울시 강남구 논현동 222",
      type: "seller",
      createdAt: getTime(-20, -60 * 30),
      updatedAt: getTime(-10, -60 * 60 * 12),
      extra: {
        birthday: "11-30",
        membershipClass: "MC02",
        address: [
          {
            id: 1,
            name: "회사",
            value: "서울시 강동구 천호동 123",
          },
          {
            id: 2,
            name: "집",
            value: "서울시 강동구 성내동 234",
          },
        ],
      },
    },
  ];

  await db.user.insertMany(data);
}

// 상품 등록
async function registProduct() {
  var data = [
    {
      _id: await nextSeq("product"),
      seller_id: 2,
      price: 22800,
      shippingFees: 0,
      show: true,
      active: true,
      name: "비비드",
      quantity: Number.MAX_SAFE_INTEGER,
      buyQuantity: 0,
      mainImages: [
        {
          url: `${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}/files/sample-album2.jpg`,
          fileName: `sample-album2`,
          orgName: "sample-album2",
        },
      ],
      content: `팝하고 신나는 음악 비비드입니다`,
      createdAt: getTime(-41, -60 * 60 * 2),
      updatedAt: getTime(-40, -60 * 15),
      extra: {
        isNew: true,
        isBest: true,
        category: "팝",
        tags: ["비비드", "신나는", "팝한"],
        sort: 5,
        soundFile: {
          url: `${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}/files/sample-oppa.mp3`,
          fileName: "sample-oppa",
          orgName: "sample-oppa",
        },
      },
    },
    {
      _id: await nextSeq("product"),
      seller_id: 2,
      price: 17260,
      shippingFees: 0,
      show: true,
      active: true,
      name: "집에 보내줘",
      quantity: Number.MAX_SAFE_INTEGER,
      buyQuantity: 198,
      mainImages: [
        {
          url: `${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}/files/sample-album3.jpg`,
          fileName: "sample-album3",
          orgName: "sample-album3",
        },
      ],
      content: `집에 가고싶은 사람들의 마음을 대변하여 쓴 음악입니다`,
      createdAt: getTime(-38, -60 * 60 * 6),
      updatedAt: getTime(-33, -60 * 55),
      extra: {
        isNew: false,
        isBest: true,
        category: "발라드",
        tags: ["슬픈", "우울한", "팝한"],
        soundFile: {
          url: `${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}/files/sample-oppa.mp3`,
          fileName: "sample-oppa.mp3",
          orgName: "sample-oppa",
        },
        sort: 4,
      },
    },
    {
      _id: await nextSeq("product"),
      seller_id: 2,
      price: 500,
      shippingFees: 0,
      show: true,
      active: true,
      name: "레고 레츠고",
      quantity: Number.MAX_SAFE_INTEGER,
      buyQuantity: 99,
      mainImages: [
        {
          url: `${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}/files/sample-cross.jpg`,
          fileName: "sample-cross",
          orgName: "sample-cross",
        },
      ],
      content: `가자가자 집에 가자 직장인들의 퇴근길`,
      createdAt: getTime(-35, -60 * 60 * 6),
      updatedAt: getTime(-10, -60 * 19),
      extra: {
        isNew: true,
        isBest: true,
        category: "댄스",
        sort: 3,
        tags: ["행복한", "희망찬", "기대하는"],
        soundFile: {
          url: `${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}/files/sample-oppa.mp3`,
          fileName: "sample-oppa",
          orgName: "sample-oppa",
        },
      },
    },
    {
      _id: await nextSeq("product"),
      seller_id: 3,
      price: 1000,
      shippingFees: 0,
      show: true,
      active: true,
      name: "스마일",
      quantity: Number.MAX_SAFE_INTEGER,
      buyQuantity: 89,
      mainImages: [
        {
          url: `${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}/files/sample-smile.jpg`,
          fileName: "sample-smile",
          orgName: "sample-smile",
        },
      ],
      content: `힘든일이 있어도 항상 웃고 살자는 노래입니다`,
      createdAt: getTime(-33, -60 * 60 * 7),
      updatedAt: getTime(-22, -60 * 60 * 3),
      extra: {
        isNew: false,
        isBest: true,
        category: "일렉트로닉",
        sort: 1,
        tags: ["희망찬", "행복한", "긍정적인"],
        soundFile: {
          url: `${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}/files/sample-baedal.mp3`,
          fileName: "sample-baedal.mp3",
          orgName: "sample-baedal",
        },
      },
    },
    {
      _id: await nextSeq("product"),
      seller_id: 2,
      price: 2000,
      shippingFees: 0,
      show: true,
      active: true,
      name: "안스마일",
      quantity: Number.MAX_SAFE_INTEGER,
      buyQuantity: 98,
      mainImages: [
        {
          url: `${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}/files/sample-smile.jpg`,
          fileName: "sample-smile",
          orgName: "sample-smile",
        },
      ],
      content: `힘든 일만 가득한데 왜 웃으라는지 모르겠는 사람들의 마음을 대변하는 노래`,
      createdAt: getTime(-30, -60 * 60 * 10),
      updatedAt: getTime(-10, -60 * 56),
      extra: {
        isNew: true,
        isBest: false,
        today: true,
        category: "클래식",
        sort: 2,
        tags: ["슬픈", "우울한", "절망적인"],
        soundFile: {
          url: `${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}/files/sample-oppa.mp3`,
          fileName: "sample-oppa.mp3",
          orgName: "sample-oppa",
        },
      },
    },
    {
      _id: await nextSeq("product"),
      seller_id: 2,
      price: 3400,
      shippingFees: 0,
      show: false,
      active: true,
      name: "히어로 김히로",
      quantity: Number.MAX_SAFE_INTEGER,
      buyQuantity: 99,
      mainImages: [
        {
          url: `${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}/files/sample-night.jpg`,
          fileName: "sample-night",
          orgName: "sample-night",
        },
      ],
      content: `우리들의 영웅 김히로가 악당들을 물리치는 상황을 담은 노래`,
      createdAt: getTime(-30, -60 * 60 * 21),
      updatedAt: getTime(-20, -60 * 10),
      extra: {
        isNew: false,
        isBest: false,
        category: "힙합",
        sort: 1,
        tags: ["히어로", "영웅", "웅장한"],
        soundFile: {
          url: `${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}/files/sample-oppa.mp3`,
        },
      },
    },
    {
      _id: await nextSeq("product"),
      seller_id: 3,
      price: 13000,
      shippingFees: 0,
      show: true,
      active: true,
      name: "안졸리다 졸려",
      quantity: Number.MAX_SAFE_INTEGER,
      buyQuantity: 98,
      mainImages: [
        {
          url: `${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}/files/sample-album2.jpg`,
          fileName: "album2.jpg",
          orgName: "album",
        },
      ],
      content: `안졸린줄 알앗는데 무척이나 졸린 나의 상황을 표현한 노래입니다`,
      createdAt: getTime(-25, -60 * 60 * 12),
      updatedAt: getTime(-24, -60 * 23),
      extra: {
        isNew: false,
        isBest: true,
        category: ["PC01", "PC0102", "PC010201"],
        sort: 3,
        tags: ["피곤한", "우울한"],
        soundFile: {
          url: `${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}/files/sample-oppa.mp3`,
          fileName: "sample-oppa.mp3",
          orgName: "sample-oppa",
        },
      },
    },
    {
      _id: await nextSeq("product"),
      seller_id: 2,
      price: 26000,
      shippingFees: 3000,
      show: true,
      active: true,
      name: "루미큐브",
      quantity: Number.MAX_SAFE_INTEGER,
      buyQuantity: 97,
      mainImages: [
        {
          url: `${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}/files/sample-rummikub.png`,
          fileName: "sample-rummikub.png",
          orgName: "sample-rummikube",
        },
      ],
      content: `루미큐브의 긴장감을 표현한 노래입니다`,
      createdAt: getTime(-22, -60 * 60 * 22),
      updatedAt: getTime(-20, -60 * 33),
      extra: {
        isNew: true,
        isBest: true,
        category: "클래식",
        sort: 8,
        tags: ["웅장한", "긴장감있는", "정적인"],
        soundFile: {
          url: `${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}/files/sample-oppa.mp3`,
          fileName: "sample-oppa.mp3",
          orgName: "sample-oppa",
        },
      },
    },
    {
      _id: await nextSeq("product"),
      seller_id: 3,
      price: 12000,
      shippingFees: 0,
      show: true,
      active: true,
      name: "짱구는 못말려 숲속 산책",
      quantity: Number.MAX_SAFE_INTEGER,
      buyQuantity: 96,
      mainImages: [
        {
          url: `${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}/files/sample-jjangu.jpg`,
          fileName: "sample-jjangu.jpg",
          orgName: "sample-jjangu.jpg.",
        },
      ],
      content: `짱구가 우연히 들어간 숲속에서 일어난 일에 대해 짱구가 느끼는 감정을 표현한 노래`,
      createdAt: getTime(-21, -60 * 60 * 4),
      updatedAt: getTime(-16, -60 * 15),
      extra: {
        isNew: true,
        isBest: false,
        today: true,
        category: "락",
        sort: 2,
        tags: ["신나는", "재밌는", "팝한"],
        soundFile: {
          url: `${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}/files/sample-oppa.mp3`,
          fileName: "sample-oppa.mp3",
          orgName: "sample-oppa",
        },
      },
    },
    {
      _id: await nextSeq("product"),
      seller_id: 3,
      price: 200000,
      shippingFees: 0,
      show: true,
      active: true,
      name: "라푼젤라또",
      quantity: Number.MAX_SAFE_INTEGER,
      buyQuantity: 95,
      mainImages: [
        {
          url: `${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}/files/sample-rapunzel.jpg`,
          fileName: "sample-rapunzel.jpg",
          orgName: "sample-rapunzel",
        },
      ],
      content: `디즈니에서 만든 라푼젤라또 ost 음악`,
      createdAt: getTime(-18, -60 * 60 * 7),
      updatedAt: getTime(-12, -60 * 33),
      extra: {
        isNew: false,
        isBest: true,
        category: "국악",
        sort: 4,
        tags: ["슬픈", "달콤한", "팝한"],
        soundFile: {
          url: `${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}/files/sample-oppa.mp3`,
          fileName: "sample-oppa.mp3",
          orgName: "sample-oppa",
        },
      },
    },
    {
      _id: await nextSeq("product"),
      seller_id: 2,
      price: 200,
      shippingFees: 0,
      show: true,
      active: true,
      name: "INVU",
      quantity: Number.MAX_SAFE_INTEGER,
      buyQuantity: 94,
      mainImages: [
        {
          url: `${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}/files/sample-invu.jpg`,
          fileName: "sample-invu.",
          orgName: "sample-invu",
        },
      ],
      content: `태연의 INVU 아이앤브이유`,
      createdAt: getTime(-16, -60 * 60 * 3),
      updatedAt: getTime(-15, -60 * 45),
      extra: {
        isNew: false,
        isBest: false,
        today: true,
        category: "인디", // 어린이 > 레고
        sort: 6,
        tags: ["희망찬", "힘찬"],
        soundFile: `${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}/files/sample-oppa.mp3`,
      },
    },
    {
      _id: await nextSeq("product"),
      seller_id: 2,
      price: 9000,
      shippingFees: 0,
      show: true,
      active: true,
      name: "데이지",
      quantity: Number.MAX_SAFE_INTEGER,
      buyQuantity: 800,
      mainImages: [
        {
          url: `${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}/files/sample-album3.jpg`,
          fileName: "sample-album3.jpg",
          orgName: "album3",
        },
      ],
      content: `데이지가 피는 계절의 노래`,
      createdAt: getTime(-11, -60 * 60 * 12),
      updatedAt: getTime(-5, -60 * 60 * 6),
      extra: {
        isNew: true,
        isBest: true,
        category: "R&B", // 어린이 > 레고
        sort: 7,
        tags: ["조용한"],
        soundFile: {
          url: `${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}/files/sample-oppa.mp3`,
          fileName: "sample-oppa.mp3",
          orgName: "sample-oppa",
        },
      },
    },
    {
      _id: await nextSeq("product"),
      seller_id: 3,
      price: 21600,
      shippingFees: 3500,
      show: true,
      active: true,
      name: "핑크베놈",
      quantity: Number.MAX_SAFE_INTEGER,
      buyQuantity: 94,
      mainImages: [
        {
          url: `${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}/files/sample-night.jpg`,
          fileName: "sample-night",
          orgName: "sample-night",
        },
      ],
      content: `블랙핑크의 핑크베놈입니다`,
      createdAt: getTime(-10, -60 * 60 * 12),
      updatedAt: getTime(-5, -60 * 60 * 6),
      extra: {
        isNew: true,
        isBest: false,
        category: "월드뮤직", // 어린이 > 레고
        sort: 6,
        tags: ["웅장한", "강한", "팝한"],
        soundFile: {
          url: `${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}/files/sample-oppa.mp3`,
          fileName: "sample-oppa.mp3",
          orgName: "sample-oppa",
        },
      },
    },
    {
      _id: await nextSeq("product"),
      seller_id: 3,
      price: 12900,
      shippingFees: 0,
      show: true,
      active: true,
      name: "하입보이",
      quantity: Number.MAX_SAFE_INTEGER,
      buyQuantity: 298,
      mainImages: [
        {
          url: `${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}/files/sample-cross.jpg`,
          fileName: "sample-cross.jpg",
          orgName: "sample-cross",
        },
      ],
      content: `뉴진스의 데뷔곡 하입보이`,
      createdAt: getTime(-3, -60 * 60 * 12),
      updatedAt: getTime(-3, -60 * 60 * 12),
      extra: {
        isNew: false,
        isBest: true,
        category: "앰비언트", // 어린이 > 보드게임
        sort: 5,
        tags: ["설렘", "신나는", "긴장감"],
        soundFile: {
          url: `${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}/files/sample-oppa.mp3`,
          fileName: "sample-oppa.mp3",
          orgName: "sample-oppa",
        },
      },
    },
  ];

  await db.product.insertMany(data);
}

// 장바구니 등록
async function registCart() {
  var data = [
    {
      _id: await nextSeq("cart"),
      user_id: 4,
      product_id: 1,
      quantity: 2,
      createdAt: getTime(-7, -60 * 30),
      updatedAt: getTime(-7, -60 * 30),
    },
    {
      _id: await nextSeq("cart"),
      user_id: 4,
      product_id: 2,
      quantity: 1,
      createdAt: getTime(-4, -60 * 30),
      updatedAt: getTime(-3, -60 * 60 * 12),
    },
    {
      _id: await nextSeq("cart"),
      user_id: 2,
      product_id: 3,
      quantity: 2,
      createdAt: getTime(-3, -60 * 60 * 4),
      updatedAt: getTime(-3, -60 * 60 * 4),
    },
    {
      _id: await nextSeq("cart"),
      user_id: 2,
      product_id: 4,
      quantity: 3,
      createdAt: getTime(-2, -60 * 60 * 12),
      updatedAt: getTime(-1, -60 * 60 * 20),
    },
  ];

  await db.cart.insertMany(data);
}

// 구매 등록
async function registOrder() {
  var data = [
    {
      _id: await nextSeq("order"),
      user_id: 4,
      state: "OS010",
      products: [
        {
          _id: 2,
          name: "헬로카봇 스톰다이버",
          image: `${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}/files/sample-diver.jpg`,
          quantity: 2,
          price: 34520,
          reply_id: 3,
        },
      ],
      cost: {
        products: 34520,
        shippingFees: 2500,
        discount: {
          products: 0,
          shippingFees: 0,
        },
        total: 37020,
      },
      address: {
        name: "회사",
        value: "서울시 강남구 신사동 234",
      },
      createdAt: getTime(-6, -60 * 60 * 3),
      updatedAt: getTime(-6, -60 * 60 * 3),
    },
    {
      _id: await nextSeq("order"),
      user_id: 4,
      state: "OS035",
      delivery: {
        company: "한진 택배",
        trackingNumber: "364495958003",
        url: "https://trace.cjlogistics.com/next/tracking.html?wblNo=364495958003",
      },
      products: [
        {
          _id: 3,
          name: "레고 클래식 라지 조립 박스 10698",
          image: `${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}/files/sample-classic.jpg`,
          quantity: 1,
          price: 48870,
        },
        {
          _id: 4,
          name: "레고 테크닉 42151 부가티 볼리드",
          image: `${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}/files/sample-bugatti.png`,
          quantity: 2,
          price: 90000,
          reply_id: 2,
        },
      ],
      cost: {
        products: 138840,
        shippingFees: 3500,
        discount: {
          products: 13880,
          shippingFees: 3500,
        },
        total: 124960,
      },
      address: {
        name: "집",
        value: "서울시 강남구 역삼동 123",
      },
      createdAt: getTime(-4, -60 * 60 * 22),
      updatedAt: getTime(-2, -60 * 60 * 12),
    },
    {
      _id: await nextSeq("order"),
      user_id: 4,
      state: "OS310",
      products: [
        {
          _id: 4,
          name: "레고 테크닉 42151 부가티 볼리드",
          image: `${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}/files/sample-bugatti.png`,
          quantity: 1,
          price: 45000,
          reply_id: 1,
        },
      ],
      cost: {
        products: 45000,
        shippingFees: 3500,
        discount: {
          products: 4500,
          shippingFees: 0,
        },
        total: 44000,
      },
      address: {
        name: "학교",
        value: "서울시 강남구 역삼동 234",
      },
      createdAt: getTime(-3, -60 * 60 * 18),
      updatedAt: getTime(-1, -60 * 60 * 1),
    },
  ];

  await db.order.insertMany(data);
}

// 후기 등록
async function registReply() {
  var data = [
    {
      _id: await nextSeq("reply"),
      user_id: 4,
      product_id: 14,
      rating: 5,
      content: "노래가 신나서 좋아요",
      createdAt: getTime(-4, -60 * 60 * 12),
    },
    {
      _id: await nextSeq("reply"),
      user_id: 2,
      product_id: 14,
      rating: 1,
      content: "누진세 풍각쟁이 따라한듯",
      createdAt: getTime(-3, -60 * 60 * 1),
    },
    {
      _id: await nextSeq("reply"),
      user_id: 4,
      product_id: 13,
      rating: 5,
      content: "블랙핑크의 느낌을 잘 담아낸 노래같아요!",
      createdAt: getTime(-2, -60 * 60 * 10),
    },
  ];

  await db.reply.insertMany(data);
}

// 코드 등록
async function registCode() {
  var data = [
    {
      _id: "productCategory",
      title: "상품 카테고리",
      codes: [
        {
          sort: 1,
          code: "PC01",
          value: "팝",
          depth: 1,
        },
        {
          sort: 1,
          code: "PC02",
          value: "댄스",
          depth: 1,
        },
        {
          sort: 1,
          code: "PC03",
          value: "일렉트로닉",
          depth: 1,
        },
        {
          sort: 1,
          code: "PC04",
          value: "힙합",
          depth: 1,
        },
        {
          sort: 1,
          code: "PC05",
          value: "R&B",
          depth: 1,
        },
        {
          sort: 1,
          code: "PC06",
          value: "클래식",
          depth: 1,
        },
        {
          sort: 1,
          code: "PC07",
          value: "뉴에이지",
          depth: 1,
        },
        {
          sort: 1,
          code: "PC08",
          value: "락",
          depth: 1,
        },
        {
          sort: 1,
          code: "PC09",
          value: "발라드",
          depth: 1,
        },
        {
          sort: 1,
          code: "PC10",
          value: "인디",
          depth: 1,
        },
        {
          sort: 1,
          code: "PC11",
          value: "재즈/스윙",
          depth: 1,
        },
        {
          sort: 1,
          code: "PC12",
          value: "라틴",
          depth: 1,
        },
        {
          sort: 1,
          code: "PC13",
          value: "국악",
          depth: 1,
        },
        {
          sort: 1,
          code: "PC14",
          value: "월드뮤직",
          depth: 1,
        },
        {
          sort: 1,
          code: "PC15",
          value: "앰비언트",
          depth: 1,
        },
        {
          sort: 1,
          code: "PC16",
          value: "트로트",
          depth: 1,
        },
        {
          sort: 1,
          code: "PC17",
          value: "기타",
          depth: 1,
        },
      ],
    },
    {
      _id: "orderState",
      title: "주문 상태",
      codes: [
        {
          sort: 1,
          code: "OS010",
          value: "주문 완료",
        },
        {
          sort: 2,
          code: "OS020",
          value: "결제 완료",
        },
        {
          sort: 3,
          code: "OS030",
          value: "배송 준비중",
        },
        {
          sort: 4,
          code: "OS035",
          value: "배송중",
        },
        {
          sort: 5,
          code: "OS040",
          value: "배송 완료",
        },
        {
          sort: 6,
          code: "OS110",
          value: "반품 요청",
        },
        {
          sort: 7,
          code: "OS120",
          value: "반품 처리중",
        },
        {
          sort: 8,
          code: "OS130",
          value: "반품 완료",
        },
        {
          sort: 9,
          code: "OS210",
          value: "교환 요청",
        },
        {
          sort: 10,
          code: "OS220",
          value: "교환 처리중",
        },
        {
          sort: 11,
          code: "OS230",
          value: "교환 완료",
        },
        {
          sort: 12,
          code: "OS310",
          value: "환불 요청",
        },
        {
          sort: 13,
          code: "OS320",
          value: "환불 처리중",
        },
        {
          sort: 14,
          code: "OS330",
          value: "환불 완료",
        },
      ],
    },
    {
      _id: "membershipClass",
      title: "회원 등급",
      codes: [
        {
          sort: 1,
          code: "MC01",
          value: "일반",
          discountRate: 0, // 할인율
        },
        {
          sort: 2,
          code: "MC02",
          value: "프리미엄",
          discountRate: 10,
        },
        {
          sort: 3,
          code: "MC03",
          value: "VIP",
          discountRate: 20,
        },
      ],
    },
  ];
  await db.code.insertMany(data);
}

// 북마크 등록
async function registBookmark() {
  var data = [
    {
      _id: await nextSeq("bookmark"),
      user_id: 4,
      product_id: 12,
      memo: "첫째 크리스마스 선물.",
      createdAt: getTime(-3, -60 * 60 * 2),
    },
    {
      _id: await nextSeq("bookmark"),
      user_id: 4,
      product_id: 13,
      memo: "둘째 입학 선물",
      createdAt: getTime(-2, -60 * 60 * 20),
    },
    {
      _id: await nextSeq("bookmark"),
      user_id: 4,
      product_id: 14,
      memo: "이달 보너스타면 꼭!!!",
      createdAt: getTime(-1, -60 * 60 * 12),
    },
    {
      _id: await nextSeq("bookmark"),
      user_id: 2,
      product_id: 4,
      memo: "1순위로 살것!",
      createdAt: getTime(-1, -60 * 60 * 12),
    },
  ];

  await db.bookmark.insertMany(data);
}

// config 등록
async function registConfig() {
  var data = [
    {
      _id: "shippingFees",
      title: "배송비",
      value: 3500,
    },
    {
      _id: "freeShippingFees",
      title: "배송비 무료 금액",
      value: 50000,
    },
  ];
  await db.config.insertMany(data);
}

// 모든 상품명을 출력한다.
async function productList() {
  var result = await db.product
    .find({}, { projection: { _id: 0, name: 1 } })
    .toArray();
  logger.log(`상품 ${result.length}건 조회됨.`);
  logger.log(result);
}
