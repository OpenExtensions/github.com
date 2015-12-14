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

// Extension 1: PR Navigation
// On a PR from a fork, make the fork description a hyperlink to the fork repo
(function(){
  // String Format for github branch URL
  // 0: Owner
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
  
  var main = function() {
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
  }
  main();
})();


// Extension 2: Blame History
// On the Blame page, add a hyperlink to each blame section to blame from parent
// script credit: https://greasyfork.org/en/scripts/10694-github-blame-previous-commit-button/code 
(function(){
  var createElement = function(html) {
    var e = document.createElement('div');
    e.innerHTML = html;
    return e.firstChild;
  };
  
  var blameUrlPattern = /^(https:\/\/github.com\/[^\/]+\/[^\/]+\/blame\/)([^\/]+)(.*)$/;
  
  var main = function() {
    var m = blameUrlPattern.exec(document.location.href);
    if (!m)
        return;
  
    Array.prototype.forEach.call(document.querySelectorAll('.blame-commit-info'), function(e) { 
      var url = e.firstElementChild.href;
      var sha = url.substr(url.lastIndexOf('/') + 1);
      var blameUrlForCurrentFile = m[1] + sha + encodeURI('^') + m[3];
      var html = '<a class="blame-sha blame-previous-commit" href="' + blameUrlForCurrentFile + '">parent</a>';
      var a = createElement(html);
      e.lastElementChild.insertBefore(a, e.lastElementChild.firstChild);
    });
  };
  main();
  // do not want a jquery dependency, this does not appear to be necessary on github 'blame' pages
  // $(document).on('pjax:end', main);
})();