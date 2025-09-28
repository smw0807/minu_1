class Country {
  name;
  idolGroups;
  constructor(name, idolGroups) {
    this.name = name;
    this.idolGroups = idolGroups;
  }
}

class IdolGroup {
  name;
  members;
  constructor(name, members) {
    this.name = name;
    this.members = members;
  }
}

class Idol {
  name;
  year;
  constructor(name, year) {
    this.name = name;
    this.year = year;
  }
}

class MaleIdol extends Idol {
  constructor(name, year) {
    super(name, year);
  }
  sing() {
    return `저는 ${this.name}이고, ${this.year}년생입니다. 전 노래를 부르어요`;
  }
}

class FemaleIdol extends Idol {
  constructor(name, year) {
    super(name, year);
  }
  dance() {
    return `저는 ${this.name}이고, ${this.year}년생입니다. 전 춤을 추어요`;
  }
}

const iveMembers = [
  {
    name: '안유진',
    year: 2003,
  },
  {
    name: '장원영',
    year: 2004,
  },
];

const btsMembers = [
  {
    name: '제이홉',
    year: 1994,
  },
  {
    name: '지민',
    year: 1995,
  },
];

const cIveMembers = iveMembers.map(x => new FemaleIdol(x.name, x.year));
console.log(cIveMembers);
const cBtsMembers = btsMembers.map(x => new MaleIdol(x.name, x.year));
console.log(cBtsMembers);
console.log('----------------------');

const iveGroup = new IdolGroup('아이브', cIveMembers);
console.log(iveGroup);
const btsGroup = new IdolGroup('방탄소년단', cBtsMembers);
console.log(btsGroup);
console.log('----------------------');

const korea = new Country('한국', [iveGroup, btsGroup]);
console.dir(korea, { depth: null });

console.log('----------------------');
const allTogeter = new Country('대한민국', [
  new IdolGroup(
    '아이브',
    iveMembers.map(x => new FemaleIdol(x.name, x.year))
  ),
  new IdolGroup(
    '방탄소년단',
    btsMembers.map(x => new MaleIdol(x.name, x.year))
  ),
]);
console.log(allTogeter);
