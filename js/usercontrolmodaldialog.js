function UserControlModalDialog( next ) {
  UserControlState.apply( this , [] ) ;

  this.next = next ;
}
UserControlModalDialog.prototype = new UserControlState() ;
UserControlModalDialog.prototype.constructor = UserControlModalDialog ;

UserControlModalDialog.prototype.keyPressed = function( key ) {

  // handle input on dialog
  // 'q'
  if ( key == 113 ) {
    game.ui.hideModalDialog() ;
    this.ended = true ;
    return false ;
  }

  return false ;
}
