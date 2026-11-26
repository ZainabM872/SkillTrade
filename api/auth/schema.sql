-- Additive: existing users, reset/refresh tokens, and booking tables are untouched.
CREATE TABLE IF NOT EXISTS skilltrade.login_sessions (
    token_hash text PRIMARY KEY,
    user_id bigint NOT NULL REFERENCES skilltrade.users(user_id) ON DELETE CASCADE,
    expires_at timestamptz NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS login_sessions_user ON skilltrade.login_sessions(user_id);
