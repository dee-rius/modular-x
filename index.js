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
const busy_spinner_text = "Processing";
const busy_spinner_complete_text = "Processing complete";
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
//solving
const replacing_special_characters_spinner_text = "Encrypting special characters";
const replacing_special_characters_spinner_complete_text = "Rendering encrypted expression...";

const substituting_variables_spinner_text = "Substituting variables";
const substituting_variables_spinner_complete_text = "All variables substituted";

const expression_solving_spinner_text = "Computing expression";
const expression_solving_spinner_complete_text = "Rendering results...";

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
        value: "read",
        hint: "Read existing expression",
        corresponding_function: read_expression,
    },
    {
        value: "solve",
        hint: "Solve existing expression",
        corresponding_function: get_name_of_equation_to_solve,
    },
    {
        value: "edit",
        hint: "Edit existing expression",
        corresponding_function: edit_expression,
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
];


//func to get user action

//func to read user 

async function boot() {
    //creates a spinner (for styling purposes)
    await create_spinner("Booting", "Boot complete", 1000);

    await create_spinner(busy_spinner_text, busy_spinner_complete_text, 500);

    //displays important text
    check_if_expression_storage_path_exists();
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
    clack.log.warn(set_text_colour("Note: Ctrl + C to quit/cancel", "warn"));
    await create_spinner(busy_spinner_text, busy_spinner_complete_text, 500);

    const user_action_choice = await clack.select({
        message: "Select desired action:",
        placeholder: "Ctrl + C to quit",
        options: available_action_choices,
    });

    if (clack.isCancel(user_action_choice)) {
        clack.cancel(operation_canceled_text);
        process.exit(0);
    }

    //don't know how to run it by the value
    for (let available_action_choice of available_action_choices) {
        if (available_action_choice.value == user_action_choice) {
            await create_spinner(`${opening_dialog_text_prefix} [${user_action_choice}] dialogue`, `Rendering expression [${user_action_choice}] dialogue`, 750);
            await available_action_choice.corresponding_function();
        }
    }
}


//action functions
async function list_expressions() {
    try {
        let expression_storage_files = await fs.readdir(expression_storage_directory_path, { withFileTypes: false });
        let expression_storage_file_names = [];
        for (let expression_storage_file of expression_storage_files) {
            expression_storage_file_names.push(path.basename(expression_storage_file, `.${expression_storage_file_format}`));
        }
        clack.note(expression_storage_file_names.join("\n"), "Stored expressions");
    }
    catch {
        clack.log.error("Expression storage directory may be missing");
        check_if_expression_storage_path_exists();
    }

    await create_spinner(busy_spinner_text, busy_spinner_complete_text, 500);
    check_if_expression_storage_path_exists()
}

