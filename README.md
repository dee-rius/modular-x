Define once. Substitute anytime. Compute instantly. 

![Static Badge](https://img.shields.io/badge/Language-Javascript-6ff2a2)

## Table of contents:
- [Description](#description)
- [Usage](#usage)
- [Core featurs](#core-features)
    - [Actions](#actions)
    - [Using Variabels](#using-variables)
    - [Multiplying](#multiplying)
    - [Functions](#functions)
- [Packages Used](#packages-used)

<br/>
<br/>

## Description

<br/>

This CLI allows the you to **write** and store expressions `(e.g., 2x^2 - 3)` under any chosen name. 

At any given time, you can **replace** the variables in the expression with numbers `(e.g., x = 3)` and **solve** them instantly.

The expressions can range from basic addition, subtraction, multiplication and division to the pythagorean theorem and quadratic formula.

<br/>
<br/>

## Usage
```
  npx modular-x
```

<br/>
<br/>

## Core features
<br/>

### Actions

The user has 6 actions.

<br/>

>**Note**:
><br/>
>the user will always be prompted to select an action from a list of options upon running the CLI.

- **List**: lists all the stored expressions.
  
<br/>
  
- **Create**: create a new expression and give it name `(e.g., euclidean distance)`. The user will then be prompted to input its content `(e.g., (x2 - x1)^2 + (y2 - y1)^2)`, which will then be stored.
  
<br/>
  
- **Edit**: Edit the content of an existing expression `(e.g., from x + y -> x^2 + y)`, by inputting it's name and its new content in subsequent prompts.
  
  >**Note**:
  ><br/>
  >the old content will be the placeholder for the new content input prompt so use tab key to auto-fill the prompt with it

<br/>

- **Solve**: user inputs a name of an existing expression and is then prompted to replace variables in the expression with numbers. The expression, now with numbers, is then solved and the input is returned.

  > **Note**:
  > <br/>
  >     replacing varibales does not modify the stored expression.

<br/>

- **Rename**: change the name of an existing expression `(e.g., to John Doe)`. You have complete control!

<br/>

- **Delete**: *permanently* delete an existing expression.
<br/>
<br/>

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

<br/>
<br/>

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
<br/>
<br/>

### Functions
>**Note**:
><br/>
>  - all funcitons must be preceeded by a semi column `:` (e.g., :sin(x))
>  - they can be preceeded by a number or letter when multiplying `(e.g., 2:pi -> 2 * : pi)`
>  - all functions that are followed by `()` must have an expression/variable/number in between the parentheses (e.g. `3:sin(x + 1)` )

    
- `pi`: returns the value of pi;
  Usage examples:
  ```
    :pi -> 3.141... 
    2:pi * r -> 6.282 * r
  ```

__functions below are used in the same way as each other (though they return different values)__
- `sin()`: Returns the sine of the expression/variable/number in parentheses.
  Usage examples
  ```
    2:sin(x + 2) -> 2 * sin(x + 2)
    :sin(x - 3)(5 + 2) -> sin(x - 3)*(5-2)
  ```
  > **Note**:
  > <br/>
  > The value of the expression/number/value is always considered to be in radians
- `sinh()`: returns the hyperbolic sine of the expression/variable/number (in radians) in parentheses.
- `asin()`: returns the arcsine of the expression/variable/number (in radians) in parentheses.
- `asinh()`: returns the hyperbolic arcsine of the expression/variable/number (in radians) in parentheses.
<br/>

- `cos()`: returns the cosine of the expression/variable/number (in radians) in parentheses.

- `cosh()`: returns the hyperbolic cosine of the expression/variable/number (in radians) in parentheses.

- `acos()`: returns the arccosine (inverse cosine) of the expression/variable/number (in radians) in parentheses.

- `acosh()`: returns the hyperbolic arccosine of the expression/variable/number (in radians) in parentheses.

  <br/>

- `tan()`: returns the tangent of the expression/variable/number in parentheses.

- `tanh()`: returns the hyperbolic tangent of the expression/variable/number (in radians) in parentheses.

- `atan()`: returns the arctangent (inverse tangent) of the expression/variable/number (in radians) in parentheses.

- `atanh()`: returns the hyperbolic arctangent of the expression/variable/number (in radians) in parentheses.

  <br/>

- `log()`: returns the natural logarithm (base e) of the expression/variable/number in parentheses.

- `logt()`: returns the base 10 logarithm of the expression/variable/number in parentheses.
<br/>
<br/>
<br/>

## Packages used:
- [Clack](https://github.com/bombshell-dev/clack)
- [fs](https://github.com/npm/fs)
