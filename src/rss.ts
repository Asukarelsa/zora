import dotenv from 'dotenv';
import OpenAI from 'openai';
import Parser, { Item } from 'rss-parser';

// Load environment variables from .env file
dotenv.config({ path: './config.env' });

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define the structure for our meme coin output
interface MemeCoinOutput {
  ticker: string;
  coin_name: string;
  description: string; // Add description field
  website: string;     // Add website field (link to source news)
  image_description?: string;
  image_url?: string;
  source_title: string;
  // source_link is now mapped to website, maybe remove source_link?
  // Keeping source_link for now for clarity, can remove later.
  source_link?: string;
}

// --- Configuration ---
// Easily add or remove RSS feed URLs here
const feedUrls: Record<string, string> = {
  // Example feeds (replace/add your own)
  cryptoNews: 'https://cointelegraph.com/rss',
  techCrunch: 'https://techcrunch.com/feed/',
  // Add more feeds as needed
};

// --- Meme Generation Logic (Using OpenAI) ---

const MEME_MODEL = 'gpt-3.5-turbo'; // Or 'gpt-4', etc.

/**
 * Generates a short, funny, viral ticker using OpenAI.
 */
async function generateTicker(title: string): Promise<string> {
  const prompt = `Given the news headline "${title}", invent a short (4-6 uppercase letters max), funny, highly viral crypto meme coin ticker. Examples: DOGE, PEPE, SHIB, WIF, TRMP. Respond with ONLY the ticker.`;

  try {
    const completion = await openai.chat.completions.create({
      model: MEME_MODEL,
      messages: [
        { role: "system", content: "You are a helpful assistant skilled in creating viral crypto meme coin ideas." },
        { role: "user", content: prompt }
      ],
      max_tokens: 10,
      temperature: 0.8, // Increase creativity slightly
      n: 1,
    });

    let ticker = completion.choices[0]?.message?.content?.trim().toUpperCase().replace(/[^A-Z]/g, '') || 'MEME';

    // Ensure length constraint
    if (ticker.length > 6) {
        ticker = ticker.substring(0, 6);
    }
    if (!ticker) ticker = 'MEME'; // Fallback

    return ticker;

  } catch (error) {
    console.error("Error calling OpenAI for ticker:", error instanceof Error ? error.message : error);
    // Fallback to simple logic on error
    const words = title.split(' ');
    const firstWord = words[0]?.replace(/[^a-zA-Z]/g, '') || 'MEME';
    return firstWord.substring(0, 4).toUpperCase();
  }
}

/**
 * Generates a catchy, meme-worthy coin name using OpenAI.
 */
async function generateCoinName(title: string, ticker: string): Promise<string> {
  // Using the ticker helps the AI connect the name and ticker
  const prompt = `Given the news headline "${title}" and the meme coin ticker "${ticker}", invent a catchy, meme-worthy coin name (1-3 words, e.g., PepeMoon, DogeWifHat, TurboTrump). Respond with ONLY the coin name.`;

  try {
    const completion = await openai.chat.completions.create({
      model: MEME_MODEL,
      messages: [
        { role: "system", content: "You are a helpful assistant skilled in creating viral crypto meme coin names." },
        { role: "user", content: prompt }
      ],
      max_tokens: 15, // Allow slightly longer names
      temperature: 0.8,
      n: 1,
    });

    let coinName = completion.choices[0]?.message?.content?.trim() || 'Meme Coin';

    // Basic cleanup (e.g., remove quotes if AI includes them)
    coinName = coinName.replace(/^"|"$/g, '');

    if (!coinName) coinName = 'Meme Coin'; // Fallback

    return coinName;

  } catch (error) {
    console.error("Error calling OpenAI for coin name:", error instanceof Error ? error.message : error);
    // Fallback to simple logic on error
    const words = title.split(' ').map(w => w.replace(/[^a-zA-Z]/g, ''));
    const firstWord = words[0] ? words[0][0]?.toUpperCase() + words[0].slice(1).toLowerCase() : 'Meme';
    const secondWord = words[1] ? words[1][0]?.toUpperCase() + words[1].slice(1).toLowerCase() : 'Coin';
    return `${firstWord}${secondWord}`;
  }
}

/**
 * Generates a description for AI image generation using OpenAI.
 */
async function generateImageDescription(title: string, coinName: string, ticker: string): Promise<string> {
  const prompt = `Create a concise (1-2 sentences) DALL-E or Stable Diffusion prompt for a funny, viral meme image representing the crypto meme coin "${coinName}" (${ticker}). The meme should be inspired by the news headline: "${title}". Focus on visual elements and a slightly absurd, eye-catching, internet meme style. Examples: 'A confused Shiba Inu dog wearing a tiny hard hat looks at a fluctuating crypto chart, ticker DOGE visible.', 'Elon Musk riding a Dogecoin rocket towards the moon, text says TO THE MOON!'.`;

  try {
    const completion = await openai.chat.completions.create({
      model: MEME_MODEL,
      messages: [
        { role: "system", content: "You are a helpful assistant skilled at writing creative and effective AI image generation prompts for memes." },
        { role: "user", content: prompt }
      ],
      max_tokens: 60, // Allow for slightly longer descriptions
      temperature: 0.7,
      n: 1,
    });

    let description = completion.choices[0]?.message?.content?.trim() || `A funny meme about ${coinName}.`;

    // Basic cleanup
    description = description.replace(/^"|"$/g, '');
    if (!description) description = `A funny meme about ${coinName}.`; // Fallback

    return description;

  } catch (error) {
    console.error("Error calling OpenAI for image description:", error instanceof Error ? error.message : error);
    // Fallback to simple logic on error
    return `Create a funny meme image representing ${coinName} (${ticker}), inspired by the news: "${title.substring(0, 50)}...". Make it look viral and slightly absurd.`;
  }
}

