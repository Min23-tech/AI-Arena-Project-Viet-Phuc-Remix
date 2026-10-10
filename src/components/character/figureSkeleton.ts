import { Point } from './figureMath';

export interface SkeletonMeasurements {
  crown: number;
  chin: number;
  headHalf: number;
  neckHalf: number;
  neckTop: number;
  shY: number;
  shHalf: number;
  shDrop: number;
  armpit: number;
  chestHalf: number;
  waistY: number;
  waistHalf: number;
  hipY: number;
  hipHalf: number;
  kneeY: number;
  ankleY: number;
}

export const FEMALE_SKELETON: SkeletonMeasurements = {
  crown: 34,
  chin: 100,
  headHalf: 23,
  neckHalf: 8.5,
  neckTop: 94,
  shY: 128,
  shHalf: 42,
  shDrop: 5,
  armpit: 152,
  chestHalf: 37,
  waistY: 222,
  waistHalf: 28,
  hipY: 266,
  hipHalf: 42,
  kneeY: 402,
  ankleY: 522,
};

export const MALE_SKELETON: SkeletonMeasurements = {
  crown: 30,
  chin: 101,
  headHalf: 25,
  neckHalf: 12.5,
  neckTop: 94,
  shY: 128,
  shHalf: 53,
  shDrop: 2,
  armpit: 158,
  chestHalf: 47,
  waistY: 226,
  waistHalf: 42,
  hipY: 272,
  hipHalf: 43,
  kneeY: 404,
  ankleY: 522,
};

export type CostumeType = 'ngu' | 'tac' | 'dai' | 'tu' | 'nhat' | 'giao';
export type SleeveType = 'hep' | 'thung' | 'nhat';
export type FitType = 'loose' | 'fitted' | 'wide';
export type CollarType = 'dung' | 'khong_co' | 'nhat_binh' | 'giao_linh';

export interface CostumeSpec {
  id: string;
  type: CostumeType;
  hemY: number;
  sleeve: SleeveType;
  fit: FitType;
  collar: CollarType;
}

export const COSTUME_SPECS: Record<string, CostumeSpec> = {
  ngu_than: {
    id: 'ngu_than',
    type: 'ngu',
    hemY: 452,
    sleeve: 'hep',
    fit: 'loose',
    collar: 'dung',
  },
  ngu_than_nam: {
    id: 'ngu_than_nam',
    type: 'ngu',
    hemY: 462,
    sleeve: 'hep',
    fit: 'loose',
    collar: 'dung',
  },
  ao_tac: {
    id: 'ao_tac',
    type: 'tac',
    hemY: 468,
    sleeve: 'thung',
    fit: 'wide',
    collar: 'dung',
  },
  ao_dai_tan_thoi: {
    id: 'ao_dai_tan_thoi',
    type: 'dai',
    hemY: 492,
    sleeve: 'hep',
    fit: 'fitted',
    collar: 'dung',
  },
  ao_tu_than: {
    id: 'ao_tu_than',
    type: 'tu',
    hemY: 462,
    sleeve: 'hep',
    fit: 'loose',
    collar: 'khong_co',
  },
  ao_nhat_binh: {
    id: 'ao_nhat_binh',
    type: 'nhat',
    hemY: 452,
    sleeve: 'nhat',
    fit: 'wide',
    collar: 'nhat_binh',
  },
  ao_giao_linh: {
    id: 'ao_giao_linh',
    type: 'giao',
    hemY: 494,
    sleeve: 'thung',
    fit: 'wide',
    collar: 'giao_linh',
  },
};

export interface ArmKeypoints {
  S: Point;
  E: Point;
  W: Point;
  isFoldedFan: boolean;
  isWideFan: boolean;
}

