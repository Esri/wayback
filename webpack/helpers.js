// Terminal output color for errors (red)
const ERROR_TERMINAL_OUTPUT_COLOR = '\x1b[31m%s\x1b[0m';

/**
 * Log an error message in red and exit the process with code 1.
 * @param {string} message - The error message to display
 */
const logErrorAndExit = (message) => {
    console.error(ERROR_TERMINAL_OUTPUT_COLOR, message);
    process.exit(1);
};

module.exports = {
    ERROR_TERMINAL_OUTPUT_COLOR,
    logErrorAndExit,
};
