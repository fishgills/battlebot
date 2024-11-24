import OpenAI from 'openai';
import { env } from 'process';

export const gpt = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

const systemMessage =
  'Two players are fighting in a text-based game like dungeons and dragons through a slack bot. Response must ALWAYS be in JSON and in Slack Block Kit format. You are a dungeon master. Do not be afraid to use emojis.';

export const gptSlackMessage = async (message: string) => {
  try {
    const completion = await gpt.chat.completions.create({
      model: 'gpt-4o-mini',

      messages: [
        {
          role: 'system',
          content: systemMessage,
        },
        {
          role: 'user',
          content: message,
        },
      ],
      response_format: {
        type: 'json_object',
      },
    });

    return JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    throw new Error(`Failed to generate Slack message: ${error.message}`);
  }
};

export const gptSlackCombatResponse = async (message: object) => {
  if (typeof message !== 'object' || message === null) {
    throw new Error('Message must be a non-null object');
  }
  try {
    const completion = await gpt.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: systemMessage,
        },
        {
          role: 'user',
          content:
            'Please convert this block of JSON into Slack Block Kit JSON. It is a battle between Fighters. Do not be afraid to use emojis. The response must have no actions the user can take. No buttons, or external images. Each round of battle should be a short sentence: ' +
            JSON.stringify(message),
        },
      ],
      response_format: {
        type: 'json_object',
      },
    });

    return JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    throw new Error(`Failed to generate Slack message: ${error.message}`);
  }
};
