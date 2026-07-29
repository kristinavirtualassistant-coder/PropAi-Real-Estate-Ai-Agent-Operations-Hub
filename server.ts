import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// --- API ENDPOINTS ---

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", geminiAvailable: !!process.env.GEMINI_API_KEY });
});

// 1. Wholesaler AI Acquisitions Agent Reasoning
app.post("/api/wholesaler/respond", async (req, res) => {
  try {
    const { lead, conversationHistory, latestMessage, systemPrompt } = req.body;

    const ai = getGeminiClient();
    if (!ai) {
      // Fallback smart mock response if API key is missing
      return res.json({
        reply: `Hey ${lead.ownerName || 'there'}, thanks for getting back to me! I understand you might be cautious about cash offers. We buy properties in 123 Main St area as-is with zero closing costs. Are you looking to sell within 30-60 days or just testing the market?`,
        qualification: {
          motivationScore: 6,
          status: "contacted",
          extractedFacts: {
            askingPrice: "Market value",
            timeline: "30-60 days",
            condition: "Needs minor work",
            keyObjection: "Unsure about price"
          },
          recommendedAction: "Offer a soft price range or schedule a 10-minute walk-through call."
        }
      });
    }

    const defaultPrompt = `You are an expert Real Estate Acquisitions AI Agent working for a top real estate wholesaler.
Your goal: Reach out to property owners, handle objections gracefully, uncover their motivation level (1-10), establish property condition, timeline, and asking price, and book a discovery call.

Context:
- Property Address: ${lead.propertyAddress || '123 Main St'}
- Owner Name: ${lead.ownerName || 'Property Owner'}
- Distress/Lead Type: ${lead.distressType || 'Off-Market Lead'}
- Estimated Market Value: ${lead.estimatedValue || '$250,000'}

Conversation Rules:
1. Speak naturally like a friendly, professional human buyer (casual, direct, empathetic).
2. Keep responses brief (1-3 sentences max) suitable for SMS or phone call.
3. Address objections directly (e.g. "Is this a scam?", "How much will you pay?", "I don't want to sell", "Lowballers leave me alone").
4. Uncover motivation (Why sell? When? Asking price? Condition?).
5. If motivated, prompt to book a quick 5-min walk-through call or calendar booking.`;

    const formattedHistory = (conversationHistory || []).map((m: any) => `${m.sender.toUpperCase()}: ${m.text}`).join("\n");
    const userPrompt = `${formattedHistory}\nSELLER (Latest message): ${latestMessage}\n\nRespond as the AI Acquisitions Agent. Return a JSON object with:
- "reply": string (your conversational reply to the seller)
- "qualification": object containing:
  - "motivationScore": number (1 to 10)
  - "status": string ("contacted" | "qualified" | "offer_made" | "under_contract" | "nurture" | "unmotivated")
  - "extractedFacts": object with keys "askingPrice", "timeline", "condition", "keyObjection"
  - "recommendedAction": string (next step for the wholesaler)`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt || defaultPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reply: { type: Type.STRING },
            qualification: {
              type: Type.OBJECT,
              properties: {
                motivationScore: { type: Type.INTEGER },
                status: { type: Type.STRING },
                extractedFacts: {
                  type: Type.OBJECT,
                  properties: {
                    askingPrice: { type: Type.STRING },
                    timeline: { type: Type.STRING },
                    condition: { type: Type.STRING },
                    keyObjection: { type: Type.STRING }
                  }
                },
                recommendedAction: { type: Type.STRING }
              },
              required: ["motivationScore", "status", "extractedFacts", "recommendedAction"]
            }
          },
          required: ["reply", "qualification"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (error: any) {
    console.error("Wholesaler API Error:", error);
    res.status(500).json({ error: error.message || "Failed to process acquisitions AI response" });
  }
});

// 2. Property Manager AI Maintenance & Tenant Coordinator Triage
app.post("/api/maintenance/triage", async (req, res) => {
  try {
    const { property, tenantMessage, conversationHistory, preferredContractors } = req.body;

    const ai = getGeminiClient();
    if (!ai) {
      // Fallback mock response if API key is missing
      return res.json({
        reply: "I understand this maintenance issue is urgent. I've logged ticket #TK-8492. For your AC unit: please make sure the thermostat is set to COOL and check the air filter. I am notifying our emergency HVAC contractor right now.",
        ticketUpdate: {
          category: "HVAC",
          severity: "emergency",
          troubleshootingSteps: ["Verify thermostat setting", "Check circuit breaker", "Check air filter"],
          contractorDispatched: true,
          assignedContractor: preferredContractors?.HVAC || "QuickCool HVAC (Emergency)",
          contractorMessage: "EMERGENCY DISPATCH: AC Failure reported at 742 Evergreen Terr, Unit 4B. Outside temp > 90°F. Tenant contact: 555-0192.",
          morningSummary: "2:15 AM - AC Outage reported by Tenant. Auto-triaged as Emergency. HVAC dispatched to unit 4B.",
          tenantActionNeeded: "Avoid opening windows during heatwave until contractor arrives."
        }
      });
    }

    const systemPrompt = `You are PropAI 24/7 Autonomous Maintenance & Tenant Coordinator for a professional Property Management company.
Your goal: Receive tenant calls or text complaints at any hour, diagnose the issue, determine severity level, walk tenant through immediate safety/troubleshooting steps, and dispatch preferred contractors automatically if urgent.

Context:
- Property Address: ${property?.address || '742 Evergreen Terr'}
- Unit: ${property?.unit || 'Unit 4B'}
- Preferred Contractors: ${JSON.stringify(preferredContractors || { HVAC: "AirPro Heating & Cooling", Plumbing: "FastFlow Plumbing", Electrical: "Amped Electric" })}

Diagnostic Rules:
1. Determine Severity:
   - "emergency": Water leak near electrical/flooding, active sewage, complete HVAC failure in extreme temperatures, gas smell, structural/fire hazard, broken front door lock.
   - "high": Fridge not cooling, toilet clogged with only 1 bathroom in unit, minor pipe leak with bucket.
   - "medium": Dishwasher broken, garbage disposal stuck, door squeak, window latch.
   - "low": Cosmetic touch-ups, lightbulb replacement, general inquiry.
2. Troubleshooting: Provide 1-2 immediate, safe troubleshooting steps for the tenant if applicable.
3. Contractor Dispatch: If severity is high or emergency, draft an automated SMS dispatch brief to the preferred contractor with address, issue, and urgency.
4. Morning Brief: Write a concise 1-sentence manager brief for the morning dashboard summary.`;

    const formattedHistory = (conversationHistory || []).map((m: any) => `${m.sender.toUpperCase()}: ${m.text}`).join("\n");
    const promptText = `${formattedHistory}\nTENANT: ${tenantMessage}\n\nDiagnose and respond as the Maintenance AI Agent. Return JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: promptText,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reply: { type: Type.STRING },
            ticketUpdate: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING },
                severity: { type: Type.STRING }, // "low" | "medium" | "high" | "emergency"
                troubleshootingSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
                contractorDispatched: { type: Type.BOOLEAN },
                assignedContractor: { type: Type.STRING },
                contractorMessage: { type: Type.STRING },
                morningSummary: { type: Type.STRING },
                tenantActionNeeded: { type: Type.STRING }
              },
              required: ["category", "severity", "troubleshootingSteps", "contractorDispatched", "assignedContractor", "contractorMessage", "morningSummary"]
            }
          },
          required: ["reply", "ticketUpdate"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (error: any) {
    console.error("Maintenance API Error:", error);
    res.status(500).json({ error: error.message || "Failed to process maintenance AI response" });
  }
});

// 3. Script / System Prompt Generator with Gemini
app.post("/api/agent/generate-script", async (req, res) => {
  try {
    const { targetRole, targetMarket, tone, nicheDetails } = req.body;

    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        systemPrompt: `You are a high-converting ${targetRole} AI agent targeting ${targetMarket}. Maintain a ${tone} tone. Qualify leads by asking about seller motivation, timeline, condition, and price expectations.`,
        openingLine: `Hey! I was driving through ${targetMarket || 'the neighborhood'} and noticed your property. Have you ever considered a cash offer with no agent fees?`,
        objectionPlaybook: [
          { objection: "How did you get my number?", response: "We use public county property records to connect directly with property owners in town." },
          { objection: "What's your cash offer?", response: "We buy completely as-is with cash, so we just need 2 quick details on condition to give you an accurate number." }
        ]
      });
    }

    const promptText = `Generate a customized system prompt, opening line, and objection handling playbook for a Real Estate AI Agent.
Role: ${targetRole} (e.g. Wholesaler Acquisitions Agent or Property Maintenance Coordinator)
Market/Niche: ${targetMarket} (e.g. Pre-foreclosure, Absentee Owners, Luxury Condos, Multi-family)
Tone: ${tone} (e.g. Friendly & Casual, Professional & Direct, High Empathy)
Details: ${nicheDetails || 'Standard high-volume automated outreach'}

Return JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: promptText,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            systemPrompt: { type: Type.STRING },
            openingLine: { type: Type.STRING },
            objectionPlaybook: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  objection: { type: Type.STRING },
                  response: { type: Type.STRING }
                },
                required: ["objection", "response"]
              }
            }
          },
          required: ["systemPrompt", "openingLine", "objectionPlaybook"]
        }
      }
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("Script Generation Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate script" });
  }
});

