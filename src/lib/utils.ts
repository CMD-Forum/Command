import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * ## getFormattedTimestamp
 * ---
 * Gets the time and formats it in HH:MM:SS. Useful for logging.
 * @returns Timestamp in  HH:MM:SS format.
 */

export function getFormattedTimestamp() {
  const NOW = new Date();
  const HOURS = NOW.getHours().toString().padStart(2, "0");
  const MINUTES = NOW.getMinutes().toString().padStart(2, "0");
  const SECONDS = NOW.getSeconds().toString().padStart(2, "0");
  return `${HOURS}:${MINUTES}:${SECONDS}`;
}

/**
* ## legacy_logError
* ---
* Logs an error to the console of where it"s executed (client or server).
* @deprecated
*/

export function legacy_logError( message: unknown, bold?: boolean, scope?: string ) {
  const TIMESTAMP = getFormattedTimestamp();
  console.error(
      `%c[${TIMESTAMP}] [ERR]${scope ? `[${scope}]` : ""} ${message}` +
      `${bold === true ? "\n": ""}`,
      `${bold === true ? "font-weight:bold" : ""}`
  );
}

/**
* ## legacy_logWarning
* ---
* Logs a warning to the console of where it"s executed (client or server).
* @deprecated
*/

export function legacy_logWarning( message: unknown, bold?: boolean, scope?: string ) {
  const TIMESTAMP = getFormattedTimestamp();
  console.warn(
      `%c[${TIMESTAMP}] [WRN]${scope ? `[${scope}]` : ""} ${message}` +
      `${bold === true ? "\n": ""}`,
      `${bold === true ? "font-weight:bold" : ""}`
  );
}

/**
* ## legacy_logMessage
* ---
* Logs a warning to the console of where it"s executed (client or server).
* @deprecated
*/

export function legacy_logMessage( message: unknown, bold?: boolean, scope?: string ) {
  const TIMESTAMP = getFormattedTimestamp();
  console.log(
      `%c[${TIMESTAMP}] [INF]${scope ? `[${scope}]` : ""} ${message}` +
      `${bold === true ? "\n": ""}`,
      `${bold === true ? "font-weight:bold" : ""}`
  );
}

/**
* ## log
* ---
* Logs an error to the console of either the server or client, depending on where it's executed.
* @param {unknown} message The message you want to log to the console. Can be anything that's printable.
* @param {"error" | "warning" | "message"} type The type of log. Can be `error`, `warning`, 
*/

export type LogType = "error" | "warning" | "message" | "info" | "table" | "assert";

export function log({ 
  message,
  type,
  bold, 
  scope
}: { 
  message: unknown;
  type: LogType;
  bold?: boolean;
  scope?: string;
}) {
  const TIMESTAMP = getFormattedTimestamp();

  const MSG_MAP = {
      error: "ERR",
      warning: "WRN",
      message: "MSG",
      info: "INF",
      table: "TBL",
      assert: "AST"
  }
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, no-unused-vars
  const FUNC_MAP: Record<LogType, (...data: any[]) => void> = {
      error: console.error,
      warning: console.warn,
      message: console.log,
      info: console.info,
      table: console.table,
      assert: console.assert
  }

  if (!FUNC_MAP[type]) {
      console.warn(`%c [${TIMESTAMP}] [WRN] [utils.ts > func: log] Unexpected log type: ${type}`);
      return;
  }

  FUNC_MAP[type](
      `%c[${TIMESTAMP}] [${MSG_MAP[type]}] ${scope ? `[${scope}]` : ""} ${message}` +
      `${bold ? "\n": ""}`,
      `${bold ? "font-weight:bold" : ""}`
  );
}