# 使用官方 Node.js 镜像作为基础镜像
FROM node:20-alpine

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package.json package-lock.json ./

# 安装依赖
RUN npm install

# 复制项目所有文件
COPY . .

# 构建前端应用
RUN npm run build

# 启动静态文件服务器
CMD ["npm", "start"]

