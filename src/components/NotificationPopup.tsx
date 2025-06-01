
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell } from 'lucide-react';

interface NotificationPopupProps {
  onResponse: (allowed: boolean) => void;
}

export const NotificationPopup: React.FC<NotificationPopupProps> = ({ onResponse }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 notification-popup">
      <Card className="w-full max-w-md mx-4 bg-white/90 backdrop-blur-lg border-white/20">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Enable Notifications
          </CardTitle>
          <CardDescription className="text-gray-600">
            Get notified about compression progress and completion
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <Button 
              onClick={() => onResponse(true)}
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
            >
              Allow
            </Button>
            <Button 
              onClick={() => onResponse(false)}
              variant="outline"
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Deny
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
