const fs = require("fs");
const path = require("path");
const prettier = require("prettier");
const terser = require("terser");
const string = require("string");
const standard = require("standard");

const ALIAS = "// ALIAS //";

["booon", "booon-ajax", "booon-nodebuilder", "booon-adapt"].forEach(fileName => {
    const minFileName = fileName + ".min.js";

    fileName += ".js";
    let content = fs.readFileSync(path.join(__dirname, "src", fileName), "utf8");

    const oldSize = content.length;

    fs.writeFileSync(path.join(__dirname, "dist", fileName), prettify(content.replace(ALIAS, "")), { encoding: "utf8" });

    uglify(content)
        .then(res => {
            fs.writeFileSync(path.join(__dirname, "dist", minFileName), res.code, { encoding: "utf8" });
            console.log(fileName);
            console.log(oldSize);
            console.log(res.code.length);
        })
        .catch(console.error);


});

function prettify(text) {
    const stand = standard.lintTextSync(text, {
        fix: true
    })
    return prettier.format(stand.results[0].output, {
        trailingComma: "none",
        parser: "babel",
        tabWidth: 4
    });

}

function uglify(text) {
    if (text.includes(ALIAS)) {
        let alias = "";
        // Array
        const arrayAlias = [];
        ["isArray", "from"]
            .forEach(f => {
                if (string(text).count("Array." + f) > 1) {
                    text = string(text).replaceAll("Array." + f, f).s;
                    arrayAlias.push(f);
                }
            });
        if (arrayAlias.length) {
            alias += "let {" + arrayAlias.join(",") + "}=Array;";
        }
        // Object
        const objectAlias = [];
        ["defineProperty", "keys", "freeze", "entries"]
            .forEach(f => {
                if (string(text).count("Object." + f) > 1) {
                    text = string(text).replaceAll("Object." + f, f).s;
                    objectAlias.push(f);
                }
            });
        if (objectAlias.length) {
            alias += "let {" + objectAlias.join(",") + "}=Object;";
        }
        if (string(text).count(".startsWith(") > 2) {
            text = string(text).replaceAll(".startsWith(", ".sw(").s;
            alias += "String.prototype.sw=String.prototype.startsWith;"
        }
        text = text.replace(ALIAS, alias);

    }
    //return new Promise((res) => res({ code: text }));
    return terser.minify(text, {
        sourceMap: false,
        compress: true,
        mangle: true
    });
}

