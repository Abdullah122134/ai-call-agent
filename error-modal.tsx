import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface ErrorModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onRetry?: () => void;
  onClose: () => void;
}

export function ErrorModal({ isOpen, title, message, onRetry, onClose }: ErrorModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <DialogTitle className="text-lg font-medium text-gray-900">
              {title}
            </DialogTitle>
          </div>
        </DialogHeader>
        
        <p className="text-gray-600 mb-6">{message}</p>
        
        <div className="flex space-x-3">
          {onRetry && (
            <Button 
              onClick={() => {
                onRetry();
                onClose();
              }}
              className="flex-1"
            >
              Retry
            </Button>
          )}
          <Button 
            variant="outline" 
            onClick={onClose}
            className="flex-1"
          >
            {onRetry ? 'Cancel' : 'Close'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
