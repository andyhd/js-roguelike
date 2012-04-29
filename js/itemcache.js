function ItemCache() {
  this.items = new Array() ;
  return this ;
}

ItemCache.prototype.get = function( key ) {
  if ( this.items[ key ] == null )
    return null ;
  return new Item( this.items[ key ] ) ;
}

ItemCache.prototype.put = function( key , itemdef ) {
  this.items[ key ] = itemdef ;
}
