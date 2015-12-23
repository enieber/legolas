module.exports = function (config) {

    config.set({

        basePath: './',

        files: [
            {pattern: 'vendor/**/*.js', included: false},
            {pattern: 'src/**/*.js', included: false},
            'test/legolas.spec.js'
        ],

        autoWatch: false,

        singleRun: true,

        colors: true,

        logLevel: config.LOG_DEBUG,

        frameworks: ['jasmine'],

        browsers: ['Chrome'], //browsers: ['Chrome', 'Safari', 'PhantomJS'],

        preprocessors: {
            'src/**/*.js': ['coverage']
        },

        reporters: ['junit', 'coverage', 'progress'],

        junitReporter: {
            outputFile: 'dist/reports/junit/TESTS-xunit.xml',
            useBrowserName: false
        },

        coverageReporter: {
            type: 'lcov',
            dir: 'dist/reports/coverage/',
            subdir: '.'
        }

    });
};
