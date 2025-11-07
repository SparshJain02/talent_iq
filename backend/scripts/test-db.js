import { connectDb } from '../src/lib/db.js';
import { User } from '../src/models/User.js';

async function main(){
  try{
    await connectDb();
    const u = await User.create({
      name: 'Test User',
      email: `test-${Date.now()}@example.com`,
      profilePhoto: '',
      clerkId: `test-clerk-${Date.now()}`
    });
    console.log('Created user:', u);
    process.exit(0);
  }catch(err){
    console.error('test-db error', err);
    process.exit(1);
  }
}

main();
