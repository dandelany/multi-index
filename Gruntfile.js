var _ = require('lodash');
'use strict';

module.exports = function(grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    var config = {
        src: 'src',
        dist: 'dist',
        build: 'build',
        jsToBuild: ['src/multi-index.js']
    };

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        config: config,

        // clean out old files from build folders
        clean: {
            build: {
                files: [{
                    dot: true,
                    src: ['<%= config.build %>/*', '!<%= config.build %>/.git*']
                }]
            }
        },

        // copy static asset files from src/ to build/[dev or dist]
        //copy: {
        //    dev: {
        //        files: [
        //            {
        //                expand: true,
        //                dot: true,
        //                cwd: config.src,
        //                dest: config.build,
        //                src: config.filesToCopy
        //            }
        //        ]
        //    },
        //    dist: {
        //        files: [
        //            {
        //                expand: true,
        //                dot: true,
        //                cwd: config.src,
        //                dest: config.buildDist,
        //                src: config.filesToCopy
        //            }
        //        ]
        //    }
        //},
        //
        // bundle JS with browserify
        //browserify: {
        //    dev: {
        //        options: {
        //            transform: ['babelify'],
        //            browserifyOptions: {debug: true}
        //        },
        //        files: makeBuildSrcPathObj(config.jsToBuild, config.buildDev)
        //    },
        //    dist: {
        //        options: {
        //            transform: ['babelify'],
        //        },
        //        files: makeBuildSrcPathObj(config.jsToBuild, config.buildDist)
        //    }
        //},
        //
        //// compile LESS to CSS
        //less: {
        //    dev: {
        //        files: makeBuildSrcPathObj(config.lessToBuild, config.buildDev)
        //    },
        //    dist: {
        //        options: {
        //            cleancss: true
        //        },
        //        files: makeBuildSrcPathObj(config.lessToBuild, config.buildDist)
        //    }
        //},
        //
        //// run uglify on JS to minify it
        //uglify: {
        //    dist: {
        //        files: makeBuildBuildPathObj(config.jsToBuild, config.buildDist)
        //    }
        //},

        //// web server for serving files from build/[dev or dist]
        //connect: {
        //    dev: {
        //        options: {
        //            port: '4949',
        //            base: config.buildDev
        //        }
        //    },
        //    dist: {
        //        options: {
        //            port: '4949',
        //            base: config.buildDist
        //        }
        //    }
        //},

        babel: {
            options: {
                sourceMap: true
            },
            build: {
                files: {
                    "build/multi-index.js": "src/multi-index.js"
                }
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
            }
            //copy: {
            //    files: [
            //        '<%= config.src %>/{,*/}*.{gif,jpeg,jpg,png,webp,gif,ico}',
            //        '<%= config.src %>/fonts/{,*/}*.*'
            //    ],
            //    tasks: ['copy:dev', 'shell:sayCopied']
            //}
        },

        shell: {
            sayBuiltJs: { command: 'say "built js" -v Cellos' },
            sayCopied: { command: 'say "copied files" -v Cellos' }
        }
    });

    grunt.registerTask('build', [
        'clean:build',
        'babel:build'
    ]);
    grunt.registerTask('dev', [
        'clean:build',
        'babel:build',
        'watch'
    ]);

    // Dev tasks
    //grunt.registerTask('buildDev', [
    //    'clean:dev',      // clean old files out of build/dev
    //    'copy:dev',       // copy static asset files from app/ to build/dev
    //    'browserify:dev', // bundle JS with browserify
    //    'less:dev',       // compile LESS to CSS
    //]);
    //grunt.registerTask('serveDev', [
    //    'buildDev',
    //    'connect:dev',     // web server for serving files from build/dev
    //    'watch'            // watch src files for changes and rebuild when necessary
    //]);
    //
    //// Distribution tasks
    //grunt.registerTask('buildDist', [
    //    'clean:dist',      // clean old files out of build/dist
    //    'copy:dist',       // copy static asset files from app/ to build/dist
    //    'browserify:dist', // bundle JS with browserify
    //    'less:dist',       // compile LESS to CSS
    //    'uglify:dist',     // minify JS files
    //]);
    //grunt.registerTask('serveDist', [
    //    'buildDist',
    //    'connect:dev',     // web server for serving files from build/dev
    //    'watch'            // watch src files for changes and rebuild when necessary
    //]);

    // Task aliases
    //grunt.registerTask('build', ['buildDist']);
    //grunt.registerTask('serve', ['serveDev']);
    //grunt.registerTask('debug', ['serveDev']);
};