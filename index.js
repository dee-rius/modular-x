import chalk from "chalk";
import nanospinner from "nanospinner";
import inquirer from "inquirer";
import fs from "fs";

const actionKeywords = {
    "read": readEquation,
    "edit": editEqaution,
    "create": createEquation,
    "quit": quit,
}

const processColor = chalk.yellow;

const equationsDirectoryName = "Equations folder";

async function checkIfEquaionsDirectoryExists(){
    try{
        await fs.promises.access(equationsDirectoryName);
    }
    catch{
        await fs.promises.mkdir(equationsDirectoryName);
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
                name:"chosen_acion_keyword",
                type: "list",
                message: "Desired action: ",
                choices: ["create", "rename", "read", "edit", "delete", "quit"],
                async default(){
                    let equations = await fs.promises.readdir(equationsDirectoryName);

                    if(equations.length > 0){
                        return "read";
                    }
                    else{
                        return "create";
                    }
                }
            }
        )

        actionKeywords[action.chosen_acion_keyword]();
    }catch (error){
        console.log(`something went wrong!`)
    }
} 

async function quit(){
    let quitingSpinner = nanospinner.createSpinner(processColor("Quitting...")).start();

    setTimeout(() => {
        quitingSpinner.success();
        process.exit(0);
    }, 1000)
}

async function readEquation(){

}
async function editEqaution(){

}
async function createEquation(){

    try{
        let equation_name = await inquirer.prompt({
            name: "equation_name",
            type: "input",
            message: "equation name",
            default: "new equation name"
        });
        let equation_expression = await inquirer.prompt({
            name: "equation_expression",
            type: "input",
            message: `${equation_name.equation_name} = `,
            default: "(x2 - x1)^2 + (y2 - y1)^2"
        })
    }
    catch (error){
        console.log(`Error occured: ${error}`)
    }

}

checkIfEquaionsDirectoryExists()