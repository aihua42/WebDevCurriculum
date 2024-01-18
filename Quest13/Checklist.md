# Quest 13. 웹 API의 응용과 GraphQL
이번 퀘스트에서는 차세대 웹 API의 대세로 각광받고 있는 GraphQL에 대해 알아보겠습니다.

# Topics
* GraphQL
  * Schema
  * Resolver
  * DataLoader
* Apollo

# Checklist
* ## GraphQL API는 무엇인가요? REST의 어떤 단점을 보완해 주나요?
  페이스북에서 만든 쿼리 언어, sql과 비교했을 때 쓰이는 방식이 다르다. sql은 데이터베이스 시스템에 저장된 데이터를 효율적으로 가져오는 것이 목적이고, gql은 웹 클라이언트가 데이터를 서버로부터 효율적으로 가져오는 것이 목적이다. sql의 statement는 주로 백앤드 시스템에서 작성하고 호출 하는 반면, gql의 statement는 주로 클라이언트 시스템에서 작성하고 호출한다. 

  REST API는 URL, METHOD등을 조합하기 때문에 다양한 Endpoint가 존재한다. 반면, gql은 단 하나의 Endpoint가 존재한다. 

  ![](images/graphql-mobile-api.png)
  
  또한, gql API에서는 불러오는 데이터의 종류를 쿼리 조합을 통해서 결정한다. 예를 들면, REST API에서는 각 Endpoint마다 데이터베이스 SQL 쿼리가 달라지는 반면, gql API는 gql 스키마의 타입마다 데이터베이스 SQL 쿼리가 달라진다. 

  [이미지 출처](https://tech.kakao.com/2019/08/01/graphql-basic/)

  REST API의 단점: 1. under fetching; 2. over fetching

  Under fetching 보완:    

  REST API는 보통 여러 엔드포인트를 가진다. 엔드포인트는 많아질 경우 관리하기 힘들 뿐더러, RESTful하게 설계하는거에는 한계가 있다. 하지만 GraphQL은 하나의 엔드포인트에 다른 `query`로 요청함으로써 엔드포인트 설계로부터 자유로워 질수 있다. 

  또한 REST API의 경우 필요한 리소스 별로 요청해야 하지만, GraphQL은 원하는 정보를 하나의 쿼리에 모두 담아 요청할 수 있다. 이렇게 하면 HTTP 요청 횟수를 줄일 수 있다.  

  Over fetching 보완:

  REST API의 경우 응답의 형태가 정해져있기 때문에 필요한 정보만 부분적으로 요청하는 것이 힘들고, 자연스럽게 데이터의 사이즈가 클 수 밖에 없다. 하디만 GraphQL은 클라이언트에서 필요한대로 쿼리를 작성해 원하는 데이터만을 가져올 수 있다. Facebook이 GraphQL을 개발한 초기 이유 중 하나는 모바일 사용의 증가라고 한다. GraphQL을 사용함으로써 응답 데이터 사이즈를 최소화하여 모바일 환경의 부담을 줄일 수 있다.

* ## GraphQL 스키마는 어떤 역할을 하며 어떤 식으로 정의되나요?
  스키마란 데이터 타입의 집합이다. GraphQL은 스키마 우선주의 디자인 방법론의 일종이다. GraphQL API를 설계할때는 스키마를 먼저 정의해야 한다. 왜냐 하면 GraphQL `query`의 형태는 리턴하는 값과 거의 일치한다. 어떤 필드를 선택할지, 어떤 종류의 객체를 반환할지, 하위 객체에서 필요한 사용할수 있는 필드는 무엇인지를 알기 위해선 스키마가 필요하다. 

  GraphQL은 스키마 정의를 위해 SDL(Schema Definition Languages)를 지원한다. SDL은 프로그래밍 언어나 프레임워크와 상관없이 사용법이 항상 동일하다. 

  GraphQL 스키마의 가장 기본적인 구성요소는 객체 타입이다. 객체 타입은 서비스에서 가져올수 있는 객체의 종류와 그 객체의 필드를 나타낸다. 
  ```gql
  enum SNS {
    Facebook,
    Instagram,
    KakaoStory
  }

  type User {
    userId: String!
    nickname: String!
    sns: SNS
  }
  ```
  * User, SNS: 객체 타입, 즉 필드가 있는 타입. 스키마 대부분의 타입은 객체 타입.
  * enum: 열거 타입, 특정 값들로 제한되는 특별한 종류의 스칼라.필드가 항상 값의 열거형 집합 중 하나.
  * id, nickname, sns: User type의 필드. 필드는 각 객체의 데이터와 관련이 있으며 각각의 필드는 특정 종류의 데이터를 반환. 이때 문자열, 커스텀 객체 타입, 여러 타입을 리스트로 묶어 반환하기도 함.
  * String: GraphQL에 내장된 스칼라 타입중 하나. Int, Float, String, Boolean. `scalar` 키워드를 이용해 직접 정의할수도 있음.
  * !: 필수 값을 의미, non-nullable
  * []: 배열을 의미. 열거 타입. 스칼라 타입에 속함. `enum` 키워드를 이용해 만들수 있음.   

  이외에 인터페이스 타입이 있다. 
  ```gql
  scalar Date!

  interface Customer {
    no: ID!
    phone_number: Int!
    dateJoined: Date!
  }

  type VIP implements Customer {
    no: ID!
    phone_number: Int!
    address: String!
    dateJoined: Date!
    ...
  }
  ```

  ```gql
  type Query {
    allCustomers: [Customer!]!
    ...
  }
  ```
  ```gql
  query {
    allCustomers {
      name
      ... on VIP {
        address
      }
    }
  }
  ```

  입력타입도 있다. 인자로 스칼라 값만 넘기는 게 아니라 복잡한 객체도 쉽게 전달 할 수 있다. 특히 뮤테이션에서 매우 유용하다. 
  ```gql
  input TabInput {
    userId: String
    activeTitle: String
    tabs: [TextsInput]
  }

  type Mutation {
    saveTabs(tabs: TabInput!): Boolean
  }
  ```

  Query, Mutation:
  ```gql
  type Query {
    text(userId: String!, textId: String!): Text
  }

  type Mutation {
    login(userId: String!, pw: String!): Token
  }
  ```

* ## GraphQL 리졸버는 어떤 역할을 하며 어떤 식으로 정의되나요?
  데이터베이스 사용시, 데이터를 가져오기 위해서 sql을 작성했다. 또한, 데이터베이스에는 데이터베이스 어플리케이션을 사용하여 데이터를 가져오는 구체적인 과정이 구현 되어 있다. 그러나 gql에서는 어떤 데이터들을 가져올지 그 구체적인 과정을 직접 구현 해야 한다. gql 쿼리문 파싱은 대부분의 gql 라이브러리에서 처리를 하지만, gql에서 데이터를 가져오는 구체적인 과정은 resolver가 담당하고, 이를 직접 구현 해야 한다. 

  리졸버는 모든 필드에 대해서 호출된다. 그리고 상위 필드 부터 하위 필드 순으로 호출된다. 같은 레벨에서는 순서를 보장하지 않는다. 다만 side effect가 있는 Mutation 만은 순서대로 실행한다. 그리고 만약 필드가 스칼라 값(문자열이나 숫자와 같은 primitive 타입)인 경우에는 실행이 종료된다. 더 이상의 연쇄적인 리졸버 호출이 일어나지 않는다. 

  ```js
  const resolvers = {
    Query: {
      sendTabs: async (root, { userId }, { res }) => {
        const tabRecordList = await db.Tab.findAll({ where: { userId } });

        const tabObj = {};
        tabObj.userId = userId;
        const textList = [];
        
        tabRecordList.forEach((obj) => {
          if (obj) {
            textList.push({ title: obj.title, text: obj.text });
            if (obj.active === true) {
              tabObj.activeTitle = obj.title;
            }
          }
        });

        tabObj.tabs = textList;
        return tabObj;
      }
    },

    Mutation: {
      addText: async(root, { userId, textId, title, text }, { res }) => {
        const textToAdd = { userId, textId, title, text };
        await db.Text.create(textToAdd);
        const textList = await db.Text.findAll({ where: { userId } });
        return textList;
      }
    }
  };
  ```

  * ### GraphQL 리졸버의 성능 향상을 위한 DataLoader는 무엇이고 어떻게 쓰나요?
    DataLoader는 N+1문제에서 발생하는 많은 수의 쿼리를 일괄 처리 및 캐싱 할 수 있도록 해주는 라이브러리이다. 여기서 N+1은 ORM을 사용할때 주로 발생하는 성능 문제이다. 엔티티간의 관계가 1:N 일때, N만큼 쿼리가 실행되게 되는데, 이것을 N+1문제라고 한다. GraphQL에서 발생하는 N+1 문제도 이거랑 비슷하다. 
    >한번의 query로 해결할수 있는데 여러번의 query로 실행하는 현상. 작가들이 있고, 작가들마다 출간한 책들이 있고, 작가와 책이 각각 다른 테이블에 있음. 작가 옆에 책 개수를 표현하고 싶다? step1: 보여주려는 작가들을 한번의 query로 다 가져온다. step2: 책 테이블에서 각 작가 ID를 기준으로 N번의 각각의 책들을 세는 query가 발생.

    이런 문제는 아래와 처럼 해결할수 있다:
    1. 일단 표시해야 하는 작가들의 ID들을 다 가져온다.
    2. 필요한 ID들을 다 모아서 책 테이블에서 한번에 쿼리한다. 개별적인 2차 조회를 피함.

    DataLoader는 javascript의 event-loop 을 이용한다. 주요기능인 batching은 event-loop 중 하나의 tick에서 실행된 data fetch에 대한 요청을 하나의 요청으로 모아서 실행하고 그 결과를 다시 알맞게 분배하는 역할을 한다. 그리고 요청이 중복되는 것이 있다면, 이를 캐싱하여 접근한다.
    ```gql
    {
      books {
        id
        title
        author {
          id
          name
        }
      }
    }
    ```

    ```js
    const authorLoader = new DataLoader(async (idList) => {
      const authors = await db.Author.findAll({ where: { id: idList } });
      const authorMap = {};
      authors.forEach((author) => {
        authorMap[author.id] = author;
      });

      return idList.map((id) => authorMap[id]);
    });

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: () => {
        return {
          authorLoader
        }
      }
    });

    const resolvers = {
      Book: {
        author: async (root, _, context) => {
          return context.authorLoader.load(root.authorId); // batch together
        }
      },

      Query: {
        books: async () => {
          const books = await db.Book.findAll();
          return books;
        }
      }
    }
    ```

* ## 클라이언트 상에서 GraphQL 요청을 보내려면 어떻게 해야 할까요?
  __GET request:__ GraphQL 요청을 query 쿼리 스트링에 지정해야 한다.   
  ```gql
  {
    user {
      id
    }
  }
  ```
  이 요청은 다음과 같이 HTTP GET을 통해 전송될 수 있다.    
  http://domain/graphql?query={user{id}}

  __POST request:__ 요청 헤더에는 Content-Type을 application/json으로 설정
  ```json
  const query = `
    mutation Signup ($userId: String!, $nickname: String!, $pw: String!) {
      signup(userId: $userId, nickname: $nickname, pw: $pw)
    }
  `;

  const url = 'https://localhost:8080/graphql';
  const res = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables: { userId, nickname, pw }
    }),
  });
  ```

  * ### Apollo 프레임워크(서버/클라이언트)의 장점은 무엇일까요?
    Client에서 GraphQL을 사용하면 서버에서 원하는 데이터를 원하는 필드들만 가져올수 있는 장점이 있다. 하지만 client에서 GraphQL을 사용하기 위해서는 JSON 형태의 데이터를 다시 client에서 사용할수 있는 객체로 바꾸기 위해서 추가적인 작업을 해주어야 한다. 또한 client에서는 GraphQL을 작성하기 위해서 쿼리가 자동완성 되지 않는다면 모든 필드를 일일히 찾아보고 작성해야 한다.  

    이러한 한계를 극복하기 위해 나온것이 바로 GraphQL Client Library이다. GraphQL Client Library는 다양한 종류가 있지만, 그중에서 가장 대표적인 것이 Apollo GraphQL이다. 

    Apollo GraphQL은 가장 많이 사용되는 GraphQL Client Library 중 하나이다. 다음과 같은 장점이 있다.
    * 프론트엔드(Apollo Client)와 백엔드(Apollo Server)에서 모두 사용 가능.
    * Query 및 Mutation 직접 전송. fetch 혹은 axios를 사용할 필요가 없다.
    * 전송받은 데이터 캐싱. Apollo는 Query를 통해 전송받은 데이터를 자동으로 캐싱해준다.
    * Local state 관리. GraphQL 서버에 Query, Mutation, Resolver를 작성하듯이, 동일하게 클라이언트에서도 클라이언트 만의 Local state를 만들어 Query, Mutation, Resolver의 사용이 가능.

  * ### Apollo Client를 쓰지 않고 Vanilla JavaScript로 GraphQL 요청을 보내려면 어떻게 해야 할까요?
    ```js
    const query = `
      query Tabs($userId: String!) {
        tabs(userId: $userId) {
          userId
          activeTitle
          tabs {
            title
            text
          }
        }
      }
    `;

    fetch('https://localhost:8080/graphql', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query,
        variables: { userId: id },
      }),
    })
    .then(res => res.json())
    .then(json => { ... });
    ```

* ## GraphQL 기반의 API를 만들 때 에러처리와 HTTP 상태코드 등은 어떻게 하는게 좋을까요?
  GraphQL 서버에서 오류가 발생할 경우, Apollo Server는 HTTP 응답 바디의 errors 배열에 해당 오류에 대한 정보를 담아준다. `message` 속성은 오류 메시지를 담고 있고, `locations`은 클라이언트가 전송한 쿼리문 내에서 오류가 발생한 줄과 열을 나타내고, `path`는 쿼리 경로를 나타내고, `extensions`는 에러 코드 및 그 외 부가적인 오류 정보를 담는다. 그리고 정상적으로 처리된 데이터들은 `data`에 담겨 있는다.
  ```js
  {
    "data": {

    },
    "errors": [
      {
        "message": "user query failed",
        "locations": [
          {
            "line": 5,
            "column": 3
          }
        ],
        "path": ["login"],
        "extensions": {
          "code": "INTERNAL_SERVER_ERROR",
          "exception": {
            "stacktrace": [
              "Error: user query failed",
              "    at user (/sandbox/index.js:31:13)",
              "    at field.resolve (/sandbox/node_modules/graphql-extensions/dist/index.js:133:26)",
              "    at resolveFieldValueOrError (/sandbox/node_modules/graphql/execution/execute.js:467:18)",
              "    at resolveField (/sandbox/node_modules/graphql/execution/execute.js:434:16)",
              "    at executeFields (/sandbox/node_modules/graphql/execution/execute.js:275:18)",
              "    at executeOperation (/sandbox/node_modules/graphql/execution/execute.js:219:122)",
              "    at executeImpl (/sandbox/node_modules/graphql/execution/execute.js:104:14)",
              "    at Object.execute (/sandbox/node_modules/graphql/execution/execute.js:64:35)",
              "    at /sandbox/node_modules/apollo-server-core/dist/requestPipeline.js:240:46",
              "    at Generator.next (<anonymous>)"
            ]
          }
        }
      }
    ]
  }
  ```

  일반적인 에러 객체를 던질 경우에 Error 생성자로 넘기는 문자열이 오류 메시지가 되지만, 오류 코드는 항상 `INTERNAL_SERVER_ERROR`로 고정되게 된다. 오류 코드를 포함해서 좀 더 다양한 정보를 오류 응답의 `extensions` 속성에 추가하고 싶다면 Apollo Server에서 제공하는 ApolloError 클래스를 사용해야 한다. 

  ApolloError 클래스는 인자로 `message`와 `code`, `properties`를 받는다. code에는 오류 코드로 사용할 문자열을 넘기고, properties에는 그 밖에 오류 관련 정보를 객체로 넘기면 된다. 
  ```js
  throw new ApolloError("id must be non-negative", "INVALID_ID", {
    parameter: "id",
  });  // resolver 객체에 넣어줌
  ```
  ```js
  {
    "data": {

    },
    "errors": [
      {
        "message": "id must be non-negative",
        "locations": [
          {
            "line": 2,
            "column": 3
          }
        ],
        "path": ["user"],
        "extensions": {
          "code": "INVALID_ID",   // here
          "exception": {
            "parameter": "id",   // here
            "stacktrace": [
              "Error: id must be non-negative",   // here
              "    at user (/sandbox/index.js:22:15)",
              "    at field.resolve (/sandbox/node_modules/graphql-extensions/dist/index.js:133:26)",
              "    at resolveFieldValueOrError (/sandbox/node_modules/graphql/execution/execute.js:467:18)",
              "    at resolveField (/sandbox/node_modules/graphql/execution/execute.js:434:16)",
              "    at executeFields (/sandbox/node_modules/graphql/execution/execute.js:275:18)",
              "    at executeOperation (/sandbox/node_modules/graphql/execution/execute.js:219:122)",
              "    at executeImpl (/sandbox/node_modules/graphql/execution/execute.js:104:14)",
              "    at Object.execute (/sandbox/node_modules/graphql/execution/execute.js:64:35)",
              "    at /sandbox/node_modules/apollo-server-core/dist/requestPipeline.js:240:46",
              "    at Generator.next (<anonymous>)"
            ]
          }
        }
      }
    ]
  }
  ```

  서버 측에서 에러를 로깅할때 ApolloServer 생성자는 `formatError` 속성을 통해, 함수를 하나 받는다.
  ```js
  const formatError = (err) => {
    console.error("--- GraphQL Error ---");
    console.error("Path:", err.path);
    console.error("Message:", err.message);
    console.error("Code:", err.extensions.code);
    console.error("Original Error", err.originalError);
    return err; // 인자로 받은 에러 객체를 다시 리턴을 해줘야 클라이언트까지 에러 정보가 전달된다
  };

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    formatError,
    debug: false, // stacktrace 정보를 제외하고 client에 전송
  });
  ```

  GraphQL은 HTTP 상태코드를 구체적으로 반환해주지 않는다: always return a 200 OK response. 때문에 custom error handling middleware을 사용해서 에러가 발생했을 때, HTTP 상태코드를 포함해서 client한테 응답이 가기 전에 에러 메세지를 보내주면 좋다.

# Quest
메모장의 서버와 클라이언트 부분을 GraphQL API로 수정해 보세요.
