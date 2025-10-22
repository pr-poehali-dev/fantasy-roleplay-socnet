-- Add password hash column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);

-- Add session token column
ALTER TABLE users ADD COLUMN IF NOT EXISTS session_token VARCHAR(255);

-- Add last login timestamp
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login TIMESTAMP;