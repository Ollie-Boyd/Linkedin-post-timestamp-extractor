function getPostId() {
  const linkedinURL= document.querySelector("#url").value;
  const regex = /([0-9]{19})/;
  const postId = regex.exec(linkedinURL)?.pop();
  return postId;
}

function getCommentId() {
  const linkedinURL = decodeURIComponent(document.querySelector("#url").value);
  const regex = /fsd_comment:\((\d+),urn:li:activity:\d+\)/;
  const match = regex.exec(linkedinURL);
  
  if (match) {
    const commentId = match[1]; // The captured group
    return commentId;
  }

  return null; // or handle the case when no match found
}

function extractUnixTimestamp(postId) {
  // BigInt needed as we need to treat postId as 64 bit decimal. This reduces browser support.
  if(postId == null) {
    return "";
  }
  const asBinary = BigInt(postId).toString(2);
  const first41Chars = asBinary.slice(0, 41);
  const timestamp = parseInt(first41Chars, 2);
  return timestamp;
}

function unixTimestampToHumanDate(timestamp) {
  const dateObject = new Date(timestamp);
  const humanDateFormat = dateObject.toUTCString() + " (UTC)";
  return humanDateFormat;
}

function unixTimestampToLocalDate(timestamp) {
  const dateObject = new Date(timestamp);
  const humanDateFormat = (""+dateObject).substring(0,25);
  return humanDateFormat;
}

function getDate() {
  const postId = getPostId();
  const commentId = getCommentId();
  console.log(commentId);
  
  let unixTimestamp = "";
  
  if (commentId) {
    unixTimestamp = extractUnixTimestamp(commentId);
  }
  else {
    unixTimestamp = extractUnixTimestamp(postId);
  }
  
  const humanDateFormat = unixTimestampToHumanDate(unixTimestamp);
  document.querySelector("#date").textContent = humanDateFormat;
  
  const localDateFormat = unixTimestampToLocalDate(unixTimestamp);
  document.querySelector("#localtime").textContent = localDateFormat;
}

function clearUrlField() { 
  document.querySelector("#url").value = "";
  document.querySelector("#url").focus();
}
