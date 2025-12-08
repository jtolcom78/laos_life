-- Insert Sample Banners
-- Run this in your database SQL editor (e.g. Supabase Dashboard -> SQL Editor)

INSERT INTO "banner" ("title", "images", "linkUrl", "isActive", "sortOrder", "created_at", "updated_at")
VALUES 
(
  'Welcome to Laos Life', 
  '{"lo": "https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?q=80&w=2070&auto=format&fit=crop", "en": "https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?q=80&w=2070&auto=format&fit=crop"}', 
  'https://laoslife.com', 
  true, 
  1, 
  NOW(), 
  NOW()
),
(
  'Find Your Dream Home', 
  '{"lo": "https://images.unsplash.com/photo-1600596542815-e32c21423c36?q=80&w=2075&auto=format&fit=crop", "en": "https://images.unsplash.com/photo-1600596542815-e32c21423c36?q=80&w=2075&auto=format&fit=crop"}', 
  'https://laoslife.com/real-estate', 
  true, 
  2, 
  NOW(), 
  NOW()
),
(
  'Hiring: Senior Developers', 
  '{"lo": "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop", "en": "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop"}', 
  'https://laoslife.com/jobs', 
  true, 
  3, 
  NOW(), 
  NOW()
);
