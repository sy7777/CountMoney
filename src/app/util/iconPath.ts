export interface TransIcon {
  icon: string;
  text: string;
  add?: boolean;
}
export interface UserTransIcon {
  icon: string;
  text: string;
  userId: string;
  id: string;
  index: number;
}

export const iconPaths: TransIcon[] = [
  { icon: 'assets/icons/beauty.png', text: 'Beauty' },
  { icon: 'assets/icons/bill.png', text: 'Bill' },
  { icon: 'assets/icons/children.png', text: 'Children' },
  { icon: 'assets/icons/digital.png', text: 'Digital Product' },
  { icon: 'assets/icons/entertainment.png', text: 'Entertainment' },
  { icon: 'assets/icons/exercise.png', text: 'Exercise' },
  { icon: 'assets/icons/financial.png', text: 'Financial Product' },
  { icon: 'assets/icons/fruit.png', text: 'Fruit' },
  { icon: 'assets/icons/gift.png', text: 'Gift' },
  { icon: 'assets/icons/living.png', text: 'Living' },
  { icon: 'assets/icons/others.png', text: 'Others' },
  { icon: 'assets/icons/social.png', text: 'Social' },
  { icon: 'assets/icons/parttime.png', text: 'Part-Time' },
  { icon: 'assets/icons/rent.png', text: 'Rent' },
  { icon: 'assets/icons/house.png', text: 'House' },
  { icon: 'assets/icons/snack.png', text: 'Snack' },
  { icon: 'assets/icons/transport.png', text: 'Transport' },
  { icon: 'assets/icons/travel.png', text: 'Travel' },

  { icon: 'assets/icons/cart.png', text: 'Glocery' },
  { icon: 'assets/icons/cloth.png', text: 'Cloth' },
  { icon: 'assets/icons/meal.png', text: 'Dine-in' },
  { icon: 'assets/icons/medical.png', text: 'Medical' },
  { icon: 'assets/icons/veg.png', text: 'Veg' },

  // { icon: '/assets/icons/income.png', text: 'Salary' },
];

export const defaultInIcon: TransIcon[] = [
  { icon: 'assets/icons/income.png', text: 'Salary' },
];

export const defaultOutIcon: TransIcon[] = [
  { icon: 'assets/icons/cart.png', text: 'Glocery' },
  { icon: 'assets/icons/cloth.png', text: 'Cloth' },
  { icon: 'assets/icons/meal.png', text: 'Dine-in' },
  { icon: 'assets/icons/medical.png', text: 'Medical' },
  { icon: 'assets/icons/veg.png', text: 'Veg' },
];
export const addIcon: TransIcon = {
  icon: 'assets/icons/plus.png',
  text: 'Add',
  add: true,
};
