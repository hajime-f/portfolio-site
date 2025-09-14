const fetch = require('node-fetch');

// Netlify FunctionsはNode.jsで動作します
exports.handler = async (event) => {
  // フロントエンドから渡されたURLを取得
  const targetUrl = event.queryStringParameters.url;

  // Netlifyの環境変数からAPIキーとエンドポイントURLを安全に読み込む
  const apiKey = process.env.API_KEY;
  const apiEndpoint = process.env.OGP_API_ENDPOINT; // ★後で設定します

  if (!targetUrl || !apiKey || !apiEndpoint) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing parameters' }),
    };
  }

  try {
    // 裏側で本当のAPIを叩く
    const response = await fetch(`${apiEndpoint}?url=${encodeURIComponent(targetUrl)}`, {
      headers: {
        'x-api-key': apiKey,
      },
    });
    
    if (!response.ok) {
        throw new Error(`API server error: ${response.status}`);
    }

    const data = await response.json();

    // 結果をフロントエンドに返す
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
