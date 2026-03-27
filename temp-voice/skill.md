---
name: temp-voice
description: Temporary voice channels — join a "Create" channel, bot creates a private voice channel for you, auto-deletes when empty. Like VoiceMaster. Use when asked for temp voice, voice master, or dynamic voice channels.
category: community
platforms: [discord]
version: 3
author: adraalabs
---

## Setup

Ask for: the "Join to Create" voice channel (show_select type:"channel"), and optionally a category for new channels.

## Trigger: temp_voice_join

Event: `voice_join` with condition: {channel_id: "JOIN_TO_CREATE_CHANNEL_ID"}

Actions (all primitives with IDs for piping):
1. `{id:"ch", type:"create_channel", name:"{user.name}'s Channel", channel_type:"voice", category_id:"CATEGORY_ID"}`
2. `{id:"deny", type:"set_channel_permissions", channel_id:"{ch.created_channel_id}", target_id:"@everyone", deny:"ViewChannel,Connect"}`
3. `{id:"allow", type:"set_channel_permissions", channel_id:"{ch.created_channel_id}", target_id:"{user.id}", allow:"ViewChannel,Connect,ManageChannels"}`
4. `{id:"save", type:"store_data", key:"temp_vc:{ch.created_channel_id}", value:"{user.id}"}`
5. `{id:"move", type:"move_to_voice", user_id:"{user.id}", channel_id:"{ch.created_channel_id}"}`

## Trigger: temp_voice_cleanup

Event: `voice_leave` with condition: {data_exists: "temp_vc:{voice_channel.id}"}

Actions:
1. `{id:"chk", type:"check", key:"{voice_channel.member_count}", operator:"==", value:"0", then:[
   {id:"del", type:"delete_channel", channel_id:"{voice_channel.id}"},
   {id:"clean", type:"delete_data", key:"temp_vc:{voice_channel.id}"}
   ]}`

## Trigger: temp_voice_channel_delete

Event: `channel_delete` (cleanup data when channel is manually deleted)

Actions:
1. `{id:"cleanup", type:"delete_data", key:"temp_vc:{channel.id}"}`

## Key rules

- Every action has an id for output piping — reference as {id.field}
- Uses ONLY primitive actions — no shortcuts
- {ch.created_channel_id} pipes the channel ID from step 1 to later steps
- @everyone in set_channel_permissions resolves to the guild's default role
- voice_leave checks member_count == 0 before deleting
- Track temp channels with "temp_vc:{channel_id}" → owner's user ID
