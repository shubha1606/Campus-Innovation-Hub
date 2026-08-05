const bcrypt = require('bcryptjs');
require('dotenv').config();
const connectDB = require('../config/db');
const User = require('../models/User');

async function main() {
  const password = process.env.ADMIN_PASSWORD || process.argv[2];
  const email = (process.env.ADMIN_EMAIL || 'admin@example.com').toLowerCase();
  const name = process.env.ADMIN_NAME || 'Admin';

  if (!password) {
    console.error('Provide admin password via ADMIN_PASSWORD env var or as first arg.');
    process.exit(1);
  }

  await connectDB();

  const existing = await User.findOne({ email });
  if (existing) {
    existing.password = password; // `pre('save')` will hash
    existing.role = 'admin';
    existing.name = name;
    await existing.save();
    console.log('Updated existing admin user:', email);
  } else {
    const user = new User({ name, email, password, role: 'admin' });
    await user.save();
    console.log('Created admin user:', email);
  }

  console.log('Done. Do NOT share the password publicly.');
  process.exit(0);
}

main().catch((err) => {
  console.error('Error creating admin:', err.message || err);
  process.exit(1);
});
