class Order { 
  constructor(quantity, itemPrice) {
    this.quantity = quantity;
    this.itemPrice = itemPrice;
  }

  get finalPrice() {
    const basePrice = this.quantity * this.itemPrice;
    let discountLevel;
    if (this.quantity > 100) discountLevel = 2;
    else discountLevel = 1;
    return this.discountPrice(basePrice, discountLevel);
  }

  discountPrice(basePrice, discountLevel) {
    switch(discountLevel) {
      case 1: return basePrice * 0.95;
      case 2: return basePrice * 0.9;
    }
  }
}

//1
class Order { 
  constructor(quantity, itemPrice) {
    this.quantity = quantity;
    this.itemPrice = itemPrice;
  }

  get finalPrice() {
    const basePrice = this.quantity * this.itemPrice;
    return this.discountPrice(basePrice, this.discountLevel);
  }

  get discountLevel() {
    return this.quantity > 100 ? 2 : 1
  }

  discountPrice(basePrice, discountLevel) {
    switch(discountLevel) {
      case 1: return basePrice * 0.95;
      case 2: return basePrice * 0.9;
    }
  }
}

//2
class Order { 
  constructor(quantity, itemPrice) {
    this.quantity = quantity;
    this.itemPrice = itemPrice;
  }

  get finalPrice() {
    const basePrice = this.quantity * this.itemPrice;
    return this.discountPrice(basePrice);
  }

  get discountLevel() {
    return this.quantity > 100 ? 2 : 1
  }

  discountPrice(basePrice) {
    switch(this.discountLevel) {
      case 1: return basePrice * 0.95;
      case 2: return basePrice * 0.9;
    }
  }
}