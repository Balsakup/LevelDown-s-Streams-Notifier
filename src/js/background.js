(function($) {

    var check = function() {
        $.get('http://leveldown.fr/api/getStreamer', function(data) {
            data                 = JSON.parse(data);
            var online           = {
                all      : 0,
                favorites: 0
            };
            var favorites        = localStorage.getItem('favorites') == null ? [] : JSON.parse(localStorage.getItem('favorites'));
            var online_favorites = localStorage.getItem('online-favorites') == null ? [] : JSON.parse(localStorage.getItem('online-favorites'));

            for (var i = 0; i < data.response.length; i++) {
                var streamer  = data.response[i];
                var img       = streamer.avatar;
                var name      = streamer.title_menu;
                var slug      = streamer.slug;

                if (streamer.live) {
                    online.all++;

                    if (favorites.indexOf(slug) > -1) {
                        online.favorites++;

                        if (online_favorites.indexOf(slug) < 0) {
                            online_favorites.push(slug);

                            new Notification('Hey, toi !!!', {
                                body: streamer.title_menu + ' est en stream',
                                icon: streamer.avatar.replace('mini', 'big')
                            });
                        }
                    }
                } else {
                    if (online_favorites.indexOf(slug) > -1) {
                        online_favorites.splice(online_favorites.indexOf(slug), 1);
                    }
                }
            }

            localStorage.setItem('online-favorites', JSON.stringify(online_favorites));

            chrome.browserAction.setBadgeBackgroundColor({color: '#00c100'});
            chrome.browserAction.setBadgeText({ text: localStorage.getItem('counter') == 'all' ? online.all.toString() : online.favorites.toString() });
        });
    };

    setInterval(check, 10000);
    check();

})(jQuery);
