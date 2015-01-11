var exports = module.exports || {};

var shell = require("shelljs"),
    path = require("path"),
    format = require("util").format,
    fs = require("fs"),
    ncp = require("ncp").ncp;

if(! shell.which("git")) throw new Error("Git must be installed");

var Backup_Demon = function(options) {
  var app_dir = options.app_dir,
      project_name = options.project_name,
      backup_repo_path = path.resolve(process.env.HOME,".nucleus/.nucleus-meteor-watcher/",project_name),
      backup_branch_name = "nucleus-meteor-watcher";

  if (! app_dir || ! project_name)
    throw new Error("Invalid Arguments: Expected Object {app_dir: '/path/to/app/dir', project_name: 'NameOfProject'}");

  this.create_backup_repo = function() {
    if (fs.existsSync(backup_repo_path)) {
      /**
       * let's not pull changes from git. we clone the repo once, and then copy changes, pulling changes make uncommitted changes get wasted
       */
      // shell.cd(backup_repo_path);
      // var status = shell.exec(format("git pull")).code;
      return;
    }
    if (shell.exec(format("git clone %s %s", app_dir, backup_repo_path)).code !== 0) {
      throw new Error("Git Failed: Failed to create backup repo");
    };
  };

  this.create_backup_branch_in_app = function() {
    shell.cd(app_dir);
    if (RegExp(backup_branch_name).test(shell.exec("git branch").output)) {
      //don't try to create branch again if it already exists
      return;
    }
    var status = shell.exec(format("git branch %s", backup_branch_name)).code;
    if (status !== 0) {
      throw new Error("Git Failed: Failed to create backup branch in app.");
    }
  };

  this.setup = function() {
    this.create_backup_repo();
    // this.create_backup_branch_in_app();
  };

  this.clean_commit = function(file) {
    var filename = file.replace(app_dir, '');

    shell.cp('-Rf', file, backup_repo_path+filename);
    shell.cd(backup_repo_path);
    shell.exec('git commit -m "Change"');
  };

  this.revert_to_clean = function() {
    shell.cd(backup_repo_path);
    // shell.exec("git reset --hard HEAD~1");
    ncp(backup_repo_path, app_dir, {
      // filter: /^\.[a-zA-Z0-9]*/g
    }, function() {
      console.log("WORKING APP RESTORED");
    });
  };

  this.tell_nucleus_to_refresh_file = function(file) {
    fs.appendFile(format("%s/.nucleus-files-to-refresh", app_dir), file+"\n", function(err) {
      if(err) throw err;
    });
  };

  this.revert_file = function(file) {
    var backup_file = file.replace(app_dir, backup_repo_path);
    shell.cp('-f', backup_file, file);
    this.tell_nucleus_to_refresh_file(file);
  };

  return this;
};

exports.Backup_Demon = Backup_Demon;
