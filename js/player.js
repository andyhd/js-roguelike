function Player( userControl ) {
  Unit.apply( this , [] ) ;

  this.behaviour = null ;
  this.name = 'Player' ;
  this.image = 'images/gltile16.png' ;
  this.offset = [ "-464px" , "-160px" ] ;
  this.setBehaviour( userControl ) ;
  this.str = 5 ;
  this.atk = 5 ;
  this.dmg = 2 ;
  this.def = 4 ;
  this.hlt = 4 ;
  this.max_hlt = 4 ;
  this.x = 0 ;
  this.y = 0 ;
  this.inventory = [] ;
}
Player.prototype = new Unit() ;
Player.prototype.constructor = Player ;

Player.prototype.move = function( vector ) {
  retval = Unit.prototype.move.apply( this , [ vector ] ) ;
  if ( retval ) {

    // check for items on the floor
    data = game.map.get( this.x , this.y ) ;
    items = data.getItems() ;
    if ( items != null )
      if ( items.length == 1 && !items[ 0 ].isDoor() )
        game.ui.msg( "There is something here." ) ;
      else if ( items.length > 1 )
        game.ui.msg( "There are some items here." ) ;
  }
  return retval ;
}

Player.prototype.bump = function( unit ) {
  retval = Unit.prototype.bump.apply( this , [ unit ] ) ;
  if ( retval == BUMP_NO_UNIT )
    return retval ;
  this.attack( unit ) ;
  return BUMP_ATTACKED ;
}

Player.prototype.attack = function( unit ) {
  retval = Unit.prototype.attack.apply( this , [ unit ] ) ;
  if ( retval == ATK_NO_UNIT )
    game.ui.msg( 'You swipe at nothing.' ) ;
  if ( retval == ATK_FRIENDLY )
    game.ui.msg( 'You refuse to strike an innocent.' ) ;
  if ( retval == ATK_CRITICAL )
    game.ui.msg( 'You strike powerfully!' ) ;
  if ( retval == ATK_HIT )
    game.ui.msg( 'You hit the ' + unit + '.' ) ;
  if ( retval == ATK_DEFENDED )
    game.ui.msg( 'The ' + unit + ' blocks your attack.' ) ;
  if ( retval == ATK_MISSED )
    game.ui.msg( 'You missed.' ) ;
  if ( retval == ATK_PARRIED )
    game.ui.msg( 'The ' + unit + ' parries your blow.' ) ;
  if ( retval == ATK_KILLED ) {
    d = game.map.get( unit.x , unit.y ) ;
    d.removeUnit() ;
    d.addItem( game.itemCache.get( 'corpse' ) ) ;
    game.ui.dirty( unit.x , unit.y ) ;
    game.ui.msg( 'The ' + unit + ' falls down dead.' ) ;
  }
  return retval ;
}

Player.prototype.fumble = function( foe ) {
  game.ui.msg( 'You overbalance! The ' + foe + ' strikes!' ) ;
}

Player.prototype.critical = function( foe ) {
  game.ui.msg( 'You trip the ' + foe + '!' ) ;
}

Player.prototype.open = function( vector ) {
  retval = Unit.prototype.open.apply( this , [ vector ] ) ;
  if ( retval == null ) {
    game.ui.msg( 'There is no door here!' ) ;
    return null ;
  }
  if ( retval.length != 1 ) {
    game.ui.msg( 'The doorway is blocked' ) ;
    return retval ;
  }
  if ( retval instanceof Array ) {
    door = retval[ 0 ] ;
    key = door.getKey() ;
    if ( key.indexOf( '_open' ) > 0 ) {
      this.x += vector[X] ;
      this.y += vector[Y] ;
      this.doFOV() ;
      this.x -= vector[X] ;
      this.y -= vector[Y] ;
      game.ui.msg( 'Door opened' ) ;
    } else if ( key.indexOf( '_shut' ) > 0 )
      game.ui.msg( 'Door shut' ) ;
  }
  return retval ;
}

Player.prototype.pickUp = function( item ) {
  retval = Unit.prototype.pickUp.apply( this , [ item ] ) ;
  if ( retval == PICKUP_NO_ITEM )
    game.ui.msg( "There's nothing here!" ) ;
  if ( retval == PICKUP_TOO_HEAVY )
    game.ui.msg( "You can't lift it" ) ;
  if ( retval == PICKUP_TOO_BIG )
    game.ui.msg( "It's too big" ) ;
  if ( retval == PICKUP_OK )
    game.ui.msg( "You picked up " + item.getName() ) ;
  return retval ;
}

Player.prototype.drop = function( item ) {
  retval = Unit.prototype.drop.apply( this , [ item ] ) ;
  if ( retval == DROP_NO_ITEM )
    game.ui.msg( "You haven't got that item!" ) ;
  if ( retval == DROP_CANNOT )
    game.ui.msg( "You cannot drop it!" ) ;
  if ( retval == DROP_OK )
    game.ui.msg( "You dropped " + item.getName() ) ;
  return retval ;
}

Player.prototype.doFOV = function() {
  fov = new TestFOV( game.map ) ;
  fov.go( this.x , this.y ) ;
}

Player.prototype.getName = function() {
  return this.name ;
}

Player.prototype.getImage = function() {
  return this.image ;
}

Player.prototype.getOffset = function() {
  return this.offset ;
}

Player.prototype.toString = function() {
  return 'Player' ;
}

Player.prototype.getDesc = function() {
  return 'That\'s you!' ;
}
