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

export {
    enviarEvento
}