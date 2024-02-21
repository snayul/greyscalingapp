/*
 * Project: Milestone 1
 * File Name: IOhandler.js
 * Description: Collection of functions for files input/output related operations
 *
 * Created Date: 02/21/24
 * Author: Christian Chanicka
 *
 */
const fs = require("fs").promises;
const PNG = require("pngjs").PNG;
const path = require("path");
const yauzl = require('yauzl-promise');
const {pipeline} = require('stream/promises');
const { createReadStream, createWriteStream } = require("fs");
const { resolve } = require("path");
const { dir } = require("console");
const {pixelGrayscale} = require("./filter");


/**
 * Description: decompress file from given pathIn, write to given pathOut
 *
 * @param {string} pathIn
 * @param {string} pathOut
 * @return {promise}
 */
const unzip = async (pathIn, pathOut) => {
  const zip = await yauzl.open(pathIn);
  try {
    for await (const entry of zip) {
      if (entry.filename.endsWith('/')) {
        await fs.mkdir(`${pathOut}/${entry.filename}`);
      } else {
        const readStream = await entry.openReadStream();
        const writeStream = createWriteStream(`${pathOut}/${entry.filename}`);
        await pipeline(readStream, writeStream);
        
        console.log("file proccessed")
      }
    }
  } finally {
    await zip.close();
    console.log("zip closed")
  }
  
};


/**
 * Description: read all the png files from given directory and return Promise containing array of each png file path
 *
 * @param {string} path
 * @return {promise}
 */
async function readDir (dir) {
  const fileArray = []
  try {
    const dirFile = await fs.promises.readdir(dir)
    for(const file of dirFile) {
      if(path.extname(file) === ".png"){
        fileArray.push(path.join(file))
      }
    }
  } catch (err) {
    console.log(err)
  }
  return fileArray
};

/**
 * Description: Read in png file by given pathIn,
 * convert to grayscale and write to given pathOut
 *
 * @param {string} filePath
 * @param {string} pathProcessed
 * @return {promise}
 */
const grayScale = async (pathIn, pathOut, filter) => {
  
fs.createReadStream(path.join(__dirname,"unzipped",pathIn))
.pipe(
  new PNG({
    filterType: 4,
    colorType: 6
  })
)
.on("parsed", function () {
  for (var y = 0; y < this.height; y++) {
    for (var x = 0; x < this.width; x++) {
      var idx = (this.width * y + x) << 2;
      switch(filter) {
        case "grayscale":
          const rgbGrayscale = pixelGrayscale(this.data[idx], this.data[idx+1], this.data[idx+2]);
          this.data[idx] = this.data[idx+1] = this.data[idx+2] = rgbGrayscale;
          break;
      }          
    }
  }

  this.pack().pipe(fs.createWriteStream(`${pathOut}/${pathIn}`));
});
};
  
module.exports = {
  unzip,
  readDir,
  grayScale,
};
