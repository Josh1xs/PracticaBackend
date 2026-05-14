import Laboratorio from "../models/laboratorios.js";

const laboratoriosCtrl = {};

laboratoriosCtrl.getLaboratorios = async (req, res) => {
    try {
        const laboratorios = await Laboratorio.find().populate("encargado", "name lastName email");
        res.status(200).json(laboratorios);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los laboratorios", error: error.message });
    }
};

laboratoriosCtrl.createLaboratorio = async (req, res) => {
    const { name, description, capacity, encargado, status } = req.body;

    if (!name) {
        return res.status(400).json({ message: "El nombre del laboratorio es obligatorio" });
    }

    try {
        const nuevoLaboratorio = new Laboratorio({
            name,
            description,
            capacity,
            encargado,
            status
        });

        await nuevoLaboratorio.save();
        res.status(201).json({ message: "Laboratorio creado", nuevoLaboratorio });
    } catch (error) {
        res.status(400).json({ message: "Error al crear el laboratorio", error: error.message });
    }
};

laboratoriosCtrl.updateLaboratorio = async (req, res) => {
    const { id } = req.params;
    const { name, description, capacity, encargado, status } = req.body;

    try {
        const laboratorioActualizado = await Laboratorio.findByIdAndUpdate(
            id, 
            { name, description, capacity, encargado, status }, 
            { new: true }
        );
        
        if (!laboratorioActualizado) return res.status(404).json({ message: "Laboratorio no encontrado" });
        
        res.status(200).json({ message: "Laboratorio actualizado", laboratorioActualizado });
    } catch (error) {
        res.status(400).json({ message: "Error al actualizar", error: error.message });
    }
};

laboratoriosCtrl.deleteLaboratorio = async (req, res) => {
    try {
        const { id } = req.params;
        await Laboratorio.findByIdAndDelete(id);
        res.status(200).json({ message: "Laboratorio eliminado" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar", error: error.message });
    }
};

// Exportamos la constante al final
export default laboratoriosCtrl;