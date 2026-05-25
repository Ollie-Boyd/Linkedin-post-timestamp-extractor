const { describe, expect, test } = require("bun:test");
const lite = require("../extractor.tampermonkey.js");

process.env.TZ = "America/Toronto";

const exampleComment =
  "https://www.linkedin.com/feed/update/urn:li:activity:7206271470342131712?commentUrn=urn%3Ali%3Acomment%3A%28activity%3A7206271470342131712%2C7243992047441870850%29&dashCommentUrn=urn%3Ali%3Afsd_comment%3A%287243992047441870850%2Curn%3Ali%3Aactivity%3A7206271470342131712%29";

const exampleReply =
  "https://www.linkedin.com/feed/update/urn:li:activity:7463198490211385344/?dashCommentUrn=urn%3Ali%3Afsd_comment%3A%287463206760292478976%2Curn%3Ali%3Aactivity%3A7463198490211385344%29&dashReplyUrn=urn%3Ali%3Afsd_comment%3A%287463221103482585088%2Curn%3Ali%3Aactivity%3A7463198490211385344%29";

function setUrl(url) {
  const parsedUrl = new URL(url);

  globalThis.window = {
    location: {
      href: url,
      search: parsedUrl.search,
    },
  };
}

describe("extractor.tampermonkey.js", () => {
  test("matches test.py fixture", () => {
    setUrl(exampleComment);

    // Local time
    const t1 = lite.unixTimestampToLocalDate(
      lite.extractUnixTimestamp(lite.getCommentId()),
    );
    expect(t1).toBe("Mon Sep 23 2024 10:38:10 ");

    const t2 = lite.unixTimestampToLocalDate(
      lite.extractUnixTimestamp(lite.getPostId()),
    );
    expect(t2).toBe("Tue Jun 11 2024 08:30:04 ");

    // UTC
    const t3 = lite.unixTimestampToHumanDate(
      lite.extractUnixTimestamp(lite.getCommentId()),
    );
    expect(t3).toBe("Mon, 23 Sep 2024 14:38:10 GMT (UTC)");

    const t4 = lite.unixTimestampToHumanDate(
      lite.extractUnixTimestamp(lite.getPostId()),
    );
    expect(t4).toBe("Tue, 11 Jun 2024 12:30:04 GMT (UTC)");
  });

  test("matches reply fixture", () => {
    setUrl(exampleReply);

    // Local time
    const t1 = lite.unixTimestampToLocalDate(
      lite.extractUnixTimestamp(lite.getReplyId()),
    );
    expect(t1).toBe("Thu May 21 2026 09:36:11 ");

    // UTC
    const t2 = lite.unixTimestampToHumanDate(
      lite.extractUnixTimestamp(lite.getReplyId()),
    );
    expect(t2).toBe("Thu, 21 May 2026 13:36:11 GMT (UTC)");
  });
});
