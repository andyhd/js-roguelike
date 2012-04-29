EFFECT_CARRIED = 0 ;
EFFECT_WORN = 1 ;
EFFECT_WIELDED = 2 ;

function Effect() {
  this.atk_mod = 0 ;
  this.def_mod = 0 ;
  this.trigger = EFFECT_CARRIED ;
}

Effect.prototype.toString = function() {
  out = 'Effect: ' ;
  if ( atk_mod != 0 )
    out += 'atk += ' + atk_mod ;
  if ( def_mod != 0 )
    out += 'def += ' + def_mod ;
  out += ' when ' ;
  switch ( this.trigger ) {
    case EFFECT_CARRIED:
      out += 'carried' ;
      break ;
    case EFFECT_WORN:
      out += 'worn' ;
      break ;
    case EFFECT_WIELDED:
      out += 'wielded' ;
      break ;
  }
  return out ;
