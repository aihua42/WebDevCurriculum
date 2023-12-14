// TODO: cjs-package와 esm-package의 함수와 클래스들을 가져다 쓰고 활용하려면 어떻게 해야 할까요?
import { EsmUtilClass, esmUtilFunction } from "../esm-package/index.mjs";

const numEsm = new EsmUtilClass(4);
console.log(numEsm.double());

const stringEsm = "hello ES Module!";
console.log(esmUtilFunction(stringEsm));

import { CjsUtilClass, cjsUtilFunction } from "../cjs-package/index.js";

const numCjs = new CjsUtilClass(3);
console.log(numCjs.double());

const stringCjs = "hello CommonJS!";
//console.log(cjsUtilFunction(stringCjs));
console.log(cjsUtilFunction.bind({name: 'Ava'})(stringCjs));  // apply