async function create_expression() {
    //get_expression_details(get_expression_content = false, action_intent, display_old_content = false)
    let new_expression_details = await get_expression_details(true, "create");

    if (new_expression_details != undefined) {
        await fs.writeFile(new_expression_details.storage_file_path, new_expression_details.content, text_encoding);

        //styling purposes
        await create_spinner(expression_storing_spinner_text, expression_storing_spinner_complete_text, 500);
        clack.note(new_expression_details.content, new_expression_details.name);
    }

    await create_spinner(busy_spinner_text, busy_spinner_complete_text, 500);
    check_if_expression_storage_path_exists()
}
async function read_expression() {
    //get_expression_details(get_expression_content = false, action_intent, display_old_content = false)
    let expresion_to_read = await get_expression_details(false, "read");

    if (expresion_to_read != undefined) {
        await create_spinner(expression_reading_spinner_text, expression_reading_spinner_complete_text, 500);
        let expression_content = await fs.readFile(expresion_to_read.storage_file_path, text_encoding);

        clack.note(expression_content, expresion_to_read.name);
    }

    await create_spinner(busy_spinner_text, busy_spinner_complete_text, 500);
    check_if_expression_storage_path_exists()
}
async function edit_expression() {
    //get_expression_details(get_expression_content = false, action_intent, display_old_content = false)
    let expression_to_edit = await get_expression_details(true, "edit", true);

    if (expression_to_edit != undefined) {
        //update file-content
        await fs.writeFile(expression_to_edit.storage_file_path, expression_to_edit.content, text_encoding);

        await create_spinner(expression_storing_spinner_text, expression_storing_spinner_complete_text, 500);
        clack.note(expression_to_edit.content, expression_to_edit.name);
    }

    await create_spinner(busy_spinner_text, busy_spinner_complete_text, 500);
    check_if_expression_storage_path_exists()
}
async function delete_expression() {
    //get_expression_details(get_expression_content = false, action_intent, display_old_content = false)
    let expression_to_delete = await get_expression_details(false, "delete", true);

    if (expression_to_delete != undefined) {
        //check if the user really wants delete it

        let delete_choice = await clack.confirm({
            message: `${expression_to_delete.name} will be ${chalk.red("permanently")} deleted, proceed?`,
            initialValue: false,
        });

        if (delete_choice === true) {
            try {
                await fs.access(expression_to_delete.storage_file_path);
                await fs.unlink(expression_to_delete.storage_file_path);

                await create_spinner(`${chalk.red("Permanently")} removing ${expression_to_delete.name}`, `${chalk.red("Permanently")} removed: ${expression_to_delete.name}`, 750);
            }
            catch {
                clack.log.error(expression_not_found_text);
                check_if_expression_storage_path_exists();
            }
        }
    }

    await create_spinner(busy_spinner_text, busy_spinner_complete_text, 500);
    //check if teh diresctory exists before moving on to collect user action
    check_if_expression_storage_path_exists()
}

async function rename_expression() {
    let expression_to_rename = await get_expression_details(false, "rename", false, "Enter (old) expression name");

    if (expression_to_rename != undefined) {
        //get the new name for the expression
        let new_expresion_name = await get_expression_details(false, "get_new_name_for_rename", false, "Enter (new) expression name");

        if (new_expresion_name != undefined) {
            //renames the file
            try {
                await fs.rename(expression_to_rename.storage_file_path, new_expresion_name.storage_file_path);

                await create_spinner(`Changing name from ${expression_to_rename.name} to ${new_expresion_name.name}`, expression_rename_complete_spinner_text, 500);
                await create_spinner(busy_spinner_text, busy_spinner_complete_text, 500);

                //displays editted name and corresponding content afterwards
                let expression_content = await fs.readFile(new_expresion_name.storage_file_path, text_encoding);
                clack.note(expression_content, new_expresion_name.name);
            }
            catch {
                clack.log.error(expression_not_found_text);
            }
        }

    }

    await create_spinner(busy_spinner_text, busy_spinner_complete_text, 500);
    check_if_expression_storage_path_exists();
}



//solving stages (all functions pass down the expression name) -> split into multiple functions because of the single responsibility rule

//gets name of equation to solve
async function get_name_of_equation_to_solve() {

    let expression_to_solve = await get_expression_details(false, "get_name_of_expression_to_solve", false);
    try {

        if (expression_to_solve != undefined) {
            //get expression content
            let expression_content = await fs.readFile(expression_to_solve.storage_file_path, text_encoding);
            special_character_encryption(expression_content, expression_to_solve);
        }
        else {
            //checks if everything is okay before running get user action
            check_if_expression_storage_path_exists();
        }

    }
    catch (error) {
        //if not log expression not found
        clack.log.error(error);
        check_if_expression_storage_path_exists();
    }
}

