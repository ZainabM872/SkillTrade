-- Sample data for SkillTrade. Run once after schema.sql.
BEGIN;
SET LOCAL search_path = skilltrade, public;

-- Accounts and scheduling sample data

-- Set demo hash for the seed data



-- Create the users, starting with 0 points
INSERT INTO users (user_id, name, email, password_hash, role, bio) VALUES
 (1, 'Alex',   'alex@example.com',   '$argon2id$v=19$m=4096,t=3,p=1$UWg2SWtmZWExRUZOekxuRkFXZW9hdz09$BL6rwgY75fySFoFDRpHA5IZnRW+RfPDmdLV7NtGlwcs', 'student',   'Photographer who wants to learn guitar.'),
 (2, 'Sam',    'sam@example.com',    '$argon2id$v=19$m=4096,t=3,p=1$UWg2SWtmZWExRUZOekxuRkFXZW9hdz09$BL6rwgY75fySFoFDRpHA5IZnRW+RfPDmdLV7NtGlwcs', 'student',   'Guitarist who wants to learn photography.'),
 (3, 'Taylor', 'taylor@example.com', '$argon2id$v=19$m=4096,t=3,p=1$UWg2SWtmZWExRUZOekxuRkFXZW9hdz09$BL6rwgY75fySFoFDRpHA5IZnRW+RfPDmdLV7NtGlwcs', 'student',   'Learning portrait photography.'),
 (4, 'Morgan', 'morgan@example.com', '$argon2id$v=19$m=4096,t=3,p=1$UWg2SWtmZWExRUZOekxuRkFXZW9hdz09$BL6rwgY75fySFoFDRpHA5IZnRW+RfPDmdLV7NtGlwcs', 'moderator', NULL),
 (5, 'Jordan', 'jordan@example.com', '$argon2id$v=19$m=4096,t=3,p=1$UWg2SWtmZWExRUZOekxuRkFXZW9hdz09$BL6rwgY75fySFoFDRpHA5IZnRW+RfPDmdLV7NtGlwcs', 'admin',     NULL);

-- These are all set to the defaults specified in the table declaration
INSERT INTO settings (user_id) SELECT user_id FROM users;

-- Create the catagories
INSERT INTO categories (category_id, name) VALUES
 (1, 'Photography'),
 (2, 'Music'),
 (3, 'Art');

-- Create Tags for listing
INSERT INTO tags (tag_id, name) VALUES
 (1, 'photography'),
 (2, 'guitar'),
 (3, 'beginner');

 -- Create the Locations for the listing
 INSERT INTO locations (location_id, created_by, location_name, latitude, longitude, meeting_instructions) VALUES
 (1, 1, 'University Coffee Shop', 51.0784, -114.1300, 'Meet by the table near window.'),
 (2, 2, 'Library', NULL, NULL, 'Meet near front desk');

-- Session 3 is intentially not used
INSERT INTO skill_listings (listing_id, teacher_id, category_id, title, description, experience_level, difficulty, session_mode, duration_minutes, point_cost, status) VALUES
 (1, 1, 1, 'Photography basics', 'Camera settings, composition and lighting.', 'Advanced', 'Beginner', 'both', 60, 15, 'active'),
 (2, 2, 2, 'Beginner guitar', 'Chords, strumming and your first song.', 'Advanced', 'Beginner', 'online', 60, 15, 'active'),
 (4, 1, 3, 'Portrait photography', 'Posing and lighting for portraits.', 'Advanced', 'Intermediate', 'in_person', 60, 15, 'draft');

INSERT INTO listing_tags (listing_id, tag_id) VALUES (1,1), (1,3), (2,2), (2,3);
INSERT INTO listing_locations (listing_id, location_id) VALUES (1,1), (1,2), (4,2);

-- Create availability intervals for users 1 and 2
INSERT INTO availability_intervals (user_id, start_time, end_time, kind, source) VALUES
 (1, '2026-11-07 10:00 America/Edmonton', '2026-11-07 14:00 America/Edmonton', 'available', 'manual'),
 (2, '2026-11-06 09:00 America/Edmonton', '2026-11-06 12:00 America/Edmonton', 'busy', 'calendar');

-- Create the Sessions, one of them will be disputed
INSERT INTO sessions (session_id, listing_id, teacher_id, learner_id, start_time, end_time, mode, location_id, meeting_link, point_cost, status) VALUES
 (1, 1, 1, 2, '2026-10-20 18:00 America/Edmonton', '2026-10-20 19:00 America/Edmonton', 'in_person', 1,    NULL, 15, 'completed'),
 (2, 2, 2, 1, '2026-11-05 17:00 America/Edmonton', '2026-11-05 18:00 America/Edmonton', 'online',    NULL, 'https://meet.example.com/skilltrade-guitar', 15, 'confirmed'),
 (5, 1, 1, 3, '2026-10-24 15:00 America/Edmonton', '2026-10-24 16:00 America/Edmonton', 'in_person', 1,    NULL, 15, 'disputed');

-- Insert attendance history for each session and user
 INSERT INTO attendance (session_id, user_id, status, arrived_at) VALUES
 (1, 1, 'attended', '2026-10-20 17:55 America/Edmonton'),
 (1, 2, 'attended', '2026-10-20 18:00 America/Edmonton'),
 (2, 1, 'pending',  NULL),
 (2, 2, 'pending',  NULL),
 (5, 1, 'attended', '2026-10-24 15:00 America/Edmonton'),
 (5, 3, 'no_show',  NULL);

