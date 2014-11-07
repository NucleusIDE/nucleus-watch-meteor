/**
 * Watch the meteor app directory for changes. We will then check if meteor app has crashed, if it does, we undo the change that crashed the app.
 */

var watch = require("watch");

var exports = module.exports || {};

var Watcher = function(dir, wait) {
  var another_change_happened = false;

  function file_change_action(file, cb) {
    setTimeout(function() {
      if (another_change_happened) {
        another_change_happened = false;
        file_change_action(file, cb);
        return;
      }
      cb(file);
    }, wait);
  };

  this.monitor_options = {
    'ignoreDotFiles': true,
    'ignoreUnreadableDir': true
  };

  this.start_watching = function(cb) {
    watch.createMonitor(dir, this.monitor_options, function(monitor) {
      console.log("Started Watching", dir);

      monitor.on("changed", function(file) {
        another_change_happened = true;
        file_change_action(file, cb);
      });

      monitor.on("created", function(file) {
        another_change_happened = true;
        file_change_action(file, cb);
      });

      monitor.on("removed", function(file) {
        another_change_happened = true;
        file_change_action(file, cb);
      });
    });
  };
};



exports.Watcher = Watcher;
