import mongoose from "mongoose";
import bcrypt from "bcrypt"

const usuarioSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    token: {
        type: String
    },
    confirmado: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true //Crea 2 columnas más "Creado / Actualizado"
})

//hashear password con 'bcrypt' se ejecuta antes de guardar el registro en la DB.

usuarioSchema.pre("save", async function (next) { //Usamos function para hacer referencia a .this

    //revisa que el password no haya sido cambiado 'haseahdo'
    if (!this.isModified("password")) { //isModified es una funcion de mongoose
        next() //el next hace que pase de largo, salta de etapa en etapa.
    }

    const salt = await bcrypt.genSalt(10)// salt genera un operacion para crear un hash (10) es un buen valor.
    this.password = await bcrypt.hash(this.password, salt)//this.password hace referencia al obj del usuario. bcrypt.hash toma 2 valores: el string que vamos a hashear y el salt. con esto genera el password hasheado.
})

usuarioSchema.methods.comprobarPassword = async function (passwordFormulario) {
    return await bcrypt.compare(passwordFormulario, this.password)
}

const Usuario = mongoose.model("Usuario", usuarioSchema)

export default Usuario