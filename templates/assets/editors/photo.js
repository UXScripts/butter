/*global EditorHelper*/

EditorHelper.addPlugin( "photo", function( trackEvent ) {
  var _container,
      _popcornOptions,
      _canvas = document.createElement( "canvas" ),
      _context,
      media;

  _popcornOptions = trackEvent.popcornTrackEvent;
  _container = _popcornOptions._container;
  media = document.getElementById( trackEvent.track._media.target );

  if ( window.jQuery ) {
    //Change default text to indicate draggable
    if ( !_popcornOptions.src ){
      _container.innerHTML = "<span class=\"title\">Drag an image from your desktop</span>";
    }

    window.EditorHelper.resizable( trackEvent, _container, media );
    window.EditorHelper.draggable( trackEvent, _container, media );
  }

  // Prevent default draggable behaviour of images
  trackEvent.popcornTrackEvent._image.addEventListener( "mousedown", function( e ) {
    e.preventDefault();
  }, false);

  _container.addEventListener( "dragover", function( e ) {
    e.preventDefault();
    _container.classList.add( "butter-dragover" );
  }, false );

  _container.addEventListener( "dragleave", function( e ) {
    e.preventDefault();
    _container.classList.remove( "butter-dragover" );
  }, false );

  _container.addEventListener( "drop", function( e ) {
    _container.classList.add( "butter-dropped" );
    e.preventDefault();
    var file = e.dataTransfer.files[ 0 ],
        imgSrc,
        image,
        imgURI;

    if ( !file ) {
      return;
    }

    if ( window.URL ) {
      imgSrc = window.URL.createObjectURL( file );
    } else if ( window.webkitURL ) {
      imgSrc = window.webkitURL.createObjectURL( file );
    }

    image = document.createElement( "img" );
    image.onload = function() {
      _canvas.width = this.width;
      _canvas.height = this.height;
      _context = _canvas.getContext( "2d" );
      _context.drawImage( this, 0, 0, this.width, this.height );
      imgURI = _canvas.toDataURL();
      trackEvent.update( { src: imgURI } );
    };
    image.src = imgSrc;
  }, false );
});