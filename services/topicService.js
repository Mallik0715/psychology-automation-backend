const topics = [
  "Dark Psychology Tricks People Use On You",
  "Signs Someone Is Manipulating You",
  "How Your Brain Tricks You Every Day",
  "Psychology Of Attraction Explained",
  "Why You Procrastinate And How To Stop",
  "Mind Control Techniques You Dont Know",
  "How To Read Anyone Instantly",
  "Signs Of A Narcissist Around You",
  "Why Smart People Feel Lonely",
  "The Psychology Behind Lying",
  "How To Manipulate Your Own Mind",
  "Why People Stay In Toxic Relationships",
  "Secret Psychology Of Body Language",
  "How Advertisers Control Your Mind",
  "Psychology Tricks To Be More Confident",
  "Why You Always Feel Not Good Enough",
  "The Dark Side Of Social Media",
  "How To Spot A Fake Person Instantly",
  "Why Your Brain Loves Bad Habits",
  "Psychology Of Money And Happiness",
  "Signs You Are Emotionally Intelligent",
  "How To Make Anyone Like You",
  "Why People Become Obsessed With Others",
  "The Science Of First Impressions",
  "How Trauma Changes Your Personality",
  "Why Introverts Are Secretly Powerful",
  "Psychology Of Fear And How To Beat It",
  "Signs Someone Is Secretly Jealous Of You",
  "How To Stop Overthinking Forever",
  "The Psychology Of Revenge",
  "Why We Fall For The Wrong People",
  "How Your Childhood Affects You Now",
  "Signs Of High Intelligence You Ignore",
  "Psychology Behind Self Sabotage",
  "How To Win Any Argument Psychologically",
  "Why People Ghost Others Explained",
  "The Science Of Habits And Willpower",
  "How To Read Hidden Emotions",
  "Psychology Of Dreams And What They Mean",
  "Why Rejection Hurts Like Physical Pain",
];

function getRandomTopic() {
  const index = Math.floor(Math.random() * topics.length);
  return topics[index];
}

module.exports = { getRandomTopic };