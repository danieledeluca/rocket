import $ from 'jquery';
import Splide from '@splidejs/splide';

$(function () {
    $('.splide').each(function () {
        const slider = new Splide(this, {
            type: 'loop',
            autoplay: true,
        });

        slider.mount();
    });
});
