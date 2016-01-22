## On repasse tout en dev ##

mv ../src www/partials/src
mv ../app www/app
mv ../libs www/libs
mv ../scss www/assets/scss


# Je repasse le dev en local
gulp index-html-dev

# je passe les json de prod dans les assets
mv www/app/directives/json-prod.js www/app/json-prod.js
mv www/app/json.js www/app/directives/json.js

# Après tout, je repasse le site en dev
sed -i 's/\"ENV","prod"/\"ENV","dev"/' ./www/assets/js/all.js

