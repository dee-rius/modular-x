#!usr/bin/env node

import * as clack from "@clack/prompts";
import path from "path";
import chalk from "chalk";
import fs from "fs/promises";


const text_encoding = "utf-8";

const expression_storage_directory_path = "expressions";
const expression_storage_file_format = "txt";

//responses

//e.g. Expression [ creation ] [ failed ] 
const expression_status_response_prefix = "Expression";
const operation_canceled_text = "Operation cancelled";

//spinner styling
//stroring
const expression_storing_spinner_text = "Storing expression";
const expression_storing_spinner_complete_text = "Rendering expression content...";
//reading
const expression_reading_spinner_text = "Getting expression content";
const expression_reading_spinner_complete_text = "Rendering expression content...";
//editing
const expression_edit_reading_old_spinner_text = "Getting expression text";
const expression_edit_reading_old_spinner_complete_text = "Rendering expression content...";
//renaming
const expression_rename_complete_spinner_text = "Expression renamed";

const expression_not_found_text = "Expression not found";


//e.g Opening expression [ creation ] dialogue
const opening_dialog_text_prefix = "Opening expression";

//action choices
const available_action_choices = [
    {
        value: "list",
        hint: "List all stored expressions",
        corresponding_function: list_expressions,
    },
    {
        value: "create",
        hint: "Create new expression",
        corresponding_function: create_expression,
    },
    {
        value: "edit",
        hint: "Edit existing expression",
        corresponding_function: edit_expression,
    },
    {
        value: "read",
        hint: "Read existing expression",
        corresponding_function: read_expression,
    },
    {
        value: "solve",
        hint: "Solve existing expression",
        corresponding_function: solve_expression,
    },
    {
        value: "rename",
        hint: "Rename existing expression",
        corresponding_function: rename_expression,
    },
    {
        value: chalk.red("delete"),
        hint: "Delete existing expression",
        corresponding_function: delete_expression,
    },
]


//func to get user action

//func to read user 

async function boot() {
    //creates a spinner (for styling purposes)
    await create_spinner("Booting", "Boot complete", 1000);

    await sleep(500);

    //displays important text
    clack.log.warn(set_text_colour("Note: Ctrl + C to quit/cancel", "warn"))
    await sleep(500);
    check_if_expression_storage_path_exists()
}

async function check_if_expression_storage_path_exists() {
    try {
        //checks if the folder exists
        await fs.access(expression_storage_directory_path);
    }
    catch {
        //if it doesn't exist, creates a new one
        await fs.mkdir(expression_storage_directory_path);
    }

    get_user_action_choice();
}

async function get_user_action_choice() {

    const user_action_choice = await clack.select({
        message: "Select desired action:",
        placeholder: "Ctrl + C to quit",
        options: available_action_choices,
    })

    if(clack.isCancel(user_action_choice)){
        clack.cancel(operation_canceled_text);
        process.exit(0);
    }

    for(let available_action_choice of available_action_choices){
        if(available_action_choice.value == user_action_choice){
            await create_spinner(`${opening_dialog_text_prefix} [${user_action_choice}] dialogue`, `Rendering expression [${user_action_choice}] dialogue`, 1000);
            await sleep(500);
            await available_action_choice.corresponding_function();
        }
    }
}


//action functions
async function list_expressions(){
    try{
        let expression_storage_files = await fs.readdir(expression_storage_directory_path, {withFileTypes: false});
        let expression_storage_file_names = []
        for(let expression_storage_file of expression_storage_files){
            expression_storage_file_names.push(path.basename(expression_storage_file, `.${expression_storage_file_format}`));
        }
        clack.note(expression_storage_file_names.join("\n"), "Stored expressions")
    }
    catch{
        clack.log.error("Expression storage directory may be missing");
        check_if_expression_storage_path_exists();
    }

    await sleep(500);
    get_user_action_choice();
}

async function create_expression() {
    //get_expression_details(get_expression_content = false, action_intent, display_old_content = false)
    let new_expression_details = await get_expression_details(true, "create");
    
    if(new_expression_details != undefined){
        await fs.writeFile(new_expression_details.storage_file_path, new_expression_details.content, text_encoding);

        //styling purposes
        await create_spinner(expression_storing_spinner_text, expression_storing_spinner_complete_text, 500);
        clack.note(new_expression_details.content, new_expression_details.name);
    }

    await sleep(500);
    get_user_action_choice();
}
async function read_expression(){
    //get_expression_details(get_expression_content = false, action_intent, display_old_content = false)
    let expresion_to_read = await get_expression_details(false, "read");

    if(expresion_to_read != undefined){
        await create_spinner(expression_reading_spinner_text, expression_reading_spinner_complete_text, 500);
        let expression_content = await fs.readFile(expresion_to_read.storage_file_path, text_encoding);

        clack.note(expression_content, expresion_to_read.name);
    }

    await sleep(500);
    get_user_action_choice();
}
async function edit_expression() {
    //get_expression_details(get_expression_content = false, action_intent, display_old_content = false)
    let expression_to_edit = await get_expression_details(true, "edit", true);

    if(expression_to_edit != undefined){
        //update file-content
        await fs.writeFile(expression_to_edit.storage_file_path, expression_to_edit.content, text_encoding);

        await create_spinner(expression_storing_spinner_text, expression_storing_spinner_complete_text, 500);
        clack.note(expression_to_edit.content, expression_to_edit.name);
    }

    await sleep(500);
    get_user_action_choice();
}
async function delete_expression() {
    //get_expression_details(get_expression_content = false, action_intent, display_old_content = false)
    let expression_to_delete = await get_expression_details(false, "delete", true);

    if(expression_to_delete != undefined){
        //check if the user really wants delete it

        let delete_choice = await clack.confirm({
            message: `${expression_to_delete.name} will be ${chalk.red("permanently")} deleted, proceed?`,
            initialValue: false,
        })

        if(delete_choice === true){
            try{
                await fs.access(expression_to_delete.storage_file_path);
                await fs.unlink(expression_to_delete.storage_file_path);

                await create_spinner(`${chalk.red("Permanently")} removing ${expression_to_delete.name}` , `${chalk.red("Permanently")} removed: ${expression_to_delete.name}`, 750);
            }
            catch{
                clack.log.error(expression_not_found_text);
                check_if_expression_storage_path_exists();
            }
        }
    }

    await sleep(500);
    get_user_action_choice();
}

