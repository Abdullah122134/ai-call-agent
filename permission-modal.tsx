import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mic } from "lucide-react";

interface PermissionModalProps {
  isOpen: boolean;
  onRequestPermission: () => void;
  onClose: () => void;
}

export function PermissionModal({ isOpen, onRequestPermission, onClose }: PermissionModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Mic className="h-5 w-5 text-blue-600" />
            </div>
            <DialogTitle className="text-lg font-medium text-gray-900">
              Microphone Access
            </DialogTitle>
          </div>
        </DialogHeader>
        
        <p className="text-gray-600 mb-6">
          This app needs access to your microphone to enable voice conversations with the AI assistant.
        </p>
        
        <div className="flex space-x-3">
          <Button 
            onClick={() => {
              onRequestPermission();
              onClose();
            }}
            className="flex-1"
          >
            Allow Access
          </Button>
          <Button 
            variant="outline" 
            onClick={onClose}
            className="flex-1"
          >
            Not Now
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
