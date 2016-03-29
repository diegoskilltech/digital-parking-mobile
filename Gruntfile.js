module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jade: {
			compile: {
				options: {
					pretty: true,
					banner: '/*! <%= pkg.name %> 0.0.1 HTML */\n'
				},
				files: {
					'mobile/www/index.html': 'src/views/index.jade',
					'mobile/www/signup.html': 'src/views/signup.jade',
					'mobile/www/login.html': 'src/views/login.jade',
					'mobile/www/parking.html': 'src/views/parking.jade'
				}
			}
		},

		stylus: {
			compile: {
				options: {
					banner: '/*! <%= pkg.name %> 0.0.1 Styles */\n'
				},

				files: {
					'mobile/www/css/digital-parking.css': 'src/css/digital-parking.styl' // 1:1 compile
				}
			}
		},
		
		watch: {
			grunt: { files: ['Gruntfile.js'] },
			jade: {
				files: 'src/views/**/*.jade',
				tasks: ['jade']
			},
			stylus: {
				files: 'src/css/**/*.styl',
				tasks: ['stylus']
			}
		}
	});


	grunt.loadNpmTasks('grunt-contrib-stylus');
	grunt.loadNpmTasks('grunt-contrib-jade');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['jade', 'stylus', 'watch']);
};