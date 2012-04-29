// wandering behaviour should be as follows:
// 1. pick a random position nearby
// 2. walk to position
// 3. goto 1

function Wandering() {
  Behaviour.apply( this , [] ) ;
}
Wandering.prototype = new Behaviour() ;
Wandering.prototype.constructor = Wandering ;

Wandering.prototype.act = function() {

  // can we see an enemy?
  min = [ this.unit.x - LOS_RADIUS , this.unit.y - LOS_RADIUS ] ;
  max = [ this.unit.x + LOS_RADIUS + 1 , this.unit.y + LOS_RADIUS + 1 ] ;
  u = this.unit ;
  changedBehaviour = false ;
  game.map.each_in_rect( min , max , function( d , a , b ) {
    if ( d.x == u.x && d.y == u.y )
      return ;
    if ( !u.canSee( d.x , d.y ) )
      return ;
    unit = d.getUnit() ;
    if ( unit == null && game.player.x == d.x && game.player.y == d.y )
      unit = game.player ;
    if ( unit != null ) {
      if ( u.enemyOf( unit ) ) {
        u.setBehaviour( new Attack( unit ) ) ;
        changedBehaviour = true ;
      }
    }
  } ) ;
  if ( changedBehaviour )
    return ;

  // try to move up to three times
  for ( attempts = 0 ; attempts < 3 ; attempts++ ) {
    
    // generate a random direction
    direction = rand( 10 ) - 1 ;

    // try to move in the given direction
    switch ( direction ) {
      case 0:
        r = true ; // don't move
        break ;
      case 1:
        r = this.unit.move( [ 0 , -1 ] ) ;
        break ;
      case 2:
        r = this.unit.move( [ -1 , 0 ] ) ;
        break ;
      case 3:
        r = this.unit.move( [ 0 , 1 ] ) ;
        break ;
      case 4:
        r = this.unit.move( [ 1 , 0 ] ) ;
        break ;
      case 5:
        r = this.unit.move( [ -1 , -1 ] ) ;
        break ;
      case 6:
        r = this.unit.move( [ 1 , -1 ] ) ;
        break ;
      case 7:
        r = this.unit.move( [ 1 , 1 ] ) ;
        break ;
      case 8:
        r = this.unit.move( [ -1 , 1 ] ) ;
        break ;
      case 9:
        r = true ;
        break ;
      default:
        alert( 'bad direction in ' + this ) ;
    }
    if ( r == true )
      break ;
  }
}

Wandering.prototype.toString = function() {
  return "Wandering: unit=" + this.unit.name ;
}
