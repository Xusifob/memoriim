app.filter('substr', function () {
    return function(item,start,length) {
        return item.substr(start,length);
    };
});
