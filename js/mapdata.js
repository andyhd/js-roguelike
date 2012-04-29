function MapData( map , x , y ) {
  this.map = map ;
  this.x = x ;
  this.y = y ;
}

MapData.prototype.getTile = function() {
  return this.map.tiles[ this.x + "," + this.y ] ;
}

MapData.prototype.setTile = function( tile ) {
  if ( this.x < this.map.min[X] )
    this.map.min[X] = this.x ;
  if ( this.x > this.map.max[X] )
    this.map.max[X] = this.x ;
  if ( this.y < this.map.min[Y] )
    this.map.min[Y] = this.y ;
  if ( this.y > this.map.max[Y] )
    this.map.max[Y] = this.y ;
  this.map.tiles[ this.x + "," + this.y ] = tile ;
  return tile ;
}

MapData.prototype.getFlags = function() {
  return this.map.flags[ this.x + "," + this.y ] ;
}

MapData.prototype.setFlags = function( flags ) {
  if ( this.map.tiles[ this.x + "," + this.y ] == null )
    return null ;
  this.map.flags[ this.x + "," + this.y ] = flags ;
  return flags ;
}

MapData.prototype.getUnit = function() {
  return this.map.units[ this.x + "," + this.y ] ;
}

MapData.prototype.setUnit = function( unit ) {
  if ( this.map.tiles[ this.x + "," + this.y ] == null )
    return null ;
  this.map.units[ this.x + "," + this.y ] = unit ;
  return unit ;
}

MapData.prototype.removeUnit = function() {
  if ( this.map.tiles[ this.x + "," + this.y ] == null )
    return ;
  delete this.map.units[ this.x + "," + this.y ] ;
}

MapData.prototype.getItems = function() {
  return this.map.items[ this.x + "," + this.y ] ;
}

MapData.prototype.setItems = function( items ) {
  if ( this.map.tiles[ this.x + "," + this.y ] == null )
    return null ;
  this.map.items[ this.x + "," + this.y ] = items ;
  return items ;
}

MapData.prototype.removeItem = function( item ) {
  if ( this.map.tiles[ this.x + "," + this.y ] == null )
    return null ;
  items = this.getItems() ;
  if ( items == null )
    return null ;
  tmp = [] ;
  for ( i = 0 ; i < items.length ; i++ )
    if ( items[ i ] !== item )
      tmp.push( item ) ;
  
  return this.setItems( tmp ) ;
}

MapData.prototype.addItem = function( item ) {
  if ( this.map.tiles[ this.x + "," + this.y ] == null )
    return null ;
  items = this.getItems() ;
  if ( items == null )
    items = [] ;
  items.push( item ) ;
  return this.setItems( items ) ;
}

BLOCK_NONE = 0 ;
BLOCK_TILE = 1 ;
BLOCK_ITEM = 2 ;
BLOCK_UNIT = 3 ;
BLOCK_PLAYER = 4 ;

MapData.prototype.blocksMove = function() {
  tile = this.getTile() ;
  if ( tile == null )
    return BLOCK_TILE ;
  if ( tile.blocksMove )
    return BLOCK_TILE ;
  if ( ( items = this.getItems() ) != null ) {
    for ( item in items ) {
      if ( items[ item ].blocksMove() )
        return BLOCK_ITEM ;
    }
  }
  if ( this.getUnit() != null )
    return BLOCK_UNIT ;
  if ( this.x == game.player.x && this.y == game.player.y )
    return BLOCK_PLAYER ;
  return BLOCK_NONE ;
}

MapData.prototype.blocksLOS = function() {
  tile = this.getTile() ;
  if ( tile == null )
    return true ;
  if ( tile.blocksLOS )
    return true ;
  if ( ( items = this.getItems() ) != null ) {
    for ( item in items ) {
      if ( items[ item ].blocksLOS() )
        return true ;
    }
  }
  return false ;
}

MapData.prototype.isVisible = function() {
  if ( this.getTile() == null )
    return false ;
  if ( this.getFlags() == null )
    return false ;
  return ( this.map.flags[ this.x + "," + this.y ] & MAP_TILE_VISIBLE ) > 0 ;
}

MapData.prototype.setVisible = function( flag ) {
  if ( this.getTile() == null )
    return null ;
  flags = this.map.flags[ this.x + ',' + this.y ] ;
  if ( flag )
    flags |= MAP_TILE_VISIBLE ;
  else
    flags &= ~MAP_TILE_VISIBLE ;
  this.map.flags[ this.x + ',' + this.y ] = flags ;
  game.ui.dirty( this.x , this.y ) ;
}

MapData.prototype.isSeen = function() {
  if ( this.getTile() == null )
    return false ;
  if ( this.getFlags() == null )
    return false ;
  return ( this.map.flags[ this.x + ',' + this.y ] & MAP_TILE_SEEN ) > 0 ;
}

MapData.prototype.setSeen = function( flag ) {
  if ( this.getTile() == null )
    return null ;
  flags = this.map.flags[ this.x + ',' + this.y ] ;
  if ( flag )
    flags |= MAP_TILE_SEEN ;
  else
    flags &= ~MAP_TILE_SEEN ;
  this.map.flags[ this.x + ',' + this.y ] = flags ;
}

MapData.prototype.toString = function() {
  return "MapData(" + this.x + "," + this.y + "): tile=" + this.getTile() +
    ", items=" + ( ( items = this.getItems() ) == null ? 0 : items.length ) ;
}