//exncryption of special charcaters and advanced functions (this is to prevent messing up variable finding process)
async function special_character_encryption(expression_content, expression_to_solve) {
    let special_character_to_replace = {
        "^": "**(",
        "_": "**(1/",
    }
    let to_replace = {
        ":pi": "~()",

        ":sin": "@",
        ":sinh": "@?",
        ":asin": "@'",
        ":asinh": "@'?",

        ":cos": "#",
        ":cosh": "#?",
        ":acos": "#'",
        ":acosh": "#'?",

        ":tan": "&",
        ":tanh": "&?",
        ":atan": "&'",
        ":atanh": "&'?",

        ":log": "|",
        ":logt": "||",

        ":fact": "!",
    };

    //ignores spaces
    let expression_content_split_by_character = expression_content.split("").filter(char => char != " ");

    expression_content_split_by_character.map((this_character, index) => {
        let next_character = expression_content_split_by_character[index + 1];

        //skips if this character is not included in the for loop
        if(special_character_to_replace[this_character] === undefined){ return; }

        //this for when no brackets are used -> just checks if the next character is a number 
        if (!isNaN(next_character)) {
            let replace_special = `${this_character}${next_character}`
            let to_replace_with = `${special_character_to_replace[this_character]}${next_character}`

            //finds the rest of the digits after the special character
            expression_content_split_by_character.map((char, index) => {
                if(index >= i + 2 && !isNaN(char)) {replace_special += char; to_replace_with += char;}
            })

            //if you look at the special chatacter to replace object, you will find that bracket is opened, it is now closed
            to_replace[replace_special] = `${to_replace_with})`
        }
        //if the next character is in brackets
        else if(next_character == "("){
            let replace_special = `${this_character}${next_character}`
            let to_replace_with = `${special_character_to_replace[this_character]}${next_character}`

            //finds the rest of the digits after the special character
            for(let next_next_char_index = index + 2; next_next_char_index < expression_content_split_by_character.length; next_next_char_index ++){
                let this_character = expression_content_split_by_character[next_next_char_index];

                //gets the all the characters in brackets
                if(this_character == ")") {replace_special += char; to_replace_with += char; break}
                else{replace_special += char; to_replace_with += char;}
            }
        }
    })


    for (let chars_to_replace in to_replace) {
        expression_content = expression_content.replaceAll(chars_to_replace, to_replace[chars_to_replace]);
    }

    perform_basic_replacements(expression_content, expression_to_solve);
}

//func to process equation for bidmas and encrypts special characters, does actual replacing and passses down the new expression
async function perform_basic_replacements(expression_content, expression_to_solve) {
    let special_character_encryption_prefixes = ["@", "#", "~", "&", "|", "!"];
    let to_replace = {};

    //ignores spaces
    let expression_content_split_by_character = expression_content.split("").filter(char => char != " ");

    expression_content_split_by_character.map((this_character, index) => {
        let next_character = expression_content_split_by_character[index + 1];

        //checks if this_character isn't a letter or number or close bracket. If so, skips to the next iteration
        if (/^[a-zA-Z]+$/.test(this_character) === false && isNaN(this_character) === true && this_character != ")") { return;}

        //checks if the nex number is an open bracket or a letter
        if (next_character == "(" || /^[a-zA-Z]+$/.test(next_character) === true || special_character_encryption_prefixes.includes(next_character)) {
            //if so, inserts * between them (e.g., 2x -> 2*x, x(y - 2) -> x*(y-2)), 2:pi(x) -> 2~(x) -> 2 * ~(x);
            to_replace[`${this_character}${next_character}`] = `${this_character}*${next_character}`;
        }
    })
    

    for (let chars_to_replace in to_replace) {
        expression_content = expression_content.replaceAll(chars_to_replace, to_replace[chars_to_replace]);
    }


    //styling purposes
    await create_spinner(replacing_special_characters_spinner_text, replacing_special_characters_spinner_complete_text, 250);
    clack.note(expression_content, expression_to_solve.name);
    await create_spinner(busy_spinner_text, busy_spinner_complete_text, 250);

    find_and_store_variables(expression_content, expression_to_solve);
}



