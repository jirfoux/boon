const tap = require("tap");
const test = tap.test;
const { getDom, getBooon, getAdapt } = require("./dom");

const dom = getDom();
const booon = getBooon(dom);
const adapt = getAdapt(booon);

// watcher, validators