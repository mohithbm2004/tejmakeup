import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('No MONGODB_URI found in env');
    process.exit(1);
  }
  await mongoose.connect(uri);
  console.log('Connected to MongoDB');
  const SiteSettings = mongoose.model('SiteSettings', new mongoose.Schema({}, { strict: false }));
  const result = await SiteSettings.updateMany({}, {
    $set: {
      phone: '+91 91132 32920',
      whatsapp: '+919113232920',
      instagram: 'https://www.instagram.com/tej_makeupartist?stkn=MXUxcXE1cXZua2F6Yw%3D%3D&utm_source=qr'
    }
  });
  console.log('Update result:', result);
  const updated = await SiteSettings.find({});
  console.log('Updated records count:', updated.length);
  if (updated[0]) {
    console.log('Record phone:', updated[0].get('phone'));
    console.log('Record whatsapp:', updated[0].get('whatsapp'));
    console.log('Record instagram:', updated[0].get('instagram'));
  }
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
