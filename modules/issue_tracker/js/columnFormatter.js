!function(e){function t(a){if(r[a])return r[a].exports;var c=r[a]={exports:{},id:a,loaded:!1};return e[a].call(c.exports,c,c.exports,t),c.loaded=!0,c.exports}var r={};return t.m=e,t.c=r,t.p="",t(0)}([function(e,t){"use strict";function r(e,t,r,a){var c={};if(a.forEach(function(e,t){c[e]=r[t]},this),"Title"===e){var n=[];return n.push(React.createElement("a",{href:loris.BaseURL+"/issue_tracker/edit/?issueID="+c["Issue ID"]+"&backURL=/issue_tracker/"},c.Title)),React.createElement("td",null,n)}if("Issue ID"===e){var s=[];return s.push(React.createElement("a",{href:loris.BaseURL+"/issue_tracker/edit/?issueID="+c["Issue ID"]+"&backURL=/issue_tracker/"},t)),React.createElement("td",null,s)}if("Priority"===e)switch(t){case"normal":return React.createElement("td",{style:{background:"#CCFFCC"}},"Normal");case"high":return React.createElement("td",{style:{background:"#EEEEAA"}},"High");case"urgent":return React.createElement("td",{style:{background:"#CC6600"}},"Urgent");case"immediate":return React.createElement("td",{style:{background:"#E4A09E"}},"Immediate");case"low":return React.createElement("td",{style:{background:"#99CCFF"}},"Low");default:return React.createElement("td",null,"None")}return React.createElement("td",null,t)}Object.defineProperty(t,"__esModule",{value:!0}),window.formatColumn=r,t.default=r}]);
//# sourceMappingURL=columnFormatter.js.map