# Bandit Claim Projections

This directory is reserved for `.bandit` claim projection artifacts. Active
writable claim authority lives in `refs/bandit/*` and state-changing operations
must use `git update-ref --stdin` compare-and-swap transactions.
