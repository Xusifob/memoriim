(function() {
    'use strict';

    app.controller('LevelsCtrl', LevelsCtrl);

    LevelsCtrl.$inject = ['$scope','PlayService'];

    function LevelsCtrl($scope,PlayService) {

        var $this = this;

        $this.PlayService = PlayService;


    };
}).call(this);

