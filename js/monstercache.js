function MonsterCache() {
  this.monsters = new Array() ;
  return this ;
}

MonsterCache.prototype.get = function( key ) {
  if ( this.monsters[ key ] == null )
    return null ;
  return new Monster( this.monsters[ key ] ) ;
}

MonsterCache.prototype.put = function( key , monsterdef ) {
  this.monsters[ key ] = monsterdef ;
}
