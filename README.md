# MECH ON WHEELS — Corrected Backend

## Requirements
Install Node.js (preferably Node 20 LTS or newer) and create a MongoDB database using local MongoDB or MongoDB Atlas.

## Install
From this folder, run:

```bash
npm install
```

Create your environment file:

```bash
copy .env.example .env
```

Open `.env` and set `MONGO_URI`.

### Local MongoDB example
```env
MONGO_URI=mongodb://127.0.0.1:27017/mech_on_wheels
```

### MongoDB Atlas example
Copy the connection string from Atlas > Database > Connect > Drivers. Replace `<db_password>` with the database user's password (URL-encode special characters such as `@`, `#`, `%`, `/`, or `:`). Example format:

```env
MONGO_URI=mongodb+srv://YOUR_DB_USER:YOUR_URL_ENCODED_PASSWORD@cluster0.xxxxx.mongodb.net/mech_on_wheels?retryWrites=true&w=majority
```

Do not literally use the example username, password, or cluster host. Use your own Atlas values. In Atlas, add your current IP address under Network Access and create a Database User under Database Access.

## Start
Development:
```bash
npm run dev
```

Production:
```bash
npm start
```

Expected startup:
```text
MongoDB connected: mech_on_wheels
MECH ON WHEELS API running at http://localhost:5000
```

Check in browser:
`http://localhost:5000/api/health`

## API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Check API and database startup |
| POST | `/api/requests` | Create a vehicle assistance request |
| GET | `/api/requests` | List recent requests |
| GET | `/api/requests/:id` | Get a request |
| POST | `/api/requests/:id/quotes` | Add a mechanic quote |
| PATCH | `/api/requests/:id/status` | Update status / selected mechanic |

### Create request JSON
```json
{
  "customerName": "Test Customer",
  "phone": "9876543210",
  "vehicle": "Hyundai i20",
  "issue": "Car will not start",
  "location": "Near main bus stand"
}
```

### Add quote JSON
```json
{
  "mechanicName": "Mech Pro",
  "price": 1850,
  "etaMinutes": 25,
  "rating": 4.8,
  "message": "I can reach you in 25 minutes."
}
```

### Update status JSON
```json
{
  "status": "Mechanic assigned",
  "selectedMechanic": "Mech Pro"
}
```

## Frontend connection
In the React/Vite frontend, set `VITE_API_URL=http://localhost:5000/api` in `frontend/.env`. This backend returns the created request document directly and returns an array for `GET /api/requests`, matching the React frontend included in the MECH ON WHEELS starter ZIP.
