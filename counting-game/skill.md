---
name: counting-game
description: Counting channel game — users count up one by one, wrong numbers get deleted and reset. Use when asked for counting game, counting channel, or number game.
category: fun
platforms: [discord, telegram]
version: 4
author: adraalabs
---

## Setup

Ask for counting channel with show_select(type:"channel"). Then:
1. `put` key:"counting_next" value:1
2. Create the trigger below

## Trigger: counting

Event: `message_create`
Condition: {channel_id:"CHANNEL_ID", content_is_number:true, not_bot:true}

Actions:
1. `get` key:"counting_next" name:"expected"
2. `check` key:"message.content" operator:"==" value:"{expected_value}" else:[{type:"delete_message"}, {type:"send_message", message:"{user} wrong! Expected **{expected_value}**. Back to 1!", auto_delete:5}, {type:"store_data", key:"counting_next", value:1}, {type:"store_data", key:"counting_last_user", value:""}]
3. `get` key:"counting_last_user" name:"last"
4. `check` key:"user.id" operator:"!=" value:"{last_value}" else:[{type:"delete_message"}, {type:"send_message", message:"{user} you can't count twice in a row!", auto_delete:5}]
5. `increment` key:"counting_next" amount:1
6. `put` key:"counting_last_user" value:"{user.id}"
7. `add_reaction` emoji:"✅"

## Behavior (like Countr bot)

- Correct number → ✅ reaction, no message
- Wrong number → delete their message, send brief error, reset to 1
- Same user twice → delete their message, send error
- Non-numbers are ignored (content_is_number condition filters them)
- Bot messages ignored (not_bot condition)

## Key rules

- `check.else` is an ARRAY of actions — delete + send error + reset in one step
- `delete_message` in trigger actions deletes the triggering message (no args needed)
- `check` stops the chain on failure — steps 5-7 only run if BOTH checks pass
- `check` resolves dot-path keys: user.id → context.user.id, message.content → context.message.content
- `{expected_value}` is set by get_data name:"expected" → available as context key
- Initialize counting_next to 1 on setup, clear counting_last_user
