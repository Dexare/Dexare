import * as path from 'path';
import * as fs from 'fs';

/**
 * Iterates through a folder and calls back on every .js found.
 * @param folder The path to check
 * @param callback The function to call on each file found
 * @param extension The extension to look for
 */
export async function iterateFolder(
  folder: string,
  callback: (path: string) => Promise<any>,
  extension = '.js'
): Promise<any> {
  const files = fs.readdirSync(folder);
  return Promise.all(
    files.map(async (file) => {
      const filePath = path.join(folder, file);
      const stat = fs.lstatSync(filePath);
      if (stat.isSymbolicLink()) {
        const realPath = fs.readlinkSync(filePath);
        if (stat.isFile() && file.endsWith(extension)) {
          return callback(realPath);
        } else if (stat.isDirectory()) {
          return iterateFolder(realPath, callback);
        }
      } else if (stat.isFile() && file.endsWith(extension)) return callback(filePath);
      else if (stat.isDirectory()) return iterateFolder(filePath, callback);
    })
  );
}

/**
 * Escapes a string from regex.
 * @param str The string to escape
 */
export function escapeRegex(str: string) {
  return str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
}

/**
 * Truncates string into a limit, appending an ellipsis when truncated.
 * @param text The text to truncate
 * @param limit The length to truncate at
 */
export function truncate(text: string, limit = 2000) {
  return text.length > limit ? text.slice(0, limit - 1) + '…' : text;
}
