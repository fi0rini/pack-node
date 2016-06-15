'use strict';
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const verifyOptions = require('../util/verifyOptions');
const exec = require('child_process').exec;
const EventEmitter = require('events');

function assign (name, value) {
  Object.defineProperty(this, name, { get: function () { return value; }, configurable: false, enumerable: false });
}

/**
 * ModPack takes an object of options.
 * @param {Object} options options to pass to the class as the constructor.
 * Option definitions:
 * @param {String} name name of the lambda function
 * @param {String} root the root of the project to compile and send to the cloud
 * @param {Array} buckets an array of bucket names to create on the S3
 */
function PackNode (options) {
  if (!(this instanceof PackNode)) return new PackNode(options);

  verifyOptions(options, { name: 'String', root: 'String' });

  assign.call(this, '_name', options.name);
  assign.call(this, '_root', options.root);
  assign.call(this, '_absolute', path.resolve(process.cwd(), this._root));

  this.archiver = archiver('zip');
  this.archiver
    .on('error', function (error) { throw error; })
    .on('finish', function () { this.archiver = archiver('zip'); }.bind(this));
}

PackNode.prototype = Object.create(EventEmitter.prototype);
PackNode.prototype.constructor = PackNode;

/**
 * package the node module and all
 * the package.json dependencies if they exist.
 * @return {PackNode} this the instance
 */
PackNode.prototype.install = function () {
  try {
    if (fs.statSync(this._absolute).isDirectory()) ;
    else throw new Error('Entry file: ' + this._absolute + ' does not exist');
  } catch (e) {
    throw e;
  }

  exec('cd ' + this._root + ' && npm install', function (err, stdio, stderr) {
    if (err) this.emit('error', err);
    else this.emit('install', this._root);
  }.bind(this));

  return this;
};

/**
 * zip the lambda function to get
 * it ready to send to AWS.
 * @param  {String} outname the file name to output
 * @return {PackNode}  this the instance
 */
PackNode.prototype.zip = function (outname) {
  this.archiver
    .pipe(fs.createWriteStream(path.resolve(process.cwd(), this._name)))
    .on('finish', this.emit.bind(this, 'zipped', this._root))
    .on('error', this.emit.bind(this, 'error'));

  this.archiver
    .directory(this._absolute, this._root.split('/').pop())
    .finalize();

  return this;
};

module.exports = PackNode;
