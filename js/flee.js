// run away from the target
// 1. pick furthest adjacent square from the target
// 2. go there
// 3. goto 1

function Flee( attacker ) {
  Behaviour.apply( this , [] ) ;
  this.target = attacker ;
  this.retreat = true ;
}
Flee.prototype = new Behaviour() ;
Flee.prototype.constructor = Flee ;

Flee.prototype.act = function() {

  t = this.target ;
  u = this.unit ;

//  if ( t != null && !u.canSee( t.x , t.y ) )
//    this.target = null ;

  // if no target, switch to regroup
  if ( this.target == null ) {
    this.unit.setBehaviour( new Regroup() ) ;
    return ;
  }

  Advance.prototype.act.apply( this ) ;
}
