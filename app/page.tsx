'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

interface WatermarkOptions {
  text: string
  fontSize: number
  color: string
  opacity: number
  position: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'diagonal'
  angle: number
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [watermarkOptions, setWatermarkOptions] = useState<WatermarkOptions>({
    text: 'WATERMARK',
    fontSize: 48,
    color: '#000000',
    opacity: 0.3,
    position: 'diagonal',
    angle: -45,
  })

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0]
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile)
        setError(null)
        setSuccess(null)
      } else {
        setError('Vui lòng chọn file PDF')
      }
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false
  })

  const handleWatermarkChange = (field: keyof WatermarkOptions, value: string | number) => {
    setWatermarkOptions(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAddWatermark = async () => {
    if (!file) {
      setError('Vui lòng chọn file PDF')
      return
    }

    if (!watermarkOptions.text.trim()) {
      setError('Vui lòng nhập text watermark')
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('text', watermarkOptions.text)
      formData.append('fontSize', watermarkOptions.fontSize.toString())
      formData.append('color', watermarkOptions.color)
      formData.append('opacity', watermarkOptions.opacity.toString())
      formData.append('position', watermarkOptions.position)
      formData.append('angle', watermarkOptions.angle.toString())

      const response = await fetch('/api/watermark', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Có lỗi xảy ra khi xử lý PDF')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `watermarked_${file.name}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      setSuccess('Đã thêm watermark thành công! File đã được tải xuống.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setError(null)
    setSuccess(null)
    setWatermarkOptions({
      text: 'WATERMARK',
      fontSize: 48,
      color: '#000000',
      opacity: 0.3,
      position: 'diagonal',
      angle: -45,
    })
  }

  return (
    <div className="container">
      <div className="header">
        <h1>📄 PDF Watermark App</h1>
        <p>Thêm watermark vào file PDF của bạn một cách dễ dàng</p>
      </div>

      <div className="upload-section">
        <div
          {...getRootProps()}
          className={`upload-zone ${isDragActive ? 'drag-active' : ''}`}
        >
          <input {...getInputProps()} />
          <div className="upload-icon">📤</div>
          <div className="upload-text">
            {isDragActive
              ? 'Thả file vào đây...'
              : 'Kéo thả file PDF vào đây hoặc click để chọn'}
          </div>
          <div className="upload-hint">Chỉ chấp nhận file PDF</div>
        </div>

        {file && (
          <div className="file-info">
            <div>
              <div className="file-name">{file.name}</div>
              <div className="file-size">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </div>
            </div>
            <button className="button button-secondary" onClick={handleReset}>
              Xóa
            </button>
          </div>
        )}
      </div>

      {file && (
        <div className="watermark-section">
          <h2 className="section-title">Tùy chọn Watermark</h2>

          <div className="form-group">
            <label className="form-label">Text Watermark</label>
            <input
              type="text"
              className="form-input"
              value={watermarkOptions.text}
              onChange={(e) => handleWatermarkChange('text', e.target.value)}
              placeholder="Nhập text watermark"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Kích thước Font</label>
              <input
                type="number"
                className="form-input"
                value={watermarkOptions.fontSize}
                onChange={(e) => handleWatermarkChange('fontSize', parseInt(e.target.value) || 48)}
                min="10"
                max="200"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Độ trong suốt (0-1)</label>
              <input
                type="number"
                className="form-input"
                value={watermarkOptions.opacity}
                onChange={(e) => handleWatermarkChange('opacity', parseFloat(e.target.value) || 0.3)}
                min="0"
                max="1"
                step="0.1"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Màu sắc</label>
              <div className="color-input-wrapper">
                <input
                  type="color"
                  className="color-picker"
                  value={watermarkOptions.color}
                  onChange={(e) => handleWatermarkChange('color', e.target.value)}
                />
                <input
                  type="text"
                  className="form-input"
                  value={watermarkOptions.color}
                  onChange={(e) => handleWatermarkChange('color', e.target.value)}
                  placeholder="#000000"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Vị trí</label>
              <select
                className="form-select"
                value={watermarkOptions.position}
                onChange={(e) => handleWatermarkChange('position', e.target.value)}
              >
                <option value="center">Giữa</option>
                <option value="diagonal">Đường chéo</option>
                <option value="top-left">Góc trên trái</option>
                <option value="top-right">Góc trên phải</option>
                <option value="bottom-left">Góc dưới trái</option>
                <option value="bottom-right">Góc dưới phải</option>
              </select>
            </div>
          </div>

          {watermarkOptions.position === 'diagonal' && (
            <div className="form-group">
              <label className="form-label">Góc xoay (độ)</label>
              <input
                type="number"
                className="form-input"
                value={watermarkOptions.angle}
                onChange={(e) => handleWatermarkChange('angle', parseInt(e.target.value) || -45)}
                min="-180"
                max="180"
              />
            </div>
          )}

          <button
            className="button button-primary"
            onClick={handleAddWatermark}
            disabled={loading}
          >
            {loading ? 'Đang xử lý...' : 'Thêm Watermark và Tải xuống'}
          </button>

          {loading && <div className="loading">⏳ Đang xử lý PDF...</div>}
        </div>
      )}

      {error && <div className="error">❌ {error}</div>}
      {success && <div className="success">✅ {success}</div>}
    </div>
  )
}
