---
name: chat-locks
description: Chat lock system — lock/unlock media, links, stickers, polls, or all messages for the entire group. Replicates @MissRose_bot /lock and /unlock commands. Use when asked for chat locks, restrict chat, lock media, lock links, or lockdown.
category: moderation
version: 1
platforms: [telegram]
author: adraalabs
---

## Overview

Allows admins to lock/unlock specific message types for all non-admin members in a group.
Locks apply to ALL non-admin members (not per-user).

## Commands

### /lock
Options: type (string, required) — one of: media, links, stickers, polls, all, messages
Steps:
1. `put` key:"_lock:{type}" value:true
2. Create or update the corresponding trigger (see triggers below)
3. `send_message` text:"{type} has been locked. Non-admin members can no longer send {type}."

### /unlock
Options: type (string, required) — one of: media, links, stickers, polls, all, messages
Steps:
1. `delete` key:"_lock:{type}"
2. Disable or remove the corresponding trigger
3. `send_message` text:"{type} has been unlocked."

### /locks
Tool: `list` prefix:"_lock:" format:"raw"
Template: show which locks are currently active. If no locks, say "No active locks."

## Trigger: lock_media

Event: `message_create`
Condition: `{ "exclude_admins": true }`

Fire only when `_lock:media` is set.

Actions (check if lock is active, then restrict):
1. `get_data` key:"_lock:media" name:"lock"
2. `check` key:"lock_exists" operator:"==" value:"true"
   (if check passes = lock is active):
3. Check if message has photo/video/audio/document — use `extract` from:"message.text" to check
   Actually: For Telegram, media messages have no `.text` — they are separate message types.
   Better approach: Create trigger on specific message types.

### Better implementation:

Instead of checking message content, use TWO separate approaches:

**Approach A: Restrict all members when lock activates**

When `/lock media` is called:
1. Store the lock: `put` key:"_lock:media" value:true
2. For each tracked member: `restrict_member` user_id:"{member.id}" can_send_media:false duration:0

When `/unlock media` is called:
1. Delete the lock: `delete` key:"_lock:media"
2. For each tracked member: `unmute_member` user_id:"{member.id}"

**Approach B (simpler): Use setChatPermissions API**

This is the correct Telegram approach. Lock restricts the default permissions for ALL members.

The AI agent should call:
```
restrict_member with user_id:0 (special: applies to default permissions)
```

Actually, Telegram has `setChatPermissions` which sets DEFAULT permissions for all members.

## Implementation note for the AI

When user says "/lock media", the agent should:
1. Store lock state: `put` key:"_lock:media" value:true
2. The agent should explain that Telegram chat-wide locks use the admin panel or bot API to set default chat permissions

For the BOT to do this programmatically, it needs the `set_chat_permissions` tool (if available), or the admin can set it manually.

## Recommended: Ask for set_chat_permissions tool

If `set_chat_permissions` tool is available:
- /lock media → `set_chat_permissions` with can_send_photos:false, can_send_videos:false, etc.
- /lock links → `set_chat_permissions` with can_add_web_page_previews:false
- /lock stickers → `set_chat_permissions` with can_send_other_messages:false
- /lock polls → `set_chat_permissions` with can_send_polls:false
- /lock all → `set_chat_permissions` with can_send_messages:false

If not available, use `restrict_member` on individual users as they message.

## Key rules

- Chat-wide locks use Telegram's `setChatPermissions` API — it sets defaults for ALL non-admin members
- Per-user overrides with `restrict_member` take precedence
- Admins are always exempt from locks
- Store lock state in data store so /locks command can show active locks
- Always confirm the lock/unlock action to the admin
