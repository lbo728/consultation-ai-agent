import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';

/**
 * POST /api/inbound/email
 *
 * Receives inbound customer inquiry emails from email service providers
 * (SendGrid Inbound Parse, AWS SES, Resend, etc.)
 *
 * Expected webhook payload (SendGrid Inbound Parse format):
 * - from: Sender email address
 * - to: Recipient email address (used to identify brand/user)
 * - subject: Email subject
 * - text: Plain text email body
 * - html: HTML email body
 *
 * Flow:
 * 1. Parse email webhook payload
 * 2. Identify user by recipient email address (inbound_email_address)
 * 3. Store raw email in database
 * 4. Trigger async processing (AI question extraction + Slack notification)
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = getServiceSupabase();

    // Parse form data (SendGrid sends multipart/form-data)
    const formData = await request.formData();

    const from = formData.get('from') as string;
    const to = formData.get('to') as string;
    const subject = formData.get('subject') as string;
    const text = formData.get('text') as string;
    const html = formData.get('html') as string;

    // Validate required fields
    if (!from || !to) {
      return NextResponse.json(
        { error: 'Missing required fields: from, to' },
        { status: 400 }
      );
    }

    console.log('[Inbound Email] Received email:', { from, to, subject });

    // Extract the actual email address from "to" field
    // Format can be: "brandname@inbound.your-saas.ai" or "Brand Name <brandname@inbound.your-saas.ai>"
    const toEmailMatch = to.match(/<(.+?)>/) || [null, to];
    const toEmail = toEmailMatch[1] || to;

    // Find user by inbound email address
    const { data: userConfig, error: configError } = await supabase
      .from('user_email_slack_config')
      .select('user_id, slack_webhook_url')
      .eq('inbound_email_address', toEmail.trim().toLowerCase())
      .single();

    if (configError || !userConfig) {
      console.error('[Inbound Email] User not found for email:', toEmail, configError);
      return NextResponse.json(
        { error: 'Recipient email address not configured for any user' },
        { status: 404 }
      );
    }

    const userId = userConfig.user_id;
    console.log('[Inbound Email] Found user:', userId);

    // Store raw email in database
    const { data: emailRecord, error: insertError } = await supabase
      .from('inbound_emails')
      .insert({
        user_id: userId,
        from_email: from,
        subject: subject || '(No subject)',
        raw_text: text || '',
        raw_html: html || '',
        processing_status: 'pending',
      })
      .select()
      .single();

    if (insertError) {
      console.error('[Inbound Email] Failed to store email:', insertError);
      return NextResponse.json(
        { error: 'Failed to store email' },
        { status: 500 }
      );
    }

    console.log('[Inbound Email] Stored email with ID:', emailRecord.id);

    // Trigger async processing
    // Note: In production, this should be handled by a background job queue
    // For MVP, we'll process immediately but return response quickly
    processEmailAsync(emailRecord.id, userId, userConfig.slack_webhook_url);

    return NextResponse.json({
      success: true,
      email_id: emailRecord.id,
      message: 'Email received and queued for processing',
    });

  } catch (error) {
    console.error('[Inbound Email] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Process email asynchronously:
 * 1. Extract customer questions using AI
 * 2. Generate AI answers using RAG
 * 3. Send Slack notification
 */
async function processEmailAsync(
  emailId: string,
  userId: string,
  slackWebhookUrl: string | null
) {
  // Run in background without blocking response
  // This is a simple implementation - in production, use a proper job queue
  setImmediate(async () => {
    try {
      const supabase = getServiceSupabase();

      // Update status to processing
      await supabase
        .from('inbound_emails')
        .update({ processing_status: 'processing' })
        .eq('id', emailId);

      // Get email content
      const { data: email } = await supabase
        .from('inbound_emails')
        .select('raw_text, raw_html, subject')
        .eq('id', emailId)
        .single();

      if (!email) {
        throw new Error('Email not found');
      }

      // Step 1: Extract questions using AI
      const questions = await extractQuestionsFromEmail(
        email.raw_text || email.raw_html || ''
      );

      console.log('[Email Processing] Extracted questions:', questions);

      // Step 2: Generate AI answers for each question
      const answers = await generateAnswersForQuestions(userId, questions);

      console.log('[Email Processing] Generated answers:', answers);

      // Step 3: Store results
      await supabase
        .from('inbound_emails')
        .update({
          extracted_questions: questions,
          ai_answers: answers,
          processing_status: 'completed',
          processed_at: new Date().toISOString(),
        })
        .eq('id', emailId);

      // Step 4: Send Slack notification
      if (slackWebhookUrl) {
        await sendSlackNotification(slackWebhookUrl, {
          subject: email.subject,
          questions,
          answers,
        });

        await supabase
          .from('inbound_emails')
          .update({ slack_notified_at: new Date().toISOString() })
          .eq('id', emailId);
      }

      console.log('[Email Processing] Processing completed for email:', emailId);

    } catch (error) {
      console.error('[Email Processing] Error:', error);

      // Update status to failed
      const supabase = getServiceSupabase();
      await supabase
        .from('inbound_emails')
        .update({
          processing_status: 'failed',
          error_message: error instanceof Error ? error.message : 'Unknown error',
        })
        .eq('id', emailId);
    }
  });
}

/**
 * Extract customer questions from email content using AI
 */
