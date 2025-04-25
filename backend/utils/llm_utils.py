import requests
import os
import json

def query_deepseek_model(prompt: str, system_prompt: str = "", temperature: float = 0.7):
    url = "https://api.deepseek.com/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {os.getenv('DEEPSEEK_API_KEY')}",
        "Content-Type": "application/json"
    }
    data = {
        "model": "deepseek-chat",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt}
        ],
        "temperature": temperature,
        "stream": True
    }

    with requests.post(url, headers=headers, json=data, stream=True) as response:
        for line in response.iter_lines():
            if line:
                decoded = line.decode("utf-8")
                if decoded.startswith("data: "):
                    decoded = decoded[len("data: "):]
                if decoded.strip() == "[DONE]":
                    break
                try:
                    chunk = json.loads(decoded)
                    delta = chunk["choices"][0]["delta"].get("content", "")
                    yield delta
                except Exception as e:
                    yield f"\n[ERROR] {str(e)}\n"