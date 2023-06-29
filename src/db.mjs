import { DataTypes, Sequelize } from "sequelize"

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite'
});

/* const Usuario = sequelize.define("Usuario", {
    nome: DataTypes.STRING,
    contrasinal: DataTypes.STRING
})

const Mensaxes = sequelize.define("Mensaxes",{
    contido:  DataTypes.STRING
})

Usuario.hasMany(Mensaxes, { as: "enviado", foreignKey: "remitente"})
Usuario.hasMany(Mensaxes, { as: "recivido", foreignKey: "destinatario"})
Mensaxes.belongsTo(Usuario, { foreignKey: "destinatario"})
Mensaxes.belongsTo(Usuario, { foreignKey: "remitente"}) */

/**
 * Versión simplificada dos modelos, evitando empregar usuarios reais
 */
const Mensaxes = sequelize.define("Mensaxes",{
    contido:  DataTypes.STRING,
    remitente: DataTypes.NUMBER,
    destinatario: DataTypes.NUMBER
})


sequelize.sync({alter: true})

export {
    //Usuario,
    Mensaxes
}