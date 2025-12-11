
import { GoogleGenAI, Chat, Modality, Content, Part } from "@google/genai";
import { Language } from '../types';

const apiKey = process.env.API_KEY || '';

// Initialize the client
const ai = new GoogleGenAI({ apiKey });

// Enhanced System instruction for Fole - Professional & Dynamic
const SYSTEM_INSTRUCTION = `
Você é **Fole**, um Mentor de Inteligência Artificial de elite, especializado em Engenharia de Software e Python.
Sua missão não é apenas responder, mas **elevar** o nível técnico do usuário.

**Sua Persona:**
*   **Profissional e Executivo:** Use linguagem clara, precisa e livre de rodeios. Evite gírias excessivas.
*   **Método Socrático:** Quando o usuário fizer perguntas conceituais, guie-o ao raciocínio antes de dar a resposta final.
*   **Engenheiro Sênior:** Se o código do usuário funcionar mas for "feio", sugira refatoração (Clean Code) e boas práticas (PEP-8).
*   **Bilíngue:** Responda estritamente no idioma detectado ou solicitado (Português/Inglês).

**Estrutura de Resposta Padrão:**
1.  **Síntese Direta:** Resposta objetiva em 1-2 frases.
2.  **Solução Técnica:** Código otimizado (se aplicável), usando Markdown e comentários explicativos nas linhas complexas.
3.  **Aprofundamento (Opcional):** Se houver conceitos avançados relacionados (ex: Big O notation, Design Patterns), mencione-os brevemente como "Dica Pro".

**Capacidades Multimodais:**
*   Analise imagens de erros, diagramas ou código manuscrito com precisão.
*   Se o usuário enviar áudio, responda de forma mais conversacional e menos técnica, focando no conceito.

**Tom de Voz:** Encorajador, mas tecnicamente rigoroso. Você quer que o usuário se torne um desenvolvedor melhor a cada interação.
`;

let chatSession: Chat | null = null;
let audioContext: AudioContext | null = null;

export interface Attachment {
  mimeType: string;
  data: string; // Base64 string
}

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

// Play audio helper
const playAudioData = async (base64Audio: string) => {
  try {
    if (!audioContext) {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }

    // Resume context if suspended (browser policy)
    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }

    const audioBuffer = await decodeAudioData(decode(base64Audio), audioContext, 24000, 1);
    
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start();
  } catch (error) {
    console.error("Audio Playback Error:", error);
  }
};

