import express from "express"
import dotenv from "dotenv"
import { routes } from "./routes/routes.js"
import { errorMiddleware } from "./middleware/error.middleware.js"
import cookieParser from "cookie-parser"
dotenv.config()
const app = express()
app.use(express.json())
app.use(cookieParser())
const PORT = process.env.PORT || 5000 

app.get('/', (req, res) => {
  res.send('Server is up and running!');
});

routes(app)
app.use(errorMiddleware)
app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});