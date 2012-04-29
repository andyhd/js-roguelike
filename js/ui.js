function UI( game ) {
  this.game = game ;
  this.messages = [] ;
  this.size = [ 25 , 19 ] ;
  this.mid = [ 0 , 0 ] ;
  this.should_recalc_viewport = true ;
  this.recalcViewport() ;
  this.dirty_tiles = [] ;
  this.messages = [ '&nbsp;' , '&nbsp;' , '&nbsp;' , 'Messages' ] ;
}

UI.prototype.dirty = function( x , y ) {
  this.dirty_tiles.push( [ x , y ] ) ;
}

UI.prototype.recalcViewport = function() {
  this.min = [ this.mid[X] - Math.floor( this.size[X] / 2 ) ,
         this.mid[Y] - Math.floor( this.size[Y] / 2 ) ] ;
  this.max = [ this.mid[X] + Math.floor( this.size[X] / 2 ) + 1 ,
         this.mid[Y] + Math.floor( this.size[Y] / 2 ) + 1 ] ;
}

UI.prototype.update = function() {
  if ( this.game.map == null )
    return null ;

  p = [ this.game.player.x , this.game.player.y ] ;

  // do player field of view
  this.game.player.doFOV() ;

  // recalculate visible area?
  if ( p[X] < this.min[X] + 4 ) {
    this.mid[X] = p[X] ;
    this.should_recalc_viewport = true ;
  }
  if ( p[X] > this.max[X] - 4 ) {
    this.mid[X] = p[X] ;
    this.should_recalc_viewport = true ;
  }
  if ( p[Y] < this.min[Y] + 4 ) {
    this.mid[Y] = p[Y] ;
    this.should_recalc_viewport = true ;
  }
  if ( p[Y] > this.max[Y] - 4 ) {
    this.mid[Y] = p[Y] ;
    this.should_recalc_viewport = true ;
  }

  if ( this.should_recalc_viewport ) {
    this.recalcViewport() ;
    this.should_recalc_viewport = false ;

    // draw tiles around player
    this.game.map.each_in_rect( this.min , this.max , UI.updateCallback ) ;
    this.dirty_tiles = [] ;
  }

  // clean up dirty_tiles
  for ( i = 0 ; i < this.dirty_tiles.length ; i++ ) {
    dt = this.dirty_tiles[ i ] ;
    if ( dt == null )
      continue ;
    d = game.map.get( dt[X] , dt[Y] ) ;
    UI.updateCallback( d , this.min , this.max ) ;
  }
  this.dirty_tiles = [] ;

  // draw units in view
  for ( coord in this.game.map.units ) {
    unit = this.game.map.units[ coord ] ;
    d = this.game.map.get( unit.x , unit.y ) ;
    if ( d == null )
      continue ;
    if ( !d.isVisible() ) 
      continue ;
    s = [ unit.x - this.min[X] , unit.y - this.min[Y] ] ;
    if ( unit.x >= this.min[X] &&
       unit.x <= this.max[X] &&
       unit.y >= this.min[Y] &&
       unit.y <= this.max[Y] ) {
      id = s.join() ;
      document.getElementById( id ).style.background =
        'url(' + unit.getImage() + ') ' + unit.getOffset().join( ' ' ) ;
    }
  }

  // update turn counter
  document.getElementById( 'turn-counter' ).innerHTML = 'Health: ' + game.player.hlt + '/' + game.player.max_hlt + ' - Turn: ' +
    this.game.turn ;

  // draw player
  s = [ p[X] - this.min[X] , p[Y] - this.min[Y] ] ;
  document.getElementById( s.join() ).style.background =
    'url(' + this.game.player.image + ') ' +
    this.game.player.offset.join( ' ' ) ;
}

UI.updateCallback = function( mapdata , min , max ) {
  
  // is tile in view?
  if ( mapdata.x < min[X] || mapdata.x > max[X] ||
     mapdata.y < min[Y] || mapdata.y > max[Y] )
    return ;

  tile = mapdata.getTile() ;
  
  // get screen coords
  s = [ ( mapdata.x - min[X] ) , ( mapdata.y - min[Y] ) ] ;
  id = s.join() ;
  square = document.getElementById( id ) ;

  // blank tile
  if ( tile == null ) {
    square.style.background = 'black' ;
    square = null ;
    return ;
  }

  // unseen tile
  if ( !mapdata.isSeen() ) {
    square.style.background = 'black' ;
    square = null ;
    return ;
  }

  // draw tile
  square.style.background = 'url(' + tile.image + ') ' +
                tile.offset.join( ' ' ) ;

  // if tile is not currently visible, shade it
  if ( !mapdata.isVisible() )
    square.getElementsByTagName( 'div' ).item( 0 ).style.display = 'block' ;
  else
    square.getElementsByTagName( 'div' ).item( 0 ).style.display = 'none' ;

  // draw items
  items = mapdata.getItems() ;
  if ( items != null && items.length > 0 ) {
    square.style.background = 'url(' + items[ 0 ].getImage() + ') ' + 
                  items[ 0 ].getOffset().join( ' ' ) ;
  }

  // tidy up
  square = null ;
}

