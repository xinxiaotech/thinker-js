jsdoc = require 'gulp-jsdoc3'
gulp = require 'gulp'
gulp_coffee = require 'gulp-coffee'

jsdocConfig = require('./jsdoc.json')

gulp.task 'doc', (cb) ->
  compileCoffee = ->
    gulp.src(['./src/**/*.coffee'])
        .pipe(gulp_coffee())
        .pipe(gulp.dest './tmp/src')
  compileCoffee.displayName = 'doc:compile-coffee'

  compileDoc = (done) ->
    gulp.src(['./tmp/src/**/*.js'])
        .pipe(jsdoc jsdocConfig, done)
  compileDoc.displayName = 'doc:compile-doc'

  gulp.series(compileCoffee, compileDoc)(cb)

gulp.task 'build', gulp.parallel('doc')

gulp.task 'watch', ->
  gulp.watch './src/**/*', gulp.parallel('doc')

gulp.task 'default', gulp.series('build', 'watch')
