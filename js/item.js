function Item( definition ) {
  this.definition = definition ;
  return this ;
}

Item.prototype.getName = function() {
  return this.definition.name ;
}

Item.prototype.blocksMove = function() {
  return this.definition.blocksMove ;
}

Item.prototype.blocksLOS = function() {
  return this.definition.blocksLOS ;
}

Item.prototype.getDesc = function() {
  return this.definition.desc ;
}

Item.prototype.getImage = function() {
  return this.definition.image ;
}

Item.prototype.getOffset = function() {
  return this.definition.offset ;
}

Item.prototype.isDoor = function() {
  return this.definition.door ;
}

Item.prototype.getKey = function() {
  return this.definition.key ;
}

Item.prototype.getWeight = function() {
  return this.definition.weight ;
}

Item.prototype.getSize = function() {
  return this.definition.size ;
}

Item.prototype.toString = function() {
  return "Item (" + this.definition + ")" ;
}
