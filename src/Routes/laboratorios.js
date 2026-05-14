import express , {Router} from "express"
import laboratorioController from "../Controllers/laboratorioController.js"

const router = express.Router()

router.route("/")
.get(laboratorioController.getLaboratorios)
.post(laboratorioController.createLaboratorio)

router.route("/:id")
.put(laboratorioController.updateLaboratorio)
.delete(laboratorioController.deleteLaboratorio)

export default router;