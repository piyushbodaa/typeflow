import { tokenize } from '../engine/generate'

/**
 * Every line you type in Typeflow comes from here: stanzas from well-loved poems across the
 * world. All texts are in the public domain (the poet died long ago, or the English
 * translation is old enough), or were translated for Typeflow. Punctuation is normalised to
 * what a keyboard can type: straight quotes and plain hyphens, no em dashes.
 */
export interface Poem {
  id: string
  title: string
  poet: string
  /** Country or tradition the poem comes from. */
  origin: string
  year?: number
  translator?: string
  /** True when the text is the complete poem, not an excerpt. */
  full?: boolean
  /** Lines of the stanza. Joined with spaces for typing. */
  lines: string[]
}

export const POEMS: Poem[] = [
  // ---- English ----
  {
    id: 'sonnet-18',
    title: 'Sonnet 18',
    poet: 'William Shakespeare',
    origin: 'England',
    year: 1609,
    full: true,
    lines: [
      "Shall I compare thee to a summer's day?",
      'Thou art more lovely and more temperate:',
      'Rough winds do shake the darling buds of May,',
      'And summer\'s lease hath all too short a date;',
      'Sometime too hot the eye of heaven shines,',
      "And often is his gold complexion dimm'd;",
      'And every fair from fair sometime declines,',
      "By chance or nature's changing course untrimm'd;",
      'But thy eternal summer shall not fade,',
      "Nor lose possession of that fair thou ow'st;",
      "Nor shall Death brag thou wander'st in his shade,",
      "When in eternal lines to time thou grow'st:",
      'So long as men can breathe or eyes can see,',
      'So long lives this, and this gives life to thee.',
    ],
  },
  {
    id: 'all-the-worlds-a-stage',
    title: "All the world's a stage",
    poet: 'William Shakespeare',
    origin: 'England',
    year: 1623,
    lines: [
      "All the world's a stage,",
      'And all the men and women merely players;',
      'They have their exits and their entrances;',
      'And one man in his time plays many parts,',
      'His acts being seven ages.',
    ],
  },
  {
    id: 'daffodils',
    title: 'I Wandered Lonely as a Cloud',
    poet: 'William Wordsworth',
    origin: 'England',
    year: 1807,
    lines: [
      'I wandered lonely as a cloud',
      "That floats on high o'er vales and hills,",
      'When all at once I saw a crowd,',
      'A host, of golden daffodils;',
      'Beside the lake, beneath the trees,',
      'Fluttering and dancing in the breeze.',
    ],
  },
  {
    id: 'my-heart-leaps-up',
    title: 'My Heart Leaps Up',
    poet: 'William Wordsworth',
    origin: 'England',
    year: 1807,
    full: true,
    lines: [
      'My heart leaps up when I behold',
      'A rainbow in the sky:',
      'So was it when my life began;',
      'So is it now I am a man;',
      'So be it when I shall grow old,',
      'Or let me die!',
      'The Child is father of the Man;',
      'And I could wish my days to be',
      'Bound each to each by natural piety.',
    ],
  },
  {
    id: 'the-tyger',
    title: 'The Tyger',
    poet: 'William Blake',
    origin: 'England',
    year: 1794,
    lines: [
      'Tyger Tyger, burning bright,',
      'In the forests of the night;',
      'What immortal hand or eye,',
      'Could frame thy fearful symmetry?',
    ],
  },
  {
    id: 'auguries-of-innocence',
    title: 'Auguries of Innocence',
    poet: 'William Blake',
    origin: 'England',
    year: 1803,
    lines: [
      'To see a World in a Grain of Sand',
      'And a Heaven in a Wild Flower,',
      'Hold Infinity in the palm of your hand',
      'And Eternity in an hour.',
    ],
  },
  {
    id: 'ozymandias',
    title: 'Ozymandias',
    poet: 'Percy Bysshe Shelley',
    origin: 'England',
    year: 1818,
    lines: [
      'And on the pedestal, these words appear:',
      'My name is Ozymandias, King of Kings;',
      'Look on my Works, ye Mighty, and despair!',
      'Nothing beside remains. Round the decay',
      'Of that colossal Wreck, boundless and bare',
      'The lone and level sands stretch far away.',
    ],
  },
  {
    id: 'endymion',
    title: 'Endymion',
    poet: 'John Keats',
    origin: 'England',
    year: 1818,
    lines: [
      'A thing of beauty is a joy for ever:',
      'Its loveliness increases; it will never',
      'Pass into nothingness; but still will keep',
      'A bower quiet for us, and a sleep',
      'Full of sweet dreams, and health, and quiet breathing.',
    ],
  },
  {
    id: 'she-walks-in-beauty',
    title: 'She Walks in Beauty',
    poet: 'Lord Byron',
    origin: 'England',
    year: 1814,
    lines: [
      'She walks in beauty, like the night',
      'Of cloudless climes and starry skies;',
      "And all that's best of dark and bright",
      'Meet in her aspect and her eyes;',
      'Thus mellowed to that tender light',
      'Which heaven to gaudy day denies.',
    ],
  },
  {
    id: 'kubla-khan',
    title: 'Kubla Khan',
    poet: 'Samuel Taylor Coleridge',
    origin: 'England',
    year: 1816,
    lines: [
      'In Xanadu did Kubla Khan',
      'A stately pleasure-dome decree:',
      'Where Alph, the sacred river, ran',
      'Through caverns measureless to man',
      'Down to a sunless sea.',
    ],
  },
  {
    id: 'ulysses',
    title: 'Ulysses',
    poet: 'Alfred, Lord Tennyson',
    origin: 'England',
    year: 1842,
    lines: [
      "Tho' much is taken, much abides; and tho'",
      'We are not now that strength which in old days',
      'Moved earth and heaven, that which we are, we are;',
      'One equal temper of heroic hearts,',
      'Made weak by time and fate, but strong in will',
      'To strive, to seek, to find, and not to yield.',
    ],
  },
  {
    id: 'light-brigade',
    title: 'The Charge of the Light Brigade',
    poet: 'Alfred, Lord Tennyson',
    origin: 'England',
    year: 1854,
    lines: [
      'Half a league, half a league,',
      'Half a league onward,',
      'All in the valley of Death',
      'Rode the six hundred.',
    ],
  },
  {
    id: 'if',
    title: 'If',
    poet: 'Rudyard Kipling',
    origin: 'England',
    year: 1910,
    lines: [
      'If you can keep your head when all about you',
      'Are losing theirs and blaming it on you,',
      'If you can trust yourself when all men doubt you,',
      'But make allowance for their doubting too;',
      'If you can wait and not be tired by waiting,',
      "Or being lied about, don't deal in lies,",
      "Or being hated, don't give way to hating,",
      "And yet don't look too good, nor talk too wise:",
    ],
  },
  {
    id: 'if-end',
    title: 'If',
    poet: 'Rudyard Kipling',
    origin: 'England',
    year: 1910,
    lines: [
      'If you can fill the unforgiving minute',
      "With sixty seconds' worth of distance run,",
      "Yours is the Earth and everything that's in it,",
      "And - which is more - you'll be a Man, my son!",
    ],
  },
  {
    id: 'invictus',
    title: 'Invictus',
    poet: 'William Ernest Henley',
    origin: 'England',
    year: 1875,
    full: true,
    lines: [
      'Out of the night that covers me,',
      'Black as the pit from pole to pole,',
      'I thank whatever gods may be',
      'For my unconquerable soul.',
      'In the fell clutch of circumstance',
      'I have not winced nor cried aloud.',
      'Under the bludgeonings of chance',
      'My head is bloody, but unbowed.',
      'Beyond this place of wrath and tears',
      'Looms but the Horror of the shade,',
      'And yet the menace of the years',
      'Finds and shall find me unafraid.',
      'It matters not how strait the gate,',
      'How charged with punishments the scroll,',
      'I am the master of my fate,',
      'I am the captain of my soul.',
    ],
  },
  {
    id: 'jabberwocky',
    title: 'Jabberwocky',
    poet: 'Lewis Carroll',
    origin: 'England',
    year: 1871,
    lines: [
      "'Twas brillig, and the slithy toves",
      'Did gyre and gimble in the wabe:',
      'All mimsy were the borogoves,',
      'And the mome raths outgrabe.',
    ],
  },
  {
    id: 'remember',
    title: 'Remember',
    poet: 'Christina Rossetti',
    origin: 'England',
    year: 1862,
    lines: [
      'Remember me when I am gone away,',
      'Gone far away into the silent land;',
      'When you can no more hold me by the hand,',
      'Nor I half turn to go yet turning stay.',
    ],
  },
  {
    id: 'how-do-i-love-thee',
    title: 'How Do I Love Thee?',
    poet: 'Elizabeth Barrett Browning',
    origin: 'England',
    year: 1850,
    lines: [
      'How do I love thee? Let me count the ways.',
      'I love thee to the depth and breadth and height',
      'My soul can reach, when feeling out of sight',
      'For the ends of being and ideal grace.',
    ],
  },
  {
    id: 'no-coward-soul',
    title: 'No Coward Soul Is Mine',
    poet: 'Emily Brontë',
    origin: 'England',
    year: 1846,
    lines: [
      'No coward soul is mine,',
      "No trembler in the world's storm-troubled sphere:",
      "I see Heaven's glories shine,",
      'And faith shines equal, arming me from fear.',
    ],
  },
  {
    id: 'elegy',
    title: 'Elegy Written in a Country Churchyard',
    poet: 'Thomas Gray',
    origin: 'England',
    year: 1751,
    lines: [
      'The curfew tolls the knell of parting day,',
      "The lowing herd wind slowly o'er the lea,",
      'The plowman homeward plods his weary way,',
      'And leaves the world to darkness and to me.',
    ],
  },
  {
    id: 'gather-ye-rosebuds',
    title: 'To the Virgins, to Make Much of Time',
    poet: 'Robert Herrick',
    origin: 'England',
    year: 1648,
    lines: [
      'Gather ye rosebuds while ye may,',
      'Old Time is still a-flying;',
      'And this same flower that smiles today',
      'Tomorrow will be dying.',
    ],
  },
  {
    id: 'passionate-shepherd',
    title: 'The Passionate Shepherd to His Love',
    poet: 'Christopher Marlowe',
    origin: 'England',
    year: 1599,
    lines: [
      'Come live with me and be my love,',
      'And we will all the pleasures prove,',
      'That valleys, groves, hills, and fields,',
      'Woods, or steepy mountain yields.',
    ],
  },
  {
    id: 'no-man-is-an-island',
    title: 'No Man Is an Island',
    poet: 'John Donne',
    origin: 'England',
    year: 1624,
    lines: [
      'No man is an island, entire of itself;',
      'every man is a piece of the continent, a part of the main.',
    ],
  },
  {
    id: 'red-red-rose',
    title: 'A Red, Red Rose',
    poet: 'Robert Burns',
    origin: 'Scotland',
    year: 1794,
    lines: [
      'O my Luve is like a red, red rose',
      "That's newly sprung in June;",
      'O my Luve is like the melody',
      "That's sweetly played in tune.",
    ],
  },
  {
    id: 'requiem',
    title: 'Requiem',
    poet: 'Robert Louis Stevenson',
    origin: 'Scotland',
    year: 1887,
    lines: [
      'Under the wide and starry sky,',
      'Dig the grave and let me lie.',
      'Glad did I live and gladly die,',
      'And I laid me down with a will.',
    ],
  },
  {
    id: 'innisfree',
    title: 'The Lake Isle of Innisfree',
    poet: 'W. B. Yeats',
    origin: 'Ireland',
    year: 1890,
    lines: [
      'I will arise and go now, and go to Innisfree,',
      'And a small cabin build there, of clay and wattles made;',
      'Nine bean-rows will I have there, a hive for the honey-bee,',
      'And live alone in the bee-loud glade.',
    ],
  },
  {
    id: 'when-you-are-old',
    title: 'When You Are Old',
    poet: 'W. B. Yeats',
    origin: 'Ireland',
    year: 1893,
    lines: [
      'When you are old and grey and full of sleep,',
      'And nodding by the fire, take down this book,',
      'And slowly read, and dream of the soft look',
      'Your eyes had once, and of their shadows deep;',
    ],
  },
  {
    id: 'hope',
    title: '"Hope" is the thing with feathers',
    poet: 'Emily Dickinson',
    origin: 'United States',
    year: 1861,
    full: true,
    lines: [
      '"Hope" is the thing with feathers -',
      'That perches in the soul -',
      'And sings the tune without the words -',
      'And never stops - at all -',
      'And sweetest - in the Gale - is heard -',
      'And sore must be the storm -',
      'That could abash the little Bird',
      'That kept so many warm -',
      "I've heard it in the chillest land -",
      'And on the strangest Sea -',
      'Yet - never - in Extremity,',
      'It asked a crumb - of me.',
    ],
  },
  {
    id: 'because-i-could-not-stop',
    title: 'Because I could not stop for Death',
    poet: 'Emily Dickinson',
    origin: 'United States',
    year: 1890,
    lines: [
      'Because I could not stop for Death -',
      'He kindly stopped for me -',
      'The Carriage held but just Ourselves -',
      'And Immortality.',
    ],
  },
  {
    id: 'o-captain',
    title: 'O Captain! My Captain!',
    poet: 'Walt Whitman',
    origin: 'United States',
    year: 1865,
    lines: [
      'O Captain! my Captain! our fearful trip is done,',
      "The ship has weather'd every rack, the prize we sought is won,",
      'The port is near, the bells I hear, the people all exulting,',
      'While follow eyes the steady keel, the vessel grim and daring;',
    ],
  },
  {
    id: 'song-of-myself',
    title: 'Song of Myself',
    poet: 'Walt Whitman',
    origin: 'United States',
    year: 1855,
    lines: [
      'I celebrate myself, and sing myself,',
      'And what I assume you shall assume,',
      'For every atom belonging to me as good belongs to you.',
    ],
  },
  {
    id: 'annabel-lee',
    title: 'Annabel Lee',
    poet: 'Edgar Allan Poe',
    origin: 'United States',
    year: 1849,
    lines: [
      'It was many and many a year ago,',
      'In a kingdom by the sea,',
      'That a maiden there lived whom you may know',
      'By the name of Annabel Lee;',
      'And this maiden she lived with no other thought',
      'Than to love and be loved by me.',
    ],
  },
  {
    id: 'the-raven',
    title: 'The Raven',
    poet: 'Edgar Allan Poe',
    origin: 'United States',
    year: 1845,
    lines: [
      'Once upon a midnight dreary, while I pondered, weak and weary,',
      'Over many a quaint and curious volume of forgotten lore -',
      'While I nodded, nearly napping, suddenly there came a tapping,',
      'As of some one gently rapping, rapping at my chamber door.',
    ],
  },
  {
    id: 'psalm-of-life',
    title: 'A Psalm of Life',
    poet: 'Henry Wadsworth Longfellow',
    origin: 'United States',
    year: 1838,
    lines: [
      'Tell me not, in mournful numbers,',
      'Life is but an empty dream!',
      'For the soul is dead that slumbers,',
      'And things are not what they seem.',
    ],
  },
  {
    id: 'road-not-taken',
    title: 'The Road Not Taken',
    poet: 'Robert Frost',
    origin: 'United States',
    year: 1916,
    full: true,
    lines: [
      'Two roads diverged in a yellow wood,',
      'And sorry I could not travel both',
      'And be one traveler, long I stood',
      'And looked down one as far as I could',
      'To where it bent in the undergrowth;',
      'Then took the other, as just as fair,',
      'And having perhaps the better claim,',
      'Because it was grassy and wanted wear;',
      'Though as for that the passing there',
      'Had worn them really about the same,',
      'And both that morning equally lay',
      'In leaves no step had trodden black.',
      'Oh, I kept the first for another day!',
      'Yet knowing how way leads on to way,',
      'I doubted if I should ever come back.',
      'I shall be telling this with a sigh',
      'Somewhere ages and ages hence:',
      'Two roads diverged in a wood, and I -',
      'I took the one less traveled by,',
      'And that has made all the difference.',
    ],
  },
  {
    id: 'stopping-by-woods',
    title: 'Stopping by Woods on a Snowy Evening',
    poet: 'Robert Frost',
    origin: 'United States',
    year: 1923,
    lines: [
      'The woods are lovely, dark and deep,',
      'But I have promises to keep,',
      'And miles to go before I sleep,',
      'And miles to go before I sleep.',
    ],
  },
  {
    id: 'flanders-fields',
    title: 'In Flanders Fields',
    poet: 'John McCrae',
    origin: 'Canada',
    year: 1915,
    lines: [
      'In Flanders fields the poppies blow',
      'Between the crosses, row on row,',
      'That mark our place; and in the sky',
      'The larks, still bravely singing, fly',
      'Scarce heard amid the guns below.',
    ],
  },

  // ---- India ----
  {
    id: 'gitanjali-35',
    title: 'Gitanjali 35',
    poet: 'Rabindranath Tagore',
    origin: 'India',
    year: 1912,
    full: true,
    lines: [
      'Where the mind is without fear and the head is held high;',
      'Where knowledge is free;',
      'Where the world has not been broken up into fragments by narrow domestic walls;',
      'Where words come out from the depth of truth;',
      'Where tireless striving stretches its arms towards perfection;',
      'Where the clear stream of reason has not lost its way into the dreary desert sand of dead habit;',
      'Where the mind is led forward by thee into ever-widening thought and action -',
      'Into that heaven of freedom, my Father, let my country awake.',
    ],
  },
  {
    id: 'gitanjali-1',
    title: 'Gitanjali 1',
    poet: 'Rabindranath Tagore',
    origin: 'India',
    year: 1912,
    lines: [
      'Thou hast made me endless, such is thy pleasure.',
      'This frail vessel thou emptiest again and again, and fillest it ever with fresh life.',
    ],
  },
  {
    id: 'kabir-moon',
    title: 'The moon shines in my body',
    poet: 'Kabir',
    origin: 'India',
    year: 1915,
    translator: 'Rabindranath Tagore',
    lines: [
      'The moon shines in my body, but my blind eyes cannot see it:',
      'The moon is within me, and so is the sun.',
      'The unstruck drum of Eternity is sounded within me; but my deaf ears cannot hear it.',
    ],
  },
  {
    id: 'bazaars-of-hyderabad',
    title: 'In the Bazaars of Hyderabad',
    poet: 'Sarojini Naidu',
    origin: 'India',
    year: 1912,
    lines: [
      'What do you sell, O ye merchants?',
      'Richly your wares are displayed.',
      'Turbans of crimson and silver,',
      'Tunics of purple brocade,',
      'Mirrors with panels of amber,',
      'Daggers with handles of jade.',
    ],
  },
  {
    id: 'ghalib-desires',
    title: 'A thousand desires',
    poet: 'Mirza Ghalib',
    origin: 'India',
    translator: 'Typeflow',
    lines: [
      'A thousand desires, each one worth dying for;',
      'many of them came true, and still they were too few.',
    ],
  },
  {
    id: 'salutation-to-the-dawn',
    title: 'Salutation to the Dawn',
    poet: 'Kalidasa',
    origin: 'India',
    lines: [
      'Look to this day, for it is life, the very life of life.',
      'In its brief course lie all the verities and realities of your existence.',
    ],
  },

  // ---- Persia ----
  {
    id: 'rubaiyat-book-of-verses',
    title: 'Rubaiyat',
    poet: 'Omar Khayyam',
    origin: 'Persia',
    year: 1859,
    translator: 'Edward FitzGerald',
    lines: [
      'A Book of Verses underneath the Bough,',
      'A Jug of Wine, a Loaf of Bread - and Thou',
      'Beside me singing in the Wilderness -',
      'Oh, Wilderness were Paradise enow!',
    ],
  },
  {
    id: 'rubaiyat-moving-finger',
    title: 'Rubaiyat',
    poet: 'Omar Khayyam',
    origin: 'Persia',
    year: 1859,
    translator: 'Edward FitzGerald',
    lines: [
      'The Moving Finger writes; and, having writ,',
      'Moves on: nor all your Piety nor Wit',
      'Shall lure it back to cancel half a Line,',
      'Nor all your Tears wash out a Word of it.',
    ],
  },

  // ---- China and Japan ----
  {
    id: 'quiet-night-thought',
    title: 'Quiet Night Thought',
    poet: 'Li Bai',
    origin: 'China',
    translator: 'Typeflow',
    lines: [
      'Before my bed, the bright moonlight;',
      'I take it for frost on the ground.',
      'I raise my head and watch the bright moon;',
      'I lower my head and think of home.',
    ],
  },
  {
    id: 'old-pond',
    title: 'The old pond',
    poet: 'Matsuo Basho',
    origin: 'Japan',
    year: 1686,
    translator: 'Typeflow',
    full: true,
    lines: ['An old pond;', 'a frog leaps in,', 'the sound of water.'],
  },

  // ---- Europe ----
  {
    id: 'inferno',
    title: 'Inferno, Canto I',
    poet: 'Dante Alighieri',
    origin: 'Italy',
    year: 1867,
    translator: 'Henry Wadsworth Longfellow',
    lines: [
      'Midway upon the journey of our life',
      'I found myself within a forest dark,',
      'For the straightforward pathway had been lost.',
    ],
  },
  {
    id: 'odyssey',
    title: 'The Odyssey, Book I',
    poet: 'Homer',
    origin: 'Greece',
    year: 1725,
    translator: 'Alexander Pope',
    lines: [
      "The man for wisdom's various arts renown'd,",
      'Long exercised in woes, O Muse! resound;',
      'Who, when his arms had wrought the destined fall',
      'Of sacred Troy, and razed her heaven-built wall,',
    ],
  },
  {
    id: 'wanderers-night-song',
    title: "Wanderer's Night Song",
    poet: 'Johann Wolfgang von Goethe',
    origin: 'Germany',
    year: 1845,
    translator: 'Henry Wadsworth Longfellow',
    full: true,
    lines: [
      "O'er all the hilltops",
      'Is quiet now,',
      'In all the treetops',
      'Hearest thou',
      'Hardly a breath;',
      'The birds are asleep in the trees:',
      'Wait, soon like these',
      'Thou too shalt rest.',
    ],
  },
]

