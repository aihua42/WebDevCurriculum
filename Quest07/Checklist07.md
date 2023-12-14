# Check 07. node.js의 기초

## node.js는 무엇인가요? node.js의 내부는 어떻게 구성되어 있을까요?
* Node.js는 2009년에 Ryan Dahl이 만든 server-side 개발도구이다. 파일 업로드가 진행되는 동안 다른 작업을 수행 할 수 없는 서버의 문제를 해결하기 위해 고안되었다. Node.js는 __Chrome V8 JavaScript 엔진__ 으로 빌드 된 __JavaScript 런타임__ 이다. 런타임이란 특정 언어로 만든 프로그램을 실행할 수 있는 __환경__ 을 뜻한다.  JavaScript는 독립적인 언어가 아닌 __스크립트 언어__ 이다. 스크립트 언어는 특정한 프로그램 안에서 동작하는 프로그램이기 때문에 __웹 브라우저 프로그램 안에서만__  동작을 한다. Node.js의 등장은 JavaScript를 웹 브라우저에서 __독립__ 시킴으로서  __브라우저 없이 바로 실행__ 할 수 있게 됐다. 그리고 중요한 것은 Node.js를 이용하여 __서버를 만들 수 있다__ 는 것이다. 이전까지 Server-Client 웹사이트를 만들 때 웹에서 표시되는 부분은 JavaScript를 사용하여 만들어야만 했으며, 서버는 Ruby, Java 등 다른 언어를 써서 만들었어야 했는데 마침내 __한 가지 언어로 전체 웹 페이지를 만들 수 있게 된 것__ 이다.  

* Node.js는 이벤트 기반의 __non-blocking, asynchronous__ 구조이다. 이게 가능한 이유는 바로 node.js의 __libuv__ (c++ 기반의 open source built-in library)가 제공하는 __event loop__ 와 __worker thread pool(heavy tasks: File system APIs, Compression, DNS lookups, Hashing 등등)__ 그리고 __커널 API들(TCP/UDP sockets, servers; DNS resolver; 등등)__ 덕분이다. 그리고 코드를 실행하는 모든 과정에서 event loop은 single thread로 동작한다. one thread === one callstack === one thing at a time. 때문에 Don't block the event loop!

  1. js로 작성된 코드를 node.js로 실행.
  2. Top level code들, global()들이 한줄 한줄 main thread인 callstack에서 실행되고 사라짐.    
  3. 비동기로 처리해야 하는 code 만남. 
  4. Libuv를 호출. Libuv는 코드 제어권을 가지지 않고 다음 코드를 실행할 수 있도록 제어권을 넘김.   
     4.1 Libuv는 커널 API를 호출할지, thread pool을 생성하고 작업을 위임할지 판단.    
     4.2 커널 API를 호출하면 코드를 비동기적으로 바로 처리하고 queue에 callback을 등록.    
     4.3 Thread pool에 위임해야 하면, 동기적으로 처리. 다 될때까지 기다린다. 그뒤 libuv는 callback을 queue에 등록.
  5. 코드들을 마저 실행.
  6. Callstack이 비어있고 libuv에 의해 callback이 등록되어있다면 event loop 생성.
  7. Event loop가 callback을 callstack에 넣어줌.
  8. Callback은 실행되고 사라진다.
  9. 위에 과정은 필요할때마다 반복된다.
  10. 프로그램 종료.
  
## npm이 무엇인가요? `package.json` 파일은 어떤 필드들로 구성되어 있나요?
* npm(Node Package Manager)은 자바스크립트 프로그래밍 언어를 위한 패키지 관리자(명령어)이다. 자바스크립트 런타임 환경 Node.js의 기본 패키지 관리자이다. Node.js에서 사용할 수 있는 모듈들을 패키지화하여 모아둔 저장소 역할과 패키지 설치 및 관리를 위한 CLI(Command line interface)를 제공한다. 자신이 작성한 패키지를 공개할 수도 있고 필요한 패키지를 검색하여 재사용할 수도 있다. `package.json`에서 메타데이터와 파일의 종속성 기록하며, 이러한 종속성의 정확한 버전 및 의존성 트리는 `package-lock.json`과 `npm-shrinkwrap.json`에서 관리한다. 일반적인 경우에는 Node.js를 설치하면 자동으로 설치된다. 

