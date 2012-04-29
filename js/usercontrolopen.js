function UserControlOpen() {
  UserControlState.apply( this , [] ) ;
}
UserControlOpen.prototype = new UserControlState() ;
UserControlOpen.prototype.constructor = UserControlOpen ;

UserControlOpen.prototype.keyPressed = function( key ) {
  if ( key == 104 )
    this.uc.unit.open( [ -1 , 0 ] ) ;
  else if ( key == 106 )
    this.uc.unit.open( [ 0 , 1 ] ) ;
  else if ( key == 107 )
    this.uc.unit.open( [ 0 , -1 ] ) ;
  else if ( key == 108 )
    this.uc.unit.open( [ 1 , 0 ] ) ;
  // 'y'
  else if ( key == 121 )
    this.uc.unit.open( [ -1 , -1 ] ) ;
  // 'u'
  else if ( key == 117 )
    this.uc.unit.open( [ 1 , -1 ] ) ;
  // 'b'
  else if ( key == 98 )
    this.uc.unit.open( [ -1 , 1 ] ) ;
  // 'n'
  else if ( key == 110 )
    this.uc.unit.open( [ 1 , 1 ] ) ;

  else
    return false ;
  this.ended = true ;

  return true ;
}
