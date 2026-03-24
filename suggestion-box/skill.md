---
name: suggestion-box
description: Suggestion system with upvote/downvote buttons, status tracking, and admin review. Use when asked for suggestions, feedback, or idea voting.
category: community
platforms: [discord, telegram]
version: 1
author: adraalabs
---

## Command: /suggest

Options: suggestion (string, required)

Steps:
1. `increment_data` key:"suggestion_counter" name:"num"
2. `send_message` to suggestions channel with:
   - embed: title:"Suggestion #{num_value}", description:"{suggestion}", footer:"By {caller_name}", color:"#FFA500"
   - buttons: [{id:"suggest_up_{num_value}", label:"0", emoji:"👍", style:"success"}, {id:"suggest_down_{num_value}", label:"0", emoji:"👎", style:"danger"}, {id:"suggest_status_{num_value}", label:"Pending", style:"secondary"}]
3. `store_data` key:"suggestion:{num_value}" value with suggestion text, author_id, message_id, status:"pending"

## Button handlers

### Upvote
store_data key:"interaction:suggest_up_{num_value}" value:
- unique_per_user: "Already voted!"
- steps: [{tool:"increment_data", args:{key:"suggest_up:{num_value}"}}]
- update_source: update the upvote button label with {incremented_value}

### Downvote
Same pattern with suggest_down_{num_value}

### Status (admin only)
store_data key:"interaction:suggest_status_{num_value}" value:
- required_permissions: ["ManageMessages"]
- show_buttons with options: Approved (green), Denied (red), Implemented (blue)
- update_source: change status button label and color

## Key rules

- unique_per_user prevents double voting
- update_source changes button labels to show live vote counts
- Status button is admin-only via required_permissions
- Use {{num_value}} (double braces) when storing interaction handlers inside command steps
- Each suggestion gets a unique number from suggestion_counter
