# Flask + React App

This is a full-stack web application using Flask for the backend and React for the frontend.

## Project Structure
```
flask-react-app/
├── backend/       # Flask backend
│   ├── app.py     # Main Flask app
│   ├── venv/      # Python virtual environment
│   ├── requirements.txt  # Dependencies
├── frontend/      # React frontend
│   ├── src/       # React source code
│   ├── package.json # Frontend dependencies
│   ├── vite.config.js  # Vite configuration
├── README.md      # Project documentation
```

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd flask-react-app
```

### 2. Backend Setup (Flask)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install flask flask-cors
```

Create a `requirements.txt` file:
```bash
pip freeze > requirements.txt
```

Run Flask server:
```bash
python app.py
```

### 3. Frontend Setup (React + Vite)
```bash
cd ../frontend
npm install
npm run dev
```

### 4. API Integration
The Flask backend exposes an API endpoint:
- **GET /api/hello** → Returns a JSON message `{ "message": "Hello from Flask!" }`

### 5. Running the App
Run both the backend and frontend:
- **Backend:** `python backend/app.py`
- **Frontend:** `cd frontend && npm run dev`

The React frontend will fetch data from Flask at `http://127.0.0.1:5000/api/hello`.

## Deployment
- Use **Gunicorn** for deploying Flask: `gunicorn -w 4 app:app`
- Deploy React with **Vercel** or **Netlify**
- Configure CORS properly for production

## License
This project is open-source and free to use.

