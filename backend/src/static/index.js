const form = document.querySelector("form")
const button = document.querySelector("button")
/** @type {HTMLInputElement} */
const inputRemitente = document.querySelector("input[name='remitente']")
/** @type {HTMLInputElement} */
const inputDestinatario = document.querySelector("input[name='destinatario']")
const inputMensaxe = document.querySelector("textarea")
const div = document.querySelector("div#mensaxes")

/** @type {import("../lib/defines.mjs").Mensaxe[]} */
let mensaxes = []

/** @type {EventSource} */
let fonteSSE

/** @param {Event} evento */
async function manexadorEnviar(evento) {

    evento.preventDefault()

    /** @type {import("../lib/defines.mjs").Envio} */
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
        /** @type {import("../lib/defines.mjs").Mensaxe} */
        const mensaxeEnviada = {
            remitente: envio.id,
            destinatario: envio.mensaxe.destinatario,
            contido: envio.mensaxe.contido
        }
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

/** @param {import("../lib/defines.mjs").Mensaxe[]} mensaxes */
function renderizaMensaxes(mensaxes) {
    div.innerHTML=""
    for ( let mensaxe of mensaxes ) {
        const mensaxeHTML = document.createElement("p")
        const prompt = mensaxe.remitente === Number(inputRemitente.value) ? ">" : "<"
        mensaxeHTML.innerHTML = `${prompt} ${mensaxe.remitente}: ${mensaxe.contido} `
        div.appendChild(mensaxeHTML)
    }
}

/** @type {import("../lib/defines.mjs").ManexadorEventoSSE} */
function menxadorMensaxesPrevias(evento) {
    console.log(evento.type)
    mensaxes = JSON.parse(evento.data)
    renderizaMensaxes(mensaxes)
}

/** @type {import("../lib/defines.mjs").ManexadorEventoSSE} */
function menxadorNovasMensaxes(evento) {
    console.log(evento.type)
    mensaxes.push(JSON.parse(evento.data))
    renderizaMensaxes(mensaxes)
}

button.addEventListener("click", manexadorEnviar)
inputRemitente.addEventListener("input", manexadorCambioRemitente)