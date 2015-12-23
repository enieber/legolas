module.exports = {

    getConfig: function (env) {
        return {
            eslint: {
                client: {
                    src: [env.src + '/**/*.js'],
                    options: {
                        configFile: ".eslintrc.json"
                    }
                }
            }
        };
    },

    loadNpmTasks: function (grunt) {
        grunt.loadNpmTasks('gruntify-eslint');
    }

};