var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var uglify      = require('gulp-uglify'),
    bulkSass    = require('gulp-sass-bulk-import'),
    plumber     = require('gulp-plumber'),
    server      = require('gulp-server-livereload'),
    connect     = require('gulp-connect'),
    minifyHTML  = require('gulp-minify-html'),
    uncss       = require('gulp-uncss')
    ;

var paths = {
  sass: ['./scss/**/*.scss']
};

gulp.task('default', ['sass']);

gulp.task('sass', function(done) {

    return gulp
      .src(
          [
            './www/assets/scss/index.scss',
          ]
      )
      .pipe(plumber({
        errorHandler: function (err) {
          console.log(err);
          this.emit('end');
        }
      }))
      // Add the template/* import functionnal
      .pipe(bulkSass())
      .pipe(
          sass({
            includePaths: ['./www/assets/scss']
          }))
      // Output in assets/css/
      .pipe( gulp.dest('./www/assets/css/') )
});

// create the index.html for dev
gulp.task('index-html-dev',function(){
    return gulp.src(
        [
            'www/base.html',
            'www/footer-dev.html',
        ]
        )
        .pipe(concat('www/index.html'))
        .pipe(gulp.dest('./'))
});

// Create the index.html for prod
gulp.task('index-html-prod',function(){
    return gulp.src(
        [
            'www/base.html',
            'www/footer-prod.html',
        ]
        )
        .pipe(concat('www/index.html'))
        .pipe(gulp.dest('./'))
});



/**
 * Concatenation of all scripts for prod
 */
gulp.task('scripts', function() {
    return gulp.src(
        [
            // All files
            './www/libs/jquery/dist/jquery.min.js',
            './www/libs/bootstrap/dist/js/bootstrap.min.js',
            './www/libs/angular-ui-router/release/angular-ui-router.min.js',
            './www/libs/angular-bootstrap/ui-bootstrap.min.js">',
            './www/libs/angular-bootstrap/ui-bootstrap-tpls.min.js',
            './www/app/app.js',
            './www/app/directives/*.js',
            './www/app/filters/*.js',
            './www/app/models/*.js',
            './www/app/services/*.js',
            './www/app/controllers/*.js',
        ]
        )
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        // Put everything in one file
        .pipe(concat('all.js'))
        // Minify
        .pipe(uglify({
            mangle: false,
            /*compress: false,
            output : {
                beautify : true,
                comments : true,
            }*/
        }))
        // Output : all.js in assets/js/
        .pipe(gulp.dest('./www/assets/js/'))
        .pipe(rename('all.js'))
        ;
});



// Compile all js & lauch server then watch files
gulp.task('watch',['default'], function () {

    // On change in scss files, compile everything & concat it with bootstrap
    gulp.watch('./www/assets/scss/**/*.scss',['sass']);

    // On update of base & footer, recreate the index
    gulp.watch('./www/base.html',['index-html-dev']);
    gulp.watch('./www/footer-dev.html',['index-html-dev']);

});

// Minify all html in build
gulp.task('html', function(){

    var opts = {
        conditionals: true,
        spare:true
    };

    return gulp.src('./www/partials/src/**/*.html')
        .pipe(minifyHTML(opts))
        .pipe(gulp.dest('./www/partials/build/'));

});


// Minify all css after running sass command
gulp.task('css', ['sass'], function(){
    return gulp.src(
        [
            './www/assets/css/index.css',
        ])
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(uncss({
            html: [
                'www/base.html',
                'www/partials/src/**/*.html',
                'www/footer-dev.html'
            ],
            ignore: [
                ".fade",
                ".fade.in",
                ".collapse",
                ".collapse.in",
                ".collapsing",
                "json",
                "pre",
                ".txt-black",
                /\.modal/,
                /\.panel/,
                /\.open/,
                /\.noUi/,
            ]
        }))
        .pipe(minifyCss({compatibility: 'ie8'}))
        .pipe( gulp.dest('./assets/css/') )
});


gulp.task('deploy',['scripts','css','index-html-prod','html'],function(){});


gulp.task('git-check', function(done) {
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
