function Regroup() {
  GroupBehaviour.apply( this ) ;
}
Regroup.prototype = new GroupBehaviour() ;
Regroup.prototype.constructor = Regroup ;

Regroup.prototype.addUnit = function( unit ) {
  GroupBehaviour.prototype.addUnit.apply( this , [ unit ] ) ;
  if ( this.leader == null )
    this.leader = unit ;
}

Regroup.prototype.removeUnit = function( unit ) {
  GroupBehaviour.prototype.removeUnit.apply( this , [ unit ] ) ;
  if ( unit == this.leader )
    for ( u in this.units )
      u.behaviourEnded() ;
}

Regroup.prototype.act = function() {
  game.ui.msg( this.unit + ' is regrouping' ) ;

  // if this is the leader, call friends over
  if ( this.unit == this.leader )
    if ( this.units.length > 2 ) {
      
      // all go do something else
    } else {

      // check for friends in sight
      friends = this.units ;
      new_friend = false ;
      regroup = this ;
      min = [ this.unit.x - LOS_RADIUS , this.unit.y - LOS_RADIUS ] ;
      max = [ this.unit.x + LOS_RADIUS + 1 , this.unit.y + LOS_RADIUS + 1 ] ;
      game.map.each_in_rect( min , max , function( d , a , b ) {
        if ( !u.canSee( d.x , d.y ) )
          return ;
        for ( u in friends )
          if ( d.x == friends[ u ].x && d.y == friends[ u ].y )
            return ;
        unit = d.getUnit() ;
        if ( unit != null )
          if ( u.enemyOf( unit ) ) {
            regroup.addUnit( u ) ;
            u.setBehaviour( regroup ) ;
            new_friend = true ;
          }
      } ) ;

      // if player is in earshot, shout out
      if ( new_friend && this.unit.canSee( game.player ) )
        game.ui.msg( 'The ' + this.unit + ' shouts!' ) ;
    }

  // otherwise, rally to the leader
  else
    this.target = this.leader ;
    Advance.prototype.act.apply( this , [] ) ;
}

Regroup.prototype.toString = function() {
  return "Regroup: unit=" + this.unit.name + ", leader=" + this.leader.name ;
}
