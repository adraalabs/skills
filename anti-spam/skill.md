---
name: anti-spam
description: Full anti-spam system — new member verification (captcha button), flood control, link blocking, media restriction for new members. Replicates @GroupHelpBot/@MissRose_bot anti-spam. Use when asked for anti-spam, captcha, verification, flood control, or raid protection.
category: moderation
version: 1
platforms: [telegram]
author: adraalabs
---

## Overview

Complete anti-spam suite with 4 layers:
1. **New member gate** — restrict new members (no media/links) until they click a verify button
2. **Flood control** — auto-mute users who send too many messages too fast
3. **Link blocker** — auto-delete messages with links from non-admins
4. **Word blacklist** — auto-delete messages containing banned words

## Trigger: new_member_gate

Event: `member_join`
Condition: `{ "exclude_admins": true }`

Actions:
1. `restrict_member` user_id:"{user.id}" duration:86400 can_send_media:false can_send_links:false can_send_stickers:false
2. `send_message` message:"Welcome {user}! Please click the button below to verify you're human." buttons:[{id:"verify_{user.id}", label:"I'm human", url:null}]
3. `store_data` key:"interaction:verify_{user.id}" value:{"tool":"unmute_member","args":{"user_id":"{user.id}"},"response":"Verified! You now have full access.","unique_per_user":true}
4. `store_data` key:"_pending_verify:{user.id}" value:"{timestamp}" ttl_seconds:86400

### Auto-kick unverified (optional)

Create a `cron` trigger (every 6 hours) that checks pending verifications:
- `list_data` prefix:"_pending_verify:" name:"pending"
- For each entry older than 24h, `kick_member` the user

## Trigger: flood_control

Event: `message_create`
Condition: `{ "exclude_admins": true, "flood_limit": 5, "flood_window": 10 }`

Actions:
1. `mute_member` user_id:"{user.id}" duration:300
2. `delete_message`
3. `send_message` message:"{user} has been muted for 5 minutes (flooding)"

## Trigger: link_blocker

Event: `message_keyword`
Condition: `{ "keywords": ["https?://\\S+", "t\\.me/\\S+", "tinyurl\\.com", "bit\\.ly"], "match": "regex", "exclude_admins": true }`

Actions:
1. `delete_message`
2. `send_message` message:"{user}, links are not allowed in this group."
3. `increment_data` key:"link_violations:{user.id}" amount:1

Add a check: if violations >= 3, auto-mute for 1 hour:
4. `check` key:"{incremented_value}" operator:">=" value:"3"
   else: [{type:"mute_member", user_id:"{user.id}", duration:3600}, {type:"send_message", message:"{user} has been muted for 1 hour (repeated link violations)"}]

## Trigger: word_blacklist

Event: `message_keyword`
Condition: `{ "keywords": [], "match": "contains", "exclude_admins": true }`

NOTE: Ask the user what words to blacklist. Add them to the keywords array.

Actions:
1. `delete_message`
2. `send_message` message:"Message removed (blacklisted content)."

## Commands

### /antispam
Tool: `send_message`
Template: "Anti-spam status:\n- New member gate: Active\n- Flood control: 5 msgs/10s\n- Link blocker: Active\n- Blacklist: Active"

## Key rules

- Use `exclude_admins: true` on ALL anti-spam triggers so admins bypass restrictions
- `restrict_member` is more precise than `mute_member` — it allows text but blocks media/links
- Flood detection uses a sliding window — `flood_limit:5, flood_window:10` means 5+ messages in 10 seconds
- For Telegram: the verify button uses callback_query handled by `store_data` with `interaction:` prefix
- Link regex covers http/https, t.me, and common shorteners
- Always tell the user what was blocked and why
