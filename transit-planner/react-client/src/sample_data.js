const sampleLines = [
  'Red Line to 95/Dan Ryan',
  'Red Line to Howard',
  'Blue Line to O\'Hare',
  'Blue Line to Forest Park',
  'Green Line to Harlem/Lake',
  'Green Line to Ashland/63rd'
];

const sampleStopList = {
  lineId: 2,
  name: 'Pink Line to Damen',
  stops: [
    {
      id: 1,
      name: "54th/Cermak",
      is_favorite: false
    },
    {
      id: 2,
      name: "Cicero",
      is_favorite: true
    },
    {
      id: 3,
      name: "Kostner",
      is_favorite: false
    },
    {
      id: 4,
      name: "Pulaski",
      is_favorite: false
    },
    {
      id: 5,
      name: "Central Park",
      is_favorite: true
    },
    {
      id: 6,
      name: "Kedzie",
      is_favorite: false
    },
    {
      id: 7,
      name: "California",
      is_favorite: false
    },
    {
      id: 8,
      name: "Western",
      is_favorite: false
    },
    {
      id: 9,
      name: "Damen",
      is_favorite: false
    }
  ]
}

const sampleStationList = [
  {
    id: 1,
    name: "Washington/Wells",
    is_favorite: false
  },
  {
    id: 2,
    name: "Quincy",
    is_favorite: true
  },
  {
    id: 3,
    name: "LaSalle/Van Buren",
    is_favorite: false
  },
  {
    id: 4,
    name: "Library - State/Van Buren",
    is_favorite: false
  },
  {
    id: 5,
    name: "Adams/Wabash",
    is_favorite: false
  },
  {
    id: 6,
    name: "Washington/Wabash",
    is_favorite: false
  },
  {
    id: 7,
    name: "State/Lake",
    is_favorite: false
  },
  {
    id: 8,
    name: "Clark/Lake",
    is_favorite: false
  },
  {
    id: 9,
    name: 'Division',
    is_favorite: false
  },
  {
    id: 10,
    name: 'Roosevelt',
    is_favorite: true
  }
]

const sampleDirections = [
  {
    mainText: 'Start at Roosevelt',
    secondaryText: null,
    lineColor: null,
    stops: null
  },
  {
    mainText: 'Red Line to Howard',
    secondaryText: null,
    lineColor: '#c60c30',
    stops: [
      'Roosevelt',
      'Harrison',
      'Jackson'
    ]
  },
  {
    mainText: 'Change Trains',
    secondaryText: null,
    lineColor: null,
    stops: null
  },
  {
    mainText: 'Blue Line to O\'Hare',
    secondaryText: '6 stops',
    lineColor: '#00a1de',
    stops: [
      'Jackson',
      'Monroe',
      'Washington',
      'Clark/Lake',
      'Grand',
      'Chicago',
      'Division'
    ]
  },
  {
    mainText: 'Arrive at Division',
    secondaryText: null,
    lineColor: null,
    stops: null
  }
];

const data = {
  sampleLines,
  sampleStopList,
  sampleStationList,
  sampleDirections
};

export default data;