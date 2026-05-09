const MaestrosController = {}

import maestrosModel from "../Models/maestros.js"

MaestrosController.getMaestros = async (req, res) => {
    try {
        const maestros = await maestrosModel.find()
        return res.status(200).json(maestros)
    } catch (error) {
        console.log("error"+error)
        return res.status(500).json({message: "Internal server error"})
    }
}

MaestrosController.putMaestros = async (req, res) => {
    try {
        let {
           name,
           lastName,
           email,
           password,
            isVerified
        } = req.body

        //Sanitizamos

        name = name?.trim()
        email = email?.trim()

        //Validamos

        if (!name  || !email || !password){
            return res.status(400).json({message: "Fields required"})
        }

        
        if (name.lengh < 3 || name.lengh > 20){
            return res.status(400).json({message: "Please insert a valid name"})
        }

         const putMaestros = await EstudiantesModel.findByIdAndUpdate(req.params.id,{
                      name, 
                    lastname,
                    email,
                    password,
                    isVerified,
                },{new: true},
            )

            if (!putMaestros){
                return res.status(400).json({message: "Teacher not found"})
            }
    } catch (error) {
         console.log("error"+error)
        return res.status(500).json({message: "Internal server error"})
    }
}

MaestrosController.deleteMaestros = async (req, res) => {
    try {
         const deleteMaestros = EstudiantesModel.findByIdAndDelete(req.params.id)
        
                if (!deleteMaestros){
                    return res.status(400).json({message: "Not Found"})
                }
    } catch (error) {
         console.log("error"+error)
        return res.status(500).json({message: "Internal server error"})
    }
}

export default MaestrosController;