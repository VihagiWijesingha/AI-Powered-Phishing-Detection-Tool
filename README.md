# AI-Powered Phishing Detector Tool

## How to Run
1. Clone the repo
```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd ai-phishing-detector
```
2. Create a virtual environment

```bash
Copy code
python -m venv .venv
.venv\Scripts\activate  # Windows
source .venv/bin/activate  # Mac/Linux
```
3. Install requirements

```bash
pip install -r ai_phishing_detector/requirements.txt
```
4. Copy ```.env.example``` → rename to ```.env```, put your real API key.

5. Run the app

```bash
Copy code
flask run
# or
python ai_phishing_detector/app.py
```

---