UI.prototype.infrastructure = function() {

  // include stylesheet
  ss = document.createElement( 'link' ) ;
  ss.type = 'text/css' ;
  ss.rel = 'stylesheet' ;
  ss.href = 'css/jrr.css' ;
  document.getElementsByTagName( 'head' ).item( 0 ).appendChild( ss ) ;
  ss = null ;

  // build a table for tile content
  // can't use document.write because i need references to the dom objects

  dungeon = document.getElementById( 'dungeon' ) ;
  while ( dungeon.hasChildNodes() )
    dungeon.removeChild( dungeon.lastChild ) ;
  
  // create a hidden text input field
  input = document.createElement( 'input' ) ;
  input.type = 'text' ;
  input.id = 'usercontrol' ;
  dungeon.parentNode.appendChild( input ) ;
  input.focus() ;
  input = null ;
  
  tr = document.createElement( 'tr' ) ;
  td = document.createElement( 'td' ) ;
  td.colSpan = this.size[X] + 1 ;
  td.id = 'messages' ;
  for ( i = 0 ; i < 4 ; i++ ) {
    div = document.createElement( 'div' ) ;
    div.id = 'msg_' + i ;
    if ( i == 3 )
      div.appendChild( document.createTextNode( 'Messages' ) ) ;
    else
      div.appendChild( document.createElement( 'br' ) ) ;
    td.appendChild( div ) ;
  }
  tr.appendChild( td ) ;
  dungeon.appendChild( tr ) ;
  for ( y = 0 ; y <= this.size[Y] ; y++ ) {
    tr = document.createElement( 'tr' ) ;
    for ( x = 0 ; x <= this.size[X] ; x++ ) {
      td = document.createElement( 'td' ) ;
      td.id = x + ',' + y ;
      td.className = 'square' ;
      div = document.createElement( 'div' ) ;
      div.id = x + "," + y + "_shade" ;
      td.appendChild( div ) ;
      tr.appendChild( td ) ;
    }
    dungeon.appendChild( tr ) ;
  }
  tr = null ;
  td = null ;
  div = null ;

  turn = document.createElement( 'div' ) ;
  turn.id = 'turn-counter' ;
  dungeon.parentNode.appendChild( turn ) ;
  turn = null ;

  inv = document.createElement( 'div' ) ;
  inv.id = 'inventory' ;
  inv.style.width = ( ( this.size[X] - 1 ) * 16 ) + 'px' ;
//  inv.style.height = ( ( this.size[Y] - 1 ) * 16 ) + 'px' ;
  dungeon.parentNode.appendChild( inv ) ;
  inv = null ;

  modal = document.createElement( 'div' ) ;
  modal.id = 'modal' ;
  modal.style.width = ( ( this.size[X] - 3 ) * 16 ) + 'px' ;
  dungeon.parentNode.appendChild( modal ) ;
  modal = null ;

  cursor = document.createElement( 'div' ) ;
  cursor.id = 'cursor' ;
  dungeon.parentNode.appendChild( cursor ) ;
  cursor = null ;

  dungeon = null ;
}

UI.prototype.msg = function( msg ) {
  this.messages.shift() ;
  this.messages.push( msg ) ;
  for ( i = 0 ; i < this.messages.length ; i++ )
    document.getElementById( 'msg_' + i ).innerHTML = this.messages[ i ] ;
}

