//슈퍼클래스를 위임으로 바꾸기
class CatalogItem {
  constructor(id, title, tags) {
    this._id = id;
    this._title = title;
    this._tags = tags;
  }
  get id() { return this._id; }
  get title() { return this._title; }
  hasTag(arg) { return this._tags.includes(arg); }
}

// class Scroll extends CatalogItem { //3 카탈로그아이템과의 상속을 끊음
class Scroll {
  // constructor(id, title, tags, dateLastCleaned, catalogID, catalog) {
  constructor(id, dateLastCleaned, catalogID, catalog) {
    // super(id, title, tags); //3 카탈로그아이템과의 상속을 끊음
    this._id = id;
    // this._catalogItem - new CatalogItem(id, title, tags); //1 카탈로그아이템을 참조하는 속성을 만들고 슈퍼클래스의 인스턴스를 새로만들어 대임
    // this._catalogItem = new CatalogItem(null, title, tags);
    this._catalogItem = catalog.get(catalogID);
    this._lastCleaned = dateLastCleaned;
  }
  //2 서브클래스에서 사용하는 슈퍼클래스의 동작 각각에 대응하는 전달 메서드를 만듬
  // get id() { return this._catalogItem.id; }
  get id() { return this.id; }
  get title() { return this._catalogItem.title; }
  hasTag(aString) { return this._catalogItem.hasTag(aString); }

  needsCleaning(targetDate) {
    const threshold = this.hasTag("revered") ? 700 : 1500;
    return this.daysSinceLastCleaning(targetDate) > threshold;
  }

  daysSinceLastCleaning(targetDate) {
    return this._lastCleaned.until(targetDate, ChronoUnit.DAYS);
  }
}

const scrolls = aDocument
      .map(record => new Scroll(record.id,
                                // record.catalogData.title,
                                // record.catalogData.tags,
                                record.catalogData.id,
                                catalog));