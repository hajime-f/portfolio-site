import serverless_wsgi
from app import app # app.py からFlaskアプリをインポート

def lambda_handler(event, context):
    return serverless_wsgi.handle(app, event, context)
