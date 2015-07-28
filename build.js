'use strict';

var fs = require('fs');
var sass = require('node-sass');
var opts = { file: './dist/scss/_tabs.scss' };

sass.render(opts, function(error, result) {
  if (error) {
    console.log("Error compiling SASS:", error.status, error.column, error.message, error.line);
    return;
  }
  // Output to stylesheet
  fs.writeFileSync('./demo/tabs.css', result.css.toString());
});
