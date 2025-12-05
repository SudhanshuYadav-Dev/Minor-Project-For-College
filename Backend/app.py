import os
import requests
import base64 
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

from dotenv import load_dotenv

load_dotenv()

HF_API_KEY = os.getenv("HF_API_KEY")
MODEL_API_URL = os.getenv("MODEL_API_URL")


HEADERS = {
    "Authorization": f"Bearer {HF_API_KEY}"
}

@app.route('/generate-image', methods=['POST'])
def generate_image():
    """
    Yeh function React se POST request lega, prompt ko extract karega,
    Hugging Face API ko call karega, aur image data wapas bhejega.
    """
    try:
    
        data = request.json
        prompt = data.get('prompt')

        if not prompt:
            return jsonify({"error": "No prompt provided"}), 400

        
        payload = {
            "inputs": prompt
        }

        response = requests.post(MODEL_API_URL, headers=HEADERS, json=payload)

        
        if response.status_code == 200:
            image_bytes = response.content
            
            base64_image = base64.b64encode(image_bytes).decode('utf-8')
            image_url = f"data:image/jpeg;base64,{base64_image}"

            return jsonify({"imageUrl": image_url})
        else:
            print("API Error Response:", response.text) 
            try:
                error_data = response.json()
                
                if "error" in error_data and "estimated_time" in error_data:
                    return jsonify({"error": "Model is loading, please try again in 30 seconds."}), 503
            except:
                pass 

            return jsonify({"error": "Failed to generate image", "details": response.text}), response.status_code

    except Exception as e:
        print(f"Server Error: {e}") 
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)