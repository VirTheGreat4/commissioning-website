-- 1. Create Commissions Table
CREATE TABLE commissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_name TEXT NOT NULL,
    email TEXT NOT NULL,
    brief TEXT,
    tier TEXT DEFAULT 'Chibi',
    reference_urls TEXT[] DEFAULT '{}',
    status TEXT DEFAULT 'Pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Portfolio Table
CREATE TABLE portfolio (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    image_url TEXT NOT NULL,
    category TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create Storage Buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('references_private', 'references_private', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio_public', 'portfolio_public', true);
