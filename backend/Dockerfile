# 1. Chọn image gốc là Node.js phiên bản phù hợp
FROM node:22-alpine

# 2. Tạo thư mục làm việc bên trong container
WORKDIR /app

# 3. Copy các file định nghĩa thư viện trước
COPY package*.json ./

# 4. Cài đặt các thư viện (dependencies)
RUN npm install

# 5. Copy toàn bộ mã nguồn còn lại của thư mục backend vào container
COPY . .

# 6. Khai báo cổng mà backend sẽ chạy (trùng với port trong server.js của bạn)
EXPOSE 8080

# 7. Lệnh để khởi chạy backend khi container bắt đầu chạy
CMD ["node", "server.js"]