(function($) {

    $('.navbar a').on('click', function(event) {
        event.preventDefault();

        var elem  = $(this);
        var href  = elem.attr('href');
        var panel = $(href);

        elem.addClass('active');
        elem.siblings().removeClass('active');
        panel.addClass('active').fadeIn();
        panel.siblings().removeClass('active').fadeOut();
    });

    if (localStorage.getItem('sound') != null) {
        if (localStorage.getItem('sound') == 'true') {
            $('#sound').attr('checked', 'checked');
        } else {
            $('#sound').removeAttr('checked');
        }
    }

    if (localStorage.getItem('counter') != null) {
        if (localStorage.getItem('counter') == 'all') {
            $('#all').attr('checked', 'checked');
            $('#favorites').removeAttr('checked');
        } else {
            $('#favorites').attr('checked', 'checked');
            $('#all').removeAttr('checked');
        }
    }

    $('#sound').on('click', function() {
        localStorage.setItem('sound', $(this).prop('checked'));
    });

    $('input[name="counter"]').on('click', function() {
        localStorage.setItem('counter', $(this).val());
    });

    $(document).on('click', '#streamers input[type="checkbox"]', function() {
        var elem      = $(this);
        var favorites = localStorage.getItem('favorites') == null ? [] : JSON.parse(localStorage.getItem('favorites'));

        if (elem.prop('checked')) {
            favorites.push(elem.val());
        } else {
            favorites.splice(favorites.indexOf(elem.val()), 1);
        }

        localStorage.setItem('favorites', JSON.stringify(favorites));
    });

    $.get('http://leveldown.fr/api/getStreamer', function(data) {
        data = JSON.parse(data);

        for (var i = 0; i < data.response.length; i++) {
            var streamer  = data.response[i];
            var img       = streamer.avatar;
            var name      = streamer.title_menu;
            var slug      = streamer.slug;

            var favorites = localStorage.getItem('favorites') == null ? [] : JSON.parse(localStorage.getItem('favorites'));

            if (streamer.live) {
                $('<li />', {
                    'data-sort': favorites.indexOf(slug) > -1 ? -1 : 1
                })
                    .append($('<a />', {
                        href  : 'http://leveldown.fr/stream/' + slug,
                        target: '_blank'
                    })
                        .append($('<img />', {
                            class: 'avatar',
                            src  : img
                        }))
                        .append($('<span />', {
                            class: 'name',
                            text : name,
                            css: {
                                color: favorites.indexOf(slug) > -1 ? '#FFB400' : 'inherit'
                            }
                        })))
                    .appendTo($('#list ul'));
            }

            $('<li />', {
                'data-sort': favorites.indexOf(slug) > -1 ? -1 : 1
            })
                .append($('<input />', {
                    type   : 'checkbox',
                    value  : slug,
                    id     : slug,
                    checked: favorites.indexOf(slug) > -1
                }))
                .append($('<label />', {
                    for: slug
                })
                    .append($('<img />', {
                        src: img
                    }))
                    .append($('<span />', {
                        text: name
                    })))
                .appendTo($('#streamers ul'));

            $('#streamers ul').find('li').sort(function(a, b) {
                return $(a).data('sort') - $(b).data('sort');
            }).appendTo($('#streamers ul'));

            $('#list ul').find('li').sort(function(a, b) {
                return $(a).data('sort') - $(b).data('sort');
            }).appendTo($('#list ul'));
        }
    });

})(jQuery);

/*(function($) {

    var getStreamer = function(slug) {
        var online = localStorage.getItem('online') == null ? [] : JSON.parse(localStorage.getItem('online'));

        for (var i = 0, len = online.length; i < len; i++) {
            if (online[i].slug == slug) {
                return online[i];
            }
        }

        return null;
    };

    var parseTime = function(time) {
        var string = '';
        var d      = Math.floor(time / (1000 * 3600 * 24)); time %= 1000 * 3600 * 24;
        var h      = Math.floor(time / (1000 * 3600));      time %= 1000 * 3600;
        var m      = Math.floor(time / (1000 * 60));        time %= 1000 * 60;

        if (d != 0) {
            string += d + ' jour(s) ';

            if (h != 0) {
                string += 'et ';
            }
        }

        if (h != 0) {
            string += h + ' heure(s) ';

            if (m != 0) {
                string += 'et ';
            }
        }

        if (m != 0) {
            string += m + ' minute(s) '
        }

        return string;
    };

    $.ajax({
        type   : 'GET',
        url    : 'http://leveldown.fr/api/getStreamer',
        success: function(data) {
            data = JSON.parse(data);

            for (var i = 0, len = data.response.length; i < len; i++) {
                var streamer  = data.response[i];
                var img       = streamer.avatar;
                var name      = streamer.title_menu;
                var slug      = streamer.slug;
                var favorites = localStorage.getItem('favorites') == null ? [] : JSON.parse(localStorage.getItem('favorites'));
                var time      = getStreamer(slug) != null ? Math.floor(Date.now()) - getStreamer(slug).time : 0;

                if (streamer.live) {
                    $('<li />')
                        .append($('<a />', { href: 'http://leveldown.fr/stream/' + slug, target: '_blank' })
                            .append($('<img />', { class: 'avatar', src: img }))
                            .append($('<span />', { class: 'name', text: name }))
                            .append($('<span />', { class: 'time', text: 'En stream depuis ' + parseTime(time) })))
                        .appendTo($('#list ul'));
                }

                $('<li />')
                    .append($('<input />', { type: 'checkbox', value: slug, id: slug, checked: favorites.indexOf(slug) > -1 }))
                    .append($('<label />', { for: slug })
                        .append($('<img />', { src: img }))
                        .append($('<span />', { text: name })))
                    .appendTo($('#streamers ul'));
            }
        },
        error  : function(error) {
        }
    });

    if (localStorage.getItem('sound') != null) {
        if (localStorage.getItem('sound') == 'true') {
            $('#sound').attr('checked', 'checked');
        } else {
            $('#sound').removeAttr('checked');
        }
    }

    if (localStorage.getItem('counter') != null) {
        if (localStorage.getItem('counter') == 'all') {
            $('#all').attr('checked', 'checked');
            $('#favorites').removeAttr('checked');
        } else {
            $('#favorites').attr('checked', 'checked');
            $('#all').removeAttr('checked');
        }
    }

    $('#sound').on('click', function() {
        localStorage.setItem('sound', $(this).prop('checked'));
    });

    $('input[name="counter"]').on('click', function() {
        localStorage.setItem('counter', $(this).val());
    });

    $(document).on('click', '#streamers input[type="checkbox"]', function() {
        var elem      = $(this);
        var favorites = localStorage.getItem('favorites') == null ? [] : JSON.parse(localStorage.getItem('favorites'));

        if (elem.prop('checked')) {
            favorites.push(elem.val());
        } else {
            favorites.splice(favorites.indexOf(elem.val()), 1);
        }

        localStorage.setItem('favorites', JSON.stringify(favorites));
    });

    $('.navbar a').on('click', function(event) {
        event.preventDefault();

        var elem  = $(this);
        var href  = elem.attr('href');
        var panel = $(href);

        elem.addClass('active');
        elem.siblings().removeClass('active');
        panel.addClass('active').fadeIn();
        panel.siblings().removeClass('active').fadeOut();
    });

})(jQuery);*/
