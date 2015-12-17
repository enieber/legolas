define(
    [
        'underscore',
        'jquery',
        'bootstrap',
        'angular',
        'angularRouter',
        'angularLocale',
        'angularCookie',
        'angularMocks',
        'angularAnimate'

    ],
    function (_, jquery, bootstrap, angular) {

        var moduleMgmt = {

            baseModules: ['ui.router', 'ngCookies'],

            extensionsModules: [],

            componentsModules: [],

            mockModules: (document.URL.match(/\?dev/)) ? ['ngMockE2E'] : [],

            extensionsDependencies: function () {
                return this.baseModules
                    .concat(this.mockModules);
            },

            componentsDependencies: function () {
                return this.baseModules
                    .concat(this.extensionsModules)
                    .concat(this.mockModules);
            },

            appDependencies: function () {
                return this.baseModules
                    .concat(this.extensionsModules)
                    .concat(this.componentsModules)
                    .concat(this.mockModules);
            },

            registerApp: function (name) {
                return angular.module(name, this.appDependencies());
            },

            registerComponent: function (component, layer) {

                var modulo;

                if (layer === 'components') {
                    this.componentsModules.push(component.name);
                    modulo = angular.module(component.name, this.componentsDependencies());
                }
                else {
                    this.extensionsModules.push(component.name);
                    modulo = angular.module(component.name, this.extensionsDependencies());
                }

                _.each(component.controllers, function (controller) {
                    modulo.controller(controller[0], controller[1]);
                });

                _.each(component.configs, function (config) {
                    modulo.config(config);
                });

                _.each(component.directives, function (directive) {
                    modulo.directive(directive[0], directive[1]);
                });

                _.each(component.services, function (service) {
                    modulo.service(service[0], service[1]);
                });

                _.each(component.runs, function (run) {
                    modulo.run(run);
                });

                _.each(component.constants, function (constant) {
                    modulo.constant(constant[0], constant[1]);
                });

            }

        };

        var lifecycleMgmt = {

            start: function (options) {
                angular.element().ready(function () {
                    lifecycleMgmt.initializeModules(options.extensions, 'extensions').done(function () {
                        lifecycleMgmt.initializeModules(options.components, 'components').done(function () {
                            moduleMgmt.registerApp(options.name);
                            angular.bootstrap(document, [options.name]);
                            options.callback();
                        });
                    });

                });
            },

            initializeModules: function (modules, layer) {
                var deferred = jquery.Deferred();
                require(modules, function () {
                    for (var i = 0; i < arguments.length; i++) {
                        var component = arguments[i].initialize();
                        if (component) {
                            moduleMgmt.registerComponent(component, layer)
                        }
                    }
                    deferred.resolve(arguments);
                });
                return deferred.promise();
            }
        };

        return {

            start: lifecycleMgmt.start

        };
    });