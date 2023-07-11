function parseFilters(products) {
  let prices = [];
  let brands = [];
  let colors = [];
  let categories = [];
  // get prices range
  for (const product of products) {
    prices.push(product.price);
    brands.push(product.brand);
    colors.push(product.colors);
    categories.push(product.category_id);
  }
  let pricesRange = getPricesRange(prices);
  // get filtered colors
  let filteredColors = filterArray(colors.flat());
  // get filtered brands
  let filteredBrands = filterArray(brands);
  // get filtered categories
  let filteredCategories = filterArray(categories);
  // rating
  let ratings = [0, 1, 2, 3, 4, 5];
  // dilivery cost
  let diliveryCost = ['free'];

  return {
    pricesRange,
    filteredColors,
    filteredBrands,
    filteredCategories,
    ratings,
    diliveryCost,
  };
}

function filterQuery(
  logic,
  { q = null, pmin = 0, pmax = null, colors = null, category = null, rating = 0, freeDelivery, brands = null }
) {
  const filters = [
    q && { name: { $regex: new RegExp(q, 'i') } },
    colors && { color: { $in: colors.split(',') } },
    category && { category_id: category },
    freeDelivery && { deliveryCost: 0 },
    brands && { brand: { $in: brands.split(',') } },
    rating && { rating: { $gte: rating } },
    { price: { $gte: pmin } },
    pmax && { price: { $lte: pmax } },
  ].filter(Boolean);

  return {
    [logic]: filters,
  };
}

function getPricesRange(prices) {
  return {
    max: Math.max(...prices),
    min: Math.min(...prices),
  };
}

function filterArray(array) {
  return [...new Set(array)];
}

module.exports = { parseFilters, filterQuery };
