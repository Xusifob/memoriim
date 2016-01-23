(function() {
    'use strict';

    app.controller('PlayCtrl', PlayCtrl);

    PlayCtrl.$inject = ['$scope','PlayService','$window','$stateParams','$location','SettingsService'];

    function PlayCtrl($scope,PlayService,$window,$stateParams,$location,SettingsService) {

        var $this = this;



        // Méthodes de la classe HomeCtrl
        /**
         *
         * @type {click}
         */
        $this.click = click;

        /**
         *
         * @type {nextLevel}
         */
        $this.nextLevel = nextLevel;




        /**
         * Delta of time
         *
         * @type {number}
         */
        var deltaTime = 0;


        var w = angular.element($window);
        $scope.$watch(
            function () {
                return $window.innerWidth;
            },
            function () {
                resize();
            },
            true
        );

        w.bind('resize', function(){
            $scope.$apply();
        });

        var nbCardLign;
        var nbCardCol;

        /**
         *
         * Niveau en cours
         *
         * @type {number}
         */
        $this.currentLevel = $stateParams.level;

        startGame();
        // Resize en fonction de la fenetre
        $(window).resize(resize());

        /**
         * Function called to start the game
         */
        function startGame(){

            if(PlayService.levels[$this.currentLevel-1] != undefined) {
                /**
                 * Nombre de cartes par ligne
                 * @type {number}
                 */
                nbCardLign = PlayService.levels[$this.currentLevel - 1].col;

                /**
                 * Nombre de cartes par colonnes
                 * @type {number}
                 */
                nbCardCol = PlayService.levels[$this.currentLevel - 1].lig;


                /**
                 * Nombre de cartes sur le jeu
                 *
                 * @type {number}
                 */
                var nbCard = (((nbCardCol * nbCardLign) / 2)-1);


                /**
                 *
                 * Index de la carte à sauter
                 *
                 * @type {number}
                 */
                $this.jumpIndex = (nbCardLign*nbCardCol)-nbCardLign;


                /**
                 *
                 * Score du joueur
                 *
                 * @type {number}
                 */
                $this.score = nbCard * 100;

                // Variables internes
                /**
                 * Marges des cartes
                 * @type {number}
                 */
                $this.margin = nbCard >= (8*8)/2 ? 5.5 : 10;

                /**
                 *
                 * Delta de temps
                 *
                 * @type {number}
                 */
                deltaTime = 0;

                // propriétés de la class HomeCtrl


                /**
                 * Temps (en ms) ou l'utilisateur va réfléchir
                 *
                 * @type {number}
                 */
                $this.thinkTime = 0;

                /**
                 *
                 * @type {Array}
                 */
                $this.cards = [];

                /**
                 * Nombre de clic dans la partie
                 *
                 * @type {number}
                 */
                $this.nbClick = 0;

                /**
                 *
                 * Contient la première carte retournée
                 *
                 * @type {undefined}|{object}
                 */
                $this.turnCard = undefined;

                /**
                 * Nombre de cartes restantes
                 *
                 * @type {number}
                 */
                $this.cardLeft = nbCard*2;

                resize();

                // Je crée le tableau des cartes
                for (var i = 0; i < nbCard; i++) {

                    // Je défini la couleur des 2 cartes
                    var color = getRandomColor(PlayService.levels[$this.currentLevel - 1].sameColor);

                    // Je les inclus dans le tableau
                    $this.cards.push({color: color, turn: false, found: false});
                    $this.cards.push({color: color, turn: false, found: false});
                }


                // Si on est pas en mode développeur
                if (!SettingsService.settings.devMode) {

                    // Je le mélange
                    $this.cards.sort(function () {
                        return Math.random() > Math.random() ? 1 : -1;
                    });
                }
            }
        }



        function resize() {

            /**
             *
             * Largeur des cartes
             *
             * @type {number}
             */
            $this.cardWidth = ((viewport().width - (nbCardLign * $this.margin)) / nbCardLign)-8;

            /**
             *
             * hauteur des cartes
             *
             * @type {number}
             */
            $this.cardHeight = ((viewport().height - (nbCardCol * $this.margin)) / nbCardCol)-8;

        }


        /**
         *
         * Return a random color
         *
         *
         * @param nuance
         * @returns {string}
         */
        function getRandomColor(nuance) {

            var color = '#';

            if(!nuance) {
                var letters = '0123456789ABCDEF'.split('');

                for (var i = 0; i < 6; i++) {
                    color += letters[Math.floor(Math.random() * 16)];
                }
            }
            else{
                var letters = '23456789ABCE'.split('');
                color += Math.random() > Math.random() ? '55' : '33';
                color += '33';
                for (var i = 0; i < 2; i++) {
                    color += letters[Math.floor(Math.random() * 11)];
                }
            }
            return color;
        }


        /**
         *
         * Triggered on click on a card
         *
         * @param card
         * @param $index
         */
        function click(card,$index){

            // Je retourne la carte
            card.turn = true;

            // Si c'est la première carte
            if($this.turnCard == undefined && !card.found){

                // Je set la carte tournée
                $this.turnCard = card;
                $this.turnCard.index = $index;
                // Je commence le décompte pour compter les secondes ou l'utilisateur réfléchis
                deltaTime = Date.now();
            }else if(!card.found){
                // Si je clic sur la même carte, il se passe rien
                if($index != $this.turnCard.index) {
                    $this.thinkTime += Date.now() - deltaTime;
                    // Si c'est la même couleur (trouvé !)
                    if ($this.turnCard.color == card.color && card.found == false) {
                        // La carte a été trouvée
                        card.found = true;

                        // L'autre carte a été trouvée aussi
                        $this.cards[$this.turnCard.index].found = true;

                        // Il y a 2 cartes en moins à trouver
                        $this.cardLeft = $this.cardLeft -2;

                        // Je remet la première carte à 0
                        $this.turnCard = undefined;

                        if($this.cardLeft == 0)
                            finish();

                    } else {

                        // Je baisse le score lié à l'erreur
                        $this.score = $this.score-10;

                        // Sinon, je met une latence
                        setTimeout(function () {
                            // Je retourne la première carte
                            card.turn = false;
                            // Je retourne la seconde
                            $this.cards[$this.turnCard.index].turn = false;

                            // Je remet la première carte à 0
                            $this.turnCard = undefined;
                        }, 300);
                    }
                }
            }
            // J'incrémente le clic que si la carte n'a pas été déjà trouvée
            if(!card.found)
                $this.nbClick++;
        }



        /**
         * Called on finish of the game
         */
        function finish(){

            // J'update le score en fonction du temps passé
            if($this.thinkTime < PlayService.levels[$this.currentLevel-1].timeMin)
                $this.score += 100;
            else if($this.thinkTime >= PlayService.levels[$this.currentLevel-1].timeMin && $this.thinkTime < PlayService.levels[$this.currentLevel-1].timeMax){
                $this.score += 50;
            }else
                $this.score -=50;

            // J'affiche la modal
            $this.modalShow = true;

        }

        /**
         * Fonction qui lance le prochain niveau
         */
        function nextLevel(){

            // J'annonce le niveau comme fini
            PlayService.levels[$this.currentLevel-1].finish = true;
            // J'ajoute le score maximum
            PlayService.levels[$this.currentLevel-1].score = Math.max($this.score,PlayService.levels[$this.currentLevel-1].score);

            // Je sauve le tout
            PlayService.saveLevel();

            // Je redirige au prochain niveau
           $location.path('/play/' + (parseInt($this.currentLevel)+1));
        }


        /**
         * Return the viewport's current width & height into an object
         *
         * @returns {{width: *, height: *}}
         */
        function viewport() {
            var e = window, a = 'inner';
            if (!('innerWidth' in window )) {
                a = 'client';
                e = document.documentElement || document.body;
            }
            return { width : e[ a+'Width' ] , height : e[ a+'Height' ] };
        }


    };
}).call(this);

