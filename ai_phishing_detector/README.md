# AI Phishing Detector

This is my final year project. It is a Flask (Python) app that can detect phishing.

---

## 🚀 How to Run

1. **Clone the repo**
   ```bash
   git clone https://github.com/<your-username>/<your-repo>.git
   cd ai-phishing-detector
   ```

2. **Create a virtual environment**
   ```bash
   python -m venv .venv
   .venv\Scripts\activate   # Windows
   source .venv/bin/activate   # Mac/Linux
   ```

3. **Install dependencies**
   ```bash
   pip install -r ai_phishing_detector/requirements.txt
   ```

4. **Environment variables**
   - Copy `.env.example` → rename it to `.env`
   - Put your real API key inside (do not share this file).

5. **Run the app**
   ```bash
   flask run
   # OR
   python ai_phishing_detector/app.py
   ```

---

## 📂 Project Structure
```
ai-phishing-detector/
  ai_phishing_detector/
    app.py
    requirements.txt
    templates/
    static/
  README.md
  .gitignore
  .env.example
```
