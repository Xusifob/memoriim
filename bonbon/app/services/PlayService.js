

(function() {
    'use strict';

    app.factory('PlayService',PlayService);

    function PlayService() {

        var $this = this;

        $this.saveLevel = saveLevel;
        $this.loadLevels = loadLevels;


        function loadLevels() {

            /**
             *
             * Différents niveaux du jeu
             *
             * @type {*[]}
             */
            $this.levels =
                localStorage.getItem('levels') == undefined || localStorage.getItem('levels') == 'undefined' || localStorage.getItem('levels') == null ?
                    [
                        {
                            col: 3,
                            lig: 2,
                            sameColor: false,
                            finished: false,
                            score: 0,
                            timeMin: 2,
                            timeMax: 6
                        },
                        {
                            col: 4,
                            lig: 3,
                            sameColor: false,
                            finished: false,
                            score: 0,
                            timeMin: 5,
                            timeMax: 15
                        },
                        {
                            col: 4,
                            lig: 4,
                            sameColor: false,
                            finished: false,
                            score: 0,
                            timeMin: 7,
                            timeMax: 18
                        },
                        {
                            col: 4,
                            lig: 4,
                            sameColor: true,
                            finished: false,
                            score: 0,
                            timeMin: 7,
                            timeMax: 18
                        },
                        {
                            col: 5,
                            lig: 4,
                            sameColor: false,
                            finished: false,
                            score: 0,
                            timeMin: 7,
                            timeMax: 18
                        },
                        {
                            col: 6,
                            lig: 4,
                            sameColor: false,
                            finished: false,
                            score: 0,
                            timeMin: 15,
                            timeMax: 30
                        },
                        {
                            col: 6,
                            lig: 4,
                            sameColor: true,
                            finished: false,
                            score: 0,
                            timeMin: 15,
                            timeMax: 30
                        },
                        {
                            col: 8,
                            lig: 5,
                            sameColor: false,
                            finished: false,
                            score: 0,
                            timeMin: 25,
                            timeMax: 50
                        },
                        {
                            col: 8,
                            lig: 5,
                            sameColor: true,
                            finished: false,
                            score: 0,
                            timeMin: 25,
                            timeMax: 50
                        },
                        {
                            col: 12,
                            lig: 10,
                            sameColor: true,
                            finished: false,
                            score: 0,
                            timeMin: 25,
                            timeMax: 50
                        }
                    ] : JSON.parse(localStorage.getItem('levels'));


        }

        /** Save the level on launch (to avoid bugs on startup) **/
        loadLevels();
        saveLevel();

        /**
         * Save the level
         */
        function saveLevel(){
            localStorage.setItem('levels',JSON.stringify($this.levels));
        }

        return this;
    }
}).call(this);
