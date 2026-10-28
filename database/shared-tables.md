# Things to match up

These are the fields my SQL uses from the accounts and scheduling tables. If we change any names or types, we need to update both parts.

Use the `skilltrade` schema in PostgreSQL 17.

| Table | Fields needed |
| --- | --- |
| users | user_id: bigint primary key; role: student, moderator or admin; point_balance: integer, not null, default 0, cannot be negative |
| skill_listings | listing_id: bigint primary key |
| sessions | session_id: bigint primary key; teacher_id and learner_id: bigint; point_cost: integer; status: includes completed |

Teacher and learner IDs should reference users. These are just the fields my part needs, not the full definitions of those tables.

## Sample IDs

The seed currently expects these rows. We can change the IDs as long as both seeds match.

- Users: 1 Alex (student), 2 Sam (student), 3 Taylor (student), 4 Morgan (moderator), 5 Jordan (admin). Start their point balances at 0.
- Listings: 1 Alex's photography, 2 Sam's guitar, 4 Alex's draft portrait listing.
- Session 1: teacher 1, learner 2, listing 1, one hour, 15 points, completed.
- Session 2: teacher 2, learner 1, listing 2, one hour, 15 points, confirmed.
- Session 5: teacher 1, learner 3, listing 1, one hour, 15 points, disputed.

My seed gives users 1, 2 and 3 thirty points each, then transfers 15 from user 2 to user 1 for session 1. Don't also give them starting points in the accounts seed. Final balances should be 45, 15 and 30.

## Where the parts meet

Attendance, availability, notifications and reliability calculations go with scheduling. My part includes these views:

- average_user_ratings: average of visible reviews
- point_balance_audit: compares balances against point transactions
- current_goal_progress: latest progress for each goal

Messages are in my part because reports can refer to messages.

If a scheduling trigger checks whether a session has been paid, add it after my point_transactions table exists.

The staff checks validate the user recorded in an action. The API will still need to check who's actually logged in and what they're allowed to do. Refund and reliability rules also need to be agreed on.

## Session costs

Use 15 points per hour and keep listing duration, session times and point_cost consistent. My payment trigger checks the stored session cost; it doesn't calculate the cost from the duration.

We still need to decide how to round fractional points before adding shorter sessions that need them.
