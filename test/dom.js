const fs = require("fs");
const { JSDOM } = require("jsdom");

const scripts = `
<script>${fs.readFileSync(__dirname + "/../dist/booon.min.js", "utf-8")}</script>
<script>${fs.readFileSync(__dirname + "/../dist/booon-ajax.min.js", "utf-8")}</script>
<script>${fs.readFileSync(__dirname + "/../dist/booon-nodebuilder.min.js", "utf-8")}</script>
`;

module.exports.getDom = () => new JSDOM(fs.readFileSync(__dirname + "/dom.html", "utf-8").replace("{SCRIPTS}", scripts),
    {
        runScripts: "dangerously"
    });
module.exports.getBooon = () => module.exports.getDom().window.booon;