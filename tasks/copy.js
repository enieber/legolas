module.exports = {

    getConfig: function (env) {
        return {
            copy: {
                all: {
                    expand: true,
                    cwd: env.src,
                    src: [
                        'legolas.js'
                    ],
                    dest: env.dist
                }
            }
        };
    },

    loadNpmTasks: function (grunt) {
        grunt.loadNpmTasks('grunt-contrib-copy');
    }

};