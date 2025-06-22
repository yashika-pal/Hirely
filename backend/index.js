import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
import messageRoute from "./routes/message.route.js";
import path from "path";

dotenv.config({});
const _dirname = path.resolve();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://hirely-1bui.onrender.com",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const userSocketMap = {};

app.set("socketio", io);
app.set("userSocketMap", userSocketMap);

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const corsOptions = {
  origin: "https://hirely-1bui.onrender.com",
  credentials: true,
};

app.use(cors(corsOptions));

const PORT = 3000;

// api's
app.use("/api/user", userRoute);
app.use("/api/company", companyRoute);
app.use("/api/job", jobRoute);
app.use("/api/application", applicationRoute);
app.use("/api/message", messageRoute);

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId !== "undefined" && userId) {
    userSocketMap[userId] = socket.id;
  }

  socket.on("disconnect", () => {
    for (const [key, value] of Object.entries(userSocketMap)) {
      if (value === socket.id) {
        delete userSocketMap[key];
        break;
      }
    }
  });
});

app.use(express.static(path.join(_dirname, "/frontend/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"));
});

server.listen(PORT, () => {
  connectDB();
  console.log(`Server running at port ${PORT}`);
});
