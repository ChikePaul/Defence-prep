import React, { useState, useRef, useEffect } from "react";
import {
  Mic,
  MicOff,
  Upload,
  Sparkles,
  FileAudio,
  Copy,
  Check,
  Volume2,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
} from "lucide-react";
import confetti from "canvas-confetti";

export const AudioTranscriberSection: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [transcribing, setTranscribing] = useState(false);
  const [transcription, setTranscription] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const startRecording = async () => {
    setErrorMsg(null);
    audioChunksRef.current = [];
    setRecordingSeconds(0);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: mediaRecorder.mimeType || "audio/webm" });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);

        // Stop all tracks to release mic
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);

      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error("Microphone access error:", err);
      setErrorMsg("Could not access microphone. Please ensure microphone permissions are granted.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioBlob(file);
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
      setTranscription("");
      setErrorMsg(null);
    }
  };

  const handleTranscribe = async () => {
    if (!audioBlob) return;
    setTranscribing(true);
    setErrorMsg(null);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;

        const res = await fetch("/api/transcribe-audio", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            audioData: base64String,
            mimeType: audioBlob.type || "audio/webm",
          }),
        });

        const data = await res.json();
        if (data.success && data.transcription) {
          setTranscription(data.transcription);
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 },
          });
        } else {
          throw new Error(data.error || "Transcription failed");
        }
        setTranscribing(false);
      };
      reader.readAsDataURL(audioBlob);
    } catch (err: any) {
      console.error("Transcription error:", err);
      setErrorMsg(err.message || "Failed to transcribe audio");
      setTranscribing(false);
    }
  };

  const handleCopy = () => {
    if (!transcription) return;
    navigator.clipboard.writeText(transcription);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Header */}
      <div className="rounded-xl border border-[#2E3447] bg-[#1A1D2B] p-6 sm:p-10 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-3xl">
          <div className="text-xs font-semibold text-[#06B6D4] flex items-center gap-2 tracking-wide uppercase">
            <Mic className="w-4 h-4 text-[#06B6D4]" />
            <span>SIWES Speech Intelligence</span>
            <span aria-hidden="true" className="text-[#2E3447]">·</span>
            <span className="text-[#3B82F6]">Powered by gemini-3.5-transcribe</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Defense Speech & Rehearsal Audio Transcriber
          </h2>

          <p className="text-[#D1D5DB] text-sm leading-relaxed">
            Record your oral defense practice presentation or upload audio clips. Gemini 3.5 Transcribe converts your spoken technical vocabulary, project descriptions, and troubleshooting arguments into clean, verbatim text for revision.
          </p>
        </div>

        {/* Upload Audio Option */}
        <label className="flex items-center gap-2 !px-5 !py-3 !rounded-md !bg-[#3B82F6] hover:!bg-[#06B6D4] text-white text-xs font-bold cursor-pointer transition-all shrink-0 shadow-md">
          <Upload className="w-4 h-4" />
          <span>Upload Audio File</span>
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-lg bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Grid: Recording Studio + Transcription Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live Audio Recorder (5 cols) */}
        <div className="lg:col-span-5 bg-[#1A1D2B] border border-[#2E3447] rounded-xl p-6 sm:p-8 space-y-6 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileAudio className="w-4 h-4 text-[#3B82F6]" />
              <span>Microphone Recording Studio</span>
            </h3>
            <p className="text-xs text-[#D1D5DB] leading-relaxed">
              Click record and practice answering: "What did you do during your 6 months of IT?" Speak clearly as if before your departmental panel.
            </p>

            {/* Recording Visualizer Box */}
            <div className="py-10 px-6 rounded-lg bg-[#0F1118] border border-[#2E3447] flex flex-col items-center justify-center space-y-4">
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                  isRecording
                    ? "bg-rose-500/20 border-2 border-rose-500 animate-pulse text-rose-400 shadow-lg shadow-rose-500/30"
                    : audioBlob
                    ? "bg-[#10B981]/20 border-2 border-[#10B981] text-[#10B981]"
                    : "bg-[#1A1D2B] border border-[#2E3447] text-[#6B7280]"
                }`}
              >
                {isRecording ? (
                  <Mic className="w-9 h-9" />
                ) : (
                  <Volume2 className="w-9 h-9" />
                )}
              </div>

              {/* Timer Display */}
              <div className="flex items-center gap-2 font-mono text-xl font-bold text-white">
                <Clock className="w-4 h-4 text-[#3B82F6]" />
                <span>{formatSeconds(recordingSeconds)}</span>
              </div>

              <span className="text-[11px] text-[#6B7280] font-medium">
                {isRecording
                  ? "Recording in progress... speak your defense response"
                  : audioBlob
                  ? "Audio recorded & ready to transcribe"
                  : "Microphone idle. Click Start Recording below."}
              </span>
            </div>

            {/* Audio Playback Element */}
            {audioUrl && (
              <div className="p-3 rounded-lg bg-[#0F1118] border border-[#2E3447]">
                <audio src={audioUrl} controls className="w-full h-8" />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            {!isRecording ? (
              <button
                onClick={startRecording}
                className="w-full !py-3 !rounded-md !bg-[#3B82F6] hover:!bg-[#06B6D4] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Mic className="w-4 h-4" />
                <span>Start Microphone Recording</span>
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="w-full !py-3 !rounded-md !bg-rose-600 hover:!bg-rose-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer animate-pulse"
              >
                <MicOff className="w-4 h-4" />
                <span>Stop Recording ({formatSeconds(recordingSeconds)})</span>
              </button>
            )}

            {audioBlob && (
              <button
                onClick={handleTranscribe}
                disabled={transcribing || isRecording}
                className="w-full !py-3 !rounded-md !bg-[#06B6D4] hover:!bg-[#3B82F6] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                <Sparkles className={`w-4 h-4 ${transcribing ? "animate-spin" : ""}`} />
                <span>{transcribing ? "Transcribing with gemini-3.5-transcribe..." : "Transcribe Audio Now"}</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Transcription Results (7 cols) */}
        <div className="lg:col-span-7 bg-[#1A1D2B] border border-[#2E3447] rounded-xl p-6 sm:p-8 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-3 flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#3B82F6]" />
                <span>Verbatim Transcription Output</span>
              </h3>
              {transcription && (
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-[#10B981] bg-[#0F1118] border border-[#2E3447] px-2 py-0.5 rounded-md">
                    {transcription.split(/\s+/).filter(Boolean).length} words
                  </span>
                  <button
                    onClick={handleCopy}
                    className="!p-1.5 !rounded-md !bg-[#0F1118] hover:!bg-[#24293D] text-[#D1D5DB] hover:text-white border border-[#2E3447] transition-colors cursor-pointer text-xs flex items-center gap-1.5"
                    title="Copy transcription"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Copied" : "Copy"}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Transcript Text Box */}
            <div className="w-full h-80 rounded-lg bg-[#0F1118] border border-[#2E3447] p-5 overflow-y-auto text-xs sm:text-sm text-[#D1D5DB] leading-relaxed font-sans">
              {transcription ? (
                <div className="whitespace-pre-wrap">{transcription}</div>
              ) : transcribing ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-3 text-[#6B7280]">
                  <Sparkles className="w-8 h-8 text-[#06B6D4] animate-spin" />
                  <p className="text-xs">
                    Processing audio stream through Gemini 3.5 Transcribe engine...
                  </p>
                  <p className="text-[11px]">
                    Recognizing technical IT terms, architecture names, and spoken phrasing.
                  </p>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-2 text-[#6B7280]">
                  <FileText className="w-10 h-10 opacity-30 text-[#3B82F6]" />
                  <p className="text-xs">No transcription yet.</p>
                  <p className="text-[11px] max-w-sm">
                    Record your voice on the left or upload an audio file, then click "Transcribe Audio Now".
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Defense Rehearsal Tips */}
          <div className="p-4 rounded-lg bg-[#0F1118] border border-[#2E3447] text-xs space-y-1.5">
            <span className="font-bold text-[#10B981] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Examiner Clarity Check</span>
            </span>
            <p className="text-[#6B7280] text-[11px] leading-relaxed">
              Read through your transcript. Check if you clearly articulated: (1) The specific problem, (2) The engineering tool chosen, and (3) The quantified outcome. Avoid vague filler words like "we did many things."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
