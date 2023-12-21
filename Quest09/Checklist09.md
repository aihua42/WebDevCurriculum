# Checklist 09. 서버와 클라이언트의 대화

# Topics
* expressJS, fastify
* AJAX, `XMLHttpRequest`, `fetch()`
* REST, CRUD
* CORS

# Checklist
* ## 비동기 프로그래밍이란 무엇인가요?
  비동기란 특정 코드가 끝날때 까지 코드의 실행을 멈추지 않고 다음 코드를 먼저 실행하는 것을 의미한다. 비동기 처리를 예로 Web API, Ajax, setTimeout 등이 있다.      
  비동기 프로그래밍의 방식에는 다음과 같은 방식들이 있다.      

  __콜백방식:__ 다른 코드의 매개변수로서 넘겨주는 실행 가능한 코드(함수) - 콜백함수, 말 그대로 나중에 실행되는 코드를 의미한다. JavaScript는 이벤트 중심 언어이기 때문에 어떤 이벤트가 발생하고, 그에 대한 결과가 올때까지 기다리지 않고 다음 이벤트를 계속 실행한다. 이런 비동기 작업이 '완료되면' 콜백함수를 호출하게 된다. 

  __Promise 객체:__ 코드의 중첩이 많아지는 콜백 지옥을 벗어날수 있게 해주는 JavaScript API이다. 첫 번째 인자로는 수행할 비동기 작업(resolve), 두 번째 인자로는 그 결과물을 콜백함수에 전달하는 함수(reject)가 들어간다. 비동기 연산이 종료된 이후에 결과 값과 실패 사유를 처리할수 있다.    
  >__fetch API__: 최신 문법. 특정 URL로부터 데이터를 불러오는데 사용하는 API. Promise 객체를 return.       

  __`await`/`async`:__ ES7.6부터 사용할수 있는 문법. Node.js 8버전부터 완벽하게 지원. Promise의 단점을 보완해주는 패턴. `async`뒤에 붙는 함수는 비동기적으로 처리됨. Promise 객체를 반환. `async`함수안에 `await`로 지정한 비동기 함수를 사용하면, 해당 작업이 완료되기 전까진 다음으로 넘어가지 않는다. 즉 `await`가 붙은 함수는 동기적으로 처리됨.
     
  * ### 콜백을 통해 비동기적 작업을 할 때의 불편한 점은 무엇인가요? 콜백지옥이란 무엇인가요?
    비동기 처리를 위해 콜백 패턴을 사용하면 처리 순서를 보장하기 위해 여러 개의 콜백 함수가 중첩되어 복잡도가 높아지는 콜백 헬(Callback Hell)이 발생하는 단점이 있다. 함수안에 함수, 또 그 함수안에 함수, 또 그 함수안에 함수, 또 그 함수안에..... 이런식으로 콜백을 사용하게 되면 정말 복잡한 구조를 가진 콜백지옥이 완성될 수 있다. 로직을 변경하기 어렵고, 가독성도 떨어지고, 실수 위험도 커지게 되기 때문에 말그대로 지옥이 될 수 있다.     

    이를 보완하기 위해 등장한것이 Promise 객체와 `async`, `await`이다.

  * ### 자바스크립트의 Promise는 어떤 객체이고 어떤 일을 하나요?
    비동기적인 작업을 처리하고 그 결과를 return하는 객체이다. Promise는 Promise 생성자 함수를 통해 인스턴스화한다. Promise 생성자 함수는 비동기 작업을 수행할 콜백 함수를 인자로 전달받는데 하나는 `resolve`, 다른 하나는 `reject`이다.    
    ```js
    const promise = new Promise((resolve, reject) => {
      if (/* 비동기 작업 수행 성공 */) {
        resolve();
      }
      else {/* 비동기 작업 수행 실패 */
        reject();
      }
    });
    ```
    Promise는 비동기 처리가 성공(fulfilled)하였는지 또는 실패(rejected)하였는지 등의 상태(state) 정보를 갖는다.   
    * pending: 비동기 처리가 아직 수행되지 않은 상태
    * fulfilled: 비동기 처리가 수행된 상태 (성공)
    * rejected: 비동기 처리가 수행된 상태 (실패)
    * settled: 비동기 처리가 수행된 상태 (성공 또는 실패)
    
    그리고 Promise는 아래와 같은 비동기 후속 처리 메서드들을 제공한다. 모두 Promise를 반환.
     >Promise를 return하는 함수    
     >.then( respose => {콜백 함수1} ) // 콜백함수의 인수: 앞에 반환한 resolve한 값.  
     >.then( respose => {콜백 함수2} )     
     >.catch( err => {콜백 함수} ) // 에러가 발생했을 때 호출된다. 콜백함수의 인수: 앞에서 반환한 reject한 값.   
     >.finally()  // 코드 성공/실패 상관없이, 최종적으로 코드를 실행하고 싶을 때   

    여기서 then()은 Chaining을 해서 사용할수 있다. 
    비동기에서는 예외(에러)가 발생하는 시점과 `try`가 싸고 있는 시간이 일치하지 않게 된다. 따라서 `try catch` 구문으로 오류를 잡을 수 없다.

  * ### 자바스크립트의 `async`와 `await` 키워드는 어떤 역할을 하며 그 정체는 무엇일까요?
    `async`와 `await`는 자바스크립트의 비동기 처리 방식중 가장 최근에 나온 문법이다. new Promise로 Promise 인스턴스를 생성하고, resolve/reject를 넘겨주는 부분을 숨기기 때문에, Promise를 사용하는 것보다 코드 양도 확 줄일수 있다. 개발자가 읽기 좋은 코드를 작성할 수 있게 도와준다. 
    ```js
    async function 함수() {
      await 함수();
    }
    ```
    `async` 키워드는 function 앞에 사용한다. function 앞에 `async`를 붙이면 해당 함수는 항상 Promise를 반환한다.    
    
    `await`는 `async` 함수 안에서만 동작한다. Promise가 처리될 때 까지 기다리는 역할을 한다. Promise가 처리되면 그 결과와 함께 실행이 재개된다. Promise가 처리되길 기다리는 동안엔 엔진이 다른 일(다른 스크립트를 실행, 이벤트 처리 등)을 할 수 있기 때문에, CPU 리소스가 낭비되지 않는다. 

    문법 제약 때문에 `async`함수 바깥의 최상위 레벨 코드에선 `await`를 사용할 수 없다. 
    `async`로 처리된 함수는 Promise를 반환하기 때문에 `.then()`/`catch()`를 통해 최종 결과나 처리되지 못한 에러를 다룰수 있다.     

    `await`는 예외가 발생하는 시점이 `try`가 감싸고 있는 시간과 일치하기 때문에 `try catch`를 사용하면 된다.

