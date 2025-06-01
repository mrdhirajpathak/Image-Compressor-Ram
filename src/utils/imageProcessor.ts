
export const compressImage = (
  file: File,
  compressionLevel: number,
  customSize?: { size: number; unit: string }
): Promise<{ blob: Blob; filename: string }> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      ctx?.drawImage(img, 0, 0);
      
      // Calculate quality based on compression level (higher level = lower quality)
      const quality = (100 - compressionLevel) / 100;
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const originalName = file.name.split('.')[0];
            const extension = file.type.split('/')[1];
            const filename = `${originalName}_compressed.${extension}`;
            resolve({ blob, filename });
          }
        },
        file.type,
        quality
      );
    };
    
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
