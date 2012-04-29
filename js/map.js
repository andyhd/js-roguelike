MAP_TILE_VISIBLE = 1 ;
MAP_TILE_SEEN = 2 ;

function Map() {
  this.min = [ 0 , 0 ] ;
  this.max = [ 0 , 0 ] ;
  this.tiles = [] ;
  this.items = [] ;
  this.flags = [] ;
  this.units = [] ;
  this.placed = [] ;
}

Map.prototype.each_in_rect = function( min , max , callback ) {
  for ( y = min[Y] ; y <= max[Y] ; y++ ) {
    for ( x = min[X] ; x <= max[X] ; x++ ) {
      callback( this.get( x , y ) , min , max ) ;
    }
  }
}

Map.prototype.each = function( callback ) {
  this.each_in_rect( this.min , this.max , callback ) ;
}

Map.prototype.get = function( x , y ) {
  return new MapData( this , x , y ) ;
}

Map.load = function( tiledefs , itemdefs , monsters ) {
  map = new Map() ;

  // parse tiledefs
  for ( tiledef in tiledefs ) {
    tile = new Tile() ;
    tile.name = tiledef ;
    for ( attrib in tiledefs[ tiledef ] ) {
      tile[ attrib ] = tiledefs[ tiledef ][ attrib ] ;
    }
    tileCache[ tiledef ] = tile ;
  }
  tiledefs = null ;

  // parse itemdefs
  for ( itemdef in itemdefs ) {
    def = new ItemDefinition() ;
    for ( attrib in itemdefs[ itemdef ] ) {
      def[ attrib ] = itemdefs[ itemdef ][ attrib ] ;
    }
    def.key = itemdef ;
    game.itemCache.put( itemdef , def ) ;
  }
  itemdefs = null ;

  // parse monsters
  for ( m in monsters ) {
    monsterdef = new MonsterDefinition() ;
    for ( attrib in monsters[ m ] )
      monsterdef[ attrib ] = monsters[ m ][ attrib ] ;
    game.monsterCache.put( m , monsterdef ) ;
  }
  monsters = null ;

/* for predefined maps
  // parse mapdata
  for ( y = 0 ; y < mapdata.length ; y++ ) {
    line = mapdata[ y ].split('') ;
    for ( x = 0 ; x < line.length ; x++ ) {
      map.get( x , y ).setTile( tileCache[ legend[ line[ x ] ] ] ) ;
    }
  }
  mapdata = null ;

  // parse itemdata
  for ( loc in itemdata ) {
    item = game.itemCache.get( itemdata[ loc ] ) ;
    if ( item == null )
      continue ;
    coord = loc.split(',') ;
    data = map.get( coord[X] , coord[Y] ) ;
    items = data.getItems() ;
    if ( items == null )
      items = [] ;
    items.push( item ) ;
    r = data.setItems( items ) ;
  }  
*/
  return map ;
}