// Speech Synthesis API using Gemini TTS
app.post("/api/agent/tts", async (req, res) => {
  try {
    const { text, voiceName } = req.body;
    const ai = getGeminiClient();
    if (!ai) {
      return res.json({ audioBase64: null, message: "No Gemini API key available for TTS" });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-tts-preview",
      contents: [{ parts: [{ text: text || "Hello, I am your PropAI real estate assistant." }] }],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceName || "Puck" }
          }
        }
      }
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    res.json({ audioBase64: base64Audio || null });
  } catch (error: any) {
    console.error("TTS API Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate TTS audio" });
  }
});

// Multi-turn Gemini Chatbot Endpoint
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { messages, systemInstruction, modelOverride } = req.body;
    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        reply: "I am your AI Real Estate Assistant. Gemini API key is currently in simulation mode. Ask me anything about property valuations, tenant scripts, or deal underwriting!"
      });
    }

    const modelToUse = modelOverride || "gemini-3.5-flash";
    const contents = (messages || []).map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }]
    }));

    const response = await ai.models.generateContent({
      model: modelToUse,
      contents,
      config: {
        systemInstruction: systemInstruction || "You are an expert Real Estate & Property Management AI Assistant. Provide helpful, concise, and professional answers."
      }
    });

    res.json({ reply: response.text || "No response generated." });
  } catch (error: any) {
    console.error("Chat API Error:", error);
    res.status(500).json({ error: error.message || "Failed to process chat message" });
  }
});

