import express from "express"
import cors from "cors"
import { Op } from "sequelize"

import { Mensaxes } from "./db.mjs"
import { enviarEvento } from "./lib/sse.mjs"

const app = express()
app.use(cors())

/** Lista de clientes conectados */
const clientesSSE = new Map()

app.get('/chat/:idUsuario', async (peticion, resposta)=>{
    /**
     * Necesitamos enviar respuestas individualizadas a los diferentes usuarios que
     * se conectan, así que hemos de mantener un directorio de los diferentes usuarios
     * el objeto de respuesta correspondiente a cada uno de ellos.
     */ 
    const idUsuario = Number(peticion.params.idUsuario) // Esto non é xeito, deberíamos coller o id dun JWT
    clientesSSE.set(idUsuario, resposta)
    /** Se se pecha a conexión, eliminamos a resposta da lista de clientes */
    resposta.on("close",()=>{clientesSSE.delete(idUsuario)})
    /** 
     * Enviamos los encabezados de la respuesta al cliente
     * Los encabezados Content-Type y Connection son los que consiguen que
     * este endpoint pueda servir como una fuente de SSE.
     * 'Connection': 'keep-alive' indica al navegador que no se desconecte tras la peticion.
     * 'Content-Type': 'text/event-stream' informa al navegador que se trata de una fuente SSE.
     * La caché es desactivada porque no tiene sentido en este tipo de conexión.
     */
    resposta.writeHead(
        200,
        {
            'Cache-Control': 'no-cache', // Opcional
            'Content-Type': 'text/event-stream',
            'Connection': 'keep-alive'
        }
    )
    /**
     * Agora entregamos as mensaxes que implican ó usuario, obtidas da base de datos.
     */
    const mensaxes = await Mensaxes.findAll({
        where: { [Op.or]: [{remitente: idUsuario},{destinatario: idUsuario}] }
    })
    enviarEvento("mensaxes-previas",JSON.stringify(mensaxes), resposta)
});

app.post("/chat", express.json(), (peticion, resposta)=>{
    /** @type {import("./lib/defines.mjs").Envio} */
    const envio = peticion.body
    const conexionDestinatario = clientesSSE.get(envio.mensaxe.destinatario)
    /** @type {import("./lib/defines.mjs").Mensaxe} */
    const mensaxe = {
        remitente: envio.id,
        destinatario: envio.mensaxe.destinatario,
        contido: envio.mensaxe.contido
    }
    Mensaxes.create(mensaxe)
    if ( conexionDestinatario ) {
        enviarEvento("nova-mensaxe", JSON.stringify(mensaxe), conexionDestinatario)
    }
    resposta.sendStatus(200)
})

/** Sirve el frontend */
app.use(express.static('./src/static'))

app.listen( process.env.PORT ?? 8000, ()=>{
    console.log("Funcionando...");
} )