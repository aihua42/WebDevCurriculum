# Quest 05. OOP 특훈

## Introduction
* 이번 퀘스트에서는 바닐라 자바스크립트의 객체지향 프로그래밍을 조금 더 훈련해 보겠습니다.

## Topics
* Separation of Concerns
* 객체지향의 설계 원칙
  * SOLID 원칙
* Local Storage

## Resources
* [Separation of concerns](https://jonbellah.com/articles/separation-of-concerns/)
* [SOLID](https://en.wikipedia.org/wiki/SOLID)
* [객체지향 설계 5원칙](https://webdoli.tistory.com/210)
* [MDN - Local Storage](https://developer.mozilla.org/ko/docs/Web/API/Window/localStorage)

## My Resource
* [博客园](https://www.cnblogs.com/charon922/p/8643454.html)

## Checklist
* ### 관심사의 분리 원칙이란 무엇인가요? 웹에서는 이러한 원칙이 어떻게 적용되나요?
  컴퓨터 과학에서 관심사 분리(separation of concerns, __SoC__)는 컴퓨터 프로그램을 구별된 부분으로 분리시키는 디자인 원칙으로, 각 부문은 개개의 관심사를 해결한다. 관심사 분리를 이용하면 프로그램의 설계, 디플로이, 이용의 일부 관점에 더 높은 정도의 자유가 생긴다.   
  ([출처: 위키백과](https://ko.wikipedia.org/wiki/%EA%B4%80%EC%8B%AC%EC%82%AC_%EB%B6%84%EB%A6%AC))

  간단하게 말해서, SoC법칙이란 하나의 시스템 요소(혹은 모듈, 함수, 객체 등등)에서 여러가지의 관심사를 가지고 처리하는것이 아니라, 관심사를 여러개로 분리하여 하나의 관심사는 하나의 기능만 가지도록 구성하는 것아다. 어떤 요소도 다른 요소와의 책임을 공유하면 안되고, 그 요소와 관계가 없는 책임을 포함시킬 수 없다. SoC를 달성하는  프로세스는 시스템을 분리되지 않은 파트들로 조각 내는것이 아니라, 시스템을 반복되지 않고 응집력이 있는 책임들의 세트를 가진 요소들로 구성하게 된다.
  >관심사의 분리는 소프트웨어 개발에서 가장 기본이 되는 원칙. 비슷한 개념을 표현하는 여러 많은 단어들과 프로그래밍 격언들이 생겨났다:   
  >* 단일 책임 원칙, SRP(Single Responsiblility Principle): 관심사란 표현 대신 책임이란 용어를 사용. 각 모듈들은 책임(수행해야 하는 동작)을 가지고 있으며, 각기 하나의 책임만을 가져야 한다.     
  >* KISS(Keep It Simple, Stupid): 각 모듈들은 간단하고 단순하게 만들라. 여러 기능을 포함시켜 복잡하게 만들지 말고 하나의 기능만 수행하도록 하라.

  때문에 SoC의 종합적인 목표는 각각의 파트가 의미있고 직관적인 롤을 수행하지만 변화에 적응하는 능력을 극대화시킨, 잘 조직된 시스템을 설립하는 것이다.

  웹에서도 이러한 원칙이 적용된다. 일단 웹개발은 크게 frontend와 backend 개발로 나뉘는데, 프론트엔드는 사용자가 볼수 있는 화면, 즉 사용자 interface(User Interface, __UI__)를 말하고, 백엔드는 사용자가 보지 못하는 영역인 서버나 데이터베이스를 관리하는 기술이다.     
  
  우리는 앞에 quest에서 HTML라는 뼈대, 몸통에 CSS라는 살을 붙이고 옷을 입히는 작업을 했다. 그리고 javascript라는 프로그래밍 언어로 동작기능을 추가했다. 이는 프론트엔드에서의 관심사의 분리에 해당된다.   

  그리고 소프트웨어 엔지리어링에는 MVC 패턴이라고 하는것이 있는데,    
  >처리하는 부분: `C`ontroller    
  >출력 부분: `V`iew     
  >Controller와 View 간에 데이터를 주고 받는 객체: `M`odel       

  JavaSpring(java framework) MVC를 예로 들면,   
  1. 사용자 요청이 들어오면 Dispatcher-Servlet이라는 front controller가 입력을 처리하고 해당 Controller에게 넘겨준다.
  2. Controller에서 요청에 맞게 처리하고 해당 결과를 Model에 저장을 한 다음 그 Model을 View에게 전달한다.
  3. View에서는 작업 결과(Model)을 읽어서 응답을 만들어 client에게 전송한다.

* ### 객체지향의 SOLID 원칙이란 무엇인가요? 이 원칙을 구체적인 예를 들어 설명할 수 있나요?
  __OOP 5대 설계 원칙 - SOLID__   
  __`S`__`RP` Single Responsibility Principle: 단일 책임 원칙       
  >함수는 오직 하나의 변경의 이유만을 가져야 한다.    
  >하나의 함수는 하나의 역할만 수행해야 한다.   
  >함수를 적당히 잘 쪼개고 명확하게 만들면 문제가 발생했을 때의 확인을 해야 하는 코드의 양이 줄어든다.    
  >순수함수와 부수효과를 분리하는 구조를 적절히 잘 사용할줄 알아야 한다.   
  >
  ```js
  function getPassedStudents(students) {
    let result = students
      .filter((student) => {
      let sum = student.scores.reduce((sum, score) => sum + score, 0);
      let average = sum / student.scores.length;
      return average >= 60;
    })
      .map((student) => student.name);
    return result;
  }

  // better
  function getPassedStudents(students) {
    let result = students
      .filter(isPassed)  
      .map(getStudentName); 
    
    return result;
  }
  function isPassed(student) {
    let sum = student.scores.reduce((sum, score) => sum + score, 0);
    let average = sum / student.scores.length;
    return average >= 60;
  }
  function getStudentName(student) {
    return student.name;
  }
  ```   

  __`O`__`CP` Open Closed Principle: 개방 폐쇄 원칙     
  >확장에는 열려 있으나 변경에는 닫혀 있어야 한다.    
  >새로운 기능의 추가가 일어 났을 때에는 기존 코드의 수정 없이 추가가 되어야 한다.         
  >map, filter, reduce와 같은 메소드들이 대표적인 OCP
  ```js
  function getNewArray(array, option) {
    const result = [];
    array.forEach((number) => {
      switch (option) {
        case 'doubled':
          result.push(number * 2);
          break;

        case 'tripled':
          result.push(number * 3);
          break;

        case 'squared':
          result.push(Math.pow(number, 2));
          break;

        default:
          new Error('We do NOT have this option!');
          return false;
      }
    });

    return result;
  }

  // better
  function getNewArray(array, func) {
    const result = [];
    array.forEach((number) => {
      result.push(func(number));
    });

    return result;
  }

  const getDoubledArray = (array) => getNewArray(array, (x) => 2*x);
  const getTripledArray = (array) => getNewArray(array, (x) => 3*x);
  ```

  __`L`__`SP` Liskov Substitution Principle: 리스코프 치환 원칙     
  >프로그램의 객체는 프로그램의 정확성을 깨뜨리지 않으면서 하위 타입의 인스턴스로 바꿀수 있어야 한다.    
  >즉 상속(is-a)을 받은 하위 타입과 상위타입, 이 둘을 치환을 해도 프로그램에서는 문제가 없어야 한다.    
  >(Subclasses can be used to "replace" their parent class.)    
  >새{날다} => 앵무새{날다}, 펭귄{??}      
  >Rectangle{ get(), set() } => Square{ get(), set(width=height여야 함으로 충돌이 생김) }       
  >
  ```js
  class Rectangle {
    constructor(width, height) {
      this.width = width;
      this.height = height;
    }

    setWidth(length) {
      this.width = length;
    }
    setHeight(length) {
      this.height = length;
    }
    getArea() {
      return this.width * this.height;
    }
  }

  class Square extends Rectangle {
    setWidth(length) {
      this.width = length;
      this.height = length;
    }
    setHeight(length) {
      this.height = length;
      this.width = length;
    }
  }

  const rectangle = new Square();
  rectangle.setWidth(5);
  rectangle.setHeight(4);
  console.log(square.getArea());  // 16
  ```
  >함수형에서는, 먼저 선언된 조건들과 나중에 선언된 조건들이 서로 충돌이 나는것을 방지해야 한다는 원칙으로 접근. 즉 infinite cycle을 만들지 말아야 한다.

  __`I`__`SP` Interface Segregation Principle: 인터페이스 분리 원칙     
  >사용자가 필요하지 않은 것들에 의존하게 되지 않도록, 인터페이스를 작게 유지.     
  >인터페이스를 기능별로 나누어, 클래스마다 필요한 인터페이스를 가져다 쓰게 해야 한다.     
  >함수형에서는, 하나의 모듈에 너무 많은 기능들을 넣어서 덩치를 키우지 말자!    

  __`D`__`IP` Dependency Inversion Principle: 의존 역전 원칙 
  >상위 레벨 모듈이 하위 레벨 세부 사항에 의존해서는 안된다.        
  >추상적인 것은 구체적인것에 의존하지 말아야 한다. 구체적인 것은 추상화에 의존해야 한다.     
  >(Abstractions should not depend on details. Details should depend on abstractions.)    
  >시스템과 시스템이 정보를 주고 받을 때, 직접 호출하는것보다 추상화된 interface를 통해야 한다.    
  >DIP는 추상화한 class/interface를 통해 OCP를 이루게 해준다.

  <br>

  SOLID 설계 원칙은 OOP의 4가지 특징(추상화, 상속, 다형성, 캡슐화)와 더불어, 객체 지향 프로그래밍의 근간이 된다. 좋은 소프트웨어는 변화에 대응을 잘 해야 한다. 예상하지 못한 변경사항이 발생하더라도, 유연하게 대처하고 이후에 확장성이 있는 시스템 구조를 만들어야 한다. SOLID 객체 지향 원칙을 적용하면 __코드를 확장__ 하고, __유지보수 관리__ 하기가 더 쉬워지며, 불필요한 __복잡성을 제거__ 해, 리팩토링에 소요되는 시간을 줄임으로써 프로젝트 __개발의 생산성__ 을 높일수 있다.
* ### 로컬 스토리지란 무엇인가요? 로컬 스토리지의 내용을 개발자 도구를 이용해 확인하려면 어떻게 해야 할까요?
  웹 스토리지란, 서버가 아닌 client 내에서 데이터를 저장할수 있도록 지원하는 저장소를 의미한다.    
  웹 스토리지는 쿠키의 단점을 보완하기 위해서 HTML5에서 추가된 "로컬 스토리지 / 세션 스토리지"를 의미한다.

  로컬 스토리지는 만료기간이 존재하지 않으며 페이지를 변경하거나 브라우저를 닫아도 반 영구적으로 유지되는 저장소이다. (반면, 세션 스토리지는 페이지를 닫으면 사라진다.)
  * 직접 로컬 스토리지를 초기화하거나 제거하지 않는다면 만료기간이 존재하지 않는다.
  * 페이지를 변경하거나 브라우저를 닫더라도 값은 유지된다.
  * 도메인이 다른 경우에는 로컬 스토리지 공유가 불가능하다.  

  로컬 스토리지를 확인하는 방법은 개발자 도구(`inspect`)를 켜서 `Application`탭을 클릭하면 된다.   
  또한 javascript를 사용하여 로컬 스토리지에 저장된 데이터를 다룰수 있다.    
  로컬 스토리지에서는 다음과 같은 메서드들을 사용한다.
  >setItem(key, value)    
  >getItem(key)     
  >key(index)      
  >removeItem(key)      
  >clear()      
  >length 로컬 스토리지에 저장된 데이터 개수    

  ```js
  const controlLocalStorage = () => {
    // 저장
    // key, value
    localStorage.setItem('userId', 'ava42'); // window.localStorage
    
    // Object or Array
    const userInfoObj = {
      userId: 'jane24',
      userAge: 30
    };
    localStorage.setItem('userInfoObj', JSON.stringify(userInfoObj)!); 

    // 불러오기
    const item = localStorage.getItem('userId');
    const obj = JSON.parse(localStorage.getItem('userInfoObj')!);
    const item0 = localStorage.key(0);

    // 삭제
    localStorage.removeItem('userId');

    // 초기화
    localStorage.clear();

    // 데이터 개수
    const len = localStorage.length;
  };
  ```               
  