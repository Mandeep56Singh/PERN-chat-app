import express from 'express'
import authRoutes from './routes/auth.routes'
import messageRoutes from './routes/message.route'
const app = express();

app.use(express.json())
app.use("/api/auth",authRoutes)
app.use("/api/messages",messageRoutes)

app.get("/",(req, res) => {
    res.send("Hello world")
})
app.listen(5000, () => {
    console.log("Server is running on Port:")
})