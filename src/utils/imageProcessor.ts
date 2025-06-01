export const compressImage = (
  file: File,
  compressionLevel: number,
  customSize?: { size: number; unit: string }
): Promise<{ blob: Blob; filename: string }> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // If custom size is specified, calculate dimensions to achieve target file size
      if (customSize) {
        // Estimate compression ratio needed for target size
        const targetSizeBytes = customSize.unit === 'MB' ? customSize.size * 1024 * 1024 : customSize.size * 1024;
        const compressionRatio = Math.min(0.9, Math.max(0.1, targetSizeBytes / file.size));
        
        // Reduce dimensions if needed for extreme compression
        const scaleFactor = compressionRatio < 0.3 ? Math.sqrt(compressionRatio * 2) : 1;
        canvas.width = Math.floor(img.width * scaleFactor);
        canvas.height = Math.floor(img.height * scaleFactor);
        
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Use lower quality for custom size compression
        const quality = Math.max(0.1, compressionRatio);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const originalName = file.name.split('.')[0];
              const extension = file.type.split('/')[1];
              const filename = `${originalName}_compressed_${customSize.size}${customSize.unit}.${extension}`;
              resolve({ blob, filename });
            } else {
              reject(new Error('Failed to compress image'));
            }
          },
          file.type,
          quality
        );
      } else {
        // Regular percentage-based compression
        canvas.width = img.width;
        canvas.height = img.height;
        
        ctx?.drawImage(img, 0, 0);
        
        // Calculate quality based on compression level (higher level = lower quality)
        const quality = Math.max(0.1, (100 - compressionLevel) / 100);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const originalName = file.name.split('.')[0];
              const extension = file.type.split('/')[1];
              const filename = `${originalName}_compressed_${compressionLevel}%.${extension}`;
              resolve({ blob, filename });
            } else {
              reject(new Error('Failed to compress image'));
            }
          },
          file.type,
          quality
        );
      }
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

export const convertImageFormat = (
  file: File,
  targetFormat: string
): Promise<{ blob: Blob; filename: string }> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      ctx?.drawImage(img, 0, 0);
      
      const mimeType = `image/${targetFormat.toLowerCase()}`;
      const quality = targetFormat.toLowerCase() === 'jpeg' || targetFormat.toLowerCase() === 'jpg' ? 0.9 : undefined;
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const originalName = file.name.split('.')[0];
            const filename = `${originalName}.${targetFormat.toLowerCase()}`;
            resolve({ blob, filename });
          }
        },
        mimeType,
        quality
      );
    };
    
    img.src = URL.createObjectURL(file);
  });
};

export const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
