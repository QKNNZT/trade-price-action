# TradePro – Fullstack Trade Journal

This is a refactored version of your original project with a more "company-style" structure.

## Structure

- `backend/` – Flask API + SQLite database
  - `app.py` – main application
  - `requirements.txt` – backend dependencies
  - `instance/` – runtime database (`trade_manager.db` will be created automatically)
  - `uploads/` – uploaded chart images

- `frontend/` – React + Vite dashboard
  - `src/components/` – shared UI components
  - `src/pages/` – route-level pages
  - `src/hooks/` – reusable hooks
  - `src/utils/` – stats & helper functions (renamed from `untils`)
  - `src/config/api.js` – centralized API base URL

## Run backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

The API will run on `http://127.0.0.1:5000` by default.

## Run frontend

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000` in your browser.

## API config

The frontend uses a centralized config at `src/config/api.js`:

```js
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";
```

If you want to change the backend URL, create a `.env` file in `frontend/`:

```env
VITE_API_URL=http://127.0.0.1:5000
```

(Or point it to your deployed backend.)

## Database

- No old data is shipped.
- On first run, `backend/instance/trade_manager.db` is created automatically with the correct schema.
- You can create new trades from the UI as usual.
