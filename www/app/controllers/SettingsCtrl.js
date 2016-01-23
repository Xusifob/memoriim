(function() {
    'use strict';

    app.controller('SettingsCtrl', SettingsCtrl);

    SettingsCtrl.$inject = ['$scope','PlayService','SettingsService'];

    function SettingsCtrl($scope,PlayService,SettingsService) {

        var $this = this;

        $this.SettingsService = SettingsService;


        $this.reinitialisate = reinitialisate;

        /**
         * Réinisialise tous les scores, la partie
         *
         */
        function reinitialisate(){

            localStorage.clear();
            PlayService.loadLevels();
            SettingsService.loadSettings();
            $this.rein = true;
        }

    };
}).call(this);

