---
name: polls
description: Custom polls with buttons, live vote counts, and duplicate vote prevention. Use when asked for polls, voting, or surveys.
category: engagement
version: 1
platforms: [discord, telegram]
author: adraalabs
---

## Setup

Create `/poll` with options: question (string, required), option1-option4 (strings).

The command:
1. Build buttons from the provided options, each with unique ID like "poll_{random}_opt1"
2. `send_interactive` with embed: title=question, description lists options, color="#5865F2"
3. For each button, `put` key:"interaction:poll_{id}_optN" value:{unique_per_user:true, steps:[{tool:"increment_data", args:{key:"poll_vote:{message_id}:optN"}}, ...], update_source:{description with updated counts}}

## Key patterns

- `unique_per_user: true` prevents double voting — one click per user per button
- `update_source` updates the poll embed after each vote with new counts
- Each option has its own counter: "poll_vote:{message_id}:opt1", "poll_vote:{message_id}:opt2"
- Use {incremented_value} for the count of the option that was just voted

## Key rules

- unique_per_user is critical — without it users can vote unlimited times
- update_source reads from the data store to show all current counts, not just the one that changed
- Button IDs must be unique per poll — include a random component
- The poll embed is the single source of truth — update_source keeps it current
