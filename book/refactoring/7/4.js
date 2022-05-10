class Order {
  constructor(quantity, item) {
    this._quantity = quantity;
    this._item = item;
  }
  get itemName() { return this._item.name; }
  get price() {
    // const basePrice = this._quantity * this._item.price;
    // let discountFactor = 0.98;
    
    // if(this.basePrice > 1000) discountFactor -= 0.03;
    // return this.basePrice * discountFactor
    return this.basePrice * this.discountFactor;
  }
  get basePrice() {
    return this._quantity * this._item.price;
  }
  get discountFactor() {
    let discountFactor = 0.98;
    if (this.basePrice > 1000) discountFactor -= 0.03;
    return discountFactor;
  }
}


const order = {
    name : 'pen',
    price: 2000
}
const minwoo = new Order(5, order);
console.log(minwoo.itemName, minwoo.price);