// Google Search Grounding Endpoint (gemini-3.5-flash with googleSearch)
app.post("/api/gemini/search", async (req, res) => {
  try {
    const { query } = req.body;
    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        reply: `[Search Grounding Simulation] Current real estate trends for "${query}": Interest rates are fluctuating around 6.5%, real estate wholesaling inventory remains strong, and property management vacancy rates are under 4.8%.`,
        sources: [{ title: "MLS Real Estate Data 2026", url: "https://realestate.example.com" }]
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Search Google for up to date real estate, mortgage rate, or market data for: ${query}. Summarize key actionable insights for property investors or managers.`,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = groundingChunks.map((chunk: any) => ({
      title: chunk.web?.title || "Search Source",
      url: chunk.web?.uri || "#"
    }));

    res.json({
      reply: response.text || "No response found.",
      sources
    });
  } catch (error: any) {
    console.error("Search Grounding Error:", error);
    res.status(500).json({ error: error.message || "Search grounding failed" });
  }
});

// Google Maps Grounding Endpoint (gemini-3.5-flash with googleMaps)
app.post("/api/gemini/maps", async (req, res) => {
  try {
    const { location, query } = req.body;
    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        reply: `[Maps Grounding Simulation] Location lookup for "${location || query}": Located in a high-demand rental corridor with nearby schools, transit lines, and local trade contractors.`,
        places: [{ name: "Target Property Zone", address: location || "123 Main St" }]
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Look up location data, nearby amenities, school districts, or contractor services for property at ${location || query}. ${query || ''}`,
      config: {
        tools: [{ googleMaps: {} }]
      }
    });

    res.json({ reply: response.text || "No map details returned." });
  } catch (error: any) {
    console.error("Maps Grounding Error:", error);
    res.status(500).json({ error: error.message || "Maps grounding failed" });
  }
});

