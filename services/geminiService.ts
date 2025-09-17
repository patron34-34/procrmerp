import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { Account, JournalEntryItem, SalesAnalyticsData, Project, Comment, Task, CalendarEvent, CommunicationLog, ActivityLog } from "../types";

// Ensure API_KEY is available in the environment
const API_KEY = process.env.API_KEY;

// Initialize with a named parameter and add a safety check for an empty API key.
const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. AI features will be disabled.");
}

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
  // Check if ai is initialized
  if (!ai) {
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
    // Check if ai is initialized
  if (!ai) {
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
    // Check if ai is initialized
  if (!ai) {
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
    // Check if ai is initialized
  if (!ai) {
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
    // Check if ai is initialized
  if (!ai) {
    throw new Error("API Anahtarı ayarlanmadığı için yapay zeka özelliği kullanılamıyor.");
    }
    try {
        const model = 'gemini-2.5-flash';
        const response = await ai.models.generateContent({
            model,
            contents: `Summarize the following text concisely in Turkish:\n\n${text}`,
        });
        return response.text;
    } catch (error) {
        console.error("Error summarizing text:", error);
        throw new Error("Metin özetlenirken bir hata oluştu.");
    }
};

export const generateSalesSummary = async (analyticsData: SalesAnalyticsData): Promise<string> => {
    // Check if ai is initialized
  if (!ai) {
    throw new Error("API Anahtarı ayarlanmadığı için yapay zeka özelliği kullanılamıyor.");
    }
    try {
      const model = 'gemini-2.5-flash';
      const prompt = `Aşağıdaki satış analizi verilerini analiz ederek Türkçe, doğal bir dilde kısa bir performans özeti oluştur: ${JSON.stringify(analyticsData)}. Önemli trendlere, potansiyel risklere ve odaklanılması gereken alanlara dikkat çek.`;
  
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
      });
  
      return response.text;
    } catch (error) {
      console.error("Error generating sales summary with AI:", error);
      throw new Error("Yapay zeka ile satış özeti oluşturulurken bir hata oluştu.");
    }
};

export const summarizeProject = async (project: Project, comments: Comment[], tasks: Task[]): Promise<string> => {
    // Check if ai is initialized
  if (!ai) {
    throw new Error("API Anahtarı ayarlanmadığı için yapay zeka özelliği kullanılamıyor.");
    }
    try {
      const model = 'gemini-2.5-flash';
      
      const taskSummary = {
          total: tasks.length,
          completed: tasks.filter(t => t.status === 'Tamamlandı').length,
          inProgress: tasks.filter(t => t.status === 'Devam Ediyor').length,
          todo: tasks.filter(t => t.status === 'Yapılacak').length,
          overdue: tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'Tamamlandı').length
      };

      const recentComments = comments.slice(0, 3).map(c => `${c.userName}: "${c.text}"`).join('\n');
      
      const prompt = `You are a project management expert. Analyze the following project data and provide a concise, actionable summary in Turkish. Highlight progress, potential risks (like overdue tasks or budget overruns), and recent team communication.

      Project Data:
      - Name: ${project.name}
      - Description: ${project.description}
      - Progress: ${project.progress}%
      - Budget: $${project.budget.toLocaleString()}
      - Spent: $${project.spent.toLocaleString()}
      - Deadline: ${project.deadline}

      Task Status:
      - Total Tasks: ${taskSummary.total}
      - Completed: ${taskSummary.completed}
      - In Progress: ${taskSummary.inProgress}
      - To Do: ${taskSummary.todo}
      - Overdue Tasks: ${taskSummary.overdue}

      Recent Comments:
      ${recentComments || "No recent comments."}

      Please provide a clear summary covering:
      1.  **Overall Status:** Is the project on track, at risk, or off track?
      2.  **Key Highlights & Risks:** What are the most important positive or negative points? (e.g., "Budget is well-managed," or "Critical task 'X' is overdue.")
      3.  **Next Steps/Focus Areas:** What should the project manager focus on next?`;

      const response = await ai.models.generateContent({ model, contents: prompt });
      return response.text;
    } catch (error) {
      console.error("Error generating project summary with AI:", error);
      throw new Error("Yapay zeka ile proje özeti oluşturulurken bir hata oluştu.");
    }
};


