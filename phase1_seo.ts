import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function main() {
  console.log("=== Executing SEO Phase 1 ===");

  // 1. INTERNAL LINKING (Products to Blogs)
  console.log("\\n1. Updating Product Descriptions for Internal Linking...");
  const { data: products, error: prodErr } = await supabase.from('products').select('id, name, description');
  
  if (prodErr) {
    console.error("Error fetching products:", prodErr);
  } else if (products) {
    for (const prod of products) {
      let desc = prod.description || '';
      // Avoid duplicate appending
      if (desc.includes('Discover more in our Journal')) continue;

      let appendText = '\\n\\n**Discover more in our Journal:**\\n';
      const name = prod.name.toLowerCase();

      if (name.includes('wig') || name.includes('frontal')) {
        appendText += '- [Lace Closure vs Frontal: Which is Best for Your Custom Wig?](/journal/lace-closure-vs-frontal-which-is-best-for-your-custom-wig)\\n';
        appendText += '- [How to Melt Swiss Lace: Tips for a Flawless Wig Install](/journal/how-to-melt-swiss-lace-tips-for-a-flawless-wig-install)\\n';
      }
      
      if (name.includes('bundle') || name.includes('raw')) {
        appendText += '- [Raw Hair vs Virgin Hair: What is the Difference?](/journal/raw-hair-vs-virgin-hair-what-is-the-difference)\\n';
        appendText += '- [How to Care for Raw Hair Bundles: Wash & Maintenance Guide](/journal/how-to-care-for-raw-hair-bundles-wash-maintenance-guide)\\n';
      }

      if (appendText !== '\\n\\n**Discover more in our Journal:**\\n') {
        const { error: updateErr } = await supabase.from('products').update({ description: desc + appendText }).eq('id', prod.id);
        if (updateErr) console.error(`Error updating product ${prod.name}:`, updateErr);
        else console.log(`Linked blogs in product: ${prod.name}`);
      }
    }
  }

  // 2. IMAGE OPTIMIZATION (Adding generated images to top blogs)
  console.log("\\n2. Updating Blogs with High-Quality Images & Alt Text...");
  
  // We'll update the first 3 blogs we generated images for
  const updates = [
    {
      slug: 'the-truth-about-hair-extensions-what-single-donor-really-means',
      imageUrl: '/brand/single_donor_hair.jpg',
      altText: 'Luxurious dark raw human hair bundles reflecting natural light'
    },
    {
      slug: 'swiss-lace-vs-hd-lace-which-is-best-for-a-flawless-melt',
      imageUrl: '/brand/swiss_lace_frontal.jpg',
      altText: 'Macro photography of ultra-fine transparent Swiss lace frontal with microscopic single knots'
    },
    {
      slug: 'how-to-care-for-your-raw-hair-bundles-to-make-them-last-years',
      imageUrl: '/brand/washing_raw_hair.jpg',
      altText: 'Washing thick, silky dark raw human hair in a stone basin'
    }
  ];

  for (const update of updates) {
    const { data: article, error: fetchErr } = await supabase.from('journal_articles').select('id, content').eq('slug', update.slug).single();
    
    if (fetchErr || !article) {
      console.error(`Could not find article with slug ${update.slug}`);
      continue;
    }

    let content = article.content;
    
    // Inject the image right after the main H1 tag if it doesn't already have an image
    if (!content.includes('![Luxurious')) {
      const imgMarkdown = `\\n\\n![${update.altText}](${update.imageUrl})\\n\\n`;
      content = content.replace(/^(# .*?\\n)/m, `$1${imgMarkdown}`);
      
      const { error: updateErr } = await supabase.from('journal_articles').update({ 
        content: content,
        cover_image_url: update.imageUrl
      }).eq('id', article.id);

      if (updateErr) {
        console.error(`Error updating article ${update.slug}:`, updateErr);
      } else {
        console.log(`Added optimized image to blog: ${update.slug}`);
      }
    }
  }

  console.log("\\nPhase 1 Complete!");
}

main();
