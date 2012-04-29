function Behaviour() {
  this.unit = null ;
}

Behaviour.prototype.act = function() {
  alert( 'You were supposed to override act' ) ;
}

Behaviour.prototype.toString = function() {
  alert( 'You were supposed to override toString' ) ;
}
