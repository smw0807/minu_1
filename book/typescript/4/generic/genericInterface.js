/**
 * Rectangle 클래스 내 compareTo() 메서드는
 * Rectangle 타입 파라미터를 가진다.
 */
var Rectangle = /** @class */ (function () {
    function Rectangle(width, height) {
        this.width = width;
        this.height = height;
    }
    Rectangle.prototype.compareTo = function (value) {
        return this.width * this.height - value.width * value.height;
    };
    return Rectangle;
}());
var rect1 = new Rectangle(2, 5);
var rect2 = new Rectangle(2, 3);
console.log("rect1 : ".concat(rect1.compareTo(rect1)));
/**
 * Triangle 클래스 내 compareTo() 메서드는
 * Triangle 타입 파라미터를 가진다.
 */
var Triangle = /** @class */ (function () {
    function Triangle() {
    }
    Triangle.prototype.compareTo = function (value) {
        return 0;
    };
    return Triangle;
}());
