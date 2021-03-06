/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    // Task configuration.
    concat: {
      options: {
        stripBanners: true
      },
      dist: {
        src: ['lib/functions.js', 'lib/trigger.js'],
        dest: 'packaging/includes/main.js'
      }
    },
    jshint: {
      options: {
        curly: false,
        eqeqeq: true,
        immed: true,
        latedef: false,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {
            window: true
        },
		multistr: true
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib_test: {
        src: ['lib/*.js', 'test/**/*.js']
      }
    },
    qunit: {
      files: ['test/**/*.html']
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      lib_test: {
        files: '<%= jshint.lib_test.src %>',
        tasks: ['jshint:lib_test', 'qunit']
      }
    },
	mkdir: {
		all: {
			options: {
				create: ["packaging", "dist"]
			}
		}
	},
	copy: {
		main: {
			files: [
				{expand: true, src: ["manifest.json", "options.html", "options.js", "css/*.css"], dest: "packaging/"},
                {expand: true, src: ["icons/*"], dest: "packaging/", filter: "isFile"},
                {expand: true, src: ["lib/backgrounds.js"], dest: "packaging/"}
			]
		}
	},
	crx: {
		pixiv: {
			src: "packaging/",
			dest: "dist/",
			privateKey: "~/.ssh/browser-extensions-key.pem"
		}
	},
    compress: {
        main: {
            options: {
                mode :"zip",
                archive: "dist/<%= pkg.title || pkg.name %>-<%= pkg.version %>.zip"
            },
            src: ["packaging/*"]
        }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mkdir');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-crx');
  grunt.loadNpmTasks('grunt-contrib-compress');

  // Default task.
  grunt.registerTask('default', ['jshint', 'qunit', 'mkdir', 'concat', 'copy', 'crx']);

};
