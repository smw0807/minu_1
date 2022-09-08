//하나의 타입 파라미터를 가지는 제네릭 인터페이스 선언
interface Comparator<T> {
  compareTo(value: T): number; //한 개의 타입 파라미터를 가지는 메서드
}

/**
 * Rectangle 클래스 내 compareTo() 메서드는
 * Rectangle 타입 파라미터를 가진다.
 */
class Rectangle implements Comparator<Rectangle> {
  constructor(private width: number, private height: number) {}
  compareTo(value: Rectangle): number {
    return this.width * this.height - value.width * value.height;
  }
}

const rect1: Rectangle = new Rectangle(2, 5);
const rect2 = new Rectangle(2, 3);
console.log(`rect1 : ${rect1.compareTo(rect1)}`);

/**
 * Triangle 클래스 내 compareTo() 메서드는
 * Triangle 타입 파라미터를 가진다.
 */
class Triangle implements Comparator<Triangle> {
  compareTo(value: Triangle): number {
    return 0;
  }
}
