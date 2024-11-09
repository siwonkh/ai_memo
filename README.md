<h1 align="center">Team.SWG - Ai Memo</h1>
<p align="center">
  <img alt="svelte" src="https://img.shields.io/badge/Sveltejs-FF3E00?style=for-the-badge&logo=svelte&logoColor=white">
  <img alt="firebase" src="https://img.shields.io/badge/firebase-ffca28?style=for-the-badge&logo=firebase&logoColor=black">
</p>

<p align="center">
  <img width="200" alt="image" src="https://github.com/user-attachments/assets/6bca11f0-c958-4eda-8deb-318d4f034d58">
</p>
<p align="center">
  <em>AI 접근성 향상을 통한 디지털 격차 완화</em>
</p>

<br/>
이 프로젝트는 일상적으로 사용하는 메모장과 Todo 리스트에 AI 기능을 녹여내, 누구나 손쉽게 AI의 도움을 받을 수 있도록 만들었다. 기능은 크게 두 가지로 분류되는데, 먼저, Todo 리스트의 AI는 할 일을 수행할 때 활용하면 유용할 기술이나 도구를 추천해 주어, 사용자가 다른 기술이나 도구 대한 정보를 쉽고 빠르게 얻을 수 있도록 한다. 두 번째로, 메모장 AI는 맞춤법 검사와 글 형식 작성 등의 기능을 채팅 형태로 제공하여 글 작성 중 필요한 도움을 쉽게 받을 수 있도록 한다. 이는 대화로만 끝나는 것이 아닌 AI와 메모장 사이의 연동으로 사용자에게 직접적이고 능동적인 도움을 줄 수 있다. 즉, 이 프로젝트는 AI 활용 장벽을 낮추고, 실질적인 생산성을 높이도록 하는 목표를 가진 프로젝트이다.
<br/><br/>

## TODO 기능
<img width="200" alt="image" src="https://github.com/user-attachments/assets/5c27e1c2-6767-4d89-96e1-b8e1fbc2762f">
<img width="200" alt="image" src="https://github.com/user-attachments/assets/f2bd219a-2618-442b-8a61-6ca65ec4b366">
<img width="200" alt="image" src="https://github.com/user-attachments/assets/60ca7382-48d7-44fe-850f-2956f8199018">
<img width="200" alt="image" src="https://github.com/user-attachments/assets/fd2bded8-a50b-4eba-8781-ccc388bebeb2">


## MEMO 기능
<img width="200" alt="image" src="https://github.com/user-attachments/assets/a2a5db4e-f1f0-4ca6-bf3b-de4b0135bc4f">
<img width="200" alt="image" src="https://github.com/user-attachments/assets/de94abad-b274-485e-8de7-c62a322c25eb">
<img width="200" alt="image" src="https://github.com/user-attachments/assets/a1c9ffb1-728d-4b60-90b1-1e11be1e531c">
<img width="200" alt="image" src="https://github.com/user-attachments/assets/8af1a97d-e9a2-4ba2-bab3-ac489bea813f">
<img width="200" alt="image" src="https://github.com/user-attachments/assets/fcac7b1b-5f73-40b1-a3ca-d110088a23be">

## 프로젝트 실행
요구사항: 
- Nodejs 설치 (20.x 이상 권장)
- Firebase 설정
  - 구글 Authentication 추가
  - Authentication 허용 도메인 추가 (localhost외의 도메인 사용시)
  - Firestore database 생성
  - Firestore에 'suggestions' 컬렉션 추가 (나머지 컬렉션은 자동생성됨)
  - (선택) 'suggestions' 컬렉션에 문서 추가 (문서 형식 예시 {text: "맞춤법 검사해줘"})
- OpenAI API 키 발급
- 루트 디렉토리에 .env 추가 (.env.example 참고)

패키지 설치
```shell
npm install
```

실행
```shell
npm run dev
```

<br/><br/><br/><br/>
2024 Handong Software Festival - Freshmen Software Competition
