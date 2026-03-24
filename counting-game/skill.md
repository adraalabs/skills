---
name: counting-game
description: Counting channel game — users count up one by one, wrong numbers reset to 1. Use when asked for counting game, counting channel, or number game.
category: fun
platforms: [discord, telegram]
version: 3
author: adraalabs
---

## Setup

Ask for counting channel with show_select(type:"channel"). Then:
1. `store_data` key:"counting_next" value:1
2. Create the trigger below

## Trigger: counting

Event: `message_create`
Condition: {channel_id:"CHANNEL_ID", content_is_number:true, not_bot:true}

Actions:
1. `get_data` key:"counting_next" name:"expected"
2. `check` key:"message.content" operator:"==" value:"{expected_value}" else:[{type:"send_message", message:"Wrong! Expected {expected_value}. Back to 1!"}, {type:"store_data", key:"counting_next", value:1}]
3. `check` key:"user.id" operator:"!=" value:"{data:counting_last_user}" else:[{type:"send_message", message:"You can't count twice in a row!"}]
4. `increment_data` key:"counting_next" amount:1
5. `store_data` key:"counting_last_user" value:"{user.id}"
6. `add_reaction` emoji:"✅"

## Key rules

- `check.else` supports an array of actions — send error AND reset in one step
- `content_is_number` condition filters non-number messages
- `{data:counting_last_user}` reads from pre-fetched data cache
- Step 2 resets counting_next to 1 on wrong number via else
- Step 3 prevents same user counting twice
- Steps 4-6 only run if both checks pass
- React ✅ instead of sending messages (less spam)
