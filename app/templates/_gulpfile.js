// Node modules
var fs = require('fs'), vm = require('vm'), merge = require('deeply'), chalk = require('chalk'), es = require('event-stream');

// Gulp and plugins
var gulp = require('gulp'), rjs = require('gulp-requirejs-bundler'), concat = require('gulp-concat'), clean = require('gulp-clean'),
    replace = require('gulp-replace'), uglify = require('gulp-uglify'), htmlreplace = require('gulp-html-replace')<% if(!usesTypeScript) { %>, browserSync = require('browser-sync')<% } %> <% if(usesTypeScript) { %>, typescript = require('gulp-tsc')<% } %> <% if(usesCoffeeScript) { %>, coffee = require('gulp-coffee'), gutil = require('gulp-util') <% } %>;

// Config
var requireJsRuntimeConfig = vm.runInNewContext(fs.readFileSync('<%= sourceBase %>/app/require.config.js') + '; require;');
    requireJsOptimizerConfig = merge(requireJsRuntimeConfig, {
        out: 'scripts.js',
        baseUrl: './<%= sourceBase %>',
        name: 'app/startup',
        paths: {
            requireLib: 'bower_modules/requirejs/require'
        },
        include: [
            'requireLib',
            'components/nav-bar/nav-bar',
            'components/home-page/home',
            'text!components/about-page/about.html'
        ],
        insertRequire: ['app/startup'],
        bundles: {
            // If you want parts of the site to load on demand, remove them from the 'include' list
            // above, and group them into bundles here.
            // 'bundle-name': [ 'some/module', 'another/module' ],
            // 'another-bundle-name': [ 'yet-another-module' ]
        }
    });
<% if (usesTypeScript) { %>
// Compile all .ts files, producing .js and source map files alongside them
gulp.task('ts', function() {
    return gulp.src(['**/*.ts'])
        .pipe(typescript({
            module: 'amd',
            sourcemap: true,
            outDir: './'
        }))
        .pipe(gulp.dest('./'));
});
<% } %>

<% if (usesCoffeeScript) { %>
// Compile all .coffee files, producing .js
gulp.task('coffee', function() {
  return gulp.src('./<%= sourceBase %>/**/*.coffee')
    .pipe(coffee({bare: true}).on('error', gutil.log))
    .pipe(gulp.dest('./<%= sourceBase %>/'))
});
<% } %>

// Discovers all AMD dependencies, concatenates together all required .js files, minifies them
gulp.task('js', <% if (usesTypeScript) { %>['ts'], <% } %> <% if (usesCoffeeScript) { %>['coffee'], <% } %>function () {
    return rjs(requireJsOptimizerConfig)
        .pipe(uglify({ preserveComments: 'some' }))
        .pipe(gulp.dest('./dist/'));
});

// Concatenates CSS files, rewrites relative paths to Bootstrap fonts, copies Bootstrap fonts
gulp.task('css', function () {
    var bowerCss = gulp.src('<%= sourceBase %>/bower_modules/components-bootstrap/css/bootstrap.min.css')
            .pipe(replace(/url\((')?\.\.\/fonts\//g, 'url($1fonts/')),
        appCss = gulp.src('<%= sourceBase %>/css/*.css'),
        combinedCss = es.concat(bowerCss, appCss).pipe(concat('css.css')),
        fontFiles = gulp.src('./<%= sourceBase %>/bower_modules/components-bootstrap/fonts/*', { base: './<%= sourceBase %>/bower_modules/components-bootstrap/' });
    return es.concat(combinedCss, fontFiles)
        .pipe(gulp.dest('./dist/'));
});

// Copies index.html, replacing <script> and <link> tags to reference production URLs
gulp.task('html', function() {
    return gulp.src('./<%= sourceBase %>/index.html')
        .pipe(htmlreplace({
            'css': 'css.css',
            'js': 'scripts.js'
        }))
        .pipe(gulp.dest('./dist/'));
});
<% if (!usesTypeScript) { %>
// Removes all files from ./dist/
gulp.task('clean', function() {
    return gulp.src('./dist/**/*', { read: false })
        .pipe(clean());
});
<% } else { %>
// Removes all files from ./dist/, and the .js/.js.map files compiled from .ts
gulp.task('clean', function() {
    var distContents = gulp.src('./dist/**/*', { read: false }),
        generatedJs = gulp.src(['<%= sourceBase %>/**/*.js', '<%= sourceBase %>/**/*.js.map'<% if(includeTests) { %>, 'test/**/*.js', 'test/**/*.js.map'<% } %>], { read: false })
            .pipe(es.mapSync(function(data) {
                // Include only the .js/.js.map files that correspond to a .ts file
                return fs.existsSync(data.path.replace(/\.js(\.map)?$/, '.ts')) ? data : undefined;
            }));
    return es.merge(distContents, generatedJs).pipe(clean());
});
<% } %>


<% if (!usesTypeScript) { %>
gulp.task('sync', function() {
    browserSync({
        server: {
            baseDir: "./dist/"
        }
    });
});

gulp.task('debugSync', function() {
    browserSync({
        server: {
            baseDir: "./<%= sourceBase %>/"
        }
    });
});

gulp.task('reload', function() {
    browserSync.reload();
});

gulp.task('production', ['html', 'js', 'css', 'sync'], function() {
    gulp.watch(["<%= sourceBase %>/**/*.html"], ["html","reload"]);
    gulp.watch(["<%= sourceBase %>/**/*.js", "<%= sourceBase %>/**/*.coffee"], ["js", "reload"]);
    gulp.watch(["<%= sourceBase %>/**/*.css"], ["css", "reload"]);
    console.log('\nPlaced optimized files in ' + chalk.magenta('dist/\n'));
});

gulp.task("debug", [<% if (usesCoffeeScript) { %>'coffee', <% } %>"debugSync"], function() {
    <% if (usesCoffeeScript) { %> gulp.watch(["<%= sourceBase %>/**/*.coffee"], ["coffee"]);<% } %>
    gulp.watch(["<%= sourceBase %>/**/*.js", "<%= sourceBase %>/**/*.html"], ["reload"]);
});

<% } %>

gulp.task('default', ['html', 'js', 'css'], function(callback) {
    callback();
    console.log('\nPlaced optimized files in ' + chalk.magenta('dist/\n'));
});