export const generateProductivitySummary = async (analyticsData: any): Promise<string> => {
    // Check if ai is initialized
  if (!ai) {
    throw new Error("API Anahtarı ayarlanmadığı için yapay zeka özelliği kullanılamıyor.");
    }
    try {
      const model = 'gemini-2.5-flash';
      const prompt = `Aşağıdaki görev verimliliği verilerini analiz ederek Türkçe, doğal bir dilde kısa bir yönetici özeti oluştur: ${JSON.stringify(analyticsData)}.
      
      Özette şu noktalara odaklan:
      1.  **Genel Performans:** Ekip genel olarak ne kadar üretken? Tamamlanan görev sayısı nasıl?
      2.  **Öne Çıkanlar:** En çok görevi tamamlayan kişileri veya departmanları belirt.
      3.  **İyileştirme Alanları:** Hangi görev türleri en çok zaman alıyor veya en çok gecikiyor? İş yükü dağılımında dengesizlikler var mı?
      4.  **Eyleme Yönelik Öneriler:** Analize dayanarak yöneticinin atabileceği 1-2 somut adımı öner. (Örn: "Ahmet'in iş yükünü gözden geçirin" veya "Planlama görevleri için süreci iyileştirin").`;
  
      const response = await ai.models.generateContent({ model, contents: prompt });
      return response.text;
    } catch (error) {
      console.error("Error generating productivity summary with AI:", error);
      throw new Error("Yapay zeka ile verimlilik özeti oluşturulurken bir hata oluştu.");
    }
};

const availableSlotsSchema = {
    type: Type.OBJECT,
    properties: {
        slots: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    start: { type: Type.STRING, description: 'The start time of the available slot in ISO 8601 format (YYYY-MM-DDTHH:MM:SS)' },
                    end: { type: Type.STRING, description: 'The end time of the available slot in ISO 8601 format (YYYY-MM-DDTHH:MM:SS)' },
                },
                required: ["start", "end"],
            }
        }
    }
};


export const findAvailableSlots = async (
    participantsEvents: { name: string; events: { start: string, end: string }[] }[],
    durationMinutes: number
): Promise<{ start: string, end: string }[]> => {
    // Check if ai is initialized
  if (!ai) {
    throw new Error("API Anahtarı ayarlanmadığı için yapay zeka özelliği kullanılamıyor.");
    }
    try {
        const model = 'gemini-2.5-flash';
        const systemInstruction = `You are a scheduling assistant. Your task is to find the top 3 available time slots for a meeting, given the participants' schedules and a required duration.

        - Consider standard business hours (09:00 to 17:00).
        - The meeting must not overlap with any existing events for any participant.
        - All times are in the user's local timezone.
        - Find slots within the next 7 business days, starting from tomorrow.
        - Return ONLY a JSON object that strictly adheres to the provided schema: { "slots": [{ "start": "YYYY-MM-DDTHH:MM:SS", "end": "YYYY-MM-DDTHH:MM:SS" }, ...] }. Do not add any other text, explanations, or markdown.`;

        const prompt = `Find 3 available slots for a meeting of ${durationMinutes} minutes for the following participants. Today is ${new Date().toISOString().split('T')[0]}.

        Schedules:
        ${JSON.stringify(participantsEvents, null, 2)}`;
        
        const response: GenerateContentResponse = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema: availableSlotsSchema,
            },
        });

        const jsonString = response.text.trim();
        const result = JSON.parse(jsonString);
        
        if (result && Array.isArray(result.slots)) {
            return result.slots;
        }

        throw new Error("AI response did not match the expected format.");

    } catch (error) {
        console.error("Error finding available slots with AI:", error);
        throw new Error("Yapay zeka ile uygun zaman bulunurken bir hata oluştu.");
    }
};

export const summarizeActivityFeed = async (context: {
    logs: CommunicationLog[],
    activities: ActivityLog[],
    comments: Comment[],
}): Promise<string> => {
  if (!ai) {
    throw new Error("API Anahtarı ayarlanmadığı için yapay zeka özelliği kullanılamıyor.");
  }
  try {
    const model = 'gemini-2.5-flash';

    const systemInstruction = `You are a helpful CRM assistant. Your task is to analyze a customer's activity feed and provide a concise, insightful summary in Turkish.
    The feed contains communication logs (calls, meetings), system activities (deal created, status changed), and internal comments.
    Focus on key events, recent trends, and the overall sentiment or relationship status.
    Provide the summary as a short, easy-to-read paragraph.`;

    const prompt = `Summarize the following customer activity feed:
    
    Communication Logs:
    ${context.logs.map(log => `- ${log.timestamp} (${log.userName}, ${log.type}): ${log.content}`).join('\n')}

    System Activities:
    ${context.activities.map(act => `- ${act.timestamp} (${act.userName}): ${act.details}`).join('\n')}

    Internal Comments:
    ${context.comments.map(com => `- ${com.timestamp} (${com.userName}): ${com.text}`).join('\n')}
    `;
    
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: { systemInstruction },
    });
    
    return response.text;
  } catch (error) {
    console.error("Error summarizing activity feed:", error);
    throw new Error("Yapay zeka ile aktivite özeti oluşturulurken bir hata oluştu.");
  }
};