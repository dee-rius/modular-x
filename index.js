import chalk from "chalk";
import nanospinner from "nanospinner";
import inquirer from "inquirer";
import fs from "fs";

const actionKeywords = {
    "read expression": readExpression,
    "edit expression": editEqaution,
    "create expression": createExpression,
    "quit expression": quit,
}

const processColor = chalk.yellow;

const expressionsDirectoryName = "Expressions folder";

async function checkIfEquaionsDirectoryExists(){
    try{
        await fs.promises.access(expressionsDirectoryName);
    }
    catch{
        await fs.promises.mkdir(expressionsDirectoryName);
    }

    let launchingSpinner = nanospinner.createSpinner(processColor("Launching...")).start()
    setTimeout(() => {
        launchingSpinner.success(); 
        getUserActionChoice()},
    1000);
}

async function getUserActionChoice(){
    try{
        const action = await inquirer.prompt(
            {
                name:"chosen_action_keyword",
                type: "list",
                message: "Desired action: ",
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
        quitingSpinner.success();
        process.exit(0);
    }, 1000)
}

async function readExpression(){

}
async function editEqaution(){

}
async function createExpression(){

    try{
        let expression_name = await inquirer.prompt({
            name: "expression_subject",
            type: "input",
            message: "expression name",
            default: "new expression name"
        });
        let expression_content = await inquirer.prompt({
            name: "expression_content",
            type: "input",
            message: `${expression_name.expression_subject} = `,
            default: "(x2 - x1)^2 + (y2 - y1)^2"
        })

        try{
            let full_expression = `${expression_name.expression_subject} = ${expression_content.expression_content}`;
            let expressionFilePath = `${expressionsDirectoryName}/${expression_name.expression_subject}.txt`;
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