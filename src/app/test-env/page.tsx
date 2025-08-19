"use client"

import { useState, useEffect } from 'react'

type EnvStatusSuccess = {
  hasApiKey: boolean
  apiKeyLength: number
  apiKeyPrefix: string
  allEnvVars: string[]
  message: string
}

type EnvStatus = EnvStatusSuccess | { error: string }


export default function TestEnvPage() {
  const [envStatus, setEnvStatus] = useState<EnvStatus | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkEnv = async () => {
      try {
        const response = await fetch('/api/test-env')
        const data = await response.json()
        setEnvStatus(data as EnvStatusSuccess)
      } catch {
        setEnvStatus({ error: 'Failed to check environment variables' })
      } finally {
        setLoading(false)
      }
    }

    checkEnv()
  }, [])

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">環境變數測量4</h1>
      
      {loading ? (
        <p>檢查中...</p>
      ) : !envStatus ? null : 'error' in envStatus ? (
        <div className="space-y-4">
          <div className="bg-red-100 p-4 rounded">
            <h2 className="font-semibold mb-2">錯誤</h2>
            <p>{envStatus.error}</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-gray-100 p-4 rounded">
            <h2 className="font-semibold mb-2">API Key 狀態：</h2>
            <p>找到 API Key: {envStatus.hasApiKey ? '✅ 是' : '❌ 否'}</p>
            <p>API Key 長度: {envStatus.apiKeyLength}</p>
            <p>API Key 前綴: {envStatus.apiKeyPrefix}</p>
            <p>訊息: {envStatus.message}</p>
          </div>

          <div className="bg-gray-100 p-4 rounded">
            <h2 className="font-semibold mb-2">所有 OpenAI 相關環境變數：</h2>
            <ul>
              {envStatus.allEnvVars.map((key: string) => (
                <li key={key}>• {key}</li>
              ))}
              {envStatus.allEnvVars.length === 0 && (
                <li>沒有找到任何 OpenAI 相關的環境變數</li>
              )}
            </ul>
          </div>

          <div className="bg-yellow-100 p-4 rounded">
            <h2 className="font-semibold mb-2">如果 API Key 沒有找到，請檢查：</h2>
            <ol className="list-decimal list-inside space-y-1">
              <li>是否在專案根目錄建立了 <code>.env.local</code> 檔案</li>
              <li>檔案內容是否為：<code>OPENAI_API_KEY=your_actual_api_key</code></li>
              <li>是否重新啟動了開發伺服器</li>
              <li>API Key 是否正確（以 sk- 開頭）</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  )
} 