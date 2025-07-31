import { useState, useEffect, useCallback, useRef } from "react";

interface UseSpeechSynthesisReturn {
  speak: (text: string) => void;
  cancel: () => void;
  isSpeaking: boolean;
  isSupported: boolean;
  voices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
  setSelectedVoice: (voice: SpeechSynthesisVoice) => void;
  rate: number;
  setRate: (rate: number) => void;
  volume: number;
  setVolume: (volume: number) => void;
}

export function useSpeechSynthesis(): UseSpeechSynthesisReturn {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [rate, setRate] = useState(1);
  const [volume, setVolume] = useState(0.8);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const isSupported = 'speechSynthesis' in window;

  useEffect(() => {
    if (!isSupported) return;

    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      setVoices(availableVoices);
      
      if (availableVoices.length > 0 && !selectedVoice) {
        // Try to find an English voice, otherwise use the first one
        const englishVoice = availableVoices.find(voice => voice.lang.startsWith('en'));
        setSelectedVoice(englishVoice || availableVoices[0]);
      }
    };

    loadVoices();
    speechSynthesis.addEventListener('voiceschanged', loadVoices);

    return () => {
      speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, [isSupported, selectedVoice]);

  const speak = useCallback((text: string) => {
    if (!isSupported) return;

    // Cancel any ongoing speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = selectedVoice;
    utterance.rate = rate;
    utterance.volume = volume;

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    utteranceRef.current = utterance;
    speechSynthesis.speak(utterance);
  }, [isSupported, selectedVoice, rate, volume]);

  const cancel = useCallback(() => {
    if (!isSupported) return;
    speechSynthesis.cancel();
    setIsSpeaking(false);
  }, [isSupported]);

  useEffect(() => {
    return () => {
      speechSynthesis.cancel();
    };
  }, []);

  return {
    speak,
    cancel,
    isSpeaking,
    isSupported,
    voices,
    selectedVoice,
    setSelectedVoice,
    rate,
    setRate,
    volume,
    setVolume
  };
}
