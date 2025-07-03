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
    const expression_reading_spinner_text = "Getting expression content";
    
    const spinner_duration = 1000;

    //e.g Opening expression [ creation ] dialogue
    const opening_dialoge = "Opening expression";

//action choices
    const available_action_choices = [
        {
            value: "create",
            hint: "Create new expression"
        },
        {
            value: "edit",
            hint: "Edit existing expression"
        },
        {
            value: "read",
            hint: "Read existing expression",
        },
        {
            value: "solve",
            hint: "Solve existing expression"
        },
        {
            value: "delete",
            hint: "Delete existing expression"
        },
        {
            value: "rename",
            hint: "Rename existing expression"
        },
    ]

//func to get user action

//func to read user 

async function boot(){
    //creates a spinner (for styling purposes)
    let booting_spinner = clack.spinner();
    booting_spinner.start("Booting");
    await sleep(1000);
    booting_spinner.stop("Boot complete");

    await sleep(500);

    //displays important text
    clack.log.warn(set_text_colour("Note: Ctrl + C to quit/cancel", "warn"))
    await sleep(500);
    check_if_expression_storage_path_exists()
}

async function check_if_expression_storage_path_exists(){
    try{
        //checks if the folder exists
        await fs.access(expression_storage_directory_path);
    }
    catch{
        //if it doesn't exist, creates a new one
        await fs.mkdir(expression_storage_directory_path);
    }

    get_user_action_choice();
}

async function get_user_action_choice(){
    let user_action_choice_initial_value = "";
    await setInitialValue();

    const user_action_choice = clack.select({
        message: "Select desired action:",
        placeholder: "Ctrl + C to quit",
        initialValue: true,
        initialValue:  user_action_choice_initial_value,
        options: available_action_choices,
    })



    async function setInitialValue(){
        //gets all expression staoge files
        let expression_storage_files = await fs.readdir(expression_storage_directory_path);

        //setting initial value based on num of expression storage files (files with the expression storage file format)
        if(expression_storage_files.filter(storage_file => path.extname(storage_file) == expression_storage_file_format).length == 0){
            user_action_choice_initial_value = "create";
        }
        else{
            user_action_choice_initial_value = "read";
        }
    }
}

//utility functions

async function read(expression_name){
    try{
        let expression_storage_file_path = `${expression_storage_directory_path}/${expression_name}.${expression_storage_file_format}`;
        let expression_content = await fs.readFile(expression_storage_file_path, text_encoding);
        return expression_content;
    }
    catch{
        clack.log.error("Expression not found...");
        return;
    }
}

async function create_or_edit(expression_name, expression_content){
    try{
        let expression_storage_file_path = `${expression_storage_directory_path}/${expression_name}.${expression_storage_file_format}`;
        await fs.writeFile(expression_storage_file_path, expression_content, text_encoding);
    }
    catch{
        //fill here;
    }
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));


function set_text_colour(string, type = "default"){
    switch (type){
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


function get_randomInt(min, max){
    return Math.floor((Math.random() * (max - min)) + min);
}

function check_if_other_cmds_inputted(input){
    if(input.toLowerCase().trim() == "quit"){
        process.exit(0);
    }
    else if(input.toLowerCase().trim() == "cancel"){
        getUserActionChoice();
    }
}



function strip(string, toStrip){
    return string.replaceAll(toStrip, "");
}

boot();