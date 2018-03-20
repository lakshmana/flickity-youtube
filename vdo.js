/**
 * Created by Laxman on 3/20/2018.
 */

function CustomEvent(name){
    this.name = name;
    this.callbacks = [];
}

CustomEvent.prototype.registerCallback = function(callback){
    if(typeof(callback) == 'function'){
        this.callbacks.push(callback);
    }
};


/**
 * Created by Laxman on 12/5/2017.
 */
function Reactor(){
    this.events = [];
}

Reactor.prototype.registerEvent = function(eventName){
    this.events[eventName] = new CustomEvent(eventName);
};

Reactor.prototype.addEventListener = function(eventName, callback){
    if(this.events[eventName] && this.events[eventName] instanceof CustomEvent) {
        this.events[eventName].registerCallback(callback);
    }else{
        console.error('event not found for == ' + eventName + ' == to register');
    }
};

Reactor.prototype.dispatchEvent = function(eventName, eventArgs){

    if(this.events[eventName] && this.events[eventName] instanceof CustomEvent){
        this.events[eventName].callbacks.forEach(function(callback){
            callback(eventArgs);
        });
    }else{
        console.error('event not found for == ' + eventName + ' == to dispatch');
    }
};


/**
 * https://developers.google.com/youtube/iframe_api_reference#Events
 */
function onYouTubeIframeAPIReady() {
    VideoManager.onYouTubeIframeAPIReady();
}


var VideoManager = new function(){
    this._isScriptLoaded = false;
    this._isScriptLoading = false;
    this._players = [];
    this._reactor = new Reactor();



    this._reactor.registerEvent('clear');
    this._reactor.registerEvent('start');
    this._reactor.registerEvent('playing');
    this._reactor.registerEvent('end');
    this._reactor.registerEvent('pauseAll');
    this._reactor.registerEvent('pause');

    this.addEventListener = function(eventName, callback){
        this._reactor.addEventListener(eventName, callback);
    };

    this._playerDefaults = {
        autoplay: 1,
        autohide: 1,
        modestbranding: 1,
        rel: 0,
        showinfo: 0,
        controls: 0,
        disablekb: 1,
        enablejsapi: 0,
        iv_load_policy: 3,
        wmode: 'transparent',
        branding: 0,
        vq: 'hd1080'
    };

    this.getPlayerById = function(videoId){
      if(!this._players.indexOf(videoId) == -1) return null;
        return this._players[videoId];
    };

    this.clear = function(){
        for(var key in this._players){
            this._players[key].destroy();
        }
        this._players = [];
        this._reactor.dispatchEvent('clear');
    };

    this.pauseAll = function(){
        //if(!this._player) return;
        //this._player.pauseVideo();
        for(var key in this._players){
            this._players[key].pauseVideo();
        }
        this._reactor.dispatchEvent('pauseAll');
    };


    this._loadScript = function(){
        if(this._isScriptLoading) return false;
        if(this._isScriptLoaded) return false;
        //This code loads the IFrame Player API code asynchronously.
        var tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";

        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        //This function creates an <iframe> (and YouTube player)
        // after the API code downloads.
    };

    this.loadVideoById = function(videoId, vdoContainer){
        var player = this.getPlayerById(videoId);
        if(player){
            player.playVideo();
            player.playVideo();
            this._reactor.dispatchEvent('start', player._videoId);
            //console.log('player found, resume it');
           return;
        }

        this._videoId = videoId;
        this._videoContainer = vdoContainer;

        if(!this._isScriptLoaded) {
            this._loadScript();
            return;
        }

        //this.clear();

        var player = new YT.Player(vdoContainer, {
            height: '100%',
            width: '100%',
            //videoId: 'M7lc1UVf-VE',
            playerVars: this._playerDefaults,
            events: {
                'onReady': function(event){
                    event.target.loadVideoById({
                        videoId: this._videoId,
                        autoplay:1
                    });

                    this._reactor.dispatchEvent('start', this._videoId);

                }.bind(this),
                'onStateChange': this._onPlayerStateChange.bind(this)
            }
        });
        player._videoId = this._videoId;
        //console.log('new player created for ' + videoId);
        this._players[videoId] = player;
    };

    this._onPlayerStateChange = function(event){
        console.log(event.data, event.target._videoId)


        if (event.data === YT.PlayerState.PAUSED) {
            this._reactor.dispatchEvent('pause', event.target._videoId);
        }

        if (event.data === YT.PlayerState.PLAYING) {
            this._reactor.dispatchEvent('playing', event.target._videoId);
        }
        if (event.data === YT.PlayerState.ENDED) {
            //this.loadVideoById(this._videoId, this._videoContainer, this._videoOverlay);
            //this.onPlayerReady();

            //event.target.seekTo(0);
            this._reactor.dispatchEvent('end', event.target._videoId);
        }
    };

    this.onYouTubeIframeAPIReady = function(){
        this._isScriptLoaded = true;
        this.loadVideoById(this._videoId, this._videoContainer);
    };
};