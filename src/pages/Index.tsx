
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Image as ImageIcon } from "lucide-react";
import { NotificationPopup } from "@/components/NotificationPopup";
import { ImageUploader } from "@/components/ImageUploader";
import { CompressionControls } from "@/components/CompressionControls";
import { FormatConverter } from "@/components/FormatConverter";
import { FeatureCard } from "@/components/FeatureCard";
import { Zap, Settings, FileImage } from "lucide-react";

const Index = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Show notification popup after a brief delay
    const timer = setTimeout(() => {
      setShowNotification(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleNotificationResponse = (allowed: boolean) => {
    setNotificationPermission(allowed ? 'granted' : 'denied');
    setShowNotification(false);
    
    // Show thank you message
    setTimeout(() => {
      toast({
        title: "Thank You For Using This Website!",
        description: "Welcome to Image Compressor Ram - Your Professional Image Tool",
        duration: 3000,
      });
    }, 500);
  };

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800">
      {/* Notification Popup */}
      {showNotification && (
        <NotificationPopup onResponse={handleNotificationResponse} />
      )}

      {/* Navigation */}
      <nav className="bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">Image Compressor Ram</h1>
            </div>
            <Button variant="outline" className="text-white border-white/30 hover:bg-white/10">
              Home
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-white mb-4 animate-float">
            Professional Image Compression Tool
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
            Compress images with advanced algorithms while maintaining exceptional quality. 
            Support for multiple formats, custom compression ratios, and intelligent optimization.
          </p>
          
          {/* Features Overview */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <FeatureCard 
              icon={<Zap className="w-8 h-8" />}
              title="Smart Compression"
              description="Advanced algorithms that compress images up to 90% while preserving quality"
            />
            <FeatureCard 
              icon={<Settings className="w-8 h-8" />}
              title="Custom Controls"
              description="Choose compression percentage or set custom file sizes in KB/MB"
            />
            <FeatureCard 
              icon={<FileImage className="w-8 h-8" />}
              title="Format Conversion"
              description="Convert JPG to PNG and vice versa without quality loss"
            />
          </div>
        </div>

        {/* Main Application */}
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="compress" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white/10 backdrop-blur-lg">
              <TabsTrigger value="compress" className="text-white data-[state=active]:bg-white/20">
                Image Compression
              </TabsTrigger>
              <TabsTrigger value="resize" className="text-white data-[state=active]:bg-white/20">
                Custom Size
              </TabsTrigger>
              <TabsTrigger value="convert" className="text-white data-[state=active]:bg-white/20">
                Format Converter
              </TabsTrigger>
            </TabsList>

            <TabsContent value="compress" className="mt-8">
              <div className="grid lg:grid-cols-2 gap-8">
                <ImageUploader onFileSelect={handleFileSelect} />
                <CompressionControls type="percentage" selectedFile={selectedFile} />
              </div>
            </TabsContent>

            <TabsContent value="resize" className="mt-8">
              <div className="grid lg:grid-cols-2 gap-8">
                <ImageUploader onFileSelect={handleFileSelect} />
                <CompressionControls type="custom-size" selectedFile={selectedFile} />
              </div>
            </TabsContent>

            <TabsContent value="convert" className="mt-8">
              <div className="grid lg:grid-cols-2 gap-8">
                <ImageUploader onFileSelect={handleFileSelect} />
                <FormatConverter selectedFile={selectedFile} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Index;
