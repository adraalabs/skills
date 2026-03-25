---
name: invite-tracker
description: Track who invited whom, invite counts, and invite leaderboard. Use when asked for invite tracking, invite rewards, or who invited a member.
category: community
version: 1
platforms: [discord]
author: adraalabs
---

## How it works

The bot auto-detects which invite was used on member_join by diffing invite use counts. This only activates when a member_join trigger references {inviter} placeholders.

## Trigger: track_invites

Event: `member_join`

Actions:
1. `increment` key:"invites:{inviter.id}" amount:1
2. `send_message` to welcome/log channel: "{user} joined! Invited by {inviter}"

## Commands

### /invites
Single tool: `get` key:"invites:{target_id}"
Template: "**{target_name}** has **{value || 0}** invites"

### /top-inviters
Single tool: `list` prefix:"invites:" sort:"desc" per_page:10 format:"ranked"
Embed: title:"Top Inviters", description:"{entries}"

## Key rules

- {inviter} = the person whose invite link was used. Only available in member_join.
- {inviter.id}, {inviter.tag}, {inviter.name} also available
- The bot only fetches Discord invites if a member_join trigger uses {inviter} — zero API overhead for servers without invite tracking
- Invite data persists in the database even if the Discord invite is deleted
- {user} in member_join = the new member who joined
