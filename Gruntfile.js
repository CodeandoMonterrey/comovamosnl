module.exports = function (grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      trendings: ['trends.js', 'historial.js']
    },
    jsbeautifier: {
      modify: {
        src: ['trends.js', 'historial.js'],
        options: {
          config: '.jsbeautifyrc'
        }
      },
      verify: {
        src: ['trends.js', 'historial.js'],
        options: {
          mode: 'VERIFY_ONLY',
          config: '.jsbeautifyrc'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jsbeautifier');

  // Default task
  grunt.registerTask('default', ['jshint']);
  grunt.registerTask('clean', [
    'jsbeautifier:modify',
    'jshint'
  ]);
  grunt.registerTask('verify', [
    'jsbeautifier:verify',
    'jshint'
  ]);
};
