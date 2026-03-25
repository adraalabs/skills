---
name: moderation-suite
description: Full moderation system — warnings with auto-punish, mod logs, mute/ban history, and appeal system. Use when asked for moderation, warnings, mod log, or punishment system.
category: moderation
platforms: [discord, telegram]
version: 1
author: adraalabs
---

## Commands

### /warn
Options: user (user, required), reason (string, required)
Steps:
1. `increment` key:"warns:{target_id}" name:"w"
2. `put` key:"warn_log:{target_id}:{timestamp}" value:"{reason} — by {caller_name}"
3. `send_message` to mod-log channel: embed with title:"Warning", description:"{target} warned by {caller}\nReason: {reason}\nTotal: {w_value}"

Auto-punish thresholds (add as conditional steps):
- 3 warns → `mute_member` / `timeout_member` 1 hour
- 5 warns → `ban_member`
Use step.if:"w_value >= 3" and step.if:"w_value >= 5"

### /warnings
Options: user (user)
Tool: `get` key:"warns:{target_id}"
Template: "{target_name} has {value || 0} warnings"

### /clearwarns
Options: user (user, required)
Steps:
1. `delete` key:"warns:{target_id}"
2. `delete_by_prefix` prefix:"warn_log:{target_id}:"
Template: "Cleared all warnings for {target}"

### /modlog
Options: user (user)
Tool: `list` prefix:"warn_log:{target_id}:" sort:"desc" per_page:10
Embed: title:"{target_name}'s Mod Log", description:"{entries}"

## Trigger: mod_log_actions

Create a trigger on `member_ban` to log bans:
Action: `send_message` to mod-log channel with embed

## Key rules

- Ask for a mod-log channel with show_select(type:"channel")
- Store individual warn reasons with timestamp keys for history
- Auto-punish uses conditional steps — check warn count AFTER incrementing
- {w_value} is the NEW count after increment (includes the current warn)
- delete_by_prefix cleans up all individual warn logs
