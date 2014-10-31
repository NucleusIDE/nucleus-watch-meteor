var exports = module.exports || {};

var shell = require("shelljs"),
    path = require("path"),
    format = require("util").format,
    fs = require("fs");

if(! shell.which("git")) throw new Error("Git must be installed");

var Backup_Demon = function(options) {
  var app_dir = options.app_dir,
      project_name = options.project_name,
      backup_repo_path = path.resolve(process.env.HOME,".nucleus/.nuc-meteor-watcher/",project_name),
      backup_branch_name = "nuc-meteor-watcher";

  if (! app_dir || ! project_name)
    throw new Error("Invalid Arguments: Expected Object {app_dir: '/path/to/app/dir', project_name: 'NameOfProject'}");

  this.create_backup_repo = function() {
    if (fs.existsSync(backup_repo_path)) {
      shell.cd(backup_repo_path);
      var status = shell.exec(format("git pull")).code;
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
    this.create_backup_branch_in_app();
  };

  return this;
};

exports.Backup_Demon = Backup_Demon;
