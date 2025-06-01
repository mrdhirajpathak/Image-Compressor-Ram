
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { FileImage, Download, ArrowRight } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export const FormatConverter = () => {
  const [sourceFormat, setSourceFormat] = useState('JPG');
  const [targetFormat, setTargetFormat] = useState('PNG');
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const handleConvert = () => {
    setIsConverting(true);
    setProgress(0);

    // Simulate conversion progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 12;
        if (newProgress >= 100) {
          clearInterval(interval);
          setIsConverting(false);
          toast({
            title: "Conversion Complete!",
            description: `Successfully converted ${sourceFormat} to ${targetFormat} without quality loss.`,
          });
          return 100;
        }
        return newProgress;
      });
    }, 150);
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
          disabled={isConverting || sourceFormat === targetFormat}
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

        {progress === 100 && (
          <Button
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
