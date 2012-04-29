tiledefs = {
  'floor':{
    zIndex:2,
    offset:['-256px','-416px'],
    desc:'A large granite flagstone.'
  },
  'wall':{
    zIndex:3,
    offset:['-48px','-416px'],
    desc:'A solid stone wall.',
    blocksMove:true,
    blocksLOS:true,
    wall:true
  }
} ;

itemdefs = {
  'door_shut':{
    name:'Shut door',
    blocksMove:true,
    blocksLOS:true,
    door:true,
    weight:150,
    size:HUGE,
    offset:[ ( -13 * 16 ) + 'px' , ( 8 * 16 ) + 'px' ]
  },
  'door_open':{
    name:'Open door',
    door:true,
    weight:150,
    size:HUGE,
    offset:[ ( -9 * 16 ) + 'px' , ( 8 * 16 ) + 'px' ]
  },
  'sword':{
    name:'Sword',
    weight:8,
    size:MEDIUM,
    desc:'A sturdy blade',
    offset:[ ( -7 * 16 ) + 'px' , ( -13 * 16 ) + 'px' ] ,
    effects:{
      when:WIELDED,
      atk:1
    }
  } ,
  'corpse':{
    name:'Corpse',
    weight:18,
    size:BIG,
    desc:'A dead body',
    offset:[ ( 4 * 16 ) + 'px' , ( 15 * 16 ) + 'px' ]
  }
} ;

monsters = {
  'kobold':{
    name:'Kobold',
    desc:'A small dog-faced goblin.',
    offset:[ ( 4 * 16 ) + 'px' , '-16px' ] ,
    str:3,
    atk:5,
    def:2,
    hlt:3
  }
} ;
