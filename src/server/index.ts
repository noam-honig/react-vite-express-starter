import express from "express"
import { api } from "./api"



const app = express()
app.use((req, res, next) => {
    req.setHeader = (key, value) => res.header(key, value)
    next();
})
app.use(api)

app.get("*", (req, res) => res.send(`api Server - path: "${req.path}"`))
app.listen(3002, () => console.log("Server started"))

