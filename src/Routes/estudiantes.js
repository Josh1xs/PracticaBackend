import express , {Router} from "express"
import EstudianteController from "../Controllers/estudiantesController.js"

const router = express.Router()

router.route("/")
.get(EstudianteController.getEstudiantes)

router.route("/")
.put(EstudianteController.putEstudiantes)
.delete(EstudianteController.deleteEstudiantes)

export default router;