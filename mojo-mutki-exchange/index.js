const remainingMutkis = [];
const mojoExchangeCount = [];

function exchanging(remainingMutkis, mojoExchangeCount) {
  function calculation(mutki) {
    const exchangedMojo = mutki / 3;
    const remainingMutki = mutki % 3;
    const exchangeableMutkis = (mutki / 3) * 3;

    mojoExchangeCount.push(exchangedMojo);
    remainingMutkis.push(remainingMutki);

    return {
      exchangedMojo: Math.floor(exchangedMojo),
      remainingMutki: Math.floor(remainingMutki),
      exchangeableMutkis: Math.floor(exchangeableMutkis),
      mojoExchangeCount,
      remainingMutkis,
    };
  }

  return calculation;
}

const calculation = exchanging(remainingMutkis, mojoExchangeCount);

const mojoMutkiExchange = (mojo) => {
  const mutki = mojo;

  console.log(`Eat ${mojo} mojos -> Get ${mutki} mutkis!`);

  const lastRemaining =
    remainingMutkis?.length > 0
      ? remainingMutkis[remainingMutkis.length - 1]
      : 0;
  console.log(remainingMutkis);
  const { exchangedMojo, remainingMutki, exchangeableMutkis } = calculation(
    mojo + lastRemaining
  );

  console.log(
    `Exchange ${exchangeableMutkis} mutkis -> GEt ${exchangedMojo} mojos!`
  );

  console.log(`Remaining mutkis: ${remainingMutki}`);

  if (exchangedMojo + remainingMutki < 3) {
    console.log(
      `Total Mutkis: ${exchangedMojo} + ${remainingMutki} = ${
        exchangedMojo + remainingMutki
      } (not enough to exchange anymore)`
    );

    return;
  }

  mojoMutkiExchange(exchangedMojo);
};

mojoMutkiExchange(100);
