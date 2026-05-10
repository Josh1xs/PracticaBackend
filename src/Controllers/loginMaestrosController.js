import jsonwebtoken from "jsonwebtoken"
import bcrypt  from "bcryptjs"
import { config } from "../../config.js"
import maestrosModel from "../Models/maestros.js"
import { json } from "express"

const loginMaestroController = {}

loginMaestroController.login = async (req,res) => {
    try {
        const {email,password} = req.body

        //Verificar si el correo existe 
        const MaestroFound = await maestrosModel.findOne({email})

        //Si no existe

        if(!MaestroFound){
            return res.status(400).json({message: "Estudiante not found"})
        }

        //Verificamos que no este bloqueada la cuenta 

        if(MaestroFound.timeOut && MaestroFound.timeOut > Date.now()) {
            return res.status(403).json({message: "Blocked account"})
        }

        //Validamos si la contrasena es correcta 

        const isMatch = await  bcrypt.compare(password,MaestroFound.password)

        //Si la contrasena no es correcta

        if(!isMatch){
            MaestroFound.loginAttempts =(MaestroFound.login || 0) + 1
                    return res.status(401).json({message: "Wrong password"})

        }
        
        if(MaestroFound.loginAttempts >=5){
            MaestroFound.timeOut = Date.now() + 5 * 60 * 1000
            MaestroFound.loginAttempts = 0
             await MaestroFound.save()
             
             return res.status(400).json({message: "Blocked account for many attemps"})
        }

        await MaestroFound.save()


        //Resetamos intentos si el login es correcto

        MaestroFound.loginAttempts = 0,
        MaestroFound.timeOut = null

        //Generamos el token

        const token = jsonwebtoken.sign(
            //lo que vamos a guardar
            {id: MaestroFound._id, userType: "Maestros"},
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

export default loginMaestroController;