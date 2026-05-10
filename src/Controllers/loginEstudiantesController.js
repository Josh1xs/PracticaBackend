import jsonwebtoken from "jsonwebtoken"
import bcrypt  from "bcryptjs"
import { config } from "../../config.js"
import estudiantesModel from "../Models/estudiantes.js"
import { json } from "express"

const loginEstudianteController = {}

loginEstudianteController.login = async (req,res) => {
    try {
        const {email,password} = req.body

        //Verificar si el correo existe 
        const EstudianteFound = await estudiantesModel.findOne({email})

        //Si no existe

        if(!EstudianteFound){
            return res.status(400).json({message: "Estudiante not found"})
        }

        //Verificamos que no este bloqueada la cuenta 

        if(EstudianteFound.timeOut && EstudianteFound.timeOut > Date.now()) {
            return res.status(403).json({message: "Blocked account"})
        }

        //Validamos si la contrasena es correcta 

        const isMatch = await  bcrypt.compare(password,EstudianteFound.password)

        //Si la contrasena no es correcta

        if(!isMatch){
            EstudianteFound.loginAttempts =(EstudianteFound.login || 0) + 1
                    return res.status(401).json({message: "Wrong password"})

        }
        
        if(EstudianteFound.loginAttempts >=5){
            EstudianteFound.timeOut = Date.now() + 5 * 60 * 1000
            EstudianteFound.loginAttempts = 0
             await EstudianteFound.save()
             
             return res.status(400).json({message: "Blocked account for many attemps"})
        }

        await EstudianteFound.save()


        //Resetamos intentos si el login es correcto

        EstudianteFound.loginAttempts = 0,
        EstudianteFound.timeOut = null

        //Generamos el token

        const token = jsonwebtoken.sign(
            //lo que vamos a guardar
            {id: EstudianteFound._id, userType: "Estudiantes"},
            //SECRET KEY
            config.JWT.secret,
            //Cuando expira 
            {expiresIn: "30d"}
        )
        //Lo guardamos en una cookie
        res.cookie("authCookie", token)
        
        return res.status(200).json({message: "Login succesfully"})
    } catch (error) {
          console.log("error"+error)
        return res.status(500).json({message: "Internal server error"})
    }
}

export default loginEstudianteController;