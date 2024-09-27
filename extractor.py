import re
import urllib.parse
from datetime import datetime, timezone

class LIPostTimestampExtractor:
    @staticmethod
    def format_timestamp(timestamp_s, get_local: bool = False):
        # Format the timestamp to UTC
        if get_local:
            date = datetime.fromtimestamp(timestamp_s)
            return date.strftime('%a, %d %b %Y %H:%M:%S GMT')
        else:
            date = datetime.fromtimestamp(timestamp_s, tz=timezone.utc)
            return date.strftime('%a, %d %b %Y %H:%M:%S GMT (UTC)')

    @classmethod
    def get_date_from_linkedin_comment(cls, post_url: str, get_local: bool = False) -> str:
        """
        Extracts the timestamp from a LinkedIn comment URL and converts it to a UTC date.

        Args:
            post_url (str): LinkedIn activity URL containing a comment ID.
            get_local: True for local timezone, default/False: UTC

        Returns:
            str: Formatted local or UTC date string or an error message if extraction fails.

        Example:
            >>> get_date_from_linkedin_comment("https://www.linkedin.com/feed/update/urn:li:activity:7206271470342131712?commentUrn=urn%3Ali%3Acomment%3A%28activity%3A7206271470342131712%2C7243992047441870850%29&dashCommentUrn=urn%3Ali%3Afsd_comment%3A%287243992047441870850%2Curn%3Ali%3Aactivity%3A7206271470342131712%29")
            'Mon, 23 Sep 2024 14:38:10 GMT (UTC)'
        """
        try:
            post_url_unquote = urllib.parse.unquote(post_url)
            match = re.search(r'fsd_comment:\((\d+),urn:li:activity:\d+\)', post_url_unquote)
            if not match:
                return 'LinkedIn comment timestamp not found'

            linkedin_id = match.group(1)

            # Extract the first 41 bits directly
            first_41_bits = bin(int(linkedin_id))[2:43]  

            # Convert to timestamp in milliseconds
            timestamp_ms = int(first_41_bits, 2)

            # Convert to seconds
            timestamp_s = timestamp_ms / 1000

            # Format timestamp
            return cls.format_timestamp(timestamp_s, get_local)

        except (ValueError, IndexError):
            return 'Comment date not available'

    @classmethod
    def get_date_from_linkedin_activity(cls, post_url: str, get_local: bool = False) -> str:
        """
        Extracts the timestamp from a LinkedIn activity URL and converts it to a UTC date.

        Args:
            post_url (str): LinkedIn activity URL containing an activity ID.
            get_local: True for local timezone, default/False: UTC
            
        Returns:
            str: Formatted local or UTC date string or an error message if extraction fails.

        Example:
            >>> get_date_from_linkedin_activity("https://www.linkedin.com/feed/update/activity:1234567890123456789")
            'Thu, 18 Aug 2022 14:30:45 GMT (UTC)'
        """
        try:
            post_url_unquote = urllib.parse.unquote(post_url)
            match = re.search(r'activity:(\d+)', post_url_unquote)
            if not match:
                return 'Invalid LinkedIn ID'

            linkedin_id = match.group(1)

            # Extract the first 41 bits directly
            first_41_bits = bin(int(linkedin_id))[2:43]  

            # Convert to timestamp in milliseconds
            timestamp_ms = int(first_41_bits, 2)

            # Convert to seconds
            timestamp_s = timestamp_ms / 1000

            # Format timestamp
            return cls.format_timestamp(timestamp_s, get_local)

        except (ValueError, IndexError):
            return 'Date not available'
