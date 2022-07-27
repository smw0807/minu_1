function localShippingRules(country) {
  const data = countryData.shippingRules[country];
  if (data) return new shippingRules(data);
  else return -23;
}

class OrderProcessingError extends Error {
  constructor(errorCode) {
    super(`주문 처리 오류 : ${errorCode}`);
    this.code = errorCode;
  }
  get name() { return "OrderProcessingError"; }
}