function GroupBehaviour() {
  Behaviour.apply( this ) ;
  this.units = new Array() ;
}
GroupBehaviour.prototype = new Behaviour() ;
GroupBehaviour.prototype.constructor = GroupBehaviour ;

GroupBehaviour.prototype.addUnit = function( unit ) {
  this.units.push( unit ) ;
}

GroupBehaviour.prototype.removeUnit = function( unit ) {
  tmp = new Array() ;
  for ( u in this.units ) {
    if ( u == unit )
      continue ;
    tmp.push( u ) ;
  }
  this.units = tmp ;
}
