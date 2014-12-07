// define String.format
if (!String.format) {
  String.format = function(format) {
    var args = Array.prototype.slice.call(arguments, 1);
    return format.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number] 
        : match
      ;
    });
  };
}

// String Format for github branch URL
// 0: User
// 1: Repo
// 2: Branch
var githubBranchString = "<a href='https://github.com/{0}/{1}/tree/{2}'>{3}</a>";

// get branch info from URL
var currentUrl = window.location.href;
currentUrl = currentUrl.replace("https://github.com/", "");
var urlTokens = currentUrl.split("/");
var prBaseUser = urlTokens[0];
var prBaseRepo = urlTokens[1];
var prFromUser = "";
var prFromBranch = "";

// find branch meta data on page
var prmeta = document.getElementsByClassName("gh-header-meta");

if (prmeta && prmeta.length != 0) {

  // if we find a user value in meta data, this PR is from a fork
  var isFromFork = prmeta[0].getElementsByClassName("css-truncate-target user");

  if (isFromFork && isFromFork.length != 0) {
    // fork user will be the second element
    prFromUser = isFromFork[1].innerHTML;

    // fork branch will be the 5th element with this class (NOTE: this is not a great solution)
    var metaParts = prmeta[0].getElementsByClassName("css-truncate-target");
    prFromBranch = metaParts[4].innerHTML;

    // construct URL to PR branch
    // NOTE: assumes that fork repo has same name as base repo
    var forkLink = String.format(githubBranchString, prFromUser, prBaseRepo, prFromBranch, prFromBranch);

    // convert from branch text to link
    metaParts[4].innerHTML = forkLink;
  }
  // else // currently out of scope

}
