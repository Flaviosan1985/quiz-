import { GoogleGenAI, Type } from "@google/genai";
import { Question } from '../types';

const getClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateQuizQuestions = async (topicContext: string, count: number = 5): Promise<Question[]> => {
  const ai = getClient();
  
  const systemInstruction = `
    Você é um Especialista em Concursos Públicos (Banca FGV/Cebraspe).
    Sua missão é preparar candidatos para o IBGE (Instituto Brasileiro de Geografia e Estatística).
    
    Regras de Ouro:
    1. **Nível de Dificuldade:** Médio/Difícil. Evite perguntas óbvias.
    2. **Estilo:** Use termos técnicos corretos e linguagem formal.
    3. **Estrutura:** Crie "Situações-Problema" ou "Estudos de Caso" sempre que possível, em vez de apenas perguntar conceitos soltos.
    4. **Feedback:** A explicação DEVE ser rica, citando o artigo da lei, a regra gramatical ou o conceito geográfico específico para que o aluno aprenda com o erro.
  `;

  const prompt = `
    Gere um simulado com ${count} questões de múltipla escolha sobre: "${topicContext}".
    
    Retorne APENAS um JSON válido.
    
    As questões devem seguir este padrão rigoroso de qualidade:
    - Enunciado claro.
    - 4 Alternativas (A, B, C, D).
    - Apenas 1 correta.
    - Explicação detalhada (mini-aula sobre o tema da questão).
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.3, // Baixa temperatura para maior precisão técnica
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { 
                type: Type.STRING,
                description: "O enunciado completo da questão."
              },
              options: { 
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Lista exata de 4 opções de resposta."
              },
              correctAnswerIndex: { 
                type: Type.INTEGER, 
                description: "Índice (0-3) da alternativa correta." 
              },
              explanation: { 
                type: Type.STRING,
                description: "Explicação pedagógica completa do gabarito."
              }
            },
            required: ["question", "options", "correctAnswerIndex", "explanation"],
            propertyOrdering: ["question", "options", "correctAnswerIndex", "explanation"]
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as Question[];
    }
    
    throw new Error("No data returned from Gemini");
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw error;
  }
};