/** Characters a US keyboard can type, which is all the engine can score. */
const TYPEABLE = /^[A-Za-z0-9 .,;:!?'"()-]+$/

for (const poem of POEMS) {
  for (const line of poem.lines) {
    if (!TYPEABLE.test(line)) throw new Error(`Untypeable character in "${poem.title}": ${line}`)
  }
}

export const poemById = new Map(POEMS.map((p) => [p.id, p]))

/** The stanza as one flow of tokens, the way the engine consumes it. */
export function poemTokens(poem: Poem): string[] {
  return tokenize(poem.lines.join(' '))
}

/** "The Tyger, William Blake (England, 1794)" with a translator note when there is one. */
export function poemCredit(poem: Poem): string {
  const where = [poem.origin, poem.year].filter(Boolean).join(', ')
  const tr = poem.translator ? `, tr. ${poem.translator}` : ''
  return `${poem.title} - ${poem.poet} (${where}${tr})`
}

export function pickPoem(rng: () => number, from: Poem[] = POEMS): Poem {
  return from[Math.floor(rng() * from.length)] ?? POEMS[0]!
}

/** Poems shuffled and joined until there are at least `minTokens` tokens - for timed runs. */
export function poemStream(rng: () => number, minTokens: number, from: Poem[] = POEMS): string[] {
  const out: string[] = []
  let order: Poem[] = []
  while (out.length < minTokens) {
    if (order.length === 0) order = shuffle(from, rng)
    out.push(...poemTokens(order.pop()!))
  }
  return out
}

function shuffle<T>(items: T[], rng: () => number): T[] {
  const a = items.slice()
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const ENGLISH = new Set(['England', 'Scotland', 'Ireland', 'United States', 'Canada'])
/** Poems written in English. */
export const ENGLISH_POEMS = POEMS.filter((p) => ENGLISH.has(p.origin))
/** Poems from everywhere else, read in translation (or Indian poets writing in English). */
export const WORLD_POEMS = POEMS.filter((p) => !ENGLISH.has(p.origin))
/** Complete poems, for the "whole poem" lesson. */
export const FULL_POEMS = POEMS.filter((p) => p.full)
