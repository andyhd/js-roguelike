function UserControlSelectItem() {
  UserControlState.apply( this , [] ) ;
  
  this.page = 0 ;
  this.lastPage = 0 ;
  this.title = 'Select Item' ;
}
UserControlSelectItem.prototype = new UserControlState() ;
UserControlSelectItem.prototype.constructor = UserControlSelectItem ;

UserControlSelectItem.prototype.keyPressed = function( key ) {

  if ( this.items == null )
    this.items = [] ;
    
  if ( this.lastPage == 0 )
    this.lastPage = Math.ceil( this.items.length / ITEMS_PER_PAGE ) ;

  // handle input on dialog
  // 'n'
  if ( key == 110 && this.page < this.lastPage - 1 )
    this.page++ ;
  
  // 'p'
  if ( key == 112 && this.page > 0 )
    this.page-- ;

  // 'q'
  if ( key == 113 ) {
    game.ui.hideItemSelector() ;
    this.ended = true ;
    return false ;
  }

  // numbers '1' -> '9'
  if ( key > 48 && key < 58 ) {
    this.selectItem( this.page * ITEMS_PER_PAGE + ( key - 49 ) ) ;
    return false ;
  }

  // update selectitem listing
  game.ui.displayItemSelector( this , this.page , 'selectItem' ) ;
  return false ;
}

UserControlSelectItem.prototype.selectItem = function( index ) {
  if ( this.items == null || this.items.length < 1 )
    return false ;
  items = this.items ;
  if ( index < 0 || index >= items.length )
    return false ;
  game.ui.showModalDialog( game.ui.itemDetails( this.items[ index ] ) ) ;
  this.uc.setState( new UserControlModalDialog( this ) ) ;
}
