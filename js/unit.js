function Unit() {
  this.dead = false ;
  this.x = 0 ;
  this.y = 0 ;
  this.behaviour = null ;
  this.inventory = null ;
  this.str = 0 ;
  this.hlt = 0 ;
  this.max_hlt = 0 ;
  this.def = 0 ;
  this.saveMod = 0 ;
  this.burden = 0 ;
}

Unit.prototype.move = function( vector ) {

  // find destination
  x = this.x + vector[X] ;
  y = this.y + vector[Y] ;

  // check for obstacles
  d = game.map.get( x , y ) ;
  if ( d == null )
    return false ;
  retval = d.blocksMove() ;
  if ( retval == BLOCK_TILE ||
     retval == BLOCK_ITEM )
    return false ;
  if ( retval == BLOCK_UNIT ) {
    unit = d.getUnit() ;
    r = this.bump( unit )
    if ( r == BUMP_ATTACKED )
      return true ;
    if ( r == BUMP_OK )
      return false ;
  }
  if ( retval == BLOCK_PLAYER ) {
    r = this.bump( game.player ) ;
    if ( r == BUMP_ATTACKED )
      return true ;
    if ( r == BUMP_OK )
      return false ;
  }

  // move
  d = game.map.get( this.x , this.y ) ;
  if ( this !== game.player )
    d.removeUnit() ;
  game.ui.dirty( this.x , this.y ) ;
  this.x = x ;
  this.y = y ;
  if ( this !== game.player ) {
    d = game.map.get( x , y ) ;
    d.setUnit( this ) ;
  }
  return true ;
} ;

BUMP_NO_UNIT = 0 ;
BUMP_OK = 1 ;
BUMP_ATTACKED = 2 ;
BUMP_SWITCHED = 3 ;

Unit.prototype.bump = function( unit ) {
  if ( unit == null ) {
    alert( this + ' cannot bump into null' ) ;
    return BUMP_NO_UNIT ;
  }

  // override this
  return BUMP_OK ;
}

ATK_NO_UNIT = 0 ;
ATK_FRIENDLY = 1 ;
ATK_FUMBLE = 2 ;
ATK_HIT = 3 ;
ATK_DEFENDED = 4 ;
ATK_MISSED = 5 ;
ATK_PARRIED = 6 ;
ATK_KILLED = 7 ;
ATK_CRITICAL = 8 ;

Unit.prototype.attack = function( foe ) {
  if ( foe == null )
    return ATK_NO_UNIT ;

  // unit is friendly?

  // get attack and defend scores
  atk_roll = rand( 12 ) ;
  def_roll = rand( 12 ) ;

  // fumble
  if ( atk_roll == 1 ) {
    this.fumble( foe ) ;

    // foe gets free attack
    foe.attack( this ) ;
    return ATK_FUMBLE ;
  }

  // critical hit
  if ( atk_roll == 12 ) {
    this.critical( foe ) ;

    // free attack
    this.attack( foe ) ;
    if ( foe.isDead() )
      return ;
  }

  // check hit
  hit = ( atk_roll > tohit[ this.atk ][ foe.atk ] ? 1 :
      ( atk_roll < tohit[ this.atk ][ foe.atk ] ? -1 : 0 ) ) ;
  if ( hit == 1 ) {

    // throw damage dice
    damage = 0 ;
    for ( i = 0 ; i < this.dmg ; i++ )
      if ( rand( 12 ) > foe.def )
        damage++ ;

    // if no damage is done, the foe defended
    if ( damage == 0 )
      return ATK_DEFENDED ;

    // apply the damage
    foe.takeDamage( damage , this , false ) ;
    if ( foe.isDead() )
      return ATK_KILLED ;
    return ATK_HIT ;
  }

  // lesser attack rating loses
  if ( hit == -1 )
    return ATK_MISSED ;

  // a draw
  return ATK_PARRIED ;
}

Unit.prototype.fumble = function( unit ) {
  alert( 'You were supposed to override fumble()' ) ;
}

Unit.prototype.critical = function( foe ) {
  alert( 'You were supposed to override critical' ) ;
}

Unit.prototype.defend = function( modifier ) {
  save_throw = rand( 12 ) ;

  // TODO - this save throw is too effective!
//  game.ui.msg( unit + ' throws ' + save_throw + ' and needs <= ' + ( this.def + modifier ) ) ;
  return ( save_throw <= ( this.def + modifier ) ) ;
}

Unit.prototype.takeDamage = function( damage , attacker , critical ) {
  this.hlt -= damage ;
  if ( this.hlt < this.max_hlt / 2 )
    if ( this != game.player )
      this.setBehaviour( new Flee( attacker ) ) ;
}

Unit.prototype.isDead = function() {
  if ( this.hlt <= 0 )
    return true ;
  return false ;
}

Unit.prototype.enemyOf = function( unit ) {
  alert( 'You were supposed to override enemyOf()' ) ;
}

