# Project Overview

This project is a Job Importer System with:

* **Backend** built using Node.js, Express, Mongoose (MongoDB), BullMQ (Redis), and Cron.
* **Frontend** built using React (Vite) with Material UI for displaying import logs.

It fetches job feeds from multiple sources (URLs), processes them in a queue, saves job records in MongoDB, and logs each import activity. The frontend shows logs in a paginated UI table.

---

## Backend Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd <project-folder>/server
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the `/server` directory:

```env
PORT=your_port
MONGO_URL=your_mongodb_uri
REDIS_HOST=your_redis_host
REDIS_PORT=redis_port
REDIS_PASSWORD=your_redis_password
```

### 4. Start the Backend

```bash
npm start
```

This starts:

* Express server
* Cron job to run periodically
* BullMQ worker to process job queues

---

## Frontend Setup

### 1. Navigate to Frontend

```bash
cd ../client
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create `.env` file in `/client`:

```env
VITE_API_URL=http://localhost:port
```

### 4. Start Development Server

```bash
npm run dev
```

For production build:

```bash
npm run build
npm run preview
```


## Running Tests

 User can test functionality manually:

* Trigger the cron job
* Check Redis Queue
* Monitor MongoDB collections
* View logs on the UI

---

## 📁 Project Structure

```
root
├── server
│   ├── models
│   ├── routes
│   ├── controllers
│   ├── index.js
│   └── .env
├── client
│   ├── src
│   │   ├── pages
│   │   ├── app.jsx
│   │   └── .env
```

