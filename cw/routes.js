import express from "express"
import fs from "fs"
import body_parser from "body-parser"




let first_map
let second_map
let sprites
fs.readFile("public/levels/level1.json", (err, data) => {
    if (err) throw err;
    first_map = JSON.parse(data);
});
fs.readFile("public/levels/level2.json", (err, data) => {
    if (err) throw err;
    second_map = JSON.parse(data);
});
fs.readFile("public/images/sprites_all.json", (err, data) => {
    if (err) throw err;
    sprites = JSON.parse(data);
});

export const router = express.Router();

router.get("/game", (req, res) => {
    console.log("level 1")
    res.send(first_map)
    //res.render("index.ejs")
})

router.get("/sprites", (req, res)=>{
    console.log("sprites", sprites)
    res.send(sprites)
})

router.get("/", (req, res) => {
    console.log("login")
    res.render("login.ejs")
    //res.send(first_map)
})

router.get("/game_2", (req, res) => {
    console.log("level 2")
    res.send(second_map)
    //res.render("index.ejs")
})

router.get("/record", (req, res) => {
    console.log("records")
    res.render("record.ejs")
    //res.render("index.ejs")
})

router.get("/play", (req, res) => {
    console.log("index")
    res.render("index.ejs")
    //res.send(first_map)
})


