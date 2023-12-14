class CjsUtilClass {
    #foo;
    publicVar = 10;
    constructor(foo) {
        this.#foo = foo;
    }

    minus(x) {
        console.log(this.publicVar)
        return this.#foo - x;   // foo - x
    }
    double() {
        return this.#foo * 2;   // foo * 2;
    }
    plusTen() {
        this.#foo += this.publicVar
    }
}

///////////////

function createCjsUtil (foo /* private 변수. */) {
    let xx = 100 // private
    return {
        publicVar: 10,
        minus(x) {
            return foo - x;   // foo - x
        },
        double() {
            return foo * 2;   // foo * 2;
        },
        plusTen() {
            foo += xx;
        }
    }
}

const cu = new CjsUtilClass(5);
cu.double(); // 10 // method : cu라는 객체에 double이라는 메시지를 보낸다.
cu.minus(2); // 3 // method : cu라는 객체에 2를 minux 하라는 메시지를 보낸다.
//cu.#foo += 5  // private, 접근 불가

xxxFn(cu.double);

const cu2 = createCjsUtil(5);
cu2.double(); // 10
cu2.minus(2); // 3 // method : cu라는 객체에 2를 minux 하라는 메시지를 보낸다.
cu2.plusTen();
cu2.publicVar = 1234
xxxFn(cu2.double);

function xxxFn(fn) {
    if (xx) {
        fn();
    }
}

function cjsUtilFunction(str) {
    //console.log(this);
    return str.toUpperCase();
};

// TODO: 다른 패키지가 CjsUtilClass와 cjsUtilFunction를 가져다 쓰려면 어떻게 해야 할까요?
export { CjsUtilClass, cjsUtilFunction };