var gulp        = require('gulp'),
    concat      = require('gulp-concat'),
    rename      = require('gulp-rename'),
    uglify      = require('gulp-uglify'),
    sass        = require('gulp-sass'),
    minifyCss   = require('gulp-minify-css'),
    bulkSass    = require('gulp-sass-bulk-import'),
    plumber     = require('gulp-plumber'),
    server      = require('gulp-server-livereload'),
    connect     = require('gulp-connect'),
    minifyHTML  = require('gulp-minify-html'),
    uncss       = require('gulp-uncss')
    ;


/**
 * Task for the server with livereload
 */
gulp.task('serve',function(){
    connect.server({
        //root : __dirname,
        directoryListing: false,
        open: true,
        host : '0.0.0.0',
        livereload : true,
        port : 8080,
        fallback: './index.html',
    });
});

/**
 * Concatenation of all scripts for prod
 */
gulp.task('scripts', function() {
    return gulp.src(
        [
            // All files
            'libs/jquery/dist/jquery.min.js',
            'libs/bootstrap/dist/js/bootstrap.min.js',
            'libs/angular/angular.min.js',
            'libs/angular-route/angular-route.min.js',
            'libs/firebase/firebase.js',
            'libs/angularfire/dist/angularfire.min.js',
            'libs/firebase/firebase.js',
            'libs/restangular/dist/restangular.min.js',
            'libs/angular-bootstrap/ui-bootstrap.min.js',
            'libs/angular-bootstrap/ui-bootstrap-tpls.min.js',
            'libs/angular-scroll-glue/src/scrollglue.js',
            'libs/nouislider-angular/nouislider.min.js',
            'libs/nouislider/jquery.nouislider.min.js',
            'app/models/Dropzone.js',
            './libs/angular-google-chart/ng-google-chart.min.js',
            'libs/angular-dropzone/lib/angular-dropzone.js',
            'libs/lodash/lodash.min.js',
            'libs/angular-simple-logger/dist/index.js',
            'libs/angular-google-maps/dist/angular-google-maps.min.js',
            // 'https://maps.googleapis.com/maps/api/js?libraries=places',
            'libs/angular-google-places-autocomplete/src/autocomplete.js',
            'libs/angular-socialshare/angular-socialshare.min.js',
            'libs/angular-facebook/lib/angular-facebook.js',
            'assets/js/fastclick.js',
            './app/app.js',
            './app/directives/*.js',
            './app/filters/*.js',
            './app/models/*.js',
            './app/services/*.js',
            './app/controllers/*.js',
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
             compress: false,
             output : {
             beautify : true,
             comments : true,
             }
        }))
        // Output : all.js in assets/js/
        .pipe(gulp.dest('./assets/js/'))
        .pipe(rename('all.js'))
        ;
});


// Use to compile all sass
gulp.task('sass', function () {
    return gulp
    // Compile all scss
        .src(
            [
                'assets/scss/index.scss',
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
                includePaths: ['assets/scss']
            }))
        // Output in assets/css/
        .pipe( gulp.dest('./assets/css/') )

});

// Concat CSS
gulp.task('concat-css',['sass'], function () {
    return  gulp.src(
        [
            './libs/bootstrap/dist/css/bootstrap.min.css',
            './libs/nouislider/jquery.nouislider.css',
            '.libs/angular-google-places-autocomplete/dist/autocomplete.min.css',
            './libs/angular-socialshare/angular-socialshare.min.css',
            './assets/css/index.css',
        ])
        .pipe(concat("./assets/css/index.css"))
        .pipe(gulp.dest('./'));
});


// Minify all html in build
gulp.task('html', function(){

    var opts = {
        conditionals: true,
        spare:true
    };

    return gulp.src('./partials/src/**/*.html')
        .pipe(minifyHTML(opts))
        .pipe(gulp.dest('./partials/build/'));

});

// Minify all css after running sass command
gulp.task('css', ['concat-css'], function(){
    return gulp.src(
        [
            './assets/css/index.css',
        ])
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(uncss({
            html: [
                'base.html',
                'partials/src/**/*.html',
                'footer-dev.html'
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

// Create the index.html in minified for production
gulp.task('index-min', function(){

    var opts = {
        conditionals: true,
        spare:true
    };

    return gulp.src('./index.html')
        .pipe(minifyHTML(opts))
        .pipe(gulp.dest('./index-min'));

});

// By default compile scripts & launch serve
gulp.task('default',['scripts'], function(){});

// Compile all js & lauch server then watch files
gulp.task('watch',['default'], function () {

    // On change in scss files, compile everything & concat it with bootstrap
    gulp.watch('./assets/scss/**/*.scss',['concat-css']);

    // On update of base & footer, recreate the index
    gulp.watch('./base.html',['index-html-dev']);
    gulp.watch('./footer-dev.html',['index-html-dev']);

});

// create the index.html for dev
gulp.task('index-html-dev',function(){
    return gulp.src(
        [
            'base.html',
            'footer-dev.html',
        ]
        )
        .pipe(concat('index.html'))
        .pipe(gulp.dest('./'))
});

// Create the index.html for prod
gulp.task('index-html-prod',function(){
    return gulp.src(
        [
            'base.html',
            'footer-prod.html',
        ]
        )
        .pipe(concat('index.html'))
        .pipe(gulp.dest('./'))
});

// Deployment of the files
gulp.task('deploy',['scripts','css','index-html-prod','html'],function(){});

