import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const artifactsDir = 'C:\\Users\\pc\\.gemini\\antigravity\\brain\\4a1db753-41d4-4452-82f3-243193e66d79';

async function main() {
  const files = fs.readdirSync(artifactsDir).filter(f => f.startsWith('Blog_') && f.endsWith('.md'));
  
  for (const file of files) {
    const filePath = path.join(artifactsDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Parse the file content
    const lines = content.split('\n');
    let title = '';
    let seoTitle = '';
    let metaDescription = '';
    let focusKeywords = '';
    
    let contentStartIdx = 0;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.startsWith('# ')) {
        title = line.replace('# ', '').trim();
      } else if (line.startsWith('**SEO Title:**')) {
        seoTitle = line.replace('**SEO Title:**', '').trim();
      } else if (line.startsWith('**Meta Description:**')) {
        metaDescription = line.replace('**Meta Description:**', '').trim();
      } else if (line.startsWith('**Focus Keywords:**')) {
        focusKeywords = line.replace('**Focus Keywords:**', '').trim();
      } else if (line.startsWith('---')) {
        contentStartIdx = i + 1;
        break;
      }
    }
    
    // Everything after the `---` is the actual content
    let actualContent = lines.slice(contentStartIdx).join('\n').trim();
    // Re-add the title as the h1
    actualContent = `# ${title}\n\n` + actualContent;
    
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const excerpt = metaDescription.substring(0, 255);
    
    console.log(`Inserting: ${title}`);
    
    const { error } = await supabase.from('journal_articles').upsert({
      title,
      slug,
      excerpt,
      content: actualContent,
      category: 'Journal',
      author: 'Tanelia Editorial',
      status: 'published',
      seo_title: seoTitle,
      seo_description: metaDescription,
      focus_keyword: focusKeywords,
      published_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, { onConflict: 'slug' });
    
    if (error) {
      console.error(`Error inserting ${title}:`, error);
    } else {
      console.log(`Success: ${title}`);
    }
  }
  
  console.log("All blogs processed!");
}

main();
