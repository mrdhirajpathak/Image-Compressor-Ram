
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Download, Zap, Settings } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { compressImage, downloadBlob } from "@/utils/imageProcessor";

interface CompressionControlsProps {
  type: 'percentage' | 'custom-size';
  selectedFile?: File | null;
}

export const CompressionControls: React.FC<CompressionControlsProps> = ({ type, selectedFile }) => {
  const [compressionLevel, setCompressionLevel] = useState([70]);
  const [customSize, setCustomSize] = useState('');
  const [customUnit, setCustomUnit] = useState('KB');
  const [isCompressing, setIsCompressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [compressedBlob, setCompressedBlob] = useState<{ blob: Blob; filename: string } | null>(null);
  const { toast } = useToast();

  const handleCompress = async () => {
    if (!selectedFile) {
      toast({
        title: "No Image Selected",
        description: "Please upload an image first before compressing.",
        variant: "destructive",
      });
      return;
    }

    setIsCompressing(true);
    setProgress(0);
    setCompressedBlob(null);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 15;
        if (newProgress >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return newProgress;
      });
    }, 100);

    try {
      const customSizeData = type === 'custom-size' && customSize ? 
        { size: parseInt(customSize), unit: customUnit } : undefined;
      
      const result = await compressImage(selectedFile, compressionLevel[0], customSizeData);
      setCompressedBlob(result);
      setProgress(100);
      
      toast({
        title: "Compression Complete!",
        description: "Your image has been compressed successfully with minimal quality loss.",
      });
    } catch (error) {
      toast({
        title: "Compression Failed",
        description: "There was an error compressing your image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCompressing(false);
      clearInterval(progressInterval);
    }
  };

  const handleDownload = () => {
    if (compressedBlob) {
      downloadBlob(compressedBlob.blob, compressedBlob.filename);
      toast({
        title: "Download Started",
        description: "Your compressed image is being downloaded.",
      });
    }
  };

  return (
    <Card className="glass-effect border-white/20 text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {type === 'percentage' ? <Zap className="w-5 h-5" /> : <Settings className="w-5 h-5" />}
          {type === 'percentage' ? 'Compression Settings' : 'Custom Size Settings'}
        </CardTitle>
        <CardDescription className="text-white/70">
          {type === 'percentage' 
            ? 'Adjust compression level to balance file size and quality'
            : 'Set a target file size for your compressed image'
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {type === 'percentage' ? (
          <div className="space-y-4">
            <Label className="text-white">Compression Level: {compressionLevel[0]}%</Label>
            <Slider
              value={compressionLevel}
              onValueChange={setCompressionLevel}
              max={90}
              min={10}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-white/70">
              <span>Higher Quality</span>
              <span>Smaller File Size</span>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Label className="text-white">Target File Size</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Enter size"
                value={customSize}
                onChange={(e) => setCustomSize(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
              <Select value={customUnit} onValueChange={setCustomUnit}>
                <SelectTrigger className="w-20 bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="KB">KB</SelectItem>
                  <SelectItem value="MB">MB</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Quality Settings */}
        <div className="bg-white/10 rounded-lg p-4 space-y-3">
          <h4 className="font-medium">Quality Optimization</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center justify-between">
              <span>Smart Compression</span>
              <span className="text-green-400">✓ Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Metadata Removal</span>
              <span className="text-green-400">✓ Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Progressive JPEG</span>
              <span className="text-green-400">✓ Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Color Optimization</span>
              <span className="text-green-400">✓ Enabled</span>
            </div>
          </div>
        </div>

        {isCompressing && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Compressing...</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        <Button
          onClick={handleCompress}
          disabled={isCompressing || !selectedFile}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        >
          {isCompressing ? (
            "Compressing..."
          ) : (
            <>
              <Zap className="w-4 h-4 mr-2" />
              Compress Image
            </>
          )}
        </Button>

        {compressedBlob && (
          <Button
            onClick={handleDownload}
            variant="outline"
            className="w-full border-white/30 text-white hover:bg-white/10"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Compressed Image
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
