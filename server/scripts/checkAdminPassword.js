import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

async function check() {
  await mongoose.connect(process.env.MONGODB_URI);
  const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
  const user = await User.findOne({ email: 'admin@tejmakeup.com' });
  if (!user) {
    console.log('User admin@tejmakeup.com NOT FOUND');
    return;
  }
  const hash = user.get('password');
  console.log('Stored user ID:', user._id);
  console.log('Stored hash starts with:', hash ? hash.substring(0, 15) : 'EMPTY');

  const candidates = [
    'adminpassword123',
    'admin123',
    'admin',
    'password',
    'Tej@123',
    'admin@123',
    'adminpassword',
    'adminpassword123!'
  ];

  let found = false;
  for (const c of candidates) {
    const match = await bcrypt.compare(c, hash);
    if (match) {
      console.log(`>>> MATCH FOUND: Password is '${c}' <<<`);
      found = true;
      break;
    }
  }

  if (!found) {
    console.log('None of standard candidate passwords matched.');
  }

  await mongoose.disconnect();
}

check().catch(console.error);
