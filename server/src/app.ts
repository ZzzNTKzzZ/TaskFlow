import express from "express"
import dotenv from "dotenv"
import { routes } from "./routes/routes.js"
import { errorMiddleware } from "./middleware/error.middleware.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import morgan from "morgan"
import { apiRateLimiter } from "./middleware/rateLimit.middleware.js"
import { sanitizeMiddleware } from "./middleware/sanitize.middleware.js"

dotenv.config()

const app = express()
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : [
      "http://localhost:19006",
      "http://localhost:8081",
      "http://localhost:3000",
      "http://localhost:5173",
    ];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes("*")) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(apiRateLimiter)
app.use(express.json())
app.use(cookieParser())
app.use(sanitizeMiddleware)
const PORT = process.env.PORT || 5000 

app.get('/', (req, res) => {
  res.send('Server is up and running!');
});
app.get('/api/check-connection', (req, res) => {
  res.status(200).json({
    message: "Kết nối thành công từ Backend!",
    timestamp: new Date().toLocaleString()
  });
});
routes(app)
app.use(errorMiddleware)
app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});