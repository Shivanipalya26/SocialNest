import { Request, Response } from 'express';
import Groq from 'groq-sdk';
import { fal } from '@fal-ai/client';
import prisma from '../config/prisma.config';
import { AuthRequest } from '../types';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const generateCaption = async (req: Request, res: Response): Promise<void> => {
  try {
    const { content, tone = 'engaging', platform = 'twitter' } = req.body;

    if (!content) {
      res.status(400).json({ error: 'Content is required' });
      return;
    }

    const prompt = `Generate only the caption for: "${content}".
        The caption must: 
        - Be optimised for ${platform} (appropriate length, format, and style)
        - Have a ${tone} tone
        - Be concise and engaging
        - Include relevant hashtags if appropriate for the platform
        - Stay under 280 characters for Twitter, or appropriate  length for other platforms

        DO NOT include any prefixes like "Here's your caption:" or "Refined caption:". 
        Return ONLY the caption text itself.`;

    const caption = await groq.chat.completions
      .create({
        model: 'llama3-8b-8192',
        messages: [
          {
            role: 'system',
            content:
              'You are a social media caption expert who creates engaging, platform-appropriate captions. Return only the caption text without any prefixes or explanations.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
      })
      .catch(error => {
        if (process.env.NODE_ENV === 'development') {
          console.error('Groq api error :', error);
        }
        throw new Error('Failed to generate response form AI');
      });

    let cleanedCaption = caption.choices?.[0]?.message?.content?.trim() || '';

    cleanedCaption = cleanedCaption
      .replace(/^(here'?s?( your| the)?|refined|enhanced) caption:?\s*/i, '')
      .replace(/^caption:?\s*/i, '');
    res.status(200).json({ caption: cleanedCaption });
    return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error in caption generation:', error);
    }

    const errorResponse = error.message.includes('API key is missing')
      ? {
          error: 'Groq API key is missing or invalid. Please configure it properly.',
        }
      : { error: error.message || 'An unexpected error occurred.' };

    res.status(500).json({ error: errorResponse });
  }
};

fal.config({
  credentials: process.env.FAL_AI_KEY,
});

export const generateImage = async (req: AuthRequest, res: Response) => {
  const userId = req.body;

  if (!userId) {
    res.status(400).json({ error: 'User not found' });
    return;
  }

  try {
    const { caption } = req.body;
    console.log('caption', caption);

    if (!caption) {
      res.status(400).json({ error: 'Text is required' });
      return;
    }

    const result = await fal.subscribe('fal-ai/flux/dev', {
      input: {
        prompt: `Generate an image based on the following caption: + "${caption}`,
      },
      logs: true,
      onQueueUpdate: update => {
        if (update.status === 'IN_PROGRESS') {
          update.logs.map(log => log.message).forEach(console.log);
        }
      },
    });
    // console.log('img res ', result);

    if (result.data.images.length === 0) {
      res.status(500).json({ error: 'Image generation failed' });
      return;
    }

    await prisma.generatedImage.create({
      data: {
        prompt: caption,
        userId: userId,
        url: result.data.images[0].url,
      },
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error generating image:', error);
    }
    res.status(500).json({ error: 'Failed to generate image' });
  }
};

export const enhanceCaption = async (req: Request, res: Response) => {
  try {
    const content = req.query.content as string;
    const tone = (req.query.tone as string) || 'engaging';
    const platform = (req.query.platform as string) || 'twitter';

    if (!content) {
      res.status(400).json({ error: 'Content is required' });
      return;
    }

    const prompt = `Enhance and refine this caption: "${content}"
      
        Create an improved version that:
        - Is optimized for ${platform}
        - Has a ${tone} tone
        - Is concise and compelling
        - Includes appropriate hashtags if relevant to the platform
        - Follows platform best practices (character limits, formatting)
      
        DO NOT include any prefixes like "Here's your enhanced caption:" or "Refined caption:".
        Return ONLY the enhanced caption text itself.`;

    const caption = await groq.chat.completions
      .create({
        model: 'llama3-8b-8192',
        messages: [
          {
            role: 'system',
            content:
              'You are a social media expert who enhances captions to be engaging and platform-appropriate. Return only the enhanced caption without any prefixes or explanations.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
      })
      .catch(error => {
        if (process.env.NODE_ENV === 'development') {
          console.error('Groq API Error:', error);
        }
        throw new Error('Failed to generate response from AI');
      });

    let cleanedCaption = caption.choices?.[0]?.message?.content?.trim() || '';

    cleanedCaption = cleanedCaption
      .replace(/^(here'?s?( your| the)?|refined|enhanced) caption:?\s*/i, '')
      .replace(/^caption:?\s*/i, '');
    res.status(200).json({ caption: cleanedCaption });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error in enhancing caption generation:', error);
    }

    const errorResponse = error.message.includes('API key is missing')
      ? {
          error: 'Groq API key is missing or invalid. Please configure it properly.',
        }
      : { error: error.message || 'An unexpected error occurred.' };

    res.status(500).json({ error: errorResponse });
  }
};
