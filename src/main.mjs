/** @typedef {import("./static/lib/defines.mjs").EnvioNovaMensaxe} EnvioNovaMensaxe */
/** @typedef {import("./static/lib/defines.mjs").Mensaxe} Mensaxe */

import express from "express"
import cors from "cors"
import { Op } from "sequelize"

import { Mensaxes } from "./db.mjs"
import {
    construeMensaxeDesdeEnvio,
    enviarEncabezadosSSE,
    enviarEvento,
    recuperaConexionDoCliente,
    rexistraCliente
} from "./static/lib/sse.mjs"

const app = express()
app.use(cors())

/** Lista de clientes conectados */
const clientesSSE = new Map()

app.get('/chat/:idUsuario', async (peticion, resposta)=>{

    // Indica ó navegador que permaneza á escoita de eventos
    enviarEncabezadosSSE(resposta)
    // Almacenamos o obxeto resposta para cada nova conexión
    const idUsuario = Number(peticion.params.idUsuario) // Esto non é xeito, deberíamos coller o id dun JWT
    rexistraCliente(idUsuario, resposta)

    // Enviar mensaxes existentes na base de datos
    const mensaxes = await Mensaxes.findAll({
        where: { [Op.or]: [{remitente: idUsuario},{destinatario: idUsuario}] }
    })
    enviarEvento("mensaxes-previas",JSON.stringify(mensaxes), resposta)

});

app.post("/chat", express.json(), async (peticion, resposta)=>{

    /** @type {EnvioNovaMensaxe} */
    const envio = peticion.body

    const mensaxe = construeMensaxeDesdeEnvio(envio)

    const promesaDB = Mensaxes.create(mensaxe)

    const conexionDestinatario = recuperaConexionDoCliente(envio.mensaxe.destinatario)    
    if ( conexionDestinatario ) {
        enviarEvento("nova-mensaxe", JSON.stringify(mensaxe), conexionDestinatario)
    }

    await promesaDB // Esperamos a que os datos estén na base de datos

    resposta.sendStatus(200)

})

/** Proporciona acceso ós arquivos do frontend */
app.use(express.static('./src/static'))

app.listen( process.env.PORT ?? 8000, ()=>{
    console.log("Funcionando...");
} )