// Inserts the "Quick Commands: Natural Language Actions" article into Supabase
// Usage: node scripts/add-quick-commands-article.js

import { createClient } from '@supabase/supabase-js';

// Reuse the same env/config pattern as other scripts in this repo
const supabaseUrl = 'https://iehzwglvmbtrlhdgofew.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllaHp3Z2x2bWJ0cmxoZGdvZmV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NzIxNDUsImV4cCI6MjA3MTE0ODE0NX0.WOa5cSZhiBbbIdzQJAqJG9hZZiWQNcMoUpXL3rRLQp8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const ARTICLE_TITLE = 'Quick Commands: Natural Language Actions';
const CATEGORY_SLUG = 'verofield-training';

const html = `
  <h2>Overview</h2>
  <p>Use natural language in the top command box to create records fast. VeroField parses your text, extracts entities (name, address, phone, email, date/time), and pre-fills forms for review before saving.</p>

  <h2>Available today</h2>
  <ul>
    <li><strong>Create Customer</strong>: Fully supported and production-ready</li>
  </ul>

  <h2>Planned/optional (if enabled in your build)</h2>
  <ul>
    <li><strong>Create Job</strong>: Basic parsing of service type, date, and time</li>
    <li><strong>Notes, Follow-ups, Search</strong>: Coming soon</li>
  </ul>

  <h2>How to format your commands</h2>
  <h3>1) Create Customer</h3>
  <p><strong>Action phrases recognized:</strong></p>
  <ul>
    <li>create new customer</li>
    <li>new customer</li>
    <li>create customer</li>
    <li>add customer</li>
  </ul>
  <p><strong>Name format:</strong> First Last (e.g., John Smith, Maria Lopez)</p>
  <p><strong>Address formats (either is fine):</strong></p>
  <ul>
    <li>Space-separated: 123 Mockingbird Ln Springfield PA 19123</li>
    <li>Comma-separated: 123 Mockingbird Ln, Springfield, PA, 19123</li>
  </ul>
  <p>Case-insensitive street suffixes supported: st, ave, rd, blvd, dr, ln, way, pl, street, avenue, road, boulevard, drive, lane, place, court, circle, terrace, trail, parkway, highway. City and state should precede ZIP.</p>
  <p><strong>Phone formats:</strong> 4125557788, 412-555-7788, 412.555.7788</p>
  <p><strong>Email format:</strong> name@example.com</p>

  <p><strong>Full example commands:</strong></p>
  <ul>
    <li>create new customer John Smith 123 Mockingbird Ln Springfield PA 19123 john.smith@example.com 4125557788</li>
    <li>create customer Maria Lopez 123 Mockingbird Ln, Springfield, PA, 19123, maria.lopez@example.com 412-555-7788</li>
    <li>add customer Chris Johnson 123 Mockingbird Ln Springfield PA 19123</li>
  </ul>

  <p><strong>Partial data examples:</strong></p>
  <ul>
    <li>new customer Jane Doe janedoe@example.com</li>
    <li>create customer Mike Shaw 412.555.8888</li>
  </ul>

  <h4>Parsing behavior for Create Customer</h4>
  <ul>
    <li><strong>Name</strong>: First and last word pair near the action phrase</li>
    <li><strong>Address</strong>: Space or comma format supported; lowercase inputs accepted</li>
    <li><strong>City</strong>: Extracted correctly in both formats</li>
    <li><strong>State</strong>: Normalized to uppercase (e.g., pa → PA)</li>
    <li><strong>ZIP</strong>: 5-digit or ZIP+4</li>
    <li><strong>Phone/Email</strong>: Extracted if present</li>
  </ul>

  <h3>2) Create Job (optional/if enabled)</h3>
  <p><strong>Action phrases recognized:</strong> create job for, new job for</p>
  <p><strong>Recommended fields:</strong> Customer name, service type, date (today/tomorrow/YYYY-MM-DD), time (2pm/14:00)</p>
  <p><strong>Examples:</strong></p>
  <ul>
    <li>create job for John Smith tomorrow 2pm inspection</li>
    <li>new job for Maria Lopez 2025-02-10 9am quarterly service</li>
  </ul>

  <h2>Tips for better accuracy</h2>
  <ul>
    <li>Keep the address in order: street number, street name, city, state, zip</li>
    <li>Either commas or spaces work</li>
    <li>Include phone and email when available</li>
    <li>For jobs, include a clear date and time</li>
  </ul>

  <h2>Troubleshooting</h2>
  <ul>
    <li><strong>City is blank</strong>: Ensure both city and state appear before ZIP
      <ul>
        <li>Space: 123 Mockingbird Ln Springfield PA 19123</li>
        <li>Commas: 123 Mockingbird Ln, Springfield, PA, 19123</li>
      </ul>
    </li>
    <li><strong>Nothing is detected</strong>: Start with an action phrase like "create new customer"</li>
    <li><strong>Wrong capitalization</strong>: The system normalizes names and addresses</li>
    <li><strong>Still not right?</strong>: The pre-filled form allows quick edits before saving</li>
  </ul>

  <h2>Keyboard shortcuts</h2>
  <ul>
    <li>Ctrl + Shift + N: Create New Customer</li>
    <li>Ctrl + N: Create New Job</li>
    <li>Ctrl + F: Focus search</li>
    <li>?: Show all keyboard shortcuts</li>
  </ul>

  <h2>Data privacy and safety</h2>
  <ul>
    <li>Review pre-filled data before saving</li>
    <li>Actions are tenant-scoped and require authorization</li>
  </ul>

  <h2>Ready-to-use snippets</h2>
  <ul>
    <li>create new customer John Smith 123 Mockingbird Ln Springfield PA 19123 john.smith@example.com 4125557788</li>
    <li>create customer Maria Lopez 123 Mockingbird Ln, Springfield, PA, 19123, maria.lopez@example.com 412-555-7788</li>
    <li>add customer Chris Johnson 123 Mockingbird Ln Springfield PA 19123</li>
    <li>new customer Jane Doe janedoe@example.com 412.555.7788</li>
  </ul>
`;

async function run() {
  console.log('🔎 Looking up category by slug:', CATEGORY_SLUG);
  const { data: category, error: catErr } = await supabase
    .from('knowledge_categories')
    .select('id, name')
    .eq('slug', CATEGORY_SLUG)
    .single();
  if (catErr) throw catErr;
  if (!category) throw new Error('Category not found');

  console.log('🧹 Removing existing article with same title if present...');
  await supabase.from('knowledge_articles').delete().eq('title', ARTICLE_TITLE);

  console.log('✍️ Inserting article...');
  const today = new Date().toISOString().slice(0, 10);
  const { data: inserted, error: insErr } = await supabase
    .from('knowledge_articles')
    .insert([{ 
      category_id: category.id,
      title: ARTICLE_TITLE,
      author: 'VeroField Team',
      publish_date: today,
      last_updated: today,
      read_time: '7 min',
      difficulty: 'beginner',
      rating: 4.8,
      views: 0,
      tags: ['commands','nlp','productivity'],
      content: html,
      featured: true
    }])
    .select('*')
    .single();
  if (insErr) throw insErr;

  console.log('✅ Article inserted:', inserted.id, inserted.title);
}

run().catch((e) => {
  console.error('❌ Failed to insert article:', e);
  process.exit(1);
});




