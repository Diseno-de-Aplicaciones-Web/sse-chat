/**
 * Envía un evento de un tipo dado sobre una conexión establecida
 * @param {String} nomeDoEvento 
 * @param {String} datos 
 * @param {import("express").Response} obxetoDeResposta 
 */
function enviarEvento(nomeDoEvento, datos, obxetoDeResposta){
    obxetoDeResposta.write(`${nomeDoEvento}: ${datos}\n\n`)
}

/**
 * Mantense enviando eventos valeiros periódicamente
 * para evitar que o navegador peche a conexión por inactividade.
 * @param {Number} intervalo - Tempo en milisegundos
 * @param {import("express").Response} obxetoDeResposta 
 */
function manterConectado(intervalo, obxetoDeResposta) {
    setTimeout(
        ()=>{
            obxetoDeResposta.write(":📢\n\n")
            if ( ! obxetoDeResposta.closed ) manterConectado(intervalo, obxetoDeResposta)
        }
        , intervalo
    ) 
}

export {
    enviarEvento,
    manterConectado
}