var elem = document.querySelector('.main-carousel');
var flkty = new Flickity( elem, {
    // options
    cellAlign: 'left',
    contain: true,
    //imagesLoaded: true,
    wrapAround: true
});
flkty.on( 'settle', function( index ) {
    VideoManager.pauseAll();
    var videoId = flkty.selectedElement.getAttribute('data-vdo');
    if(!videoId) return;

    VideoManager.loadVideoById(videoId, flkty.selectedElement.querySelector('.carousel-cell__vid'));

});


VideoManager.addEventListener('playing', function(videoId){
    console.log('play video ' + videoId);
    document.querySelector("[data-vdo="+videoId+"]").classList.add('playing');
});
VideoManager.addEventListener('pause', function(videoId){
    console.log('pause video ' + videoId);
    document.querySelector("[data-vdo="+videoId+"]").classList.remove('playing');
});
VideoManager.addEventListener('end', function(videoId){
    console.log('end video ' + videoId);
    flkty.next();
});