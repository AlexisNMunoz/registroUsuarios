import express from "express"
import { autenticar, confirmar, registrar } from "../controllers/usuarioCrontroller.controller.js"

const router = express.Router()

//Creacion, registro y confirmacionde Usuarios

router.post("/", registrar)
router.post("/login", autenticar)
router.get("/confirmar/:token", confirmar)

export default router