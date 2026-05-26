import requests
import json

url = "https://bfhldevapigw.healthrx.co.in/hiring/generateWebhook/PYTHON"
data = {
    "name": "Yuvanshi Bhalawat",
    "regNo": "0827IT231154",
    "email": "yuvanshibhalawat@gmail.com"
}
response = requests.post(url, json=data)
print(json.dumps(response.json(), indent=2))
