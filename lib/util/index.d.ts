/**
 * Iterates through a folder and calls back on every .js found.
 * @param folder The path to check
 * @param callback The function to call on each file found
 * @param extension The extension to look for
 */
export declare function iterateFolder(folder: string, callback: (path: string) => Promise<any>, extension?: string): Promise<any>;
/**
 * Escapes a string from regex.
 * @param str The string to escape
 */
export declare function escapeRegex(str: string): string;
/**
 * Truncates string into a limit, appending an ellipsis when truncated.
 * @param text The text to truncate
 * @param limit The length to truncate at
 */
export declare function truncate(text: string, limit?: number): string;
