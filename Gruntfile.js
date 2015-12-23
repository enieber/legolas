'use strict';

var ENV = {

    src: 'src',
    dist: 'dist',
    test: 'test',
    main: 'legolas',

    browsers: ['Chrome'],

    projectKey: 'br.com.azi.framework:legolas',
    projectName: 'legolas',
    projectVersion: '0.0.1',

    paths: {
        jquery: '../vendor/jquery/dist/jquery',
        angular: '../vendor/angular/angular',
        angularMocks: '../vendor/angular-mocks/angular-mocks',
        text: '../vendor/requirejs-text/text'
    },
    shim: {
        angular: {
            exports: 'angular',
            deps: [
                'jquery'
            ]
        },
        angularMocks: {
            deps: [
                'angular'
            ],
            exports: 'angular.mock'
        }
    },
    exclude: ['jquery', 'angular']
};

function loadTasks() {
    var clean = require('./tasks/clean'),
        doc = require('./tasks/doc'),
        copy = require('./tasks/copy'),
        test = require('./tasks/test'),
        eslint = require('./tasks/eslint'),
        sonar = require('./tasks/sonar');

    return [clean, doc, copy, test, eslint, sonar];
}

function initConfig(grunt, tasks) {

    var _ = require('underscore'), configs = {};

    tasks.forEach(function (task) {
        configs = _.extend(configs, task.getConfig(ENV, grunt));
    });

    grunt.initConfig(configs);
}

function loadNpmTasks(grunt, tasks) {
    tasks.forEach(function (task) {
        task.loadNpmTasks(grunt);
    });
}

function registerTasks(grunt) {
    grunt.registerTask('docs', ['clean', 'ngdocs', 'eslint:client']);  //, 'sonarRunner:analise']);
    grunt.registerTask('test', ['karma']);
    grunt.registerTask('dist', ['docs', 'test', 'copy']);
    grunt.registerTask('default', ['dist']);
}

module.exports = function (grunt) {

    var tasks = loadTasks();

    initConfig(grunt, tasks);

    loadNpmTasks(grunt, tasks);

    registerTasks(grunt);
};