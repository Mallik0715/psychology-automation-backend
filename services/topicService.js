// Topics are used in order; services/topic_progress.json stores the next index
// (committed back to the repo by the GitHub Actions workflow).
const topics = [

  /* ================= DEEP SPACE & COSMIC WONDERS (25) ================= */
  "Why NASA Is Scared of the 'Boötes Void' — The Empty Space Mystery",
  "What Really Happens When a Magnetar Explodes in Our Galaxy",
  "The Mystery of Dark Matter: The Invisible 85% of the Universe",
  "Why Neptune Has 1,200 MPH Winds Even Though It's Freezing",
  "What Is the James Webb Telescope Seeing at the Edge of Time?",
  "The Terrifying Reality of Rogue Black Holes Wandering Space",
  "Why Jupiter's Moon Europa Might Have Alien Life in Its Ocean",
  "What Would Happen If Earth Collided With a Neutron Star",
  "The Mystery of the Wow! Signal Received From Space in 1977",
  "Why Uranus Spins on Its Side — The Ancient Cosmic Collision",
  "The Great Attractor: The Mysterious Force Pulling Our Galaxy",
  "What Is Hawking Radiation and Can Black Holes Evaporate?",
  "Why NASA Wants to Mine This Asteroid Worth $10 Quintillion",
  "What Would a Dyson Sphere Look Like If Aliens Built One?",
  "The Mystery of Oumuamua: The First Interstellar Object",
  "Why Space Travel Aged This Astronaut Faster Than His Twin",
  "The Pillars of Creation: Stars Being Born 6,500 Light Years Away",
  "What Happens When a Supernova Goes Off Near Earth?",
  "Why NASA's Voyager 1 Is Still Transmitting Data After 47 Years",
  "The Mystery of Dark Energy: Why the Universe Is Accelerating",
  "What It Would Feel Like to Walk on Pluto's Ice Mountains",
  "Why the Cosmic Microwave Background Is the Oldest Light",
  "The Fermi Paradox: If Aliens Exist, Where Is Everybody?",
  "What Happens to Space-Time Inside a Wormhole?",
  "Why the Universe Might Be a Giant Hologram",

  /* ================= LOST CIVILIZATIONS & HIDDEN HISTORY (25) ================= */
  "The Secret Tunnels Hidden Beneath the Vatican Vaults",
  "Göbekli Tepe: The Temple That Rewrote Human Prehistory",
  "What Archaeologists Found Inside the Tomb of Emperor Qin",
  "The Unsolved Mystery of the Indus Valley Script",
  "Why the Mayans Abandoned Their Mega-Cities in the Jungle",
  "The Secret Underground City of Derinkuyu in Turkey",
  "What Really Happened to the Lost Army of Cambyses",
  "The Mysterious Nazca Lines: Carvings Only Visible From the Sky",
  "Why the Roman Colosseum Was Flooded for Naval Battles",
  "The Lost Gold of El Dorado: Myth vs Historical Reality",
  "What Archaeologists Discovered Beneath the Sphinx's Paws",
  "The Mystery of the Moai Statues on Easter Island",
  "Why the Sumerians Had Advanced Astronomy 5,000 Years Ago",
  "The Unsolved Secret of the Iron Pillar of Delhi That Never RUSTS",
  "What Was Really Inside the Ark of the Covenant?",
  "Why the Khmer Empire Collapsed at Angkor Wat",
  "The Mysterious Plain of Jars in Laos Science Can't Explain",
  "What Roman Soldiers Found in the Deserts of North Africa",
  "The Secret Tunnels Underneath the Pyramids of Teotihuacan",
  "Why the Olmec Giant Stone Heads Surprised Archaeologists",
  "The Ancient Underground Cisterns of Constantinople",
  "What Really Happened During the Tunguska Event in 1908",
  "The Lost Sea Civilization: Who Were the mysterious Sea Peoples?",
  "Why Medieval Castles Had Secret Escape Passages",
  "The Unsolved Secret of the Terracotta Army",

  /* ================= EXTREME EARTH & OCEAN MYSTERIES (25) ================= */
  "The Door to Hell: The Crater That Has Been Burning for 50 Years",
  "What Really Exists at Point Nemo: The Loneliest Place on Earth",
  "The Boiling River of Mayantuyacu: Nature's Lethal Cauldron",
  "Why 99% of Deep Sea Species Have Never Been Seen by Humans",
  "The Lake That Turns Animals to Stone: Lake Natron Secrets",
  "What Would Happen If Yellowstone Supervolcano Erupted Today",
  "The Giant Eye of the Sahara Structure Visible From Space",
  "Why the Danakil Depression Is the Most Inhospitable Place on Earth",
  "The Mystery of Moving Sailing Stones in Death Valley",
  "What Scientists Discovered Under the Ice of Lake Vostok",
  "The Terrifying Rogue Waves That Swallow Ships Whole",
  "Why Earth's Magnetic Poles Are Slipping Faster Today",
  "The Undersea Waterfall Illusion in Mauritius Explained",
  "What Happens to Bodies at the Bottom of the Great Blue Hole",
  "The Mysterious Sound Called 'The Bloop' Heard Across the Pacific",
  "Why Antarctica Has Blood-Red Waterfalls Flowing From Ice",
  "The Giant Cave in Vietnam With Its Own Rainforest and Clouds",
  "What Would Happen If Earth Stopped Spinning for 1 Second",
  "The Mystery of Eternal Lightning at Catatumbo River",
  "Why the Dead Sea Is So Salty Nothing Can Live In It",
  "The Sinkholes of Xianrendong: Earth's Giant Natural Wells",
  "What Happens When Underwater Sinkholes Collapse",
  "The Terrifying Speed of Pyroclastic Volcanic Flows",
  "Why Earth Is the Only Planet Known With Fire",
  "The Mystery of Underwater Crop Circles Created by Pufferfish",

  /* ================= FUTURE TECH, AI & PHYSICS FRONTIERS (25) ================= */
  "Why Quantum Teleportation Has Already Been Achieved in Labs",
  "How AI Neural Networks Make Decisions Engineers Can't Explain",
  "What Will Happen When the First True Artificial General Intelligence Awakens?",
  "Why Graphene Is 200 Times Stronger Than Steel",
  "The Dark Web's Secret Tor Network Architecture",
  "How Brain-Computer Interfaces (Neuralink) Read Thoughts",
  "Why Superconductors Could Floating Trains a Daily Reality",
  "What Happens During a Global Cyberattack on Power Grids",
  "How Synthetic Biology Is Engineering Custom DNA Code",
  "Why Lithium-Air Batteries Could Power Electric Planes",
  "The Science of Holographic Data Storage in Crystals",
  "How Quantum Sensors Can See Through Solid Walls",
  "Why Photonic Computing Uses Light Instead of Electricity",
  "What Happens When Microchips Reach the 1-Nanometer Limit?",
  "How Swarm Robotics Will Change Warfare and Construction",
  "The Future of Space Elevators: Cable to Orbit",
  "Why Metamaterials Can Render Objects Invisible to Radar",
  "How Autonomous AI Swarms Coordinate Without Central Servers",
  "What Happens When Nuclear Fusion Energy Becomes Commercial",
  "The Science of Cryonics: Can Human Bodies Be Frozen and Revived?",
  "Why Bionic Eyes Can Now Restore Sight to the Blind",
  "How Deep Learning Decoded 3D Protein Structures",
  "What Happens When Quantum Computers Break Modern Encryption?",
  "The Science of Atmospheric Water Generators in Deserts",
  "Why Solid-State Batteries Will Replace Current Batteries",

  /* ======================================================================
     BATCH 2 (added Oct 2026) — 100 new topics, same niche. Used after the
     first 100 above. Avoids stories already covered by the mystery channel.
     ====================================================================== */

  /* ================= MORE SPACE & COSMIC WONDERS (25) ================= */
  "Why a Day on Venus Is Longer Than Its Entire Year",
  "There Are More Trees on Earth Than Stars in Our Galaxy",
  "Why Astronauts Say Space Smells Like Seared Steak",
  "What Happens to a Human Body in Space Without a Suit",
  "Why Saturn Would Float If You Had a Big Enough Bathtub",
  "Why Sunsets on Mars Are Blue",
  "Olympus Mons: The Volcano 2.5 Times Taller Than Everest",
  "Why the Moon Is Slowly Drifting Away From Earth",
  "Why Astronauts Grow Taller in Space",
  "Is There Really a Planet Made of Diamond?",
  "The Planet Where It Rains Glass Sideways",
  "What Would Happen If You Fell Into a Black Hole",
  "Jupiter's Great Red Spot: A Storm Bigger Than Earth",
  "Why a Teaspoon of Neutron Star Weighs a Billion Tons",
  "Titan: The Moon With Lakes of Liquid Methane",
  "Why Saturn's Moon Enceladus Shoots Water Into Space",
  "What's on the Golden Record Voyager Carried for Aliens",
  "Why the Footprints on the Moon Will Last Millions of Years",
  "Why the Space Station Sees 16 Sunrises Every Day",
  "Kessler Syndrome: Could Space Junk Trap Us on Earth?",
  "Will the Andromeda Galaxy Really Crash Into the Milky Way?",
  "Why Mercury Isn't the Hottest Planet Even Though It's Closest",
  "Why Astronauts Can't Cry Properly in Space",
  "How the Universe Is 93 Billion Light-Years Wide but Only 13.8 Billion Years Old",
  "Why Earth Sometimes Captures a Temporary Second Moon",

  /* ================= MORE LOST CIVILIZATIONS & HIDDEN HISTORY (25) ================= */
  "Why the Egyptians Wet the Sand to Move Giant Pyramid Stones",
  "Why Roman Concrete Gets Stronger Over Time — Modern Concrete Doesn't",
  "Cleopatra Lived Closer to the Moon Landing Than to the Pyramids",
  "Greek Fire: The Ancient Weapon Nobody Can Recreate",
  "Damascus Steel: The Legendary Metal Whose Recipe Was Lost",
  "The Library of Alexandria: What Was Really Lost",
  "How Machu Picchu Was Built Without Mortar — and Survives Earthquakes",
  "Petra: The Ancient City Carved Straight Into the Rock",
  "What Pompeii's Ash Preserved for 2,000 Years",
  "The Vikings Reached America 500 Years Before Columbus",
  "Why Ancient Romans Used Urine as Mouthwash",
  "Mohenjo-daro: The 4,500-Year-Old City With Advanced Plumbing",
  "Why Some Medieval Cathedrals Took 600 Years to Build",
  "The Great Wall of China Is NOT Visible From Space",
  "Cahokia: The Lost American City Once Bigger Than London",
  "Great Zimbabwe: The Stone City Built Without Mortar",
  "Quipu: How the Inca Ran an Empire With Knotted Strings",
  "Catalhoyuk: The 9,000-Year-Old City With No Streets",
  "Why the Leaning Tower of Pisa Still Hasn't Fallen",
  "How AI Read Scrolls Burned by Vesuvius 2,000 Years Ago",
  "Why Europeans Once Ate Ground-Up Mummies as Medicine",
  "The First Labor Strike in History Happened in Ancient Egypt",
  "The Lost Ninth Legion: Rome's Vanishing Army",
  "The Hanging Gardens of Babylon: Did They Ever Exist?",
  "How Folding Steel Made the Japanese Katana Legendary",

  /* ================= MORE EXTREME EARTH & OCEAN WONDERS (25) ================= */
  "The Mariana Trench Is Deeper Than Everest Is Tall",
  "Why Most of the Ocean Floor Is Still Unmapped",
  "Why Earth's Core Is as Hot as the Surface of the Sun",
  "The Kola Superdeep Borehole: The Deepest Hole Humans Ever Dug",
  "Lightning Strikes Earth Around 100 Times Every Second",
  "Why Antarctica Is Actually the World's Largest Desert",
  "The Immortal Jellyfish That Can Reverse Its Own Aging",
  "Greenland Sharks Can Live for 400 Years",
  "Why the Amazon Rainforest Depends on Dust From the Sahara",
  "The Fungus That Turns Ants Into Zombies",
  "Why Tardigrades Can Survive the Vacuum of Space",
  "The Largest Living Thing on Earth Is a Giant Fungus",
  "Why Octopuses Have Three Hearts and Blue Blood",
  "Ball Lightning: The Glowing Orbs Scientists Still Can't Explain",
  "Brine Pools: The Deadly Underwater Lakes at the Bottom of the Sea",
  "Why Coral Reefs Glow Under Blue Light",
  "Why Mount Everest Is Still Growing Taller",
  "Why Iceland Is Slowly Splitting in Two",
  "The Day the Dinosaurs Died: What the Asteroid Really Did",
  "Snowball Earth: When the Entire Planet Froze Over",
  "The Next Supercontinent: What Earth Will Look Like in 250 Million Years",
  "Sharks Are Older Than Trees",
  "The Frog That Freezes Solid and Comes Back to Life",
  "Why Whale Songs Can Travel Across Entire Oceans",
  "Why the Pacific Ring of Fire Has Most of the World's Volcanoes",

  /* ================= MORE FUTURE TECH & SCIENCE BREAKTHROUGHS (25) ================= */
  "How CRISPR Edits DNA Like a Word Processor",
  "Why Lab-Grown Diamonds Are Identical to Mined Ones",
  "Did Scientists Really Bring Back the Dire Wolf?",
  "How a Paralyzed Man Walked Again Using a Brain Implant",
  "Self-Healing Concrete: The Bacteria That Repair Cracks",
  "Mirror Life: Why Scientists Are Warning Against Creating It",
  "How Lasers Cool Atoms to Colder Than Outer Space",
  "Why the Large Hadron Collider Didn't Destroy the World",
  "Why GPS Would Fail Without Einstein's Relativity",
  "Your Phone Is Millions of Times More Powerful Than Apollo's Computers",
  "The Day Nuclear Fusion Produced More Energy Than It Used",
  "Why Humanoid Robots Are Suddenly Everywhere",
  "How AI Can Now Recreate Images From Brain Scans",
  "Why Starlink Satellites Are Changing the Night Sky",
  "How Reusable Rockets Made Space Launches Far Cheaper",
  "Perovskite: The Material That Could Beat Silicon Solar Panels",
  "How Scientists Grow Mini Brains in a Lab",
  "Electronic Skin: How Robots Are Learning to Feel Touch",
  "Why Deepfakes Are Getting Almost Impossible to Spot",
  "How Machines Pull Carbon Dioxide Straight Out of the Air",
  "How Doctors Put a Pig Kidney Into a Living Human",
  "Time Crystals: The Strange New Phase of Matter",
  "Atomic Clocks So Accurate They'd Lose 1 Second in Billions of Years",
  "The Blackest Material Ever Made Absorbs 99.99% of Light",
  "Quantum Entanglement: The 'Spooky' Science That Won a Nobel Prize",

];

