import express from "express"
import registerEstudiantesController from "../Controllers/RegistroEstudiantesController.js"


const router = express.Router()

router.route("/")
.post(registerEstudiantesController.register)

router.route("/verifyCodeEmail")
.post(registerEstudiantesController.verifyCode)

export default router;