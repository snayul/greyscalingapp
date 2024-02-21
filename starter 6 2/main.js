const path = require("path");
/*
 * Project: Milestone 1
 * File Name: main.js
 * Description:executes modules
 *
 * Created Date:02/21/24
 * Author:Christian Chanicka
 *
 */

const IOhandler = require("./IOhandler");
const process = require("process");

const zipFilePath = path.join(__dirname, "myfile.zip");
const pathUnzipped = path.join(__dirname, "unzipped");
const pathProcessed = path.join(__dirname, "grayscaled");
const filter = process.argv[2]
IOhandler.unzip(zipFilePath, pathUnzipped)
IOhandler.readDir(pathUnzipped)
.then(
    files => {
    files.forEach(file => {

        IOhandler.grayScale(file,pathProcessed,filter)
    });
})

