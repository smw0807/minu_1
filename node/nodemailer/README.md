# Node 패키지 nodemailer
공식 홈페이지 : https://nodemailer.com/about/   
Node.js 환경에서 이메일을 쉽게 보낼 수 있도록 도와주는 라이브러리   
SMTP(Simple Mail Transfer Protocl)을 사용하여 이메일을 전송할 수 있으며, OAuth2 인증과 같은 다양한 인증 방법도 지원한다.   

# 실행방법
1. .env 파일 생성
2. .env에 아래 옵션 추가
```
email_service=gmail or yahoo, outlook 등 
user=본인 이메일
pass=본인 이메일 패스워드
```
3. mailOptions 작성
 - from에는 보내는 사람의 이메일이 들어감(나)
 - to에는 받는 사람 이메일 작성
 - subject, text 내용 작성

4. `npm start` 

# 에러
```
Invalid login: 534-5.7.9 Application-specific password required. Learn more at
```    
이런 에러가 발생하면, 보내는 이메일 계정이 2단계 인증 활성화가 되어 있을 경우 이런 에러가 발생함.   

### 해결방법
1. 지메일 접속 후 오른쪽 상단에 프로필 클릭
2. Google 계정 관리 클릭
3. 좌측 메뉴에서 보안 클릭
4. 2단계 인증 클릭
5. 맨 밑에 있는 앱 비밀번호 클릭
6. 앱 선택 셀렉트 박스 클릭
7. 기타 선택
8. 용도에 맞게 이름 작성 (예: nodemailer)
9. 생성된 앱 비밀번호를 .env안에 pass에 기입
10. 실행
