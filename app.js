import express from "express"
import estudiantesRoutes from "./src/Routes/estudiantes.js"
import registerEstudiantes from "./src/Routes/registerEstudiantes.js"
import registerMaestro from "./src/Routes/registerMaestros.js"
import loginEstudiantes from "./src/Routes/loginEstudiantes.js"
import loginMaestros from "./src/Routes/loginMaestros.js"
import logout from "./src/Routes/logout.js"
import recoverypassword from "./src/Routes/recoveryPassword.js"
import laboratorios from "./src/Routes/laboratorios.js"
import cookieParser from "cookie-parser";
const app = express();

//para que acepte json la API
app.use(express.json())
app.use(cookieParser());

app.use("/api/laboratorios", laboratorios)

app.use("/api/estudiantes", estudiantesRoutes)
app.use("/api/register/estudiantes", registerEstudiantes)
app.use("/api/register/maestros", registerMaestro)
app.use("/api/login/estudiantes", loginEstudiantes)
app.use("/api/login/maestros", loginMaestros)
app.use("/api/logout", logout)
app.use("/api/recoveryPassword", recoverypassword)


export default app;