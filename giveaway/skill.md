---
name: giveaway
description: Timed giveaways with reaction entries, live entry count, end time, and winner selection. Use when asked to set up a giveaway, raffle, or prize drawing.
category: engagement
version: 4
platforms: [discord, telegram]
author: adraalabs
---

## Setup

Create `/giveaway` with options: prize (string, required), duration (integer, minutes, default 10), winners (integer, default 1).

The command steps:
1. `increment_data` key:"giveaway_counter" — track giveaway number
2. `set_context` name:"end_time" value:"{math:timestamp + duration * 60}" — compute end timestamp
3. `send_message` to current channel with embed:
   - title: "{prize}"
   - description: "React with 🎉 to enter!\n\nHosted by: {caller}"
   - fields: [{name:"Entries", value:"0", inline:true}, {name:"Host", value:"{caller_name}", inline:true}, {name:"Ends", value:"<t:{end_time}:R>", inline:true}]
   - color: "#FFD700"
   - footer: "Giveaway #{counter_value}"
4. `store_data` key:"giveaway:{msg_message_id}" value with prize, host_id={caller_id}, host_name={caller_name}, winners, channel_id, end_time
5. `add_reaction` 🎉 to the sent message

## Trigger: giveaway_entry

Event: `reaction_add` with condition `{emoji: "🎉"}`

Actions:
1. `store_data` key:"giveaway_entry:{message.id}:{user.id}" value:"{user.id}" if_not_exists:true
2. `increment_data` key:"giveaway_count:{message.id}"
3. `edit_message` — update ONLY the Entries field: embed:{fields:[{name:"Entries", value:"{incremented_value}", inline:true}]}

## Key rules

- **Ends field** uses Discord timestamp format `<t:UNIX:R>` which shows "in 10 minutes", "in 5 minutes", auto-updates
- Compute end_time with `{math:timestamp + duration * 60}` — timestamp is current unix seconds, duration is in minutes
- **{user} in reaction triggers = the reactor**, not the message author. Store the host when creating.
- **Always filter by emoji**: condition:{emoji:"🎉"}
- **edit_message merges** — only specify fields you want to change. Original embed is preserved.
- **{incremented_value}** only available after increment_data in the same chain.
- Use `store_data` with `if_not_exists:true` for entries to prevent double-counting on re-react.
- Duration option should default to 10 if not provided.
