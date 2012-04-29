function UserControlPickup() {
  UserControlSelectItem.apply( this , [] ) ;
}
UserControlPickup.prototype = new UserControlSelectItem() ;
UserControlPickup.prototype.constructor = UserControlPickup ;

UserControlPickup.prototype.keyPressed = function( key ) {
  unit = this.uc.unit ;
  data = game.map.get( unit.x , unit.y ) ;
  this.items = data.getItems() ;
  this.ended = true ;
  if ( this.items == null )
    return true ;

  // special case only one item
  if ( this.items.length == 1 )
    if ( unit.pickUp( this.items[ 0 ] ) == PICKUP_OK )
      return true ;
    else
      return false ;

  // multiple item selection
  if ( this.items.length > 1 ) {
    this.ended = false ;
    UserControlSelectItem.prototype.keyPressed.apply( this , [ key ] ) ;
    return true ;
  }

}

UserControlPickup.prototype.selectItem = function( index ) {
  this.ended = true ;
  this.uc.unit.pickUp( this.items[ index ] ) ;
  game.ui.hideItemSelector() ;
}
