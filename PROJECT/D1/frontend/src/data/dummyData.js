
export const dummyUsers = [
  {
    id: 'u1',
    name: 'Alex Morgan',
    handle: '@alexm',
    bio: 'Building things and breaking things.',
    avatar: 'https://avataaars.io/?avatarStyle=Circle&topType=WinterHat3&accessoriesType=Prescription01&hatColor=Red&facialHairType=BeardLight&facialHairColor=BrownDark&clotheType=GraphicShirt&clotheColor=Red&graphicType=Selena&eyeType=Close&eyebrowType=Angry&mouthType=Disbelief&skinColor=Light',
    friends: ['u2', 'u3'],
  },
  {
    id: 'u2',
    name: 'Sam Reddy',
    handle: '@samr',
    bio: 'Coffee, code, repeat.',
    avatar: 'https://avataaars.io/?avatarStyle=Circle&topType=LongHairFro&accessoriesType=Round&hairColor=Auburn&facialHairType=MoustacheMagnum&facialHairColor=Auburn&clotheType=BlazerSweater&clotheColor=Blue01&eyeType=Hearts&eyebrowType=Angry&mouthType=Smile&skinColor=Yellow',
    friends: ['u1'],
  },
  {
    id: 'u3',
    name: 'Jordan Lee',
    handle: '@jlee',
    bio: 'Game dev & pixel art enthusiast.',
    avatar: 'https://avataaars.io/?avatarStyle=Circle&topType=LongHairCurly&accessoriesType=Kurt&hairColor=BlondeGolden&facialHairType=Blank&facialHairColor=Blonde&clotheType=ShirtScoopNeck&clotheColor=PastelYellow&eyeType=Wink&eyebrowType=SadConcernedNatural&mouthType=Vomit&skinColor=DarkBrown',
    friends: ['u1'],
  },
]

export const dummyPosts = [
  {
    id: 'p1',
    authorId: 'u1',
    text: 'Just shipped the new dashboard, feeling good about it!',
    image: 'https://picsum.photos/seed/p1/600/350',
    createdAt: '2026-08-30T10:00:00Z',
    comments: [
      { id: 'c1', authorId: 'u2', text: 'Nice work!' },
      { id: 'c2', authorId: 'u3', text: 'Looks great.' },
    ],
  },
  {
    id: 'p2',
    authorId: 'u2',
    text: 'Morning coffee hits different today.',
    image: 'https://picsum.photos/seed/p2/600/350',
    createdAt: '2026-08-31T08:15:00Z',
    comments: [{ id: 'c3', authorId: 'u1', text: 'Same here.' }],
  },
  {
    id: 'p3',
    authorId: 'u3',
    text: 'Working on a new pixel art tileset for the garden project.',
    image: 'https://picsum.photos/seed/p3/600/350',
    createdAt: '2026-09-01T14:30:00Z',
    comments: [],
  },
]

export const getUserById = (id) => dummyUsers.find((u) => u.id === id)
export const getPostById = (id) => dummyPosts.find((p) => p.id === id)
