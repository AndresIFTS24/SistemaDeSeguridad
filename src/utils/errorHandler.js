// src/utils/errorHandler.js (CREAR ESTE ARCHIVO)

const handleError = (res, error, defaultMessage = 'Ocurrió un error inesperado.') => {
    // Intenta obtener el código de estado del objeto 'cause' (si usaste { cause: 400 })
    const statusCode = error.cause || 500;
    const isDev = process.env.NODE_ENV === 'development';

    // Los errores 4xx son lanzados a propósito por los Services con un mensaje
    // pensado para el cliente. Los 500 son inesperados (fallas de driver, bugs,
    // etc.) y solo deben mostrar detalle real en desarrollo.
    const message = statusCode === 500 && !isDev ? defaultMessage : (error.message || defaultMessage);

    console.error(`[Error ${statusCode}] ${error.message}`, error);

    res.status(statusCode).json({
        message: message,
        error: isDev ? error.message : undefined
    });
};

module.exports = handleError;