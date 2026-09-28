-- ============================================================
-- Sabaody & Grand Line Lost & Found — PostgreSQL Schema (Supabase)
-- ============================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Reports Table (Lost and Found items)
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type VARCHAR(10) NOT NULL CHECK (type IN ('LOST', 'FOUND')),
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  location_name VARCHAR(255) NOT NULL,
  grove_number INT NOT NULL DEFAULT 41 CHECK (grove_number BETWEEN 1 AND 79),
  incident_date DATE NOT NULL DEFAULT CURRENT_DATE,
  image_url TEXT DEFAULT '',
  contact_info VARCHAR(255) DEFAULT '',
  reward VARCHAR(100) DEFAULT '',
  status VARCHAR(30) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'POTENTIAL_MATCH', 'CLAIM_PENDING', 'RECOVERED')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for category-scoped matching and fast querying
CREATE INDEX IF NOT EXISTS idx_reports_category_type ON reports (category, type, status);
CREATE INDEX IF NOT EXISTS idx_reports_created ON reports (created_at DESC);

-- 3. Claims Table
CREATE TABLE IF NOT EXISTS claims (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_id UUID REFERENCES reports(id) ON DELETE CASCADE,
  claimant_name VARCHAR(255) NOT NULL,
  claimant_contact VARCHAR(255) NOT NULL,
  proof_description TEXT NOT NULL,
  proof_image_url TEXT DEFAULT '',
  status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
  admin_notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable Row Level Security (RLS) with Public Read/Insert for Hackathon
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on reports" ON reports FOR SELECT USING (true);
CREATE POLICY "Allow public insert on reports" ON reports FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on reports" ON reports FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on reports" ON reports FOR DELETE USING (true);

CREATE POLICY "Allow public read on claims" ON claims FOR SELECT USING (true);
CREATE POLICY "Allow public insert on claims" ON claims FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on claims" ON claims FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on claims" ON claims FOR DELETE USING (true);

-- 5. Storage Bucket for Treasure & Proof Images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('treasure-images', 'treasure-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: Allow public access to view and upload images
CREATE POLICY "Public Read Access on treasure-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'treasure-images');

CREATE POLICY "Public Upload Access on treasure-images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'treasure-images');

CREATE POLICY "Public Update Access on treasure-images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'treasure-images');

