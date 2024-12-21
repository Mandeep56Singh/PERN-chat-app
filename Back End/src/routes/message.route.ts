import express from 'express'
const router = express.Router()

router.get("/conversation", (req,res) => {
    res.send("Conversation Route")
})

export default router