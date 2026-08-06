import { defineDb, defineTable, column } from 'astro:db';

const Stats = defineTable({
  columns: {
    id: column.text({ primaryKey: true }), // E.g., 'global_stats'
    visitors: column.number({ default: 0 }),
    uploads: column.number({ default: 0 }),
    success_crops: column.number({ default: 0 }),
  }
});

export default defineDb({
  tables: { Stats },
});
