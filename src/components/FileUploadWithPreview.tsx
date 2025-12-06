import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { X, Upload, CheckCircle2, AlertCircle, File, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadWithPreviewProps {
  value?: File | string | null;
  onChange?: (file: File | null) => void;
  onUpload?: (file: File) => Promise<string>;
  accept?: string;
  maxSize?: number; // in bytes
  label?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
  previewType?: "image" | "document" | "auto";
  showPreview?: boolean;
}

export const FileUploadWithPreview = ({
  value,
  onChange,
  onUpload,
  accept,
  maxSize = 5 * 1024 * 1024, // 5MB default
  label,
  description,
  disabled = false,
  className,
  previewType = "auto",
  showPreview = true,
}: FileUploadWithPreviewProps) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isImage = (file: File) => file.type.startsWith("image/");
  const isDocument = (file: File) =>
    file.type.includes("pdf") ||
    file.type.includes("document") ||
    file.type.includes("text");

  const getPreviewType = (file: File): "image" | "document" => {
    if (previewType !== "auto") return previewType;
    return isImage(file) ? "image" : "document";
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    // Validate file size
    if (file.size > maxSize) {
      setError(`File size exceeds ${(maxSize / 1024 / 1024).toFixed(0)}MB limit`);
      return;
    }

    // Create preview
    if (isImage(file)) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }

    // If onChange is provided, call it
    if (onChange) {
      onChange(file);
    }

    // If onUpload is provided, upload the file
    if (onUpload) {
      setUploading(true);
      setUploadProgress(0);
      try {
        // Simulate progress (in real implementation, you'd track actual upload progress)
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + 10;
          });
        }, 100);

        const url = await onUpload(file);
        clearInterval(progressInterval);
        setUploadProgress(100);
        
        // Update preview if it's an image URL
        if (url && isImage(file)) {
          setPreview(url);
        }

        setTimeout(() => {
          setUploading(false);
          setUploadProgress(0);
        }, 500);
      } catch (err: any) {
        setError(err.message || "Upload failed");
        setUploading(false);
        setUploadProgress(0);
        if (onChange) {
          onChange(null);
        }
      }
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setError(null);
    if (onChange) {
      onChange(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const hasValue = value !== null && value !== undefined;
  const displayPreview = showPreview && (preview || (typeof value === "string" && value));

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="text-sm font-medium leading-none">{label}</label>
      )}
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}

      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-4 transition-colors",
          error
            ? "border-red-300 bg-red-50"
            : hasValue
            ? "border-green-300 bg-green-50"
            : "border-gray-300 hover:border-gray-400 bg-gray-50",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        {displayPreview ? (
          <div className="space-y-3">
            {getPreviewType(value instanceof File ? value : new File([], "")) === "image" ? (
              <div className="relative">
                <img
                  src={preview || (typeof value === "string" ? value : "")}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-md"
                />
                {!disabled && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={handleRemove}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3 p-3 bg-white rounded-md border">
                <File className="h-8 w-8 text-gray-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {value instanceof File ? value.name : "Document uploaded"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {value instanceof File
                      ? `${(value.size / 1024).toFixed(1)} KB`
                      : "File ready"}
                  </p>
                </div>
                {!disabled && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={handleRemove}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}

            {uploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Uploading...</span>
                  <span className="text-gray-500">{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}

            {!uploading && hasValue && (
              <div className="flex items-center gap-2 text-sm text-green-700">
                <CheckCircle2 className="h-4 w-4" />
                <span>File ready</span>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              onChange={handleFileSelect}
              disabled={disabled || uploading}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || uploading}
              className="mb-2"
            >
              <Upload className="h-4 w-4 mr-2" />
              {uploading ? "Uploading..." : "Select File"}
            </Button>
            {description && (
              <p className="text-xs text-gray-500 mt-2">{description}</p>
            )}
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 text-sm text-red-600 mt-2">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
};

