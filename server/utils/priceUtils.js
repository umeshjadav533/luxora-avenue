export const getSellingPrice = (mrp, discount = 0) => {
  const discountAmount = (mrp * discount) / 100;
  return Math.round(mrp - discountAmount);
};
