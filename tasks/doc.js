module.exports = {

    getConfig: function (env) {
        return {
            ngdocs: {
                options: {
                    dest: env.dist + '/doc'
                },
                all: {
                    src: [env.src + '/**/*.js']
                }
            }
        };
    },

    loadNpmTasks: function (grunt) {
        grunt.loadNpmTasks('grunt-ngdocs');
    }

};