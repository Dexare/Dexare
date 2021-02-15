"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringIterator = void 0;
const QUOTES = {
    '"': '"',
    '‘': '’',
    '‚': '‛',
    '“': '”',
    '„': '‟',
    '⹂': '⹂',
    '「': '」',
    '『': '』',
    '〝': '〞',
    '﹁': '﹂',
    '﹃': '﹄',
    '＂': '＂',
    '｢': '｣',
    '«': '»',
    '‹': '›',
    '《': '》',
    '〈': '〉'
};
/**
 * A class that iterates a string's index
 * @see ArgumentInterpreter
 */
class StringIterator {
    /**
     * @param string The string to iterate through
     */
    constructor(string) {
        this.index = 0;
        this.previous = 0;
        this.string = string;
        this.end = string.length;
    }
    /** Get the character on an index and moves the index forward. */
    get() {
        const nextChar = this.string[this.index];
        if (!nextChar)
            return nextChar;
        else {
            this.previous += this.index;
            this.index += 1;
            return nextChar;
        }
    }
    /** Reverts to the previous index. */
    undo() {
        this.index = this.previous;
    }
    /** The previous character that was used. */
    get prevChar() {
        return this.string[this.previous];
    }
    /** Whether or not the index is out of range. */
    get inEOF() {
        return this.index >= this.end;
    }
}
exports.StringIterator = StringIterator;
/** Parses arguments from a message. */
class ArgumentInterpreter {
    /**
     * @param string The string that will be parsed for arguments
     * @param options The options for the interpreter
     * @param options.allowWhitespace Whether to allow whitespace characters in the arguments
     */
    constructor(string, { allowWhitespace = false } = {}) {
        this.string = string;
        this.allowWhitespace = allowWhitespace;
    }
    /** Parses the arguements as strings. */
    parseAsStrings() {
        const args = [];
        let currentWord = '';
        let quotedWord = '';
        const string = this.allowWhitespace ? this.string : this.string.trim();
        const iterator = new StringIterator(string);
        while (!iterator.inEOF) {
            const char = iterator.get();
            if (char === undefined)
                break;
            if (this.isOpeningQuote(char) && iterator.prevChar !== '\\') {
                currentWord += char;
                const closingQuote = ArgumentInterpreter.QUOTES[char];
                // Quote iteration
                while (!iterator.inEOF) {
                    const quotedChar = iterator.get();
                    // Unexpected EOF
                    if (quotedChar === undefined) {
                        args.push(...currentWord.split(' '));
                        break;
                    }
                    if (quotedChar == '\\') {
                        currentWord += quotedChar;
                        const nextChar = iterator.get();
                        if (nextChar === undefined) {
                            args.push(...currentWord.split(' '));
                            break;
                        }
                        currentWord += nextChar;
                        // Escaped quote
                        if (ArgumentInterpreter.ALL_QUOTES.includes(nextChar)) {
                            quotedWord += nextChar;
                        }
                        else {
                            // Ignore escape
                            quotedWord += quotedChar + nextChar;
                        }
                        continue;
                    }
                    // Closing quote
                    if (quotedChar == closingQuote) {
                        currentWord = '';
                        args.push(quotedWord);
                        quotedWord = '';
                        break;
                    }
                    currentWord += quotedChar;
                    quotedWord += quotedChar;
                }
                continue;
            }
            if (/^\s$/.test(char)) {
                if (currentWord)
                    args.push(currentWord);
                currentWord = '';
                continue;
            }
            currentWord += char;
        }
        if (currentWord.length)
            args.push(...currentWord.split(' '));
        return args;
    }
    /**
     * Checks whether or not a character is an opening quote
     * @param char The character to check
     */
    isOpeningQuote(char) {
        return Object.keys(ArgumentInterpreter.QUOTES).includes(char);
    }
}
exports.default = ArgumentInterpreter;
ArgumentInterpreter.QUOTES = QUOTES;
ArgumentInterpreter.ALL_QUOTES = Object.keys(QUOTES)
    .map((i) => QUOTES[i])
    .concat(Object.keys(QUOTES));
