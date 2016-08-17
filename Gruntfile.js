module.exports = function(grunt) {

  'use strict';
  // require it at the top and pass in the grunt instance
  require('time-grunt')(grunt);

  // Project configuration.
  grunt.initConfig({

    // Project metadata
    pkg: grunt.file.readJSON('package.json'),

    /**
     * START: Assemble Part
     */
    // <%= site %> metadata comes from this file
    site: grunt.file.readYAML('.assemble.yml'),

    assemble: {
      options: {
        flatten: true,
        assets: '<%= site.assets %>',

        // Metadata
        pkg: '<%= pkg %>',
        site: '<%= site %>',
        data: ['<%= site.data %>/**/*.json'],
        helpers: ['<%= site.helpers %>/*.js'],
        plugins: '<%= site.plugins %>',

        // General templates
        partials: ['<%= site.includes %>/**/*.hbs'],
        layouts: '<%= site.layouts %>',
        layoutext: '<%= site.layoutext %>',
        layout: '<%= site.layout %>',

        // Pattern Lab templates
        patterns: {
          atoms: ['<%= site.atoms %>/**/*.hbs'],
          molecules: ['<%= site.molecules %>/**/*.hbs'],
          organisms: ['<%= site.organisms %>/**/*.hbs'],
          templates: ['<%= site.templates %>/**/*.hbs'],
        }
      },

      // 'pages' are specified in the src
      site: {
        src: ['<%= site.pages %>/*.hbs', 'src/*.hbs'],
        dest: '<%= site.dest %>/'
      },

      patterns: {
        options: {
          layout: 'styleguide',
          permalinks: {
            preset: 'pretty',
            structure: ':pattern',
            patterns: [
              {
                pattern: /:pattern/,
                replacement: function(src) {
                  return this.src.split('/')[1];
                }
              }
            ]
          }
        },
        src: ['<%= site.patterns %>/**/*.hbs'],
        dest: '<%= site.styleguide %>/_patterns/'
      },
    },
    /**
     * END: Assemble Part
     */

    clean: {
      examples: ['<%= assemble.examples.dest %>/**'],
      build: ["js-min/*", "css/*", "css-min/*"]
    },

    compass: {
      dist: {
        options: {
          config: 'config.rb',
          sourcemap: true
        }
      }
    },

    concat: {
      js: {
        options: {
          separator: '\n\r',
          sourceMap: true
        },
        src: [
          'js/app.js',
          ['<%= site.patterns %>/**/*.js']
        ],
        dest: 'js/app.pkgd.js'
      }
    },

    autoprefixer: {
      options: {
        browsers: ['last 3 version'],
        map: true
      },
      multiple_files: {
        expand: true,
        flatten: true,
        src: 'css/*.css',
        dest: 'css/'
      }
    },

    /*cssmin: {
      target: {
        files: [{
          expand: true,
          flatten: true,
          cwd: 'css/',
          src: ['*.css', '!*.min.css'],
          dest: '_dist/assets/css',
          ext: '.min.css'
        }]
      }
    },*/

    uglify: {
      js: {
        options: {
          sourceMap: true
        },
        files: [{
          expand: false,
          src: 'js/app.pkgd.js',
          dest: 'js/app.pkgd.js'
        }]
      }
    },

    copy: {
      main: {
        files: [
          // includes files within path
          {expand: true, src: ['css/**/*'], dest: '_dist/assets/', filter: 'isFile'},
          {expand: true, src: ['js/**/*'], dest: '_dist/assets/', filter: 'isFile'},
          {expand: true, src: ['images/**/*'], dest: '_dist/assets/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['<%= site.patterns %>/**/*.gif', '<%= site.patterns %>/**/*.jpg', '<%= site.patterns %>/**/*.svg', '<%= site.patterns %>/**/*.png', '<%= site.patterns %>/**/*.jpeg'], dest: '_dist/assets/images', filter: 'isFile'},
          // copy styleguide files
          {expand: true, flatten: true, src: ['templates/styleguide/**/*'], dest: '_dist/_styleguide/'}
        ],
      }
    },

    watch: {

      html: {
        files: ['*.html', '<%= site.patterns %>/*hbs'],
        tasks: ['assemble', 'copy:main'],
        options: {
          livereload: true
        }
      },

      twig: {
        files: ['*.twig'],
        options: {
          livereload: true
        }
      },

      js: {
        files: ['js/*.js', '<%= site.patterns %>/**/*.js'],
        tasks: ['concat:js', 'uglify:js', 'assemble', 'copy:main'],
        options: {
          livereload: true
        }
      },

      sass: {
        files: ['scss/**/*.scss', '<%= site.patterns %>/**/*.scss'],
        tasks: ['compass:dist', 'autoprefixer'/*, 'cssmin:target'*/, 'assemble', 'copy:main'],
        options: {
          livereload: true,
          spawn : false       // for grunt-contrib-watch v0.5.0+, "nospawn: true" for lower versions.
        }
      }

    }


  });

  // Load Assemble
  grunt.task.loadNpmTasks('assemble');
  // load all plugins from the "package.json"-file
  require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

  // The default task to run with the `grunt` command
  grunt.registerTask('default', ['watch', 'assemble']);

  grunt.registerTask('assemble-html', ['assemble', 'copy:main']);

  grunt.registerTask('clean-build', ['clean:build']);
  grunt.registerTask('cssmin', ['cssmin:target']);

  grunt.registerTask(
      'build',
      'Build this website ... yeaahhh!',
      [ 'clean:build', 'concat:js', 'uglify:js', 'compass:dist', 'autoprefixer', 'assemble', 'copy:main']
  );
};
