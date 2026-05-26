import requests
import json

url1 = "https://bfhldevapigw.healthrx.co.in/hiring/generateWebhook/PYTHON"
payload1 = {
    "name": "Yuvanshi Bhalawat",
    "regNo": "0827it231154",
    "email": "yuvanshibhalawat230780@acropolis.com"
}

headers = {
    "Content-Type": "application/json"
}

print("Executing Request 1...")
try:
    response1 = requests.post(url1, json=payload1, headers=headers)
    print("Response 1 Code:", response1.status_code)
    print("Response 1 Body:", response1.text)
    
    # Check headers and body for accessToken
    data1 = response1.json()
    token = data1.get("accessToken")
    if not token:
        token = response1.headers.get("accessToken")
    
    print("Extracted Token:", token)
    
    if token:
        url2 = "https://bfhldevapigw.healthrx.co.in/hiring/testWebhook/PYTHON"
        payload2 = {
            "finalQuery": "SELECT department, COUNT(*) as employee_count, AVG(salary) as average_salary FROM employees GROUP BY department HAVING COUNT(*) > 5 ORDER BY employee_count DESC;"
        }
        headers2 = {
            "Authorization": f"{token}",
            "Content-Type": "application/json"
        }
        
        print("\nExecuting Request 2...")
        response2 = requests.post(url2, json=payload2, headers=headers2)
        print("Response 2 Code:", response2.status_code)
        print("Response 2 Body:", response2.text)
    else:
        print("No accessToken found!")
except Exception as e:
    print("Error occurred:", e)
