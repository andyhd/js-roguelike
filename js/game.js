function Game() {
  this.turn = 0 ;
  this.map = null ;
  this.userControl = new UserControl() ;
  this.itemCache = new ItemCache() ;
  this.monsterCache = new MonsterCache() ;
  this.player = new Player( this.userControl ) ;
  this.ui = new UI( this ) ;
}

function handleKeyPress( e ) {
  game.userControl.act( e ) ;
}

Game.prototype.start = function() {
  this.ui.infrastructure() ;

  document.getElementById( 'usercontrol' ).onkeypress = function( e ) {
    handleKeyPress( e ) ;
    return false ;
  } ;
  document.getElementById( 'dungeon' ).parentNode.onclick = function( e ) {
    document.getElementById( 'usercontrol' ).focus() ;
  } ;
/*
  if ( document.addEventListener )
    document.addEventListener( 'keypress' , handleKeyPress , true ) ;
  else
    alert( "Handler could not be attached" ) ;

/*  document.onkeypress = function( e ) {
    if ( !e )
      e = window.event ;
    game.userControl.act( e ) ;
  } ;
*/
  this.map = Map.load( tiledefs , itemdefs , monsters ) ;
  this.map = MapMaker.buildMap() ;
  this.ui.update() ;
}

Game.prototype.nextTurn = function() {

  num_units = 0 ;
  // for ( i = this.map.num_units - 1 ; i >= 0 ; i-- ) {
  for ( u in this.map.units ) {
    // unit = this.map.units[ i ][ 1 ] ;
    unit = this.map.units[ u ] ;
    if ( unit.isDead() )
      continue ;
    unit.act() ;
    num_units++ ;
  }

  // victory
  if ( num_units == 0 ) {
    this.ui.showModalDialog( this.ui.victoryMsg() ) ;
    document.removeEventListener( 'keypress' , handleKeyPress , false ) ;
  }

  // failure
  if ( this.player.isDead() ) {
    corpse = this.itemCache.get( 'corpse' ) ;
    this.player.image = corpse.getImage() ;
    this.player.offset = corpse.getOffset() ;
    this.ui.dirty( this.player.x , this.player.y ) ;
    this.ui.showModalDialog( this.ui.failureMsg() ) ;
    document.removeEventListener( 'keypress' , handleKeyPress , false ) ;
  }
  
  this.turn++ ;
  this.ui.update() ;
}

var req ;

Game.prototype.loadData = function( url ) {

  // branch for native XMLHttpRequest object
    if (window.XMLHttpRequest) {
        req = new XMLHttpRequest();
        req.onreadystatechange = this.dataLoaded ;
        req.open("GET", url, true);
        req.send(null);
    // branch for IE/Windows ActiveX version
    } else if (window.ActiveXObject) {
        req = new ActiveXObject("Microsoft.XMLHTTP");
        if (req) {
            req.onreadystatechange = this.dataLoaded ;
            req.open("GET", url, true);
            req.send();
        }
    }
}

Game.prototype.dataLoaded = function() {
  if ( req.readyState != 4 )
    return ;
  if ( req.status == 200 ) {
    eval( req.responseText ) ;
    game.start() ;
  }
}
