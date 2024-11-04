import { env } from '$env/dynamic/private';
import OpenAI from 'openai';
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const openai = new OpenAI({apiKey: env.OPENAI_API_KEY});

const WritingAssistant = z.object({
	newTextContent: z.string(),
	changesReportMessage: z.string(),
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

	// try {
	const completion = await openai.beta.chat.completions.parse({
		model: "gpt-4o",
		messages: [
			{ role: "system", content: "너는 메모장에 글 쓰는 것을 도와주는 자야. user 가 현재까지 작성한 텍스트와 요구사항을 요청할거야. 그러면 너는 텍스트에 수정이 필요하다면 newTextContent 에 수정된 텍스트를 작성하고 수정이 필요없다면 기존 문자열을 넣어줘. newTextContent 는 마크다운을 지원하지 않으니 사용자가 요구하지 않는 이상 마크다운은 쓰지마. 제목은 텍스트 밖에 존재하니 쓰지 않아도 돼. 그리고 changesReportMessage 에는 변경사항에 대하여 사용자에게 알려주는 짧은 메시지를 적으면 돼. 사용자의 요구사항에 잘 따라 줘" },
			...requestData.conversation
		],
		response_format: zodResponseFormat(WritingAssistant, "writing_assistant"),
	});

	const writing_assist = completion.choices[0].message.parsed;

	return json({ code: 200, result: writing_assist });
	// }
}) satisfies RequestHandler;
