// 1. advance towards target
// 2. attack if in range
// 3. if target lost, head to last seen position and check los
// 3.1. if target seen, goto 1
// 3.2. if target lost, wander

function Attack( target ) {
  Behaviour.apply( this , [] ) ;
  this.target = target ;
  this.original_bump_handler = null ;
  this.allow_bump = true ;
}
Attack.prototype = new Behaviour() ;
Attack.prototype.constructor = Attack ;

Attack.prototype.act = function() {

  // if no target, switch to wandering
  if ( this.target == null ) {
    this.unit.setBehaviour( new Wandering() ) ;
    return ;
  }
  t = this.target ;
  u = this.unit ;

  // save unit's original bump handler
  if ( this.original_bump_handler == null ) {
    this.original_bump_handler = u.bump ;
  }

  // set up a new bump handler
  u.bump = function( foe ) {
    retval = Unit.prototype.bump.apply( this , [ foe ] ) ;
    if ( retval == BUMP_NO_UNIT )
      return retval ;
    if ( foe == t ) {
      this.attack( foe ) ;
      return BUMP_ATTACKED ;
    }
    return retval ;
  } ;

  // can we see the target?
  r = u.canSee( t.x , t.y ) ;
  if ( r )
    Advance.prototype.act.apply( this , [] ) ;

  // we can't see the target
  else {
    if ( this.last_seen_pos == null ) {

      // check map los data, and head to last seen position
      return; // XXX temporary patch
    }

    // if we are at the last seen position, give up
    if ( u.x == this.last_seen_pos[X] &&
         u.y == this.last_seen_pos[Y] ) {

      // if we still can see the target, switch to wander
      u.setBehaviour( new Wandering() ) ;
      return ;
    }

    // keep moving towards the last seen position
  }
}