* 패키지 안에 있는 `package.json` 파일에는 해당 패키지에 관한 의미있는 정보들이 담겨있다.
  * name: 패키지의 이름. 특정 패키지를 사용하기 위해 코드에서 require 함수의 인자로 넣는 것.    
    규칙: 1. must be lowercase 2. must be one word, 한 단어로 작성되어야 한다 3. may contain hyphens and underscore     
  * version: 패키지의 버전. 하나의 패키지는 그 안의 코드 등이 개선될수록 버전이 업데이트 되는데, 바로 위의 name 필드와 이 version 필드를 결합하면 특정 패키지의 특정 버전을 나타낼 수 있다.      
    형태: [Major].[Minor].[Patch]     
    __npm에 따르면, “name”과 “version”은 반드시 있어야 하는 fields이다.__
  * description: 패키지에 대한 설명. 패키지를 검색할 때 여기 있는 내용도 검색 기준으로 활용됨.  
  * main: 패키지의 진입점(entry point)이 되는 모듈의 ID.    
    예를 들면, A라는 패키지가 있고, A 패키지의 `package.json` 파일의 내용 중 main field에 B.js라는 값이 있다면, `require(A)` 하게 되면 결국 B.js 를 로드하게 된다.   
  * scripts: npm으로 간편하게 실행할 수 있는 command를 alias(별칭)을 통해 지정해 둘 수 있는 dictionary. 
    ```
    "scripts" : { 
      "index" : "index.js"
    }
    ```
    터미널에서 `npm run index` 라고 쓰면 index.js 파일이 실행되고 결과가 출력된다.
  * keywords: 패키지에 대한 키워드들. keywords도 description처럼 검색 기준으로 활용됨.
  * license: 패키지의 라이센스 정보가 담겨있다.
  * author, contributors: author는 패키지를 만든 사람, contributors는 패키지를 만드는데 기여하는 사람들.
  * dependencies: 패키지가 의존하고 있는 다른 패키지들이 나열되어 있는 필드. 이 필드는 Node.js 패키지 생태계의 핵심이 되는 필드. 어떤 패키지를 설치할 때 결국, 이 필드가 있어야, 필요한 하위 패키지들을 설치할 수 있기 때문.
    >왼쪽에 모듈의 이름, 오른쪽에 모듈의 버전 정보
  * devDependencies: 개발시에만 필요한 의존 패키지들을 의미한다.
  * repository: 패키지의 코드가 관리되고 있는 레포지토리(repository)의 주소를 나타낸다. 보통 버전 관리 시스템의 저장소 URL(GitHub URL 등)이 여기 적혀있다.   

## npx는 어떤 명령인가요? npm 패키지를 `-g` 옵션을 통해 글로벌로 저장하는 것과 그렇지 않은 것은 어떻게 다른가요?
* npx(Node Package Execution)는 직접 로컬로 설치된 명령줄 도구를 실행할 수 있도록 npm에서 제공하는 툴(명령어)이다. npx는 npm 5.2.0에서부터 사용할 수 있다. 아래와 처럼 작동한다.
  * npx로 실행하고자 하는 패키지가 현재 실행 경로에 존재하는지 파악.
  * 존재한다면, 패키지를 실행.
  * 없다면, 패키지의 최신 버전을 설치하고 실행한뒤 자동으로 삭제.    

  툴을 항상 최신버전으로 쓸수있고, 디스크 저장공간을 차지하지 않도록 하는 장점이 있다.
* `npm install` 명령어에는 지역(Local) 설치와 전역(Global) 설치 옵션이 있다. 

  옵션을 별도로 지정하지 않으면 지역으로 설치되며, 프로젝트 내부 디렉터리에 `node_modules` 디렉터리가 자동 생성되고 그 안에 패키지가 설치된다. 지역으로 설치된 패키지는 해당 프로젝트 내에서만 사용할 수 있다.   

  전역에 패키지를 설치하려면 `npm install` 명령어에 `-g` 옵션을 지정한다. 전역으로 설치된 패키지는 전역에서 참조할 수 있다. 모든 프로젝트가 공통 사용하는 패키지는 전역에 설치한다.

## 자바스크립트 코드에서 다른 파일의 코드를 부르는 시도들은 지금까지 어떤 것이 있었을까요? CommonJS 대신 ES Modules가 등장한 이유는 무엇일까요?
* 우리는 JS 모듈을 내보내거나 가져올 때 2가지 방식을 사용한다. 첫번째 방법은 `module.exports`로 모듈을 내보내고 `require()`로 접근하는 CJS(CommonJS), 두번째 방법은 `export`로 모듈을 내보내고 `import`로 접근하는 ESM(ES Modules)이 있다.    

  CJS는 node.js에서 지원하는 모듈 방식으로, 초기 Node버전부터 사용되었다. 별도의 설정이 없다면 CJS가 기본값이다. 
  ```js
  // 가져올 때
  const { plus, minus, multiply } = require('math');  // 확장자 안 넣어도 된다. 

        // require은 exports(module.exports shortcut), module, __filename, __dirname과 함께 Module Wrapper Function의 argument.

  // 내보낼 때
  module.exports.plus = ;  // named exports, object로 내보낼때
  exports.plus = ;     // module 생략 가능, exports는 module의 property중 하나.
       // 이외에 id, parent, filename, loaded, children, paths 가 있다.

  module.exports = Math;  // default exports. class, function 등 하나만 내보낼때
  ```

  ESM은 ECMAScript에서 지원하는 방식으로, node14에선 CJS, ESM이 공존하는데, 두 개를 동시에 사용하기 위해 별도의 처리가 필요하다. ESM은 일단 기본 값으로 `use strict`가 설정되어 있고, `this`는 `global object`를 참조하지 않고, 스코프는 다르게 작동 되는 등등 CJS와 다르다. 그리고 CJS와 ESM 모듈을 둘 다 불러올 수 있으며 반드시 파일 확장자를 지정해주어야 한다.

