// ==UserScript==
// @name         LinkedIn Timestamp Extractor
// @namespace    https://www.linkedin.com/
// @version      1.0.2
// @description  Shows timestamp for the current LinkedIn post, comment, or reply URL.
// @author       <https://github.com/Ollie-Boyd/Linkedin-post-timestamp-extractor> & GPT
// @license      GPL-3.0
// @match        https://www.linkedin.com/*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  function getPostId() {
    const linkedinURL = window.location.href;
    const regex = /([0-9]{19})/;
    const postId = regex.exec(linkedinURL)?.pop();
    return postId;
  }

  function getCommentId() {
    const linkedinURL = window.location.href;

    try {
      const url = new URL(linkedinURL);
      const commentUrn = url.searchParams.get("dashCommentUrn");

      if (!commentUrn) {
        return null;
      }

      const regex = /fsd_comment:\((\d+),urn:li:activity:\d+\)/;
      const match = regex.exec(commentUrn);

      if (match) {
        const commentId = match[1];
        return commentId;
      }
    } catch (error) {
      return null;
    }

    return null;
  }

  function getReplyId() {
    const linkedinURL = window.location.href;

    try {
      const url = new URL(linkedinURL);
      const replyUrn = url.searchParams.get("dashReplyUrn");

      if (!replyUrn) {
        return null;
      }

      const regex = /fsd_comment:\((\d+),urn:li:activity:\d+\)/;
      const match = regex.exec(replyUrn);

      if (match) {
        const replyId = match[1];
        return replyId;
      }
    } catch (error) {
      return null;
    }

    return null;
  }

  function extractUnixTimestamp(postId) {
    // BigInt needed as we need to treat postId as 64 bit decimal.
    if (postId == null) {
      return "";
    }

    return Number(BigInt(postId) >> 22n);
  }

  function unixTimestampToHumanDate(timestamp) {
    if (!timestamp) {
      return "";
    }

    const dateObject = new Date(timestamp);
    const humanDateFormat = dateObject.toUTCString() + " (UTC)";
    return humanDateFormat;
  }

  function unixTimestampToLocalDate(timestamp) {
    if (!timestamp) {
      return "";
    }

    const dateObject = new Date(timestamp);
    const humanDateFormat = ("" + dateObject).substring(0, 25);
    return humanDateFormat;
  }

  function getDate() {
    const postId = getPostId();
    const commentId = getCommentId();
    const replyId = getReplyId();

    let targetId = "";
    let targetType = "";

    if (replyId) {
      targetId = replyId;
      targetType = "Reply";
    } else if (commentId) {
      targetId = commentId;
      targetType = "Comment";
    } else if (postId) {
      targetId = postId;
      targetType = "Post";
    }

    const unixTimestamp = extractUnixTimestamp(targetId);
    const humanDateFormat = unixTimestampToHumanDate(unixTimestamp);
    const localDateFormat = unixTimestampToLocalDate(unixTimestamp);

    showTimestamp(targetType, targetId, humanDateFormat, localDateFormat);
  }

  function showTimestamp(targetType, targetId, humanDateFormat, localDateFormat) {
    let box = document.querySelector("#linkedin-timestamp-box");

    if (!box) {
      box = document.createElement("div");
      box.id = "linkedin-timestamp-box";

      box.style.position = "fixed";
      box.style.bottom = "60px";
      box.style.right = "20px";
      box.style.zIndex = "999999";
      box.style.background = "#ffffff";
      box.style.color = "#000000";
      box.style.border = "1px solid #ccc";
      box.style.borderRadius = "8px";
      box.style.padding = "12px";
      box.style.fontSize = "13px";
      box.style.fontFamily = "Arial, sans-serif";
      box.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
      box.style.maxWidth = "360px";
      box.style.lineHeight = "1.4";

      document.body.appendChild(box);
    }

    if (!targetId) {
      box.innerHTML = `
        <strong>LinkedIn Timestamp</strong><br>
        No post, comment, or reply ID found in this URL.
      `;
      return;
    }

    box.innerHTML = `
      <strong>LinkedIn Timestamp</strong><br>
      Type: ${targetType}<br>
      ID: ${targetId}<br>
      UTC: ${humanDateFormat}<br>
      Local: ${localDateFormat}
    `;
  }

  function clearUrlField() {
    // Kept from original script, but not needed in Tampermonkey mode.
  }

  function watchUrlChanges() {
    let lastUrl = location.href;

    const checkUrl = () => {
      if (location.href !== lastUrl) {
        lastUrl = location.href;
        getDate();
      }
    };

    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function () {
      originalPushState.apply(this, arguments);
      checkUrl();
    };

    history.replaceState = function () {
      originalReplaceState.apply(this, arguments);
      checkUrl();
    };

    window.addEventListener("popstate", checkUrl);

    setInterval(checkUrl, 1000);
  }

  if (typeof document !== "undefined" && document.body) {
    getDate();
    watchUrlChanges();
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = {
      getPostId,
      getCommentId,
      getReplyId,
      extractUnixTimestamp,
      unixTimestampToHumanDate,
      unixTimestampToLocalDate,
      getDate,
      clearUrlField,
      watchUrlChanges,
    };
  }
})();
