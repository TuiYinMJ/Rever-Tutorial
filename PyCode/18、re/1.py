import re

log_data = """
2025-07-22 INFO: User 'admin' logged in from 192.168.1.100.
2025-07-22 ERROR: Failed to connect to server at 192.168.1.52. Contact admin@example.com.
2025-07-22 INFO: User 'guest' made a transaction.
2025-07-22 WARNING: Disk space is low. 25GB available.
Email support at admin@admin.com for assistance.
"""

ip_parttern = r"\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}"
found_ips = re.findall(ip_parttern, log_data)
print(found_ips)

email_pattern = r"\w+@\w+\.\w+"
found_emails = re.findall(email_pattern, log_data)
print(found_emails)

err_line = r"^.*ERROR:.*$"
found_err_lines = re.findall(err_line, log_data, re.MULTILINE)
print(found_err_lines)