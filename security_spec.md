# Security Specification - Tea Thank You

## Data Invariants
- A wish must have a sender and text (cannot be empty).
- A wish must be associated with valid tree coordinates (x, y).
- Timestamps must be handled on the server (request.time).
- Anyone can read the wishes to view the tree.
- Anyone can create a wish.
- Deletion is restricted (for now, I'll allow deletion by the creator if we add auth, or leave it for manual admin cleanup).
  - *Decision*: To satisfy the user's request for "manual xóa", I'll allow anyone to delete for this MVP, but in a real app, we'd use Admin roles.

## The Dirty Dozen Payloads (Rejection Tests)
1. Empty wish text.
2. Missing sender name.
3. Injecting extra fields (isVerified: true).
4. Coordinates out of range (x: 500).
5. Spoofing timestamps (createdAt: in the future).
6. Large payload (text.size > 500).
7. Invalid rotation (rotate: 360).
8. Invalid scale (scale: 10).
9. Attempting to update a wish (Wishes are immutable after creation).
10. Malicious characters in sender name.
11. Very long text (> 1000 chars).
12. Invalid ID format.
