module.exports = function(grunt) {

    grunt.initConfig({
        jsbeautifier: {
            files: [
                "Gruntfile.js",
                "src/**/*.js",
                "test/**/*.js",
                "dist/virt-dom.js"
            ]
        },
        envify: {
            options: {
                env: {
                    NODE_ENV: "production"
                }
            },
            index: {
                files: {
                    "dist/virt-dom.min.js": ["dist/virt-dom.js"]
                }
            }
        },
        uglify: {
            index: {
                files: {
                    "dist/virt-dom.min.js": ["dist/virt-dom.min.js"]
                }
            }
        },
        jshint: {
            options: {
                es3: true,
                unused: true,
                curly: true,
                eqeqeq: true,
                expr: true,
                eqnull: true,
                proto: true
            },
            files: [
                "Gruntfile.js",
                "src/**/*.js",
                "test/**/*.js"
            ]
        }
    });

    grunt.loadNpmTasks("grunt-jsbeautifier");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-envify");
    grunt.registerTask("default", ["jsbeautifier", "jshint"]);
};
