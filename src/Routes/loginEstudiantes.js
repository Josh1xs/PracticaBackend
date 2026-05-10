import express , {Router} from "express"
import loginEstudianteController from "../Controllers/loginEstudiantesController.js"


const router = express.Router()

router.route("/")
.post(loginEstudianteController.login)

export default router;