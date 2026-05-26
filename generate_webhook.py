import requests
import json

url = "https://bfhldevapigw.healthrx.co.in/hiring/generateWebhook/PYTHON"
payload = {
    "name": "Yuvanshi Bhalawat",
    "regNo": "0827IT231154",
    "email": "yuvanshibhalawat230780@acropolis.in"
}
headers = {
    "Content-Type": "application/json"
}

try:
    response = requests.post(url, data=json.dumps(payload), headers=headers)
    print(response.text)
except Exception as e:
    print(f"Error: {e}")
