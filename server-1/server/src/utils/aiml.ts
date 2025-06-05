// src/utils/aiml.ts
import axios from 'axios';
import { config } from 'dotenv';
import path from 'path';

// Load environment variables from the root directory (two levels up from server directory)
config({ path: path.resolve(__dirname, '../../../../.env') });

const API_KEY = process.env.OPENROUTER_API_KEY;
const BASE_URL = 'https://openrouter.ai/api/v1';
const SITE_URL = process.env.YOUR_SITE_URL || '';
const SITE_NAME = process.env.YOUR_SITE_NAME || '';

interface AIMLResponse {
    choices: Array<{
        message: {
            content: string;
        };
    }>;
}

export async function callAimLapi(prompt: string): Promise<string> {
    if (!API_KEY) {
        throw new Error('OpenRouter API key is missing');
    }

    try {
        console.log('Calling OpenRouter API for document structuring...');
        const response = await axios.post<AIMLResponse>(
            `${BASE_URL}/chat/completions`,
            {
                model: 'deepseek/deepseek-r1-0528-qwen3-8b:free',
                messages: [
                    {
                        role: 'system',
                        content: `You are an expert computer science course developer and designer. Your task is to enhance the raw documentation and convert into a structured course format.
                        You must respond with ONLY a valid JSON object, following this exact structure:
                        {
                            "courseTitle": "string",
                            "modules": [
                                {
                                    "moduleTitle": "string",
                                    "lessons": [
                                        {
                                            "title": "string",
                                            "content": "string",
                                            "example": "string",
                                        }
                                    ]
                                }
                            ]
                        }
                        Do include explanations text 
                        dont include outside the JSON object.`
                    },
                    {
                        role: 'user',
                        content: `Convert this documentation into a structured course. Maintain the original order and hierarchy. Be concise but faithful to the content:

                        ${prompt}`
                    }
                ],
                temperature: 0.3, // Lower temperature for more consistent JSON output
                response_format: { type: "json_object" }
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`,
                    'HTTP-Referer': SITE_URL,
                    'X-Title': SITE_NAME
                }
            }
        );

        const content = response.data.choices[0].message.content;
        
        // Validate that the response is valid JSON
        try {
            const parsed = JSON.parse(content);
            // Basic structure validation
            if (!parsed.courseTitle || !Array.isArray(parsed.modules)) {
                throw new Error('Invalid response structure');
            }
            return content;
        } catch (parseError) {
            console.error('Failed to parse OpenRouter response as JSON:', parseError);
            console.error('Raw response:', content);
            throw new Error('AI response was not in valid JSON format');
        }
    } catch (error: any) {
        console.error('OpenRouter API Error:', {
            status: error.response?.status,
            message: error.message,
            data: error.response?.data
        });
        throw error;
    }
}
