app.filter('stringify', function () {
    return function(data) {
        if(undefined === data)
            return;
        return JSON.stringify(data);
    };
});
