
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { FileImage, Download, ArrowRight } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { convertImageFormat, downloadBlob } from "@/utils/imageProcessor";

interface FormatConverterProps {
  selectedFile?: File | null;
}

export const FormatConverter: React.FC<FormatConverterProps> = ({ selectedFile }) => {
  const [sourceFormat, setSourceFormat] = useState('JPG');
  const [targetFormat, setTargetFormat] = useState('PNG');
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [convertedBlob, setConvertedBlob] = useState<{ blob: Blob; filename: string } | null>(null);
  const { toast } = useToast();

  const handleConvert = async () => {
    if (!selectedFile) {
      toast({
        title: "No Image Selected",
        description: "Please upload an image first before converting.",
        variant: "destructive",
      });
      return;
    }

    if (sourceFormat === targetFormat) {
      toast({
        title: "Same Format Selected",
        description: "Please select different source and target formats.",
        variant: "destructive",
      });
      return;
    }

    setIsConverting(true);
    setProgress(0);
    setConvertedBlob(null);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 12;
        if (newProgress >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return newProgress;
      });
    }, 120);

    try {
      const result = await convertImageFormat(selectedFile, targetFormat);
      setConvertedBlob(result);
      setProgress(100);
      
      toast({
        title: "Conversion Complete!",
        description: `Successfully converted ${sourceFormat} to ${targetFormat} without quality loss.`,
      });
    } catch (error) {
      toast({
        title: "Conversion Failed",
        description: "There was an error converting your image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConverting(false);
      clearInterval(progressInterval);
    }
  };

  const handleDownload = () => {
    if (convertedBlob) {
      downloadBlob(convertedBlob.blob, convertedBlob.filename);
      toast({
        title: "Download Started",
        description: "Your converted image is being downloaded.",
      });
    }
  };

  return (
    <Card className="glass-effect border-white/20 text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileImage className="w-5 h-5" />
          Format Converter
        </CardTitle>
        <CardDescription className="text-white/70">
          Convert between image formats while preserving quality and resolution
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-3 gap-4 items-center">
          <div className="space-y-2">
            <label className="text-sm font-medium">From</label>
            <Select value={sourceFormat} onValueChange={setSourceFormat}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="JPG">JPG</SelectItem>
                <SelectItem value="PNG">PNG</SelectItem>
                <SelectItem value="WEBP">WEBP</SelectItem>
                <SelectItem value="GIF">GIF</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-center">
            <ArrowRight className="w-6 h-6 text-white/70" />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">To</label>
            <Select value={targetFormat} onValueChange={setTargetFormat}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PNG">PNG</SelectItem>
                <SelectItem value="JPG">JPG</SelectItem>
                <SelectItem value="WEBP">WEBP</SelectItem>
                <SelectItem value="GIF">GIF</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Conversion Features */}
        <div className="bg-white/10 rounded-lg p-4 space-y-3">
          <h4 className="font-medium">Conversion Features</h4>
          <div className="grid grid-cols-1 gap-2 text-sm">
            <div className="flex items-center justify-between">
              <span>Preserve Original Quality</span>
              <span className="text-green-400">✓ Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Maintain Resolution</span>
              <span className="text-green-400">✓ Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Color Profile Preservation</span>
              <span className="text-green-400">✓ Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Transparency Support</span>
              <span className="text-green-400">✓ Enabled</span>
            </div>
          </div>
        </div>

        {/* Format Information */}
        <div className="bg-blue-500/20 rounded-lg p-4">
          <h4 className="font-medium mb-2">Format Information</h4>
          <div className="text-sm text-white/80">
            {targetFormat === 'PNG' && "PNG format supports transparency and lossless compression, perfect for graphics and logos."}
            {targetFormat === 'JPG' && "JPG format is ideal for photographs with efficient compression and smaller file sizes."}
            {targetFormat === 'WEBP' && "WEBP offers superior compression with excellent quality, supported by modern browsers."}
            {targetFormat === 'GIF' && "GIF format supports animation and transparency, great for simple graphics."}
          </div>
        </div>

        {isConverting && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Converting {sourceFormat} to {targetFormat}...</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        <Button
          onClick={handleConvert}
          disabled={isConverting || sourceFormat === targetFormat || !selectedFile}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
        >
          {isConverting ? (
            "Converting..."
          ) : (
            <>
              <FileImage className="w-4 h-4 mr-2" />
              Convert to {targetFormat}
            </>
          )}
        </Button>

        {convertedBlob && (
          <Button
            onClick={handleDownload}
            variant="outline"
            className="w-full border-white/30 text-white hover:bg-white/10"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Converted Image
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
