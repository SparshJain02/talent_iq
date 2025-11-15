// piston api is a service for code execution
const PISTON_API = "https://emkc.org/api/v2/piston/execute"

const LANGUAGE_VERSIONS = {
    javascript: {
        language: "javascript",
        version: "18.15.0"
    },
    python: {
        language: "python",
        version: "3.10.0"
    },
    java: {
        language: "java",
        version: "15.0.2"
    }
}

/**
 * @param {string} language - programming language
 * @param {string} code - source code to execute
 * @returns {Promise<sucess:boolean output?:string, error?:string>}
 */

export async function executeCode(language,code){
    try{
        const languageConfig = LANGUAGE_VERSIONS[language];
        if(!languageConfig){
            return {
                success: false,
                error: `Unsupported language: ${language}`
            }
        }
        const res = await fetch(`${PISTON_API}`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                language: languageConfig.language,
                version: languageConfig.version,
                files: [
                   {
                    name: `main.${getFileExtenstion(language)}`,
                    content: code,
                   },
                ]
            }),
        });
        if(!res.ok){
            return {
                success: false,
                error: `HTTP Error status: ${res.status}`
            }
        }
        const data = await res.json();
        const {output,stderr} = data.run
        if(stderr){
            return {
                success: false,
                output: output,
                error: stderr
            }
        }
        return {
            success: true,
            output: output || "No output",
        }
    }
    catch(err){
        return {
            success: false,
            error: `Failed to execute the code ${err.message}`
        }
    }
}

const getFileExtenstion = (language)=>{
    const extension = {
        javascript: "js",
        python:"py",
        java: "java"
    };
    return extension[language] || "txt" 
}