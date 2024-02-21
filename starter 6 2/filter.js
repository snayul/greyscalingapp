const fs = require("fs"),
  PNG = require("pngjs").PNG,
  path = require("path");



const pixelGrayscale = (red,green,blue) => {
    return (0.21*red+0.72*green+0.07*blue)
}
module.exports = {pixelGrayscale}
