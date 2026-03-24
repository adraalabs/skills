---
name: giveaway
description: Timed giveaways with reaction entries, live entry count, and winner selection. Use when asked to set up a giveaway, raffle, or prize drawing.
category: engagement
version: 3
platforms: [discord, telegram]
author: adraalabs
---

## Setup

Create `/giveaway` with options: prize (string, required), duration (integer, minutes), winners (integer, default 1).

The command steps:
1. `increment_data` key:"giveaway_counter" — track giveaway number
2. `send_message` to current channel with embed: title={prize}, description="React with 🎉 to enter!\n\nHosted by: {caller}", fields=[{name:"Entries", value:"0", inline:true}, {name:"Host", value:"{caller_name}", inline:true}], color="#FFD700"
3. `store_data` key:"giveaway:{msg_message_id}" value with prize, host_id={caller_id}, host_name={caller_name}, winners, channel_id
4. `add_reaction` 🎉 to the sent message

## Trigger: giveaway_entry

Event: `reaction_add` with condition `{emoji: "🎉"}`

Actions:
1. `store_data` key:"giveaway_entry:{message.id}:{user.id}" value:"{user.id}"
2. `increment_data` key:"giveaway_count:{message.id}"
3. `edit_message` — update ONLY the Entries field: embed:{fields:[{name:"Entries", value:"{incremented_value}", inline:true}]}

## Critical rules

- **{user} in reaction triggers = the reactor**, not the message author. Store the host when creating.
- **Always filter by emoji**: condition:{emoji:"🎉"}
- **edit_message merges** — only specify fields you want to change. Original embed is preserved.
- **{incremented_value}** only available after increment_data in the same chain.
