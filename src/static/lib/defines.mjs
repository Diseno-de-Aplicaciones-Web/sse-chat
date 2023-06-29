/**
 * @typedef Mensaxe
 * @type {Object}
 * @prop {Number} remitente
 * @prop {Number} destinatario
 * @prop {String} contido
 */

/**
 * @typedef NovaMensaxe
 * @type {Object}
 * @prop {Number} destinatario
 * @prop {String} contido
 */

/**
 * @typedef EnvioNovaMensaxe
 * @type {Object}
 * @prop {Number} id - Id do remitente
 * @prop {NovaMensaxe} mensaxe
 */

/**
 * @callback ManexadorEventoSSE
 * @param {MessageEvent} evento
 * @returns {void}
 */