function UserControlInventory() {
  UserControlSelectItem.apply( this , [] ) ;

  this.items = null ;
  this.title = 'Inventory' ;
}
UserControlInventory.prototype = new UserControlSelectItem() ;
UserControlInventory.prototype.constructor = UserControlInventory ;

UserControlInventory.prototype.keyPressed = function( key ) {
  if ( this.items == null && this.uc.unit.inventory != null )
    this.items = this.uc.unit.inventory ;
  return UserControlSelectItem.prototype.keyPressed.apply( this , [ key ] ) ;
}

UserControlInventory.prototype.selectItem = function( index ) {
  if ( index < 0 || index >= this.items.length )
    return false ;
  game.ui.showModalDialog( game.ui.itemDetails( this.items[ index ] ) ) ;
  this.uc.setState( new UserControlModalDialog( this ) ) ;
}
