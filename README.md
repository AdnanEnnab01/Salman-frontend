# Dental Clinic Application

A full-stack dental clinic application with React frontend and FastAPI backend, integrated with Supabase for authentication.

## Features

- Email and password login form
- User authentication with Supabase
- Form validation
- Beautiful turquoise-themed design
- Responsive layout
- Welcome page after successful login
- Protected routes

## Project Structure

```
Demo/
├── src/                    # React frontend
│   ├── components/         # React components
│   │   ├── Login.js       # Login page component
│   │   └── Welcome.js     # Welcome page component
│   ├── App.js             # Main App component with routing
│   └── index.js           # Entry point
├── backend/               # FastAPI backend
│   ├── main.py           # FastAPI application
│   └── requirements.txt  # Python dependencies
└── package.json          # Node.js dependencies
```

## Installation

### Frontend Setup

1. Install Node.js dependencies:
```bash
npm install
```

### Backend Setup

1. Navigate to backend folder:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
```

3. Activate the virtual environment:
```bash
# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

4. Install Python dependencies:
```bash
pip install -r requirements.txt
```

## Running the Application

### Step 1: Start the Backend Server

In the `backend` folder, run:
```bash
uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`
- API Documentation: `http://localhost:8000/docs`

### Step 2: Start the Frontend

In the root directory, run:
```bash
npm start
```

The application will open in your browser at `http://localhost:3000`

## API Endpoints

### POST /api/login
Login endpoint for user authentication.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "created_at": "2024-01-01T00:00:00Z"
  },
  "access_token": "jwt-token"
}
```

## Building for Production

### Frontend
```bash
npm run build
```
The optimized files will be in the `dist` folder.

### Backend
The FastAPI server can be deployed using any ASGI server like Gunicorn or Uvicorn.

## Notes

- Make sure both frontend and backend servers are running
- The backend uses Supabase service_role key for authentication
- Users must be registered in Supabase before they can login
- Access tokens are stored in localStorage after successful login
