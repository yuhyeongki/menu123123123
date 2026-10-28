import { Allergen } from '../types/meal';

export const ALLERGEN_CATALOG: Allergen[] = [
  {
    code: 1,
    name: '난류(달걀)',
    shortName: '달걀',
    icon: '🥚',
    badgeBg: 'bg-amber-100 border-amber-300 text-amber-800',
    badgeText: 'text-amber-800',
    description: '계란, 메추리알 등 가금류의 알 포함'
  },
  {
    code: 2,
    name: '우유',
    shortName: '우유',
    icon: '🥛',
    badgeBg: 'bg-sky-100 border-sky-300 text-sky-800',
    badgeText: 'text-sky-800',
    description: '치즈, 버터, 유제품, 연유 등'
  },
  {
    code: 3,
    name: '메밀',
    shortName: '메밀',
    icon: '🍜',
    badgeBg: 'bg-stone-100 border-stone-300 text-stone-800',
    badgeText: 'text-stone-800',
    description: '메밀국수, 메밀전병 등'
  },
  {
    code: 4,
    name: '땅콩',
    shortName: '땅콩',
    icon: '🥜',
    badgeBg: 'bg-orange-100 border-orange-300 text-orange-800',
    badgeText: 'text-orange-800',
    description: '땅콩버터, 땅콩기름 등 견과류'
  },
  {
    code: 5,
    name: '대두(콩)',
    shortName: '대두(콩)',
    icon: '🫘',
    badgeBg: 'bg-yellow-100 border-yellow-300 text-yellow-800',
    badgeText: 'text-yellow-800',
    description: '두부, 간장, 된장, 두유, 콩기름 등'
  },
  {
    code: 6,
    name: '밀(밀가루)',
    shortName: '밀',
    icon: '🌾',
    badgeBg: 'bg-amber-50 border-amber-200 text-amber-900',
    badgeText: 'text-amber-900',
    description: '빵, 면류, 튀김옷, 과자, 간장 등'
  },
  {
    code: 7,
    name: '고등어',
    shortName: '고등어',
    icon: '🐟',
    badgeBg: 'bg-blue-100 border-blue-300 text-blue-800',
    badgeText: 'text-blue-800',
    description: '등푸른생선 및 관련 어류'
  },
  {
    code: 8,
    name: '게',
    shortName: '게',
    icon: '🦀',
    badgeBg: 'bg-red-100 border-red-300 text-red-800',
    badgeText: 'text-red-800',
    description: '꽃게, 대게 및 갑각류 가공품'
  },
  {
    code: 9,
    name: '새우',
    shortName: '새우',
    icon: '🦐',
    badgeBg: 'bg-rose-100 border-rose-300 text-rose-800',
    badgeText: 'text-rose-800',
    description: '새우젓, 건새우, 튀김류 등'
  },
  {
    code: 10,
    name: '돼지고기',
    shortName: '돼지고기',
    icon: '🥩',
    badgeBg: 'bg-pink-100 border-pink-300 text-pink-800',
    badgeText: 'text-pink-800',
    description: '돈육, 햄, 소시지, 돈가스 등'
  },
  {
    code: 11,
    name: '복숭아',
    shortName: '복숭아',
    icon: '🍑',
    badgeBg: 'bg-pink-100 border-rose-200 text-rose-700',
    badgeText: 'text-rose-700',
    description: '복숭아 및 주스, 통조림'
  },
  {
    code: 12,
    name: '토마토',
    shortName: '토마토',
    icon: '🍅',
    badgeBg: 'bg-red-100 border-red-300 text-red-700',
    badgeText: 'text-red-700',
    description: '케첩, 토마토소스, 스파게티 등'
  },
  {
    code: 13,
    name: '아황산류',
    shortName: '아황산류',
    icon: '🍇',
    badgeBg: 'bg-purple-100 border-purple-300 text-purple-800',
    badgeText: 'text-purple-800',
    description: '말린 과일, 건포도, 표백가공 식품 등'
  },
  {
    code: 14,
    name: '호두',
    shortName: '호두',
    icon: '🌰',
    badgeBg: 'bg-amber-100 border-amber-300 text-amber-900',
    badgeText: 'text-amber-900',
    description: '호두 및 견과류 함유 제과류'
  },
  {
    code: 15,
    name: '닭고기',
    shortName: '닭고기',
    icon: '🍗',
    badgeBg: 'bg-amber-100 border-orange-300 text-orange-900',
    badgeText: 'text-orange-900',
    description: '계육, 치킨, 닭볶음탕, 육수 등'
  },
  {
    code: 16,
    name: '쇠고기',
    shortName: '쇠고기',
    icon: '🥩',
    badgeBg: 'bg-red-100 border-red-300 text-red-900',
    badgeText: 'text-red-900',
    description: '한우, 육우, 소고기 육수, 쇠고기 분말 등'
  },
  {
    code: 17,
    name: '오징어',
    shortName: '오징어',
    icon: '🦑',
    badgeBg: 'bg-cyan-100 border-cyan-300 text-cyan-800',
    badgeText: 'text-cyan-800',
    description: '오징어볶음, 어묵, 짬뽕 등'
  },
  {
    code: 18,
    name: '조개류',
    shortName: '조개류',
    icon: '🦪',
    badgeBg: 'bg-teal-100 border-teal-300 text-teal-800',
    badgeText: 'text-teal-800',
    description: '굴, 전복, 홍합, 바지락 등 포함'
  },
  {
    code: 19,
    name: '잣',
    shortName: '잣',
    icon: '🌲',
    badgeBg: 'bg-emerald-100 border-emerald-300 text-emerald-800',
    badgeText: 'text-emerald-800',
    description: '잣 및 잣죽 등'
  }
];

export const ALLERGEN_MAP = new Map<number, Allergen>(
  ALLERGEN_CATALOG.map((item) => [item.code, item])
);
