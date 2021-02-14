/**
 * Iterates through a folder and calls back on every .js found.
 * @param folder The path to check
 * @param callback The function to call on each file found
 */
export declare function iterateFolder(folder: string, callback: (path: string) => Promise<any>): Promise<any>;
export declare function escapeRegex(str: string): string;
export declare function truncate(text: string, limit?: number): string;
