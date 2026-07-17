// ─── Shared API response types ─────────────────────────────────────────────

export type ApiSuccess<T> = { success: true; data: T };
export type ApiError = { success: false; error: { message: string } };
export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// ─── Health ─────────────────────────────────────────────────────────────────

export interface HealthData {
  status: string;
  service: string;
  environment: string;
  timestamp: string;
  uptime: number;
}

// ─── Shelters ────────────────────────────────────────────────────────────────

export interface Shelter {
  id: string;
  name: string;
  type: string;
  district: string;
  village: string;
  distanceKm: number;
  capacity: number;
  occupied: number;
  phone: string;
  status: "open" | "filling" | "full";
  coordinates?: { lat: number; lng: number };
}

export interface SheltersData {
  count: number;
  shelters: Shelter[];
}

// ─── Emergency contacts ──────────────────────────────────────────────────────

export interface EmergencyContact {
  id: string;
  name: string;
  nameTe: string;
  number: string;
  description: string;
  descriptionTe: string;
  available: string;
  type: string;
}

export interface EmergencyData {
  count: number;
  contacts: EmergencyContact[];
}

// ─── Tips ────────────────────────────────────────────────────────────────────

export interface Tip {
  id: string;
  category: string;
  priority: string;
  titleEn: string;
  titleTe: string;
  bodyEn: string;
  bodyTe: string;
  icon: string;
}

export interface TipsData {
  count: number;
  tips: Tip[];
}

// ─── Alerts ──────────────────────────────────────────────────────────────────

export type Severity = "critical" | "high" | "moderate" | "advisory";
export type SourceType = "IMD" | "CWC" | "District" | "NDRF" | "TSDMA";

export interface Alert {
  id: string;
  title: string;
  district: string;
  mandal: string;
  severity: Severity;
  source: string;
  sourceType: SourceType;
  publishedAt: string;
  aiSummary: string;
  instructions: string[];
  details: string;
  river?: string;
}

export interface AlertsData {
  count: number;
  alerts: Alert[];
}

// ─── Chat ────────────────────────────────────────────────────────────────────

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatData {
  reply: string;
  timestamp: string;
}

// ─── Voice ───────────────────────────────────────────────────────────────────

export interface VoiceData {
  reply: string;
  detectedLanguage: string;
  timestamp: string;
}

// ─── Image ───────────────────────────────────────────────────────────────────

export interface ImageAnalysis {
  severity?: string;
  waterLevel?: string;
  immediateRisks?: string[];
  rescueAdvice?: string[];
  callEmergency?: boolean;
  callEmergencyReason?: string;
  summary: string;
}

export interface ImageData {
  analysis: ImageAnalysis;
  imageId: string;
  timestamp: string;
}

// ─── Translate ────────────────────────────────────────────────────────────────

export interface TranslateData {
  original: string;
  translated: string;
  from: string;
  to: string;
  timestamp: string;
}

// ─── SOS ─────────────────────────────────────────────────────────────────────

export interface SosData {
  sosId: string;
  englishMessage: string;
  teluguMessage: string;
  smsText: string;
  broadcastMessage: string;
  metadata: {
    name: string;
    location: string;
    emergency: string;
    peopleAffected: number;
    urgency: string;
    contactNumber: string;
    generatedAt: string;
  };
}
