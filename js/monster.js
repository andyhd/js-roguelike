function Monster( def ) {
  Unit.apply( this , [] ) ;
  this.definition = def ;
  this.str = def.str ;
  this.atk = def.atk ;
  this.hlt = def.hlt ;
  this.max_hlt = def.hlt ;
  this.def = def.def ;
  this.saveMod = def.saveMod ;
}
Monster.prototype = new Unit() ;
Monster.prototype.constructor = Monster ;

Monster.prototype.getName = function() {
  return this.definition.name ;
}

Monster.prototype.getImage = function() {
  return this.definition.image ;
}

Monster.prototype.getDesc = function() {
  return this.definition.desc ;
}

Monster.prototype.getOffset = function() {
  return this.definition.offset ;
}

Monster.prototype.toString = function() {
  return this.definition.name ;
}

Monster.prototype.enemyOf = function( unit ) {
  return ( unit === game.player ) ;
}

Monster.prototype.attack = function( unit ) {
  retval = Unit.prototype.attack.apply( this , [ unit ] ) ;
  if ( unit !== game.player )
    return retval ;
  if ( retval == ATK_HIT )
    game.ui.msg( 'The ' + this + ' hits you' ) ;
  if ( retval == ATK_DEFENDED )
    game.ui.msg( 'The ' + this + ' fails to harm you.' ) ;
  if ( retval == ATK_MISSED )
    game.ui.msg( 'The ' + this + ' swings and misses.' ) ;
  if ( retval == ATK_PARRIED )
    game.ui.msg( 'You parry the ' + this + '\'s strike.' ) ;
  if ( retval == ATK_KILLED )
    game.ui.msg( 'You are struck down!' ) ;
  return retval ;
}

Monster.prototype.fumble = function( foe ) {
  if ( foe !== game.player )
    return ;
  game.ui.msg( 'The ' + this + ' drops it\'s guard!' ) ;
}

Monster.prototype.critical = function( foe ) {
  if ( foe !== game.player )
    return ;
  game.ui.msg( 'The ' + this + ' gains the upper hand!' ) ;
}

