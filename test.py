from extractor import LIPostTimestampExtractor as lite

example_comment = 'https://www.linkedin.com/feed/update/urn:li:activity:7206271470342131712?commentUrn=urn%3Ali%3Acomment%3A%28activity%3A7206271470342131712%2C7243992047441870850%29&dashCommentUrn=urn%3Ali%3Afsd_comment%3A%287243992047441870850%2Curn%3Ali%3Aactivity%3A7206271470342131712%29'

# Local time
t1 = lite.get_date_from_linkedin_comment(example_comment, True)
print(t1)

print("--")

t2 = lite.get_date_from_linkedin_activity(example_comment, True)
print(t2)

# UTC

print("=====")
t1 = lite.get_date_from_linkedin_comment(example_comment)
print(t1)

print("--")

t2 = lite.get_date_from_linkedin_activity(example_comment)
print(t2)