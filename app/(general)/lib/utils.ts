/**
 * ## getFormattedTimestamp
 * ---
 * Gets the time and formats it in HH:MM:SS. Useful for logging.
 * @returns Timestamp in  HH:MM:SS format.
 */

export function getFormattedTimestamp() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

/**
 * ## logError
 * ---
 * Logs an error to the console of where it's executed (client or server).
 */

export function logError( message: any ) {
    const timestamp = getFormattedTimestamp();
    console.error(`[${timestamp}] [ERR] ${message}`)
}

/**
 * ## logWarning
 * ---
 * Logs a warning to the console of where it's executed (client or server).
 */

export function logWarning( message: any ) {
    const timestamp = getFormattedTimestamp();
    console.warn(`[${timestamp}] [WARN] ${message}`)
}

/**
 * ## logMessage
 * ---
 * Logs a warning to the console of where it's executed (client or server).
 */

export function logMessage( message: any ) {
    const timestamp = getFormattedTimestamp();
    console.log(`[${timestamp}] [INF] ${message}`)
}