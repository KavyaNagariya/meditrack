#!/usr/bin/env node

// Simple database connection test script
import postgres from 'postgres';
import { config } from 'dotenv';

// Load environment variables
config();

async function testDatabaseConnection() {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL not set in environment variables');
    process.exit(1);
  }

  console.log('🔍 Testing database connection...');
  console.log('📍 Database URL:', databaseUrl.replace(/:[^:@]*@/, ':****@')); // Hide password

  let client;
  
  try {
    // Create client with timeout settings
    client = postgres(databaseUrl, {
      max: 1,
      connect_timeout: 10,
      idle_timeout: 5,
      prepare: false,
      ssl: 'require'
    });

    // Test basic connection
    console.log('⏳ Attempting to connect...');
    const result = await client`SELECT 1 as test, NOW() as current_time`;
    
    console.log('✅ Database connection successful!');
    console.log('📊 Test result:', result[0]);
    
    // Test users table
    console.log('⏳ Testing users table...');
    const userCount = await client`SELECT COUNT(*) as count FROM users`;
    console.log('👥 Users in database:', userCount[0].count);
    
    console.log('🎉 All database tests passed!');
    
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error('Error details:', error.message);
    
    if (error.message.includes('timeout')) {
      console.log('💡 Suggestion: The database might be sleeping or overloaded. Try again in a few moments.');
    } else if (error.message.includes('authentication')) {
      console.log('💡 Suggestion: Check your database credentials in the .env file.');
    } else if (error.message.includes('does not exist')) {
      console.log('💡 Suggestion: The database or table might not exist. Run migrations first.');
    }
    
    process.exit(1);
  } finally {
    if (client) {
      await client.end();
      console.log('🔌 Database connection closed.');
    }
  }
}

// Run the test
testDatabaseConnection().catch(console.error);