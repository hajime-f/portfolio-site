const fetch = require('node-fetch');

exports.handler = async (event) => {
  console.log('[DEBUG] Function invoked.'); // 1. 関数が呼び出されたか

  try {
    const targetUrl = event.queryStringParameters.url;
    console.log(`[DEBUG] Target URL: ${targetUrl}`); // 2. URLは受け取れているか

    const apiKey = process.env.API_KEY;
    const apiEndpoint = process.env.OGP_API_ENDPOINT;

    // 3. 環境変数は読み込めているか
    console.log(`[DEBUG] API_KEY loaded: ${!!apiKey}`); 
    console.log(`[DEBUG] OGP_API_ENDPOINT loaded: ${!!apiEndpoint}`);

    if (!targetUrl || !apiKey || !apiEndpoint) {
      console.error('[ERROR] Missing parameters.');
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing parameters' }),
      };
    }

    const fullApiUrl = `${apiEndpoint}?url=${encodeURIComponent(targetUrl)}`;
    console.log(`[DEBUG] Fetching real API: ${fullApiUrl}`); // 4. 実際に叩くURL

    const response = await fetch(fullApiUrl, {
      headers: { 'x-api-key': apiKey },
    });
    
    console.log(`[DEBUG] Real API response status: ${response.status}`); // 5. AWS APIからの応答

    if (!response.ok) {
      throw new Error(`API server error: ${response.status}`);
    }

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };

  } catch (error) {
    console.error('[FATAL] An error occurred in the handler:', error); // 6. エラー内容
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
