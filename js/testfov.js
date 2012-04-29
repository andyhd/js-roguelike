function TestFOV( map ) {
  this.map = map ;
}

TestFOV.prototype.go = function( x , y ) {

  // clear visible flags
  this.map.each( function( d ) {
    if ( d.isVisible() )
      d.setVisible( false ) ;
  } ) ;

  // unless player is blind, the tile he is on is visible
  d = this.map.get( x , y ) ;
  d.setSeen( true ) ;
  d.setVisible( true ) ;

  // make all rooms that the player is in visible (two rooms if in a doorway)
  for ( i = 0 ; i < this.map.placed.length ; i++ ) {
    room = this.map.placed[ i ] ;
    min = [ room[X] , room[Y] ] ;
    max = [ room[X] + room[W] , room[Y] + room[H] ] ;
    if ( y > max[Y] ||
       y < min[Y] ||
       x > max[X] ||
       x < min[X] ) {
      continue ;
    }
    this.map.each_in_rect( min , max , function( d , a , b ) {
      d.setVisible( true ) ;
      d.setSeen( true ) ;
    } ) ;
  }
}
