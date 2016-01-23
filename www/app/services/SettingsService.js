

(function() {
    'use strict';

    app.factory('SettingsService',SettingsService);

    function SettingsService() {

        var $this = this;



        $this.changeSetting = changeSetting;
        $this.loadSettings = loadSettings;


        // Load the settings
        loadSettings();

        function loadSettings() {
            $this.settings =
                localStorage.getItem('settings') == undefined ||
                localStorage.getItem('settings') == 'undefined' ||
                localStorage.getItem('settings') == null ? {
                    devMode: false,
                    username: '',
                    apiKey: Math.random() * 100 * Date.now()
                } : JSON.parse(localStorage.getItem('settings'));
        }

        function changeSetting(){
            localStorage.setItem('settings',JSON.stringify($this.settings));
        }


        return this;
    }
}).call(this);
