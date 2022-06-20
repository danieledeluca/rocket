import $ from 'jquery';

$(function () {
    /**
     * Clear path from '\'
     * @param {string} path
     * @returns {string}
     */
    function clearPath(path) {
        return path.replace(/^\//, '');
    }

    // Add smooth scrool behavior if not supported
    if (!('scrollBehavior' in document.documentElement.style)) {
        $('a[href^="#"]:not([href="#"])').on('click', function (e) {
            const { pathname: winPathname, hostname: winHostname } = window.location;
            const { pathname: linkPathname, hostname: linkHostname } = this;

            if (clearPath(winPathname) === clearPath(linkPathname) && winHostname === linkHostname) {
                const $target = $(this.hash);

                if ($target.length) {
                    e.preventDefault();

                    $('html, body').animate(
                        { scrollTop: $target.offset().top - $('.header').height() },
                        500,
                        'swing',
                        function () {
                            $target.attr('tabindex', '-1');
                            $target.trigger('focus');
                        },
                    );
                }
            }
        });
    }

    // Disabel click on empty click
    $('a[href="#"]').on('click', function (e) {
        e.preventDefault();
    });
});
