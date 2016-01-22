# je passe les json de prod dans les assets
mv www/app/json-prod.js www/app/directives/json-prod.js
mv www/app/directives/json.js www/app/json.js

#exit

#deployment gulp
gulp deploy
    # Comprends
        # Concaténation & minification des scripts
        # Compilation des sass, Concaténation & minifaction des css
        # Création du fichier index.html de prod
        # Minification des html


# Je passe le site en prod
sed -i 's/\"ENV","dev"/\"ENV","prod"/' ./www/assets/js/all.js

mv www/partials/src ../src
mv www/app ../app
#mv www/libs ../libs
mv www/assets/scss ../scss

#echo "Please enter a commit message "
#read commit_message
#
#
## J'ajoute le tout a bitbuckey
#git add .
#git commit -m "Deployment $commit_message `date +%Y-%m-%d:%H:%M:%S`"
#git push

ionic run

## On repasse tout en dev ##

mv ../src www/partials/src
mv ../app www/app
#mv ../libs www/libs
mv ../scss www/assets/scss


# Je repasse le dev en local
gulp index-html-dev

# je passe les json de prod dans les assets
mv www/app/directives/json-prod.js www/app/json-prod.js
mv www/app/json.js www/app/directives/json.js

# Après tout, je repasse le site en dev
sed -i 's/\"ENV","prod"/\"ENV","dev"/' ./www/assets/js/all.js

