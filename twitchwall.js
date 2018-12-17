( function( $ ) {

var id = twitch_wall_vars.id;
var target = '.twitch-wall-'+id+' #stream-container ul';
var language = '';
var limit = 9;
var theme = twitch_wall_vars.theme;
if (twitch_wall_vars.language !== '') {
language = '&language='+twitch_wall_vars.language;
}
if (twitch_wall_vars.limit !== '') {
limit = twitch_wall_vars.limit;
}
if (twitch_wall_vars.twitchGames != '') {
    getGameName(twitch_wall_vars.twitchGames);
} else if (twitch_wall_vars.twitchNames != '') {
    twitchNamesWithLogin = [];
    twitchNamesWithUserLogin = [];
    twitchNamesArray = twitch_wall_vars.twitchNames;
    twitchNamesArray = twitchNamesArray.split(',')
    twitchNamesArrayLength = twitchNamesArray.length;
    if (twitchNamesArrayLength > 20) {
        twitchNamesArrayLength = 20;
    }
    for (var i=0; i < twitchNamesArrayLength; i++) {
        var sep='&';
        if (i==0) {var sep='?'};
        twitchNamesWithLogin[i]=sep+"login="+twitchNamesArray[i];
        twitchNamesWithUserLogin[i]=sep+"user_login="+twitchNamesArray[i];
    }
    url1 = 'https://api.twitch.tv/helix/users'+twitchNamesWithLogin.join('');
    url2 = 'https://api.twitch.tv/helix/streams'+twitchNamesWithUserLogin.join('');
    getChannels(url1,url2);
} else if (twitch_wall_vars.twitchTeam != '') {
    getTeam()
}

//---- ******* END Click Options ******* ----//

//---- ******* Teams ******* ----//

function getTeam() {
    $.ajax({
        url: 'https://api.twitch.tv/kraken/teams/'+twitch_wall_vars.twitchTeam,
        type: 'GET',
        headers: {
           'Client-ID': 'c9y13nevu8fzazuq2ty6zdqz9f7xlem',
           'Accept': 'application/vnd.twitchtv.v5+json'
        },
        success: function(data) {
            display_names = '';
            for (var i in data.users) {
                display_names += data.users[i].display_name+',';
            }
            twitchNamesWithLogin = [];
            twitchNamesWithUserLogin = [];
            twitchNamesArray = display_names.split(',')
            if (twitchNamesArray.length > 20) {
                userLength = 20
            } else {
                userLength = twitchNamesArray.length
            }
            for (var i=0; i < userLength - 1; i++) {
                var sep='&';
                if (i==0) {var sep='?'};
                twitchNamesWithLogin[i]=sep+"login="+twitchNamesArray[i];
                twitchNamesWithUserLogin[i]=sep+"user_login="+twitchNamesArray[i];
            }
            url1 = 'https://api.twitch.tv/helix/users'+twitchNamesWithLogin.join('');
            url2 = 'https://api.twitch.tv/helix/streams'+twitchNamesWithUserLogin.join('');
            getChannels(url1,url2);
            console.log('[Easy Embed Twitch] - Success - retrieved Team')
        },
        error: function(data) {
            console.log('[Easy Embed Twitch] - Failed to retrieve Team')
        },
        complete: function(data) {
        }
    });
}

//---- ******* END Teams ******* ----//

//---- ******* Channels ******* ----//

function getChannels(url1,url2){

$.ajax({
    url: url1,
    type: 'GET',
    headers: {
       'Client-ID': 'c9y13nevu8fzazuq2ty6zdqz9f7xlem'
    },
    success: function(data) {
        console.log('[Easy Embed Twitch] - Success - retrieved Channels')
        arr1 = data.data;
    },
    error: function(data) {
      console.log('[Easy Embed Twitch] - Failed to retrieve Channels')
      arr1 = [];
    },
    complete: function(data) {
      getChannels2(url2,arr1)
    }
});

}

function getChannels2(url2,arr1){
$.ajax({
    url: url2,
    type: 'GET',
    headers: {
       'Client-ID': 'c9y13nevu8fzazuq2ty6zdqz9f7xlem'
    },
    success: function(data) {
        arr2 = data.data;
        for (var i=0;i<arr2.length;i++) {
            id1 = arr2[i].user_id;
            for (var o=0;o<arr1.length;o++) {
                id2 = arr1[o].id;
                if (id1 == id2) {
                    $.extend( arr2[i], {'display_name':arr1[o].display_name,'login':arr1[o].login} );
                }
            }
        }
        appendStreams(arr2,arr1);
    },
    error: function(data) {
      console.log('[Easy Embed Twitch] - Failed to retrieve Channels')
    },
    complete: function(data) {
      console.log('[Easy Embed Twitch] - Success - retrieved Channels')
    }
});

}

//---- ******* END Channels ******* ----//

//---- ******* Game ******* ----//

function getGameName(name) {
    $.ajax({
        url: 'https://api.twitch.tv/helix/games?name='+name,
        type: 'GET',
        headers: {
           'Client-ID': 'c9y13nevu8fzazuq2ty6zdqz9f7xlem',
           'Accept': 'application/vnd.twitchtv.v5+json'
        },
        success: function(data) {
            console.log('[Easy Embed Twitch] - Retrieving Game ID - Success - '+data.data[0]['id'])
            id = data.data[0]['id'];
        },
        error: function(data) {
            console.log('[Easy Embed Twitch] - Failed to retrieve Game ID')
        },
        complete: function(data) {
          getGameStreams(id,'');
        }
    });
}

function getGameStreams(id, url) {
    if (url == '') {
        url = 'https://api.twitch.tv/helix/streams?game_id='+id+language;
    }
    $.ajax({
        url: url,
        type: 'GET',
        headers: {
           'Client-ID': 'c9y13nevu8fzazuq2ty6zdqz9f7xlem',
           'Accept': 'application/vnd.twitchtv.v5+json'
        },
        success: function(data) {
            if (data.data.length > 0) {
                console.log('[Easy Embed Twitch] - Retrieving Game Streams - Success')
                arr1 = data.data;
                streamerIdsArray = '';
                streamerIdsCombined = [];
                streamerIdsWithLogin = [];
                for (var i=0; i < data.data.length; i++) {
                    streamerIdsCombined += data.data[i]['user_id']+',';
                }
                streamerIdsArray = streamerIdsCombined.split(',')
                for (var i=0; i < streamerIdsArray.length - 1; i++) {
                    var sep='&';
                    if (i==0) {var sep='?'};
                    streamerIdsWithLogin[i]=sep+"id="+streamerIdsArray[i];
                }
                streamerIdsWithLogin = streamerIdsWithLogin.join('');
                getStreamerNames(streamerIdsWithLogin, arr1);
            } else {
                console.log('[Easy Embed Twitch] - Retrieving Game Streams - 0 Results')
                $("#twitch-module.twitch-wall .offline-slide").show()
                $("#twitch-module.twitch-wall .loader-wrapper").hide()
            }
        },
        error: function(data) {
            console.log('[Easy Embed Twitch] - Failed to retreieve Game Streams')
        }
    });
}

function getStreamerNames(streamerIdsWithLogin, arr1){
$.ajax({
    url: 'https://api.twitch.tv/helix/users'+streamerIdsWithLogin,
    type: 'GET',
    headers: {
       'Client-ID': 'c9y13nevu8fzazuq2ty6zdqz9f7xlem'
    },
    success: function(data) {
        arr2 = data.data;
        fullArray = $.extend(true, arr1, arr2);
        appendStreams(fullArray);
    },
    error: function(data) {
    },
    complete: function(data) {
    }
});
}

//---- ******* End Game ******* ----//

//---- ******* Append Streams ******* ----//

function appendStreams(fullArray,offlineArray) {
    var streamsAdded = [];
    if (fullArray.length < limit) {
        limit = fullArray.length;
    }
    for (var i=0;i<limit;i++) {
      var display_name = fullArray[i].display_name;
      var channel_name = fullArray[i].title;
      var preview = fullArray[i].thumbnail_url;
      var preview = preview.replace("{height}", "454");
      var preview = preview.replace("{width}", "800");
      var game = fullArray[i].game_id;
      var login = fullArray[i].login;
      var url = 'https://www.twitch.tv/'+login;
      var viewers = fullArray[i].viewer_count;
        var html = '<li class="stream"><a target="_blank" href="'+url+'" title="Watch '+display_name+' Now!" data-channel-name='+login+'>';
        html +=  '<div class="twitch-image"><div class="twitch-image-overlay"><img src="'+twitch_wall_vars.play+'"></div><img src="'+preview+'"></div>';
        html += '<div class="twitch-info"><div class="twitch-title">'+channel_name+'</div><div class="twitch-meta"><span class="twitch-name">'+display_name+'</span> streaming for <span class="twitch-viewers">'+viewers+ ' viewers</span></div>';
        html += '</div></a>';
        html += '<span class="online-indicator online-indicator--online"></span>';
        html += '</li>';
      $(html).appendTo(target)
      $('#twitch-module.twitch-wall').removeClass('loading');
  }
  if (fullArray.length == 0) {
      $("#twitch-module.twitch-wall .offline-slide").show()
      $("#twitch-module.twitch-wall .loader-wrapper").hide()
  }
}

//---- ******* END Append Streams ******* ----//

	var embedStream = function(name){
      if (theme == 'dark-theme') {
        theme = 'dark';
      } else {
        theme = 'light';
      }
	  $('.twitch-wall #twitch-embed').empty()
      $('.twitch-wall #twitch-embed').addClass('active')
	  new Twitch.Embed("twitch-embed", {
	    width: '100%',
	    height: '100%',
	    channel: name,
        theme: theme
	  });
	}

	$(document).on('click', '.twitch-wall #stream-container ul li a', function(e){
	  console.log($(this).data('channel-name'))
	  e.preventDefault()
	  name = $(this).data('channel-name')
	  embedStream(name)
      var offset = $('.twitch-wall #twitch-embed').offset().top;
        $('html, body').animate({
            scrollTop: offset - 100 },
        1000
        );
	})

} )( jQuery );
