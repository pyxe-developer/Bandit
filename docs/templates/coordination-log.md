# Coordination Log Template

Per-work-item coordination logs live at:

`docs/work/<WORK-ID>/coordination-log.jsonl`

Each line is one JSON object. The log is append-only and CLI-authoritative for
work-item workflow position. Evidence artifacts remain the proof for each
accepted transition.

## Step Transition

```json
{
  "version": 1,
  "event_type": "step_transition",
  "work_item": "BANDIT-000",
  "sequence": 1,
  "timestamp": "2026-05-25T12:00:00.000Z",
  "actor": "codex_pm",
  "source": "bandit coordination",
  "state": "brief_created",
  "accountable_actor": "Test Writer",
  "next_action": "Write RED evidence",
  "evidence": ["docs/work/BANDIT-000/brief.md"],
  "safe_triggers": ["red_evidence_required"]
}
```

Supported shared core states:

- `brief_created`
- `red_recorded`
- `implementation_recorded`
- `review_recorded`
- `landing_verdict_recorded`
- `landed`
- `retrospective_recorded`
- `closed`
- `blocked`

`blocked` requires an `accepted_block` object with `owner`, `required_input`,
and `resume_condition`.

## Actor Event

```json
{
  "version": 1,
  "event_type": "actor_event",
  "actor_event_type": "handoff",
  "work_item": "BANDIT-000",
  "sequence": 2,
  "timestamp": "2026-05-25T12:10:00.000Z",
  "actor": "codex_pm",
  "source": "bandit coordination",
  "evidence": [],
  "message": "Ready for Writer."
}
```

Supported actor event types are `claim`, `handoff`, `block`, `complete`,
`repair-request`, and `resume`. Actor events are coordination context only.
They cannot complete workflow stages or emit safe trigger points without an
accepted step transition.
