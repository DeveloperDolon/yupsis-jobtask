function updateStock(currentStock, transaction, action) {
  const currentMg =
    currentStock.tons * 1000000000 +
    currentStock.kilograms * 1000000 +
    currentStock.grams * 1000 +
    currentStock.milligrams;

  const transactionMg =
    transaction.tons * 1000000000 +
    transaction.kilograms * 1000000 +
    transaction.grams * 1000 +
    transaction.milligrams;

  let newMg;
  if (action === "purchase") {
    newMg = currentMg + transactionMg;
  } else if (action === "sell") {
    newMg = currentMg - transactionMg;
  } else {
    throw new Error("Action must be either 'purchase' or 'sell'");
  }

  if (newMg < 0) {
    throw new Error("Resulting stock cannot be negative");
  }

  const tons = Math.floor(newMg / 1000000000);
  let remaining = newMg % 1000000000;

  const kilograms = Math.floor(remaining / 1000000);
  remaining = remaining % 1000000;

  const grams = Math.floor(remaining / 1000);
  const milligrams = remaining % 1000;

  return {
    tons: tons,
    kilograms: kilograms,
    grams: grams,
    milligrams: milligrams,
  };
}

const initialStock = { tons: 1, kilograms: 0, grams: 0, milligrams: 0 };

const afterSale = updateStock(
  initialStock,
  { tons: 0, kilograms: 0, grams: 1, milligrams: 0 },
  "sell"
);
console.log(afterSale);

const afterPurchase = updateStock(
  afterSale,
  { tons: 0, kilograms: 0, grams: 1001, milligrams: 0 },
  "purchase"
);
console.log(afterPurchase);
