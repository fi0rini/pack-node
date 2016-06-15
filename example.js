const PackNode = require('./lib/pack-node');

// Example of how to use
const pack = new PackNode({
  name: 'MyLambda Functions Name.zip',
  root: 'test/lambda-module'
});

pack.install();
pack.on('install', function (root) {
  console.log(root + ' node_modules were installed the module is ready for zipping.');
});

pack.zip();
pack.on('zipped', function (root) {
  console.log(root + ' module has been zipped and sent to ' + process.cwd() + 'MyLambda Functions Name.zip');
});
