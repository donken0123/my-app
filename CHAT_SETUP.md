# 聊天功能設定說明

## 環境變數設定

要使用 ChatGPT API，你需要設定環境變數：

1. 在專案根目錄建立 `.env.local` 檔案
2. 在檔案中加入以下內容：

```
OPENAI_API_KEY=your_openai_api_key_here
```

## 取得 OpenAI API 金鑰

1. 前往 [OpenAI Platform](https://platform.openai.com/)
2. 登入或註冊帳號
3. 前往 API Keys 頁面
4. 點擊 "Create new secret key"
5. 複製金鑰並貼到 `.env.local` 檔案中

## 注意事項

- `.env.local` 檔案不會被提交到 Git，請妥善保管你的 API 金鑰
- 請確保你有足夠的 OpenAI API 額度
- 建議在開發時使用 GPT-3.5-turbo 來節省成本

## 測試

設定完成後，重新啟動開發伺服器：

```bash
npm run dev
```

然後前往 `/test3` 頁面測試聊天功能。 