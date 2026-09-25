-- Seed services
INSERT INTO services (name, description, duration, price) VALUES
('Swedish Massage', 'A gentle full-body massage to relax and rejuvenate.', 60, 55.00),
('Deep Tissue Massage', 'Targets deep muscle layers to relieve chronic tension.', 60, 70.00),
('Hot Stone Massage', 'Warm stones combined with massage for deep relaxation.', 75, 85.00),
('Aromatherapy Massage', 'Massage using essential oils to enhance relaxation.', 60, 65.00),
('Facial Treatment', 'Cleansing and rejuvenating facial for glowing skin.', 45, 50.00),
('Body Scrub', 'Full-body exfoliation to remove dead skin and refresh.', 45, 60.00);

-- Seed admin user
-- Password for this account is: admin123
INSERT INTO users (name, email, password, role) VALUES
('Admin User', 'admin@spabooking.com', '$2b$10$hbJ2CFmBE7SuBrIIvkXbv./ism5S/ReIS12y/Rqfyiw6ksk28vzbC', 'admin');