const longTopics = [
  "25 Dark Psychology Facts About Human Nature",
  "30 Unbelievable Facts About How Your Brain Works",
  "25 Mind-Blowing Psychology Facts About Attraction and Relationships",
  "30 Shocking Psychological Facts About Dreams and Sleep",
  "25 Uncomfortable Psychology Facts Nobody Tells You",
  "30 Secrets of Body Language & How to Read Anyone Instantly",
  "25 Mind Control and Manipulation Tricks People Use Every Day",
  "30 Science-Backed Facts About Memory, Intelligence and Focus",
  "25 Psychological Facts About Stress, Anxiety and Emotion",
  "30 Surprising Facts About Human Behavior and Decision Making",
  "25 Facts About Why People Lie, Cheat and Deceive",
  "30 Psychological Facts About Introverts vs Extroverts",
  "25 Mind-Blowing Facts About Subconscious Mind and Habits",
  "30 Facts About How Your Childhood Shapes Your Adult Life",
  "25 Dark Psychology Tactics Used by Advertisers to Control You",
  "30 Mind-Blowing Facts About Dopamine and Brain Addiction",
  "25 Psychological Reasons Why You Feel Lonely and Misunderstood",
  "30 Facts About Love, Heartbreak and Attachment Styles",
  "25 Unbelievable Facts About Pain, Fear and Survival Instincts",
  "30 Mind-Blowing Psychology Facts About Happiness and Gratitude",
  "25 Shocking Facts About What Happens to Your Brain When You Sleep",
  "30 Facts About High-IQ People and How Their Minds Work",
  "25 Dark Psychology Secrets of Narcissists and Manipulators",
  "30 Psychological Facts About Eye Contact and First Impressions",
  "25 Surprising Facts About Social Media and Brain Chemistry"
];

const fs = require("fs");
const path = require("path");

const PROGRESS_FILE = path.join(__dirname, "topic_progress.json");
const LONG_PROGRESS_FILE = path.join(__dirname, "topic_long_progress.json");

function loadIndex(file) {
  try {
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    return typeof data.index === "number" ? data.index : 0;
  } catch (err) {
    return 0;
  }
}

function saveIndex(file, index) {
  fs.writeFileSync(file, JSON.stringify({ index }), "utf8");
}

function getNextTopic() {
  let index = loadIndex(PROGRESS_FILE);
  if (index >= topics.length) index = 0;
  const topic = topics[index];
  saveIndex(PROGRESS_FILE, index + 1);
  return topic;
}

function getNextLongTopic() {
  let index = loadIndex(LONG_PROGRESS_FILE);
  if (index >= longTopics.length) index = 0;
  const topic = longTopics[index];
  saveIndex(LONG_PROGRESS_FILE, index + 1);
  return topic;
}

module.exports = { getNextTopic, getNextLongTopic, topics, longTopics };
// // }

// // module.exports = { getRandomTopic };
