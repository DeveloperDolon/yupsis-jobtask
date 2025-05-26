function exchanging() {
  const mojoExchangeCount = [];

  function calculation(mutki) {
    const mojo = mutki / 3;
    const remainingMutki = mutki % 3;
    const exchaningAbleMutkis = (mutki / 3) * 3;

    mojoExchangeCount.push(mojo);

    return {
      mojo,
      remainingMutki,
      exchaningAbleMutkis,
      mojoEatenCount,
    };
  }
}

const mojoMutkiExchange = (mojo) => {
  const mutki = mojo;

  const calculation = exchanging(mutki);
  
  console.log(`Eat ${mojo} mojos -> Get ${mutki} mutkis!`);


  const { exchangedMojo, remainingMutki, exchaningAbleMutkis } =
    calculation(mojo);

  console.log(
    `Exchange ${exchaningAbleMutkis} mutkis -> GEt ${exchangedMojo} mojos!`
  );

  console.log(`Remaining mutkis: ${remainingMutki}`);
};

mojoMutkiExchange(10);
