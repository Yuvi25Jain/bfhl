import requests
import json
import time

def perform_handshake():
    url = "https://bfhldevapigw.healthrx.co.in/hiring/generateWebhook/PYTHON"
    payload = {
        "name": "Yuvanshi Bhalawat",
        "regNo": "0827IT231154",
        "email": "yuvanshibhalawat@gmail.com"
    }
    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()
        data = response.json()
        print(f"Handshake successful. Webhook URL: {data['webhook']}")
        return data['webhook'], data['accessToken']
    except Exception as e:
        print(f"Handshake failed: {e}")
        return None, None

def submit_query(webhook_url, token):
    # SQL Question Q2 (Even)
    # Calculate the number of employees younger than each employee, grouped by department.
    final_query = """
    SELECT 
        e1.EMP_ID, 
        e1.FIRST_NAME, 
        e1.LAST_NAME, 
        d.DEPARTMENT_NAME,
        (SELECT COUNT(*) 
         FROM EMPLOYEE e2 
         WHERE e2.DEPARTMENT = e1.DEPARTMENT 
         AND e2.DOB > e1.DOB) AS YOUNGER_EMPLOYEES_COUNT
    FROM 
        EMPLOYEE e1
    JOIN 
        DEPARTMENT d ON e1.DEPARTMENT = d.DEPARTMENT_ID
    ORDER BY 
        e1.EMP_ID DESC;
    """
    
    payload = {
        "finalQuery": final_query
    }
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.post(webhook_url, json=payload, headers=headers)
        response.raise_for_status()
        print("Query submission successful.")
        print("Response:", response.json())
    except Exception as e:
        print(f"Query submission failed: {e}")
        if hasattr(e, 'response') and e.response is not None:
            print("Server response:", e.response.text)

if __name__ == "__main__":
    print("Starting BFHL Qualifier Submission script...")
    webhook_url, token = perform_handshake()
    if webhook_url and token:
        submit_query(webhook_url, token)
    else:
        print("Could not proceed without handshake data.")
    
    print("Task completed. Entering idle state for Render persistence...")
    # Keep the script running so Render doesn't constantly restart it
    while True:
        time.sleep(3600)