async function rename_expression() {
    let expression_to_rename = await get_expression_details(false, "rename", false, "Enter (old) expression name");

    if(expression_to_rename != undefined){
        //get the new name for the expression
        let new_expresion_name = await get_expression_details(false, "get_new_name_for_rename", false, "Enter (new) expression name");
        
        if(new_expresion_name != undefined){
            //renames the file
            try{
                await fs.rename(expression_to_rename.storage_file_path, new_expresion_name.storage_file_path);

                await create_spinner(`Changing name from ${expression_to_rename.name} to ${new_expresion_name.name}`, expression_rename_complete_spinner_text, 500);
                await sleep(500);

                //displays editted name and corresponding content afterwards
                let expression_content = await fs.readFile(new_expresion_name.storage_file_path, text_encoding);
                clack.note(expression_content, new_expresion_name.name);
            }
            catch{
                clack.log.error("Error occured: expression not found")
            }
        }
        
    }

    await sleep(500);
    get_user_action_choice();
}
async function solve_expression(){

}


//utility functions

async function get_expression_details(get_expression_content, action_intent, display_old_content, expression_name_propmt_message = "Enter expression name") {
    //gets all sroted files;
    let expression_storage_files = [];
    try{
        expression_storage_files = await fs.readdir(expression_storage_directory_path);
    }
    catch{
        ///thsi hapens when an error occurs
        check_if_expression_storage_path_exists();
    }

    let expression_content_prompt_placeholder = "(x2 - x1)^2 + (y2 - y1)^2";
    
    let expresion_name = await clack.text({
        message: expression_name_propmt_message,
        placeholder: "name",
        //validates depending on the type of action
        validate: (value) => {
            if (action_intent == "create" ||action_intent == "get_new_name_for_rename") {
                
                //checks if file exists and displays a error mesagge if so
                if(expression_storage_files.includes(`${value.trim()}.${expression_storage_file_format}`)){
                    return "Expression already exists";
                }
            }
            else{
                 //checks if file does'nt exist and returns an error
                 if(!expression_storage_files.includes(`${value.trim()}.${expression_storage_file_format}`)){
                    return expression_not_found_text;
                }
            }
        }
    });
    if(clack.isCancel(expresion_name)){
        //add spinner
        clack.cancel(operation_canceled_text);
        return undefined;
    }

    await sleep(500);
    //if action is edit, displays previous file content
    let full_expression_storage_file_path = `${expression_storage_directory_path}/${expresion_name.trim()}.${expression_storage_file_format}`;
    if(display_old_content === true){

        create_spinner(expression_edit_reading_old_spinner_text, expression_edit_reading_old_spinner_complete_text, 500);
        
        await sleep(500);
        
        let old_expression_content = await fs.readFile(full_expression_storage_file_path, text_encoding);
        clack.note(old_expression_content, `${expresion_name}`);
        
        //change the placeholder to make sure the user knows the previous value
        expression_content_prompt_placeholder = old_expression_content;
        
        await sleep(500);
    }

    let expression_content = "";
    if(get_expression_content === true){
            expression_content = await clack.text({
            message: `Enter new content of ${expresion_name}`,
            placeholder: expression_content_prompt_placeholder,
            //if get_expression_content == false, disable = true, disabling it
        })
        if(clack.isCancel(expression_content)){
            clack.cancel(operation_canceled_text);
            return undefined;
        }
    }


    return get_expression_content === false? {name: expresion_name.trim(), storage_file_path: full_expression_storage_file_path}: {name: expresion_name.trim(), content: expression_content.trim(), storage_file_path: full_expression_storage_file_path};
}

//promise-based set timeout
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));


function set_text_colour(string, type = "default") {
    switch (type) {
        case "action_keyword":
            return chalk.blue(string);
            break;
        case "error":
            return chalk.red(string);
            break;
        case "success":
            return chalk.green(string);
            break;
        case "warn":
            return chalk.yellow(string);
            break;
        case other:
            return string;
    }
}

async function create_spinner(spinner_start_text, spinner_stop_text, spin_duration_in_ms) {
    let spinner = clack.spinner();
    spinner.start(spinner_start_text);
    await sleep(spin_duration_in_ms);
    spinner.stop(spinner_stop_text);
}


function get_randomInt(min, max) {
    return Math.floor((Math.random() * (max - min)) + min);
}


boot();