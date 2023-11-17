# Checklist 00. 형상관리 시스템

## Resources
* [Resources to learn Git](https://try.github.io)
* [Learn Git Branching](https://learngitbranching.js.org/?locale=ko)
* [Inside Git: .Git directory](https://githowto.com/git_internals_git_directory)

## My resources
* Pro Git (https://git-scm.com/book/ko/v2)

## Checklist
* ### 형상관리 시스템은 왜 나오게 되었을까요?
  >형상관리 시스템 또는 버전관리 시스템(VCS)란 소프트웨어 개발 및 유지 보수 과정에서 발생하는 소스 코드, 문서 등의 생성, 변경 이력, 삭제 이력 등을 관리하는 것을 말한다.<br>
  <br>
  프로젝트 진행하다 보면 복사본이 너무 많아서 최신버전을 찾기가 어렵고, 문제가 생겼을 때 어떤 시점으로 돌아가야 하는지 알수가 없을 때가 있다.</br>
  여러명의 개발자들이 같은 프로젝트에 참여할 경우에는, 각자가 작업한 부분을 서로 공유하고 접붙였을 때 성공적으로 실행되어야 한다.</br>
  그러려면 기존의 소스코드를 누가, 언제, 왜 수정했는지 추적해야 하고, 안전한 환경에서 동기화가 가능해야 하며, 효율있게 관리할수 있어야 한다.</br>
  <br>
  형상관리 시스템 (버전관리 시스템)은 바 로 이런 문제를 해결하기 위해 고안된 시스템이다.</br>
  
* ### git은 어떤 형상관리 시스템이고 어떤 특징을 가지고 있을까요? 분산형 형상관리 시스템이란 무엇일까요?
  위에 문제들을 해결하기 위해 제일 먼저 등장한것이 로컬 버전관리 시스템(local VCS)이다.<br>
  >로컬 버전관리란 client가 자신의 컴퓨터 내부에 존재하는 local database에서 직접 관리하는 형태를 말한다.<br>

  하지만 협업을 고려했을 때는 여전히 좋은 방식은 아니였다. 그리하여 중앙집중식 버전관리 시스템(CVCS)이 등장했다.<br>
  >중앙집중식 관리란 모든 client들이 하나의 서버에 접속해서 원하는 버전의 파일들을 가져다 관리하는 형태를 말한다.<br>
  
  이런 방식은 협업에 유리하고 하나의 서버로만 관리하기 때문에 동기화에도 유리하고 관리하기에도 효율적이다.<br>
  하지만 client들은 가장 최신 버전만 가져갈수 있고 중앙서버에 문제가 생기면 모든 client들은 작업을 중단해야 하고 작업 히스토리가 날라갈 위험도 있다.<br>
  <br>
  이를 해결하기 위해 등장한 것이 분산 버전관리 시스템(DVCS)이다.<br>
  >분산 버전관리란 중앙서버에서 모든 히스토리를 가진 저장소 전체를 복사해서 여러대의 컴퓨터에 가져다 사용하는 형태를 말한다.<br>

  client들은 중앙서버에 접속하지 않은 상태에서도 local computer에서 개발을 진행할수 있고, 중앙서버에 문제가 발생해도 local에 저장되어 있는 데이터를 복구하면 되기 때문에 위험이 적다. 또한 client의 컴퓨터에 문제가 생도 공동작업을 한 팀원들이 저장소 정보를 가지고 있으니 언제든지 복구가 가능하다.<br>
  <br>
  git이 채택한 것이 바로 이런 **분산 버전관리 시스템**이다. 아래와 같은 특징이 있다.
  * 오프라인 작업이 가능하다. 로컬 저장소에 전체 데이터를 복제해 넣어서 관리하기 때문이다.
  * 프로젝트의 히스토리를 조회할 때 서버 없이 조회한다.
  * 속도가 빠르다. 각각의 개발자들이 모두 분산처리 서버의 주인이 되는 셈이므로 서버가 직접 해야 될 일들이 많이 줄어든다.
  * 브랜칭(branching)이 매우 쉽고 가볍다.
  * 서버와 클라이언트 뿐인 기존 형상관리에 비해 분산처리 구조를 유연하게 세울 수 있다. 중간 서버를 둔다든지, 부서별로 따로 서버를 둔다든지 하는 구성이 자유롭게 가능하다.
  * 프로젝트 전체를 스냅샷 형태로 관리한다. 마지막 커밋의 스냅샷만 통째로 저장하고 나머지 커밋에 대해서는 스냅샷과 스냅샷이 차이를 저장한다.
  * 데이터를 체크섬으로 관리한다.
  
* ### git과 GitHub은 어떻게 다를까요?
  git은 client의 local computer를 항상 주시하면서 변화를 추적하고 기록하고 저장한다.<br>
  GitHub은 이렇게 만들어진 git history를 모두 가져가서 여러명의 client들이 다 같이 공유하고 공동으로 작업할수 있는 환경을 제공해준다.<br>
  <br>
  한마디로 요약하면 git은 버전 관리 시스템이고, GitHub는 git으로 관리하는 프로젝트를 올려둘 수 있는 사이트다.

* ### git의 clone/add/commit/push/pull/branch/stash 명령은 무엇이며 어떨 때 이용하나요? 그리고 어떻게 사용하나요?
  * git clone [url]: 다른 프로젝트에 기여하려거나 리모트 저장소의 데이터를 복사해서 가져올때 사용한다.
    >git clone [url NAME]: 클론할때 디렉토리 이름을 NAME으로 바꿔서 복사해온다.
  * git add [file NAME]: 파일을 추적하거나, 수정한 파일을 staged상태(to be commited)로 만들어준다.
  * git commit: 로컬 저장소에 변경된 파일을 기록 즉 새로운 버전이 기록된다. 단, commit message를 넣어줘야 커밋이 완료된다.
    >git commit -m "commit message": commit message를 넣어주면서 커밋하기 때문에 유용하다.
  * git push origin master: 리모트 저장소에 보내준다. 여기서 origin은 리모트 저장소 이름이고, master은 로컬 저장소 이름이다.
  * git pull [리모트 저장소 이름] [브랜치 이름]: 리모트 저장소 브랜치에서 데이터를 가져올 뿐만 아니라 자동으로 로컬 브랜치와 병합한다.
    >이 두 명령을 연달아 수행하는것과 같다: git fetch, git merge
  * git branch: 브랜치를 관리하는 도구, 브랜치 목록을 보여줌
    >아래처럼 쓸수 있다.<br>
    > git branch [NAME]: NAME이라는 새로운 브랜치를 만들어준다.<br>
    > git branch -d [NAME]: merge후 NAME이라는 필요없는 브랜치를 삭제해준다.
  * git stash: 현재 작업중인 변경사항들을 working tree에 저장해준다. 커밋하지 않고 다른 브랜치로 이동할수 있다.

* ### git의 Object, Commit, Head, Branch, Tag는 어떤 개념일까요? git 시스템은 프로젝트의 히스토리를 어떻게 저장할까요?
   HEAD는 Branch를 통해 Commit을 가리키는데 그 Commit이 곧 client가 현재 바라보고 있는 Commit이다.<br>
   Branch도 Commit을 가리킨다. 그래서 HEAD와 Branch는 모두 pointer다.<br>
   <br>
   Client가 파일을 Stage하면 git 저장소에 Blob Object가 저장되고 Staging Area에 해당 파일의 checksum을 저장한다.<br>
   git commit으로 커밋하면 먼저 루트 디렉토리(.git)와 각 하위 디렉토리 Tree Object를 checksum과 함께 저장소에 저장한다.<br>
   그 다음에 Commit Object를 만들고 메타데이터와 루트 디렉토리 Tree Object를 가리키는 포인터 정보를 Commit Object에 저장한다.
   >메타데이터에는 스냅샷에 대한 포인터, 저자, 커밋 메세지 등이 들어있다.</br>
   </br>
   
   이 작업을 마치면 git 저장소에는 세가지의 데이터 Object가 생긴다.
   * 파일에 대한 Blob
   * 파일과 디렉토리 구조가 들어있는 Tree Object
   * 메타데이터와 루트 Tree를 가리키는 포인터를 담은 Commit Object<br>

   Tag Object는 Commit Object랑 매우 비슷하다. Commit Object처럼 누가, 언제 태그를 달았는지, 태그 메세지는 무엇이고 어떤 커밋을 가리키는지에 대한 정보가 포함된다. 하지만 Tree Object가 아닌 Commit Object를 가리킨다. 또한 Branch처럼 옮겨다닐 수가 없다.

* ### 리모트 git 저장소에 원하지 않는 파일이 올라갔을 때 이를 되돌리려면 어떻게 해야 할까요?
  git rm —cached [file NAME]: 원격에서만 삭제
  >git rm [file name]: 원격과 로컬에서 모두 삭제

  
