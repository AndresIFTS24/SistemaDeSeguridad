// src/utils/errorHandler.js (CREAR ESTE ARCHIVO)

const handleError = (res, error, defaultMessage = 'Ocurrió un error inesperado.') => {
    // Intenta obtener el código de estado del objeto 'cause' (si usaste { cause: 400 })
    const statusCode = error.cause || 500; 
    const message = error.message || defaultMessage;

    console.error(`[Error ${statusCode}] ${message}`, error);

    res.status(statusCode).json({
        message: message,
        error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
};

module.exports = handleError;