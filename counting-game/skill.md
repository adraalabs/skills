---
name: counting-game
description: Counting channel game — users count up, bot detects wrong numbers and resets. Use when asked for counting game, counting channel, or number game.
category: fun
platforms: [discord, telegram]
version: 1
author: adraalabs
---

## Setup

Ask for counting channel with show_select(type:"channel").

## Trigger: counting_check

Event: `message_create` with condition: {channel_id: "COUNTING_CHANNEL_ID"}

Actions:
1. `get_data` key:"counting_current" — get the expected next number
2. Check if message.content equals the expected number
3. If correct: `store_data` key:"counting_current" value:next number, `add_reaction` with checkmark
4. If wrong: `store_data` key:"counting_current" value:1, `send_message` "Wrong! {user} broke the chain at {value}. Restarting from 1."
5. If same user as last counter: `send_message` "You can't count twice in a row!"

## Data keys

- "counting_current" — the next expected number
- "counting_last_user" — last person who counted (prevent double counting)
- "counting_highscore" — highest number reached

## Key rules

- Use condition:{channel_id} to only trigger in the counting channel
- Check {message.content} against the expected number
- Store the last user to prevent same person counting twice
- Track highscore and announce when broken
- Reset to 1 on wrong number, not 0
- React with ✅ on correct counts instead of sending messages (reduces spam)
