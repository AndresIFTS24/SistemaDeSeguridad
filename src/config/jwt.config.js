require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';

if (!JWT_SECRET) {
    console.error('❌ FALTA JWT_SECRET EN LAS VARIABLES DE ENTORNO.');
    throw new Error('JWT_SECRET no está definido. Revisá tu configuración de entorno.');
}

module.exports = { JWT_SECRET, JWT_EXPIRES_IN };