export function computeArmPoints(
  side: 'right' | 'left', // 'right' is wearer's right (x < 200)
  gender: 'female' | 'male',
  sleeve: SleeveType,
  hasFan: boolean,
  hasBag: boolean,
  costumeType: CostumeType
): ArmKeypoints {
  if (gender === 'female' && costumeType === 'tac') {
    // Áo tấc nữ: cẳng tay gập ngang trước bụng, tay phải đặt trên tay trái (cầm quạt thì quạt mở lên từ tay phải)
    const cx = 200;
    const { shHalf, shY } = FEMALE_SKELETON;
    if (side === 'right') {
      return hasFan
        ? { S: { x: cx - shHalf + 4, y: shY + 8 }, E: { x: cx - 58, y: shY + 110 }, W: { x: cx - 2, y: shY + 96 }, isFoldedFan: false, isWideFan: true }
        : { S: { x: cx - shHalf + 4, y: shY + 8 }, E: { x: cx - 58, y: shY + 110 }, W: { x: cx - 14, y: shY + 98 }, isFoldedFan: false, isWideFan: false };
    }
    return { S: { x: cx + shHalf - 4, y: shY + 8 }, E: { x: cx + 58, y: shY + 110 }, W: { x: cx + 14, y: shY + 100 }, isFoldedFan: false, isWideFan: false };
  }
  if (gender === 'female' && (costumeType === 'tac' || costumeType === 'nhat')) {
    const cx = 200;
    const { shHalf, shY } = FEMALE_SKELETON;
    if (side === 'right') {
      return {
        S: { x: cx - shHalf + 4, y: shY + 8 },
        E: { x: cx - shHalf - 4, y: shY + 100 },
        W: { x: cx - 51, y: shY + 170 },
        isFoldedFan: false,
        isWideFan: false,
      };
    } else {
      return {
        S: { x: cx + shHalf - 4, y: shY + 8 },
        E: { x: cx + shHalf + 4, y: shY + 100 },
        W: { x: cx + 51, y: shY + 170 },
        isFoldedFan: false,
        isWideFan: false,
      };
    }
  }

  const skel = gender === 'female' ? FEMALE_SKELETON : MALE_SKELETON;
  const cx = 200;

  // Base natural hanging arm points for WEARER'S RIGHT (x < 200, left side of image)
  const S_right: Point = {
    x: cx - skel.shHalf + 4,
    y: skel.shY + 8,
  };

  let E_right: Point;
  let W_right: Point;
  let isFoldedFan = false;
  let isWideFan = false;

  if (side === 'right') {
    // Check if holding fan on wearer's right hand
    if (hasFan) {
      if (sleeve === 'hep') {
        // Cầm quạt, áo tay hẹp: E = (S.x - 10, S.y + 92); W = (E.x + 31, E.y - 56)
        E_right = { x: S_right.x - 10, y: S_right.y + 92 };
        W_right = { x: E_right.x + 31, y: E_right.y - 56 };
        isFoldedFan = true;
      } else {
        // Cầm quạt, áo tay thụng: E = (cx - shHalf - 4, shY + 96), W = (cx - 16, shY + 104)
        E_right = { x: cx - skel.shHalf - 4, y: skel.shY + 96 };
        W_right = { x: cx - 16, y: skel.shY + 104 };
        isWideFan = true;
      }
    } else {
      // Thả tự nhiên:
      // E = (cx - shHalf - k, shY + 98) with k = nữ 11, nam 6
      // W = (cx - hipHalf - m, shY + 170) with m = nữ 4, nam 9
      const k = gender === 'female' ? 11 : 6;
      const m = gender === 'female' ? 4 : 9;
      E_right = { x: cx - skel.shHalf - k, y: skel.shY + 98 };
      W_right = { x: cx - skel.hipHalf - m, y: skel.shY + 170 };
    }

    return { S: S_right, E: E_right, W: W_right, isFoldedFan, isWideFan };
  } else {
    // Wearer's LEFT (x > 200, right side of image)
    // Symmetrical natural hanging, or holding bag hanging from wrist
    const k = gender === 'female' ? 11 : 6;
    const m = gender === 'female' ? 4 : 9;

    const S_left: Point = {
      x: cx + skel.shHalf - 4,
      y: skel.shY + 8,
    };
    const E_left: Point = {
      x: cx + skel.shHalf + k,
      y: skel.shY + 98,
    };
    const W_left: Point = {
      x: cx + skel.hipHalf + m,
      y: skel.shY + 170,
    };

    return { S: S_left, E: E_left, W: W_left, isFoldedFan: false, isWideFan: false };
  }
}
