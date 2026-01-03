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

# Next.js 빌드는 항상 production 모드
ENV NODE_ENV=production

# Next.js 빌드
RUN npm run build
