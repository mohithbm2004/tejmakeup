import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { User } from '../models/index.js';
import { connectDB } from '../config/db.js';

await connectDB();

const email = (process.env.ADMIN_EMAIL || 'admin@tejmakeup.com').toLowerCase();
const password = process.env.ADMIN_PASSWORD || 'adminpassword123';

await User.updateOne(
  { email },
  { email, password: await bcrypt.hash(password, 12) },
  { upsert: true }
);

console.log('Admin ready:', email);
process.exit(0);
