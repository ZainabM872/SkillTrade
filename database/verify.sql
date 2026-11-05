-- Check the sample data and a few rules. All changes are rolled back.
-- Run with psql -v ON_ERROR_STOP=1.
BEGIN;
SET LOCAL search_path = skilltrade, public;
DO $$
DECLARE item record; actual bigint;
BEGIN
 FOR item IN SELECT * FROM (VALUES
 ('users',5),('settings',5),('auth_tokens',0),('categories',3),('tags',3),
 ('locations',2),('skill_listings',3),('listing_tags',4),('listing_locations',3),
 ('availability_intervals',2),('sessions',3),('attendance',6),
 ('session_changes',2),('notifications',2),('point_transactions',4),
 ('reviews',2),('learning_goals',2),('goal_progress',2),('messages',2),
 ('reports',2),('moderation_actions',2),('platform_settings',2)
 ) AS expected(table_name,row_count)
 LOOP
  EXECUTE format('SELECT count(*) FROM skilltrade.%I',item.table_name) INTO actual;
  IF actual <> item.row_count THEN
   RAISE EXCEPTION '%: expected % rows, got %', item.table_name,item.row_count,actual;
  END IF;
 END LOOP;
 IF (SELECT count(*) FROM information_schema.tables
     WHERE table_schema='skilltrade' AND table_type='BASE TABLE') <> 22 THEN
  RAISE EXCEPTION 'Expected 22 base tables';
 END IF;
 IF EXISTS(SELECT 1 FROM point_balance_audit WHERE point_balance <> ledger_balance) THEN
  RAISE EXCEPTION 'Stored balances differ from the ledger';
 END IF;
 IF (SELECT array_agg(point_balance ORDER BY user_id) FROM users)
    IS DISTINCT FROM ARRAY[45,15,30,0,0] THEN
  RAISE EXCEPTION 'Unexpected sample balances';
 END IF;
 IF (SELECT array_agg(progress_percent ORDER BY goal_id) FROM current_goal_progress)
    IS DISTINCT FROM ARRAY[25,100] THEN
  RAISE EXCEPTION 'Unexpected goal progress';
 END IF;
 IF EXISTS(SELECT 1 FROM users WHERE password_hash NOT LIKE '$argon2id$%') THEN
  RAISE EXCEPTION 'Invalid Argon2id hash prefix';
 END IF;
 BEGIN
  INSERT INTO settings(user_id) VALUES(-999);
  RAISE EXCEPTION 'Foreign key accepted missing user';
 EXCEPTION WHEN foreign_key_violation THEN NULL;
 END;
 BEGIN
  UPDATE users SET point_balance=-1 WHERE user_id=1;
  RAISE EXCEPTION 'Negative balance accepted';
 EXCEPTION WHEN check_violation THEN NULL;
 END;
 BEGIN
  DELETE FROM point_transactions WHERE transaction_id=1;
  RAISE EXCEPTION 'Ledger deletion accepted';
 EXCEPTION WHEN raise_exception THEN
  IF SQLERRM <> 'Ledger is append-only; insert a reversal instead' THEN RAISE; END IF;
 END;
 BEGIN
  INSERT INTO reviews(review_id,session_id,reviewer_id,reviewee_id,rating)
  VALUES(-999,2,1,2,5);
  RAISE EXCEPTION 'Review of incomplete session accepted';
 EXCEPTION WHEN raise_exception THEN
  IF SQLERRM <> 'Review requires a completed session and its participants' THEN RAISE; END IF;
 END;
END $$;
SELECT user_id,point_balance,ledger_balance FROM point_balance_audit ORDER BY user_id;
SELECT 'Schema and seed verification passed' AS result;
ROLLBACK;
