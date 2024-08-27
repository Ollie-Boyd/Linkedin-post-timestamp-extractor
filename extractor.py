from datetime import datetime, timezone
import re

def get_date_from_linkedin_activity(post_url):
    try:
        match = re.search(r'activity-(\d+)', post_url)
        if not match:
            return 'invalid LinkedIn ID'

        linkedin_id = match.group(1)

        post_id = int(linkedin_id)

        as_binary = format(post_id, '64b')
        first_41_chars = as_binary[1:42]

        timestamp_ms = int(first_41_chars, 2)

        timestamp_s = timestamp_ms / 1000

        date = datetime.fromtimestamp(timestamp_s, tz=timezone.utc)

        return date.strftime('%a, %d %b %Y %H:%M:%S GMT (UTC)')
    except ValueError:
        return 'Date not available'
