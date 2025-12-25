import { useState, useCallback, useEffect } from 'react';
import { FiUpload, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';

interface ImageUploaderProps {
  maxFiles?: number;
  onFilesChange: (files: (File | string)[]) => void;
  initialImages?: string[];
}

export default function ImageUploader({
  maxFiles = 5,
  onFilesChange,
  initialImages = []
}: ImageUploaderProps) {
  const [previewUrls, setPreviewUrls] = useState<(string | File)[]>([]);

  // Initialize with initial images
  useEffect(() => {
    if (initialImages && initialImages.length > 0) {
      setPreviewUrls(initialImages);
    }
  }, [initialImages]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);

    // Check max files
    if (files.length + previewUrls.length > maxFiles) {
      toast.error(`You can only upload up to ${maxFiles} images`);
      return;
    }

    // Validate files
    const validFiles = files.filter(file => {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`File ${file.name} exceeds maximum size (10MB)`);
        return false;
      }
      if (!file.type.startsWith('image/')) {
        toast.error(`File ${file.name} is not an image`);
        return false;
      }
      return true;
    });

    // Create preview URLs
    const newPreviewUrls = validFiles.map(file => file); // Store File object directly

    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    onFilesChange([...previewUrls, ...newPreviewUrls]);

    // Reset input
    e.target.value = '';
  }, [maxFiles, onFilesChange, previewUrls]);

  const removeImage = useCallback((index: number) => {
    setPreviewUrls(prev => {
      const newUrls = [...prev];
      const removed = newUrls.splice(index, 1)[0];

      // Revoke object URL if it's a blob URL
      if (typeof removed === 'string' && removed.startsWith('blob:')) {
        URL.revokeObjectURL(removed);
      }

      onFilesChange(newUrls);
      return newUrls;
    });
  }, [onFilesChange]);

  const getImageUrl = (item: string | File) => {
    if (typeof item === 'string') return item;
    return URL.createObjectURL(item);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        {previewUrls.map((item, index) => (
          <div key={index} className="relative group">
            <img
              src={getImageUrl(item)}
              alt={`Preview ${index + 1}`}
              className="w-24 h-24 object-cover rounded-lg border border-gray-200"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <FiX size={16} />
            </button>
          </div>
        ))}

        {previewUrls.length < maxFiles && (
          <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
            <FiUpload className="w-6 h-6 text-gray-400 mb-1" />
            <span className="text-xs text-gray-500 text-center">Add image</span>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              multiple
              onChange={handleFileChange}
            />
          </label>
        )}
      </div>

      <p className="text-xs text-gray-500">
        Maximum {maxFiles} images. Format: JPG, PNG. Maximum 10MB/image.
      </p>
    </div>
  );
}