/**
 * Generates a short, funny coin description using OpenAI.
 */
async function generateCoinDescription(title: string, coinName: string, ticker: string): Promise<string> {
  const prompt = `Create a short (1-3 sentences), funny, highly viral meme coin description suitable for pump.fun. The coin is called "${coinName}" (${ticker}) and is inspired by the news headline: "${title}". Make it punchy and meme-worthy. Examples: 'Based on the latest news, ${ticker} is going parabolic! Don't miss out!', 'They called ${coinName} crazy, but look who's laughing now. To the moon!', 'Is ${ticker} the next big thing? Probably not, but it's funny. Get in loser.'`;

  try {
    const completion = await openai.chat.completions.create({
      model: MEME_MODEL,
      messages: [
        { role: "system", content: "You are a helpful assistant skilled at writing viral, funny meme coin descriptions for platforms like pump.fun." },
        { role: "user", content: prompt }
      ],
      max_tokens: 80, // Allow for a decent description length
      temperature: 0.8,
      n: 1,
    });

    let description = completion.choices[0]?.message?.content?.trim() || `This is ${coinName} (${ticker}). Based on news: ${title.substring(0, 30)}... To the moon?`;

    description = description.replace(/^"|"$/g, '');
    if (!description) description = `This is ${coinName} (${ticker}). Based on news.`; // Fallback

    return description;

  } catch (error) {
    console.error("Error calling OpenAI for coin description:", error instanceof Error ? error.message : error);
    // Fallback to simple logic on error
    return `Funny meme coin ${coinName} (${ticker}) inspired by news: "${title.substring(0, 50)}...".`;
  }
}

// --- Utility Functions ---

// Simple delay function
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// --- RSS Feed Processing ---

// Define a type that might include media:content and other common fields
type ItemWithMedia = Item & {
  'media:content'?: {
      '$': { url: string; type?: string; medium?: string };
  };
  image?: { // Add optional image field based on common usage
    url: string;
    link?: string;
    title?: string;
  };
  // Add other potential fields if needed
};

async function processFeeds() {
  // Initialize parser without problematic generic defaults
  const parser = new Parser<object, ItemWithMedia>(); // Use 'object' for custom feed fields if none
  const allMemeCoins: MemeCoinOutput[] = [];
  const ITEM_DELAY_MS = 60000; // 60 seconds

  console.log(`Fetching and processing feeds (with ${ITEM_DELAY_MS / 1000}s delay between items)...`);

  for (const [feedName, url] of Object.entries(feedUrls)) {
    console.log(`\\n--- Processing Feed: ${feedName} (${url}) ---`);
    try {
      const feed = await parser.parseURL(url);

      if (!feed.items) {
        console.log(`No items found in feed: ${feedName}`);
        continue;
      }

      for (const item of feed.items) {
        const title = item.title?.trim();
        if (!title) continue;

        console.log(`\\nProcessing item: "${title}"`); // Log item start

        const ticker = await generateTicker(title);
        const coinName = await generateCoinName(title, ticker);
        const coinDescription = await generateCoinDescription(title, coinName, ticker);

        const imageUrl = item.enclosure?.url ||
                         item['media:content']?.['$']?.url ||
                         item.image?.url;

        const memeCoin: MemeCoinOutput = {
          ticker,
          coin_name: coinName,
          description: coinDescription,
          website: item.link || '',
          source_title: title,
          source_link: item.link,
        };

        if (imageUrl && /\.(jpg|jpeg|png|gif|webp)$/i.test(imageUrl)) {
          memeCoin.image_url = imageUrl;
          console.log(`  Generated [${ticker}] ${coinName} (using existing image)`);
        } else {
          memeCoin.image_description = await generateImageDescription(title, coinName, ticker);
          console.log(`  Generated [${ticker}] ${coinName} (needs image generation)`);
        }

        allMemeCoins.push(memeCoin);
        console.log(JSON.stringify(memeCoin, null, 2));
        console.log('---');

        // *** Add delay after processing each item ***
        console.log(`Waiting for ${ITEM_DELAY_MS / 1000} seconds...`);
        await delay(ITEM_DELAY_MS);
      }
    } catch (error) {
      console.error(`Error processing feed ${feedName} (${url}):`, error instanceof Error ? error.message : error);
    }
  }

  console.log('\\n--- Processing Complete ---');
}

// Run the feed processing
processFeeds().catch(err => {
  console.error("An unexpected error occurred:", err);
  process.exit(1);
});