async function extractQuestionsFromEmail(emailContent: string): Promise<string[]> {
  try {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const ai = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
    const model = ai.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const systemPrompt = `너는 이커머스 고객 문의 알림 이메일을 분석하는 역할이다.
아래 이메일 내용에서 실제 고객이 작성한 질문 문장만 추출하라.

조건:
- 인사말, 자동 안내 문구 제거
- 상품명, 주문번호 제거
- 질문이 여러 개면 모두 반환
- 원문 표현을 최대한 유지
- 질문이 없으면 빈 배열 반환

출력은 JSON 배열로 반환한다.
예시: ["질문1", "질문2"]

이메일 내용:
${emailContent}`;

    const result = await model.generateContent(systemPrompt);
    const response = result.response.text();

    // Parse JSON array from response
    // Handle markdown code blocks if present
    let jsonText = response.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/, '').replace(/```\n?$/, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/, '').replace(/```\n?$/, '');
    }

    const questions = JSON.parse(jsonText);

    if (!Array.isArray(questions)) {
      console.error('[AI] Invalid response format:', response);
      return [];
    }

    return questions.filter((q: string) => q && q.trim().length > 0);

  } catch (error) {
    console.error('[AI] Question extraction error:', error);
    // Fallback: return the email content as a single question
    return [emailContent.trim().substring(0, 500)];
  }
}

/**
 * Generate AI answers for questions using RAG
 */
async function generateAnswersForQuestions(
  userId: string,
  questions: string[]
): Promise<Array<{ question: string; answer: string }>> {
  try {
    const supabase = getServiceSupabase();
    const { GoogleGenAI } = require('@google/genai');
    const ai = new GoogleGenAI({
      apiKey: process.env.GOOGLE_AI_API_KEY,
    });

    // Get user's File Search Store
    const { data: storeData } = await supabase
      .from('file_search_stores')
      .select('store_name')
      .eq('user_id', userId)
      .single();

    if (!storeData) {
      console.warn('[RAG] No File Search Store found for user:', userId);
      // Return without RAG if no knowledge base exists
      return questions.map(q => ({
        question: q,
        answer: '브랜드 지식이 등록되지 않아 답변을 생성할 수 없습니다.',
      }));
    }

    // Get user's default brand tone or fallback to default instruction
    const { data: brandTone } = await supabase
      .from('brand_tones')
      .select('instruction_content')
      .eq('user_id', userId)
      .eq('is_default', true)
      .single();

    const systemInstruction = brandTone?.instruction_content || `
당신은 브랜드의 고객 상담 전문가입니다.

답변 톤:
- 친절하고 전문적인 톤 유지
- 구체적이고 명확한 정보 제공
- 고객이 궁금해하는 핵심 정보를 명확하게 전달

답변 시 다음을 참고하세요:
1. 업로드된 브랜드 지식 문서를 기반으로 답변합니다.
2. 치수, 수량, 가격 등 구체적인 정보를 포함합니다.
3. 문서에 없는 정보는 추측하지 말고 명확하게 안내합니다.
`;

    // Generate answers for each question
    const answers = await Promise.all(
      questions.map(async (question) => {
        try {
          const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: question,
            config: {
              systemInstruction,
              temperature: 0.7,
              maxOutputTokens: 2000,
              tools: [
                {
                  fileSearch: {
                    fileSearchStoreNames: [storeData.store_name],
                  },
                },
              ],
            },
          });

          const answer = response.text || '답변을 생성할 수 없습니다.';
          return { question, answer };

        } catch (error) {
          console.error('[RAG] Error generating answer for question:', question, error);
          return {
            question,
            answer: '답변 생성 중 오류가 발생했습니다.',
          };
        }
      })
    );

    return answers;

  } catch (error) {
    console.error('[RAG] Error in generateAnswersForQuestions:', error);
    return questions.map(q => ({
      question: q,
      answer: '답변 생성 중 오류가 발생했습니다.',
    }));
  }
}

/**
 * Send Slack notification with questions and answers
 */
async function sendSlackNotification(
  webhookUrl: string,
  data: {
    subject: string;
    questions: string[];
    answers: Array<{ question: string; answer: string }>;
  }
): Promise<void> {
  try {
    // Build Slack Block Kit message
    const blocks: any[] = [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '📩 새로운 고객 문의 답변 생성',
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*이메일 제목*\n${data.subject}`,
        },
      },
      {
        type: 'divider',
      },
    ];

    // Add each question and answer pair
    data.answers.forEach((qa, index) => {
      blocks.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*❓ 고객 질문 ${data.answers.length > 1 ? `#${index + 1}` : ''}*\n${qa.question}`,
        },
      });

      blocks.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*🤖 생성된 AI 답변*\n${qa.answer}`,
        },
      });

      // Add divider between Q&A pairs (but not after the last one)
      if (index < data.answers.length - 1) {
        blocks.push({
          type: 'divider',
        });
      }
    });

    // Add footer with warning
    blocks.push({
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: '⚠️ *자동 생성된 초안입니다. 검토 후 사용하세요.*',
        },
      ],
    });

    blocks.push({
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: `생성 시각: ${new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}`,
        },
      ],
    });

    // Send to Slack webhook
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ blocks }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Slack webhook failed: ${response.status} ${errorText}`);
    }

    console.log('[Slack] Notification sent successfully');

  } catch (error) {
    console.error('[Slack] Failed to send notification:', error);
    throw error;
  }
}
