(function () {

    function isTestRunning() {
        return (window.__karma__) ? true : false;
    }

    var angular, jquery, _;

    var amdMgmt = {

        loadConfig: function (cb) {

            var url = (isTestRunning()) ? '/base/app/config.json' : 'config.json',
                xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = function () {
                if (xhttp.readyState == 4 && xhttp.status == 200) {
                    var config = JSON.parse(xhttp.responseText);
                    cb(config);
                }
            };

            xhttp.open('GET', url, true);
            xhttp.send();
        },

        getTestFiles: function () {
            var allTestFiles = [];
            var TEST_REGEXP = /-spec\.js$/;

            var pathToModule = function (path) {
                return path.replace(/^\/base\/app\//, '').replace(/\.js$/, '');
            };

            Object.keys(window.__karma__.files).forEach(function (file) {
                if (TEST_REGEXP.test(file)) {
                    // Normalize paths to RequireJS module names.
                    allTestFiles.push(pathToModule(file));
                }
            });

            return allTestFiles;
        },

        getAllModules: function (config) {
            var allmodules = [];
            allmodules = allmodules.concat(config.extensions).concat(config.components);
            if (isTestRunning()) {
                allmodules = allmodules.concat(amdMgmt.getTestFiles());
            }
            return allmodules;
        },

        configRequirejs: function (config) {

            require.config({
                name: 'main',
                waitSeconds: 20,
                baseUrl: isTestRunning() ? '/base/app' : '',
                paths: config.paths,
                shim: config.shim,
                priority: config.priority,
                deps: amdMgmt.getAllModules(config),
                callback: function () {
                    lifecycleMgmt.startRegistration(config, function () {
                        if (isTestRunning()) {
                            window.__karma__.start();
                        }
                    });
                }
            });
        }
    };

    var moduleMgmt = {

        baseModules: [],

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

        startRegistration: function (options, callback) {
            require(['jquery', 'angular', 'underscore'], function (_jquery_, _angular_, underscore) {

                angular = _angular_;
                jquery = _jquery_;
                _ = underscore;

                angular.element().ready(function () {
                    var cbInitComponents, cbInitApp,
                        mainModuleName = options.name || 'app';

                    moduleMgmt.baseModules = options.baseModules || [];

                    cbInitApp = function () {
                        var mainModule = moduleMgmt.registerApp(mainModuleName);
                        angular.bootstrap(document, [mainModuleName]);
                        if (callback) {
                            callback(mainModule);
                        }
                    };

                    cbInitComponents = function () {
                        lifecycleMgmt.initializeModules(jquery, options.components, 'components').done(cbInitApp);
                    };

                    if (options.extensions) {
                        lifecycleMgmt.initializeModules(jquery, options.extensions, 'extensions').done(cbInitComponents);
                    }
                    else if (options.components) {
                        lifecycleMgmt.initializeModules(jquery, options.components, 'components').done(cbInitApp);
                    }
                    else {
                        cbInitApp();
                    }
                });
            });
        },

        initializeModules: function (jquery, modules, layer) {
            var deferred = jquery.Deferred();
            require(modules, function () {
                for (var i = 0; i < arguments.length; i++) {
                    var component = arguments[i].initialize();
                    if (component) {
                        moduleMgmt.registerComponent(component, layer);
                    }
                }
                deferred.resolve(arguments);
            });
            return deferred.promise();
        }
    };

    window.legolas = {
        start: function () {
            amdMgmt.loadConfig(amdMgmt.configRequirejs);
        }
    };

})();
