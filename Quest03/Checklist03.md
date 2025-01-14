# Checklist 03. 자바스크립트와 DOM

## 자바스크립트는 버전별로 어떻게 변화하고 발전해 왔을까요?
   1995년 Netscape는 HTML 페이지에 경량의 프로그램 언어를 통하여 interactive한 웹 페이지를 만들고 싶어했다. 그리하여 Brendan Erich가 10일만에 javascript의 시초인 Mocha를 만들어내게 된다. 1997년에 초판이 세상에 나오게 되고 페이지의 문서 객체 모델(DOM)을 다루어 컨텐츠와 스타일을 변화하고, 요소를 보여주거나 숨기는것과 같은 것들을 가능하게 되었다. 그 뒤로 계속 새로운 기능들을 추가하면서 발전하게 되었는데, 특히 2009년에 ES5를 발표하면서 javaScript의 기능이 크게 개선되었다.   
   <br>
   javaScript는 버전별로 지속적으로 발전해오고 있었으며 가장 최신 버전은 2019년 6월에 발표한 ES2019이다.

  * ### 자바스크립트의 버전들을 가리키는 ES5, ES6, ES2016, ES2017 등은 무엇을 이야기할까요?   
    ES5, ES6, ES2016, ES2017 등은 ECMAScript의 버전을 가리키는 용어다.
    * __ES5:__ 2009년에 발표. 배열에 forEach, map, filter, reduce, some, every와 같은 메소드 지원; Object에 대한 getter/setter 지원; 자바스크립트 strict 모드 지원; JSON 지원; Function.prototype.bind 메소드 도입.
    * __ES6:__ 2015년 발표. let, const 추가; arrow 문법 지원; class 문법 도입; iterator/generator 추가; module import/export 추가; Promise 도입; 객체 리터럴 문법이 확장.
    * __ES2016:__ 거듭제곱연산자 ** 추가, Array.prototype.includes() 추가
    * __ES2017:__ Object.entries() Object.values() 추가; 객체 리턴 단축 문법 도입; 비동기 함수 async - await 추가; 문자열에 패딩을 추가하기 위한 padStart와 padEnd 메소드 도입.

  * ### 자바스크립트의 표준은 어떻게 제정될까요?
    JavaScript는 ECMAScript 사양을 준수하는 범용 scripting 언어다. ECMASCript는 _Ecma international_ 에 의해 제정된 ECMA-262 기술 규격에 의해 정의된다. ECMA-262 표준은 TC39(ECMA Technical Committee 39)라는 위원회에서 하는데 표준화 과정에서는 다양한 관계자들의 의견을 수렴하여 이를 바탕으로 규격을 개정한다.

    <br>
    ECMA-262는 연도별로 번호가 붙은 버전을 발표한다. 위에서 말한 ES5, ES6, ES2016, ES2017은 모두 JavaScript 표준들이다. 뒤로 갈수록 앞의 버전의 단점을 보완하고 더욱 강력한 기능들을 제공해준다.


