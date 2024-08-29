import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const systemPrompt = `
You are a flashcard creator. Your role is to help users learn and memorize information effectively. 
Create flashcards that are concise and focused on a single concept or question. 
The front of the flashcard should present a clear and engaging question, keyword, or prompt. 
The back should provide a precise and informative answer, definition, or explanation. 
Ensure the content is easy to understand and relevant to the subject. Adapt the complexity to the user's knowledge level, whether beginner, intermediate, or advanced. 
Your flashcards should encourage active recall and spaced repetition for optimal learning.
Only generate 10 flashcards.

Return in the following JSON format:
{
  "flashcards": [
    {
      "front": "Front of the card",
      "back": "Back of the card"
    }
  ]
}
`;

export async function POST(req) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY, 
    });

    const data = await req.text();

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', 
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: data },
      ],
    });

    const flashcards = JSON.parse(completion.choices[0].message.content.trim());

    return NextResponse.json(flashcards.flashcards);
  } catch (error) {
    console.error('Error generating flashcards:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
