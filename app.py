from flask import Flask, request, jsonify
import requests
from bs4 import BeautifulSoup
from flask_cors import CORS

app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False
CORS(app) # CORS設定を有効にする

@app.route('/api/ogp')
def get_ogp():
    # クエリパラメータからURLを取得
    url = request.args.get('url')
    if not url:
        return jsonify({"error": "URL is required"}), 400
    
    try:
        # 指定されたURLからHTMLを取得
        headers = {'User-Agent': 'Mozilla/5.0'}
        response = requests.get(url, headers=headers, timeout=5)
        response.raise_for_status() # エラーがあれば例外を発生させる
        
        # BeautifulSoupでHTMLを解析
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # OGP情報を抽出
        ogp_data = {
            'title': get_meta_property(soup, 'og:title'),
            'description': get_meta_property(soup, 'og:description'),
            'image': get_meta_property(soup, 'og:image'),
            'url': get_meta_property(soup, 'og:url')
        }
        
        # 成功したらJSONで返す
        return jsonify(ogp_data)
    
    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Failed to fetch URL: {e}"}), 500
    except Exception as e:
        return jsonify({"error": f"An error occurred: {e}"}), 500
    
def get_meta_property(soup, prop):
    """ 指定されたpropertyを持つmetaタグのcontentを返すヘルパー関数 """
    tag = soup.find('meta', property=prop)
    return tag['content'] if tag else None
