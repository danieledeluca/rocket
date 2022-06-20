import $ from 'jquery';
import { clasess, isMobile } from './utilities';

const { activeClass, navOpenClass, parentClass } = clasess;

$(function () {
    const $html = $('html');

    // Toggle mobile menu
    $('.header__hamburger').on('click', function () {
        $html.toggleClass(navOpenClass);
    });

    /**
     * Close mobile menu
     */
    function closeMenu() {
        $html.removeClass(navOpenClass);
        $(`.navbar__item.${activeClass}`).removeClass(activeClass);
    }

    // Close mobile menu on resize
    $(window).on('resize', function () {
        if (!isMobile()) {
            closeMenu();
        }
    });

    // Toggle mobile submenu
    $('.navbar__link').on('click', function () {
        if (!isMobile()) return;

        const $navbarItem = $(this).parent();
        const navbarLinkHref = $(this).attr('href');

        if ($navbarItem.hasClass(parentClass) && navbarLinkHref === '#') {
            $navbarItem.toggleClass(activeClass);
        } else {
            closeMenu();
        }
    });

    // Toggle mobile submenu
    $('.navbar__toggle').on('click', function (e) {
        if (!isMobile()) return;

        e.preventDefault();
        e.stopPropagation();

        $(this).closest('.navbar__item').toggleClass(activeClass);
    });
});