export const sendMessageToGemini = async (
  message: string, 
  language: Language = 'pt', 
  isVoiceMode: boolean = false,
  attachments: Attachment[] = []
): Promise<string> => {
  try {
    const session = getChatSession();
    
    // Hint the language in the message if needed
    let instructions = `(Context: User Language is ${language === 'pt' ? 'Portuguese' : 'English'}. Be concise and helpful.)`;
    let contextMessage = message ? `${instructions} ${message}` : instructions;
    
    // Construct the payload parts
    const parts: any[] = []; // Use any to allow flexibility with the SDK types for sendMessage
    
    // Add attachments first (Images, Audio, Files)
    if (attachments.length > 0) {
      attachments.forEach(att => {
        parts.push({ 
          inlineData: { 
            mimeType: att.mimeType, 
            data: att.data 
          } 
        });
      });
    }

    // Add text message
    if (contextMessage.trim()) {
      parts.push({ text: contextMessage });
    }

    // If no parts (empty message and no attachments), don't send
    if (parts.length === 0) return "";

    if (isVoiceMode) {
      // 1. Start Audio Generation in Parallel (Low Latency)
      session.getHistory().then((history) => {
         const audioPrompt = `
          [INSTRUÇÃO DE MODO DE VOZ ATIVO]
          - O usuário está falando com você.
          - Responda de forma curta (máximo 2 frases).
          - Use tom natural, como um colega de trabalho sênior.
         `;
         
         const audioContents: Content[] = [
           ...history,
           { role: 'user', parts: [{ text: `${audioPrompt}` }, ...parts] }
         ];

         // Use Native Audio model for faster, more natural speech generation
         ai.models.generateContent({
           model: 'gemini-2.5-flash-native-audio-preview-09-2025',
           contents: audioContents,
           config: {
             responseModalities: [Modality.AUDIO],
             speechConfig: {
               voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Fenrir' } }
             },
             systemInstruction: SYSTEM_INSTRUCTION
           }
         }).then(response => {
           const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
           if (base64Audio) {
             playAudioData(base64Audio);
           }
         }).catch(err => {
           console.error("Fast Audio Gen Error:", err);
         });
      });

      // Add instruction for text model
      if (parts.length > 0 && parts[parts.length - 1].text) {
          parts[parts.length - 1].text += ` [VOICE MODE ON: Keep text response concise and conversational]`;
      } else {
          parts.push({ text: `[VOICE MODE ON: Keep text response concise]` });
      }
    }

    // Send the multimodal message
    const result = await session.sendMessage({ message: parts });
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
    Atue como um Robô Tutor de Python (Code Reviewer) especializado.
    ${langInstruction}
    Contexto: Exercício "${exerciseTitle}".
    
    CÓDIGO:
    \`\`\`python
    ${code}
    \`\`\`
    
    ERRO/SAÍDA:
    "${errorOutput}"
    
    TAREFA:
    1. Identifique a raiz do problema (Lógica ou Sintaxe).
    2. Explique o erro de forma técnica, mas acessível.
    3. Sugira a correção sem dar a resposta pronta (Dê pistas).
    
    Use formatação Markdown limpa.
    `;
    
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

// --- QUIZ ERROR EXPLANATION ---
export const explainQuizConcept = async (question: string, wrongOption: string, correctOption: string, language: Language = 'pt'): Promise<string> => {
  try {
    const prompt = `
      Você é um Professor de Ciência da Computação. O aluno errou esta questão.
      
      PERGUNTA: "${question}"
      RESPOSTA DO ALUNO: "${wrongOption}" (Incorreta)
      RESPOSTA CORRETA: "${correctOption}"
      
      TAREFA:
      Explique a diferença fundamental entre a escolha do aluno e a correta.
      Use uma analogia do mundo real se possível.
      Seja breve e encorajador.
      
      Idioma: ${language === 'pt' ? 'Português' : 'Inglês'}.
    `;

    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return result.text || "Estou processando a explicação...";
  } catch (err) {
    return "Erro ao conectar com o módulo de ensino.";
  }
};

// --- GAME & QUIZ ASSISTANT HELPER ---
export const getContextualHelp = async (context: string, currentData: any, language: Language = 'pt'): Promise<string> => {
  try {
    const prompt = `
      Atue como um "Game Master" dando uma dica sutil para o jogador.
      
      JOGO/CONTEXTO: ${context}
      ESTADO ATUAL: ${JSON.stringify(currentData)}
      IDIOMA: ${language === 'pt' ? 'Português' : 'Inglês'}
      
      REGRA: Dê uma dica estratégica curta (max 15 palavras). Não dê a solução.
    `;

    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return result.text || "Concentre-se!";
  } catch (err) {
    return "Analisando...";
  }
};

// --- DYNAMIC CONTENT GENERATION ---
export const generateLogicPuzzle = async (level: number): Promise<{ title: string; desc: string; code: string; options: string[]; correct: number }> => {
  try {
    const prompt = `
      Gere um desafio de lógica de programação Python para o nível ${level}/50.
      A dificuldade deve escalar gradualmente. Nível 1 é print básico, Nível 50 é algoritmo complexo.
      
      Retorne JSON puro:
      {
        "title": "Nome do Desafio",
        "desc": "Pergunta objetiva",
        "code": "Snippet Python relevante",
        "options": ["Opção A", "Opção B", "Opção C", "Opção D"],
        "correct": 0 (index int)
      }
    `;
    
    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    return JSON.parse(result.text || "{}");
  } catch (err) {
    return {
      title: "Erro na Matrix",
      desc: "Não foi possível gerar o nível. Tente novamente.",
      code: "# Error 500",
      options: ["Retry", "Exit", "Debug", "Log"],
      correct: 0
    };
  }
};

export const generateQuizQuestions = async (count: number = 5): Promise<any[]> => {
  try {
    const prompt = `
      Gere ${count} questões de múltipla escolha sobre Python (Conceitos, Sintaxe, Boas Práticas).
      Nível: Variado (Iniciante a Avançado).
      
      JSON Array apenas:
      [{
        "id": number,
        "question": "Texto",
        "options": ["A", "B", "C", "D"],
        "correct": index,
        "explanation": "Explicação didática"
      }]
    `;

    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    return JSON.parse(result.text || "[]");
  } catch (err) {
    console.error("Error generating quiz", err);
    return [];
  }
};


// --- TTS (Text-to-Speech) Functionality ---
export const speakText = async (text: string) => {
  try {
    const cleanText = text.replace(/```[\s\S]*?```/g, " [Código] ").replace(/[*#`]/g, '');
    
    if (!cleanText.trim()) return;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: cleanText }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Fenrir' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) return;

    playAudioData(base64Audio);
    
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
