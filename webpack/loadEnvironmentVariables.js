const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

const {
    ERROR_TERMIAL_OUTPUT_COLOR,
} = require('./constants');

/**
 * Load environment variables from the specified .env file.
 * @param {*} envFileName - name of the environment file (e.g., .env.development)
 * @returns {dotenv.DotenvParseOutput} - object containing the loaded environment variables returned by dotenv
 */
const loadEnvironmentVariables = (envFileName)=>{
    // Default to .env if no file name is provided
    envFileName = envFileName || '.env';
    console.log(`Loading environment variables from ${envFileName}`);
    
    // Get the path to the environment file,
    // it is assumed to be in the root directory of the project
    const envPath = path.resolve(__dirname, '../', envFileName);

    // check if the environment file exists
    if (!fs.existsSync(envPath)) {
        console.error(ERROR_TERMIAL_OUTPUT_COLOR, `Environment file ${envPath} does not exist. Please create it based on .env.template and place it in the project root directory.\n`);
        process.exit(1);
    }

    // Load the environment variables
    const envConfig = dotenv.config({ path: envPath }).parsed || {};
    console.log(`Loaded environment variables from ${envPath}\n`);

    // throw an error if the environment variables is an empty object
    if (Object.keys(envConfig).length === 0) {
        console.error(ERROR_TERMIAL_OUTPUT_COLOR, `No environment variables found in the environment file ${envPath}. Please check the file content.`);
        process.exit(1);
    }

    return envConfig;
}

module.exports = loadEnvironmentVariables;