import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.OPENAI_API_KEY;
  
  return NextResponse.json({
    hasApiKey: !!apiKey,
    apiKeyLength: apiKey ? apiKey.length : 0,
    apiKeyPrefix: apiKey ? apiKey.substring(0, 7) + '...' : 'none',
    allEnvVars: Object.keys(process.env).filter(key => key.includes('OPENAI')),
    message: apiKey ? 'API key found' : 'API key not found'
  });
} 