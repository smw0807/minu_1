function run(n, k) {
  // var answer = 0;

  // const skewersPrice = 12000;
  // const drinkPrice = 2000;
  // // let serviceDrink = 0;
  // //10인분 당 음료 서비스
  // let serviceDrink = Math.floor(n / 10);
  // console.log(serviceDrink);
  // const totalSkewersPrice = skewersPrice * n;
  // const totalDrinkPrice = drinkPrice * k - drinkPrice * serviceDrink;

  // answer = totalSkewersPrice + totalDrinkPrice;
  // console.log(answer);
  // return answer;

  k -= ~~(n / 10);
  console.log(k);
  if (k < 0) k = 0;
  return n * 12000 + k * 2000;
}

console.log(run(10, 6));
console.log(run(64, 6));
