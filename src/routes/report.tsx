import { useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Mic,
  Square,
  Type,
  Camera,
  Upload,
  Sparkles,
  Siren,
  AlertTriangle,
  ShieldAlert,
  Waves,
  X,
  Loader2,
  Copy,
  CheckCheck,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SectionHeader } from "@/components/section-header";
import { StatusBadge } from "@/components/status-badge";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import type { ImageAnalysis, SosData } from "@/lib/types";

export const Route = createFileRoute("/report")({
  head: () => ({
    meta: [
      { title: "Report Emergency — Flood Copilot" },
      {
        name: "description",
        content:
          "Report flood emergencies by voice, text, or photo. AI-assisted summaries and one-tap SOS relay.",
      },
      { property: "og:title", content: "Report Emergency — Flood Copilot" },
      {
        property: "og:description",
        content:
          "Voice, text, and photo emergency reporting with AI summaries and instant SOS.",
      },
    ],
  }),
  component: ReportPage,
});

function ReportPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="Emergency Report"
        title="Report a flood emergency"
        description="Send a report using voice, text, or a photo. Our AI drafts a summary and prepares an SOS you can send in one tap."
      />

      <div className="mt-8">
        <Tabs defaultValue="voice" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="voice" className="gap-2">
              <Mic className="h-4 w-4" />
              <span className="hidden sm:inline">Voice</span>
            </TabsTrigger>
            <TabsTrigger value="text" className="gap-2">
              <Type className="h-4 w-4" />
              <span className="hidden sm:inline">Text</span>
            </TabsTrigger>
            <TabsTrigger value="photo" className="gap-2">
              <Camera className="h-4 w-4" />
              <span className="hidden sm:inline">Photo</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="voice" className="mt-6">
            <VoiceReport />
          </TabsContent>
          <TabsContent value="text" className="mt-6">
            <TextReport />
          </TabsContent>
          <TabsContent value="photo" className="mt-6">
            <PhotoReport />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

/* ─── SOS Dialog ────────────────────────────────────────────────────────────── */

