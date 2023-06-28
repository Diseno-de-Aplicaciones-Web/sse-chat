import express from "express"
import cors from "cors"

const app = express()
app.use(cors())

const clientesSSE = new Map()

app.get('/chat', (peticion, resposta)=>{
    /**
     * Necesitamos enviar respuestas individualizadas a los diferentes usuarios que
     * se conectan, así que hemos de mantener un directorio de los diferentes usuarios
     * el objeto de respuesta correspondiente a cada uno de ellos.
     */ 
    const idUsuario = peticion.body.id
    clientesSSE.set(idUsuario, resposta)
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
            'Cache-Control': 'no-cache',
            'Content-Type': 'text/event-stream',
            'Connection': 'keep-alive'
        }
    )
});

app.get("/chat", )

app.listen( process.env.PORT ?? 8000, ()=>{
    console.log("Funcionando...");
} )

export {
    app
}