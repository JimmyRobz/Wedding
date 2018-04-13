$(function () {

    (function initRouter() {
        var root = null;
        var useHash = true; // Defaults to: false
        var hash = '#!'; // Defaults to: '#'
        var router = new Navigo(root, useHash, hash);

        router
            .on('us', function () {
                console.log("Show us");
            })
            .notFound(function () {
                console.log("not found")
            })
            .resolve();

        window.r = router;
    })();

    (function initLinks() {
        var links = $('nav > a');
        links.on('click', function (event) {
            var $el = $(event.currentTarget);
            links.removeClass('active');
            $el.addClass('active');
        });
    })();

    (function initCounter() {
        var $days = $("#wedding-day-countdown-days .countdown-value");
        var $hours = $("#wedding-day-countdown-hours .countdown-value");
        var $minutes = $("#wedding-day-countdown-minutes .countdown-value");
        var $seconds = $("#wedding-day-countdown-seconds .countdown-value");

        var weddingDate = moment.tz("2018-10-12 14:00", "Indian/Reunion");

        function updateValues() {
            var duration = moment.duration(weddingDate.diff(moment()));
            $days.text(Math.floor(duration.asDays()));
            $hours.text(('0' + duration.hours()).slice(-2));
            $minutes.text(('0' + duration.minutes()).slice(-2));
            $seconds.text(('0' + duration.seconds()).slice(-2));
        }

        updateValues();
        setInterval(updateValues, 1000)
    })();

});
