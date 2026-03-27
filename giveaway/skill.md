---
name: giveaway
description: Timed giveaways with reaction entries, live entry count, end time, and winner selection. Use when asked to set up a giveaway, raffle, or prize drawing.
category: engagement
version: 7
platforms: [discord, telegram]
author: adraalabs
---

## Setup

Create `/giveaway` with options: prize (string, required), duration (integer, minutes, default 10), winners (integer, default 1).

The command steps:
1. `increment` key:"giveaway_counter" name:"counter"
2. `send_message` to current channel with embed, name:"msg" (to get {msg_message_id})
3. `put` key:"giveaway:{msg_message_id}" value:{prize, host_id, winners, channel_id}
4. `add_reaction` 🎉 to {msg_message_id}
5. `timeout` delay_seconds:"{math:duration * 60}" with end actions

## Trigger: giveaway_entry_tracker

Event: `reaction_add` with condition: {emoji: "🎉"}

Actions (all with IDs):
1. `{id:"save", type:"store_data", key:"giveaway_entry:{message.id}:{user.id}", value:"{user.id}"}`
2. `{id:"count", type:"increment_data", key:"giveaway_count:{message.id}"}`
3. `{id:"update", type:"edit_message", channel_id:"{channel.id}", message_id:"{message.id}", embed:{fields:[{name:"Entries", value:"{count.incremented_value}", inline:true}]}}`

## Key rules

- Every action has an id — pipe results with {id.field}
- {count.incremented_value} pipes from increment_data to edit_message
- {user} in reaction triggers = the reactor, not the message author
- Always filter by emoji: condition:{emoji:"🎉"}
- edit_message merges — only specify fields you want to change
- Use store_data for entries to prevent double-counting
- Auto-end: timeout creates a one-time scheduled trigger
