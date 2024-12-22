import express from 'express'
import authRoutes from './routes/auth.routes'
import messageRoutes from './routes/message.route'
import cookieParser from 'cookie-parser'
const app = express();
const PORT = process.env.PORT
app.use(cookieParser())
app.use(express.json())

app.use("/api/auth",authRoutes)
app.use("/api/messages",messageRoutes)

// app.get("/",(req, res) => {
//     res.send("Hello world")
// })
app.listen(PORT, () => {
    console.log("Server is running on Port:",PORT)
})