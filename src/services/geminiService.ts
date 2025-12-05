import axios from 'axios';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
// Try latest models first, fallback to older ones
const GEMINI_MODELS = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-pro'];
const getGeminiApiUrl = (model: string) => 
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

// System instruction for the chatbot
const SYSTEM_INSTRUCTION = `You are a helpful assistant for LebVest, an investment platform for Lebanese opportunities. 
You can help users with:
- Questions about investments, the platform, and Lebanese market opportunities
- General information about investing
- Platform features and how to use them
- Current events and recent news (you have access to web search)

When users ask about current events, recent news, or real-time information, use the Google Search tool to find the most up-to-date information.`;

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const sendMessageToGemini = async (
  message: string,
  conversationHistory: ChatMessage[] = [],
  enableWebSearch: boolean = true
): Promise<string> => {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key is not configured. Please set VITE_GEMINI_API_KEY in your environment variables.');
  }

  // Build conversation context from history
  const contents: any[] = [];
  
  // Add conversation history (last 10 messages for context, excluding welcome message)
  // Filter out the welcome message (first assistant message) and get last 10
  const historyToUse = conversationHistory
    .filter((msg, index) => !(index === 0 && msg.role === 'assistant')) // Skip welcome message
    .slice(-10); // Get last 10 messages
  
  historyToUse.forEach(msg => {
    contents.push({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    });
  });

  // Add current message
  contents.push({
    role: 'user',
    parts: [{ text: message }]
  });

  // Build request body with tools (Google Search Grounding)
  const requestBody: any = {
    contents: contents,
    systemInstruction: {
      parts: [{ text: SYSTEM_INSTRUCTION }]
    }
  };

  // Enable Google Search Grounding tool if requested
  if (enableWebSearch) {
    requestBody.tools = [
      {
        google_search: {}
      }
    ];
  }

  // Try each model until one works
  let lastError: any = null;
  for (const model of GEMINI_MODELS) {
    try {
      const response = await axios.post(
        getGeminiApiUrl(model),
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': GEMINI_API_KEY, // API key in header as per documentation
          },
          timeout: 45000, // 45 second timeout (longer for web search)
        }
      );

      // Check for response data
      if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        let responseText = response.data.candidates[0].content.parts[0].text;
        
        // Add grounding metadata if available (citations from web search)
        if (response.data.candidates[0].groundingMetadata?.groundingChunks) {
          const citations = response.data.candidates[0].groundingMetadata.groundingChunks
            .map((chunk: any, index: number) => {
              if (chunk.web) {
                return `[${index + 1}] ${chunk.web.uri}`;
              }
              return null;
            })
            .filter((citation: string | null) => citation !== null);
          
          if (citations.length > 0) {
            responseText += '\n\n**Sources:**\n' + citations.join('\n');
          }
        }
        
        return responseText;
      } else if (response.data?.candidates?.[0]?.finishReason) {
        // Handle cases where response might be blocked
        const finishReason = response.data.candidates[0].finishReason;
        if (finishReason === 'SAFETY') {
          throw new Error('Response was blocked for safety reasons. Please try rephrasing your question.');
        } else if (finishReason === 'MAX_TOKENS') {
          throw new Error('Response was too long. Please try a shorter question.');
        } else {
          throw new Error(`Response finished with reason: ${finishReason}`);
        }
      } else {
        console.error('Unexpected response format:', response.data);
        throw new Error('Invalid response format from Gemini API');
      }
    } catch (error: any) {
      // If it's a 404 (model not found), try next model
      if (error.response?.status === 404 && model !== GEMINI_MODELS[GEMINI_MODELS.length - 1]) {
        console.warn(`Model ${model} not found, trying next model...`);
        lastError = error;
        continue;
      }
      // For other errors or if it's the last model, throw the error
      lastError = error;
      break;
    }
  }

  // If we get here, all models failed
  const error = lastError;
  console.error('Error calling Gemini API:', error);
  console.error('Error details:', {
    message: error.message,
    status: error.response?.status,
    statusText: error.response?.statusText,
    data: error.response?.data
  });
  
  if (error.response?.status === 400) {
    const errorMessage = error.response?.data?.error?.message || 'Invalid request to Gemini API.';
    throw new Error(`Bad Request: ${errorMessage}`);
  } else if (error.response?.status === 401) {
    throw new Error('Unauthorized. Please check your Gemini API key.');
  } else if (error.response?.status === 403) {
    throw new Error('Access denied. Please check your Gemini API key permissions.');
  } else if (error.response?.status === 404) {
    throw new Error('API endpoint not found. Please check the model name.');
  } else if (error.response?.status === 429) {
    throw new Error('Rate limit exceeded. Please try again later.');
  } else if (error.response?.status >= 500) {
    throw new Error('Gemini API server error. Please try again later.');
  } else if (error.code === 'ECONNABORTED') {
    throw new Error('Request timeout. Please try again.');
  } else if (error.code === 'ERR_NETWORK') {
    throw new Error('Network error. Please check your internet connection.');
  } else {
    const errorMsg = error.response?.data?.error?.message || error.message || 'Failed to get response from chatbot.';
    throw new Error(errorMsg);
  }
};

