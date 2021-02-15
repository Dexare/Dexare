/**
 * A class that iterates a string's index
 * @see ArgumentInterpreter
 */
export declare class StringIterator {
    string: string;
    index: number;
    previous: number;
    end: number;
    /**
     * @param string The string to iterate through
     */
    constructor(string: string);
    /** Get the character on an index and moves the index forward. */
    get(): string | undefined;
    /** Reverts to the previous index. */
    undo(): void;
    /** The previous character that was used. */
    get prevChar(): string;
    /** Whether or not the index is out of range. */
    get inEOF(): boolean;
}
/** Parses arguments from a message. */
export default class ArgumentInterpreter {
    static QUOTES: {
        [opening: string]: string;
    };
    static ALL_QUOTES: string[];
    string: string;
    allowWhitespace: boolean;
    /**
     * @param string The string that will be parsed for arguments
     * @param options The options for the interpreter
     * @param options.allowWhitespace Whether to allow whitespace characters in the arguments
     */
    constructor(string: string, { allowWhitespace }?: {
        allowWhitespace?: boolean | undefined;
    });
    /** Parses the arguements as strings. */
    parseAsStrings(): string[];
    /**
     * Checks whether or not a character is an opening quote
     * @param char The character to check
     */
    isOpeningQuote(char: string): boolean;
}
