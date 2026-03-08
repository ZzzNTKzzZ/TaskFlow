import express from "express"
import dotenv from "dotenv"
import { routes } from "./routes/routes.js"
dotenv.config()
const app = express()
app.use(express.json())
const PORT = process.env.PORT || 5000 

app.get('/', (req, res) => {
  res.send('Server is up and running!');
});

routes(app)

app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});