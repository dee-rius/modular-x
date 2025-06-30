import chalk from "chalk";
import nanospinner from "nanospinner";
import inquirer from "inquirer";
import fs from "fs";

const actionKeywords = {
    "read expression": readExpression,
    "edit expression": editEqaution,
    "create expression": createExpression,
    "quit": quit,
}

//styling
const processColor = chalk.yellow;
const processDuration = 1000;
const expressionPrefix = "::";

const expressionsDirectoryName = "Expressions folder";
const expressionStorageFileType = "txt";

async function checkIfEquaionsDirectoryExists(){
    try{
        await fs.promises.access(expressionsDirectoryName);
    }
    catch{
        await fs.promises.mkdir(expressionsDirectoryName);
    }

    let launchingSpinner = nanospinner.createSpinner(processColor("Launching...")).start()
    setTimeout(() => {
        launchingSpinner.stop(); 
        getUserActionChoice()},
    processDuration);
}

async function getUserActionChoice(){
    try{
        const action = await inquirer.prompt(
            {
                name:"chosen_action_keyword",
                type: "list",
                message: "Desired action: ",
                prefix: "?",
                choices: ["create expression", "rename expression", "read expression", "edit expression", "delete expression", "quit"],
                async default(){
                    let expressions = await fs.promises.readdir(expressionsDirectoryName);

                    if(expressions.length > 0){
                        return "read expression";
                    }
                    else{
                        return "create expression";
                    }
                }
            }
        )

        actionKeywords[action.chosen_action_keyword]();
    }catch (error){
        console.log(`Something went wrong: ${error}`)
    }
} 

async function quit(){
    let quitingSpinner = nanospinner.createSpinner(processColor("Quitting...")).start();

    setTimeout(() => {
        quitingSpinner.stop();
        process.exit(0);
    }, processDuration)
}

async function readExpression(){
    let expression = await inquirer.prompt({
        name:"chosen_expression",
        type:"list",
        message: "Chose expression: ",
        async choices(){
            try{
                let expressions = await fs.promises.readdir(expressionsDirectoryName);
                return expressions.join("").split(`.${expressionStorageFileType}`);
            }
            catch{
                console.log("Something went wrong: equation not found!");
            }
        },
        async default(){
            let expressions = await fs.promises.readdir(expressionsDirectoryName, {withFileTypes: false});
            return expressions[getRandomInt(0, expressions.length - 1)];
        },
        async validate(input){
            try{
                await fs.promises.access(`${expressionsDirectoryName}/${input}.${expressionStorageFileType}`)
                return true;
            }
            catch{
                return false;
            }
        }
    })

    let expression_content = await fs.promises.readFile(`${expressionsDirectoryName}/${expression.chosen_expression}.${expressionStorageFileType}`, "utf-8")

    let gettingContentSpinner = nanospinner.createSpinner(processColor("Getting expression...")).start();
    setTimeout(
        () => {
            gettingContentSpinner.stop();
            console.log(chalk.green(expressionPrefix,expression_content));

            setTimeout(
                ()=> {
                    getUserActionChoice();
                },
                500
            )
        },
        processDuration
    )
}
async function editEqaution(){

}
async function createExpression(){

    try{
        let expression_name = await inquirer.prompt({
            name: "expression_name",
            type: "input",
            message: "Expression name: ",
            default: "new expression name"
        });
        let expression_content = await inquirer.prompt({
            name: "expression_content",
            type: "input",
            message: `${expression_name.expression_subject} = `,
            default: "(x2 - x1)^2 + (y2 - y1)^2"
        })

        try{
            let full_expression = `${expression_name.expression_name} = ${expression_content.expression_content}`;
            let expressionFilePath = `${expressionsDirectoryName}/${expression_name.expression_name}.${expressionStorageFileType}`;
            await fs.promises.writeFile(expressionFilePath, `${full_expression}`, "utf-8");
        }
        catch (error){
            console.log(`Error occured ${error}`);
            checkIfEquaionsDirectoryExists()
        }
        
    }
    catch (error){
        console.log(`Error occured: ${error}`)
    }

}

checkIfEquaionsDirectoryExists()

function getRandomInt(min, max){
    return Math.floor((Math.random() * (max - min)) + min);
}