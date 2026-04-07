import express from "express"
import dotenv from "dotenv"
import { routes } from "./routes/routes.js"
import { errorMiddleware } from "./middleware/error.middleware.js"
import cookieParser from "cookie-parser"
import cors from "cors"

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())
app.use(cookieParser())
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
app.use((req, res, next) => {
  console.log("=== 📥 Incoming Request ===");
  console.log("Method:", req.method);
  console.log("URL:", req.originalUrl);
  console.log("Params:", req.params);
  console.log("Query:", req.query);
  console.log("Body:", req.body);
  console.log("===========================");
  next();
});
routes(app)
app.use(errorMiddleware)
app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});