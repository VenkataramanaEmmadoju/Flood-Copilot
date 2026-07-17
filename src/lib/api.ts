import type {
  ApiResponse,
  HealthData,
  SheltersData,
  EmergencyData,
  TipsData,
  AlertsData,
  ChatData,
  ChatMessage,
  VoiceData,
  ImageData,
  TranslateData,
  SosData,
} from "./types";

// In dev the Vite proxy rewrites /api → http://localhost:8000.
// In production set VITE_API_URL=https://your-backend.onrender.com/api
const BASE =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) || "/api";

async function request<T>(
  path: string,
  init: RequestInit = {},
): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(`${BASE}${path}`, {
      headers:
        init.body instanceof FormData
          ? undefined // let browser set multipart boundary
          : { "Content-Type": "application/json", ...(init.headers as Record<string, string>) },
      ...init,
    });
    const json = await res.json();
    if (!res.ok) {
      return {
        success: false,
        error: { message: json?.error?.message ?? `HTTP ${res.status}` },
      };
    }
    return json as ApiResponse<T>;
  } catch (err) {
    return {
      success: false,
      error: { message: err instanceof Error ? err.message : "Network error" },
    };
  }
}

// ─── GET endpoints ───────────────────────────────────────────────────────────

export const api = {
  health: () => request<HealthData>("/health"),

  shelters: (params?: { district?: string; status?: string }) => {
    const q = new URLSearchParams();
    if (params?.district) q.set("district", params.district);
    if (params?.status) q.set("status", params.status);
    const qs = q.toString();
    return request<SheltersData>(`/shelters${qs ? `?${qs}` : ""}`);
  },

  emergency: (params?: { type?: string }) => {
    const q = new URLSearchParams();
    if (params?.type) q.set("type", params.type);
    const qs = q.toString();
    return request<EmergencyData>(`/emergency${qs ? `?${qs}` : ""}`);
  },

  tips: (params?: { category?: string; priority?: string }) => {
    const q = new URLSearchParams();
    if (params?.category) q.set("category", params.category);
    if (params?.priority) q.set("priority", params.priority);
    const qs = q.toString();
    return request<TipsData>(`/tips${qs ? `?${qs}` : ""}`);
  },

  alerts: (params?: { district?: string; severity?: string }) => {
    const q = new URLSearchParams();
    if (params?.district) q.set("district", params.district);
    if (params?.severity) q.set("severity", params.severity);
    const qs = q.toString();
    return request<AlertsData>(`/alerts${qs ? `?${qs}` : ""}`);
  },

  // ─── POST endpoints ────────────────────────────────────────────────────────

  chat: (message: string, history: ChatMessage[] = []) =>
    request<ChatData>("/chat", {
      method: "POST",
      body: JSON.stringify({ message, history }),
    }),

  voice: (transcript: string, language: "auto" | "te" | "en" | "hi" = "auto") =>
    request<VoiceData>("/voice", {
      method: "POST",
      body: JSON.stringify({ transcript, language }),
    }),

  image: (file: File) => {
    const form = new FormData();
    form.append("image", file);
    return request<ImageData>("/image", { method: "POST", body: form });
  },

  translate: (text: string, from: "auto" | "te" | "en" | "hi", to: "te" | "en" | "hi") =>
    request<TranslateData>("/translate", {
      method: "POST",
      body: JSON.stringify({ text, from, to }),
    }),

  sos: (payload: {
    name: string;
    location: string;
    emergency: string;
    peopleAffected?: number;
    urgency?: "low" | "medium" | "high" | "critical";
    contactNumber?: string;
  }) =>
    request<SosData>("/sos", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};
