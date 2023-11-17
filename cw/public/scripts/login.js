let username_element = document.getElementById("username")
let form_element = document.getElementById("form")

form_element.addEventListener("submit", saveUsername)


username_element.value = localStorage["game.username"];
function saveUsername(event)
{
    localStorage["game.username"] = username_element.value
    if (localStorage["game.score_table"] === undefined)
    {
        localStorage["game.score_table"] = JSON.stringify([])
    }
}