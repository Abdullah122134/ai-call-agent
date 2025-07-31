import { useState, useEffect, useCallback } from "react";
import { ConversationPanel } from "@/components/conversation-panel";
import { ControlsSidebar } from "@/components/controls-sidebar";
import { ErrorModal } from "@/components/error-modal";
import { PermissionModal } from "@/components/permission-modal";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis";
import { useWebSocket } from "@/hooks/use-websocket";
import { useToast } from "@/hooks/use-toast";
import { type Message } from "@shared/schema";
import { Bot } from "lucide-react";

// Browser-compatible UUID generation
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export default function CallAgent() {
  // State
  const [conversation, setConversation] = useState<Message[]>([]);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [selectedModel, setSelectedModel] = useState("gemini-2.5-flash");
  const [isProcessing, setIsProcessing] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [sessionDuration, setSessionDuration] = useState("00:00:00");
  const [apiCalls, setApiCalls] = useState(0);
  const [lastProcessedTranscript, setLastProcessedTranscript] = useState("");
  const [connectionStatus, setConnectionStatus] = useState({
    gemini: false,
    microphone: false,
    speaker: true
  });
  const [errorModal, setErrorModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onRetry: undefined as (() => void) | undefined
  });
  const [permissionModal, setPermissionModal] = useState(false);

  // Hooks
  const { toast } = useToast();
  const speechRecognition = useSpeechRecognition();
  const speechSynthesis = useSpeechSynthesis();
  const webSocket = useWebSocket();

  // Test API connection on mount
  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await fetch('/api/test-connection');
        const data = await response.json();
        setConnectionStatus(prev => ({ ...prev, gemini: data.connected }));
        
        if (!data.connected) {
          setErrorModal({
            isOpen: true,
            title: "API Connection Error",
            message: "Unable to connect to the Gemini API. Please check your API key configuration.",
            onRetry: () => window.location.reload()
          });
        }
      } catch (error) {
        setConnectionStatus(prev => ({ ...prev, gemini: false }));
      }
    };

    testConnection();
  }, []);

  // Check microphone permission
  useEffect(() => {
    const checkMicrophonePermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setConnectionStatus(prev => ({ ...prev, microphone: true }));
        stream.getTracks().forEach(track => track.stop());
      } catch (error) {
        setConnectionStatus(prev => ({ ...prev, microphone: false }));
      }
    };

    checkMicrophonePermission();
  }, []);

  // Handle WebSocket messages
  useEffect(() => {
    if (webSocket.lastMessage) {
      const message = webSocket.lastMessage;
      
      if (message.type === 'ai-response') {
        const aiMessage: Message = {
          id: message.messageId || generateUUID(),
          role: 'assistant',
          content: message.text,
          timestamp: message.timestamp || new Date().toISOString(),
          type: 'text'
        };
        
        // Check if message already exists to prevent duplicates
        setConversation(prev => {
          const exists = prev.some(msg => msg.id === aiMessage.id);
          if (exists) return prev;
          return [...prev, aiMessage];
        });
        setIsProcessing(false);
        
        // Speak the response if speaker is on
        if (isSpeakerOn && !isMuted) {
          speechSynthesis.speak(message.text);
        }
        
        setApiCalls(prev => prev + 1);
      } else if (message.type === 'error') {
        setIsProcessing(false);
        toast({
          title: "Error",
          description: message.message,
          variant: "destructive"
        });
      }
    }
  }, [webSocket.lastMessage, isSpeakerOn, isMuted, speechSynthesis, toast]);

  // Handle speech recognition results
  useEffect(() => {
    const transcript = speechRecognition.transcript.trim();
    
    // Only process when we have a meaningful transcript, call is active, not already processing, and it's different from last processed
    if (transcript && 
        transcript.length > 2 &&  // Minimum length to avoid noise
        isCallActive && 
        !isProcessing &&
        transcript !== lastProcessedTranscript) {
      
      setLastProcessedTranscript(transcript);
      
      const userMessage: Message = {
        id: generateUUID(),
        role: 'user',
        content: transcript,
        timestamp: new Date().toISOString(),
        type: 'speech'
      };
      
      setConversation(prev => [...prev, userMessage]);
      setIsProcessing(true);
      
      // Send to AI via WebSocket
      webSocket.sendMessage({
        type: 'speech-to-ai',
        text: transcript,
        conversationHistory: conversation.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      });
      
      // Clear transcript after processing
      setTimeout(() => {
        speechRecognition.resetTranscript();
      }, 500);
    }
  }, [speechRecognition.transcript, isCallActive, isProcessing, lastProcessedTranscript, conversation, webSocket]);

  // Update session duration
  useEffect(() => {
    if (!sessionStartTime) return;
    
    const interval = setInterval(() => {
      const now = new Date();
      const diff = now.getTime() - sessionStartTime.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setSessionDuration(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    }, 1000);
    
    return () => clearInterval(interval);
  }, [sessionStartTime]);

  // Handle errors
  useEffect(() => {
    if (speechRecognition.error) {
      toast({
        title: "Speech Recognition Error",
        description: speechRecognition.error,
        variant: "destructive"
      });
    }
  }, [speechRecognition.error, toast]);

  // Request microphone permission
  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setConnectionStatus(prev => ({ ...prev, microphone: true }));
      stream.getTracks().forEach(track => track.stop());
      toast({
        title: "Permission Granted",
        description: "Microphone access has been granted."
      });
    } catch (error) {
      setErrorModal({
        isOpen: true,
        title: "Permission Denied",
        message: "Microphone access is required for voice conversations. Please allow microphone access in your browser settings.",
        onRetry: undefined
      });
    }
  };

  // Toggle call
  const handleToggleCall = useCallback(() => {
    if (!connectionStatus.microphone && !isCallActive) {
      setPermissionModal(true);
      return;
    }

    if (!connectionStatus.gemini) {
      setErrorModal({
        isOpen: true,
        title: "Connection Required",
        message: "Please ensure the Gemini API connection is working before starting a call.",
        onRetry: () => window.location.reload()
      });
      return;
    }

    const newCallState = !isCallActive;
    setIsCallActive(newCallState);
    
    if (newCallState) {
      setSessionStartTime(new Date());
      setLastProcessedTranscript("");
      speechRecognition.resetTranscript();
      speechRecognition.startListening();
    } else {
      speechRecognition.stopListening();
      speechSynthesis.cancel();
      setIsProcessing(false);
      setLastProcessedTranscript("");
    }
  }, [isCallActive, connectionStatus, speechRecognition, speechSynthesis]);

  // Other handlers
  const handleClearConversation = () => {
    setConversation([]);
    setApiCalls(0);
    setLastProcessedTranscript("");
    speechRecognition.resetTranscript();
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
    if (!isMuted) {
      speechSynthesis.cancel();
    }
  };

  const handleToggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn);
    if (isSpeakerOn) {
      speechSynthesis.cancel();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-xl font-medium text-gray-900">AI Call Agent</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${webSocket.isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            <span className="text-sm text-gray-600">
              {webSocket.isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex max-w-7xl mx-auto">
        <div className="flex-1 m-4">
          <ConversationPanel
            conversation={conversation}
            isListening={speechRecognition.isListening && isCallActive}
            isProcessing={isProcessing}
            isSpeaking={speechSynthesis.isSpeaking}
            onClearConversation={handleClearConversation}
          />
        </div>
        
        <div className="m-4 ml-0">
          <ControlsSidebar
            isCallActive={isCallActive}
            isMuted={isMuted}
            isSpeakerOn={isSpeakerOn}
            voiceSpeed={speechSynthesis.rate}
            voiceVolume={speechSynthesis.volume}
            selectedModel={selectedModel}
            connectionStatus={connectionStatus}
            sessionStats={{
              messageCount: conversation.length,
              duration: sessionDuration,
              apiCalls
            }}
            onToggleCall={handleToggleCall}
            onToggleMute={handleToggleMute}
            onToggleSpeaker={handleToggleSpeaker}
            onVoiceSpeedChange={speechSynthesis.setRate}
            onVoiceVolumeChange={speechSynthesis.setVolume}
            onModelChange={setSelectedModel}
          />
        </div>
      </div>

      {/* Modals */}
      <ErrorModal
        isOpen={errorModal.isOpen}
        title={errorModal.title}
        message={errorModal.message}
        onRetry={errorModal.onRetry}
        onClose={() => setErrorModal(prev => ({ ...prev, isOpen: false }))}
      />
      
      <PermissionModal
        isOpen={permissionModal}
        onRequestPermission={requestMicrophonePermission}
        onClose={() => setPermissionModal(false)}
      />
    </div>
  );
}
