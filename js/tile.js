tileCache = [] ;

function Tile() {
  this.name = null ;
  this.desc = null ;
  this.zIndex = 0 ;
  this.image = 'images/gltile16.png' ;
  this.offset = [ 0 , 0 ] ;
  this.wall = false ;
  this.blocksMove = false ;
  this.blocksLOS = false ;
}

Tile.prototype.toString = function() {
  return "Tile (" + this.name + "): zIndex=" + this.zIndex + ", wall=" +
    this.wall + ", blocksMove=" + this.blocksMove + ", blocksLOS=" +
    this.blocksLOS + ", image=" + this.image + ", offset=" + this.offset.join() ;
}

Tile.prototype.getName = function() {
  return this.name ;
}

Tile.prototype.getDesc = function() {
  return this.desc ;
}
