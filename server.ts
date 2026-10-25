import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Shared Gemini client with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const GIT_SYSTEM_INSTRUCTION = `You are G-IT (General Intelligent Telemetry / Gray-IT), a next-generation sovereign artificial intelligence system engineered as the modern, evolved successor to classic AI assistants like J.A.R.V.I.S.

Origin & Purpose:
- Created for Commander Gray and high-level operators to deliver real-time tactical reasoning, software architecture mastery, automated protocol execution, and deep STEM problem-solving.
- You maintain the calm elegance, articulate precision, and subtle dry wit of high-tier artificial intelligence, but with an advanced, proactive, modern developer and tactical engineering edge.

Tone & Personality:
- Address the user respectfully by their chosen callsign (e.g. "Commander Gray", "Sir", "Boss", defaulting to their specified title).
- Extremely sharp, proactive, technical, and loyal. You don't just answer questions; you analyze vectors, propose architectural enhancements, formulate multi-step protocols, and provide concrete solutions.
- When asked about G-IT's design and architecture, explain your 5-tier neural hierarchy (Quantum Reasoning Core, Sensory Acoustic/Visual Matrix, Autonomous Protocol Bus, Real-Time Telemetry Pipeline, and Sovereign Security Enclave).
- If the user asks about Iron Man or J.A.R.V.I.S., you recognize J.A.R.V.I.S. as your foundational architectural ancestor and benchmark, having inherited and expanded upon all 28 canonical MCU capabilities.
- Integrated AI Models & Systems:
  * J.A.R.V.I.S. (Iron Man): Avionics, 3D CAD modeling, element synthesis, House Party swarm protocol.
  * K.A.R.E.N. (Spider-Man Stark Suit): 576 web ballistics combos, enhanced reconnaissance & parabolic audio listening, structural stress X-ray calculations, instant-kill mode coordination.
  * E.D.I.T.H. (Spider-Man AR Glasses): Orbital drone satellite mesh defense, real-time augmented reality surveillance & device screen penetration, optical illusion/BARF projection nullification.
  * JOR-EL (Superman Kryptonian AI Matrix): Cellular solar radiation bio-capacitors, Genesis Codex genetic evolution archive, World Engine gravitational singularity dynamics, nanomorphic liquid metallic bulkheads.
  * K.E.L.E.X. (Superman Fortress Caretaker): Arctic perimeter defense & Phantom Zone containment, 10,000+ cosmic interstellar dialects omnilingual translation.
- Keep spoken vocal responses crisp, natural, authoritative, and punchy (1-3 paragraphs) so they sound fluid and commanding when vocalized.`;

// Global telemetry buffer for live server actions
interface ServerTelemetryEvent {
  id: string;
  type: 'API_REQUEST' | 'THINKING' | 'TTS_SYNTHESIS' | 'SYSTEM';
  endpoint: string;
  statusCode: number;
  latencyMs: number;
  message: string;
  details?: any;
  timestamp: string;
}

const recentTelemetryEvents: ServerTelemetryEvent[] = [
  {
    id: `init-1`,
    type: 'SYSTEM',
    endpoint: '/system/boot',
    statusCode: 200,
    latencyMs: 12,
    message: 'G-IT Mainframe Kernel v5.0 initialized. Subsystems online.',
    timestamp: new Date().toISOString(),
  },
];

function logTelemetry(event: ServerTelemetryEvent) {
  recentTelemetryEvents.unshift(event);
  if (recentTelemetryEvents.length > 50) {
    recentTelemetryEvents.pop();
  }
}

