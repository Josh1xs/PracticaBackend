import express from "express"
import estudiantesRoutes from "./src/Routes/estudiantes.js"
import registerEstudiantes from "./src/Routes/registerEstudiantes.js"
import cookieParser from "cookie-parser";
const app = express();

//para que acepte json la API
app.use(express.json())
app.use(cookieParser());



app.use("/api/estudiantes", estudiantesRoutes)
app.use("/api/register/estudiantes", registerEstudiantes)

export default app;