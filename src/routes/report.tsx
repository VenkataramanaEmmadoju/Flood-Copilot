import { useEffect, useRef, useState } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { SectionHeader } from "@/components/section-header";
import { StatusBadge } from "@/components/status-badge";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/report")({
  head: () => ({
    meta: [
      { title: "Report Emergency — Telugu Flood Copilot" },
      {
        name: "description",
        content:
          "Report flood emergencies by voice, text, or photo. AI-assisted summaries and one-tap SOS relay.",
      },
      { property: "og:title", content: "Report Emergency — Telugu Flood Copilot" },
      {
        property: "og:description",
        content:
          "Voice, text, and photo emergency reporting with AI summaries and instant SOS.",
      },
    ],
  }),
  component: ReportPage,
});

const MOCK_TRANSCRIPT =
  "వరద నీరు మా వీధిలోకి వచ్చేసింది. ఇంటి ముందు నీళ్లు మోకాళ్ల ఎత్తు వరకు ఉన్నాయి. ముగ్గురు పెద్దలు, ఇద్దరు పిల్లలు ఇంట్లో ఉన్నారు. వెంటనే సహాయం కావాలి.";

const MOCK_AI_SUMMARY = {
  location: "Kondapur, Hyderabad — near 2nd cross road",
  situation: "Knee-deep flood water surrounding home; rising in last 30 minutes.",
  people: "5 people trapped (3 adults, 2 children under 10)",
  urgency: "HIGH — evacuation needed within the hour",
};

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

/* ---------------- Voice Report ---------------- */

function VoiceReport() {
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [hasRecording, setHasRecording] = useState(false);
  const timer = useRef<number | null>(null);

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

  const toggle = () => {
    if (recording) {
      // TODO: send audio blob to POST /voice for transcription + AI summary
      setRecording(false);
      setHasRecording(true);
    } else {
      setSeconds(0);
      setHasRecording(false);
      setRecording(true);
    }
  };

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
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
                : hasRecording
                  ? "Recording captured"
                  : "Tap the microphone to start"}
            </p>
          </div>

          {recording && (
            <StatusBadge variant="danger" pulse>
              LIVE
            </StatusBadge>
          )}
        </div>
      </Panel>

      <div className="flex flex-col gap-6">
        <TranscriptCard text={hasRecording ? MOCK_TRANSCRIPT : undefined} />
        <AiSummaryCard show={hasRecording} />
        <SosButton disabled={!hasRecording} />
      </div>
    </div>
  );
}

/* ---------------- Text Report ---------------- */

const MAX_CHARS = 1000;

function TextReport() {
  const [text, setText] = useState("");
  const [summarized, setSummarized] = useState(false);

  const generate = () => {
    // TODO: send text to POST /text for AI summary
    setSummarized(true);
  };

  return (
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
              setSummarized(false);
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
            disabled={text.trim().length < 10}
            className="mt-2 w-full sm:w-auto"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Generate Summary
          </Button>
        </div>
      </Panel>

      <div className="flex flex-col gap-6">
        <AiSummaryCard show={summarized} />
        <SosButton disabled={!summarized} />
      </div>
    </div>
  );
}

/* ---------------- Photo Report ---------------- */

function PhotoReport() {
  const [image, setImage] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const onFile = (file?: File | null) => {
    if (!file) return;
    // TODO: send image to POST /image for flood risk assessment
    const url = URL.createObjectURL(file);
    setImage(url);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Panel>
        {!image ? (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              onFile(e.dataTransfer.files?.[0]);
            }}
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
            <img src={image} alt="Uploaded flood scene" className="h-auto w-full object-cover" />
            <button
              onClick={() => setImage(null)}
              className="absolute right-3 top-3 rounded-full bg-background/80 p-2 text-foreground backdrop-blur hover:bg-background"
              aria-label="Remove image"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </Panel>

      <div className="flex flex-col gap-6">
        <Card
          icon={<Waves className="h-5 w-5" />}
          title="Flood Risk Assessment"
          accent="info"
          empty={!image}
          emptyLabel="Upload a photo to see the AI assessment."
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Estimated water level</span>
            <span className="text-sm font-medium">~0.9 m (waist-high)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Current flow</span>
            <span className="text-sm font-medium">Moderate, visible debris</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Severity</span>
            <StatusBadge variant="danger" pulse>
              High
            </StatusBadge>
          </div>
        </Card>

        <Card
          icon={<ShieldAlert className="h-5 w-5" />}
          title="Recommended Action"
          accent="warning"
          empty={!image}
          emptyLabel="Awaiting image analysis."
        >
          <p className="text-sm leading-relaxed">
            Move to the highest floor immediately. Avoid contact with the water — it may
            be electrically live or contaminated. Signal rescuers from a window or roof
            and keep phones charged.
          </p>
        </Card>

        <SosButton disabled={!image} />
      </div>
    </div>
  );
}

/* ---------------- Shared pieces ---------------- */

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
      {children}
    </div>
  );
}

function Card({
  icon,
  title,
  accent = "primary",
  children,
  empty,
  emptyLabel,
}: {
  icon: React.ReactNode;
  title: string;
  accent?: "primary" | "info" | "warning" | "success";
  children: React.ReactNode;
  empty?: boolean;
  emptyLabel?: string;
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
      </div>
      {empty ? (
        <p className="text-sm text-muted-foreground">{emptyLabel}</p>
      ) : (
        <div className="space-y-2">{children}</div>
      )}
    </motion.div>
  );
}

function TranscriptCard({ text }: { text?: string }) {
  return (
    <Card
      icon={<Type className="h-5 w-5" />}
      title="Transcript"
      accent="primary"
      empty={!text}
      emptyLabel="Your recording transcript will appear here."
    >
      <p className="text-sm leading-relaxed text-foreground">{text}</p>
      <p className="pt-2 text-xs text-muted-foreground">Auto-detected language: Telugu</p>
    </Card>
  );
}

function AiSummaryCard({ show }: { show: boolean }) {
  return (
    <Card
      icon={<Sparkles className="h-5 w-5" />}
      title="AI Summary"
      accent="info"
      empty={!show}
      emptyLabel="AI-generated emergency summary will appear here."
    >
      <SummaryRow label="Location" value={MOCK_AI_SUMMARY.location} />
      <SummaryRow label="Situation" value={MOCK_AI_SUMMARY.situation} />
      <SummaryRow label="People" value={MOCK_AI_SUMMARY.people} />
      <div className="flex items-start justify-between gap-3 pt-1">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">Urgency</span>
        <StatusBadge variant="danger" pulse>
          <AlertTriangle className="h-3 w-3" /> High
        </StatusBadge>
      </div>
    </Card>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-border/60 pb-2 last:border-0 last:pb-0">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      <span className="text-sm text-foreground">{value}</span>
    </div>
  );
}

function SosButton({ disabled }: { disabled?: boolean }) {
  const onClick = () => {
    // TODO: send finalized report to POST /generate-sos and dispatch to 112
  };
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
