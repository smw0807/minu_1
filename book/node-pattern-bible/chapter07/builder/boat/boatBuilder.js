// class Boat {
//   constructor(
//     hasMotor,
//     motorCount,
//     motorBrand,
//     motorModel,
//     hasSails,
//     sailsCount,
//     sailsMaterial,
//     sailsColor,
//     hullColor,
//     hasCabin
//   ) {
//     this.hasMotor = hasMotor;
//     this.motorCount = motorCount;
//     this.motorBrand = motorBrand;
//     this.motorModel = motorModel;
//     this.hasSails = hasSails;
//     this.sailsCount = sailsCount;
//     this.sailsMaterial = sailsMaterial;
//     this.sailsColor = sailsColor;
//     this.hullColor = hullColor;
//     this.hasCabin = hasCabin;
//   }
// }

class Boat {
  constructor(allParameters) {
    this.hasMotor = allParameters.hasMotor;
    this.motorCount = allParameters.motorCount;
    this.motorBrand = allParameters.motorBrand;
    this.motorModel = allParameters.motorModel;
    this.hasSails = allParameters.hasSails;
    this.sailsCount = allParameters.sailsCount;
    this.sailsMaterial = allParameters.sailsMaterial;
    this.sailsColor = allParameters.sailsColor;
    this.hullColor = allParameters.hullColor;
    this.hasCabin = allParameters.hasCabin;
  }
}
class BoatBuilder {
  withMotors(count, brand, model) {
    this.hasMotor = true;
    this.motorCount = count;
    this.motorBrand = brand;
    this.motorModel = model;
    return this;
  }

  withSails(count, material, color) {
    this.hasSails = true;
    this.sailsCount = count;
    this.sailsMaterial = material;
    this.sailsColor = color;
    return this;
  }

  hullColor(color) {
    this.hullColor = color;
    return this;
  }

  withCabin() {
    this.hasCabin = true;
    return this;
  }

  build() {
    return new Boat({
      hasMotor: this.hasMotor,
      motorCount: this.motorCount,
      motorBrand: this.motorBrand,
      motorModel: this.motorModel,
      hasSails: this.hasSails,
      sailsCount: this.sailsCount,
      sailsMaterial: this.sailsMaterial,
      sailsColor: this.sailsColor,
      hullColor: this.hullColor,
      hasCabin: this.hasCabin,
    });
  }
}

const myBoat = new BoatBuilder()
  .withMotors(2, 'Best Motor Co.', 'OM123')
  .withSails(1, 'fabric', 'white')
  .withCabin()
  .hullColor('blue')
  .build();

console.log(myBoat);