* ## 브라우저 내 스크립트에서 외부 리소스를 가져오려면 어떻게 해야 할까요?
  웹브라우저는 페이지 새로고침을 하지 않아도 AJAX를 통해서 웹서버와 통신할수 있다. 가장 대표적인 예가, 브라우저의 추천 검색어이다. 

  AJAX는 'Asynchoronous Javascript And Xml'의 약자로 `XMLHttpRequest`라는 자바스크립트 객체를 이용해 서버와 __비동기적__ 으로 통신하여 DOM을 조작해 문서의 일부분만 갱신하는 것을 가능하게 한다.  

  AJAX의 좋은 점은 필요한 부분만 부분적으로 로드할수 있기 때문에 서버뿐만 아니라 웹브라우저를 사용하는 사용자도 시간과 네트워크 자원 등등을 절약할수 있고, 또한 사용자는 변경되는 부분에만 집중할수 있는 사용성의 증대가 생긴다.   
  

  전통적인 방법에는 `XMLHttpRequest` 객체를 사용하는 것이 있고, 새롭게 등장한 강력한 Web API에는 `fetch`가 있다. (그외에 axios 라이브러리 등)

  * ### 브라우저의 `XMLHttpRequest` 객체는 무엇이고 어떻게 동작하나요?
    `XMLHttpRequest`(XHR) 객체는 브라우저에서 제공하는 Wev API 으로서 브라우저 환경에서만 정상적으로 실행된다. AJAX 요청을 생성하고 서버와 상호작용할 때 사용된다.    

    HTTP 요청을 전송하기 위해서는 새로운 `XMLHttpRequest` 인스턴스를 만들고, URL endpoint와 HTTP 메서드를 지정해야 한다. 보내는 순서는 다음과 같다.  
    1. open() 메소드로 HTTP 요청을 초기화한다.
    2. 필요에 따라 setRequestHeader() 메서드로 특정 HTTP 요청의 헤더값을 설정한다.
    3. send() 메소드로 HTTP 요청을 전송한다.
    ```js
    const xml = new XMLHttpRequest();
    const url = 'https://example.com/user';
    http.open('GET', url);
    http.send();
    ```

    HTTP 응답을 처리할때는 XMLHTTPRequest 객체가 발생시키는 이벤트를 캐치해야 한다. `onreadystatechange`, `onload`, `onerror` 같은 이벤트 핸들러 프로퍼티를 갖고 있는데, 그중 `readystatechange` 이벤트는 HTTP 요청의 현재 상태를 나타내는 `readyState` 프로퍼티가 변경될 때마다 발생한다.
    ```js
    xml.onreadystatechange = () => {
      if (this.readyState == 4 && this.status == 200) {
		    console.log(xml.responseText);
	    }
    };
    ```
    HTTP 요청에 대한 응답이 정상적으로 도착했다면`response`에 서버가 전송한 전송한 데이터를 취득한다.

    * __속성:__ `XMLHttpRequestEventTarget`과 `EventTarget`의 속성을 상속받는다.
      * readyState: 요청의 상태를 나타내는 숫자. [0~4](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/readyState), 4는 완료.
      * response: reponseType의 값에 따라, 응답 개체 본문을 포함하는 ArrayBuffer, Blob, Document, JavaScript 객체, 또는 DOMString을 반환.
      * reponseType: [응답의 유형](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseType)을 지정. '', 'arraybuffer', 'blob', 'document', 'json', 'text'
      * reponseText: 요청에 대한 응답을 텍스트로 나타내는 string을 반환. 요청이 실패했거나, 아직 전송하지않은 경우에는 null을 반환.
      * reponseURL: 응답의 URL을 직렬화한 값을 반환. URL이 null이면 빈 문자열을 반환.
      * status: 응답의 [HTTP 상태](https://developer.mozilla.org/ko/docs/Web/HTTP/Status) 코드를 반환.
      
    * __메서드:__
      * abort(): 이미 요청을 전송한 경우, 그 요청을 중단.
      * open(method, url[, async=true[, user=null[, password=null]]]): 요청을 초기화.
      * send(body=null): 요청을 전송. 비동기 요청(default)인 경우, 요청을 전송하는 즉시 반환. (The best way to send binary content is by using a `TypedArray`, a `DataView` or a `Blob` object in conjunction with the _send()_ method.)
      * setRequestHeader(): HTTP 요청 헤더의 값을 설정.

    * __이벤트:__
      * abort: 요청이 중단되면 발생.
      * error: 요청이 오류를 마주치면 발생.
      * load: transaction이 성공적으로 끝나면 발생.
      * loadend: 요청이 성공적(load)으로 끝나거나, 실패(abort 또는 error)한 후 발생.
      * loadstart: 응답 데이터 로딩을 시작했을 때 발생.
      * progress: 요청이 데이터를 수신하는 동안 주기적으로 발생.
      * readystatechange: readyState 속성이 바뀔 때마다 발생.
      * timeout: 응답에 소요된 시간이 사전에 지정한 값을 초과해서 요청이 취소될 때 발생.

  * ### `fetch` API는 무엇이고 어떻게 동작하나요?
    `fetch` API는 HTTP 파이프라인을 구성하는 요청과 응답 등의 요소를 JavaScript에서 접근하고 조작할 수 있는 인터페이스를 제공한다. `fetch` API가 제공하는 전역 `fetch()` 메서드로 네트워크의 리소스를 쉽게 비동기적으로 취득할 수도 있다. 

    콜백 기반 API인 `XMLHttpRequest`와 달리, `fetch` API는 서비스 워커에서도 쉽게 사용할 수 있는 Promise 기반의 개선된 대체제이다(Promise를 반환). 또한 `fetch` API는 `CORS`을 따른다.

    `fetch`는 endpoint URL이라는 파라미터를 필수적으로 받는다. 응답은 Response 객체로 표현되며, JSON 응답 본문을 바로 반환하지는 않는다.  
    ```js
    async function logJSONData() {
      const response = await fetch("https://example.com/movies.json");
      const jsonData = await response.json();
      console.log(jsonData);
    }
    ```
    `fetch()` 메서드에는 선택적으로 두 번째 매개변수도 받을수 있다. Promise를 반환하기 때문에 .then()/catch() 로 에러처리를 할수 있다.
    ```js
    const url = 'https://example.com/posts';
    const jsonData = {
      method: 'POST',
      headers: {
        'content-type': 'application/json, charset=UTF-8',
      },
      body: {
        name: 'Said',
        id: 23,
      }
    };

    fetch(url, JSON.stringify(jsonData))
    .then((res) => {return res.json()})
    .then((data) => {console.log(data)})
    .catch((error) => console.log(error));
    ```

* ## REST는 무엇인가요?
  요청된 주소만 보고도 어떤 내용에 관한 요청인지를 예상할수 있게 하는 형식을 `REST`라고 하는데, 'Representational State Transfer'의 약자이다. 이런 의미로 REST는 네트워크 아키텍처 원리의 모음이다. 여기서 '네트워크 아키텍처 원리'란 자원을 정의하고 자원에 대한 주소를 지정하는 방법 전반을 일컫는다.  클라이언트에서 서버에게 요청을 보낼때 API를 REST 형식으로 만들어 주는 경우가 아직까지는 대세이다.

  __원리__

  REST 아키텍처에 적용되는 6가지 제한 조건:    
  1. Uniform Interface(인터페이스 일관성) : URI로 지정한 Resource에 대한 조작을 통일되고 한정적인 인터페이스로 수행한다.    
  2. Stateless(무상태) : 각 요청 간 클라이언트의 context가 서버에 저장되어서는 안 된다    
  3. Layered System(계층화) : Client는 REST API Server만 호출한다. REST Server는 다중 계층으로 구성될 수 있다. PROXY, 게이트웨이 같은 네트워크 기반의 중간 매체를 사용할 수 있다.
  4. Cacheable(캐시 처리 가능) : - 대량의 요청을 효율적으로 처리하기 위해 캐시가 요구된다.
  5. Server-Client(서버-클라이언트 구조) : 아키텍처를 단순화시키고 작은 단위로 분리(decouple)함으로써 클라이언트-서버의 각 파트가 독립적으로 개선될 수 있도록 해준다.    
  6. Code-On-Demand(optional) : Server로부터 스크립트를 받아서 Client에서 실행한다. 반드시 충족할 필요는 없다.

  REST 의 주요한 목표:
  1. 구성 요소 상호작용의 규모 확장성
  2. 인터페이스의 범용성 
  3. 구성 요소의 독립적인 배포
  4. 중간적 구성요소를 이용해 응답 지연 감소, 보안을 강화, 레거시 시스템을 인캡슐레이션

  [wikipedia](https://ko.wikipedia.org/wiki/REST)

  __그래서 어떻게 작동하는가?__
  1. HTTP URI(Uniform Resource Identifier)를 통해 자원(Resource)을 명시하고,
  2. HTTP Method(POST, GET, PUT, DELETE, PATCH 등)를 통해
  3. 해당 자원(URI)에 대한 CRUD Operation을 적용
     >CRUD는 대부분의 컴퓨터 소프트웨어가 가지는 기본적인 데이터 처리 기능인 Create(생성), Read(읽기), Update(갱신), Delete(삭제)를 묶어서 일컫는 말로 REST에서의 CRUD Operation 동작 예시는 다음과 같다.   
     >* Create : 데이터 생성(POST)
     >* Read : 데이터 조회(GET)
     >* Update : 데이터 수정(PUT 전체 업데이트, PATCH 부분 업데이트)
     >* Delete : 데이터 삭제(DELETE)

  * ### REST API는 어떤 목적을 달성하기 위해 나왔고 어떤 장점을 가지고 있나요?
    REST API란 REST의 원리를 따르는 API를 의미한다. 최근 OpenAPI(누구나 사용할 수 있도록 공개된 API: 구글 맵, 공공 데이터 등), 마이크로 서비스(하나의 큰 애플리케이션을 여러 개의 작은 애플리케이션으로 쪼개어 변경과 조합이 가능하도록 만든 아키텍처) 등을 제공하는 업체 대부분은 REST API를 제공한다.

    아래와 같은 특징이 있다.   
    1. 사내 시스템들도 REST 기반으로 시스템을 분산해 확장성과 재사용성을 높여 유지보수 및 운용을 편리하게 할 수 있다.
    2. REST는 HTTP 표준을 기반으로 구현하므로, HTTP를 지원하는 프로그램 언어로 클라이언트, 서버를 구현할 수 있다.
    3. HTTP 표준 프로토콜에 따르는 모든 플랫폼에서 사용이 가능하다. 특정 언어나 기술에 종속되지 않는다.
    
    REST API를 올바르게 설계하기 위해서는 지켜야 하는 몇가지 규칙이 있다. 
    1. URI는 동사보다는 명사를, 대문자보다는 소문자를 사용하여야 한다.
    2. 마지막에 슬래시 (/)를 포함하지 않는다.
    3. 언더바 대신 하이폰을 사용한다.
    4. 파일확장자는 URI에 포함하지 않는다.
    5. 행위를 포함하지 않는다.

  * ### RESTful한 API 설계의 단점은 무엇인가요?
    RESTful은 일반적으로 REST라는 아키텍처를 구현하는 웹 서비스를 나타내기 위해 사용되는 용어이다. ‘REST API’를 제공하는 웹 서비스를 ‘RESTful’하다고 할 수 있다.    

    __단점__
    * HTTP 프로토콜에 의존
    * URI 설계가 복잡할 수 있음
    * 상태 정보가 클라이언트 서버 간에 전송될 수 있음
    * 필요한 문서화와 테스트 등의 추가 작업 필요
    * 관리의 어려움과 좋은(공식화 된) API 디자인 표준이 없음

* ## CORS란 무엇인가요? 이러한 기능이 왜 필요할까요? CORS는 어떻게 구현될까요?
  CORS(Cross-Origin Resource Sharing)는 애플리케이션을 통합하기 위한 메커니즘이다. CORS는 한 도메인에서 로드되어 다른 도메인에 있는 리소스와 상호 작용하는 클라이언트 웹 애플리케이션에 대한 방법을 정의한다. 서버는 기본적으로 CORS 방식을 제한해둔다. 왜냐 하면, 특정 서버 리소스에 다른 임의의 웹 사이트들이 request를 보낼 수 있다면 악의적으로 특정 서버의 세션을 탈취하거나 서버에 무리가 가는 행위 등 문제가 생길 수 있는 행위를 할 수 있기 때문이다. 
  
  기본적으로 SOP(Same Origin Policy) 보안 모델을 따른다. 브라우저에서 서버로 요청을 보낼 때, 도메인 이름이 서로 다른 사이트 간에 공유를 설정하지 않고 `XMLHttpRequest`나 `fetch` API를 호출하면 오류가 생긴다. SOP는 같은 출처에 대한 http 요청만 허락한다.
  
  이를 해결하기 위해서는 API를 제공하는 API 서버쪽에서, `Access-Control-Allow-Origin`을 response header에 넣어주어 통신 가능하게 해줘야 한다.
  
  __Simple requests인 경우__    

  HTTP method가 다음 중 하나이면서
  * GET
  * HEAD
  * POST  

  자동으로 설정되는 헤더는 제외하고, 설정할 수 있는 다음 헤더들만 변경하면서    
  * Accept
  * Accept-Language
  * Content-Language
  
  `Content-Type`이 다음과 같은 경우
  * application/x-www-form-urlencoded
  * multipart/form-data
  * text/plain
  
  이 요청은 추가적으로 확인하지 않고 바로 본 요청을 보낸다.    

  __preflight requests(사전 요청)인 경우__    

  요청하는 origin 쪽에서, `Origin` 헤더에 현재 요청하는 origin과, `Access-Control-Request-Methods` 헤더에 요청하는 HTTP method 와, `Access-Control-Request-Headers` 헤더에 요청 시 사용할 헤더를, `OPTIONS` 메서드로 서버로 요청한다. 이때 내용물은 없이 헤더만 전송한다.  

  요청 헤더 목록:   
  * Origin : 현재 요청하는 origin
  * Access-Control-Request-Methods : HTTP method
  * Access-Control-Request-Headers : 요청 시 사용할 헤더

  메서드:
  * OPTIONS

  브라우저가 서버에서 응답한 헤더를 보고 유효한 요청인지 확인한다. 만약 유효하지 않은 요청이라면 요청은 중단되고 에러가 발생한다. 만약 유효한 요청이라면 원래 요청으로 보내려던 요청을 다시 요청하여 리소스를 응답받는다.

  ```js
  app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Origin', 'http://localhost:3000/');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
      res.header('Access-Control-Allow-Headers', 'Content-Type');
      return res.status(200).json({});
    }
    next(); 
  });
  ```

  응답 헤더 목록: 
  * Access-Control-Allow-Origin : 브라우저가 해당 origin이 자원에 접근할 수 있도록 허용. `*`은 credentials이 없는 요청에 한해서 모든 origin에서 접근이 가능하도록 허용.
  * Access-Control-Expose-Headers : 브라우저가 액세스할 수 있는 서버 화이트리스트 헤더를 허용
  * Access-Control-Max-Age : 얼마나 오랫동안 preflight요청이 캐싱 될 수 있는지를 나타냄.
  * Access-Control-Allow-Credentials : 
    * `Credentials`가 true 일 때 요청에 대한 응답이 노출될 수 있는지를 나타냄.
    * `preflight` 요청에 대한 응답의 일부로 사용되는 경우 실제 자격 증명을 사용하여 실제 요청을 수행할 수 있는지를 나타냄.
    * 간단한 GET 요청은 `preflight`되지 않으므로 헤더가 리소스와 함께 반환되지 않으면 브라우저에서 응답을 무시하고 웹 콘텐츠로 반환하지 않음.
  * Access-Control-Allow-Methods : `preflight` 요청에 대한 대한 응답으로 허용되는 메서드들을 나타냄.
  * Access-Control-Allow-Headers : `preflight`요청에 대한 대한 응답으로 실제 요청 시 사용할 수 있는 HTTP 헤더를 나타냄.

  # Questions

  * ## PUT/PATCH

  * ## alert, prompt

  * ## node_modules 한 프로젝트 내에 여러개 있으면 좋을까?

  * ## package.json 한 프로젝트 내에 여러개 있으면 좋을까?

  * ## binary로 이미지를 받았을 때, 안에 파일 이름이 없을 때, 파일 이름을 어떻게...? 어떻게 찾아서 client한테...?

  * ## Hoppscotch extention


