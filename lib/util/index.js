"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.truncate = exports.escapeRegex = exports.iterateFolder = void 0;
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
/**
 * Iterates through a folder and calls back on every .js found.
 * @param folder The path to check
 * @param callback The function to call on each file found
 * @param extension The extension to look for
 */
async function iterateFolder(folder, callback, extension = '.js') {
    const files = fs.readdirSync(folder);
    return Promise.all(files.map(async (file) => {
        const filePath = path.join(folder, file);
        const stat = fs.lstatSync(filePath);
        if (stat.isSymbolicLink()) {
            const realPath = fs.readlinkSync(filePath);
            if (stat.isFile() && file.endsWith(extension)) {
                return callback(realPath);
            }
            else if (stat.isDirectory()) {
                return iterateFolder(realPath, callback);
            }
        }
        else if (stat.isFile() && file.endsWith(extension))
            return callback(filePath);
        else if (stat.isDirectory())
            return iterateFolder(filePath, callback);
    }));
}
exports.iterateFolder = iterateFolder;
/**
 * Escapes a string from regex.
 * @param str The string to escape
 */
function escapeRegex(str) {
    return str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
}
exports.escapeRegex = escapeRegex;
/**
 * Truncates string into a limit, appending an ellipsis when truncated.
 * @param text The text to truncate
 * @param limit The length to truncate at
 */
function truncate(text, limit = 2000) {
    return text.length > limit ? text.slice(0, limit - 1) + '…' : text;
}
exports.truncate = truncate;
