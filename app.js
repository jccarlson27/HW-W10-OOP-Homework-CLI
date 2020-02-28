const inquirer = require("inquirer");
const fs = require("fs");
const jest = require("jest");
const Employee = require("./lib/Employee");
const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
let manager;
let engineer;
let intern;
let teamMembersArray = [];
//runs all the data gathering prompts to create new team members
function addEmployee() {
    inquirer
        .prompt([
            {
                type: "input",
                message: "What is the team members name?",
                name: "name"
            },
            {
                type: "input",
                message: "What is their ID number?",
                name: "id"
            },
            {
                type: "input",
                message: "What is their email address?",
                name: "email"
            },
            {
                type: "list",
                message: "Please select their team role.",
                name: "title",
                choices: ["Manager", "Engineer", "Intern"]
            }
        ])
        .then(res => {
            const info = res;
            if (info.title === "Manager") {
                inquirer
                    .prompt([
                        {
                            type: "input",
                            message: "Please enter the managers office number.",
                            name: "officeNumber"
                        }
                    ])
                    .then(res => {
                        manager = new Manager(
                            info.name,
                            info.id,
                            info.email,
                            res.officeNumber
                        );
                        teamMembersArray.push(manager);
                        wouldContinue();
                    });
            }
            if (info.title === "Engineer") {
                inquirer
                    .prompt([
                        {
                            type: "input",
                            message:
                                "Please enter the engineers Github username",
                            name: "github"
                        }
                    ])
                    .then(res => {
                        engineer = new Engineer(
                            info.name,
                            info.id,
                            info.email,
                            res.github
                        );
                        teamMembersArray.push(engineer);
                        wouldContinue();
                    });
            }
            if (info.title === "Intern") {
                inquirer
                    .prompt([
                        {
                            type: "input",
                            message: "Which college do/did the intern attend?",
                            name: "school"
                        }
                    ])
                    .then(res => {
                        intern = new Intern(
                            info.name,
                            info.id,
                            info.email,
                            res.school
                        );
                        teamMembersArray.push(intern);
                        wouldContinue();
                    });
            }
        });
}
//addEmployee function AFTER a manager has been chosen, to ensure only one manager per team
function addEngOrInt() {
    inquirer
        .prompt([
            {
                type: "input",
                message: "What is the team members name?",
                name: "name"
            },
            {
                type: "input",
                message: "What is their ID number?",
                name: "id"
            },
            {
                type: "input",
                message: "What is their email address?",
                name: "email"
            },
            {
                type: "list",
                message: "Please select their team role.",
                name: "title",
                choices: ["Engineer", "Intern"]
            }
        ])
        .then(res => {
            const info = res;
            if (info.title === "Engineer") {
                inquirer
                    .prompt([
                        {
                            type: "input",
                            message:
                                "Please enter the engineers Github username",
                            name: "github"
                        }
                    ])
                    .then(res => {
                        engineer = new Engineer(
                            info.name,
                            info.id,
                            info.email,
                            res.github
                        );
                        teamMembersArray.push(engineer);
                        wouldContinue();
                    });
            }
            if (info.title === "Intern") {
                inquirer
                    .prompt([
                        {
                            type: "input",
                            message: "Which college do/did the intern attend?",
                            name: "school"
                        }
                    ])
                    .then(res => {
                        intern = new Intern(
                            info.name,
                            info.id,
                            info.email,
                            res.school
                        );
                        teamMembersArray.push(intern);
                        wouldContinue();
                    });
            }
        });
}
//determines if more team members will be added
function wouldContinue() {
    inquirer
        .prompt([
            {
                type: "confirm",
                message: "Would you like to add another team member?",
                name: "continue"
            }
        ])
        .then(res => {
            let hasManager = teamMembersArray.some( array => array.title === 'Manager' )
            if (res.continue) {
                if (hasManager){
                    addEngOrInt();
                } else {
                    addEmployee();
                }
            } else {
                const html = mainHtmlGen();
                fs.writeFile(`./output/team.html`, html, (err, dt) => {
                    if (err) {
                        throw err;
                    }
                    console.log("success");
                });
            }
        });
}
// compiles the card html as a variable to be placed inside the mainHtmlGen function
function buildTeam() {
    let people = "";
    for (let i = 0; i < teamMembersArray.length; i++) {
        if (teamMembersArray[i].title === "Manager") {
            //generate a manager card from the html template
            people = people + genManagerCard(teamMembersArray[i]);
        } else if (teamMembersArray[i].title === "Engineer") {
            //generate an engineer card from the html template
            people = people + genEngineerCard(teamMembersArray[i]);
        } else {
            //generate an intern card from the html template
            people = people + genInternCard(teamMembersArray[i]);
        }
    }
    return people;
}
//creates the main body of html that the cards will be plugged into
function mainHtmlGen(data) {
    return `<!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta http-equiv="X-UA-Compatible" content="ie=edge" />
            <title>The Team</title>
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"/>
        </head>
        <body>
            <div class="jumbotron">
                <h1 class="header text-center">My Team!</h1>
            </div>
            <div class="container">
                <div class="row">
                    ${buildTeam()}
                </div>
            </div>
            <script src="https://code.jquery.com/jquery-3.4.1.slim.min.js" integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n" crossorigin="anonymous"></script>
            <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
            <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>    </body>
        </body>
    </html>`;
}
//creates the manager card
function genManagerCard(data) {
    return `<div class="card col-5 m-2 pb-2" style="width: 18rem;">
    <div class="card-body">
        <h5 class="card-title">${data.name}</h5>
        <h5 class="card-title">Manager</h5>
    </div>
    <ul class="list-group list-group-flush">
        <li class="list-group-item">ID: ${data.id}</li>
        <li class="list-group-item">Email: ${data.email}</li>
        <li class="list-group-item">Office No: ${data.officeNumber}</li>
    </ul>
</div>`;
}
//creates the engineer card
function genEngineerCard(data) {
    return `<div class="card col-5 m-2 pb-2" style="width: 18rem;">
    <div class="card-body">
        <h5 class="card-title">${data.name}</h5>
        <h5 class="card-title">Engineer</h5>
    </div>
    <ul class="list-group list-group-flush">
        <li class="list-group-item">ID: ${data.id}</li>
        <li class="list-group-item">Email: ${data.email}</li>
        <li class="list-group-item">GitHub: <a href="#">${data.github}</a></li>
    </ul>
</div>`;
}
//creates the intern card
function genInternCard(data) {
    return `<div class="card col-5 m-2 pb-2" style="width: 18rem;">
    <div class="card-body">
        <h5 class="card-title">${data.name}</h5>
        <h5 class="card-title">Intern</h5>
    </div>
    <ul class="list-group list-group-flush">
        <li class="list-group-item">ID: ${data.id}</li>
        <li class="list-group-item">Email: ${data.email}</li>
        <li class="list-group-item">School: ${data.school}</li>
    </ul>
</div>`;
}
addEmployee();