UI.prototype.displayItemSelector = function( handler , page , onselect ) {
  if ( page < 0 )
    return ;

  from = page * ITEMS_PER_PAGE ;

  if ( page > handler.lastPage )
    return ;

  items = handler.items ;

  inv = document.getElementById( 'inventory' ) ;
  while ( inv.hasChildNodes() )
    inv.removeChild( inv.lastChild ) ;
  h1 = document.createElement( 'h1' ) ;
  h1.appendChild( document.createTextNode( handler.title ) ) ;
  inv.appendChild( h1 ) ;
  h1 = null ;
  list = document.createElement( 'ol' ) ;
  for ( i = 0 ; i < ITEMS_PER_PAGE && ( from + i ) < items.length ; i++ ) {
    item = document.createElement( 'li' ) ;
    if ( onselect != null ) {
      a = document.createElement( 'a' ) ;
      a.id = 'item_' + ( from + i ) ; 
      a.onclick = function( e ) { handler[ onselect ]( this.id.substring( 5 ) ) ; } ;
      a.href = 'javascript:void(0);' ;
      a.appendChild( document.createTextNode( items[ from + i ].getName() ) ) ;
      item.appendChild( a ) ;
      a = null ;
    } else
      item.appendChild( document.createTextNode( items[ from + i ].getName() ) ) ;
    list.appendChild( item ) ;
  }
  inv.appendChild( list ) ;
  a = null ;
  txt = null ;
  item = null ;
  list = null ;
  if ( page > 0 ) {
    prev = document.createElement( 'a' ) ;
    prev.className = 'prev' ;
    prev.onclick = function( e ) { game.ui.displayItemSelector( handler , page - 1 , onselect ) ; } ;
    prev.href = 'javascript:void(0);' ;
    prev.appendChild( document.createTextNode( '(p)rev' ) ) ;
    inv.appendChild( prev ) ;
    prev = null ;
  }
  if ( page < handler.lastPage - 1 ) {
    next = document.createElement( 'a' ) ;
    next.className = 'next' ;
    next.onclick = function( e ) { game.ui.displayItemSelector( handler , page + 1 , onselect ) ; } ;
    next.href = 'javascript:void(0);' ;
    next.appendChild( document.createTextNode( '(n)ext' ) ) ;
    inv.appendChild( next ) ;
    next = null ;
  }
  clear = document.createElement( 'span' ) ;
  clear.className = 'clear' ;
  inv.appendChild( clear ) ;
  clear = null ;

  inv.style.display = 'block' ;
  inv = null ;
}

UI.prototype.hideItemSelector = function() {
  document.getElementById( 'inventory' ).style.display = 'none' ;
}

UI.prototype.itemDetails = function( item ) {
  dialog = document.createElement( 'div' ) ;
  h1 = document.createElement( 'h1' ) ;
  h1.appendChild( document.createTextNode( item.getName() ) ) ;
  dialog.appendChild( h1 ) ;
  h1 = null ;
  p = document.createElement( 'p' ) ;
  p.appendChild( document.createTextNode( item.getDesc() ) ) ;
  dialog.appendChild( p ) ;
  p = null ;
  return dialog ;
}

UI.prototype.unitDetails = function( unit ) {
  dialog = document.createElement( 'div' ) ;
  h1 = document.createElement( 'h1' ) ;
  h1.appendChild( document.createTextNode( unit.getName() ) ) ;
  dialog.appendChild( h1 ) ;
  h1 = null ;
  p = document.createElement( 'p' ) ;
  p.appendChild( document.createTextNode( unit.getDesc() ) ) ;
  dialog.appendChild( p ) ;
  p = null ;
  return dialog ;
}

UI.prototype.tileDetails = function( tile ) {
  dialog = document.createElement( 'div' ) ;
  h1 = document.createElement( 'h1' ) ;
  h1.appendChild( document.createTextNode( tile.getName() ) ) ;
  dialog.appendChild( h1 ) ;
  h1 = null ;
  p = document.createElement( 'p' ) ;
  p.appendChild( document.createTextNode( tile.getDesc() ) ) ;
  dialog.appendChild( p ) ;
  p = null ;
  return dialog ;
}

UI.prototype.victoryMsg = function() {
  dialog = document.createElement( 'div' ) ;
  h1 = document.createElement( 'h1' ) ;
  h1.appendChild( document.createTextNode( 'Victory!' ) ) ;
  dialog.appendChild( h1 ) ;
  h1 = null ;
  p = document.createElement( 'p' ) ;
  p.appendChild( document.createTextNode( 'Well done, you exterminated the poor defenceless kobolds!' ) ) ;
  dialog.appendChild( p ) ;
  p = null ;
  return dialog ;
}

UI.prototype.failureMsg = function() {
  dialog = document.createElement( 'div' ) ;
  h1 = document.createElement( 'h1' ) ;
  h1.appendChild( document.createTextNode( 'You were killed!' ) ) ;
  dialog.appendChild( h1 ) ;
  h1 = null ;
  p = document.createElement( 'p' ) ;
  p.appendChild( document.createTextNode( 'Astounding! You couldn\'t even stand up to a bunch of puny kobolds.' ) ) ;
  dialog.appendChild( p ) ;
  p = null ;
  return dialog ;
}

UI.prototype.showModalDialog = function( dialog ) {
  modal = document.getElementById( 'modal' ) ;
  while ( modal.hasChildNodes() )
    modal.removeChild( modal.lastChild ) ;
  modal.appendChild( dialog ) ;
  dialog = null ;
  modal.style.display = 'block' ;
  modal = null ;
}

UI.prototype.hideModalDialog = function() {
  document.getElementById( 'modal' ).style.display = 'none' ;
}
