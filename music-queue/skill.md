---
name: music-queue
description: Song request queue with voting, now-playing display, and skip voting. Not actual audio playback — manages the queue and display. Use when asked for music queue, song requests, DJ queue, or listening party.
category: fun
platforms: [discord, telegram]
version: 1
author: adraalabs
---

## Command: /request

Options: song (string, required), artist (string)
Steps:
1. `increment` key:"queue_counter" name:"num"
2. `put` key:"queue:{num_value}" value:{song:"{song}", artist:"{artist}", requested_by:"{caller_name}", requested_by_id:"{caller_id}", votes:0}
3. `send_message` embed:{title:"Song Added", description:"**{song}** by {artist}\nRequested by {caller}", color:"#1DB954"} buttons:[{id:"queue_vote_{num_value}", label:"👍 0", style:"secondary"}]

## Command: /queue

Tool: `list` prefix:"queue:" sort:"desc" per_page:10
Embed: title:"Song Queue", description:"{entries}"

## Command: /skip

Steps:
1. `get` key:"queue_current"
2. `delete` key:"queue:{value}"
3. Get next song from queue
4. `put` key:"queue_current" value:next song number
Template: "Skipped! Now playing next song."

## Button handler: vote

put key:"interaction:queue_vote_{num_value}" value:
- unique_per_user: "Already voted!"
- steps: [{tool:"increment_data", args:{key:"queue_vote:{num_value}"}}]
- update_source: update button label with vote count

## Key rules

- This is a QUEUE MANAGER, not an audio player — it tracks requests and votes
- Songs are stored with incrementing IDs
- Votes determine play order
- Each vote button uses unique_per_user to prevent spam
- The "now playing" display updates when /skip is used
- Consider adding /clear for admins to reset the queue
