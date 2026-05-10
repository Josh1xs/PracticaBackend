import express from "express"
import RegisterMaestroController from "../Controllers/RegistroMaestrosController.js"


const router = express.Router()

router.route("/")
.post(RegisterMaestroController.register)

router.route("/verifyCodeEmail")
.post(RegisterMaestroController.verifyCode)

export default router;