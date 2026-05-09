import mongoose, { disconnect }  from "mongoose";

mongoose.connect("mongodb://localhost:27017/Escuela")

const connection = mongoose.connection

connection.on("open", () => {
console.log("Base de datos conectada")
})

connection.on(disconnect,  () => {
    console.log("Base de datos desconectada")
})

connection.on("error", (error)=> {
    console.log("Error en la conexion a la base de datos")
})