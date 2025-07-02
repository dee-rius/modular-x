#!usr/bin/env node

import * as clack from "@clack/prompts";
import chalk from "chalk";
import fs from "fs/promises";

const text_encoding = "utf-8";

const expression_storage_directory_name = "expressions";
const expression_storage_file_format = ".txt";
//func to get user action

//func to read user action


//utility functions
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function read(expression_name){
    try{
        let expression_storage_file_path = `${expression_storage_directory_name}/${expression_name}${expression_storage_file_format}`;
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
        let expression_storage_file_path = `${expression_storage_directory_name}/${expression_name}${expression_storage_file_format}`;
        await fs.writeFile(expression_storage_file_path, expression_content, text_encoding);
    }
    catch{
        //fill here;
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