-- Session changes table
INSERT INTO session_changes (session_id, requested_by, type, proposed_start, proposed_end, reason, status, resolved_at) VALUES
 (2, 1, 'reschedule', '2026-11-06 17:00 America/Edmonton', '2026-11-06 18:00 America/Edmonton', 'Class clash on the 5th.', 'pending',  NULL),
 (5, 3, 'cancel', NULL, NULL, 'Could not make it.', 'rejected', '2026-10-24 14:00 America/Edmonton');

-- Create notifications for both techer and learner for session 2 1 hour before
INSERT INTO notifications (user_id, session_id, type, message, scheduled_at) VALUES
 (1, 2, 'session_reminder', 'Your guitar session starts in 1 hour.', '2026-11-05 16:00 America/Edmonton'),
 (2, 2, 'session_reminder', 'Your guitar session starts in 1 hour.', '2026-11-05 16:00 America/Edmonton');


 -- Reset the ID counters
 -- We need this because every table above uses a counter to generate id numbers
 -- Because we manually set them for the seed, it does not move the counter and we will get duplicate ids
 -- Set the counter to the highest number available so the next id is the number after it

 SELECT setval(pg_get_serial_sequence('skilltrade.users','user_id'),                     (SELECT max(user_id) FROM users));
 SELECT setval(pg_get_serial_sequence('skilltrade.categories','category_id'),            (SELECT max(category_id) FROM categories));
 SELECT setval(pg_get_serial_sequence('skilltrade.tags','tag_id'),                       (SELECT max(tag_id) FROM tags));
 SELECT setval(pg_get_serial_sequence('skilltrade.locations','location_id'),             (SELECT max(location_id) FROM locations));
 SELECT setval(pg_get_serial_sequence('skilltrade.skill_listings','listing_id'),         (SELECT max(listing_id) FROM skill_listings));
 SELECT setval(pg_get_serial_sequence('skilltrade.availability_intervals','slot_id'),    (SELECT max(slot_id) FROM availability_intervals));
 SELECT setval(pg_get_serial_sequence('skilltrade.sessions','session_id'),               (SELECT max(session_id) FROM sessions));

-- Points, learning and moderation sample data


 INSERT INTO point_transactions(transaction_id,to_user_id,amount,type,idempotency_key) VALUES
 (1,1,30,'grant','demo-grant-alex'),(2,2,30,'grant','demo-grant-sam'),(3,3,30,'grant','demo-grant-taylor');
 INSERT INTO point_transactions(transaction_id,session_id,from_user_id,to_user_id,amount,type,idempotency_key) VALUES
 (4,1,2,1,15,'session','session-1-completed');
 INSERT INTO reviews(review_id,session_id,reviewer_id,reviewee_id,rating,comment) VALUES
 (1,1,2,1,5,'Clear explanations and a useful practice session.'),
 (2,1,1,2,4,'Arrived on time and asked thoughtful questions.');
 INSERT INTO learning_goals(goal_id,user_id,listing_id,title,description,status) VALUES
 (1,1,2,'Play a simple song','Practice three basic chords.','active'),
 (2,2,1,'Use manual camera settings','Learn exposure and composition.','completed');
 INSERT INTO goal_progress(progress_id,goal_id,session_id,progress_percent,note,recorded_at) VALUES
 (1,1,NULL,25,'Practised two chords at home.',now()-interval '1 day'),
 (2,2,1,100,'Completed the photography session.',now()-interval '2 days');
 INSERT INTO messages(message_id,session_id,sender_id,recipient_id,body) VALUES
 (1,2,1,2,'See you at the student centre.'),(2,2,2,1,'Sounds good!');
 INSERT INTO reports(report_id,reporter_id,assigned_to,session_id,reason,status) VALUES
 (1,1,4,5,'Please review the attendance dispute.','reviewing');
 INSERT INTO reports(report_id,reporter_id,assigned_to,listing_id,reason,status) VALUES
 (2,2,4,4,'Please check the listing description.','resolved');
 INSERT INTO moderation_actions(action_id,report_id,actor_id,target_user_id,type,reason,details) VALUES
 (1,1,4,3,'warning','Attendance dispute is under review.','{"demo":true}'),
 (2,2,4,1,'resolve','Listing description checked. No further action.','{"demo":true}');
 INSERT INTO platform_settings(setting_key,value,updated_by) VALUES
 ('point_rules','{"starting_points":30,"points_per_hour":15,"policy":"15 points per hour; starting points are demo values"}',5),
 ('community_guidelines','{"summary":"Be respectful and report issues to moderators."}',5);
DO $$
DECLARE t record;
BEGIN
 FOR t IN SELECT table_name,column_name FROM information_schema.columns
 WHERE table_schema='skilltrade' AND is_identity='YES'
 AND table_name IN ('point_transactions','reviews','learning_goals','goal_progress','messages','reports','moderation_actions')
 LOOP
  EXECUTE format('SELECT setval(pg_get_serial_sequence(%L,%L), (SELECT max(%I) FROM skilltrade.%I), true)',
   'skilltrade.'||t.table_name,t.column_name,t.column_name,t.table_name);
 END LOOP;
END $$;

COMMIT;
