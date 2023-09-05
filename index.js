import express from "express"
import dotenv from "dotenv"
import conectarDB from "./config/db.js"
import usuarioRoute from "./routes/usuarioRaute.rautes.js"

const app = express()
app.use(express.json())

dotenv.config()

conectarDB()

//Routing
app.use('/api/usuarios', usuarioRoute)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => { console.log(`${PORT}`) })