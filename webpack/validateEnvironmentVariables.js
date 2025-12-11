const { logErrorAndExit } = require('./helpers');

const {
    ENV_VARIABLES,
} = require('./config');


/**
 * Validate that all required environment variables are set.
 * 
 * @param {*} envConfig object containing environment variables loaded from .env file by dotenv
 */
const validateEnv = (
    envConfig
)=>{
    console.log(`Validating environment variables...\n`);

    if(!envConfig){
        logErrorAndExit('Failed to validate environment variables: No environment configuration provided for validation.');
    }

    // Get environment variables for the specified application
    const environmentVariables = ENV_VARIABLES;

    if(!environmentVariables){
        logErrorAndExit('Failed to validate environment variables: No environment variable configuration found.');
    }

    // Get required environment variable names
    const requiredEnvVars = environmentVariables
        .filter(envVar=>envVar.required)
        .map(envVar=>envVar.name);

    if(!requiredEnvVars || requiredEnvVars.length === 0){
        console.log(`No required environment variables defined for application. Skipping validation.`);
        return;
    }

    for(const varName of requiredEnvVars){
        if(!(varName in envConfig)){
            logErrorAndExit(`Missing required environment variable: "${varName}". Please define it in your .env file.\nYou can refer to the .env.template file for guidance.`);
        }
    }
    
    console.log(`All required environment variables are set.\n`);
}

module.exports = validateEnv;