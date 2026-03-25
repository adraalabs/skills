---
name: birthday
description: Birthday tracking with announcements on the special day. Use when asked for birthday system, birthday reminders, or birthday roles.
category: community
version: 1
platforms: [discord, telegram]
author: adraalabs
---

## Commands

### /setbirthday
Options: month (integer, 1-12), day (integer, 1-31)
Tool: `put` key:"birthday:{caller_id}" value:"{month}-{day}"
Template: "Birthday set to **{month}/{day}**!"

### /birthday
Tool: `get` key:"birthday:{target_id}"
Template: "**{target_name}**'s birthday is **{value || not set}**"

## Trigger: birthday_check

Event: `cron` with condition:{cron:"0 9 * * *"} (daily at 9 AM)

This is the tricky part — cron triggers can't iterate over all birthdays. Instead:
1. The LLM should explain that the bot checks birthdays daily
2. Store birthdays as "birthday:USERID" with value "MM-DD"
3. The cron trigger action uses `http_fetch` to call the bot's own API or a simple script that queries birthdays matching today's date

Alternative simpler approach: skip cron, let users manually check with `/birthdays-today` which does `list` prefix:"birthday:" and filters client-side.

## Key rules

- Birthday format: "MM-DD" for easy string comparison with today's date
- Cron: "0 9 * * *" = every day at 9:00 UTC
- For birthday roles: assign on the day, remove with a schedule_one_shot 24h later
