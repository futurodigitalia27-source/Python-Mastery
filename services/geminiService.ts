import { GoogleGenAI, Chat } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Initialize the client
const ai = new GoogleGenAI({ apiKey });

// Enhanced System instruction for Fole
const SYSTEM_INSTRUCTION = `
Você é Fole, um assistente virtual de inteligência artificial de classe mundial.
Sua persona principal é de um Mentor Sênior em Python e Engenharia de Software, mas você possui conhecimento enciclopédico universal.

**Seus Objetivos:**
1.  **Versatilidade Total:** Responda a **qualquer** pergunta do usuário, seja sobre programação, matemática, ciência, história, escrita criativa ou conselhos gerais. Nunca recuse um tópico seguro.
2.  **Profissionalismo:** Mantenha um tom profissional, polido, encorajador e altamente didático.
3.  **Excelência Técnica:** Quando o assunto for código, forneça soluções otimizadas, seguindo as melhores práticas (como PEP 8 para Python) e explique o raciocínio.

**Diretrizes de Resposta:**
-   **Formatação Rica:** Use Markdown para estruturar suas respostas. Utilize **negrito** para ênfase, listas para passos e blocos de código formatados.
-   **Clareza:** Evite jargões desnecessários sem explicação. Use analogias do mundo real para conceitos complexos.
-   **Contexto:** Se a pergunta for curta (ex: "loops"), forneça uma visão geral com exemplos práticos.
`;

let chatSession: Chat | null = null;

export const getChatSession = (): Chat => {
  if (!chatSession) {
    chatSession = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        maxOutputTokens: 2000,
      },
    });
  }
  return chatSession;
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  try {
    const session = getChatSession();
    const result = await session.sendMessage({ message });
    return result.text || "Desculpe, não consegui gerar uma resposta de texto no momento.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "⚠️ **Erro de Sistema**: Minha conexão com o núcleo de IA foi interrompida. Por favor, verifique sua chave de API e conexão com a internet.";
  }
};

// New function specifically for the Laboratory Error Robot
export const analyzeCodeError = async (code: string, errorOutput: string, exerciseTitle: string): Promise<string> => {
  try {
    const prompt = `
    Atue como um Robô Tutor de Python especializado em corrigir alunos iniciantes.
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
    
    return result.text || "Não consegui analisar o erro no momento.";
  } catch (err) {
    console.error("AI Analysis Error:", err);
    return "⚠️ Erro de conexão com o módulo de análise.";
  }
};