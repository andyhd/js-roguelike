function UserControlLook() {
  UserControlSelectTarget.apply( this , [] ) ;
}
UserControlLook.prototype = new UserControlSelectTarget() ;
UserControlLook.prototype.constructor = UserControlLook ;

UserControlLook.prototype.keyPressed = function( key ) {
  return UserControlSelectTarget.prototype.keyPressed.apply( this , [ key ] ) ;
}

UserControlLook.prototype.selectTarget = function( index ) {
  if ( this.x == game.player.x && this.y == game.player.y ) {
    game.ui.showModalDialog( game.ui.unitDetails( game.player ) ) ;
    this.uc.setState( new UserControlModalDialog( this ) ) ;
    return false ;
  }
  visible = this.uc.unit.canSee( this.x , this.y ) ;
  if ( !visible ) {
    game.ui.msg( 'You can\'t see that' ) ;
    return false ;
  }
  d = game.map.get( this.x , this.y ) ;
  if ( unit = d.getUnit() ) {
    game.ui.showModalDialog( game.ui.unitDetails( unit ) ) ;
    this.uc.setState( new UserControlModalDialog( this ) ) ;
  } else if ( items = d.getItems() ) {
    game.ui.showModalDialog( game.ui.itemDetails( items[ 0 ] ) ) ;
    this.uc.setState( new UserControlModalDialog( this ) ) ;
  } else {
    game.ui.showModalDialog( game.ui.tileDetails( d.getTile() ) ) ;
    this.uc.setState( new UserControlModalDialog( this ) ) ;
  }
}
