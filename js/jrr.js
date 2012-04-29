X = 0 ;
Y = 1 ;
W = 2 ;
H = 3 ;

ITEMS_PER_PAGE = 9 ;

KILOS_PER_STR = 10 ;

LOS_RADIUS = 10 ;

function rand( limit ) {
  return Math.ceil( Math.random() * limit ) ;
}

function rand_normal( limit ) {

  // approximate a normal distribution
  // generate 3 random numbers 0 <= r < 0.3333 and add them together
  var r =  Math.random() * 0.3333 ;
      r += Math.random() * 0.3333 ;
      r += Math.random() * 0.3333 ;

  // return an integer in the range 1 <= r <= limit
  return Math.ceil( r * limit ) ;
}

