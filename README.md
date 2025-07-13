Define once. Substitute anytime. Compute instantly. 
![Static Badge](https://img.shields.io/badge/Language-Javascript-6ff2a2)


## Description

This CLI allows the you to **write** and store expressions `(e.g., 2x^2 - 3)` under any chosen name. 

At any given time, you can **replace** the variables in the expression with numbers `(e.g., x = 3)` and **solve** them instantly.

The expressions can range from basic addition, subtraction, multiplication and division to the pythagorean theorem and quadratic formula.

## Usage

### Actions
The user has 6 actions.

>Note: the user will always be prompted to select an action from a list of options upon running the CLI.

- **List**: lists all the stored expressions.
- **Create**: create a new expression and give it name `(e.g., euclidean distance)`. The user will then be prompted to input its content `(e.g., (x2 - x1)^2 + (y2 - y1)^2)`, which will then be stored.
- **Edit**: Edit the content of an existing expression `(e.g., from x + y -> x^2 + y)`, by inputting it's name and its new content in subsequent prompts.
  
  >Note: the old content will be the placeholder for the new content input prompt so use tab key to auto-fill the prompt with it

- **Solve**: user inputs a name of an existing expression and is then prompted to replace variables in the expression with numbers. The expression, now with numbers, is then solved and the input is returned.

  >Note: replacing varibales does not modify the stored expression.

- **Rename**: change the name of an existing expression `(e.g., to John Doe)`. You have complete control!
- **Delete**: *permanently* delete an existing expression.

### Using Variables

- Variables must always be a **letter** `(e.g, x or y)` and can either be upper or lowercase
- **Identifiers** (will be referred to as **id**): follow a letter with **only** a number (the id) when wanting to use the *same* letter for variables that have *different* values (e.g., to show they are related).

  Examples:
  ```
        xx //the 2 x variables are considered the same--they have the same letter and no id

        x2 + x2x2 //the 3 x variables are considered the same--they have the same letter and id
      
        x222x  //x and x will be considered different variables because one has an id
      
        x233 + x2  //the 233 and 2 are used as ids to count the 2 x variables as different

        (x2 - x1)^2 + (y2 - y1)^2) //each x and y variable is considered unique because of their ids
        
  ```

### Multiplying
When multiplying a pair of anything, one can simply use `[number/variable] * [number/variable]`.
  
If the first thing in the pair, is a number, variable or bracket, and the second is a variable or bracket, you can ommit the ` * `.
Note: they must **have no spaces** between them!

Examples: (`->` means auto-changed to)
```
      xyz -> x*y*z

      2xx3 -> 2*x*x3

      2(x + 3) -> 2*(x + 3)

      (X + Y)Z -> (X + Y)*Z
          
      (x - y)(x2y4x) -> (x - y)*(x2*y4*x)

      x333 //333 is considered an id for the variable
```

