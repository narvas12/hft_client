export const filterTopGainers = (cryptoList) => {
  return cryptoList
    .filter((coin) => {
      const change = parseFloat(coin.change24.replace("%", ""));
      return change >= 3 && coin.isPositive24;
    })
    .slice(0, 20);
};