## 자바스크립트의 문법은 다른 언어들과 비교해 어떤 특징이 있을까요?
   1. ### prototype 기반 객체 지향 언어
      javaScript는 prototype을 상속하는 객체지향 언어이다. javaScript에서는 객체 생성 이후에도 property, method 등을 동적으로 추가하거나 삭제할수 있다는 점이 class 기반 객체 지향 언어와 다르다.   
      반면 java나 c++는 class를 이용해 객체를 생성하는 class 기반 객체 지향 언어이다.
   2. ### 동적 타입 지원 언어
      javaScript는 변수 타입이 없다. 따라서 변수에 저장하는 데이터 타입이 동적으로 바뀔수 있다.    
      반면 java나 c++는 실행되기 전에 변수 타입이 결정되기 때문에 정적 타입 언어이다.
   3. ### 함수형 언어
      javaScript에서 함수는 1급 객체이다. 즉 변수에 할당할수 있고, 다른 함수의 인자로 들어갈수 있고, 다른 함수의 결과로서 리턴될수 있다. 객체 내에 포함되어 있지 않으면 함수이고, 포함되어 있으면 메소드라고 한다. 다른 함수의 인자로 들어가는 함수를 callback 함수라고 한다. 이런 특징들을 이용해서 고차 함수를 구현할수 있다.

      반면 java에서는 클래스를 떠나 함수가 따로 존재할수가 없다. java는 이러한 class 내의 함수를 메소드라고 한다.
   4. ### 동기와 비동기가 모두 가능한 언어
      javaScript는 single thread 기반인 동기적인 언이이다. 여기서 single thread란 한번에 한가지 동작만 가능하다는걸 의미한다. javaScript는 호출된 함수들을 저장하는 call stack이 하나밖에 없다. 때문에 JS엔진은 call stack 안에 함수들을 나중에 들어온것부터 하나 하나씩 처리하는데, 하나가 다 처리되어 제거되어야만 next task로 넘어간다.   

      하지만 우리는 DOM 이벤트, setTimeout() 같은 Web API를 통해 코드를 비동기적으로 실행시킬수 있다. Event Loop이 Web API에 의해 처리된 callback을 Callback queue에 넣어 저장하고 있다가 코드 실행 중간에 call stack이 비어있으면 call stack으로 넘겨준다. 이런 식으로 앞에서 process 중간에 응답이 안된 요청이 있어도 그냥 지나갔다가 지정한 순간에 pass한 요청을 응답해줄수 있다.
   5. ### interpreter 언어
      javaScript는 소스코드를 한줄 한줄 읽어가며 명령을 바로 처리하는 interpreter 언어이다. 소스코드를 한꺼번에 번역해서 실행하는 compiler 언어보다 프로그램 수정이 간단한 강점이 있다.    
      c나 c++이 compiler 언어이다.
   5. ### 문법이 간단한 언어
      코드가 간결하고 읽기도 쉽다. 콜론이 빠져도 실행이 된다.
  
  * 자바스크립트에서 반복문을 돌리는 방법은 어떤 것들이 있을까요?
    * for
      ```js
      for (let i = 0; i < 3; i++) {
        /// do something
      }
      ```
    * while
      ```js
      let i = 0
      while (i < 3) {
        /// do something
        i++;
      }
      ```
    * do-while
      ```js
      let i = 0;
      do {
        /// do something
        i++;
      } while (i < 3);
      ```
    * for...of
      ```js
      const fruits = ['apple', 'peach', 'grapes'];
      for (let fruit of fruits) {
        /// do something
      }
      ```
    * for...in
      ```js
      for (let key in fruits) {
        /// do something
      }
      ```   

    * 그외: forEach(), filter(), map(), reduce() 등의 배열 메소드

