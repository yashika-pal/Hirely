# Hirely - Job Search and Recruitment Platform

A full-stack job portal application built with React (Vite) for the frontend and Node.js/Express/MongoDB for the backend.

---

## Features

- Secure login for students (job seekers) and recruiters (employers).
- Browse, search, and filter Jobs by location, type, etc.
- Students can apply to jobs directly through the platform.
- Recruiters manage company profiles and job posts.
- Real-time chat between users and recruiters for job-related communication.

---

## Tech Stack

- **Frontend:** React, Vite, Redux Toolkit, Tailwind CSS, Axios
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Other:** Socket.io (for real-time messaging),
  Cloudinary (for image uploads)

---

### Clone the repository

```bash
git clone https://github.com/yashika-pal/Hirely
cd Hirely
```

### Backend Setup

Create a `.env` file inside the `backend` folder with the following content:

```env
MONGO_URI=your_mongodb_connection_string
SECRET_KEY=your_secret_key
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
```

**Note:**

- Replace the values above with your actual credentials.

```bash
cd backend
npm install
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## License

[MIT License](LICENSE)

---
