(function (win) {
requirejs.config({
    baseUrl: '../',
    paths: {
        sub: 'js/sub'
    }
});
// Start the main app logic.
requirejs(['sub'],function (sub) {
        console.log(suba.color);
});

})(window);