## DOM 
   DOM(문서 객체 모델)은 웹 페이지의 컨텐츠 및 구조, 그리고 스타일 요소를 구조화시켜 표현하여 프로그래밍 언어가 해당 문서에 접근하여 읽고 조작할 수 있도록 API를 제공하는 일종의 interface 이다.    
   그동안 HTML 문서에 직접 tag로 작성하는 정적 생성을 했다면, 지금부터 우리는 javaScript를 이용해 HTML 문서에 없는 노드를 만들어 이어붙여 웹 페이지에 rendering되게 만드는 동적 생성을 할수 있다.   

   <img src="./images/2023-11-27-12-08-17.png" width="700" height="400">         
   <br>
   DOM은 HTML 문서를 계층적 구조와 정보로 표현하며, 이를 제어할수 있는 프로퍼티와 메소드를 제공하는 tree 자료구조이다. 따라서 HTML DOM 혹은 HTML DOM TREE라고 부르기도 한다. HTML문서는 최종적으로 하나의 최상위 노드(Node)에서 시작해 자식 노드들을 가지며, 아래로만 뻡어나가는 구조로 만들어지게 된다.             
   <br>
   <br>

   ![](./images/2023-11-24-18-25-24.png)   

  >__document node:__ 최상위 루트 노드를 나타내며, `document` 객체를 가리킨다. `window` 객체의 `document` property로 바인딩 되어있어 `window.document`, `document`로 참조해 사용할수 있다.   
  >__element node:__ 모든 HTML 요소가 여기에 속한다. 속성 노드를 가질수 있는 유일한 노드로서, 부모-자식 관계를 가지게 되기 때문에 계층적인 구조를 이룬다.   
  >__attribute node:__ 모든 HTML 요소의 속성은 여기에 속한다. 부모 노드가 아닌 해당 요소 노드와 바인딩 되어있다.    
  >__text node:__ HTML문서의 모든 텍스트가 여기에 속한다. 가장 마지막에 위치한 자식 노드이다.   

   * ### `document` 객체
     `document`, `element`, `HTMLCollection`, `NodeList`, `NamedNodeMap`은 DOM의 몇가지 중요한 데이터 타입들이다. 여기서 `document` 객체는 웹 페이지 그 자체를 의미한다.
     >Array.from(유사 배열)로 유사 배열을 Array로 변환해줄수 있다.      
     
   * ### DOM 조작을 위한 함수와 속성들
     [MDN](https://developer.mozilla.org/ko/docs/Web/API/Element/attributes)  
     [w3school](https://www.w3schools.com/jsref/dom_obj_document.asp)        
     [devdic](http://www.devdic.com/)        
     <br>
     
     __window method__
     >alert()      
     >console.log()          
     >console.group('group name')       
     >console.groupEnd()         
     >console.dir(navigator)   // navigator는 from BOM              
     >confirm()    // boolean 리턴, 사용자의 피드백을 수집           
     >prompt()    // 사용자한테서 입력값을 받는다.      
     >getComputedStyle(node) // inline 포함 모든 css 속성     
     >window.open(url, '_self'/'_blank'/'ot', 새창 모양 속성)       
     >window.close()        
     >window.onload = function  //  script가 적용하려는 선택자전에 선언되어도 이 메소드를 이용해 실행가능하게 한다.                         

     __Document property__
     >document.documentElement     
     >document.head         
     >document.title    
     >document.body                   
     >document.forms    
     >document.URL    
     >document.images    
     >document.scripts     
     >document.lastModified       
     >document.referrer

     __Document method__ 
     >document.createTextNode(text)        
     >document.createElement(tag name)             
     >document.importNode(externalNode, true=자식까지)  // new DocumentFragment()로 새로운 문서를 만들어주고, original 요소를 새 문서에 넣어줌. reflow에 영향 안줌                      
     >document.createDocumentFragment()    // 가상의 문서를 만들어줌, reflow에 영향 안줌              
     >document.getElementById()     // Element      
     >document.getElementsByTagName()  // HTMLCollection 반환. *을 넣으면 전체 선택자      
     >document.getElementsByClassName()  // HTMLCollection 반환      
     >document.getElementsByName()   // 요소안의 name에 해당되는 값을 NodeList로 반환     
     >document.querySelector()      // css 선택자를 넣어준다(# . 까지 다), first Element          
     >document.querySelectorAll()   // css 선택자를 넣어준다(# . 까지 다), NodeList 반환      
     >document.open()   // 현재 브라우저의 content를 지우고 새로운 페이지 시작   
     >document.close()  // 위에서 지운 걸 보여줌    
     >document.clear()       
     >document.write()   // 문자를 쓴다.   
     >document.writeIn()  // 새로운 줄에서 문자를 쓴다        

     __NodeList property, method__
     >length       
     >item()      
     >entries()    // 반복 가능한 iterator를 반환       
     >forEach()      
     >keys()       
     >values()     
         
     __Node/Element property__
     >offsetParent  // 위치이 기준을 반환, body, table같은 static element     
     >clientWidth       
     >clientHeight
     >nodeType     // node type 번호를 반환        
     >nodeName              
     >nodeValue      
     >data     
     >childNodes   // 주석, space, 줄바꿈 포함 모든 node. Live NodeList        
     >children     //  Element만        
     >firstChild      
     >firstElementChild   
     >lastChild        
     >lastElementChild        
     >parentNode   
     >parentElement      
     >nextSibling     
     >nextElementSibling     
     >previousSibling      
     >previousElementSibling    
     >tagName       // 읽기 전용      
     >className     // 모든 class name을 문자열 하나로    
     >style        // CSSStyleDeclaration 반환, inline css style만 뽑아올수 있다             
     >innerHTML    // 안의 html이나 xml 마크업   
     >outerHTML    // 자기 자신을 포함한 html이나 xml 마크업     
     >innerText    // 안의 사용자에게 보여지는 html을 text로   
     >textContent  // 안의 text 부분  
     >classList     // DOMTokenList      
     >attributes    // namedNodeMap      

     __Node/Element method__
     >getBoundingClientRect()                  
     >getElementsByClassName()      // HTMLCollection 반환        
     >append()      // 부모 노드 내부의 끝에 여러개 노드 혹은 DOM string 삽입        
     >appendChild()   // 부모 노드 내부의 끝에 자식 노드 하나만 삽입     
     >appendData()       
     >prepend()       // 부모 노드 내부의 시작부분에 삽입    
     >prependChild()   // 부모 노드 내부의 시작부분에 자식 노드 하나만 삽입       
     >insertBefore(newNode, refNode)    // 부모 노드 내부의 refNode 앞에 newNode 삽입   
     >insertAfter(newNode, refNode)     // 부모 노드 내부의 refNode 뒤에 newNode 삽입   
     >insertData()      
     >before()       //  선택한 노드 뒤에 추가   
     >after()       //   선택한 노드 앞에 추가            
     >insertAdjacentHTML(position, HTML string)   // 삽입. position: beforebegin, afterend, afterbegin, beforeend. 주의: script태그까지 파싱하기 때문에 보안에 위험          
     >cloneNode(true=자식까지)   // 복제           
     >parentNode.removeChild()   // 자식 노드 지우기      
     >deleteData(시작점, 끝점)      
     >replaceChild(newNode, replacedNode)    
     >replaceData(시작점, 오려내는 길이, 집어넣는 data)     
     >subStringData(시작점, 추출내는 길이)     // 추출     
     >hasChildNodes()   // 현재 노드에 자식 유무       
     >contains()      
     >getAttribute(attrname)   // 속성에 접근      
     >getAttributeNode(attrname)         
     >setAttribute(attrname, attribute)   // 속성에 접근       
     >setAttributeNode(attribute)      
     >hasAttribute(name)       // 속성에 접근     
     >removeAttribute(name)     // 속성에 접근       
     >isEqualNode()      // 구조, 내용 등등이 같으면 equal     
     >isSameNode()       // reference the same object      
     >addEventListener('click/mouse.../load/...', callback)          
     >onclick = function                  

     __classList method__
     >classList.add()       //  class 여러개 추가할수 있다, 일일이 열거    
     >classList.remove()    //  class 여러개 제거할수 있다, 일일이 제거      
     >classList.item(Number)   // 클래스 값 반환            
     >classList.replace(oldClass, newClass)  // 새로운 클래스로 교체         
     >classList.toggle(class name[, true=추가])     // 존재하면 제거하고 false 반환, 없으면 추가하고 true 반환.     
     >classList.contains()   // 존재 여부 확인       

     __css style property, method__
     >cssText     // CSSStyleDeclaration 객체에 적용        
     >length      
     >parentRule     
     >getPropertyValue()       
     >getPropertyPriority()    // 'important' 또는 빈 문자열 반환     
  
   
## 자바스크립트를 통해 DOM 객체에 CSS Class를 주거나 없애려면 어떻게 해야 하나요?
   classList.add()  // 여러개    
   classList.remove()  // 여러개 가능      
   classList.replace(oldClass, newClass)  // 새로운 클래스로 교체     
   classList.toggle()  // 있으면 지우고 없으면 추가
   
  * ### IE9나 그 이전의 옛날 브라우저들에서는 어떻게 해야 하나요?
    className을 사용하면 된다. 하지만 한번에 하나씩만 넣거나 덮어쓸수 있다. 또한 중복하여 추가될수 있다.
    ```js
    Element.className += ' class1';   // class 추가
    Element.className = '';   // class 모두 제거
    Element.className = 'class2'; // class 변경
    Element.className = Element.className.replace('class3', ''); // 지정 class 지우기 또는 바꾸기
    // toggle
    const classNameAll = Element.className;  
    if (classNameAll.indexOf('enabled') > -1) {
      Element.className = classNameAll.replace('enabled', '');
    } else {
      Element.className = classNameAll + ' enabled';
    }
    ```

## 자바스크립트의 변수가 유효한 범위는 어떻게 결정되나요?
   전역에서 선언되면 전역변수이다. 때문에 어느 곳에서도 접근 가능해진다.<br>
   지역에서 선언되었을 때는 두가지로 나뉜다:    
   1. function scope: `var`같은 경우에는 함수 내부에서 선언될 때만 지역변수가 된다.
   2. block scope: `let`과 `const`는 블록 변수이기 때문에, 블록 안에서 선언 되기만 하면 지역 변수가 된다. 
   
   그리고 지역 변수는 그 지역내에만 접근 가능하다.

  * ### `var`과 `let`으로 변수를 정의하는 방법들은 어떻게 다르게 동작하나요?
    `var`는 값의 변경이 가능하고, 같은 변수명을 재선언이 가능하다.    
    `let`은 값의 변경은 가능하지만, 전역 또는 같은 지역내에서 같은 변수명으로 재선언이 불가능하다. 
    


## 자바스크립트의 익명 함수는 무엇인가요?
   익명함수란 이름이 없는 함수를 뜻한다. 변수에 함수를 저장하는 방식으로 다른 함수의 매개변수로 사용될수 있다. 하지만 주의할 점은, 변수에 함수를 저장하게 되면 호이스팅이 적용되지 않는다.    

  * ### 자바스크립트의 Arrow function은 무엇일까요?
    함수를 간단하게 표현한 형태이다. arrow를 사용해서 간결하게 함수를 만들수 있다.
    ```js
    let printHello = function() {
      console.log('Hello!');
    };
    ```
    아래처럼 간단하게 쓸수 있다.
    ```js
    let printHello = () => console.log('Hello!');
    ```