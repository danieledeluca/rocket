import $ from 'jquery';

$(function () {
    const $window = $(window);
    let scrollOffset = $window.scrollTop();

    $window.on('scroll resize', function () {
        scrollOffset = window.pageYOffset;
    });

    $('.parallax').each(function () {
        const $parallax = $(this);
        const scrollSpeed = $parallax.data('scroll-speed') || 2;
        let backgroundOffset;
        let yPosition;
        let backgroundPosition;

        $window.on('scroll resize', function () {
            backgroundOffset = parseInt($parallax.offset().top, 10);
            yPosition = -((scrollOffset - backgroundOffset) / scrollSpeed);
            backgroundPosition = `50% ${yPosition}px`;
            $parallax.css({ backgroundPosition });
        });
    });
});
