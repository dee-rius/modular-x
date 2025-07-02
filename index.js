#!usr/bin/env node

import * as clack from "@clack/prompts";
import chalk from "chalk";
import fs from "fs";

checkIfEquaionsDirectoryExists()

function getRandomInt(min, max){
    return Math.floor((Math.random() * (max - min)) + min);
}

function checkIfOtherCMDsInputted(input){
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