# Hướng dẫn Deploy lên Vercel

## Bước 1: Cài đặt Node.js và npm

Nếu chưa có Node.js, tải và cài đặt từ: https://nodejs.org/

## Bước 2: Cài đặt dependencies

Mở terminal trong thư mục dự án và chạy:

```bash
npm install
```

## Bước 3: Chạy thử ứng dụng local

```bash
npm run dev
```

Mở trình duyệt tại http://localhost:3000 để kiểm tra.

## Bước 4: Deploy lên Vercel

### Cách 1: Sử dụng Vercel CLI

1. Cài đặt Vercel CLI:
```bash
npm i -g vercel
```

2. Đăng nhập:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Deploy production:
```bash
vercel --prod
```

### Cách 2: Deploy qua GitHub (Khuyến nghị)

1. Tạo repository trên GitHub

2. Push code lên GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

3. Truy cập https://vercel.com và đăng nhập

4. Click "New Project"

5. Import repository từ GitHub

6. Vercel sẽ tự động detect Next.js và cấu hình

7. Click "Deploy"

## Lưu ý

- Vercel có giới hạn thời gian xử lý là 10 giây cho Hobby plan và 60 giây cho Pro plan
- File PDF lớn có thể mất nhiều thời gian xử lý
- Ứng dụng đã được cấu hình với `maxDuration: 30` trong `vercel.json` để hỗ trợ xử lý file lớn hơn

## Troubleshooting

### Lỗi "Function execution timeout"

- Nâng cấp lên Vercel Pro plan để có thời gian xử lý lâu hơn
- Hoặc giảm kích thước file PDF đầu vào

### Lỗi khi upload file lớn

- Kiểm tra giới hạn kích thước file trong `next.config.js`
- Vercel có giới hạn 4.5MB cho serverless functions (Hobby plan)
