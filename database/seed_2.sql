\set ON_ERROR_STOP on
-- Run once, after the accounts and scheduling seed. See shared-tables.md for IDs.
BEGIN;
SET LOCAL search_path = skilltrade, public;
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
