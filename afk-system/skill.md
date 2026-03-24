---
name: afk-system
description: AFK status system — set an away message, bot notifies when someone mentions you. Use when asked for AFK, away status, or do not disturb.
category: utility
platforms: [discord, telegram]
version: 1
author: adraalabs
---

## Command: /afk

Options: reason (string, default "AFK")
Steps:
1. `store_data` key:"afk:{caller_id}" value:{reason:"{reason}", since:"{timestamp}"}
2. Optionally set nickname: `set_nickname` user_id:"{caller_id}" nickname:"[AFK] {caller_name}"
Template: "You're now AFK: {reason}"

## Trigger: afk_mention_notify

Event: `message_create`

Actions:
1. Check if any mentioned user is AFK: for each mention in {message.mentions}, check `get_data` key:"afk:{mention_id}"
2. If AFK: `send_message` reply: "{mentioned_user} is AFK: {reason} (since {since})"

## Trigger: afk_return

Event: `message_create`

Actions:
1. Check if message author is AFK: `get_data` key:"afk:{user.id}"
2. If AFK: `delete_data` key:"afk:{user.id}", `send_message` "Welcome back {user}! You were AFK for X minutes"
3. Optionally restore nickname: remove [AFK] prefix

## Key rules

- Store AFK with timestamp so you can calculate duration on return
- afk_return trigger fires on any message — if the author has an AFK entry, remove it
- afk_mention_notify fires when someone mentions an AFK user — inform them
- Keep AFK messages short — it's a notification, not a conversation
- Nickname change is optional (some servers restrict this)
- {message.mentions} contains comma-separated user IDs of everyone mentioned
