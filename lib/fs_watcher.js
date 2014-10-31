/**
 * Watch the meteor app directory for changes. We will then check if meteor app has crashed, if it does, we undo the change that crashed the app.
 */

var watch = require("watch");

var exports = module.exports || {};

var another_change_happened = false;
var watcher = {};

function file_change_action(dir, wait, cb) {
  setTimeout(function() {
    if (another_change_happened) {
      another_change_happened = false;
      file_change_action(dir, wait, cb);
      return;
    }
    cb();
  }, wait);
};

var start_watching = function(dir, wait, cb) {
  watch.createMonitor(dir, function(monitor) {
    console.log("Started Listening");
    monitor.on("changed", function() {
      another_change_happened = true;
      file_change_action(dir, wait, cb);
    });
    monitor.on("created", function() {
      another_change_happened = true;
      file_change_action(dir, wait, cb);
    });
    monitor.on("removed", function() {
      another_change_happened = true;
      file_change_action(dir, wait, cb);
    });
  });
};

exports.start_watching = start_watching;
