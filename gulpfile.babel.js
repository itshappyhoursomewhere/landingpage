/* global __dirname */

"use strict";

import gulp from "gulp";
import babel from "gulp-babel";
import prettyError from "pretty-error";
import browserify from "gulp-browserify";
import rename from "gulp-rename";

prettyError.start();

var paths = {
  app: {
    src: [
      'src/index.{js,jsx}',
    ],
    dest: 'dist',
  },
};

gulp.task("build", () => gulp.src(paths.app.src)
    .pipe(browserify({
        transform: ["babelify"]
    }))
    .pipe(rename('app.js'))
    .pipe(gulp.dest(paths.app.dest)));