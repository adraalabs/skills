---
name: highlights
description: Keyword notification system — users subscribe to words, get DM'd when someone says them. Like Discord's built-in highlights but better. Use when asked for highlights, keyword alerts, or mention notifications.
category: utility
platforms: [discord]
version: 1
author: adraalabs
---

## Command: /highlight add

Options: word (string, required)
Tool: `put` key:"highlight:{caller_id}:{word}" value:"{word}"
Template: "You'll be notified when someone says **{word}**"

## Command: /highlight remove

Options: word (string, required)
Tool: `delete` key:"highlight:{caller_id}:{word}"
Template: "Removed highlight for **{word}**"

## Command: /highlight list

Tool: `list` prefix:"highlight:{caller_id}:"
Template: "Your highlights: {entries}"

## Trigger: highlight_check

Event: `message_keyword`

This is complex — the trigger needs to:
1. Check message content against all stored highlight words
2. For each match, send a DM to the subscriber
3. Don't notify the author of their own message
4. Don't notify if the user is in the same channel (they can see it)

Since triggers can't iterate over data, use a simpler approach:
- Store highlights as trigger conditions: each /highlight add creates a message_keyword trigger with condition:{keyword:"word"}
- The trigger action: send_dm to the subscriber with the message link

## Key rules

- Each highlight word creates its own trigger with condition:{keyword}
- DM includes: who said it, which channel, message content preview, and a link
- Don't notify if the subscriber sent the message themselves
- Rate limit: cooldown per user to avoid spam when a word is said rapidly
- {message.url} for jump-to-message link
