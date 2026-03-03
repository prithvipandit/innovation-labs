try {
  console.log('Node version:', process.version);
  const ajv = require('ajv');
  console.log('ajv version:', ajv.version || 'unknown');
  console.log('ajv path:', require.resolve('ajv'));
  
  try {
    const codegen = require('ajv/dist/compile/codegen');
    console.log('ajv/dist/compile/codegen loaded successfully');
  } catch (e) {
    console.error('Failed to load ajv/dist/compile/codegen:', e.message);
    try {
        console.log('Trying direct path to index.js...');
        const codegenIndex = require('ajv/dist/compile/codegen/index.js');
        console.log('ajv/dist/compile/codegen/index.js loaded successfully');
    } catch (e2) {
        console.error('Failed to load ajv/dist/compile/codegen/index.js:', e2.message);
    }
  }
} catch (e) {
  console.error('Failed to load ajv:', e.message);
}
