(function() {
    'use strict';

    app.controller('ClassmentCtrl', ClassmentCtrl);

    ClassmentCtrl.$inject = ['$scope','$http','SettingsService','PlayService'];

    function ClassmentCtrl($scope,$http,SettingsService,PlayService) {

        var $this = this;

        $this.SettingsService = SettingsService;

        $this.PlayService = PlayService;


    };
}).call(this);

