import gulp from 'gulp'
import babel from 'gulp-babel'

gulp.task('default', [])

gulp.task('build', () => {
  return gulp.src('src/**/*.js')
    .pipe(babel({presets: ['hyeonu']}))
    .pipe(gulp.dest('bin'))
})
