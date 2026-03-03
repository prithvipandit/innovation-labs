try {
  const path = require('path');
  const ajvPath = path.resolve('./node_modules/ajv-keywords/dist/keywords/index.js');
  console.log('Checking path:', ajvPath);
  const keywords = require(ajvPath);
  console.log('ajv-keywords dist loaded');
} catch (e) {
  console.error(e);
}
