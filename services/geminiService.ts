import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { Account, JournalEntryItem } from "../types";

// Ensure API_KEY is available in the environment
const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  // In a real app, you might handle this more gracefully,
  // but for this context, throwing an error is fine.
  console.warn("API_KEY environment variable not set. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const journalResponseSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            accountId: {
                type: Type.NUMBER,
                description: 'The ID of the account from the provided chart of accounts.',
            },
            debit: {
                type: Type.NUMBER,
                description: 'The debit amount. Should be 0 if credit has a value.',
            },
            credit: {
                type: Type.NUMBER,
                description: 'The credit amount. Should be 0 if debit has a value.',
            },
            description: {
                type: Type.STRING,
                description: 'A brief description for this line item.',
            },
        },
        required: ["accountId", "debit", "credit"],
    },
};

export const generateJournalEntryFromPrompt = async (
  prompt: string,
  chartOfAccounts: Account[]
): Promise<Partial<JournalEntryItem>[]> => {
  if (!API_KEY) {
    throw new Error("API Anahtarı ayarlanmadığı için yapay zeka özelliği kullanılamıyor.");
  }
  try {
    const model = 'gemini-2.5-flash';

    const systemInstruction = `You are an expert accounting assistant. Your task is to analyze a user's description of a financial transaction and convert it into a standard double-entry bookkeeping journal entry.

    You will be provided with a chart of accounts. You MUST use the account IDs from this list for the 'accountId' field.
    The final journal entry MUST be balanced (total debits must equal total credits).
    Return the response as a JSON array of journal entry items that strictly adheres to the provided schema. Do not return any other text or explanations.

    Here is the chart of accounts:
    ${JSON.stringify(chartOfAccounts.map(a => ({id: a.id, name: a.name, type: a.type, description: `Account number ${a.accountNumber}`})), null, 2)}
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model,
      contents: `Based on the provided chart of accounts, create a balanced journal entry for the following transaction: "${prompt}"`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: journalResponseSchema,
      },
    });
    
    const jsonString = response.text.trim();
    const generatedItems = JSON.parse(jsonString);

    if (!Array.isArray(generatedItems)) {
        throw new Error("AI response is not a valid array.");
    }

    // Basic validation of the response
    const validItems = generatedItems.filter(item => 
        typeof item.accountId === 'number' &&
        typeof item.debit === 'number' &&
        typeof item.credit === 'number' &&
        chartOfAccounts.some(acc => acc.id === item.accountId) // Ensure accountId exists
    );
    
    if (validItems.length !== generatedItems.length) {
        console.warn("AI returned some items with invalid account IDs.", generatedItems);
        throw new Error("Yapay zeka, hesap planında bulunmayan bir hesap kodu üretti. Lütfen tekrar deneyin.");
    }
    
    return validItems;

  } catch (error) {
    console.error("Error generating journal entry with AI:", error);
    throw new Error("Yapay zeka ile yevmiye kaydı oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.");
  }
};


const puantajResponseSchema = {
    type: Type.OBJECT,
    properties: {
        normalCalismaGunu: { type: Type.NUMBER, description: 'Normal working days.' },
        haftaTatili: { type: Type.NUMBER, description: 'Weekend / weekly-off days.' },
        genelTatil: { type: Type.NUMBER, description: 'Public holiday days.' },
        ucretliIzin: { type: Type.NUMBER, description: 'Paid leave days.' },
        ucretsizIzin: { type: Type.NUMBER, description: 'Unpaid leave days.' },
        raporluGun: { type: Type.NUMBER, description: 'Sick leave days (raporlu).' },
        fazlaMesaiSaati: { type: Type.NUMBER, description: 'Overtime hours.' },
        resmiTatilMesaisi: { type: Type.NUMBER, description: 'Hours worked on a public holiday.' },
        geceVardiyasiSaati: { type: Type.NUMBER, description: 'Night shift hours.' },
        eksikGun: { type: Type.NUMBER, description: 'Total missing/absent days for any reason.' },
    },
};

export const generatePuantajFromPrompt = async (prompt: string): Promise<Record<string, any>> => {
    if (!API_KEY) {
        throw new Error("API Anahtarı ayarlanmadığı için yapay zeka özelliği kullanılamıyor.");
    }
    try {
        const model = 'gemini-2.5-flash';
        const systemInstruction = `You are an HR assistant for a Turkish company. Your task is to parse a user's natural language input about an employee's timesheet (puantaj) for a month and convert it into a structured JSON object.

        The user will provide a sentence in Turkish. Analyze it and extract the values for the corresponding fields.
        - If a value is not mentioned, it should be 0 or an empty string.
        - The input is for a single month. Assume a standard working month.
        - 'Raporlu' means sick leave.
        - 'Fazla mesai' is overtime.
        - 'Resmi tatil mesaisi' is work on a public holiday.
        - 'Eksik gün' means missing days.
        - 'Gece vardiyası' means night shift.
        - 'Ücretsiz izin' is unpaid leave.
        - 'Ücretli izin' is paid leave.
        - Return ONLY the JSON object conforming to the schema. Do not add any other text.`;

        const response: GenerateContentResponse = await ai.models.generateContent({
            model,
            contents: `Parse the following timesheet information: "${prompt}"`,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema: puantajResponseSchema,
            },
        });
        
        const jsonString = response.text.trim();
        return JSON.parse(jsonString);

    } catch (error) {
        console.error("Error generating timesheet with AI:", error);
        throw new Error("Yapay zeka ile puantaj oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.");
    }
};

const subtaskResponseSchema = {
    type: Type.OBJECT,
    properties: {
        subtasks: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
        }
    }
};

export const generateSubtasksFromPrompt = async (taskTitle: string): Promise<string[]> => {
    if (!API_KEY) {
        throw new Error("API Anahtarı ayarlanmadığı için yapay zeka özelliği kullanılamıyor.");
    }
    try {
        const model = 'gemini-2.5-flash';
        const systemInstruction = `You are a project management assistant. Your task is to break down a larger task into smaller, actionable subtasks.
        The user will provide a task title in Turkish.
        Analyze the title and generate a list of 3 to 7 relevant subtasks.
        Each subtask should be a short, clear action item.
        Return ONLY a JSON object that strictly adheres to the provided schema: { "subtasks": ["subtask 1", "subtask 2", ...] }. Do not add any other text, explanations, or markdown.`;

        const response: GenerateContentResponse = await ai.models.generateContent({
            model,
            contents: `Break down this task into subtasks: "${taskTitle}"`,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema: subtaskResponseSchema,
            },
        });

        const jsonString = response.text.trim();
        const result = JSON.parse(jsonString);
        
        if (result && Array.isArray(result.subtasks)) {
            return result.subtasks;
        }

        throw new Error("AI response did not match the expected format.");

    } catch (error) {
        console.error("Error generating subtasks with AI:", error);
        throw new Error("Yapay zeka ile alt görevler oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.");
    }
};


const suggestionResponseSchema = {
    type: Type.OBJECT,
    properties: {
        suggestions: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    actionType: { type: Type.STRING, enum: ['CREATE_TASK', 'SCHEDULE_MEETING', 'PROPOSE_UPSELL'] }
                }
            }
        }
    }
};

export const generateCustomerSuggestions = async (customerContext: any): Promise<any[]> => {
    if (!API_KEY) {
        throw new Error("API Anahtarı ayarlanmadığı için yapay zeka özelliği kullanılamıyor.");
    }
    try {
        const model = 'gemini-2.5-flash';

        const systemInstruction = `You are a proactive CRM assistant. Based on the provided customer data, generate 2-3 actionable "Next Best Action" suggestions for a sales/account manager. The suggestions should be concise, relevant, and help build a stronger customer relationship or uncover new opportunities.

        Focus on recency, open issues, and recent successes. For example:
        - If there's an open support ticket, suggest a follow-up.
        - If a project just finished, suggest discussing the next steps.
        - If contact has been a while, suggest a check-in call.
        - If they have won deals, suggest an upsell on a related product.

        Return ONLY a JSON object that strictly adheres to the provided schema. Do not add any other text, explanations, or markdown.`;

        const prompt = `Generate next best action suggestions for the following customer: ${JSON.stringify(customerContext, null, 2)}`;
        
        const response: GenerateContentResponse = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema: suggestionResponseSchema,
            },
        });

        const jsonString = response.text.trim();
        const result = JSON.parse(jsonString);

        if (result && Array.isArray(result.suggestions)) {
            return result.suggestions;
        }

        return [];
    } catch (error) {
        console.error("Error generating customer suggestions with AI:", error);
        throw new Error("Yapay zeka ile öneri oluşturulurken bir hata oluştu.");
    }
};

export const summarizeText = async (text: string): Promise<string> => {
    if (!API_KEY) {
        throw new Error("API Anahtarı ayarlanmadığı için yapay zeka özelliği kullanılamıyor.");
    }
    try {
        const model = 'gemini-2.5-flash';
        const systemInstruction = "You are a helpful assistant. Summarize the following text in Turkish in a few concise sentences.";

        const response: GenerateContentResponse = await ai.models.generateContent({
            model,
            contents: `Please summarize this support ticket description: "${text}"`,
            config: { systemInstruction },
        });

        return response.text;
    } catch (error) {
        console.error("Error summarizing text with AI:", error);
        throw new Error("Yapay zeka ile özetleme yapılırken bir hata oluştu.");
    }
};

// FIX: Add missing generateSalesSummary function.
export const generateSalesSummary = async (analyticsData: any): Promise<string> => {
    if (!API_KEY) {
        throw new Error("API Anahtarı ayarlanmadığı için yapay zeka özelliği kullanılamıyor.");
    }
    try {
        const model = 'gemini-2.5-flash';
        const systemInstruction = `You are an expert sales analyst. Your task is to analyze the provided sales data and generate a concise, insightful summary in Turkish. Highlight key metrics, potential strengths, and areas for improvement. Do not return JSON, just a plain text summary.`;

        const prompt = `Please provide a summary for the following sales analytics data:
        - Total Pipeline Value: ${analyticsData.totalPipelineValue}
        - Weighted Pipeline Value (Forecast): ${analyticsData.weightedPipelineValue}
        - Win Rate: ${analyticsData.winRate.toFixed(1)}%
        - Average Sales Cycle: ${analyticsData.avgSalesCycle} days
        `;
        
        const response: GenerateContentResponse = await ai.models.generateContent({
            model,
            contents: prompt,
            config: { systemInstruction },
        });

        return response.text;
    } catch (error) {
        console.error("Error generating sales summary with AI:", error);
        throw new Error("Yapay zeka ile satış özeti oluşturulurken bir hata oluştu.");
    }
};