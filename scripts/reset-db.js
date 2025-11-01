#!/usr/bin/env node

// Script to reset the database by dropping all tables
import postgres from 'postgres';
import { config } from 'dotenv';

// Load environment variables
config();

async function resetDatabase() {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL not set in environment variables');
    process.exit(1);
  }

  console.log('🗑️  Resetting database...');
  console.log('📍 Database URL:', databaseUrl.replace(/:[^:@]*@/, ':****@'));

  let client;
  
  try {
    client = postgres(databaseUrl, {
      max: 1,
      connect_timeout: 10,
      idle_timeout: 5,
      prepare: false,
      ssl: 'require'
    });

    console.log('⏳ Dropping existing tables...');
    
    // Drop tables in correct order (considering foreign key constraints)
    await client`DROP TABLE IF EXISTS family_members CASCADE`;
    await client`DROP TABLE IF EXISTS doctors CASCADE`;
    await client`DROP TABLE IF EXISTS patients CASCADE`;
    await client`DROP TABLE IF EXISTS users CASCADE`;
    
    console.log('✅ All tables dropped successfully!');
    console.log('🎉 Database reset complete. You can now run "npm run db:push" to create the new schema.');
    
  } catch (error) {
    console.error('❌ Database reset failed:');
    console.error('Error details:', error.message);
    process.exit(1);
  } finally {
    if (client) {
      await client.end();
      console.log('🔌 Database connection closed.');
    }
  }
}

// Run the reset
resetDatabase().catch(console.error);