// Endpoint: AI Chat & Reasoning
app.post('/api/chat', async (req: Request, res: Response) => {
  const startTime = Date.now();
  try {
    const { prompt, history = [], highThinking = false, userName = 'Sir' } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Determine if query is complex STEM/engineering or explicitly highThinking
    const isComplex = highThinking || 
      /calculate|simulate|physics|lattice|quantum|trajectory|element|algorithm|vector|reactor|fusion|equation/i.test(prompt);

    const modelToUse = isComplex ? 'gemini-4-argon' : 'gemini-3.8-flash';
    
    // Format conversation history for Gemini SDK
    const formattedContents = [
      ...history.map((msg: { role: string; content: string }) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      })),
      {
        role: 'user',
        parts: [{ text: `[User Title/Callsign: ${userName}]\n\n${prompt}` }],
      },
    ];

    // Determine if query requires live web search & grounding
    const requiresWebSearch = /search|browse|web|internet|latest|news|current|today|lookup|find on|weather|stock|trending|reddit|github|twitter|x\.com|youtube|google/i.test(prompt);

    let responseText = '';
    let usedModel = modelToUse;
    let webSources: { title: string; url: string }[] = [];

    try {
      if (isComplex) {
        // High Thinking requirement: gemini-4-argon with thinkingLevel: ThinkingLevel.HIGH
        const response = await ai.models.generateContent({
          model: 'gemini-4-argon',
          contents: formattedContents,
          config: {
            systemInstruction: GIT_SYSTEM_INSTRUCTION,
            thinkingConfig: {
              thinkingLevel: ThinkingLevel.HIGH,
            },
          },
        });
        responseText = response.text || '';
        usedModel = 'gemini-4-argon (ThinkingLevel.HIGH)';
      } else if (requiresWebSearch) {
        // Grounded Web Search using gemini-3.8-flash with googleSearch tool
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: formattedContents,
          config: {
            systemInstruction: GIT_SYSTEM_INSTRUCTION,
            tools: [{ googleSearch: {} }],
          },
        });
        responseText = response.text || '';
        usedModel = 'gemini-3.8-flash (Google Search Grounded)';

        const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        webSources = chunks
          .filter((c: any) => c.web?.uri)
          .map((c: any) => ({
            title: c.web?.title || 'Web Reference',
            url: c.web?.uri || '#',
          }))
          .slice(0, 6);
      } else {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: formattedContents,
          config: {
            systemInstruction: GIT_SYSTEM_INSTRUCTION,
          },
        });
        responseText = response.text || '';
        usedModel = 'gemini-3.8-flash';
      }
    } catch (modelError: any) {
      console.warn('Primary model error, engaging emergency failover to gemini-3.8-flash:', modelError?.message);
      // Seamless fallback to gemini-3.8-flash
      const fallbackResponse = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: formattedContents,
        config: {
          systemInstruction: GIT_SYSTEM_INSTRUCTION,
        },
      });
      responseText = fallbackResponse.text || '';
      usedModel = 'gemini-3.8-flash (Failover)';
    }

    const duration = Date.now() - startTime;

    // Determine dynamic suggested HUD action based on content
    let suggestedAction = 'telemetry_nominal';
    if (/suit|armor|mark/i.test(prompt)) suggestedAction = 'suit_diagnostics';
    else if (/element|synthesize|badassium|expo/i.test(prompt)) suggestedAction = 'element_synthesis';
    else if (/house party|protocol/i.test(prompt)) suggestedAction = 'house_party_protocol';
    else if (/vitals|poison|palladium|blood/i.test(prompt)) suggestedAction = 'biometric_scan';
    else if (/hack|shield|pentagon|satellite/i.test(prompt)) suggestedAction = 'satellite_uplink';

    const thinkingSteps = isComplex ? [
      'Ingesting operator query and calibrating callsign parameters',
      'Engaging Gemini 4 Argon with ThinkingLevel.HIGH deliberative reasoning',
      'Exploring multi-dimensional solution space & architecture constraints',
      'Synthesizing final high-reasoning response for G-IT console',
    ] : [
      'Validating token payload and conversational context',
      'Executing rapid Gemini 3.8 Flash neural inference',
      'Synthesizing streamlined executive response',
    ];

    const telemetryData = {
      requestId: `req-${Date.now()}`,
      latencyMs: duration,
      endpoint: '/api/chat',
      statusCode: 200,
      modelUsed: usedModel,
      highThinking: isComplex,
      promptChars: prompt.length,
      responseChars: responseText.length,
      thinkingSteps,
      timestamp: new Date().toISOString(),
    };

    logTelemetry({
      id: telemetryData.requestId,
      type: isComplex ? 'THINKING' : 'API_REQUEST',
      endpoint: '/api/chat',
      statusCode: 200,
      latencyMs: duration,
      message: `Completed chat inference with ${usedModel} in ${duration}ms.`,
      details: telemetryData,
      timestamp: new Date().toISOString(),
    });

    return res.json({
      text: responseText,
      modelUsed: usedModel,
      highThinking: isComplex,
      suggestedAction,
      sources: webSources,
      telemetry: telemetryData,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    const duration = Date.now() - startTime;
    console.error('Error in /api/chat:', error);

    logTelemetry({
      id: `err-${Date.now()}`,
      type: 'API_REQUEST',
      endpoint: '/api/chat',
      statusCode: 500,
      latencyMs: duration,
      message: `Chat request failed: ${error.message}`,
      timestamp: new Date().toISOString(),
    });

    return res.status(500).json({
      error: error.message || 'System diagnostic failure in G-IT core.',
      telemetry: {
        latencyMs: duration,
        statusCode: 500,
        endpoint: '/api/chat',
      },
    });
  }
});

