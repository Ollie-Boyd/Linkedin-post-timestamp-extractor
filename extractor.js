function getPostId() {
  const linkedinURL= document.querySelector("#url").value;
  const regex = /([0-9]{19})/;
  const postId = regex.exec(linkedinURL).pop();
  return postId;
}

function extractUnixTimestamp(postId) {
  // BigInt needed as we need to treat postId as 64 bit decimal. This reduces browser support.
  const asBinary = BigInt(postId).toString(2);
  const first41Chars = asBinary.slice(0, 41);
  const timestamp = parseInt(first41Chars, 2);
  return timestamp;
}

function unixTimestampToHumanDate(timestamp) {
  const dateObject = new Date(timestamp);
  const humanDateFormat = dateObject.toUTCString()+" (UTC)";
  return humanDateFormat;
}

function getDate() {
  const postId = getPostId();
  const unixTimestamp = extractUnixTimestamp(postId);
  const humanDateFormat = unixTimestampToHumanDate(unixTimestamp);
  document.querySelector("#date").textContent = humanDateFormat;
}
