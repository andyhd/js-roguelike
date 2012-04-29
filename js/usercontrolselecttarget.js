function UserControlSelectTarget() {
  UserControlState.apply( this , [] ) ;

  this.x = null ;
  this.y = null ;
  this.title = 'Select Target' ;
}
UserControlSelectTarget.prototype = new UserControlState() ;
UserControlSelectTarget.prototype.constructor = UserControlSelectTarget ;

UserControlSelectTarget.prototype.keyPressed = function( key ) {
  if ( this.uc.unit == null )
    return false ;

  if ( this.x == null || this.y == null ) {
    this.x = this.uc.unit.x ;
    this.y = this.uc.unit.y ;
  }

  // erase any current cursor
  document.getElementById( 'cursor' ).style.display = 'none' ;

  // handle cursor movement
  // 'h'
  if ( key == 104 )
    this.move( -1 , 0 ) ;
  // 'l'
  else if ( key == 108 )
    this.move( 1 , 0 ) ;
  // 'j'
  else if ( key == 106 )
    this.move( 0 , 1 ) ;
  // 'k'
  else if ( key == 107 )
    this.move( 0 , -1 ) ;
  // 'y'
  else if ( key == 121 )
    this.move( -1 , -1 ) ;
  // 'u'
  else if ( key == 117 )
    this.move( 1 , -1 ) ;
  // 'b'
  else if ( key == 98 )
    this.move( -1 , 1 ) ;
  // 'n'
  else if ( key == 110 )
    this.move( 1 , 1 ) ;

  // 'q'
  if ( key == 113 ) {
    this.ended = true ;
    return false ;
  }

  // '.'
  if ( key == 46 )
    this.selectTarget() ;

  // add a border to the square the cursor is on
  s = [ ( this.x - game.ui.min[X] ) * 16 , ( this.y - game.ui.min[Y] ) * 16 ] ;
  cursor = document.getElementById( 'cursor' ) ;
  cursor.style.left = '' + s[X] + 'px' ;
  cursor.style.top = '' + s[Y] + 'px' ;
  cursor.style.display = 'block' ;
  cursor = null ;
  return false ;
}

UserControlSelectTarget.prototype.move = function( x , y ) {
  if ( this.x + x >= game.ui.min[X] &&
     this.x + x <= game.ui.max[X] )
    this.x += x ;
  if ( this.y + y >= game.ui.min[Y] &&
     this.y + y <= game.ui.max[Y] )
    this.y += y ;
}

UserControlSelectTarget.prototype.selectTarget = function() {
}
