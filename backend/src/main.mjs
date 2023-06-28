import express from "express"
import cors from "cors"

const app = express()
app.use(cors())

function intermediarioDeAutorizacion(peticion, resposta, seguinteIntermediario){
    JSON.parse(peticion.headers.authorization.split(" ")[1])
}

app.get('/chat', async function(req, res) {
    /**
     * Los encabezados Content-Type y Connection son los que consiguen que
     * este endpoint pueda servir como una fuente de SSE.
     * 'Connection': 'keep-alive' indica al navegador que no se desconecte tras la peticion.
     * 'Content-Type': 'text/event-stream' informa al navegador que se trata de una fuente SSE.
     * La caché es desactivada porque no tiene sentido en este tipo de conexión.
     */
    res.set({
        'Cache-Control': 'no-cache',
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive'
    });
    res.flushHeaders(); //Fuerza el envío inmediato al navegador de los encabezados anteriores.
});

app.listen( process.env.PORT ?? 8000, ()=>{
    console.log("Funcionando...");
} )

export {
    app
}