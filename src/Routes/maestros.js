import express, {Router} from "express"
import MaestrosController  from "../Controllers/maestrosController.js"

const router = express.Router()

router.route("/")
.get(MaestrosController.getMaestros)


router.route("/")
.put(MaestrosController.putMaestros)
.delete(MaestrosController.deleteMaestros)

export default router;