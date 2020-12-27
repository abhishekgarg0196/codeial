const kue = require('kue');

const queue = kue.createQueue();
// ./node_modules/kue/bin/kue-dashboard inside the project dir for visualizing the task
module.exports = queue;