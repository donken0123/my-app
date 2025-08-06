import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // 檢查環境變數
    const apiKey = process.env.OPENAI_API_KEY;
    console.log('Environment variables check:');
    console.log('OPENAI_API_KEY exists:', !!apiKey);
    console.log('OPENAI_API_KEY length:', apiKey ? apiKey.length : 0);
    
    if (!apiKey) {
      console.error('OpenAI API key is missing');
      return NextResponse.json({ 
        error: 'OpenAI API key not configured',
        details: 'Please check your .env.local file and restart the development server'
      }, { status: 500 });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant. Keep your responses concise and friendly.'
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      
      // 處理特定錯誤類型
      if (errorData.error?.message?.includes('quota')) {
        return NextResponse.json({ 
          error: 'API 使用額度已用完',
          details: '請檢查你的 OpenAI 帳號額度或設定付款方式',
          code: 'QUOTA_EXCEEDED'
        }, { status: 429 });
      }
      
      if (errorData.error?.code === 'model_not_found') {
        return NextResponse.json({ 
          error: '模型不存在或無權限使用',
          details: '請檢查模型名稱或帳號權限',
          code: 'MODEL_NOT_FOUND'
        }, { status: 400 });
      }
      
      return NextResponse.json({ 
        error: 'OpenAI API 錯誤',
        details: errorData.error?.message || '未知錯誤',
        code: 'API_ERROR'
      }, { status: 500 });
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content;

    if (!aiResponse) {
      return NextResponse.json({ error: 'No response from AI' }, { status: 500 });
    }

    return NextResponse.json({ response: aiResponse });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 