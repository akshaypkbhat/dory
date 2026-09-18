---
description: Run planner, design, dev, and tester in sequence for a bigger fix or feature.
---

Run this as a pipeline for a larger fix or feature: $ARGUMENTS

Execute these steps in order, each one building on the previous step's actual output (not assumptions about what it would say):

1. **planner** — Use the Agent tool with subagent_type "planner" to research and produce a short, concrete plan for the task.
2. **design** — If the task touches the UI, use the Agent tool with subagent_type "design" to produce or update mockups based on the planner's output. Skip this step if the task is purely backend/logic/data with no UI surface, and say why you skipped it.
3. **dev** — Use the Agent tool with subagent_type "dev" to implement the plan (and the design, if step 2 ran).
4. **tester** — Use the Agent tool with subagent_type "tester" to test the implementation as a real user would.

If the tester reports failures, send them back to the dev agent for another pass, then re-test. Once it passes, summarize what was built, what was tested, and any remaining known issues.
