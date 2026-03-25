---
name: reporting
description: User reporting system — members can report rule-breaking messages to admins. Replicates @MissRose_bot /report. Use when asked for report system, report to admins, or moderation alerts.
category: moderation
version: 1
platforms: [telegram]
author: adraalabs
---

## Overview

Members reply to a rule-breaking message with /report and admins are notified with context.

## Commands

### /report
Options: reason (string, optional)

This command should be used as a REPLY to the offending message.

Steps:
1. `increment` key:"reports:{target_id}" name:"report_count"
2. `put` key:"report_log:{target_id}:{timestamp}" value:"{reason} — reported by {caller_name}"
3. `send_message` text:"Report received. Admins have been notified."

To notify admins:
4. `send_dm` to each admin with text:"Report in {chat.title}\n\nReported user: {target}\nReporter: {caller}\nReason: {reason}\nTotal reports: {report_count_value}\n\nMessage: {message.text}"

Alternative: If a mod-log group/channel exists:
4. `send_message` chat_id:"MOD_LOG_CHAT_ID" text:"Report\n\nReported: {target}\nBy: {caller}\nReason: {reason}\nReports total: {report_count_value}"

### /reports
Options: user (user, optional)
Tool: `get` key:"reports:{target_id}"
Template: "{target_name} has {value || 0} reports"

### /clearreports
Options: user (user, required)
Steps:
1. `delete` key:"reports:{target_id}"
2. `delete_by_prefix` prefix:"report_log:{target_id}:"
3. `send_message` text:"Cleared all reports for {target}"

## Setup

Ask the user:
1. Where should reports go? Options: DM to admins, specific mod-log group, or both
2. What threshold for auto-action? (e.g., 3 reports → auto-mute, 5 → auto-ban)

If auto-action requested, add steps:
- After increment, `check` key:"report_count_value" operator:">=" value:"3"
- On threshold: `mute_member` or `ban_member`

## Key rules

- /report should only work as a reply to another message
- Include the reported message text in the admin notification
- Track reports per-user with `increment` for threshold-based auto-action
- Store individual report reasons with timestamps for audit trail
- Only admins should be able to /clearreports
- Never reveal who reported — keep reporter anonymous in public messages
- DM admins for immediate attention, log channel for audit trail
