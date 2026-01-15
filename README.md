# PDF Watermark App

Ứng dụng web để thêm watermark vào file PDF, có thể deploy lên Vercel.

## Tính năng

- Upload file PDF
- Thêm watermark text với tùy chọn:
  - Màu sắc
  - Kích thước font
  - Độ trong suốt (opacity)
  - Vị trí (góc, giữa, lặp lại)
- Download PDF đã có watermark

## Cài đặt

```bash
npm install
```

## Chạy development server

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) trong trình duyệt.

## Deploy lên Vercel

1. Đẩy code lên GitHub
2. Kết nối repository với Vercel
3. Vercel sẽ tự động detect Next.js và deploy

Hoặc sử dụng Vercel CLI:

```bash
npm i -g vercel
vercel
```

## Công nghệ sử dụng

- Next.js 14
- React 18
- TypeScript
- pdf-lib - Thư viện xử lý PDF
- react-dropzone - Upload file dễ dàng
