function Advance() {
  Behaviour.apply( this ) ;
  this.target = null ;
  this.retreat = false ;
  this.allow_bump = false ;
  this.avoid_player = false ;
  this.avoid_unit = null ;
}
Advance.prototype = new Behaviour() ;
Advance.prototype.constructor = Advance ;

function distance( a , b ) {
  return Math.abs( a[X] - b[X] ) + Math.abs( a[Y] - b[Y] ) ;
}

Advance.prototype.score = function( d ) {
  u = this.unit ;
  t = u ;
  if ( this.target != null )
    t = this.target ;
  score = distance( [ t.x , t.y ] , [ d.x , d.y ] ) ;
  if ( this.avoid_player ) {
    p = [ game.player.x , game.player.y ] ;
    score -= distance( p , [ d.x , d.y ] ) ;
  }
  if ( this.avoid_unit != null ) {
    a = this.avoid_unit ;
    score -= distance( [ a.x , a.y ] , [ d.x , d.y ] ) ;
  }
  return score ;
}

Advance.prototype.act = function() {

  if ( this.target == null )
    this.unit.behaviourEnded() ;

  u = this.unit ;
  t = this.target ;
  
  // check all adjacent squares and pick the closest to the target
  origin = game.map.get( u.x , u.y ) ;
  squares = [] ;
  origin_score = Advance.prototype.score.apply( this , [ u ] ) ;
  closest = origin_score ;
  furthest = origin_score ;
  allow_bump = this.allow_bump ;
  retreat = this.retreat ;
  game.map.each_in_rect(
    [ u.x - 1 , u.y - 1 ] ,
    [ u.x + 1 , u.y + 1 ] ,
    function( d , a , b ) {
      if ( d.x == u.x && d.y == u.y )
        return ;
      v = d.getUnit() ;
      if ( d.blocksMove() && v == null )
        return ;
      if ( !allow_bump &&
         ( v != null ||
           d.x == game.player.x || d.y == game.player.y ) )
        return ;
      dist = Advance.prototype.score.apply( this , [ d ] ) ;
      if ( !retreat && dist < closest ) {
        closest = dist ;
        if ( squares[ dist ] == null )
          squares[ dist ] = [] ;
        squares[ dist ].push( d ) ;
      }
      if ( retreat && dist > furthest ) {
        furthest = dist ;
        if ( squares[ dist ] == null )
          squares[ dist ] = [] ;
        squares[ dist ].push( d ) ;
      }
    }
  ) ;

  // move towards the closest square
  if ( !retreat && closest < origin_score ) {
    s = null ;
    if ( squares[ closest ].length > 1 )
      s = squares[ closest ][ rand( squares[ closest ].length ) - 1 ] ;
    else
      s = squares[ closest ][ 0 ] ;
    u.move( [ s.x - u.x , s.y - u.y ] ) ;
  }
  if ( retreat && furthest > origin_score ) {
    s = null ;
    if ( squares[ furthest ].length > 1 )
      s = squares[ furthest ][ rand( squares[ furthest ].length ) - 1 ] ;
    else
      s = squares[ furthest ][ 0 ] ;
    u.move( [ s.x - u.x , s.y - u.y ] ) ;
  }

}

Advance.prototype.toString = function() {
  return 'Advance: unit=' + this.unit ;
}
