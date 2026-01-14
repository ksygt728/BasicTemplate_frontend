############################################
# 1단계: Next.js 빌드
############################################
FROM node:20-alpine AS builder

WORKDIR /app

# 빌드 시 전달받을 환경 이름
ARG ENV_NAME

# 패키지 정보 복사
COPY package*.json ./
RUN npm ci

# 소스 복사
COPY . .

# 환경별 env 파일을 Next.js가 인식하는 이름으로 복사
# Next.js는 NODE_ENV=production 일 때 .env.production 만 읽음
COPY .env.${ENV_NAME} .env.production

# 빌드 시 .env.local을 무시하기 위해 제거
# (개발 환경의 localhost:8080 설정이 배포 환경에 적용되는 것을 방지)
RUN rm -f .env.local

# Next.js 빌드는 항상 production 모드
ENV NODE_ENV=production


# Next.js 빌드
RUN npm run build




############################################

# 2단계: 실행 (Next.js 서버)

############################################

FROM node:20-alpine

  

WORKDIR /app

  

# 빌드 결과물과 node_modules 복사

COPY --from=builder /app ./

  

# Next.js 기본 포트

EXPOSE 3000

  

# Next.js 서버 실행

CMD ["npm", "run", "start"]
