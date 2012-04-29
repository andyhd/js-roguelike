NORTH = 0 ;
EAST = 1 ;
SOUTH = 2 ;
WEST = 3 ;

PASSAGE = 0 ;
ROOM = 1 ;
START = 2 ;

MAX_PLACE_ATTEMPTS = 20 ;

function MapMaker() {
  this.map = new Map() ;
  this.hotspots = [] ;
  this.placeAttempts = 0 ;
}

MapMaker.prototype.fits = function( a ) {
  this.placeAttempts++ ;
  for ( i = 0 ; i < this.map.placed.length ; i++ ) {
    b = this.map.placed[ i ] ;
    if ( a[Y] >= b[Y] + b[H] ||
       a[Y] + a[H] <= b[Y] ||
       a[X] >= b[X] + b[W] ||
       a[X] + a[W] <= b[X] )
      continue ;
    return false ;
  }
  return true ;
}

MapMaker.prototype.build = function( hotspot , limit , floor , wall , facing , type ) {

  // generate room coords
  if ( facing == NORTH ) {
    tl = [ hotspot[X] - rand( limit[X] - 1 ) , hotspot[Y] - limit[Y] ] ;
    if ( type == START ) limit[Y]++ ;
  }
  if ( facing == SOUTH ) {
    tl = [ hotspot[X] - rand( limit[X] - 1 ) , hotspot[Y] ] ;
    if ( type == START ) tl[Y]-- ;
  }
  if ( facing == EAST ) {
    tl = [ hotspot[X] , hotspot[Y] - rand( limit[Y] - 1 ) ] ;
    if ( type == START ) tl[X]-- ;
  }
  if ( facing == WEST ) {
    tl = [ hotspot[X] - limit[X] , hotspot[Y] - rand( limit[Y] - 1 ) ] ;
    if ( type == START ) limit[X]++ ;
  }
  rect = [ tl[X] , tl[Y] , limit[X] , limit[Y] ] ;

  // check there is space for the room
  num_new_hotspots = 0 ;
  if ( this.fits( rect ) ) {
    if ( facing != WEST || type == START ) {
      coord = [ tl[X] + limit[X] , rand( limit[Y] - 1 ) + tl[Y] ] ;
      this.hotspots[ coord.join() ] = [ EAST , type ] ;
      num_new_hotspots++ ;
    }
    if ( facing != EAST || type == START ) {
      coord = [ tl[X] , rand( limit[Y] - 1 ) + tl[Y] ] ;
      this.hotspots[ coord.join() ] = [ WEST , type ] ;
      num_new_hotspots++ ;
    }
    if ( facing != NORTH || type == START ) {
      coord = [ rand( limit[X] - 1 ) + tl[X] , tl[Y] + limit[Y] ] ;
      this.hotspots[ coord.join() ] = [ SOUTH , type ] ;
      num_new_hotspots++ ;
    }
    if ( facing != SOUTH || type == START ) {
      coord = [ rand( limit[X] - 1 ) + tl[X] , tl[Y] ] ;
      this.hotspots[ coord.join() ] = [ NORTH , type ] ;
      num_new_hotspots++ ;
    }
  } else
    return false ;

  // add room to floorplan
  this.map.placed.push( rect ) ;

  // add tiles to map
  for ( j = 0 ; j <= rect[H] ; j++ )
    for ( i = 0 ; i <= rect[W] ; i++ ) {
      x = rect[X] + i ;
      y = rect[Y] + j ;
      d = this.map.get( x , y ) ;
      if ( ( j == 0 || j == rect[H] || i == 0 || i == rect[W] ) &&
         wall != null )
        d.setTile( wall ) ;
      else
        d.setTile( floor ) ;
    }

  // replace join point with door
  if ( type != START ) {
    d = this.map.get( hotspot[X] , hotspot[Y] ) ;
    d.setTile( floor ) ;
    d.addItem( game.itemCache.get( 'door_shut' ) ) ;
  }

  return true ;
}

MapMaker.buildMap = function() {
  floor = tileCache[ 'floor' ] ;
  wall = tileCache[ 'wall' ] ;
  mm = new MapMaker ;
  buildNext = [ 95 , 66 , 66 ] ;
  mm.build( [ 0 , 0 ] ,
        [ rand( 4 ) + 4 , rand( 4 ) + 4 ] ,
        floor ,
        wall ,
        NORTH ,
        START ) ;
  while ( mm.placeAttempts < MAX_PLACE_ATTEMPTS ) {

    // fetch the hotspots into a more manageable array structure
    tmp = [] ;
    for ( h in mm.hotspots )
      tmp.push( [ h , mm.hotspots[ h ] ] ) ;

    // no more hotspots
    if ( tmp.length == 0 )
      break ;

    // fetch a random hotspot
    index = rand( tmp.length ) - 1 ;
    coord = tmp[ index ][ 0 ] ;
    hotspot = tmp[ index ][ 1 ] ;
    coord = coord.split( ',' ) ;

    // convert coord array to integers
    coord[X] = parseInt( coord[X] ) ;
    coord[Y] = parseInt( coord[Y] ) ;
    ok = true ;
    if ( rand( 100 ) >= buildNext[ hotspot[ 1 ] ] )
      if ( hotspot[ 0 ] == NORTH || hotspot[ 0 ] == SOUTH )
        ok = mm.build( coord ,
                 [ 2 , rand( 4 ) + 4 ] ,
                 floor ,
                 wall ,
                 hotspot[ 0 ] ,
                 PASSAGE ) ;
      else
        ok = mm.build( coord ,
                 [ rand( 4 ) + 4 , 2 ] ,
                 floor ,
                 wall ,
                 hotspot[ 0 ] ,
                 PASSAGE ) ;
    else
      ok = mm.build( coord ,
               [ rand( 4 ) + 4 , rand( 4 ) + 4 ] ,
               floor ,
               wall ,
               hotspot[ 0 ] ,
               ROOM ) ;
    if ( ok ) {

      // delete this hotspot
      temp = [] ;
      for ( h in mm.hotspots )
        if ( h == coord )
          continue ;
        else
          temp[ h ] = mm.hotspots[ h ] ;
      mm.hotspots = temp ;
      temp = null ;
    }
    tmp = null ;
  }

  // place some random monsters
  num_monsters = rand( 4 ) + 4 ;
  for ( i = 0 ; i < num_monsters ; i++ ) {

    // pick a random monster type
    tmp = [] ;
    for ( m in game.monsterCache.monsters )
      tmp.push( [ m , game.monsterCache.monsters[ m ] ] ) ;
    type = rand( tmp.length ) - 1 ;
    monster = game.monsterCache.get( tmp[ type ][ 0 ] ) ;

    // try three times max to place monster
    monster_ok = false ;
    for ( j = 0 ; j < 3 ; j++ ) {

      // pick a random room
      room = mm.map.placed[ rand( mm.map.placed.length ) - 1 ] ;

      // pick a random point inside the room
      x = room[X] + rand( room[W] - 2 ) + 1 ;
      y = room[Y] + rand( room[H] - 2 ) + 1 ;

      // check there is space for a monster
      if ( mm.map.get( x , y ).blocksMove() )
        continue ;

      // place the monster at the location
      monster.x = x ;
      monster.y = y ;
      monster_ok = true ;
      mm.map.units[ x + "," + y ] = monster ;
      break ;
    }

    // if the monster couldn't be placed, skip it
    if ( !monster_ok )
      continue ;

    // pick a behaviour for the monster
    monster.setBehaviour( new Wandering() ) ;

  }

  return mm.map ;
}
