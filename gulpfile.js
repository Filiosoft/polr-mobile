var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var cordovaBuild = require('taco-team-build');
var fs = require('fs');
var es = require('event-stream');
var eslint = require('gulp-eslint');
var colors = require('colors/safe');
var csslint = require('gulp-csslint');
var argv = require('yargs').argv;
var rename = require('gulp-rename');
var runSequence = require('run-sequence');
var shell = sh.exec;
var pkg = require('./package.json');

var paths = {
  sass: ['./scss/**/*.scss']
};

var winPlatforms = ['android'],
  linuxPlatforms = ['android'],
  osxPlatforms = ['ios'],
  platformsToBuild = process.platform === 'darwin' ? osxPlatforms :
  (process.platform === 'linux' ? linuxPlatforms : winPlatforms),

  buildConfig = 'Release',

  buildArgs = {
    android: ['--' + buildConfig.toLocaleLowerCase(), '--device',
      '--gradleArg=--no-daemon'
    ],
    ios: ['--' + buildConfig.toLocaleLowerCase(), '--device']
  },
  fullNumber = pkg.version + '-' + argv.vc,

  paths = {
    apk: ['./platforms/android/ant-build/*.apk',
      './platforms/android/bin/*.apk',
      './platforms/android/build/outputs/apk/*.apk'
    ],
    binApk: './bin/Android/' + buildConfig,
    ipa: ['./platforms/ios/build/device/*.ipa',
      './platforms/ios/build/device/*.app.dSYM'
    ],
    binIpa: './bin/iOS/' + buildConfig
  };


gulp.task('default', ['sass', 'build']);

gulp.task('build', function () {
  return cordovaBuild.buildProject(platformsToBuild, buildArgs)
    .then(function () {
      return cordovaBuild.packageProject(platformsToBuild)
        .then(function () {
          return es.concat(
            gulp.src(paths.apk).pipe(gulp.dest(paths.binApk)),
            gulp.src(paths.ipa).pipe(gulp.dest(paths.binIpa)));
        });
    });
});

// Set app version number
gulp.task('version', function () {
  var pkgJson = JSON.parse(fs.readFileSync('./package.json'));
  console.log(colors.green('Setting version number...'))

  function runCommands(vc) {
    if (vc) {
      shell('node node_modules/scv-cli/scv.js -n ' + pkgJson.version + ' -b ' + vc);
    } else {
      return console.log(colors.red('You need to specify the build number with --vc.'));
    }
  }
  return runCommands(argv.vc);
});

// Bump NPM version number
gulp.task('version:npm', function () {
  console.log(colors.green('Bumping NPM version number...'))
  if (argv.ver) {
    return shell('npm --no-git-tag-version version ' + argv.ver);
  } else {
    return console.log(colors.red('You need to specify the version with --ver. (<newversion> | major | minor | patch | premajor | preminor | prepatch | prerelease | from-git)'));
  }
});

// Bump NPM minor version number
gulp.task('version:npm:patch', function () {
  console.log(colors.green('Bump NPM minor version number...'));
  return shell('npm --no-git-tag-version version patch');
});

// Run all tasks for CI/CD
gulp.task('ci', function () {
  runSequence('test', 'version', 'build', 'move');
});

gulp.task('sass', function (done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({
      extname: '.min.css'
    }))
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

// Move All Artifacts
gulp.task('move', ['move-apk', 'move-ipa'], function () {
  console.log('Moving Artifacts');
});

// Move Android APKs
gulp.task('move-apk', function () {
  renameApk('armv7');
  renameApk('x86');

  function renameApk(type) {
    var output = 'Polr-Mobile-Dev-' + type + '-' + fullNumber + '.apk';
    gulp.src('./bin/Android/Release/android-' + type + '-release.apk')
      .pipe(rename(output))
      .pipe(gulp.dest('./bin/Android/Release'));
  }
});

// Move iOS IPAs
gulp.task('move-ipa', function () {
  console.log(colors.green('Renaming iOS IPAs...'))
  return gulp.src('./platforms/ios/build/device/*.ipa')
    .pipe(rename('Polr-Mobile-Dev-' + fullNumber + '.ipa'))
    .pipe(gulp.dest('./bin/iOS/Release'));
});

gulp.task('test', ['eslint', 'csslint']);

gulp.task('eslint', function () {
  return gulp.src('www/js/**').pipe(eslint({
      'configFile': '.eslintrc'
    }))
    .pipe(eslint.format())
    // Brick on failure to be super strict
    .pipe(eslint.failOnError());
});

gulp.task('csslint', function () {
  gulp.src(['www/css/*.css', '!www/css/*.min.css', '!www/css/ionic.app*'])
    .pipe(csslint())
    .pipe(csslint.formatter());
});
