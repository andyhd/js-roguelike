function UserControlState() {
  this.uc = null ;
  this.ended = false ;
  this.next = null ;
} ;

UserControlState.prototype.keyPressed = function( key ) {
  alert( 'You were supposed to override keyPressed' ) ;
} ;

UserControlState.prototype.toString = function() {
  return "UserControlState: uc=" + this.uc + ", ended=" + this.ended + ", next=" + this.next ;
} ;
