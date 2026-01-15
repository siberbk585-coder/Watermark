import { NextRequest, NextResponse } from 'next/server'
import { PDFDocument, rgb, degrees } from 'pdf-lib'

export const runtime = 'nodejs'
export const maxDuration = 30

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const text = formData.get('text') as string
    const fontSize = parseInt(formData.get('fontSize') as string) || 48
    const colorHex = formData.get('color') as string || '#000000'
    const opacity = parseFloat(formData.get('opacity') as string) || 0.3
    const position = formData.get('position') as string || 'diagonal'
    const angle = parseInt(formData.get('angle') as string) || -45

    if (!file) {
      return NextResponse.json(
        { error: 'Không tìm thấy file' },
        { status: 400 }
      )
    }

    if (!text || text.trim() === '') {
      return NextResponse.json(
        { error: 'Text watermark không được để trống' },
        { status: 400 }
      )
    }

    // Đọc file PDF
    const arrayBuffer = await file.arrayBuffer()
    const pdfDoc = await PDFDocument.load(arrayBuffer)

    // Chuyển đổi màu hex sang RGB
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
      return result
        ? {
            r: parseInt(result[1], 16) / 255,
            g: parseInt(result[2], 16) / 255,
            b: parseInt(result[3], 16) / 255,
          }
        : { r: 0, g: 0, b: 0 }
    }

    const color = hexToRgb(colorHex)
    const watermarkColor = rgb(color.r, color.g, color.b)

    // Thêm watermark vào tất cả các trang
    const pages = pdfDoc.getPages()
    const font = await pdfDoc.embedFont('Helvetica-Bold')

    pages.forEach((page) => {
      const { width, height } = page.getSize()

      // Tính toán vị trí watermark
      let x = 0
      let y = 0
      let rotation = degrees(0)

      switch (position) {
        case 'center':
          x = width / 2
          y = height / 2
          break
        case 'top-left':
          x = width * 0.1
          y = height * 0.9
          break
        case 'top-right':
          x = width * 0.9
          y = height * 0.9
          break
        case 'bottom-left':
          x = width * 0.1
          y = height * 0.1
          break
        case 'bottom-right':
          x = width * 0.9
          y = height * 0.1
          break
        case 'diagonal':
          // Vẽ watermark lặp lại theo đường chéo
          const textWidth = font.widthOfTextAtSize(text, fontSize)
          const textHeight = fontSize
          const spacing = Math.max(textWidth, textHeight) * 1.5
          
          rotation = degrees(angle)
          
          // Vẽ nhiều watermark để phủ kín trang
          for (let i = -2; i <= 3; i++) {
            for (let j = -2; j <= 3; j++) {
              x = (width / 2) + (i * spacing * Math.cos((angle * Math.PI) / 180))
              y = (height / 2) + (j * spacing * Math.sin((angle * Math.PI) / 180))
              
              page.drawText(text, {
                x,
                y,
                size: fontSize,
                font,
                color: watermarkColor,
                opacity,
                rotate: rotation,
              })
            }
          }
          return // Đã vẽ xong cho diagonal, không cần vẽ thêm
        default:
          x = width / 2
          y = height / 2
      }

      // Vẽ watermark cho các vị trí khác (không phải diagonal)
      if (position !== 'diagonal') {
        // Tính toán để căn giữa text
        const textWidth = font.widthOfTextAtSize(text, fontSize)
        x = x - textWidth / 2
        y = y - fontSize / 2

        page.drawText(text, {
          x,
          y,
          size: fontSize,
          font,
          color: watermarkColor,
          opacity,
          rotate: rotation,
        })
      }
    })

    // Tạo PDF mới với watermark
    const pdfBytes = await pdfDoc.save()

    // Trả về file PDF
    return new NextResponse(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="watermarked_${file.name}"`,
      },
    })
  } catch (error) {
    console.error('Error processing PDF:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Có lỗi xảy ra khi xử lý PDF' },
      { status: 500 }
    )
  }
}
