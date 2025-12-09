import { useRef, useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload, FileIcon, AlertCircle, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface FileUploadProps {
  id?: string
  label?: string
  multiple?: boolean
  accept?: string
  maxSizeMB?: number
  value?: File[]
  onChange?: (files: File[]) => void
  className?: string
  description?: string
  error?: string
}

export function FileUpload({
  id,
  label,
  multiple = false,
  accept = 'image/*',
  maxSizeMB = 5,
  value = [],
  onChange,
  className,
  description,
  error,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)
  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({})

  // Ref to track previewUrls for cleanup without dependency issues
  const previewUrlsRef = useRef(previewUrls)

  // Keep ref in sync with state
  useEffect(() => {
    previewUrlsRef.current = previewUrls
  }, [previewUrls])

  // Clean up object URLs to avoid memory leaks on unmount
  useEffect(() => {
    return () => {
      Object.values(previewUrlsRef.current).forEach((url) =>
        URL.revokeObjectURL(url),
      )
    }
  }, [])

  const getFilePreview = (file: File) => {
    if (!file.type.startsWith('image/')) return null
    if (!previewUrls[file.name]) {
      const url = URL.createObjectURL(file)
      setPreviewUrls((prev) => ({ ...prev, [file.name]: url }))
      return url
    }
    return previewUrls[file.name]
  }

  const handleFiles = (files: FileList | null) => {
    if (!files) return

    const newFiles: File[] = []
    const errors: string[] = []

    Array.from(files).forEach((file) => {
      // Validate Type
      if (accept && accept !== '*') {
        const acceptedTypes = accept.split(',').map((t) => t.trim())
        const fileType = file.type
        const fileName = file.name.toLowerCase()

        const isValid = acceptedTypes.some((type) => {
          if (type.endsWith('/*')) {
            return fileType.startsWith(type.replace('/*', ''))
          }
          return fileType === type || fileName.endsWith(type.replace('*', ''))
        })

        if (!isValid) {
          errors.push(`${file.name}: Formato inválido.`)
          return
        }
      }

      // Validate Size
      if (file.size > maxSizeMB * 1024 * 1024) {
        errors.push(`${file.name}: Tamanho excede ${maxSizeMB}MB.`)
        return
      }

      // Check for duplicates
      if (
        multiple &&
        value.some((f) => f.name === file.name && f.size === file.size)
      ) {
        errors.push(`${file.name}: Arquivo já adicionado.`)
        return
      }

      newFiles.push(file)
    })

    if (errors.length > 0) {
      errors.forEach((err) => toast.error(err))
    }

    if (newFiles.length > 0) {
      const updatedFiles = multiple ? [...value, ...newFiles] : newFiles
      onChange?.(updatedFiles)
    }

    // Reset input
    if (inputRef.current) inputRef.current.value = ''
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    handleFiles(e.dataTransfer.files)
  }

  const removeFile = (index: number) => {
    const newFiles = [...value]
    const removedFile = newFiles[index]
    newFiles.splice(index, 1)
    onChange?.(newFiles)

    // Cleanup preview
    if (removedFile && previewUrls[removedFile.name]) {
      URL.revokeObjectURL(previewUrls[removedFile.name])
      setPreviewUrls((prev) => {
        const newUrls = { ...prev }
        delete newUrls[removedFile.name]
        return newUrls
      })
    }
  }

  return (
    <div className={cn('space-y-3', className)}>
      {label && (
        <Label htmlFor={id} className={cn(error && 'text-destructive')}>
          {label}
        </Label>
      )}

      <div
        className={cn(
          'border-2 border-dashed rounded-lg p-6 transition-all text-center cursor-pointer flex flex-col items-center justify-center min-h-[120px] relative group',
          dragActive
            ? 'border-primary bg-primary/5'
            : error
              ? 'border-destructive/50 bg-destructive/5'
              : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-accent/50',
          'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
        )}
        onDragEnter={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setDragActive(true)
        }}
        onDragLeave={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setDragActive(false)
        }}
        onDragOver={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <Input
          ref={inputRef}
          id={id}
          type="file"
          className="hidden"
          multiple={multiple}
          accept={accept}
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div className="bg-background p-3 rounded-full shadow-sm mb-2 group-hover:scale-110 transition-transform">
          <Upload
            className={cn(
              'h-6 w-6',
              error ? 'text-destructive' : 'text-primary',
            )}
          />
        </div>
        <div className="text-sm font-medium">
          <span className="text-primary hover:underline">
            Clique para enviar
          </span>{' '}
          <span className="text-muted-foreground">ou arraste aqui</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {multiple ? 'Vários arquivos' : 'Arquivo único'} •{' '}
          {accept === 'image/*' ? 'JPG, PNG' : accept}
        </p>
        {description && (
          <p className="text-xs text-muted-foreground/70 mt-2 max-w-[80%]">
            {description}
          </p>
        )}
      </div>

      {error && (
        <p className="text-sm font-medium text-destructive flex items-center gap-1">
          <AlertCircle className="h-4 w-4" /> {error}
        </p>
      )}

      {value.length > 0 && (
        <div className="grid gap-2 mt-4">
          {value.map((file, index) => {
            const preview = getFilePreview(file)
            return (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between p-2 border rounded-md bg-card text-sm animate-in fade-in slide-in-from-top-2 duration-300"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="h-10 w-10 rounded bg-muted flex items-center justify-center shrink-0 overflow-hidden border">
                    {preview ? (
                      <img
                        src={preview}
                        alt={file.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <FileIcon className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex flex-col truncate min-w-0">
                    <span className="font-medium truncate" title={file.name}>
                      {file.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  onClick={() => removeFile(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
