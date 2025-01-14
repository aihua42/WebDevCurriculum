# Quest 11. RDB의 기초와 ORM
데이터베이스를 다루는 방법

## Topics
* RDBMS
* MySQL
* ORM
* Hash
  * scrypt

## Resources
* [MySQL 101 – The basics](https://www.globo.tech/learning-center/mysql-101-basics/)
* [Sequelize](https://sequelize.org/)
* [안전한 패스워드 저장](https://d2.naver.com/helloworld/318732)

# Checklist
* ## RDBMS 테이블의 정규화는 무엇인가요?
  __관계형 데이터베이스(Relational Database, RDB)__
  >관계형 데이터베이스는 데이터가 하나 이상의 열과 행의 테이블(또는 '관계')에 저장되어 서로 다른 데이터 구조가 어떻게 관련되어 있는지 쉽게 파악하고 이해할 수 있도록 사전 정의된 관계로 데이터를 구성하는 정보 모음이다. 관계는 이러한 테이블 간의 상호작용을 기반으로 설정되는 여러 테이블 간의 논리적 연결이다.  
  >* 데이터(data): 각 항목에 저장되는 값.    
  >* 테이블(table 또는 relation): 정의된 열의 데이터 타입대로 작성된 데이터가 행으로 축적.    
  >* 칼럼(column 또는 field): 테이블의 한 열      
  >* 레코드(record 또는 tuple): 테이블의 한 행에 저장된 데이터     
  >* 키(key): 테이블의 각 레코드를 구분할 수 있는 값. 기본키(primary key)와 외래키(foreign key) 등이 있다. 기본 키(primary key)는 주 키 또는 프라이머리 키라고 하며, 관계형 데이터베이스에서 조(레코드)의 식별자로 이용하기에 가장 적합한 것을 관계 (테이블)마다 단 한 설계자에 의해 선택, 정의된 후보 키를 말한다. 외래 키(외부 키, Foreign Key)는 한 테이블의 필드(attribute) 중 다른 테이블의 행(row)을 식별할 수 있는 키를 말한다.
     
  __관계형 데이터베이스 관리 시스템(Relational Database Management System, RDBMS)__
  >관계형 데이터베이스를 만들고 업데이트하고 관리하는 데 사용하는 프로그램이다. 잘 알려진 RDBMS의 예로는 MySQL, Microsoft SQL Server, Oracle Database 등등이 있다.

  __정규화(Normalization)__
  >관계형 데이터베이스(RDBMS)의 설계에서 데이터를 중복 없이 효율적으로 저장하기 위한 과정이다. 이를 통해 데이터베이스의 구조가 불필요한 중복을 최소화하고 데이터의 일관성과 무결성을 유지할 수 있게 된다.   
  * `제1 정규화 (1NF)`:  테이블의 컬럼이 하나의 값을 갖도록 테이블을 분해.   

    before:
    | No.    | Name    | Subject          |
    | :---:  | :-----: | :------:         |
    | 1      | Ava     | math, science    |
    | 2      | Brian   | science, Spanish |
    | 3      | Cathy   | math, physics    |    

    after:
    | No.   | Name           | Projects      |
    | :---: | :------------: | :-----------: |
    | 1     | Ava            | math          |
    | 1     | Ava            | science       |
    | 2     | Brian          | science       |
    | 2     | Brian          | Spanish       |
    | 3     | Cathy          | math          |
    | 3     | Cathy          | physics       |

  * `제2 정규화 (2NF)`: 완전 함수 종속을 만족하도록 테이블을 분해. 부분 함수 종속을 제거.     
    >A, B가 각각 관계 R의 속성이고 B가 A에 함수 종속(A→B)인 경우, A의 임의의 부분 집합에 대하여 B의 어떤 값도 A의 부분 집합의 값에 대응하지 않으면 B는 A에 완전함수(적) 종속이라고 한다.

    before:
    | 학생번호 | 과목 | 선생님 | 성적 |  
    | :-----: | :----:| :-----: | :------: |                  
    | 1      | 수학 | 김**    | A  |
    | 1      | 영어 | 이**    | B  |     
    | 2    | 물리  | 구** |  A  |
    | 2   | 수학   | 김** |  B  |
    | 3   | 화학  | 양**  |  A   |
    | 3 | 물리 | 구** | A  |

    after:   
    | 학생번호 | 과목 |  성적 |  
    | :-----: | :----:|  :------: |                  
    | 1      | 수학 |  A  |
    | 1      | 영어 |  B  |     
    | 2    | 물리  |   A  |
    | 2   | 수학   |  B  |
    | 3   | 화학  |   A   |
    | 3 | 물리 |  A  |

    | 과목 | 선생님 | 
    | :------: | :---: |                 
    | 수학  | 김** |
    | 영어  | 이** |    
    |  물리  | 구** |
    |  화학   | 양** |

    학생번호, 과목 -> 성적    
    과목 -> 선생님

  * `제3 정규화 (3NF)`: 이행적 종속을 없애도록 테이블을 분해. 이행적 종속이라는 것은 A->B, B->C가 성립할 때 A->C가 성립되는 것을 의미.    
    >A, B, C가 각각 관계 R에 상호 중복되지 않는 속성(다만, A는 1차 키 이외의 속성)인 경우에, A가 B에 함수 종속적이 아니면 이때 C는 A에 이행함수 종속이라고 한다. 제2정규형(2NF)의 관계에 이행함수 종속성이 있는 경우, 그것을 배제하고 분해한 관계를 제3정규형(3NF)이라고 한다. A->B 이고 B->C 일 경우에만 A->C 이면 이행함수(적) 종속이라고 한다.

    before;
    |고객 아이디|아이템|가격|
    |:--:|:--:|:--:|
    |1|랩탑|x|
    |1|폰|y|
    |2|랩탑|x|
    |3|태블릿 PC|z|
    |3|랩탑|x|   
    
    after:
    | 고객 아이디 | 아이템 |
    | :-------: | :----: |
    | 1 | 랩탑 |
    | 1 | 폰 |
    | 2 | 랩탑 |
    | 3 | 태블릿 PC |
    | 3 | 랩탑 |

    | 아이템 | 가격 |
    | :--: | :--: |
    | 랩탑 | x |
    | 폰 | y |
    | 태블릿 PC | z |

    고객 아이디 -> 아이템    
    아이템 -> 가격   

 * `BCNF(Boyce-codd Normal Form)`: 모든 결정자가 후보키가 되도록 테이블을 분해.        
   >후보 키(candidate key)는 관계형 데이터베이스의 관계형 모델에서 수퍼 키 중 더 이상 줄일 수 없는(irreducible) 형태를 가진 것을 말한다. 더 이상 줄일 수 없다는 것은 수퍼 키를 구성하는 속성(열) 중 어느 하나라도 제외될 경우 유일성을 확보할 수 없게 되는 것을 말한다. 최소(minimal)라고도 한다.     

   >슈퍼키는 레코드를 유일하게 식별해낼 수 있는 속성들의 집합이다. 한 개의 테이블은 여러 개의 슈퍼키를 가질 수 있다.

    before:
    | 학생번호 | 과목 | 지도교수 |
    | :--: | :--: | :--: |
    | 1 | c | 김** |
    | 1 | java | 정** |
    | 2 | c++ | 박** |
    | 3 | c | 김** |

    after:
    | 학생번호 | 지도교수 |
    | :--: | :--: |
    | 1 | 김** |
    | 1 | 정** |
    | 2 | 박** |
    | 3 | 조** |

    | 지도교수 | 과목 |
    | :--: | :--: |
    | 김** | c |
    | 정** | java |
    | 박** | c++ |

  * `제4 정규화 (4NF)`: 다치 종속을 제거.    
    >예를 들어 {과목} ->> {교재}, 과목이 교재를 다치 결정할때, 과목 attribute가 교재 attribute의 값 하나를 결정하는 것이 아니라, 여러 개의 값, 즉 값의 집합을 결정한다.

    before:
    | 수업 | 교재 | 강사 |
    | :--: | :--: | :--: |
    | geometry | A | 김** |
    | geometry | B | 김** |
    | geometry | A | 이** |
    | algebra | A | 이** |

    after:
    | 수업 | 교재 |
    | :--: | :--: | 
    | geometry | A |
    | geometry | B |
    | algebra | A |

    | 수업 | 강사 |
    | :--: | :--: |
    | geometry | 김** |
    | geometry | 이** |
    | algebra| 이** |

  * `제5 정규화 (5NF)`: 조인 종속을 제거.     
    >테이블 R이 R의 속성의 부분집합을 가지는 여러 개의 테이블들을 조인하여 만들어질 수 있을 때, R은 조인 종속성을 가진다

    before:
    | 개발자 | 자격증 | 언어 |
    | :--: | :--: | :--: |
    | 김** | A | c |
    | 김** | B | c++ |
    | 김** | A | c++ |
    | 정** | C | java |

    after:
    | 개발자 | 자격증 |
    | :--: | :--: |
    | 김** | A |
    | 김** | B |
    | 정** | C |

    | 개발자 | 언어 |
    | :--: | :--: |
    | 김** | c |
    | 김** | c++ |
    | 정** | java |

    | 자격증 | 언어 |
    | :--: | :--: |
    | A | c |
    | B | c++ |
    | A | c++ |
    | C | java |

* ## MySQL 외의 RDB에는 어떤 것들이 있나요?
  * Oracle database: 현재 유닉스 환경에서 가장 잘 쓰이고 있는 오라클 회사에서 개발한 시스템, 
  * Microsoft SQL Server: 마이크로 소프트사에서 개발하여 독점 배포하고 있는 시스템, 보안에 뛰어나고, 안정성이 우수, 다양한 애플리케이션에 적용, 초대용량 데이터 플랫폼으로 처리 가능, 데이터베이스 관리에 용이.
  * PostgreSQL: 오픈소스 DBMS, 객체-관계형 데이터베이스 시스템(ORDBMS). 전 세계 사용률은 상위 3개의 DB(Oracle DB, MySQL, Microsoft SQL)에 이어 4위. 데이터를 안전하게 저장하고 다른 응용 소프트웨어로부터의 요청에 응답할 때 데이터를 반환, macOS 서버의 경우 PostgreSQL은 기본 데이터베이스.
  * MS Access: 마이크로 소프트의 대표적인 개인용 데이터베이스 관리 시스템, Office 플로그램에서 제공 SQL과 연동이 잘됨, 윈도우에서만 사용이 가능.

  ### Relational Database 외에 다른 DB에는 어떤 것들이 있을까요?
  * 계층형: 폴더와 파일 등의 계층 구조로 데이터를 저장하는 방식. 데이터의 관계를 트리 구조로 정의. 부로-자식 형태.
    >장점: 데이터의 액세스 속도가 빠름, 데이터의 사용량 쉽게 예측.   
    >단점: 상하 종속적인 관계로 구성되어 초기 셋팅후 프로세스 수용이 어려움.
  * 네트워크형: 네트워크상의 노드 형태로 논리적이게 표현하는 방식. 각각의 노드를 서로 대등한 관계로 구성.
    >장점: 계층형의 데이터 중복 문제 해결, 상하 종속적 관계 해결.    
    >단점: 추후 변경이 복잡한 구조.
  * 객체지향: 객체 그대로를 DB의 데이터에 저장. 객체 관계 데이터베이스(object-relational database; ORD, ORDB) 또는 객체 관계형 데이터베이스 관리 시스템(object-relational database management system; ORDBMS)은 객체지향 데이터베이스 모델을 가진 관계형 데이터베이스 관리 시스템(RDBMS, 관계 데이터베이스)을 말한다. 소프트웨어 개발자가 스스로 데이터 형과 메서드(이 두 조합은 객체 지향에서 말하는 객체의 클래스에 해당)를 자유롭게 정의하여 데이터베이스를 개발할 수 있는 데이터베이스 관리 시스템 (DBMS)이다.
    >장점: 멀티미디어 데이터의 원활한 처리, RDB의 비즈니스형 데이터 타입만 처리되는 제한적 극복.
  * NoSQL: key-value 의 형태로 저장되는 DB, 키를 사용해 데이터 관리 및 접근. 스키마 없음 (데이터가 구조화되는 방식). 관계 없음. Join이 존재하지 않고, 데이터를 가져올때 컬렉션에 있는 데이터를 복제하여 필요한 부분만 가져옴. 관계를 맺는 데이터가 자주 변경될 때 사용. 비정형 데이터 (텍스트 음성, 이미지 등)을 다룰수 있음. key-value: Redis, AWS DynamoDB, Oracle Berkely, ...; Document: MongoDB, OrientDB, ...; graph: OrientDB, ...
    >장점: 스키마가 없기 때문에 훨씬 더 유연함. 데이터는 애플리케이션이 필요로 하는 방식으로 저장됨, 그래서 데이터를 읽어오는 속도가 빠름.    
    >단점: 데이터가 여러 컬렉션에 중복되어 있기 때문에, 수정(UPDATE)을 해야 하는 경우, 모든 컬렉션에서 해야 함.
  * 시계형: 시간에 따라 저장됨. 시간 경과에 따른 변화를 추적하는데 용이.
    >장점: 빠른 처리 속도, RDB는 데이터의 양이 증가함에 따라 성능이 급격히 느려지는 경향이 있고 특히 테이블에 인덱싱이 걸려있다면 인덱싱의 재정렬 등에 의해 퍼포먼스는 점점 더 떨어지게 됨; 반면에 TSDB의 인덱스는 시간에 따라 축적된 데이터에 최적화되어있기 때문에, 시간이 지나도 데이터를 수집하는 속도가 느려지지 않는다.      
    >단점: INSERT와 SELECT에 최적화되어 DELETE나 UPDATE에 대한 기능이 상당히 제한됨. 시간에 따라 데이터를 오름차순으로 정렬하므로 임의의 시간의 데이터를 읽고 쓰는 작업은 성능이 떨어짐. 대량의 데이터가 쓰여지도록 최적화되어 DB에 부하가 걸린 경우, 항상 최신의 데이터를 반환하지 못할수 있음.

* ## RDBMS에서 테이블의 인덱싱은 무엇인가요? 인덱싱을 하면 어떤 점이 다르며, 어떤 식으로 동작하나요?
  Index는 RDBMS에서 테이블에 대한 검색 속도를 높여주는 자료 구조를 말하며, 테이블 내에 1개의 컬럼 혹은 여러 개의 컬럼을 이용하여 생성한다. 특정 테이블의 컬럼을 인덱싱(Indexing)하면 검색을 할 때 테이블의 레코드를 전부 다 확인하는 것이 아니라 인덱싱 되어있는 자료 구조를 통해서 검색되기 때문에 검색 속도가 빨라진다. 

  예: age = 10 인 행 찾기
  | name | age |
  | :--: | :--: |
  | 김** | 1 |
  | 이** | 4 | 
  | 서** | 2 | 
  | ... | ... |
  | 곽** | 13 |

  index 없을 때: 모든 행 다 뒤짐;   
  index 있을 때:

  step1: age column 을 복사해서 오름차순으로 정렬한다.
  | age |
  | :--: |
  | 1 |
  | 2 | 
  | 2 | 
  | ... |
  | 13 |
 
  step2: index에서 age = 10 을 빠르게 찾아낸다.    
  step3: 데이터 안에 숨겨진 행 주소를 근거 해서 원래 행을 찾아서 출력.

  index를 만들때 Tree 유형으로 만들고 화살표로 연결, 반씩 잘라서 찾는다 (binary-research):  

  |  |  |  | 4 |  |  |  
  |--|--|--|---|--|--|
  |  |2 |  |   | 6|  | 
  |1 |  | 3| 5 |  |7 | 

  B-Tree (Balanced Tree): 노드마다 2개, 3개씩 넣어서 1/3, 1/4 씩 잘라서 만들수 있다. 
  |  |  |  |   |4,8| |  |  |  |     |    |
  |--|--|--|---|--|--|--|--|--|-----|----|
  |  |2 |  |   |6 |  |  |  |10,12|  |    |
  |1 |  | 3| 5 |  |7 | 9|  |11|     | 13 |

  4~8 사이 데이터 찾기: 4 -> 6 -> 5; 4 -> 6 -> 7; 4 -> 6; 4; 8

  B+Tree: 맨 밑에만 데이터 보관 화살표로 연결됨, 위에서는 가이드만 제공 
  | | | |          | | |7이상 오른쪽| | | |             | | |   |  |
  |-|-|-|----------|-|-|-|-|-|-|-------------|-|-|---|--|
  | | | |4이상 오른쪽| | | | | | |10이상 오른쪽 | |  |  |  |
  |1|2|3|      ->    |4|5|6|7|8|9|    ->       |10|11|12|13|

  4~8 사이 데이터 찾기: 7 왼쪽 -> 4 오른쪽 -> 4 -> 5 -> 6 -> 7 -> 8

* ## ORM을 사용하는 것은 사용하지 않는 것에 비해 어떤 장단점을 가지고 있나요?
  `ORM`(Object Relational Mapping)은 ‘객체로 연결을 해준다’는 의미로, 어플리케이션과 데이터베이스 연결 시 SQL언어가 아닌 어플리케이션 개발언어로 데이터베이스를 접근할 수 있게 해주는 툴이다.    

  RDBMS <—매핑—> Application, 때문에 Persistant API라고도 할 수 있다.
  
  종류:
  * python: Django, Flask SQLAlchemy
  * Node.js: Sequelize
  * Java: Hibernate, JPA

  객체와 관계형 데이터베이스 간의 매핑을 지원해주는 Framework나 Tool들이 나오는 이유? 보다 OOP다운 프로그래밍을 하기 위해서이다.    

  우리가 어떤 어플리케이션을 만든다고 하면 관련된 정보들을 객체에 담아 보관하게 된다. 이렇게 생성한 객체들을 데이터베이스의 테이블에 저장하게 되는데, 이때 "JOIN"과 같은 SQL query language를 통해 관계 설정을 해 주게 된다. 이때 테이블과 객체간의 이질성이 발생 하게 된다. 만약에 getter/setter 메소드가 있다면, 객체에 결과를 get/set하는 작업을 따로 해줄 필요 없이 ,ORM framework은 알아서 자동으로 해당 값을 넣어주거나 할당되게 된다.

  장점: 
  * 객체 지향적인 코드
    >1. 선언문, 할당, 종료 같은 부수적인 코드가 없거나 급격히 줄어든다.    
    >2. 코드의 가독성을 올려준다. 
    >3. SQL의 절차적이고 순차적인 접근이 아닌 객체 지향적인 접근으로 인해 생산성이 증가한다.

  * 재사용 및 유지보수의 편리성이 증가
    >1. ORM은 독립적으로 작성되어있고, 해당 객체들을 재활용 할 수 있다.
    >2. 때문에 모델에서 가공된 데이터를 컨트롤러에 의해 뷰와 합쳐지는 형태로 디자인 패턴을 견고하게 다지는데 유리하다.
    >3. 매핑정보가 명확하여, ERD를 보는 것에 대한 의존도를 낮출 수 있다. (Entity Relationship Diagram (ERD)는 시스템의 엔티티들이 무엇이 있는지 어떤 관계가 있는지를 나타내는 다이어그램.)
  
  * DBMS에 대한 종속성이 줄어듦
    >1. 대부분 ORM 솔루션은 DB에 종속적이지 않다.
    >2. 프로그래머는 Object에 집중함으로 적은 리스크와 시간이 소요된다.

  단점:
  * ORM으로만 완벽한 서비스를 구현하기가 어렵움
    >1. 사용하기는 편하지만 설계는 매우 신중하게 해야한다.
    >2. 프로젝트의 복잡성이 커질경우 난이도 또한 올라갈 수 있다.
    >3. 잘못 구현된 경우에 속도 저하 및 심각할 경우 일관성이 무너지는 문제점이 생길 수 있다.
  * 프로시저가 많은 시스템에선 ORM의 객체 지향적인 장점을 활용하기 어려움
    >프로시저가 많은 시스템에선 다시 객체로 바꿔야하며, 그 과정에서 생산성 저하나 리스크가 많이 발생할 수 있다. 프로시저란 DB 에 대한 일련의 작업을 정리한 절차를 관계형 데이터베이스 관리 시스템에 저장한 것

  ### 자바스크립트 생태계의 ORM에는 어떤 것들이 있나요?
  * Sequelize: promise-based ORM. Node.js에서 사용. 지원 언어는 JavaScript, TypeScript. 지원 DB는 Oracle, Postgres, MySQL, MariaDB, SQLite and SQL Server 등.
  * TypeORM: NodeJS, Browser, Cordova, PhoneGap, Ionic, React Native 등등에서 사용. 지원 언어는 JavaScript, TypeScript. 지원 DB는 PostgreSQL, MySQL, MariaDB, SQLite, and MSSQL 등.
  * Waterline: Node.js의 데이터베이스 액세스를 위한 추상화 계층을 제공하는 data mapping library. default ORM in the Sails.js web framework. 지원 DB: Redis, mySQL, LDAP, MongoDB, or Postgres 등.
  * Bookshelf: Node.js에서 사용. PostgreSQL, MySQL, SQLite 등을 지원.
  * Objection.js: PostgreSQL, MySQL, and SQLite 등.
  * Mongoose: an ORM for MongoDB, a NoSQL database. Node.js에서 사용.
  * Prisma: PostgreSQL, MySQL, SQLite, and SQL Server. TypeScript와 JavaScript를 지원.

* ## 모델간의 1:1, 1:N, N:M 관계는 각각 무엇이고 어떨 때 사용하나요?
  __1:1 관계:__ 하나의 레코드가 다른 테이블의 레코드 한 개와 연결된 경우에 사용. (ex. 사람은 단 하나의 이름만 있다.)       

   Users table:  

  | User | ID | name | phone id | 
  |-------|----|------|----------|
  | ...   |... | ...  | ...      |

  Phonebook table:

  | ID | phone number |
  |----|--------------|
  |... |... |

  phone id가 Phonebook 테이블의 ID 와 연결되어 있다.    
  각 전화번호가 단 한 명의 유저와 연결되어 있고, 그 반대도 동일하다면, Users 테이블과 Phonebook 테이블은 1:1 관계(One-to-one relationship)이다.

  __1:N 관계:__ 하나의 레코드가 서로 다른 여러 개의 레코드와 연결된 경우에 사용. (한쌍의 부부는 여러명의 자식을 가질수 있다.) 
  
  Users table: 

  | User | ID | name | 
  |-------|----|------|
  | ...   |... | ...  |

  SNS table:
  | ID | user id |
  |----|------|
  |... |... |

  Users table의 ID가 SNS table의 user id와 연결되어 있다.  
  한 명의 유저가 여러개의 sns id를 가질수 있다.      
  하지만 반대로, 한개의 sns id를 여러명의 유저가 공유할수 없다.

  __N:M 관계:__ 여러 개의 레코드가 다른 테이블의 여러 개의 레코드와 관계가 있는 경우에 사용. (학생과 선생님의 관계.) 

* ## DB에 사용자의 암호를 평문으로 저장하지 않고도 사용자의 암호를 인증하는 것이 가능한 이유는 무엇일까요?
  DBMS는 암·복호화 기능을 제공한다. DB 서버가 제공하는 암호화 기능을 사용하는 경우 손쉽게 암·복호화가 구현이 가능하고 DB 서버와 연계되는 애플리케이션들의 수정이 별도로 필요로 하지 않는게 된다. 
  
  DB 서버 내부에서의 암호화는 평문의 데이터를 암호화하여 저장하고, 암호화된 데이터를 평문으로 변환하여 전달하기 때문에 DB 암호화의 가장 쉬 운 방법 중에 하나이다. 즉 양방향이다. 

  복호화가 불가능한 '해싱'도 있다. 단방향 해시를 기본 골자로 하여 안전하게 패스워드를 저장하는것이 좋다.

  단방향 해시 함수는 어떤 알고리즘에 의해 원본 데이터를 매핑시켜 완전히 다른 암호화된 데이터로 변환시키는 것을 의미한다. 이 변환을 해시라고 하고, 해시에 의해 암호화된 데이터를 다이제스트(digest)라고 한다. 

  사용자가 암호를 입력하면, 해싱을 통해 다이제스트를 생성하고, 이 디아제스트를 DB에 저장된 사용자의 디아제스트와 비교하는 과정을 통해 인증을 실현할수 있다.

  * ### 해시 함수에는 어떤 것이 있나요?
    암호학에서, hash function은 다양한 크기의 data를 고정된 길이의 문자열로 바꾸는 함수를 의미한다. 이 함수의 input을 message 혹은 input이라 부르고, 함수의 실행 결과로 나온 고정된 길이의 문자열을 hash 혹은 message digest라고 한다.  

    * SHA: 입력값을 알 수 없도록 난수의 문자열로 변환. 입력값 중에 한 글자만 바뀌거나 혹은 마침표(.) 하나만 들어가도 결과값이 완전히 달라지는 임의성을 가짐. 가장 대표적인 것은 SHA-256, 256 bits로 출력.
    * MD: 128 bits로 출력. 보안에 취약해서 현재는 잘 사용되지 않는다.
    * HMAS: 해시 함수와 secret key를 함께 사용해서 암호화를 진행. 
    * WHIRLPOOL: 512 bits or 256 bits 출력. 여러가지 프로그래밍 언어에서 사용 가능. 널리 쓰이지는 않지만 보안성이 높다.

  * ### 사용자의 암호를 해싱하여 저장할 때 어떤 식으로 저장하는 것이 보안에 좋을까요?
    Hash function은 deterministic 하다(같은 input 값이 들어오면 언제나 같은 digest 값이 나온다). 때문에 hash value를 만드는데 들어가는 input이 오로지 사용자에게 건내받은 password일때, Brute force attack과 rainbow table attack을 받을수 있다. 
    
    Brute force attack은 hash function에 대한 대표적인 공격이다. Hash value와 일치하는 결과를 내는 input 값을 얻기 위해 무작위의 문자열을 넣어서 시도하는 것이다.

    Brute force에서 한발 더 나아간 rainbow table attack의 경우에는 어떤 문자열을 넣었을 때 어떤 hash 값이 나온다는 것을 미리 연산을 마친 다음 database에 저장해 놓는다. Database에 hash value를 query 하면 input 값이 나오게 된다.

    따라서 같은 password를 받았어도 다른 digest를 만들 수 있는 방법은 오직 hash function의 input을 다르게 만들어주는 방법밖에 없다. 

    Salt는 암호학적으로 안전한 함수에 의해 만들어지는 값으로 hash function의 input에 더해져서 모든 input에 대해 unique hash를 만들어 낸다. Salt는 hash function을 non-deterministic하게 보이도록 만들어주고 이것은 같은 비밀번호의 사용으로 인해 같은 hash 값이 나오는 것을 방지한다. 따라서 unique salt를 사용하는 것이 중요하다.

# Quest
  이번에는 메모장을 파일이 아닌 DB기반으로 만들어 보고자 합니다.
  * 적절한 테이블을 설계해 보세요.
  * Sequelize를 이용하여 데이터의 모델을 만들고 어플리케이션에 적용해 보세요.
    | SQL | SEQUELIZE |
    |-----|-----------|
    | SELECT * FROM users; | Users.findAll(); |
    | INSERT INTO users(userId, nickname, pw) VALUES('user01', 'Ava', 'pw01'); | Users.create({userId: 'user01', nickname: 'Ava', pw: 'pw01'}); |
    | SELECT pw FROM users WHERE userId='user01' LIMIT 1; | Users.findOne({where: {userId: 'user01'}}); |
    | SELECT * FROM texts WHERE title='title 1' AND title='title 2'; | Texts.findAll({where: [Op.and]: [{title: title 1}, {title: title 2}]}); |
    | DELETE FROM users WHERE userId='user01' | Users.destroy({ where: { userId: user01 } });|

  * 사용자의 비밀번호는 해싱을 통해 저장되어야 합니다.
