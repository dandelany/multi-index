var _ = require('lodash');
'use strict';

module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);

    var config = {
        src: 'src',
        dist: 'dist'
    };

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        config: config,

        // clean out old files from build folders
        clean: {
            build: {
                files: [{
                    dot: true,
                    src: ['<%= config.dist %>/*', '!<%= config.dist %>/.git*']
                }]
            }
        },

        babel: {
            options: {
                sourceMap: true
            },
            build: {
                files: {
                    "dist/multi-index.js": "src/multi-index.js"
                }
            }
        },

        simplemocha: {
            all: {
                src: ['test/**/*.js']
            }
        },

        // watch files for changes and run appropriate tasks to rebuild build/dev
        watch: {
            grunt: {
                files: 'Gruntfile.js',
                tasks: ['build', 'shell:sayBuiltJs']
            },
            build: {
                files: "src/multi-index.js",
                tasks: ['build', 'shell:sayBuiltJs']
            },
            test: {
                files: 'test/**/*.js',
                tasks: ['test', 'shell:sayPassedTests']
            }
        },

        shell: {
            //sayBuiltJs: { command: 'say "built" -v Cellos' }, // enable talking build indicator
            //sayPassedTests: { command: 'say "passed tests" -v Cellos' } // enable talking test indicator
            sayBuiltJs: { command: 'echo built' },
            sayPassedTests: { command: 'echo passed tests' }
        }
    });

    grunt.registerTask('test', 'simplemocha');

    grunt.registerTask('build', [
        'clean:build',
        'babel:build',
        'test'
    ]);

    grunt.registerTask('dev', [
        'build',
        'watch'
    ]);

    grunt.registerTask('default', 'dev');
};