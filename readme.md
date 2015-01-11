# What?
Custom module for Nucleus. It watches a directory and a url and revert back changes done in the directory when url crashes. Directory must be containing meteor app which is running on url.

# Why?
When building Nucleus, one of the problems we are facing is that when user make some change in the app code which result in app crash, there is no way for user to undo/correct that change from within nucleus. This npm module is supposed to run as a separate process along with meteor which will watch the file system, detect when the app crashes, and revert back the changes till the app is back up again.

# Is it useful for me?
I don't think so. I am not publishing this over `npm` for this very reason. I don't think anyone other than Nucleus would have some use for it.

# How to use?

## Install
```sh
npm install -g https://github.com/nucleuside/nucleus-watch-meteor
```
## Usage

`nuc-watch-meteor [options]`

Options:  

-h, --help       output usage information  
-V, --version    output the version number  
-d, --dir &lt;dir>  Directory to watch changes in  
-u, --url &lt;url>  Url where meteor app is running  
-w, --wait &lt;n>   Wait time in milliseconds  

- `-d`
  Directory which has meteor app's source code.
- `-u`
  Url at which the app is running
- `-w`
  Time in milliseconds to wait between changes. When one change in app's code is detected, it waits for XXX milliseconds for next change to occur; if another change occurs in XXX milliseconds, it postpone crash detection till it gets a clean XXX time interval.