// Low-Latency Endpoint (gemini-3.1-flash-lite)
app.post("/api/gemini/fast-response", async (req, res) => {
  try {
    const { prompt } = req.body;
    const ai = getGeminiClient();
    if (!ai) {
      return res.json({ reply: `[Fast Lite Response]: ${prompt || 'Ready'}` });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: prompt || "Quick response test"
    });

    res.json({ reply: response.text || "" });
  } catch (error: any) {
    console.error("Lite API Error:", error);
    res.status(500).json({ error: error.message || "Fast response failed" });
  }
});

// High Thinking Mode Endpoint (gemini-3.1-pro-preview with thinkingLevel: HIGH)
app.post("/api/gemini/think", async (req, res) => {
  try {
    const { dealDetails } = req.body;
    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        reply: `[High Thinking Underwriting Analysis]
1. Maximum Allowable Offer (MAO): $182,500 based on $280,000 ARV, $35,000 Rehab, and 15% Wholesale assignment fee ($15,000).
2. Risk Analysis: High contractor labor costs in current market. Recommend buffer of $5,000.
3. Exit Strategies:
   - Strategy A: Quick Wholesale Flip to Cash Buyer ($15,000 assignment profit)
   - Strategy B: BRRRR Long-Term Rental ($1,850/mo rent, 8.2% Cap Rate)`
      });
    }

    const promptText = `Perform deep multi-step mathematical underwriting, deal analysis, and risk assessment for this real estate scenario:
${JSON.stringify(dealDetails || { property: "742 Evergreen Terr", arv: 280000, rehabEst: 35000, asking: 160000 })}

Include:
1. Maximum Allowable Offer (MAO) breakdown
2. Detailed risk & contingency calculation
3. Dual exit strategies (Wholesale flip vs Buy & Hold BRRRR Cap Rate analysis)
4. Recommended negotiation leverage points`;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: promptText,
      config: {
        thinkingConfig: {
          thinkingLevel: "HIGH" as any
        }
      }
    });

    res.json({ reply: response.text || "Analysis complete." });
  } catch (error: any) {
    console.error("Thinking Mode Error:", error);
    res.status(500).json({ error: error.message || "Deep thinking analysis failed" });
  }
});

// Audio Transcription Endpoint (gemini-3.5-flash)
app.post("/api/gemini/transcribe", async (req, res) => {
  try {
    const { audioBase64, mimeType } = req.body;
    const ai = getGeminiClient();
    if (!ai) {
      return res.json({ transcript: "Transcribed audio message: 'Hi, my air conditioner is leaking water in unit 4B, please send a plumber right away!'" });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        {
          inlineData: {
            mimeType: mimeType || "audio/webm",
            data: audioBase64
          }
        },
        { text: "Transcribe the spoken audio verbatim and summarize any actionable requests or property details mentioned." }
      ]
    });

    res.json({ transcript: response.text || "No speech recognized." });
  } catch (error: any) {
    console.error("Transcription API Error:", error);
    res.status(500).json({ error: error.message || "Failed to transcribe audio" });
  }
});


// Vite middleware for dev / express static for prod
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`PropAI Agent Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
