var exports = module.exports || {};

var shell = require("shelljs"),
    path = require("path"),
    format = require("util").format,
    fs = require("fs"),
    mkdirp = require('mkdirp'),
    ncp = require("ncp").ncp;

var Backup_Demon = function(options) {
  var app_dir = options.app_dir,
      project_name = options.project_name,
      backup_dir_path = path.resolve(process.env.HOME,".nucleus/.nuc-meteor-watcher/",project_name);

  if (! app_dir || ! project_name)
    throw new Error("Invalid Arguments: Expected Object {app_dir: '/path/to/app/dir', project_name: 'NameOfProject'}");

  this.create_backup_dir = function() {
    mkdirp(backup_dir_path, function(err) {
      if (err)
        throw err;

      ncp(app_dir, backup_dir_path, {
        filter: '^\.[\S\s]*'
      });

      return;
    });
  };

  this.setup = function() {
    this.create_backup_dir();
  };

  this.clean_backup = function(file) {
    var filename = file.replace(app_dir, '');

    shell.cp('-Rf', file, backup_dir_path+filename);
    shell.cd(backup_dir_path);
  };

  this.revert_to_clean = function() {
    shell.cd(backup_dir_path);
    ncp(backup_dir_path, app_dir, {
      // filter: /^\.[a-zA-Z0-9]*/g
    }, function() {
      console.log("WORKING APP RESTORED");
    });
  };

  this.tell_nucleus_to_refresh_file = function(file) {
    fs.appendFile(format("%s/.nuc-files-to-refresh", app_dir), file+"\n", function(err) {
      if(err) throw err;
    });
  };

  this.revert_file = function(file) {
    var backup_file = file.replace(app_dir, backup_dir_path);
    shell.cp('-f', backup_file, file);
    this.tell_nucleus_to_refresh_file(file);
  };

  return this;
};

exports.Backup_Demon = Backup_Demon;
