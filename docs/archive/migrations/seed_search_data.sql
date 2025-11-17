-- Seed initial data for search suggestions to work immediately
-- Run this after installing the get_search_suggestions function and fixing tenant constraints

-- Insert some popular searches (system-wide)
-- Using query_text column based on your table structure
INSERT INTO popular_searches (query_text, search_count, last_searched_at, tenant_id) VALUES
('john smith', 15, NOW() - INTERVAL '1 day', NULL),
('pest control', 25, NOW() - INTERVAL '2 hours', NULL),
('termite treatment', 18, NOW() - INTERVAL '6 hours', NULL),
('bed bug removal', 22, NOW() - INTERVAL '12 hours', NULL),
('roach control', 12, NOW() - INTERVAL '1 day', NULL),
('spider treatment', 8, NOW() - INTERVAL '3 days', NULL),
('ant control', 20, NOW() - INTERVAL '4 hours', NULL),
('mice removal', 16, NOW() - INTERVAL '8 hours', NULL),
('rat control', 14, NOW() - INTERVAL '1 day', NULL),
('wasp nest removal', 10, NOW() - INTERVAL '2 days', NULL);

-- Insert some search logs (recent searches - system-wide)
INSERT INTO search_logs (query, success, tenant_id, created_at) VALUES
('john smith pest control', true, NULL, NOW() - INTERVAL '1 hour'),
('termite inspection', true, NULL, NOW() - INTERVAL '2 hours'),
('bed bug treatment cost', true, NULL, NOW() - INTERVAL '3 hours'),
('roach extermination', true, NULL, NOW() - INTERVAL '4 hours'),
('spider control methods', true, NULL, NOW() - INTERVAL '5 hours'),
('ant bait stations', true, NULL, NOW() - INTERVAL '6 hours'),
('mice prevention tips', true, NULL, NOW() - INTERVAL '7 hours'),
('rat poison alternatives', true, NULL, NOW() - INTERVAL '8 hours'),
('wasp spray safety', true, NULL, NOW() - INTERVAL '9 hours'),
('pest control near me', true, NULL, NOW() - INTERVAL '10 hours');

-- Insert some search trends (seasonal queries - system-wide)
INSERT INTO search_trends (query_term, season_name, trend_score, tenant_id) VALUES
('spring pest control', 'Spring', 0.85, NULL),
('summer ant control', 'Summer', 0.92, NULL),
('fall rodent control', 'Fall', 0.78, NULL),
('winter pest prevention', 'Winter', 0.65, NULL),
('termite swarming season', 'Spring', 0.88, NULL),
('mosquito control summer', 'Summer', 0.95, NULL),
('spider season fall', 'Fall', 0.82, NULL),
('winter pest hibernation', 'Winter', 0.70, NULL);

-- Insert some search suggestions analytics (AI-curated suggestions - system-wide)
INSERT INTO search_suggestions_analytics (suggestion, confidence_score, usage_count, tenant_id) VALUES
('eco-friendly pest control', 0.92, 45, NULL),
('pet-safe pest control', 0.89, 38, NULL),
('organic pest control methods', 0.87, 42, NULL),
('pest control for restaurants', 0.85, 35, NULL),
('pest control for schools', 0.83, 28, NULL),
('pest control for hospitals', 0.81, 22, NULL),
('pest control for warehouses', 0.79, 19, NULL),
('pest control for hotels', 0.77, 16, NULL);

-- Test the function to verify it's working
SELECT 'Testing suggestions function...' as status;

-- Test with various inputs
SELECT 'Testing "john" suggestions:' as test_case;
SELECT * FROM get_search_suggestions('john', 5);

SELECT 'Testing "pest" suggestions:' as test_case;
SELECT * FROM get_search_suggestions('pest', 5);

SELECT 'Testing "control" suggestions:' as test_case;
SELECT * FROM get_search_suggestions('control', 5);

-- Verify the data was inserted
SELECT 'Verifying data insertion:' as status;
SELECT 'popular_searches count:' as table_name, COUNT(*) as record_count FROM popular_searches;
SELECT 'search_logs count:' as table_name, COUNT(*) as record_count FROM search_logs;
SELECT 'search_trends count:' as table_name, COUNT(*) as record_count FROM search_trends;
SELECT 'search_suggestions_analytics count:' as table_name, COUNT(*) as record_count FROM search_suggestions_analytics;
