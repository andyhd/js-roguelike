TINY = 0 ;
SMALL = 1 ;
MEDIUM = 2 ;
BIG = 3 ;
HUGE = 4 ;

CARRIED = 0 ;
WORN = 1 ;
WIELDED = 2 ;

function ItemDefinition() {
  this.name = 'A thing' ;
  this.desc = 'Indescribable' ;
  this.image = 'images/gltile16.png' ;
  this.offset = [ 0 , 0 ] ;
  this.door = false ;
  this.blocksMove = false ;
  this.blocksLOS = false ;
  this.key = 'key' ;
  this.weight = 0 ;
  this.size = SMALL ;
  this.effects = [] ;
  return this ;
}

ItemDefinition.prototype.toString = function() {
  return "ItemDefinition (" + this.key + "): name=" + this.name + ", blocksMove? " + this.blocksMove + ", blocksLOS? " + this.blocksLOS + ", door? " + this.door + ", image=" + this.image + ", weight=" + this.weight ;
}
