import express , {Router} from "express"
import loginEstudianteController from "../Controllers/loginMaestrosController.js"
import loginMaestroController from "../Controllers/loginMaestrosController.js";


const router = express.Router()

router.route("/")
.post(loginMaestroController.login)

export default router;