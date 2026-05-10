import nodemailer from "nodemailer" 
import crypto from "crypto"
import jsonwebtoken from "jsonwebtoken"
import bcryptjs from "bcryptjs" //Encriptar contrasenas
import { config } from "../../config.js" 
import maestrosModel from "../Models/maestros.js"
import { info } from "console"

const RegisterMaestroController = {}


RegisterMaestroController.register = async(req,res) => {
    try {
        
        const {name,lastname,email,password,isVerified, timeOut} = req.body

        const existMaestro  = await maestrosModel.findOne({email})

        if(existMaestro){
            return res.status(400).json({message: "Maestro already exist"})
        }

        //Encriptamos la contrasena

        const PasswordHashed = await bcryptjs.hash(password,12)

        //Generamos el codigo random

        const randomCode = crypto.randomBytes(3).toString("hex")

        //Guadarmos un token
        const token = jsonwebtoken.sign(
            //Lo que vamos a guardar 
            {randomCode,name,lastname,email,password: PasswordHashed, isVerified,timeOut},

            //Secret key 
            config.JWT.secret,
            //Expiracion del token
            {expiresIn: "10m"}
        )

        //Guardamos el token 
         res.cookie("registrationCookie",token, {maxAge: 15 * 60 *1000})


         //Enviamos el correo
         const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: config.email.user_email,
                pass: config.email.user_password
            }
         })

         //Quien lo va recibir 

         const mailoptions = {
            from: config.email.user_email,
            to: email,
            subject: "Verificacion de cuenta",
            text:  "Para verificar tu cuenta, utiliza este codigo:" + "" + randomCode + "expiran en 15 minutos" 
         }

         //Enviamos el correo

         transporter.sendMail(mailoptions, (error,info) => {
            if(error){
                console.log("error" + error)
                return res.status(400).json({message: "Error sending email"})
            }
            return res.status(200).json({message: "Email sent"})
         })  



    } catch (error) {
          console.log("error"+error)
        return res.status(500).json({message: "Internal server error"})
    }
}

RegisterMaestroController.verifyCode = async (req,res) => {
    try {

      const {verificationCodeRequest} = req.body
         
     const token = req.cookies.registrationCookie

      const decoded = jsonwebtoken.verify(token, config.JWT.secret)
          

           const {
        randomCode: storedCode,
        name,lastname,email,password,isVerified, timeOut
    } = decoded;

      if (verificationCodeRequest !== storedCode){
            return res.status(400).json({message: "Invalid code"})
        }

        const newMaestro = maestrosModel({
            name,lastname,email,password,isVerified:true,
        });

        await newMaestro.save();

        res.clearCookie("registrationCookie")

        return res.status(200).json({message: "Maestro registred"})

    } catch (error) {
         console.log("error"+error)
        return res.status(500).json({message: "Internal server error"})
    }
}

export default RegisterMaestroController;