import express from 'express'
import { signup } from '../controllers/auth.controller'

const router = express.Router()

router.get("/login", (req, res) => {
    res.send("logged in successfully")
})

router.post("/signup",signup)

export default router