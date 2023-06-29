/** @typedef {import("express").Response} Response */
/** @typedef {import("./defines.mjs").EnvioNovaMensaxe} EnvioNovaMensaxe*/
/** @typedef {import("./defines.mjs").Mensaxe} Mensaxe*/
/** @typedef {Map<Number, Response>} DirectorioDeClientes*/

/** @type {DirectorioDeClientes} */
const clientesSSE = new Map()

/**
 * Envía encabezados HTTP para SSE
 * @param {Response} resposta
 */
function enviarEncabezadosSSE(resposta){
    resposta.writeHead(
        200,
        {
            'Cache-Control': 'no-cache', // Opcional
            'Content-Type': 'text/event-stream',
            'Connection': 'keep-alive'
        }
    )
}

/**
 * Envía un evento de un tipo dado sobre una conexión establecida
 * https://developer.mozilla.org/es/docs/Web/API/Server-sent_events/Using_server-sent_events#ejemplos
 * @param {String} nomeDoEvento 
 * @param {String} datos 
 * @param {import("express").Response} obxetoDeResposta 
 */
function enviarEvento(nomeDoEvento, datos, obxetoDeResposta){
    obxetoDeResposta.write(`event: ${nomeDoEvento}\n`)
    obxetoDeResposta.write(`data: ${datos}\n\n`)
}

/**
 * Mantén un directorio dos obxetos de resposta das conexións
 * Emprega clientesSSE coma un closure
 * @param {Number} idUsuario
 * @param {Response} obxetoDeResposta
 */
function rexistraCliente(idUsuario, obxetoDeResposta) {
    clientesSSE.set(idUsuario, obxetoDeResposta)
    obxetoDeResposta.on("close",()=>{clientesSSE.delete(idUsuario)})
}

/**
 * Recupera o obxeto resposta de un cliente
 * Emprega clientesSSE coma un closure
 * @param {Number} idUsuario
 */
function recuperaConexionDoCliente(idUsuario) {
    return clientesSSE.get(idUsuario)
}

/**
 * Construe mensaxe a partir do envío dunha nova mensaxe.
 * @param {EnvioNovaMensaxe} envioNovaMensaxe
 * @returns {Mensaxe}
 */
function construeMensaxeDesdeEnvio(envioNovaMensaxe) {
    return {
        remitente: envioNovaMensaxe.id,
        destinatario: envioNovaMensaxe.mensaxe.destinatario,
        contido: envioNovaMensaxe.mensaxe.contido
    }
}

export {
    enviarEncabezadosSSE,
    enviarEvento,
    rexistraCliente,
    recuperaConexionDoCliente,
    construeMensaxeDesdeEnvio
}