//func loops through the expression and finds and stores variables in a an array, and passes that down
async function find_and_store_variables(expression_content, expression_to_solve) {
    //ignores spaces
    let expression_content_split_by_character = expression_content.split("").filter(char => char != " ");
    let variables = [];

    expression_content_split_by_character.map((this_character, index) => {
        let next_character = expression_content_split_by_character[index + 1];

        //if this character is not a letter, skip this iteration and move to the next one (character)
        if (/^[a-zA-Z]+$/.test(this_character) === false) { return; }

        //if the next charcater isn't a number, only count the letter as a variable (also doesn't add the variable if it is already included)
        if (isNaN(next_character)) {

            if (!variables.includes(this_character)) { variables.push(this_character); }
            //skips rest of the code to the next iteration
            return;
        }

        //if this character is a letter and the next character is a number (e.g., x2)
        //the next character is considered an id for the variable
        let full_variable = `${this_character}${next_character}`;

        //finds the rest of the id (e.g., x234 -> x2 is found first, so it continues to see if there is more (34))
        expression_content_split_by_character.map((this_character, this_character_index) => {

            //checks if the character is not a number and considers it the end of the id, stopping the loop
            if (this_character_index < index + 2 && isNaN(this_character)) { return; }

            //if it is a number, it is considered part of the id
            full_variable += this_character;
        })

        //if it is not already in the array, add it to the array of variables
        if (!variables.includes(full_variable)) {
            variables.push(full_variable);
        }
    })

    get_user_to_replace_variables(expression_content, expression_to_solve, variables);
}


//function gets the user to input input replacements for the variables, and stores the variables a keys and the users values as values of the keys in the object and passes that down
async function get_user_to_replace_variables(expression_content, expression_to_solve, variables) {
    let variables_and_substitutes = {};

    for (let variable of variables) {
        //get value to substitue the variable with
        let substitute_with = await get_value_to_substitute_variable_with(variable);

        //if user cancels
        if (substitute_with === undefined) {
            //check if the storage path exists before proceeding to get user action choice
            check_if_expression_storage_path_exists();
        }

        //store the variable and its substitute
        variables_and_substitutes[variable] = substitute_with;

        await create_spinner(busy_spinner_text, busy_spinner_complete_text, 250);
    }

    substitue_the_variables(expression_content, expression_to_solve, variables_and_substitutes)
}

//function does actual replacing of variables 
async function substitue_the_variables(expression_content, expression_to_solve, variables_and_substitues) {
    //extracts variables from
    let variables = Object.keys(variables_and_substitues);

    //sorts the variables by length in descending order to bring variables with ids in first place
    variables.sort((a, b) => b.length - a.length);

    //because of preceeding code, variables with longer ids are replaced first
    variables.map((variable) => {
        expression_content = expression_content.replaceAll(variable, variables_and_substitues[variable]);
    });

    await create_spinner(substituting_variables_spinner_text, substituting_variables_spinner_complete_text, 250);
    clack.note(expression_content, expression_to_solve.name);

    solve_the_expression(expression_content);
}

async function function_decryption(expression_content) {
    
}


//solves the expression, and shows the results 
async function solve_the_expression(expression_content) {
    let fix_operator_errors = {
        "++": "+",
        "--": "-",
        "+-": "-",
        "-+": "-",
        "(+": "("
    };

    let result = 0;
    let processed_expression = expression_content;

    //prevent potential operator errors
    let operator_errors = Object.keys(fix_operator_errors);
    for (let operator_error of operator_errors) {
        processed_expression = processed_expression.replaceAll(operator_error, fix_operator_errors[operator_error]);
    }

    try {
        //solves expression
        result = eval(processed_expression);
    }
    catch (error) {
        clack.log.error(String(error))
    }

    await create_spinner(expression_solving_spinner_text, expression_solving_spinner_complete_text, 500);
    clack.note(processed_expression, `Output: ${String(result)}`);

    await create_spinner(busy_spinner_text, busy_spinner_complete_text, 1000);
    check_if_expression_storage_path_exists();
}



