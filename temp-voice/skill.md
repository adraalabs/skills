---
name: temp-voice
description: Temporary voice channels — join a "Create" channel, bot creates a private voice channel for you, auto-deletes when empty. Like VoiceMaster. Use when asked for temp voice, voice master, or dynamic voice channels.
category: community
platforms: [discord]
version: 1
author: adraalabs
---

## Setup

Ask for: the "Join to Create" voice channel (show_select type:"channel"), and optionally a category for new channels.

## Trigger: create_temp_channel

Event: `voice_join` with condition: {channel_id: "JOIN_TO_CREATE_CHANNEL_ID"}

Actions:
1. `create_temp_channel` name:"{user.name}'s Channel", user_id:"{user.id}", category_id:"CATEGORY_ID"
2. `move_to_voice` user_id:"{user.id}", channel_id:"{created_channel_id}"
3. `put` key:"temp_vc:{created_channel_id}" value:"{user.id}"

## Trigger: cleanup_empty

Event: `voice_leave`

Actions:
1. Check if the channel is a temp channel: look up `temp_vc:{voice_channel.id}`
2. Check if channel is empty: {voice_channel.member_count} == 0
3. If empty: `delete_channel` channel_id:"{voice_channel.id}", `delete` key:"temp_vc:{voice_channel.id}"

## Key rules

- create_temp_channel makes a channel only the creator + bot can see
- move_to_voice moves the user from the "Join to Create" channel to their new channel
- {created_channel_id} is set by create_temp_channel action
- Track temp channels with "temp_vc:{channel_id}" → owner's user ID
- voice_leave trigger checks member_count before deleting
- {voice_channel.member_count} is 0 when the last person leaves
- Category keeps temp channels organized
