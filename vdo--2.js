/**
 * Created by Laxman on 3/20/2018.
 */

function onYouTubeIframeAPIReady() {
    VideoManagerSingle.onYouTubeIframeAPIReady();
}

var VideoManagerSingle = new function(){
    this._player = null;
    this._isScriptLoaded = false;
    this._isScriptLoading = false;



    


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

    this.clear = function(){
        if(!this._player) return;
        this._player.destroy();
        this._player = null;
    };

    this.pause = function(){
        if(!this._player) return;
        this._player.pauseVideo();
    };

    this.resume = function(){
        if(!this._player) return;
        this._player.playVideo();

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
        //if the payer exist and the videoid is the same
        console.log(this._videoId,videoId);
        if(this._player && this._videoId == videoId){
            console.log('resume');
            this.resume();
            return;
        }

        this._videoId = videoId;
        this._videoContainer = vdoContainer;

        if(!this._isScriptLoaded) {
            this._loadScript();
            return;
        }

        this.clear();

        this._player = new YT.Player(vdoContainer, {
            height: '100%',
            width: '100%',
            //videoId: 'M7lc1UVf-VE',
            playerVars: this._playerDefaults,
            events: {
                'onReady': this._onPlayerReady.bind(this),
                'onStateChange': this._onPlayerStateChange.bind(this)
            }
        });


    };

    this._onPlayerReady = function(event) {
        this._isScriptLoaded = true;
        //this._player.mute();
        this._player.loadVideoById({
            'videoId': this._videoId,
            //'startSeconds': 515,
            autoplay:1//,
            //'endSeconds': 690,
            //'suggestedQuality': 'hd720'
        });


    };

    this._onPlayerStateChange = function(el){
        //console.log(el.data);
        if (el.data === YT.PlayerState.ENDED) {
            console.log('loop ivdeo');
            //this.loadVideoById(this._videoId, this._videoContainer, this._videoOverlay);
            //this.onPlayerReady();
            this._player.seekTo(0);
        }
    };

    this.onYouTubeIframeAPIReady = function(){
        console.log(this);
        this._isScriptLoaded = true;
        this.loadVideoById(this._videoId, this._videoContainer);
        /*
        var playerDefaults = {autoplay: 1,
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


        this._player = new YT.Player(this._videoContainer, {
            height: '100%',
            width: '100%',
            //videoId: 'M7lc1UVf-VE',
            playerVars: playerDefaults,
            events: {
                'onReady': this.onPlayerReady.bind(this),
                'onStateChange': this.onPlayerStateChange.bind(this)
            }
        });
        */
    };
};