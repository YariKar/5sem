
//import {sound_manager} from "./main.js"

let score_table = JSON.parse(localStorage["game.score_table"])
score_table.sort(compare)

function compare(left, right)
{
    if (left.score < right.score)
    {
        return 1
    }
    return -1
}

let numbers_column = document.getElementById("numbers_column")
let names_column = document.getElementById("names_column")
let scores_column = document.getElementById("scores_column")
let status = JSON.parse(localStorage["game.status"])
if(status == "win"){
    console.log("win")
}
if(status == "death"){
    console.log("death")
}
for (let i = 0; i < Math.min(10, score_table.length); i++)
{
    let number = document.createElement("div")
    number.setAttribute("class", "row")
    number.innerText = i + 1
    numbers_column.appendChild(number)

    let username = document.createElement("div")
    username.setAttribute("class", "row")
    username.innerText = score_table[i].name
    names_column.appendChild(username)

    let score = document.createElement("div")
    score.setAttribute("class", "row")
    score.innerText = score_table[i].score
    scores_column.appendChild(score)
}