* 애플리케이션을 구성하는 요소중에 재사용 가능한 코드 조각들이 존재하는데, 이렇게 분리한 코드조각을 각각의 모듈(module)이라고 부른다. 자바스크립트는 파일마다 독립적인 파일 스코프를 가지고 있지 않고 하나의 전역객체를 공유하여 사용한다. 이렇게 되면 전역변수가 중복되는 등의 문제가 발생할 수 있다. 즉 여러개의 파일로 분리하여 여러개의 `script` 태그를 사용하여도 이는 모듈화라고 볼 수 없다. 이러한 문제점을 해결하기 위해서 node.js에서는 사실상 표준이라고 할 수 있는 CJS 를 채택하였다. 이렇게 함으로써 각각의 모듈들은 각자의 스코프를 가지게 될 수 있었다. 그러나 브라우저(클라이언트 사이드 자바스크립트)에서는 이를 지원하지 않았다. 그래서 ES6에서 이를 해결하기 위해 ESM을 추가하게 된 것이다.  

## ES Modules는 기존의 `require()`와 동작상에 어떤 차이가 있을까요? CommonJS는 할 수 있으나 ES Modules가 할 수 없는 일에는 어떤 것이 있을까요?
* CJS   
  * 파일 시스템에서 파일을 로드한다. 
  * 파일 로드 - 구문 분석 - 인스턴스화 - 평가가 각 파일마다 바로 실행된다. 즉시 스크립트를 실행하는 구조.
  * 그렇기에 모듈 지정자에 변수를 사용할수 있고, 변수에 값이 있다.
  * 또한 이 때문에 실행해보아야 `import`, `export` 에러를 감지할 수 있다.
  * 파일을 불러오는 동안 main thread를 차단한다.
  * 로드된 모듈의 값을 사용한다. 
  * 같은 메모리를 바라보고 있지 않기 때문에, `export`된 쪽에서 값을 변경해도 `require`한 쪽에서는 변경된 값으로 사용할 수 없다.
  * 이처럼 동기적으로 이루어지므로 `promise`를 리턴하거나 콜백함수를 호출하지 않는다.
  ```js
  // Dynamic module import based on a condition
  const moduleName = someCondition ? './moduleA' : './moduleB';
  const dynamicModule = require(moduleName);
  ```

  ESM
  * 모듈화 작업은 구성, 인스턴스 화 및 평가 세 단계로 나뉘어있으며 독립적으로 수행될 수 있다.
  * 구성: 스크립트를 바로 실행하지 않고 entry 파일의 구문 분석 후 의존성(`import`, `export`)을 확인해서 해당 의존성 파일을 찾아서 다시 구문 분석을 반복한다. 즉 평가를 하기 전에 미리 전체 모듈 그래프를 작성
  * 때문에 파싱 단계에서 `import`, `export` 에러를 감지할 수 있다.
  * 파일을 불러오는 동안 main thread를 차단하지 않는다.
  * 인스턴스화: `export` 된 값을 모두 배치하기 위해 메모리에 있는 공간들을 찾는다. 아직 실제 값은 채우지 않음, 때문에 모듈 지정자에 변수를 넣을수 없다. (동적 import()로 해결) 
  * 각 모듈이 가져오고 내보내는 변수의 메모리 주소를 할당 및 공유한다(linking).
  * 때문에 값 변경사항이 반영된다.
  * 평가: 코드를 실행하면서 메모리에 값을 채워나감.
  * top-level `await`를 지원하므로 module loader가 비동기 환경에서 실행된다.
  * 모듈을 병렬로 다운로드 하지만, 실행은 로드 스펙에 정의된 순서대로 순차적으로 한다.
  ```js
  // This is not allowed in ESM
  const moduleName = './someModule.js';
  import { someFunction } from moduleName; // Error: The requested module does not provide an export named 'moduleName'
  ```
 
  [출처](https://ui.toast.com/weekly-pick/ko_20180402)

* 모든 모듈을 순회하면서 각 단계를 동기적으로 수행하는 CJS와 달리 ESM은 비동기적으로 각 단계를 수행하기 때문에, 모듈 하나가 `async` 함수와 같이 모듈 최상위 레벨에서 `await` 구문을 사용할 수 있는 top level await이 가능해지고, 결과적으로 전체 파일 로드에 대한 성능을 향상할 수 있다. 또한 ESM은 비동기적이기 때문에 Tree Shaking이 가능하므로, 모듈 중에서 사용하지 않는 기능의 코드들은 빌드 시에 제거하여 번들 사이즈를 줄일수 있다. 

  하지만 ESM 방식을 취하려면 자바스크립트의 많은 부분에 변경이 필요하다. ESM은 일단 기본 값으로 `use strict`가 설정되어 있어야하고, `this`는 global object를 참조하지 않고, 스코프는 다르게 작동 되는 등등 변화가 많다. 이것이 브라우저에서 조차 script가 ESM을 기본으로 지정하지 않는 이유다. 

  Node.js에서의 ESM이 도입되기 전에는 CJS가 Node.js 모듈의 표준이었다. 결과적으로, 많은 양의 Node.js 라이브러리와 모듈은 CJS로 작성되어있다. 그리고 ESM을 사용하면 CJS 모듈만 지원하는 이전 버전의 Node.js와 호환되지 않는 애플리케이션이 렌더링된다. 때문에 오래된 버전의 Node.js를 아직도 사용하고 있는 개발자들은 새로운 ESM을 사용하는 것은 실용적이지 못하다. 이런 경우, ESM을 사용하도록 프로젝트를 바꾸는 것은 이점이 아닐 수 있다. 

  따라서 이제 막 시작한다면, ESM이 점점 클라이언트 사이드(브라우저)와 서버 사이드(Node.js) 둘 다를 위해 JS모듈을 정의하는데 표준형태가 되고 있기 때문에 ESM을 배우는 것이 유익하고 편할 수 있다.

## node.js에서 ES Modules를 사용하려면 어떻게 해야 할까요? ES Modules 기반의 코드에서 CommonJS 기반의 패키지를 불러오려면 어떻게 해야 할까요? 그 반대는 어떻게 될까요?
* CJS는 기본 값이다. ESM 방식을 사용하기 위해선 변경이 필요하다.     
  __전제:__ `.js`를 `.mjs`로 바꾸거나, `package.json`에 “type”: “module”을 설정해야 한다.    
  ```json
  {
    "type": "module",
  }
  ```
  __내보내기:__ `modules.exports`대신 `export`를 사용.
  ```js
  export const plus = (x, y) => x + y;  // named export
  export default { plus, minus, multiply, divide };   // default export, 파일마다 하나씩 존재할수 있다. 파일에 하나의 함수, 객체, 클래스만 있을 때 default로 내보내면 import하는 쪽에서 원하는 이름으로 바로 사용할수 있어서 편하다.

  export otherModule from './otherModule.js'; // 모듈 불러와서 바로 내보낼수 있다.
  ```
  __불러오기:__ `requires()`대신 `import`을 사용. 
  ```js
  import { plus } from './math.js';  // export할때 이름 그대로 사용해야 한다.
  import { plus as add } from './math.js';  // 또는 이름을 바꿔 사용할수 있다.

  import math from './math.js'; // defaultly exported 된걸 그대로 가져올때는 가져오는 사람 마음대로 이름을 지정할수 있지만, 파일 이름 그대로 사용하는것이 보기에 좋다?

  import * as myMath from './math.js'; // default export가 없는 파일안의 내용을 모두 가져와서 객체에 넣고 해당 이름을 정할수 있다.
  ```

  필요한 것만 import해서 (named export) 사용하는것이 낫다.
  상황에 따라 dynamic import (비동기적으로, await)를 적절히 쓰는것이 좋다.
  ```js
  async function doMath() {
    const math = await import('./math.js');
    math.plus(2, 2);
  }
  btn.addEventListener('click', doMath); // 클릭 할때만 import하게 된다.
  ```
  
* ESM기반 코드에서는 `require()`를 사용할 수는 없다. 오로지 `import`만 가능하다. 그리고 항상 default exports 형식으로.     
  
  ```js
  import { default as myMath } from './math.cjs'; 
  import myMath from './math.cjs';  // 간단하게   
  ```

  __filename, __dirname 같은 경우에는 아래에서 처럼 부르면 된다.
  ```js
  import * as url from 'url';  //
  const __filename = url.fileURLToPath(import.meta.url);
  const __dirname = url.fileURLToPath(new URL(':', import.meta.url));
  ```

* CJS기반 코드에서 `import()`를 사용해서 ESM 모듈을 비동기적으로 불러올수 있다. 반드시 파일 확장자를 지정해주어야 한다.
  ```js
  import('./math.mjs').then();
  ```
  