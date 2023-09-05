import mongoose from "mongoose";

const conectarDB = async () => {
    try {
        const connnection = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })

        const url = `${connnection.connection.host} : ${connnection.connection.port}`

        console.log(`Mongo db esta conectado a: ${url}`)

    } catch (error) {
        console.log(`Error: ${error}`)
        process.exit(1)
    }
}

export default conectarDB