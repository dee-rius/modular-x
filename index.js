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

//spinner styling

const expression_storing_spinner_text = "Storing expression";
const expression_stored_spinner_text = "Expression stored as";
const expression_reading_spinner_text = "Getting expression content";

const spinner_duration = 1000;

//e.g Opening expression [ creation ] dialogue
const opening_dialog_text_prefix = "Opening expression";

//action choices
const available_action_choices = [
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
        value: "delete",
        hint: "Delete existing expression",
        corresponding_function: delete_expression,
    },
    {
        value: "rename",
        hint: "Rename existing expression",
        corresponding_function: rename_expression,
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
    let user_action_choice_initial_value = "";
    await setInitialValue();

    const user_action_choice = await clack.select({
        message: "Select desired action:",
        placeholder: "Ctrl + C to quit",
        initialValue: user_action_choice_initial_value,
        options: available_action_choices,
    })

    for(let available_action_choice of available_action_choices){
        if(available_action_choice.value == user_action_choice){
            available_action_choice.corresponding_function();
        }
    }


    async function setInitialValue() {
        //gets all expression staoge files
        let expression_storage_files = await fs.readdir(expression_storage_directory_path);

        //setting initial value based on num of expression storage files (files with the expression storage file format)
        if (expression_storage_files.filter(storage_file => path.extname(storage_file) == expression_storage_file_format).length == 0) {
            user_action_choice_initial_value = "create";
        }
        else {
            user_action_choice_initial_value = "read";
        }
    }
}


//action functions
async function create_expression() {
    let new_expression_details = await get_expression_details(true, "create");
    
    if(new_expression_details != undefined){
        await fs.writeFile(new_expression_details.storage_file_path, new_expression_details.content, text_encoding);

        //styling purposes
        await create_spinner(expression_storing_spinner_text, expression_stored_spinner_text, 500);
        clack.note(new_expression_details.content, new_expression_details.name);
    }

    get_user_action_choice();
}
async function read_expression(){

}
async function edit_expression() {
    
}
async function delete_expression() {
    
}
async function rename_expression() {
    
}
async function solve_expression(){

}


//utility functions

async function read(expression_name) {
    try {
        let expression_storage_file_path = `${expression_storage_directory_path}/${expression_name}.${expression_storage_file_format}`;
        let expression_content = await fs.readFile(expression_storage_file_path, text_encoding);
        return expression_content;
    }
    catch {
        clack.log.error("Expression not found...");
        return;
    }
}

async function get_expression_details(get_expression_content = false, action) {
    //gets all sroted files;
    let expression_storage_files = [];
    try{
        expression_storage_files = await fs.readdir(expression_storage_directory_path);
    }
    catch{
        ///thsi hapens when an error occurs
        check_if_expression_storage_path_exists();
    }

    let expresion_name = await clack.text({
        message: "Enter expression name",
        placeholder: "name",
        //validates depending on the type of action
        validate: (value) => {
            switch (action) {
                //if action == read, try to access the file to see of ot exists
                case "read" || "edit":
                    //checks if file does'nt exist and returns an error
                    if(!expression_storage_files.includes(`${value}.${expression_storage_file_format}`)){
                        return "Expression does not exist";
                    }
                case "create":
                        //checks if file exists and displays a error mesagge if so
                    if(expression_storage_files.includes(`${value}.${expression_storage_file_format}`)){
                        return "Expression already exists";
                    }
            }
        }
    });
    if(clack.isCancel(expresion_name)){
        //add spinner
        return undefined;
    }

    //if action is edit, displays previous file content
    let full_expression_storage_file_path = `${expression_storage_directory_path}/${expresion_name}.${expression_storage_file_format}`;
    if(action == "edit"){
        let expression_content = await fs.readFile(full_expression_storage_file_path, text_encoding);
        clack.note(expression_content, `${expresion_name} (Old) = `);
    }
    let expression_content = await clack.text({
        message: `Enter expression content -> ${expresion_name} = `,
        placeholder: "(x2 - x1)^2 + (y2 - y1)^2",
        //if get_expression_content == false, disable = true, disabling it
        disabled: !get_expression_content,
    })
    if(clack.isCancel(expression_content)){
        return undefined;
    }

    return get_expression_content == false? {name: expresion_name, storage_file_path: full_expression_storage_file_path}: {name: expresion_name, content: expression_content, storage_file_path: full_expression_storage_file_path};
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

function check_if_other_cmds_inputted(input) {
    if (input.toLowerCase().trim() == "quit") {
        process.exit(0);
    }
    else if (input.toLowerCase().trim() == "cancel") {
        getUserActionChoice();
    }
}



function strip(string, toStrip) {
    return string.replaceAll(toStrip, "");
}

boot();