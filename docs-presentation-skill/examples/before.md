# Snipping Tool - Click to Do Bet (raw notes)

These are raw, unstructured notes handed to the agent. The agent converts them into a structured,
navigable page (see `after.html`). Nothing here is invented; the generated page must trace to it.

## Summary

The big bet for FY27 is integrating Snipping Tool with Click to Do so a capture becomes an actionable
surface, not just an image. Goal: turn "screenshot" into "get something done."

## Why now

- Users already screenshot to act on content (copy text, look things up, share).
- Click to Do provides on-device intelligence to recognize text and entities.
- Combining them removes the manual copy/paste/switch-app loop.

## Goals

1. Recognize text and entities in any capture.
2. Offer contextual actions (copy text, search, translate, open link).
3. Keep it fast and private - on-device where possible.

## Metrics we care about

- Monthly active devices: 382M.
- Quarter-over-quarter usage growth: +12%.
- Average store rating: 4.6.

## Phases

- FY26 Q3: discovery and research.
- FY26 Q4: prototype recognition + actions.
- FY27 Q1: ship first actions to Insiders.

## Risks

- Recognition accuracy on noisy captures.
- Privacy expectations for on-device processing.
- Discoverability of the new actions.

## Old vs new flow

Today: capture -> save/paste -> switch app -> act.
With the bet: capture -> actions appear inline -> act.
