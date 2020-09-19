const fs = require("fs");
const { JSDOM } = require("jsdom");

const scripts = `
<script>${fs.readFileSync(__dirname + "/../booon.js", "utf-8")}</script>
<script>${fs.readFileSync(__dirname + "/../booon-ajax.js", "utf-8")}</script>
<script>${fs.readFileSync(__dirname + "/../booon-nodebuilder.js", "utf-8")}</script>
`;

module.exports.getDom = () => new JSDOM(fs.readFileSync(__dirname + "/dom.html", "utf-8").replace("{SCRIPTS}", scripts),
    {
        runScripts: "dangerously"
    });
module.exports.getBooon = () => module.exports.getDom().window.booon;