function SosDialog({
  open,
  onClose,
  prefillEmergency,
}: {
  open: boolean;
  onClose: () => void;
  prefillEmergency?: string;
}) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [emergency, setEmergency] = useState(prefillEmergency ?? "");
  const [people, setPeople] = useState("1");
  const [urgency, setUrgency] = useState<"high" | "critical">("high");
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SosData | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (prefillEmergency) setEmergency(prefillEmergency);
  }, [prefillEmergency]);

  const reset = () => {
    setResult(null);
    setError("");
    setCopied(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const generate = async () => {
    if (!name.trim() || !location.trim() || !emergency.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await api.sos({
        name: name.trim(),
        location: location.trim(),
        emergency: emergency.trim(),
        peopleAffected: Math.max(1, parseInt(people, 10) || 1),
        urgency,
        contactNumber: contact.trim(),
      });
      if (res.success) setResult(res.data);
      else setError(res.error.message);
    } catch {
      setError("Could not generate SOS. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const copy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <Siren className="h-5 w-5" />
            Generate SOS Message
          </DialogTitle>
          <DialogDescription>
            Fill in the details below. The AI will generate a bilingual SOS in
            English and Telugu ready to relay to 112.
          </DialogDescription>
        </DialogHeader>

        {!result ? (
          <div className="mt-2 space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Your name *</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Raju Yadav"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Contact number</label>
                <Input
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="e.g. 9876543210"
                  type="tel"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Your location *</label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Village, mandal, landmark — be specific"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Emergency description *</label>
              <Textarea
                value={emergency}
                onChange={(e) => setEmergency(e.target.value)}
                placeholder="Describe the situation: water level, injuries, whether you can move..."
                className="min-h-[80px] resize-none"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">People affected</label>
                <Input
                  value={people}
                  onChange={(e) => setPeople(e.target.value)}
                  type="number"
                  min={1}
                  max={10000}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Urgency</label>
                <Select value={urgency} onValueChange={(v) => setUrgency(v as typeof urgency)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical — life at risk</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {error && (
              <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            )}

            <Button
              onClick={generate}
              disabled={loading || !name.trim() || !location.trim() || !emergency.trim()}
              className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Siren className="mr-2 h-4 w-4" />
              )}
              {loading ? "Generating…" : "Generate SOS"}
            </Button>
          </div>
        ) : (
          <div className="mt-2 space-y-4">
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-destructive">
                English SOS
              </p>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                {result.englishMessage}
              </p>
            </div>

            <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">
                Telugu / తెలుగు
              </p>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                {result.teluguMessage}
              </p>
            </div>

            {result.smsText && (
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  SMS (relay to 112)
                </p>
                <p className="text-sm leading-relaxed text-foreground">{result.smsText}</p>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => copy(`${result.englishMessage}\n\n${result.teluguMessage}`)}
                className="flex-1"
              >
                {copied ? (
                  <CheckCheck className="mr-2 h-4 w-4 text-success" />
                ) : (
                  <Copy className="mr-2 h-4 w-4" />
                )}
                {copied ? "Copied!" : "Copy message"}
              </Button>
              <Button asChild size="sm" className="flex-1 bg-destructive text-white hover:bg-destructive/90">
                <a href="tel:112">
                  <Phone className="mr-2 h-4 w-4" />
                  Call 112 now
                </a>
              </Button>
            </div>

            <Button variant="ghost" size="sm" onClick={reset} className="w-full text-muted-foreground">
              Generate another SOS
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

/* ─── Voice Report ──────────────────────────────────────────────────────────── */

// Type declaration for Web Speech API (not in default TS lib)
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

function VoiceReport() {
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [aiReply, setAiReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sosOpen, setSosOpen] = useState(false);
  const [hasSpeechApi, setHasSpeechApi] = useState(false);

  const timer = useRef<number | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const SRA =
      typeof window !== "undefined"
        ? window.SpeechRecognition ?? window.webkitSpeechRecognition
        : null;
    setHasSpeechApi(!!SRA);
  }, []);

  useEffect(() => {
    if (recording) {
      timer.current = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    } else if (timer.current) {
      window.clearInterval(timer.current);
    }
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [recording]);

  const startRecording = useCallback(() => {
    setSeconds(0);
    setTranscript("");
    setAiReply("");
    setError("");

    const SRA = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!SRA) {
      setRecording(true);
      return;
    }

    const rec = new SRA();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = navigator.language || "en-US"; // use the browser/OS language so speech is transcribed in whatever language the user speaks
    recognitionRef.current = rec;

    let finalText = "";
    rec.onresult = (e: SpeechRecognitionEvent) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) finalText += t + " ";
        else interim = t;
      }
      setTranscript((finalText + interim).trim());
    };
    rec.onerror = () => {
      setRecording(false);
      if (timer.current) window.clearInterval(timer.current);
      setError("Microphone access denied or not available. Type a transcript below.");
    };
    rec.start();
    setRecording(true);
  }, []);

  const stopRecording = useCallback(async () => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setRecording(false);

    const finalTranscript = transcript.trim();
    if (!finalTranscript) return;

    setLoading(true);
    setError("");
    try {
      const res = await api.voice(finalTranscript, "auto");
      if (res.success) setAiReply(res.data.reply);
      else setError(res.error.message);
    } catch {
      setError("Could not reach the server. Check your connection.");
    } finally {
      setLoading(false);
    }
  }, [transcript]);

  const toggle = () => {
    if (recording) stopRecording();
    else startRecording();
  };

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  const hasResult = !!aiReply;

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel>
          <div className="flex flex-col items-center justify-center gap-6 py-6">
            <div className="relative">
              <AnimatePresence>
                {recording && (
                  <>
                    <motion.span
                      key="ring1"
                      className="absolute inset-0 rounded-full bg-destructive/30"
                      initial={{ scale: 1, opacity: 0.6 }}
                      animate={{ scale: 1.8, opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
                    />
                    <motion.span
                      key="ring2"
                      className="absolute inset-0 rounded-full bg-destructive/20"
                      initial={{ scale: 1, opacity: 0.5 }}
                      animate={{ scale: 2.4, opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut", delay: 0.4 }}
                    />
                  </>
                )}
              </AnimatePresence>
              <button
                onClick={toggle}
                aria-label={recording ? "Stop recording" : "Start recording"}
                className={cn(
                  "relative flex h-32 w-32 items-center justify-center rounded-full text-white shadow-[var(--shadow-elegant)] transition-all",
                  recording
                    ? "bg-destructive hover:bg-destructive/90"
                    : "bg-primary hover:bg-primary/90",
                )}
              >
                {recording ? <Square className="h-10 w-10" /> : <Mic className="h-12 w-12" />}
              </button>
            </div>

            <div className="text-center">
              <p className="font-mono text-3xl font-semibold tracking-tight">
                {mm}:{ss}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {recording
                  ? "Recording… tap to stop"
                  : transcript
                    ? "Recording captured"
                    : "Tap the microphone to start"}
              </p>
              {!hasSpeechApi && !recording && (
                <p className="mt-1 text-xs text-muted-foreground">
                  (No speech API — type transcript below)
                </p>
              )}
            </div>

            {recording && (
              <StatusBadge variant="danger" pulse>
                LIVE
              </StatusBadge>
            )}

            {/* Editable transcript area */}
            {(!hasSpeechApi || !!transcript || recording || !!error) && (
              <div className="w-full">
                <Textarea
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  placeholder="Voice transcript will appear here. You can also type directly."
                  className="min-h-[100px] resize-none text-sm"
                />
                {!recording && transcript && !aiReply && (
                  <Button
                    onClick={async () => {
                      setLoading(true);
                      setError("");
                      try {
                        const res = await api.voice(transcript, "auto");
                        if (res.success) setAiReply(res.data.reply);
                        else setError(res.error.message);
                      } catch {
                        setError("Could not reach the server.");
                      } finally {
                        setLoading(false);
                      }
                    }}
                    disabled={loading || !transcript.trim()}
                    className="mt-2 w-full"
                  >
                    {loading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="mr-2 h-4 w-4" />
                    )}
                    {loading ? "Analysing…" : "Analyse with AI"}
                  </Button>
                )}
              </div>
            )}
          </div>
        </Panel>

        <div className="flex flex-col gap-6">
          {transcript && (
            <InfoCard icon={<Type className="h-5 w-5" />} title="Transcript" accent="primary">
              <p className="text-sm leading-relaxed text-foreground">{transcript}</p>
              <p className="pt-2 text-xs text-muted-foreground">Auto-detected language</p>
            </InfoCard>
          )}
          <AiReplyCard
            loading={loading}
            reply={aiReply}
            error={error}
            emptyLabel="Record and stop to get an AI emergency summary."
          />
          <SosButton disabled={!hasResult} onClick={() => setSosOpen(true)} />
        </div>
      </div>

      <SosDialog
        open={sosOpen}
        onClose={() => setSosOpen(false)}
        prefillEmergency={aiReply || transcript}
      />
    </>
  );
}

/* ─── Text Report ───────────────────────────────────────────────────────────── */

const MAX_CHARS = 1000;

function TextReport() {
  const [text, setText] = useState("");
  const [aiReply, setAiReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sosOpen, setSosOpen] = useState(false);

  const generate = async () => {
    if (text.trim().length < 10) return;
    setLoading(true);
    setError("");
    setAiReply("");
    try {
      const res = await api.chat(
        `FLOOD EMERGENCY REPORT: ${text.trim()}\n\nPlease summarise this emergency, identify the location and situation, and give 2–3 immediate safety instructions.`,
      );
      if (res.success) setAiReply(res.data.reply);
      else setError(res.error.message);
    } catch {
      setError("Could not reach the server. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel>
          <div className="flex flex-col gap-3">
            <label htmlFor="text-report" className="text-sm font-medium">
              Describe the emergency
            </label>
            <Textarea
              id="text-report"
              value={text}
              onChange={(e) => {
                setText(e.target.value.slice(0, MAX_CHARS));
                if (aiReply) setAiReply("");
              }}
              placeholder="Where are you? How high is the water? How many people are with you? Any injuries or medical needs?"
              className="min-h-[240px] resize-none text-base"
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Include location, water level, and number of people.</span>
              <span className={cn(text.length > MAX_CHARS * 0.9 && "text-warning")}>
                {text.length} / {MAX_CHARS}
              </span>
            </div>
            <Button
              onClick={generate}
              disabled={text.trim().length < 10 || loading}
              className="mt-2 w-full sm:w-auto"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              {loading ? "Generating…" : "Generate Summary"}
            </Button>
          </div>
        </Panel>

        <div className="flex flex-col gap-6">
          <AiReplyCard
            loading={loading}
            reply={aiReply}
            error={error}
            emptyLabel="AI-generated emergency summary will appear here."
          />
          <SosButton disabled={!aiReply} onClick={() => setSosOpen(true)} />
        </div>
      </div>

      <SosDialog
        open={sosOpen}
        onClose={() => setSosOpen(false)}
        prefillEmergency={text}
      />
    </>
  );
}

/* ─── Photo Report ──────────────────────────────────────────────────────────── */

function PhotoReport() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [analysis, setAnalysis] = useState<ImageAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sosOpen, setSosOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const onFile = async (file?: File | null) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setImageFile(file);
    setAnalysis(null);
    setError("");

    setLoading(true);
    try {
      const res = await api.image(file);
      if (res.success) setAnalysis(res.data.analysis);
      else setError(res.error.message);
    } catch {
      setError("Could not analyse the image. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const removeImage = () => {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setImageUrl(null);
    setImageFile(null);
    setAnalysis(null);
    setError("");
  };

  const severityVariant = (s?: string): "danger" | "warning" | "info" | "success" | "muted" => {
    if (!s) return "muted";
    const map: Record<string, "danger" | "warning" | "info" | "success"> = {
      critical: "danger",
      severe: "danger",
      moderate: "warning",
      minor: "success",
    };
    return map[s.toLowerCase()] ?? "info";
  };

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel>
          {!imageUrl ? (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => { e.preventDefault(); setDragging(false); onFile(e.dataTransfer.files?.[0]); }}
              onClick={() => inputRef.current?.click()}
              className={cn(
                "flex min-h-[280px] cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 text-center transition-colors",
                dragging
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50 hover:bg-accent/40",
              )}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Upload className="h-6 w-6" />
              </div>
              <div>
                <p className="text-base font-medium">Drop a flood photo here</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  or click to browse — JPG or PNG, up to 10 MB
                </p>
              </div>
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => onFile(e.target.files?.[0])}
              />
            </div>
          ) : (
            <div className="relative overflow-hidden rounded-xl border border-border">
              <img src={imageUrl} alt="Uploaded flood scene" className="h-auto w-full object-cover" />
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm">
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm font-medium text-foreground">Analysing image…</p>
                  </div>
                </div>
              )}
              <button
                onClick={removeImage}
                className="absolute right-3 top-3 rounded-full bg-background/80 p-2 text-foreground backdrop-blur hover:bg-background"
                aria-label="Remove image"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
          {error && (
            <p className="mt-3 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}
          {imageFile && !loading && !analysis && !error && (
            <Button
              onClick={() => onFile(imageFile)}
              className="mt-3 w-full"
              variant="outline"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Retry analysis
            </Button>
          )}
        </Panel>

        <div className="flex flex-col gap-6">
          <InfoCard
            icon={<Waves className="h-5 w-5" />}
            title="Flood Risk Assessment"
            accent="info"
            empty={!analysis && !loading}
            emptyLabel={loading ? "Analysing…" : "Upload a photo to see the AI assessment."}
            loading={loading}
          >
            {analysis && (
              <>
                {analysis.waterLevel && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Est. water level</span>
                    <span className="text-sm font-medium">{analysis.waterLevel}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Severity</span>
                  <StatusBadge
                    variant={severityVariant(analysis.severity)}
                    pulse={["critical", "severe"].includes((analysis.severity ?? "").toLowerCase())}
                  >
                    {analysis.severity ?? "Unknown"}
                  </StatusBadge>
                </div>
                {analysis.immediateRisks && analysis.immediateRisks.length > 0 && (
                  <div className="pt-1">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Immediate risks
                    </p>
                    <ul className="mt-1 space-y-0.5">
                      {analysis.immediateRisks.map((r) => (
                        <li key={r} className="flex items-start gap-1.5 text-sm text-foreground">
                          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warning" />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {analysis.callEmergency && (
                  <div className="mt-1 flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    <Phone className="h-4 w-4 shrink-0" />
                    {analysis.callEmergencyReason ?? "Call 112 immediately"}
                  </div>
                )}
                <p className="pt-1 text-xs text-muted-foreground">{analysis.summary}</p>
              </>
            )}
          </InfoCard>

          <InfoCard
            icon={<ShieldAlert className="h-5 w-5" />}
            title="Recommended Action"
            accent="warning"
            empty={!analysis && !loading}
            emptyLabel={loading ? "Generating advice…" : "Awaiting image analysis."}
            loading={loading}
          >
            {(analysis?.recommendedActions ?? analysis?.rescueAdvice) && (
              <ul className="space-y-1.5">
                {(analysis.recommendedActions ?? analysis.rescueAdvice)!.map((advice) => (
                  <li key={advice} className="flex items-start gap-2 text-sm leading-relaxed text-foreground">
                    <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warning" />
                    {advice}
                  </li>
                ))}
              </ul>
            )}
          </InfoCard>

          <SosButton disabled={!analysis} onClick={() => setSosOpen(true)} />
        </div>
      </div>

      <SosDialog
        open={sosOpen}
        onClose={() => setSosOpen(false)}
        prefillEmergency={analysis?.summary ?? ""}
      />
    </>
  );
}

/* ─── Shared pieces ─────────────────────────────────────────────────────────── */

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
      {children}
    </div>
  );
}

function InfoCard({
  icon,
  title,
  accent = "primary",
  children,
  empty,
  emptyLabel,
  loading,
}: {
  icon: React.ReactNode;
  title: string;
  accent?: "primary" | "info" | "warning" | "success";
  children?: React.ReactNode;
  empty?: boolean;
  emptyLabel?: string;
  loading?: boolean;
}) {
  const accents: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    info: "bg-info/15 text-info",
    warning: "bg-warning/20 text-warning-foreground dark:text-warning",
    success: "bg-success/15 text-success",
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]"
    >
      <div className="mb-3 flex items-center gap-3">
        <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl", accents[accent])}>
          {icon}
        </div>
        <h3 className="text-sm font-semibold">{title}</h3>
        {loading && <Loader2 className="ml-auto h-4 w-4 animate-spin text-muted-foreground" />}
      </div>
      {empty ? (
        <p className="text-sm text-muted-foreground">{emptyLabel}</p>
      ) : (
        <div className="space-y-2">{children}</div>
      )}
    </motion.div>
  );
}

function AiReplyCard({
  loading,
  reply,
  error,
  emptyLabel,
}: {
  loading: boolean;
  reply: string;
  error: string;
  emptyLabel: string;
}) {
  return (
    <InfoCard
      icon={<Sparkles className="h-5 w-5" />}
      title="AI Summary"
      accent="info"
      empty={!reply && !loading && !error}
      emptyLabel={emptyLabel}
      loading={loading}
    >
      {error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : (
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">{reply}</p>
      )}
    </InfoCard>
  );
}

function SosButton({
  disabled,
  onClick,
}: {
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      size="lg"
      onClick={onClick}
      disabled={disabled}
      className="h-14 w-full bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
    >
      <Siren className="mr-2 h-5 w-5" />
      Generate SOS
    </Button>
  );
}
