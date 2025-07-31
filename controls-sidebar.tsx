import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX, Brain } from "lucide-react";

interface ControlsSidebarProps {
  isCallActive: boolean;
  isMuted: boolean;
  isSpeakerOn: boolean;
  voiceSpeed: number;
  voiceVolume: number;
  selectedModel: string;
  connectionStatus: {
    gemini: boolean;
    microphone: boolean;
    speaker: boolean;
  };
  sessionStats: {
    messageCount: number;
    duration: string;
    apiCalls: number;
  };
  onToggleCall: () => void;
  onToggleMute: () => void;
  onToggleSpeaker: () => void;
  onVoiceSpeedChange: (speed: number) => void;
  onVoiceVolumeChange: (volume: number) => void;
  onModelChange: (model: string) => void;
}

export function ControlsSidebar({
  isCallActive,
  isMuted,
  isSpeakerOn,
  voiceSpeed,
  voiceVolume,
  selectedModel,
  connectionStatus,
  sessionStats,
  onToggleCall,
  onToggleMute,
  onToggleSpeaker,
  onVoiceSpeedChange,
  onVoiceVolumeChange,
  onModelChange
}: ControlsSidebarProps) {
  return (
    <Card className="w-80 overflow-hidden">
      <CardContent className="p-0">
        {/* Call Controls */}
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Call Controls</h3>
          
          {/* Primary Call Button */}
          <div className="flex justify-center mb-6">
            <Button
              onClick={onToggleCall}
              className={`w-20 h-20 rounded-full shadow-lg transition-all duration-200 transform hover:scale-105 ${
                isCallActive
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-green-500 hover:bg-green-600'
              }`}
            >
              {isCallActive ? (
                <PhoneOff className="h-6 w-6 text-white" />
              ) : (
                <Phone className="h-6 w-6 text-white" />
              )}
            </Button>
          </div>

          {/* Secondary Controls */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={onToggleMute}
              className="flex items-center justify-center space-x-2 p-3"
            >
              {isMuted ? (
                <MicOff className="h-4 w-4 text-gray-600" />
              ) : (
                <Mic className="h-4 w-4 text-gray-600" />
              )}
              <span className="text-sm text-gray-700">
                {isMuted ? 'Unmute' : 'Mute'}
              </span>
            </Button>
            
            <Button
              variant="outline"
              onClick={onToggleSpeaker}
              className="flex items-center justify-center space-x-2 p-3"
            >
              {isSpeakerOn ? (
                <Volume2 className="h-4 w-4 text-gray-600" />
              ) : (
                <VolumeX className="h-4 w-4 text-gray-600" />
              )}
              <span className="text-sm text-gray-700">Speaker</span>
            </Button>
          </div>
        </div>

        {/* Settings */}
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Settings</h3>
          
          <div className="space-y-4">
            {/* Voice Speed */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Voice Speed
              </label>
              <Slider
                value={[voiceSpeed]}
                onValueChange={(value) => onVoiceSpeedChange(value[0])}
                min={0.5}
                max={2}
                step={0.1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Slow</span>
                <span>Normal</span>
                <span>Fast</span>
              </div>
            </div>
            
            {/* Voice Volume */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Voice Volume
              </label>
              <Slider
                value={[voiceVolume]}
                onValueChange={(value) => onVoiceVolumeChange(value[0])}
                min={0}
                max={1}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* AI Model */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                AI Model
              </label>
              <Select value={selectedModel} onValueChange={onModelChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gemini-2.5-flash">Gemini 2.5 Flash (Free)</SelectItem>
                  <SelectItem value="gemini-2.5-pro">Gemini 2.5 Pro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Connection Status */}
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Status</h3>
          
          <div className="space-y-3">
            {/* API Status */}
            <div className={`flex items-center justify-between p-3 rounded-lg ${
              connectionStatus.gemini ? 'bg-green-50' : 'bg-red-50'
            }`}>
              <div className="flex items-center space-x-2">
                <Brain className={`h-4 w-4 ${connectionStatus.gemini ? 'text-green-600' : 'text-red-600'}`} />
                <span className="text-sm text-gray-700">Gemini API</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${
                  connectionStatus.gemini ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <span className={`text-xs ${
                  connectionStatus.gemini ? 'text-green-600' : 'text-red-600'
                }`}>
                  {connectionStatus.gemini ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>

            {/* Microphone Status */}
            <div className={`flex items-center justify-between p-3 rounded-lg ${
              connectionStatus.microphone ? 'bg-green-50' : 'bg-red-50'
            }`}>
              <div className="flex items-center space-x-2">
                <Mic className={`h-4 w-4 ${connectionStatus.microphone ? 'text-green-600' : 'text-red-600'}`} />
                <span className="text-sm text-gray-700">Microphone</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${
                  connectionStatus.microphone ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <span className={`text-xs ${
                  connectionStatus.microphone ? 'text-green-600' : 'text-red-600'
                }`}>
                  {connectionStatus.microphone ? 'Ready' : 'Not Available'}
                </span>
              </div>
            </div>

            {/* Speaker Status */}
            <div className={`flex items-center justify-between p-3 rounded-lg ${
              connectionStatus.speaker ? 'bg-green-50' : 'bg-red-50'
            }`}>
              <div className="flex items-center space-x-2">
                <Volume2 className={`h-4 w-4 ${connectionStatus.speaker ? 'text-green-600' : 'text-red-600'}`} />
                <span className="text-sm text-gray-700">Speaker</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${
                  connectionStatus.speaker ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <span className={`text-xs ${
                  connectionStatus.speaker ? 'text-green-600' : 'text-red-600'
                }`}>
                  {connectionStatus.speaker ? 'Ready' : 'Not Available'}
                </span>
              </div>
            </div>
          </div>

          {/* Usage Stats */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Session Stats</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Messages:</span>
                <span>{sessionStats.messageCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Duration:</span>
                <span>{sessionStats.duration}</span>
              </div>
              <div className="flex justify-between">
                <span>API Calls:</span>
                <span>{sessionStats.apiCalls}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