//this funciton is used when getting number to replace variable with
async function get_value_to_substitute_variable_with(variable) {
    let number_to_substitute_variable_with = await clack.text({
        message: `Enter number to substitute ${variable} with:`,
        validate: (input) => {
            if (isNaN(input) && !input.includes("(", ")")) {
                return "Please input a valid number";
            }
        }
    });

    if (clack.isCancel(number_to_substitute_variable_with)) {
        clack.cancel(operation_canceled_text);
        return undefined;
    }

    let fix_operator_errors = {
        "++": "+",
        "--": "-",
        "+-": "-",
        "-+": "-",
        "(+": "("
    };

    let processed_input = number_to_substitute_variable_with;
    //prevent potential operator errors
    let operator_errors = Object.keys(fix_operator_errors);
    for (let operator_error of operator_errors) {
        processed_input = processed_input.replaceAll(operator_error, fix_operator_errors[operator_error]);
    }

    return number_to_substitute_variable_with;
}


//utility functions

async function get_expression_details(get_expression_content, action_intent, display_old_content, expression_name_propmt_message = "Enter expression name") {
    //gets all sroted files;
    let expression_storage_files = [];
    try {
        expression_storage_files = await fs.readdir(expression_storage_directory_path);
    }
    catch {
        ///thsi hapens when an error occurs
        check_if_expression_storage_path_exists();
    }

    let expression_content_prompt_placeholder = "(x2 - x1)^2 + (y2 - y1)^2";

    let expresion_name = await clack.text({
        message: expression_name_propmt_message,
        placeholder: "name",
        //validates depending on the type of action
        validate: (value) => {
            if (action_intent == "create" || action_intent == "get_new_name_for_rename") {

                //checks if file exists and displays a error mesagge if so
                if (expression_storage_files.includes(`${value.trim()}.${expression_storage_file_format}`)) {
                    return "Expression already exists";
                }
            }
            else {
                //checks if file does'nt exist and returns an error
                if (!expression_storage_files.includes(`${value.trim()}.${expression_storage_file_format}`)) {
                    return expression_not_found_text;
                }
            }
        }
    });
    if (clack.isCancel(expresion_name)) {
        //add spinner
        clack.cancel(operation_canceled_text);
        return undefined;
    }

    await create_spinner(busy_spinner_text, busy_spinner_complete_text, 500);
    //if action is edit, displays previous file content
    let full_expression_storage_file_path = `${expression_storage_directory_path}/${expresion_name.trim()}.${expression_storage_file_format}`;
    if (display_old_content === true) {

        create_spinner(expression_edit_reading_old_spinner_text, expression_edit_reading_old_spinner_complete_text, 500);

        await create_spinner(busy_spinner_text, busy_spinner_complete_text, 500);

        let old_expression_content = await fs.readFile(full_expression_storage_file_path, text_encoding);
        clack.note(old_expression_content, `${expresion_name}`);

        //change the placeholder to make sure the user knows the previous value
        expression_content_prompt_placeholder = old_expression_content;

        await create_spinner(busy_spinner_text, busy_spinner_complete_text, 500);
    }

    let expression_content = "";
    if (get_expression_content === true) {
        expression_content = await clack.text({
            message: `Enter new content of ${expresion_name}`,
            placeholder: expression_content_prompt_placeholder,
            //if get_expression_content == false, disable = true, disabling it
        })
        if (clack.isCancel(expression_content)) {
            clack.cancel(operation_canceled_text);
            return undefined;
        }
    }


    return get_expression_content === false ? { name: expresion_name.trim(), storage_file_path: full_expression_storage_file_path } : { name: expresion_name.trim(), content: expression_content.trim(), storage_file_path: full_expression_storage_file_path };
}

//promise-based set timeout
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));


function set_text_colour(string, type = "default") {
    switch (type) {
        case "action_keyword":
            return chalk.blue(string);
        case "error":
            return chalk.red(string);
        case "success":
            return chalk.green(string);
        case "warn":
            return chalk.yellow(string);
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