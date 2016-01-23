app.filter('objLength', function() {
    return function(item) {
        if(typeof  item === 'object') {
            return Object.keys(item).length;
        }else
            return item;
    }
});