import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import cors from "cors";
import http from "http"
import userRouter from "./routes/user.routes.js";
import shopRouter from "./routes/shop.routes.js";
import itemRouter from "./routes/item.routes.js";
import orderRouter from "./routes/order.routes.js";
import helmet from "helmet";
import { Server } from "socket.io";
import { socketHandler } from "./socket.js";

dotenv.config();

const app = express();
const server=http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://fastly-frontend.onrender.com"
    ],
    credentials: true,
    methods: ["GET", "POST"]
  }
});


app.set("io",io)

const port = process.env.PORT || 5000;
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://fastly-frontend.onrender.com"
    ],
    credentials: true
  })
);


// 🧩 Helmet Security Setup
// ----------------------------
// In development, disable COOP/COEP to prevent Google popup warnings
if (process.env.NODE_ENV === "development") {
  app.use(
    helmet({
      crossOriginOpenerPolicy: false,
      crossOriginEmbedderPolicy: false,
    })
  );

  // Just to be sure, also explicitly remove them
  app.use((req, res, next) => {
    res.removeHeader("Cross-Origin-Opener-Policy");
    res.removeHeader("Cross-Origin-Embedder-Policy");
    next();
  });
} else {
  // In production, use secure defaults
  app.use(helmet());
}

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/shop", shopRouter);
app.use("/api/item", itemRouter);
app.use("/api/order", orderRouter);

socketHandler(io)
server.listen(port, () => {
  connectDb();
  console.log(`server start at port ${port}`);
});
