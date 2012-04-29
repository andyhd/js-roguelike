function UserControlDrop() {
  UserControlSelectItem.apply( this , [] ) ;
  this.title = 'Drop Item' ;
}
UserControlDrop.prototype = new UserControlSelectItem() ;
UserControlDrop.prototype.constructor = UserControlDrop ;

UserControlDrop.prototype.keyPressed = function( key ) {
  if ( this.items == null && this.uc.unit.inventory != null )
    this.items = this.uc.unit.inventory ;
  if ( this.items == null || this.items.length < 1 ) {
    this.ended = true ;
    return false ;
  }
  return UserControlSelectItem.prototype.keyPressed.apply( this , [ key ] ) ;
}

UserControlDrop.prototype.selectItem = function( index ) {
  game.ui.hideItemSelector() ;
  this.ended = true ;
  this.uc.unit.drop( this.items[ index ] ) ;
}
