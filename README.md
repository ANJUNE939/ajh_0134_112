# uniwork MVP v6 Final — GitHub Pages Ready

외국인 유학생 채용 플랫폼 6차 최종 정적 MVP입니다.

## 바로 보기

GitHub Pages 기준으로 `index.html`이 루트에 배치되어 있습니다. 이 폴더의 모든 파일을 GitHub 저장소 루트에 업로드하면 바로 확인할 수 있습니다.

## 핵심 페이지

- `index.html` : 전체 랜딩 및 구직자/기업 진입
- `seeker.html` : 구직자 페이지
- `corp.html` : 기업 페이지
- `signup-seeker.html` : 개인 회원가입
- `signup-company.html` : 기업 회원가입
- `login.html` : 로그인
- `account.html` : 개인 대시보드
- `company-dashboard.html` : 기업 대시보드
- `jobs.html` : 채용공고
- `community.html` : 커뮤니티
- `visa.html` : 비자·외국인 보호·행정 상담
- `admin.html` : 운영자 대시보드

## 구현 기능

- 개인회원/기업회원 분리 가입
- 로그인/로그아웃 데모
- 역할별 대시보드 이동
- 이력서 등록 및 미리보기
- 기업 채용공고 등록
- 관리자 공고 승인/반려
- 승인 공고 노출 및 지원
- 커뮤니티 글쓰기/신고
- 위험 공고 신고
- 행정 상담 신청
- 개인회원 유료 서비스 데모
  - 행정 패스트트랙
  - 매칭 부스트
- 관리자 결제/회원/공고/지원/상담/신고 관리
- JSON 데이터 다운로드
- 한국어/영어 전환
- 라이트/다크모드
- 모바일 반응형

## GitHub Pages 업로드 방법

1. 새 GitHub Repository 생성
2. 이 폴더 안의 파일과 폴더를 저장소 루트에 업로드
3. Repository Settings → Pages
4. Source를 `Deploy from a branch`로 선택
5. Branch를 `main`, folder를 `/root`로 선택
6. 배포 주소에서 `index.html`이 자동으로 열리는지 확인

## 테스트 계정

이 MVP는 실제 서버가 없으므로 직접 회원가입 후 로그인하는 방식입니다.
가입 데이터는 브라우저 `localStorage`에 저장됩니다.

## 주의

이 버전은 백엔드 없는 정적 MVP입니다. 실제 서비스 운영 전에는 다음이 필요합니다.

- 서버 인증/Auth
- 데이터베이스
- 파일 업로드 저장소
- 결제 PG 연동
- 개인정보처리방침
- 이용약관
- 직업정보제공/직업소개 관련 법적 검토
- 행정사 파트너 계약 및 고지 문구 정비
