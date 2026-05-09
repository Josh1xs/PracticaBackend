const EstudianteController = {}

import EstudiantesModel from "../Models/Estudiantes.js"

EstudianteController.getEstudiantes = async (req, res) => {
    try {
        const estudiantes = await EstudiantesModel.find()
        return res.status(200).json(estudiantes)
    } catch (error) {   
        console.log("error"+error)
        return res.status(500).json({message: "Internal server error"})
    }
}

EstudianteController.putEstudiantes = async (req, res) => {
    try {
        let {
            name, 
            lastname,
            email,
            password,
            isVerified
        } = req.body

        //VALIDAMOS
        name = name?.trim()
        email = email?.trim()

        if (!name || !email || !password){
            return res.status(400).json({message: "Fields required"})
        }

        if (name.lengh < 3 || name.lengh > 20){
            return res.status(400).json({message: "Please insert a valid name"})
        }

        //Actualizamos 
        const putEstudiantes = await EstudiantesModel.findByIdAndUpdate(req.params.id,{
              name, 
            lastname,
            email,
            password,
            isVerified,
        },{new: true},
    )

    if (!putEstudiantes){
        return res.status(400).json({message: "Student not found"})
    }
    } catch (error) {
         console.log("error"+error)
        return res.status(500).json({message: "Internal server error"})
    }
}

//Eliminar
EstudianteController.deleteEstudiantes = async (req, res) => {
    try {
        const deleteEstudiantes = EstudiantesModel.findByIdAndDelete(req.params.id)

        if (!deleteEstudiantes){
            return res.status(400).json({message: "Not Found"})
        }
        return res.status(200).json({message: "Deleted"})
    } catch (error) {
         console.log("error"+error)
        return res.status(500).json({message: "Internal server error"})
    }
}

export default EstudianteController;