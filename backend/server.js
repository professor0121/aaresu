import app from './src/app.js';
import { ENV } from './src/config/env.js';
import { connectDB } from './src/config/connectDB.js'; // Typo here: 'connetDB' should be 'connectDB'

connectDB().then(() => {
  app.listen(ENV.PORT, () => {
    console.log(`✅ Server started on port ${ENV.PORT}`);
  });
});
