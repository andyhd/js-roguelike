function UserControlDefault() {
  UserControlState.apply( this ) ;
}
UserControlDefault.prototype = new UserControlState() ;
UserControlDefault.prototype.constructor = UserControlDefault ;

UserControlDefault.prototype.keyPressed = function( key ) {
  if ( this.uc == null )
    return false ;
  if ( this.uc.unit == null )
    return false ;

  key_pressed = false ;
  obstacle = null ;

  // key handling code
  // 'h'
  if ( key == 104 )
    obstacle = this.uc.unit.move( [ -1 , 0 ] ) ;
  // 'l'
  else if ( key == 108 )
    obstacle = this.uc.unit.move( [ 1 , 0 ] ) ;
  // 'j'
  else if ( key == 106 )
    obstacle = this.uc.unit.move( [ 0 , 1 ] ) ;
  // 'k'
  else if ( key == 107 )
    obstacle = this.uc.unit.move( [ 0 , -1 ] ) ;
  // 'y'
  else if ( key == 121 )
    obstacle = this.uc.unit.move( [ -1 , -1 ] ) ;
  // 'u'
  else if ( key == 117 )
    obstacle = this.uc.unit.move( [ 1 , -1 ] ) ;
  // 'b'
  else if ( key == 98 )
    obstacle = this.uc.unit.move( [ -1 , 1 ] ) ;
  // 'n'
  else if ( key == 110 )
    obstacle = this.uc.unit.move( [ 1 , 1 ] ) ;

  key_pressed = obstacle ;

  // 'o'
  if ( key == 111 ) {
    this.uc.setState( new UserControlOpen() ) ;
    key_pressed = true ;
  }

  // ',' or 'g'
  if ( key == 44 || key == 103 ) {
    this.uc.setState( new UserControlPickup() ) ;
    this.uc.state.keyPressed( key ) ;
    key_pressed = true ;
  }

  // 'd'
  if ( key == 100 ) {
    this.uc.setState( new UserControlDrop() ) ;
    key_pressed = this.uc.state.keyPressed( key ) ;
  }

  // 'i'
  if ( key == 105 ) {
    this.uc.setState( new UserControlInventory() ) ;
    this.uc.state.keyPressed( key ) ;
    key_pressed = false ;
  }

  // 'x' eXamine
  if ( key == 120 ) {
    this.uc.setState( new UserControlLook() ) ;
    this.uc.state.keyPressed( key ) ;
    key_pressed = false ;
  }

  return key_pressed ;
}