Unit.prototype.open = function( vector ) {
  data = game.map.get( this.x + vector[X] , this.y + vector[Y] ) ;
  items = data.getItems() ;
  if ( items == null )
    return null ;
  door = null ;
  for ( item in items ) {
    if ( items[ item ].isDoor() ) {
      door = items[ item ] ;
      break ;
    }
  }
  if ( door == null )
    return null ;
  name = '' ;
  key = door.getKey() ;
  if ( key.indexOf( '_shut' ) > 0 )
    key = key.replace( /_shut/ , '_open' ) ;
  else if ( key.indexOf( '_open' ) > 0 ) {
    if ( items.length > 1 )
      return items ;
    key = key.replace( /_open/ , '_shut' ) ;
  } else
    // bad door name
    return null ;
  new_door = game.itemCache.get( key ) ;
  if ( new_door == null )
    return null ;
  if ( !new_door.isDoor() )
    return null ;
  tmp = [] ;
  for ( item in items ) {
    if ( items[ item ] == door )
      continue ;
    tmp.push( items[ item ] ) ;
  }
  tmp.unshift( new_door ) ;
  data.setItems( tmp ) ;
  game.ui.dirty( data.x , data.y ) ;
  return tmp ;
} ;

Unit.prototype.setBehaviour = function( b ) {
  if ( b == null ) {
    alert( this.name + ' setBehaviour( null )' ) ;
    return ;
  }
  b.unit = this ;
  this.behaviour = b ;
} ;

Unit.prototype.getBehaviour = function() {
  return this.behaviour ;
} ;

Unit.prototype.act = function() {
  this.behaviour.act() ;
} ;

Unit.prototype.behaviourEnded = function() {
  if ( this.nextBehaviour == null )
    this.behaviour = new Wandering() ;
  else {
    this.behaviour = this.nextBehaviour ;
    this.nextBehaviour = null ;
  }
} ;

PICKUP_OK = 0 ;
PICKUP_NO_ITEM = 1 ;
PICKUP_TOO_HEAVY = 2 ;
PICKUP_TOO_BIG = 3 ;

Unit.prototype.pickUp = function( item ) {
  if ( item == null )
    return PICKUP_NO_ITEM ;

  weight = item.getWeight() ;
  size = item.getSize() ;
  if ( this.burden + weight > this.str * KILOS_PER_STR )
    return PICKUP_TOO_HEAVY ;

  // TODO - size test here - return PICKUP_TOO_BIG

  // move item to inventory
  data = game.map.get( this.x , this.y ) ;
  data.removeItem( item ) ;
  if ( this.inventory == null )
    this.inventory = new Array() ;
  this.inventory.push( item ) ;
  this.burden += weight ;
  return PICKUP_OK ;
}

DROP_OK = 0 ;
DROP_NO_ITEM = 1 ;
DROP_CANNOT = 2 ;

Unit.prototype.drop = function( item ) {
  if ( item == null )
    return DROP_NO_ITEM ;
  if ( this.inventory == null || this.inventory.length < 1 )
    return DROP_NO_ITEM ;
  ok_to_drop = false ;
  tmp = [] ;
  for ( i = 0 ; i < this.inventory.length ; i++ )
    if ( this.inventory[ i ] === item )
      ok_to_drop = true ;
    else
      tmp.push( this.inventory[ i ] ) ;
  if ( !ok_to_drop )
    return DROP_NO_ITEM ;

  // replace inventory with tmp
  this.inventory = tmp ;
  tmp = null ;
  this.burden -= item.getWeight() ;

  // place the item at this location
  data = game.map.get( this.x , this.y ) ;
  data.addItem( item ) ;
  return DROP_OK ;
}

Unit.prototype.canSee = function( x , y ) {
  dx = this.x - x ;
  dy = this.y - y ;

  ax = Math.abs( dx ) << 1 ;
  ay = Math.abs( dy ) << 1 ;

  sx = ( dx < 0 ) ? -1 : 1 ;
  sy = ( dy < 0 ) ? -1 : 1 ;

  if ( ax > ay ) {
    t = ay - ( ax >> 1 ) ;
    do {
      if ( t >= 0 ) {
        y += sy ;
        t -= ax ;
      }
      x += sx ;
      t += ay ;
      if ( x == this.x && y == this.y )
        return true ;
    } while ( !game.map.get( x , y ).blocksLOS() ) ;
    return false ;
  } else {
    t = ax - ( ay >> 1 ) ;
    do {
      if ( t >= 0 ) {
        x += sx ;
        t -= ay ;
      }
      y += sy ;
      t += ax ;
      if ( x == this.x && y == this.y )
        return true ;
    } while ( !game.map.get( x , y ).blocksLOS() ) ;
    return false ;
  }
}

Unit.prototype.toString = function() {
  return "Unit: x=" + this.x + ", y=" + this.y + ", dead=" + this.dead + ", behaviour=" + this.behaviour ;
}
