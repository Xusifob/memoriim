(function() {
    'use strict';

    app.controller('HomeCtrl', HomeCtrl);

    HomeCtrl.$inject = ['$scope','PlayService'];

    function HomeCtrl($scope,PlayService) {

        var $this = this;

        for(var i=0;i<PlayService.levels.length;i++){
            if(PlayService.levels[i].finish != true){
                $this.nextLevel = i+1;
                break;
            }
        }

        if($this.nextLevel == undefined)
            $this.nextLevel = PlayService.levels.length;


    };
}).call(this);

