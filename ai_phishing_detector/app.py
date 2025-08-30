from flask import Flask, render_template, request, jsonify
import requests
import os
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)

API_KEY = os.getenv("GEMINI_API_KEY")

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.json
    text = data.get('text')
    input_type = data.get('type')

    prompt = f"""You are an AI-powered phishing detection system. Analyze the provided {input_type} content for phishing indicators.
1. Textual Cues: Urgency, threats, requests for sensitive information, generic greetings, unusual grammar/spelling.
2. Sender Behavior: Impersonation attempts, unexpected senders, pressure tactics.
3. Domain Reputation: Suspicious URLs, non-HTTPS links, mismatched domains.

Analyze the following {input_type} content:
---
{text}
---
"""

    payload = {
        "contents": [{"role": "user", "parts": [{"text": prompt}]}],
        "generationConfig": {
            "responseMimeType": "application/json",
            "responseSchema": {
                "type": "OBJECT",
                "properties": {
                    "level": { "type": "STRING", "enum": ["safe", "potential", "high-risk"] },
                    "message": { "type": "STRING" },
                    "phishingScore": { "type": "NUMBER" },
                    "reasons": { "type": "ARRAY", "items": { "type": "STRING" } }
                },
                "required": ["level", "message", "phishingScore", "reasons"]
            }
        }
    }

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={API_KEY}"

    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()
        result_data = response.json()
        json_str = result_data['candidates'][0]['content']['parts'][0]['text']
        return jsonify(success=True, result=json_str)
    except Exception as e:
        return jsonify(success=False, error=str(e))

if __name__ == '__main__':
    app.run(debug=True)
