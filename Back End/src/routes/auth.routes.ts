import express from 'express'

const router = express.Router()

router.get("/login", (req, res) => {
    res.send("logged in successfully")
})

router.get("/signup", (req,res) => {
    res.send("Signed up successfully")
})

export default router