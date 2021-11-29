# Linkedin-post-timestamp-extractor
* Given a Linkedin post URL we can extract the UTC timestamp which isn't otherwise available in frontend/API metadata. 
* Use a modern Chromium based browser.
* Click here then select `Copy link to post`.
![image](https://user-images.githubusercontent.com/50486871/143889889-1187c8b9-ad87-485f-9eaf-6f89df2d207c.png?s=50)

Use it here https://ollie-boyd.github.io/Linkedin-post-timestamp-extractor/ . Commandline script coming soon.

Following on from updating the TikTok timestamp extractor https://github.com/bellingcat/tiktok-timestamp , I wanted to see if there were any other timecodes that we can mine.
I saw someone looking for a way to get a Linkedin post's timestamp, which doesn't seem to be available other than the '1 week ago' given on the frontend.

Based on Ryan Benson's work on the TikTok timestamp (https://dfir.blog/tinkering-with-tiktok-timestamps/) I began to have a play around with the 19 digit Linkedin post ID. After some trial and error I found we can convert the post ID to binary, then convert the first 41 binary bits to a decimal to give the UNIX timestamp in milliseconds. Nice!