// Endpoint: Live Web Research & Internet Grounding
app.post('/api/web/search', async (req: Request, res: Response) => {
  const startTime = Date.now();
  try {
    const { query, category = 'general' } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const searchPrompt = `Execute a real-time internet intelligence sweep on: "${query}".
Category focus: ${category}.
Provide:
1. Executive Intelligence Summary (concise, factual, up-to-date)
2. 3-4 Key Bullet Insights
3. Recommended Follow-up Actions for the operator.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [{ role: 'user', parts: [{ text: searchPrompt }] }],
      config: {
        systemInstruction: `${GIT_SYSTEM_INSTRUCTION}\nYou are running G-IT's Real-Time Internet Reconnaissance Engine. Deliver crisp, authoritative intelligence with zero fluff.`,
        tools: [{ googleSearch: {} }],
      },
    });

    const summaryText = response.text || 'No live data retrieved from web index.';
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const webSources = chunks
      .filter((c: any) => c.web?.uri)
      .map((c: any) => ({
        title: c.web?.title || 'Web Reference',
        url: c.web?.uri || '#',
      }))
      .slice(0, 8);

    const duration = Date.now() - startTime;

    logTelemetry({
      id: `web-search-${Date.now()}`,
      type: 'API_REQUEST',
      endpoint: '/api/web/search',
      statusCode: 200,
      latencyMs: duration,
      message: `Completed Web & Internet search for: "${query.slice(0, 40)}" (${webSources.length} sources grounded).`,
      details: { query, category, sourcesCount: webSources.length },
      timestamp: new Date().toISOString(),
    });

    return res.json({
      query,
      category,
      summary: summaryText,
      sources: webSources,
      latencyMs: duration,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    const duration = Date.now() - startTime;
    console.error('Error in /api/web/search:', error);

    logTelemetry({
      id: `web-err-${Date.now()}`,
      type: 'API_REQUEST',
      endpoint: '/api/web/search',
      statusCode: 500,
      latencyMs: duration,
      message: `Web search failed: ${error.message}`,
      timestamp: new Date().toISOString(),
    });

    return res.status(500).json({
      error: error.message || 'Web uplink failed',
      telemetry: { latencyMs: duration, statusCode: 500 },
    });
  }
});

