-- SQL Schema for Item Position Persistence
-- Run this in your Supabase SQL Editor to create the necessary tables

-- Table for storing item positions in Finder windows
CREATE TABLE IF NOT EXISTS item_positions (
  id BIGSERIAL PRIMARY KEY,
  session_id TEXT NOT NULL,
  item_id TEXT NOT NULL,
  x INTEGER NOT NULL,
  y INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(session_id, item_id)
);

-- Table for storing desktop icon positions
CREATE TABLE IF NOT EXISTS desktop_positions (
  id BIGSERIAL PRIMARY KEY,
  session_id TEXT NOT NULL,
  item_id TEXT NOT NULL,
  x INTEGER NOT NULL,
  y INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(session_id, item_id)
);

-- Add indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_item_positions_session_id ON item_positions(session_id);
CREATE INDEX IF NOT EXISTS idx_desktop_positions_session_id ON desktop_positions(session_id);

-- Enable Row Level Security (RLS)
ALTER TABLE item_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE desktop_positions ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public access (since we're using session_id instead of auth)
CREATE POLICY "Allow public access to item_positions"
  ON item_positions
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public access to desktop_positions"
  ON desktop_positions
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Table for storing extracted folders from zip files
CREATE TABLE IF NOT EXISTS extracted_folders (
  id BIGSERIAL PRIMARY KEY,
  session_id TEXT NOT NULL,
  folder_name TEXT NOT NULL,
  folder_type TEXT DEFAULT 'about_me', -- 'about_me' or 'contact'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_extracted_folders_session_id ON extracted_folders(session_id);

-- Enable Row Level Security (RLS)
ALTER TABLE extracted_folders ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public access
CREATE POLICY "Allow public access to extracted_folders"
  ON extracted_folders
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Optional: Add a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_item_positions_updated_at
  BEFORE UPDATE ON item_positions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_desktop_positions_updated_at
  BEFORE UPDATE ON desktop_positions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_extracted_folders_updated_at
  BEFORE UPDATE ON extracted_folders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Table for storing widget positions on the desktop
CREATE TABLE IF NOT EXISTS widget_positions (
  id BIGSERIAL PRIMARY KEY,
  session_id TEXT NOT NULL,
  widget_id TEXT NOT NULL,
  x INTEGER NOT NULL,
  y INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(session_id, widget_id)
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_widget_positions_session_id ON widget_positions(session_id);

-- Enable Row Level Security (RLS)
ALTER TABLE widget_positions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public access
CREATE POLICY "Allow public access to widget_positions"
  ON widget_positions
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_widget_positions_updated_at
  BEFORE UPDATE ON widget_positions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Table for tracking last opened item per session (e.g., last Preview image)
CREATE TABLE IF NOT EXISTS last_opened (
  session_id TEXT NOT NULL,
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (session_id, key)
);

-- Enable Row Level Security (RLS)
ALTER TABLE last_opened ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public access
CREATE POLICY "Allow public access to last_opened"
  ON last_opened
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Trigger for automatic timestamp updates
CREATE TRIGGER update_last_opened_updated_at
  BEFORE UPDATE ON last_opened
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
