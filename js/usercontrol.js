function UserControl() {
  Behaviour.apply( this ) ;

  this.state = null ;
}
UserControl.prototype = new Behaviour() ;
UserControl.prototype.constructor = UserControl ;

UserControl.prototype.act = function( evt ) {
  if ( evt == null )
    return ;

  if ( this.state == null )
    this.setState( null ) ;

  // check to see whether current state should change
  if ( this.state.ended )
    this.setState( this.state.next ) ;

  // get keyboard input
  key = evt.charCode ;
  if ( !key )
    key = evt.keyCode ;
  r = this.state.keyPressed( key ) ;
  if ( r )
    game.nextTurn() ;
}

UserControl.prototype.setState = function( state ) {
  if ( state == null )
    state = new UserControlDefault() ;
  this.state = state ;
  this.state.uc = this ;
}

UserControl.prototype.getState = function() {
  return this.state ;
}

UserControl.prototype.toString = function() {
  return "UserControl: unit=" + this.unit.name + ", state=" + this.state ;
}
