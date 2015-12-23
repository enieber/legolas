module.exports = {

    getConfig: function (env, grunt) {
        return {

            sonarRunner: {
                analise: {

                    options: {
                        debug: true,
                        separator: '\n',
                        sonar: {
                            working: {
                                directory: env.dist + '/sonar'
                            },
                            language: 'js',
                            sourceEncoding: 'UTF-8',
                            host: {
                                url: 'http://sonar.azi.com.br'
                            },
                            login: 'hudsonci',
                            password: 'aznoutes',

                            javascript: {
                                lcov: {
                                    reportPath: env.dist + '/reports/coverage/lcov.info'
                                },
                                jstestdriver: {
                                    reportsPath: env.dist + '/reports/junit'
                                }
                            },

                            projectKey: env.projectKey,
                            projectName: env.projectName,
                            projectVersion: env.projectVersion,
                            tests: env.test,

                            sources: [
                                env.src
                            ].join(','),

                            exclusions: []
                        }
                    }
                }
            }


        };
    },

    loadNpmTasks: function (grunt) {
        grunt.loadNpmTasks('grunt-sonar-runner');
    }

};


