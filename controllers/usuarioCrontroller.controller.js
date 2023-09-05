import generarId from "../helpers/generarId.js"
import generarJWT from "../helpers/generarJWT.js"
import Usuario from "../models/Usuario.model.js"

const registrar = async (req, res) => {

    //Evitar registro duplicado

    const { email } = req.body //extraemos el email.

    const existeUsuario = await Usuario.findOne({ email }) // con findOne verificamos si el email ya esta en la DB.

    if (existeUsuario) { //Existe usuario?
        const error = new Error("Usuario ya registrado")// Creamos un error.
        return res.status(400).json({ msg: error.message }) //Mandamos un error de que ya esta registrado.
    }

    try {

        const usuario = new Usuario(req.body) //Creo una nueva instancia de Usuario con los valores de req.body.
        usuario.token = generarId()
        const usuarioAlmacenado = await usuario.save() //Guardo el nuevo usuario.

        res.json(usuarioAlmacenado) //Respondo con un .json() con el nuevo usuario.

    } catch (error) {
        console.log(error)
    }
}

const autenticar = async (req, res) => {

    const { email, password } = req.body
    //Comprobar que usuario existe  
    const usuario = await Usuario.findOne({ email })

    if (!usuario) {
        const error = new Error("El usuario no existe")
        return res.status(404).json({ msg: error.message })
    }

    //Comprobar si el usuario esta confirmado

    if (!usuario.confirmado) {
        const error = new Error("Tu cuenta no ha sido confirmada")
        return res.status(403).json({ msg: error.message })
    }

    //Comprobar su password
    if (await usuario.comprobarPassword(password)) {
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario._id)
        })
    } else {
        const error = new Error("El password es incorrecto")
        return res.status(403).json({ msg: error.message })
    }
}

const confirmar = async (req, res) => {
    const { token } = req.params
    const usuarioConfirmado = await Usuario.findOne({ token })

    if (!usuarioConfirmado) {
        const error = new Error("Token no valido")
        return res.status(403).json({ msg: error.message })
    }

    try {

        usuarioConfirmado.confirmado = true
        usuarioConfirmado.token = ""

        await usuarioConfirmado.save()

        res.json({ msg: "Usuario confirmado correctamente" })

    } catch (error) {
        console.log(error)
    }
}

export {
    registrar,
    autenticar,
    confirmar
}