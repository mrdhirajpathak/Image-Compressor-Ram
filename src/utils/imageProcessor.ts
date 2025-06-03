
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
      // If custom size is specified, use iterative compression to achieve target size
      if (customSize) {
        const targetSizeBytes = customSize.unit === 'MB' ? customSize.size * 1024 * 1024 : customSize.size * 1024;
        
        // Start with original dimensions
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        // Iterative compression function
        const tryCompress = (quality: number, scaleFactor: number = 1): Promise<Blob> => {
          return new Promise((resolveBlob) => {
            // Apply scale factor if needed
            if (scaleFactor < 1) {
              canvas.width = Math.floor(img.width * scaleFactor);
              canvas.height = Math.floor(img.height * scaleFactor);
              ctx?.clearRect(0, 0, canvas.width, canvas.height);
              ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
            }
            
            canvas.toBlob(
              (blob) => {
                if (blob) {
                  resolveBlob(blob);
                }
              },
              file.type,
              quality
            );
          });
        };
        
        // Binary search approach to find optimal compression
        const findOptimalCompression = async () => {
          let bestBlob: Blob | null = null;
          let bestDifference = Infinity;
          
          // Try different quality levels
          const qualities = [0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1];
          
          for (const quality of qualities) {
            const blob = await tryCompress(quality);
            const sizeDifference = Math.abs(blob.size - targetSizeBytes);
            
            if (sizeDifference < bestDifference) {
              bestDifference = sizeDifference;
              bestBlob = blob;
            }
            
            // If we're very close to target, break
            if (blob.size <= targetSizeBytes && sizeDifference < targetSizeBytes * 0.05) {
              bestBlob = blob;
              break;
            }
          }
          
          // If still too large, try with reduced dimensions
          if (bestBlob && bestBlob.size > targetSizeBytes * 1.1) {
            const scaleFactors = [0.9, 0.8, 0.7, 0.6, 0.5];
            
            for (const scale of scaleFactors) {
              for (const quality of [0.8, 0.6, 0.4, 0.2]) {
                const blob = await tryCompress(quality, scale);
                const sizeDifference = Math.abs(blob.size - targetSizeBytes);
                
                if (sizeDifference < bestDifference) {
                  bestDifference = sizeDifference;
                  bestBlob = blob;
                }
                
                if (blob.size <= targetSizeBytes) {
                  bestBlob = blob;
                  break;
                }
              }
              if (bestBlob && bestBlob.size <= targetSizeBytes) break;
            }
          }
          
          return bestBlob;
        };
        
        findOptimalCompression().then((blob) => {
          if (blob) {
            const originalName = file.name.split('.')[0];
            const extension = file.type.split('/')[1];
            const filename = `${originalName}_compressed_${customSize.size}${customSize.unit}.${extension}`;
            resolve({ blob, filename });
          } else {
            reject(new Error('Failed to compress image to target size'));
          }
        });
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
