import { env } from '$env/dynamic/private';
import OpenAI from 'openai';
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const openai = new OpenAI({apiKey: env.OPENAI_API_KEY});

const AiToolRecommend = z.object({
    toolName: z.string(),
    description: z.string(),
    functions: z.string(),
    website: z.string(),
    whyRecommend: z.string(),
});

export const POST = (async ({ request }) => {

    const requestData = await request.json();
    if (!requestData) {
        return json({
            error: {
                status: 400,
                message: 'Please enter a valid prompt'
            }
        });
    }

    const completion = await openai.beta.chat.completions.parse({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: "사용자가 제시하는 할일을 하기 위한 AI 툴을 추천해줘. 주어진 형식에 맞춰서 답변해주면 좋겠어. 답변은 모두 한국어로 했으면 좋겠어. functions에는 해당 툴의 주요 기능을 몇개 나열하면 돼. 따로 툴이 필요한 작업이 아니라면 해당 사항 없음 이라고 toolName을 설정해줘." },
            ...requestData.conversation
        ],
        response_format: zodResponseFormat(AiToolRecommend, "ai_tool_recommend"),
    });

    const recommend = completion.choices[0].message.parsed;

    return json({ code: 200, result: recommend });

}) satisfies RequestHandler;
