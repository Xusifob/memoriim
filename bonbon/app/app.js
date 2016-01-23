var app = (function() {
    'use strict';

    angular
        .module('app',
            [
                // 'restangular',
                // 'ui.bootstrap',
                'ui.router',

            ] )
        .constant('ENV','dev')
        .config(config)
        .run(run)
    ;

    function run(){

    }


    function config($stateProvider, $urlRouterProvider,ENV) {

        var templateDir = 'partials/';
        templateDir += ENV == 'dev' ? 'src/' : 'build/';


        $stateProvider.state('home', {
                url: '/',
                templateUrl: templateDir + 'home.html',
                controller: 'HomeCtrl',
                controllerAs : 'Hc'
            })
            .state('play', {
                url: '/play/:level',
                templateUrl: templateDir + 'play.html',
                controller: 'PlayCtrl',
                controllerAs : 'Hc'
            })
            .state('levels', {
                url: '/levels/',
                templateUrl: templateDir + 'levels.html',
                controller: 'LevelsCtrl',
                controllerAs : 'Hc'
            })
            .state('settings', {
                url: '/settings/',
                templateUrl: templateDir + 'settings.html',
                controller: 'SettingsCtrl',
                controllerAs : 'Hc'
            })
            .state('classment', {
                url: '/classment/',
                templateUrl: templateDir + 'classment.html',
                controller: 'ClassmentCtrl',
                controllerAs : 'Hc'
            })
        ;

        $urlRouterProvider.otherwise('/');
    }
    return angular.module('app');
}).call(app);

