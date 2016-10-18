gulp = require 'gulp'
gulp_jsdoc = require 'gulp-jsdoc3'
gulp_babel = require 'gulp-babel'

jsdocConfig = require './jsdoc.json'

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

gulp.task 'build', gulp.parallel('doc')

gulp.task 'watch', ->
  gulp.watch './src/**/*', gulp.parallel('build')

gulp.task 'default', gulp.series('build', 'watch')