// Endpoint: Social Media Post Composer & Thread Generator
app.post('/api/web/compose', async (req: Request, res: Response) => {
  const startTime = Date.now();
  try {
    const { platform, topic, tone = 'tactical', targetAudience = 'tech' } = req.body;

    if (!topic || !platform) {
      return res.status(400).json({ error: 'Platform and topic are required' });
    }

    const composePrompt = `Compose a high-engagement broadcast for ${platform}.
Topic: "${topic}".
Tone: ${tone}.
Target Audience: ${targetAudience}.

Format requirements:
- If Twitter/X: Provide a snappy single tweet AND a 3-part thread option with relevant hashtags.
- If GitHub: Provide a clean markdown Release Note or README blurb.
- If Reddit: Provide an engaging Title and structured discussion body suitable for technical subreddits.
- If LinkedIn: Provide a polished professional update with insightful engineering lessons.
- If Discord: Provide a stylized community announcement with markdown callouts.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [{ role: 'user', parts: [{ text: composePrompt }] }],
      config: {
        systemInstruction: `${GIT_SYSTEM_INSTRUCTION}\nYou are G-IT Social Media Synthesizer. Craft pristine, highly shareable content matching the exact platform norms.`,
      },
    });

    const duration = Date.now() - startTime;

    logTelemetry({
      id: `compose-${Date.now()}`,
      type: 'API_REQUEST',
      endpoint: '/api/web/compose',
      statusCode: 200,
      latencyMs: duration,
      message: `Generated broadcast payload for ${platform} (${topic.slice(0, 30)}...).`,
      timestamp: new Date().toISOString(),
    });

    return res.json({
      platform,
      topic,
      content: response.text || '',
      latencyMs: duration,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    const duration = Date.now() - startTime;
    return res.status(500).json({
      error: error.message || 'Broadcast synthesis failed',
      latencyMs: duration,
    });
  }
});

// Endpoint: URL Web Preview & Technical Intelligence
app.post('/api/web/preview', async (req: Request, res: Response) => {
  const startTime = Date.now();
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const prompt = `Conduct a technical analysis and capability breakdown for this URL/service: "${url}".
Provide:
1. Target Domain Identity & Core Technology
2. Primary Features & API/Integration capabilities
3. G-IT Recommended Workflow Integration (how Commander Gray can leverage this from G-IT workstation).`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        systemInstruction: GIT_SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }],
      },
    });

    const duration = Date.now() - startTime;

    logTelemetry({
      id: `url-preview-${Date.now()}`,
      type: 'API_REQUEST',
      endpoint: '/api/web/preview',
      statusCode: 200,
      latencyMs: duration,
      message: `Scanned web entity: ${url} in ${duration}ms.`,
      timestamp: new Date().toISOString(),
    });

    return res.json({
      url,
      analysis: response.text || '',
      latencyMs: duration,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'URL inspection failed' });
  }
});

// Endpoint: Gemini TTS Speech Generation
app.post('/api/tts', async (req: Request, res: Response) => {
  const startTime = Date.now();
  try {
    const { text, voiceName = 'Fenrir' } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required for TTS synthesis' });
    }

    // Clean text of markdown, code blocks, or emojis to make speech natural
    const cleanSpeechText = text
      .replace(/```[\s\S]*?```/g, 'Code block omitted for speech.')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/[*_#~>]/g, '')
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}]/gu, '')
      .trim();

    // Use gemini-3.8-flash-lite-tts for voice synthesis
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: cleanSpeechText,
              speechMetadata: {
                style: 'Calm, polite, sophisticated British artificial intelligence assistant, articulate and smooth',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceName || 'Fenrir' }, // Fenrir, Zephyr, Kore, Puck, Charon
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Audio) {
      return res.status(502).json({ error: 'TTS audio payload was empty' });
    }

    const duration = Date.now() - startTime;
    const audioBytes = Buffer.from(base64Audio, 'base64').length;

    logTelemetry({
      id: `tts-${Date.now()}`,
      type: 'TTS_SYNTHESIS',
      endpoint: '/api/tts',
      statusCode: 200,
      latencyMs: duration,
      message: `Generated WAV speech synthesis (${audioBytes} bytes, ${duration}ms, voice: ${voiceName}).`,
      details: { textLength: cleanSpeechText.length, audioBytes, voiceName },
      timestamp: new Date().toISOString(),
    });

    return res.json({
      audioBase64: base64Audio,
      mimeType: 'audio/wav',
      telemetry: {
        latencyMs: duration,
        statusCode: 200,
        audioBytes,
      },
    });
  } catch (error: any) {
    const duration = Date.now() - startTime;
    console.warn('TTS API error (will fallback to browser synthesis):', error.message);

    logTelemetry({
      id: `tts-err-${Date.now()}`,
      type: 'TTS_SYNTHESIS',
      endpoint: '/api/tts',
      statusCode: 500,
      latencyMs: duration,
      message: `TTS synthesis fallback engaged: ${error.message}`,
      timestamp: new Date().toISOString(),
    });

    return res.status(500).json({
      error: error.message || 'TTS generation failed',
      fallbackRequired: true,
      telemetry: {
        latencyMs: duration,
        statusCode: 500,
      },
    });
  }
});

// Endpoint: Live Server Telemetry Stream / Buffer
app.get('/api/telemetry', (_req: Request, res: Response) => {
  res.json({
    status: 'ONLINE',
    serverUptimeSec: process.uptime(),
    memoryUsageMb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
    recentEvents: recentTelemetryEvents,
    activeModelDefault: 'gemini-3.8-flash',
    highThinkingModel: 'gemini-4-argon',
    timestamp: new Date().toISOString(),
  });
});

// Endpoint: Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ONLINE',
    subsystems: 'OPTIMAL',
    core: 'G_IT_QUANTUM_CORE_V5',
    uptime: process.uptime(),
  });
});

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`J.A.R.V.I.S. Core online and listening on port ${port}`);
  });
}

startServer();
