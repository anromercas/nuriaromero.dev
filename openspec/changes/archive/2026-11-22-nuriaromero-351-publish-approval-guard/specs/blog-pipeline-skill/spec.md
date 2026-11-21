## MODIFIED Requirements

### Requirement: Publishing is the owner's decision

The publish step SHALL hand the draft branch to the team-harness PR flow (PR into `develop`, CI `verify`) and SHALL NOT change `draft` to `false`; the owner flips it when approving and merging. `SKILL.md` SHALL NOT contain an instruction to set `draft: false`. The publish step SHALL state that `verify` fails on a PR that publishes a post until it carries the GitHub label `publish-approved`, that only the owner applies that label, and that the skill never adds it.

#### Scenario: No draft flip

- **WHEN** the skill test scans `SKILL.md`
- **THEN** it finds no instruction that writes `draft: false` and finds the statement that only the owner flips `draft`

#### Scenario: Publish label named

- **WHEN** the skill test scans `SKILL.md`
- **THEN** it finds `publish-approved` in step 5 with the statement that only the owner applies it, and finds no instruction to add the label
