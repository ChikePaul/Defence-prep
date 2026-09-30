/**
 * Web Speech API utilities for spoken questions and voice responses
 */

export function speakText(text: string, persona: "academic" | "engineer" | "coordinator" = "academic") {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  const voices = window.speechSynthesis.getVoices();

  // Try to find natural English voices
  if (voices.length > 0) {
    const englishVoices = voices.filter((v) => v.lang.startsWith("en"));
    if (persona === "academic") {
      utterance.rate = 0.95;
      utterance.pitch = 0.9; // Stern, slightly deeper
      if (englishVoices.length > 0) utterance.voice = englishVoices[0];
    } else if (persona === "engineer") {
      utterance.rate = 1.05;
      utterance.pitch = 1.05; // Energetic, sharp
      if (englishVoices.length > 1) utterance.voice = englishVoices[1];
    } else {
      utterance.rate = 0.98;
      utterance.pitch = 1.1; // Coordinator
      if (englishVoices.length > 2) utterance.voice = englishVoices[2];
    }
  }

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

// Browser Speech Recognition Helper
export function createSpeechRecognizer(
  onResult: (transcript: string) => void,
  onError: (err: any) => void,
  onEnd: () => void
) {
  if (typeof window === "undefined") return null;

  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.lang = "en-US";

  recognition.onresult = (event: any) => {
    let finalTranscript = "";
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript;
      }
    }
    if (finalTranscript) {
      onResult(finalTranscript);
    }
  };

  recognition.onerror = (event: any) => {
    onError(event.error);
  };

  recognition.onend = () => {
    onEnd();
  };

  return recognition;
}
