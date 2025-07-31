import { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Mic, Volume2, Bot } from "lucide-react";
import { type Message } from "@shared/schema";

interface ConversationPanelProps {
  conversation: Message[];
  isListening: boolean;
  isProcessing: boolean;
  isSpeaking: boolean;
  onClearConversation: () => void;
}

export function ConversationPanel({
  conversation,
  isListening,
  isProcessing,
  isSpeaking,
  onClearConversation
}: ConversationPanelProps) {
  const conversationEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusDisplay = () => {
    if (isListening) {
      return (
        <div className="flex items-center justify-center space-x-3">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600">Listening...</span>
          <div className="flex space-x-1">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-1 bg-green-500 rounded animate-bounce"
                style={{
                  height: `${12 + (i % 2) * 8}px`,
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </div>
        </div>
      );
    }

    if (isProcessing) {
      return (
        <div className="flex items-center justify-center space-x-3">
          <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600">Processing...</span>
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-yellow-500 border-t-transparent"></div>
        </div>
      );
    }

    if (isSpeaking) {
      return (
        <div className="flex items-center justify-center space-x-3">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600">AI Speaking...</span>
          <Volume2 className="h-4 w-4 text-blue-500 animate-pulse" />
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center space-x-3">
        <span className="text-sm text-gray-500">Ready to start conversation</span>
      </div>
    );
  };

  return (
    <Card className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-gray-900">Conversation</h2>
            <p className="text-sm text-gray-500">{conversation.length} messages</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearConversation}
            className="text-gray-400 hover:text-gray-600"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Conversation Feed */}
      <CardContent className="flex-1 p-6 overflow-y-auto">
        {conversation.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>Start a conversation by clicking the call button</p>
          </div>
        ) : (
          <div className="space-y-4">
            {conversation.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className="max-w-xs lg:max-w-md">
                  <div
                    className={`rounded-2xl px-4 py-3 shadow-sm ${
                      message.role === 'user'
                        ? 'bg-blue-500 text-white rounded-br-sm'
                        : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                  <div
                    className={`flex items-center mt-1 space-x-2 ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.role === 'user' ? (
                      <>
                        <span className="text-xs text-gray-400">
                          {formatTime(message.timestamp)}
                        </span>
                        <Mic className="h-3 w-3 text-gray-400" />
                      </>
                    ) : (
                      <>
                        <Bot className="h-3 w-3 text-blue-500" />
                        <span className="text-xs text-gray-400">
                          {formatTime(message.timestamp)}
                        </span>
                        <Volume2 className="h-3 w-3 text-gray-400" />
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isProcessing && (
              <div className="flex justify-start">
                <div className="max-w-xs lg:max-w-md">
                  <div className="bg-gray-100 text-gray-900 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={conversationEndRef} />
          </div>
        )}
      </CardContent>

      {/* Status Bar */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
        {getStatusDisplay()}
      </div>
    </Card>
  );
}
