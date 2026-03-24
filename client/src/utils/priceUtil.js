const calculateSellingPrice = (mrp, discount) => {
    const discountAmount = (mrp * discount) / 100;
    const findalPrice = mrp - discountAmount;
    return Math.round(findalPrice);
}

export default calculateSellingPrice;