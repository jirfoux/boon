const fs = require("fs");
const { JSDOM } = require("jsdom");

const scripts = `
<script>${fs.readFileSync(__dirname + "/../../booon.js", "utf-8")}</script>
<script>${fs.readFileSync(__dirname + "/../../booon-adapt.js", "utf-8")}</script>
`;

module.exports.getDom = () => new JSDOM(fs.readFileSync(__dirname + "/dom.html", "utf-8").replace("{SCRIPTS}", scripts),
    {
        runScripts: "dangerously"
    });
module.exports.getBooon = (d) => d.window.booon;
module.exports.getAdapt = (b) => b.adapt({
    el: "#main",
    data: {
        css: {
            "font-size": "8em",
            "top": "3px"
        },
        c: "green",
        b1: true,
        rad: "r1",
        texts: ["alpha", "beta", "gamma", "delta"],
        text: "pingu",
        html: "<b>simba</b>",
        num: 0,
        w1: 9,
        w2: 0,
        full: function () {
            return this.c + this.num;
        },
        count: 0,
        oo: {
            arr: ["_", ","],
            k: {
                dir: "zoo"
            }
        }
    },
    methods: {
        inc5: function (a, e) {
            if (typeof a == "number")
                this.num += a;
            else
                this.num += 5;
            if (e) {
                this.ee = e;
            }
        }
    },
    watch: {
        w1: function (n, o) {
            this.w2 = n + n;
            this.num = o;
        },
        texts: function () {
            this.count++;
        },
        oo: function () {
            this.count++;
        }
    }
});