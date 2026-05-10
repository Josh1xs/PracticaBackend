import nodemailer from "nodemailer" 
import crypto from "crypto"
import jsonwebtoken from "jsonwebtoken"
import bcryptjs from "bcryptjs" //Encriptar contrasenas
import { config } from "../../config.js" 
import estudiantesModel from "../Models/estudiantes.js"



const recoveryPasswordController={}

recoveryPasswordController.requestCode = async (req, res) => {
    try {
        const {email} = req.body
    
        //Validar que el correo exista 
        const userFound = await estudiantesModel.findOne({email})


        if (!userFound) {
            return res.status(404).json({message: "User not found"})
        }
    

        //Generamos el codigo random

        const randomCode = crypto.randomBytes(3).toString("hex")
        //Guardamos el token
        const token = jsonwebtoken.sign(
            {email,randomCode,usertype: "estudiante", verified: "false"},
            config.JWT.secret,

            //Expiracion
            {expiresIn: "15m"}
        )

        res.cookie("recoveryCookie", token, {maxAge: 15*60*1000})
        

        //Quien lo envia
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: config.email.user_email,
                pass: config.email.user_password
            }
        })

        //Quien lo recibe y como 

        const mailoptions = {
            from: config.email.user_email,
            to: email,
            subject: "RECUPERACION DE CONTRASENA",
            text: "Tu codigo es: " +  randomCode + "vence en 15 minutos"
        }

        //Enviamos el correo

        transporter.sendMail(mailoptions,(error, info) => {
            if(error){
                console.log("error" + error)
                return res.status(500).json({message: "Error sending mail"})
            }

            return res.status(200).json({message: "Email sent"})
        })

    } catch (error) {
              console.log("error"+error)
        return res.status(500).json({message: "Internal server error"})
    }
}


recoveryPasswordController.verifyCode = async(req,res) => {
    try {
        const {code} = req.body

        //Accedemos a la cookie
        const token = req.cookies.recoveryCookie
        const decoded = jsonwebtoken.verify(token, config.JWT.secret)


        if(code !== decoded.randomCode) {
            return res.status(400).json({message: "Invalid code"})
        }

        //Si escribe bien el codigo 

        const newToken = jsonwebtoken.sign(
            //Lo que vamos a guardar 

            {email: decoded.email, userType: "estudiante", verified: true},

            //Secret key 

            config.JWT.secret,

            //Cuando expira
            {expiresIn: "15m"}
        )

        res.cookie("recoveryCookie", newToken, {maxAge: 15*60*1000})

        return res.status(200).json({message: "Code verified"})

    } catch (error) {
              console.log("error"+error)
        return res.status(500).json({message: "Internal server error"})
    }
}

recoveryPasswordController.newPassword = async (req,res) => {
    try {
        const {newPassword, confirmNewPassword} = req.body


        //Comparo las contrasenas
        if(newPassword !==  confirmNewPassword) {
            return res.status(400).json({message: "Password doesnt match"})
        }

        const token = req.cookies.recoveryCookie
        const decoded = jsonwebtoken.verify(token,config.JWT.secret)

        if(!decoded.verified){
            return res.status(400).json({message: "Code not verified"})
        }

        //Encriptamos

        const PasswordHash = await bcryptjs.hash(newPassword,10)


        //ACTUALIZAMOS

        await estudiantesModel.findOneAndUpdate(

            {email: decoded.email},
            {password: PasswordHash},
            {new: true}
        )

        res.clearCookie("recoveryCookie")
        return res.status(200).json({message: "Password updated"})

    } catch (error) {
           console.log("error"+error)
        return res.status(500).json({message: "Internal server error"})
    }
}


export default recoveryPasswordController;