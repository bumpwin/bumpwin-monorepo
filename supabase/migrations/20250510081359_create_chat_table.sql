-- =========================
-- Chat application schema
-- =========================

---------------------------
-- 1. chat_history table --
---------------------------
CREATE TABLE IF NOT EXISTS chat_history (
    tx_digest       TEXT PRIMARY KEY,
    event_sequence  BIGINT NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL,
    sender_address  TEXT NOT NULL,
    message_text    TEXT NOT NULL
);

-- Index for faster retrieval
CREATE INDEX IF NOT EXISTS idx_chat_created_at ON chat_history (created_at DESC);

-------------------------
-- 2. poll_cursor table --
-------------------------
CREATE TABLE IF NOT EXISTS poll_cursor (
    id         BOOLEAN PRIMARY KEY DEFAULT TRUE, -- Using boolean TRUE as a pseudo-singleton primary key
    cursor     TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Initialize the cursor if it doesn't exist
INSERT INTO poll_cursor(id, cursor) VALUES (TRUE, NULL)
ON CONFLICT DO NOTHING;
