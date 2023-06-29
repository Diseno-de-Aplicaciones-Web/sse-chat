/** @typedef {import("./lib/defines.mjs").ManexadorEventoSSE} ManexadorEventoSSE */
/** @typedef {import("./lib/defines.mjs").EnvioNovaMensaxe} EnvioNovaMensaxe */
/** @typedef {import("./lib/defines.mjs").Mensaxe} Mensaxe */

import { construeMensaxeDesdeEnvio }  from "./lib/sse.mjs"

// Obtemos elementos de DOM
const form = document.querySelector("form")
const button = document.querySelector("button")
/** @type {HTMLInputElement} */
const inputRemitente = document.querySelector("input[name='remitente']")
/** @type {HTMLInputElement} */
const inputDestinatario = document.querySelector("input[name='destinatario']")
const inputMensaxe = document.querySelector("textarea")
const div = document.querySelector("div#mensaxes")

/** @type {Mensaxe[]} */
let mensaxes = []

/** @type {EventSource} */
let fonteSSE

/** @param {Event} evento */
async function manexadorEnviar(evento) {

    evento.preventDefault()

    /** @type {EnvioNovaMensaxe} */
    const envio = {
        id: Number(inputRemitente.value),
        mensaxe: {
            destinatario: Number(inputDestinatario.value),
            contido: inputMensaxe.value
        }
    }

    const resposta = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-type": "application/json"},
        body: JSON.stringify(envio)
    })

    if ( resposta.ok ) {
        const mensaxeEnviada = construeMensaxeDesdeEnvio(envio)
        mensaxes.push(mensaxeEnviada)
        renderizaMensaxes(mensaxes)
    } else {
        alert("Non se puido entregar a mensaxe.")
    }

}

function manexadorCambioRemitente() {
    if (fonteSSE) fonteSSE.close()
    fonteSSE = new EventSource("http://localhost:8000/chat/"+inputRemitente.value)
    fonteSSE.addEventListener("mensaxes-previas", menxadorMensaxesPrevias)
    fonteSSE.addEventListener("nova-mensaxe", menxadorNovasMensaxes)
}

/** @param {Mensaxe[]} mensaxes */
function renderizaMensaxes(mensaxes) {
    div.innerHTML=""
    for ( let mensaxe of mensaxes ) {
        const mensaxeHTML = document.createElement("p")
        const prompt = mensaxe.remitente === Number(inputRemitente.value) ? ">" : "<"
        mensaxeHTML.innerHTML = `${prompt} ${mensaxe.remitente}: ${mensaxe.contido} `
        div.appendChild(mensaxeHTML)
    }
}

/** @type {ManexadorEventoSSE} */
function menxadorMensaxesPrevias(evento) {
    mensaxes = JSON.parse(evento.data)
    renderizaMensaxes(mensaxes)
}

/** @type {ManexadorEventoSSE} */
function menxadorNovasMensaxes(evento) {
    mensaxes.push(JSON.parse(evento.data))
    renderizaMensaxes(mensaxes)
}

// Asigna manexadores a eventos de obxetos do DOM
button.addEventListener("click", manexadorEnviar)
inputRemitente.addEventListener("input", manexadorCambioRemitente)