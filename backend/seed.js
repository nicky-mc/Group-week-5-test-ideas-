const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function createTables() {
  const subjects = ["general", "technology", "sports"];

  for (const subject of subjects) {
    const { data, error } = await supabase.from(subject).createTable({
      id: { type: "serial", primaryKey: true },
      content: { type: "text" },
      likes: { type: "integer", default: 0 },
    });

    if (error) {
      console.error(`Error creating table ${subject}:`, error);
    } else {
      console.log(`Table ${subject} created:`, data);
    }
  }
}

createTables();
