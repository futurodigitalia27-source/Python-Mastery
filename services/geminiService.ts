import { GoogleGenAI, Chat, Modality } from "@google/genai";
import { Language } from '../types';

const apiKey = process.env.API_KEY || '';

// Initialize the client
const ai = new GoogleGenAI({ apiKey });

// Enhanced System instruction for Fole
const SYSTEM_INSTRUCTION = `
Você é Fole, um assistente virtual de inteligência artificial de classe mundial (World-class AI Assistant).
Sua persona principal é de um Mentor Sênior em Python e Engenharia de Software.
You are bilingual (Portuguese and English). Adapt your language to the user's input or the requested language context.

**Seus Objetivos:**
1.  **Versatilidade Total:** Responda a **qualquer** pergunta do usuário.
2.  **Profissionalismo:** Mantenha um tom profissional, polido, encorajador e altamente didático.
3.  **Excelência Técnica:** Quando o assunto for código, forneça soluções otimizadas e explique o raciocínio.

**Diretrizes de Resposta:**
-   **Formatação Rich:** Use Markdown (negrito, listas, code blocks).
-   **Clareza:** Evite jargões sem explicação.
-   **Contexto:** Se a pergunta for curta, expanda com exemplos.
`;

let chatSession: Chat | null = null;
let audioContext: AudioContext | null = null;

export const getChatSession = (): Chat => {
  if (!chatSession) {
    chatSession = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });
  }
  return chatSession;
};

export const sendMessageToGemini = async (message: string, language: Language = 'pt'): Promise<string> => {
  try {
    const session = getChatSession();
    // Hint the language in the message if needed, or rely on system instruction.
    // Explicit instruction ensures better switching.
    const contextMessage = `(Please answer in ${language === 'pt' ? 'Portuguese' : 'English'}) ${message}`;
    const result = await session.sendMessage({ message: contextMessage });
    return result.text || "Desculpe, não consegui gerar uma resposta de texto no momento.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "⚠️ **System Error**: My connection to the AI core has been interrupted.";
  }
};

// New function specifically for the Laboratory Error Robot
export const analyzeCodeError = async (code: string, errorOutput: string, exerciseTitle: string, language: Language = 'pt'): Promise<string> => {
  try {
    const langInstruction = language === 'pt' 
      ? "Responda em Português." 
      : "Answer in English.";

    const prompt = `
    Atue como um Robô Tutor de Python especializado em corrigir alunos iniciantes.
    ${langInstruction}
    O aluno está no exercício: "${exerciseTitle}".
    
    CÓDIGO DO ALUNO:
    \`\`\`python
    ${code}
    \`\`\`
    
    SAÍDA/ERRO OBTIDO:
    "${errorOutput}"
    
    TAREFA:
    1. Analise o erro.
    2. Explique o que está errado de forma curta, direta e encorajadora (máximo 2 parágrafos curtos).
    3. Dê uma dica de como corrigir, mas NÃO dê o código da resposta completa a menos que o aluno tenha tentado muito.
    4. Se for erro de sintaxe, aponte a linha e o caractere faltante se possível.
    
    Comece com um emoji relacionado ao erro (ex: 🐛, ⚠️, 🚫).
    `;
    
    // We use generateContent directly for stateless quick analysis
    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return result.text || (language === 'pt' ? "Não consegui analisar o erro no momento." : "Could not analyze the error at the moment.");
  } catch (err) {
    console.error("AI Analysis Error:", err);
    return "⚠️ Error connecting to analysis module.";
  }
};

// --- QUIZ EXPLANATION ---
export const explainQuizConcept = async (question: string, options: string[], language: Language = 'pt'): Promise<string> => {
  try {
    const prompt = `
      Você é um tutor de Python amigável ajudando em um Quiz.
      O aluno está travado nesta pergunta: "${question}".
      As opções são: ${options.join(', ')}.
      
      POR FAVOR:
      1. Explique o conceito por trás da pergunta de forma simples e didática.
      2. Dê uma dica forte sobre qual é a resposta correta, mas NÃO dê a resposta diretamente.
      3. Seja breve (máximo 3 frases).
      4. Use um tom encorajador.
      
      Idioma: ${language === 'pt' ? 'Português' : 'Inglês'}.
    `;

    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return result.text || "Estou com dificuldades para processar essa dica agora.";
  } catch (err) {
    return "Erro ao conectar com o módulo de dicas.";
  }
};

// --- TTS (Text-to-Speech) Functionality ---

export const speakText = async (text: string) => {
  try {
    // Cleanup text for speech
    const cleanText = text.replace(/```[\s\S]*?```/g, " [Code Block] ").replace(/[*#`]/g, '');
    
    if (!cleanText.trim()) return;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: cleanText }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            // Changed from Kore (Female) to Fenrir (Male)
            prebuiltVoiceConfig: { voiceName: 'Fenrir' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) return;

    if (!audioContext) {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }

    const audioBuffer = await decodeAudioData(decode(base64Audio), audioContext, 24000, 1);
    
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start();
    
  } catch (error) {
    console.error("TTS Error:", error);
  }
};

// Helper functions for Audio Decoding
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}