var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var cordovaBuild = require("taco-team-build");
var fs = require("fs");
var es = require('event-stream');

var paths = {
  sass: ['./scss/**/*.scss']
};

var winPlatforms = ["android", "windows"],
  linuxPlatforms = ["android"],
  osxPlatforms = ["ios"],
  platformsToBuild = process.platform === "darwin" ? osxPlatforms :
    (process.platform === "linux" ? linuxPlatforms : winPlatforms),

  buildConfig = "Release",

  buildArgs = {
    android: ["--" + buildConfig.toLocaleLowerCase(), "--device",
      "--gradleArg=--no-daemon"],
    ios: ["--" + buildConfig.toLocaleLowerCase(), "--device"],
    windows: ["--" + buildConfig.toLocaleLowerCase(), "--device"]
  },

  paths = {
    apk: ["./platforms/android/ant-build/*.apk",
      "./platforms/android/bin/*.apk",
      "./platforms/android/build/outputs/apk/*.apk"],
    binApk: "./bin/Android/" + buildConfig,
    ipa: ["./platforms/ios/build/device/*.ipa",
      "./platforms/ios/build/device/*.app.dSYM"],
    binIpa: "./bin/iOS/" + buildConfig,
    appx: "./platforms/windows/AppPackages/**/*",
    binAppx: "./bin/Windows/" + buildConfig
  };


gulp.task('default', ['sass', 'build']);

gulp.task("build", function () {
  return cordovaBuild.buildProject(platformsToBuild, buildArgs)
    .then(function () {
      return cordovaBuild.packageProject(platformsToBuild)
        .then(function () {
          return es.concat(
            gulp.src(paths.apk).pipe(gulp.dest(paths.binApk)),
            gulp.src(paths.ipa).pipe(gulp.dest(paths.binIpa)),
            gulp.src(paths.appx).pipe(gulp.dest(paths.binAppx)));
        });
    });
});

gulp.task('sass', function (done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch', function () {
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('install', ['git-check'], function () {
  return bower.commands.install()
    .on('log', function (data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function (done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
