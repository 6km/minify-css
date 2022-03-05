#! /usr/bin/env node
var postcss = require('postcss');
var cssnano = require('cssnano');
var autoprefixer = require('autoprefixer');
var fs = require('fs');
var chalk = require('chalk');
var path = require('path');
var preset = require('cssnano-preset-lite')({
    discardComments: { removeAll: true },
});

var colormin = require('postcss-colormin');
var gradients = require('postcss-minify-gradients');
var normalizeUrl = require('postcss-normalize-url');

var args = process.argv.slice(2)

async function minify(filepath) {
    var result = await postcss([
        cssnano({
            preset: preset
        }),
        colormin(),
        gradients(),
        autoprefixer(),
        normalizeUrl({
            removeSingleSlash: true
        }),
    ]).process(fs.readFileSync(filepath), { from: 'undefined' });

    fs.writeFileSync(filepath, result.css, { encoding: 'utf-8' })
}

if (args[0] && fs.existsSync(args[0])) {
    minify(path.resolve(args[0]));

    console.log(`${chalk.greenBright("[MinifyCSS]")} Completed!`);
} else {
    console.log(`${chalk.redBright("[MinifyCSS]")} Please provide a path to the css file\n  ${chalk.gray("$")}${chalk.reset()} minify-css /path/to/index.css`)
}