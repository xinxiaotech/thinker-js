gulp = require 'gulp'
gulp_jsdoc = require 'gulp-jsdoc3'
gulp_babel = require 'gulp-babel'

webpack = require 'webpack'

jsdocConfig = require './jsdoc.json'
webpackConfig = require './webpack.config'
webpackCompiler = webpack webpackConfig

gulp.task 'build:scripts', (done) ->
  webpackCompiler.run (err, stats) ->
    throw new gulp_util.PluginError("webpack", err) if err
    console.log(stats.toString colors: true, chunks: false)
    done()

gulp.task 'doc', (cb) ->
  compileBabel = ->
    gulp.src(['./lib/**/*.js'])
        .pipe(gulp_babel())
        .pipe(gulp.dest './tmp/lib')
  compileBabel.displayName = 'doc:compile-babel'

  compileDoc = (done) ->
    gulp.src(['./tmp/lib/**/*.js'])
        .pipe(gulp_jsdoc jsdocConfig, done)
  compileDoc.displayName = 'doc:compile-doc'

  gulp.series(compileBabel, compileDoc)(cb)

gulp.task 'build', gulp.parallel('doc', 'build:scripts')

gulp.task 'watch', ->
  gulp.watch './src/**/*', gulp.parallel('build')

gulp.task 'default', gulp.series('build', 'watch')
