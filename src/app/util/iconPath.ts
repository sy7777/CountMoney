export interface TransIcon {
  icon: string;
  name: string;
  add?: boolean;
}
export interface UserTransIcon {
  icon: string;
  name: string;
  type: string;
  userId: string;
  id: string;
}

export const iconPaths: TransIcon[] = [
  { icon: '/assets/icons/beauty.png', name: 'Beauty' },
  { icon: '/assets/icons/bill.png', name: 'Bill' },
  { icon: '/assets/icons/children.png', name: 'Children'  },
  { icon: '/assets/icons/digital.png', name: 'Digital Product' },
  { icon: '/assets/icons/entertainment.png', name: 'Entertainment' },
  { icon: '/assets/icons/exercise.png', name: 'Exercise' },
  { icon: '/assets/icons/financial.png', name: 'Financial Product'  },
  { icon: '/assets/icons/fruit.png', name: 'Fruit' },
  { icon: '/assets/icons/gift.png', name: 'Gift' },
  { icon: '/assets/icons/living.png', name: 'Living' },
  { icon: '/assets/icons/others.png', name: 'Others'  },
  { icon: '/assets/icons/social.png', name: 'Social' },
  { icon: '/assets/icons/parttime.png', name: 'Part-Time' },
  { icon: '/assets/icons/rent.png', name: 'Exercise' },
  { icon: '/assets/icons/house.png', name: 'House'  },
  { icon: '/assets/icons/snack.png', name: 'Snack' },
  { icon: '/assets/icons/transport.png', name: 'Transport'  },
  { icon: '/assets/icons/travel.png', name: 'Snack' },
];

export const defaultInIcon: TransIcon[] = [
  { icon: '/assets/icons/income.png', name: 'Salary' },
  { icon: '/assets/icons/plus.png', name: 'Add', add: true},
]

export const defaultOutIcon: TransIcon[] = [
  { icon: '/assets/icons/cart.png', name: 'Glocery' },
  { icon: '/assets/icons/cloth.png', name: 'Cloth' },
  { icon: '/assets/icons/meal.png', name: 'Dine-in' },
  { icon: '/assets/icons/medical.png', name: 'Medical' },
  { icon: '/assets/icons/veg.png', name: 'Veg' },
  { icon: '/assets/icons/plus.png', name: 'Add', add: true},
]
