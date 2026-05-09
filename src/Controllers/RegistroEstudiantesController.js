import nodemailer from "nodemailer" 
import crypto from "crypto"
import jsonwebtoken from "jsonwebtoken"
import bcryptjs from "bcryptjs" //Encriptar contrasenas
import { config } from "../../config.js" 
import estudiantesModel from "../Models/estudiantes.js"

const registerEstudiantesController = {}

registerEstudiantesController.register = async (req,res) => {
    try {
        //Solicitamos lo datos a guardar

        const {name,lastname,email,password,career,isVerified,timeOut} = req.body

        //Validamos si el correo existe en la bd
        const existEstudiante = await estudiantesModel.findOne({email})

        if(existEstudiante){
            return res.status(400).json({message: "Estudiante already exists"})
        }

        //Encriptamos la contrasena 
        const PasswordHashed = await bcryptjs.hash(password,12)

        //Generamos un codigo random

        const randomCode = crypto.randomBytes(3).toString("hex")

        //Guardamos el token
        const token = jsonwebtoken.sign(
            //lo que vamos a guardar
            {randomCode,name,lastname,email,career,password:PasswordHashed, isVerified,timeOut},
            
            //Secret key
            config.JWT.secret,
            //Cuando expira el token
            {expiresIn: "10m"}

        )
            
            //Guardamos el token
            res.cookie("registrationCookie",token, {maxAge: 15 * 60 *1000})

            //Enviar correo
          const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: config.email.user_email,
                    pass: config.email.user_password
                }
            })
            
            //Quien lo recibe
            const mailoptions = {
                from: config.email.user_email,
                to: email,
                subject: "Verificacion de tu cuenta",

                text: "Para verificar tu cuenta, utiliza este codigo:" + "" + randomCode + "expiran en 15 minutos" 
            }

            //enviamos el correo
            transporter.sendMail(mailoptions ,(error,info) => {
                if(error){
                    console.log("error" + error)
                    return res.status(500).json({message: "Error sending email"})
                }
                return res.status(200).json({message: "Email sent"})
            })
    } catch (error) {
          console.log("error"+error)
        return res.status(500).json({message: "Internal server error"})
    }
}
registerEstudiantesController.verifyCode=async(req,res)=>{
    try {
        const {verificationCodeRequest} = req.body
         
        const token = req.cookies.registrationCookie

        const decoded = jsonwebtoken.verify(token, config.JWT.secret)
        const {
            randomCode: storedCode,
            name,
            lastname,
            email,
            career,
            password,
            isVerified,
            loginAttemps,
            timeOut,
        } = decoded;

        if (verificationCodeRequest !== storedCode){
            return res.status(400).json({message: "Invalid code"})
        }

        const newEstudiante = estudiantesModel({
            name,lastname,email,password,isVerified:true,
        });
        await newEstudiante.save()

        res.clearCookie("registrationCookie")

        return res.status(200).json({message: "Estudiante registred"})
    } catch (error) {
        console.log("error"+error)
        return res.status(500).json({message: "Internal server error"})
    }
}

export default registerEstudiantesController;