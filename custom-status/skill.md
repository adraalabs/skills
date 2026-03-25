---
name: custom-status
description: Custom user status/bio system — users set a profile bio, mood, and social links displayed via /profile. Use when asked for user profiles, bio, status, or about me.
category: community
platforms: [discord, telegram]
version: 1
author: adraalabs
---

## Command: /setbio

Options: bio (string, required)
Tool: `put` key:"bio:{caller_id}" value:"{bio}"
Template: "Bio updated!"

## Command: /setstatus

Options: status (string, required)
Tool: `put` key:"status:{caller_id}" value:"{status}"
Template: "Status set to: {status}"

## Command: /profile

Options: user (user)
Steps:
1. `get` key:"bio:{target_id}" name:"bio"
2. `get` key:"status:{target_id}" name:"st"
3. `rank` prefix:"xp:" key:"xp:{target_id}" name:"rank"
4. `render_image` theme:"dark" user_id:"{target_id}" title:"{st_value || No status}" subtitle:"{bio_value || No bio set}" fields:[{label:"XP", value:"{rank_value || 0}"}, {label:"Rank", value:"#{rank_position || ?}"}, {label:"Level", value:"{math:floor(rank_value/100)}"}]

## Key rules

- Profile integrates with leveling if it exists (XP/rank data)
- If leveling isn't set up, rank fields show defaults
- step.name prefixes results: bio→{bio_value}, st→{st_value}
- render_image with user_id auto-fills avatar and display name
- {value || default} fallback syntax handles missing data gracefully
- Consider adding /setsocial for links (stored as JSON)
