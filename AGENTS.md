# Agent Working Rules

- Provide a brief progress update every 5 minutes.
- Limit any single command to 10 minutes.
- If no files change for 10 minutes, stop immediately and report.
- Split large features into phases, and complete at most one planned task per turn.
- Do not combine dependency installation, implementation, build, and browser verification in one pass.
- Do not load large images, binary files, or complete logs into context.
- Immediately validate JSON after changing dependency files.
- Immediately report permission or command failures.
- Every turn must end explicitly.
