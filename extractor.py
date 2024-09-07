def get_date_from_linkedin_activity(post_url: str) -> str:
    """
    Extracts the timestamp from a LinkedIn activity URL and converts it to a UTC date.

    Args:
        post_url (str): LinkedIn activity URL containing an activity ID.

    Returns:
        str: Formatted UTC date string or an error message if extraction fails.

    Example:
        >>> get_date_from_linkedin_activity("https://www.linkedin.com/feed/update/activity:1234567890123456789")
        'Thu, 18 Aug 2022 14:30:45 GMT (UTC)'
    """
    try:
        match = re.search(r'activity:(\d+)', post_url)
        if not match:
            return 'Invalid LinkedIn ID'

        linkedin_id = match.group(1)

        # Extract the first 41 bits directly
        first_41_bits = bin(int(linkedin_id))[2:43]  

        # Convert to timestamp in milliseconds
        timestamp_ms = int(first_41_bits, 2)

        # Convert to seconds
        timestamp_s = timestamp_ms / 1000

        # Format the timestamp to UTC
        date = datetime.fromtimestamp(timestamp_s, tz=timezone.utc)

        return date.strftime('%a, %d %b %Y %H:%M:%S GMT (UTC)')
    except (ValueError, IndexError):
        return 'Date not available'
