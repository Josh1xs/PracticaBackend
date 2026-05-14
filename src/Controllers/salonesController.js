import Salon from "../models/salones.js";

// Creamos la constante del controlador arriba
const salonesCtrl = {};

salonesCtrl.getSalones = async (req, res) => {
    try {
        const salones = await Salon.find();
        res.status(200).json(salones);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los salones", error: error.message });
    }
};

salonesCtrl.createSalon = async (req, res) => {
    const { code, building, level, maxCapacity, hasProjector } = req.body;

    if (!code) {
        return res.status(400).json({ message: "El código del salón (ej: A-1) es obligatorio" });
    }

    try {
        const nuevoSalon = new Salon({
            code,
            building,
            level,
            maxCapacity,
            hasProjector
        });

        await nuevoSalon.save();
        res.status(201).json({ message: "Salón registrado con éxito", nuevoSalon });
    } catch (error) {
        res.status(400).json({ message: "Error al registrar el salón", error: error.message });
    }
};

salonesCtrl.updateSalon = async (req, res) => {
    const { id } = req.params;
    const { code, building, level, maxCapacity, hasProjector } = req.body;

    try {
        const salonActualizado = await Salon.findByIdAndUpdate(
            id,
            { code, building, level, maxCapacity, hasProjector },
            { new: true }
        );

        if (!salonActualizado) return res.status(404).json({ message: "Salón no encontrado" });

        res.status(200).json({ message: "Información del salón actualizada", salonActualizado });
    } catch (error) {
        res.status(400).json({ message: "Error al editar salón", error: error.message });
    }
};

salonesCtrl.deleteSalon = async (req, res) => {
    try {
        const { id } = req.params;
        await Salon.findByIdAndDelete(id);
        res.status(200).json({ message: "Salón eliminado del sistema" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar salón", error: error.message });
    }
};

// Exportamos la constante al final
export default salonesCtrl;