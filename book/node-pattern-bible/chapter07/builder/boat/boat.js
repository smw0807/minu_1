class Boat {
  constructor(params) {
    this.hasMotor = params.hasMotor;
    this.hasMotor = params.hasMotor;
    this.motorCount = params.motorCount;
    this.motorBrand = params.motorBrand;
    this.motorModel = params.motorModel;
    this.hasSails = params.hasSails;
    this.sailsCount = params.sailsCount;
    this.sailsMaterial = params.sailsMaterial;
    this.sailsColor = params.sailsColor;
    this.hullColor = params.hullColor;
    this.hasCabin = params.hasCabin;
  }
}

const myBoat = new Boat({
  hasMotor: true,
  motorCount: 2,
  motorBrand: 'Best Motor Co. ',
  motorModel: 'OM123',
  hasSails: true,
  sailsCount: 1,
  sailsMaterial: 'fabric',
  sailsColor: 'white',
  hullColor: 'blue',
  hasCabin: false,
});
