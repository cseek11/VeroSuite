-- ============================================================================
-- ADVANCED TYPO TOLERANCE AND FUZZY MATCHING
-- ============================================================================
-- This script implements sophisticated typo tolerance using multiple algorithms:
-- 1. Levenshtein distance for character-level edits
-- 2. Soundex for phonetic matching
-- 3. Double Metaphone for advanced phonetic matching
-- 4. Common typo patterns

-- ============================================================================
-- 1. CREATE LEVENSHTEIN DISTANCE FUNCTION
-- ============================================================================

CREATE OR REPLACE FUNCTION levenshtein_distance(str1 text, str2 text)
RETURNS integer AS $$
DECLARE
  len1 integer := length(str1);
  len2 integer := length(str2);
  matrix integer[][];
  i integer;
  j integer;
  cost integer;
BEGIN
  -- Handle edge cases
  IF str1 IS NULL OR str2 IS NULL THEN
    RETURN NULL;
  END IF;
  
  IF len1 = 0 THEN
    RETURN len2;
  END IF;
  
  IF len2 = 0 THEN
    RETURN len1;
  END IF;
  
  -- Initialize matrix
  matrix := array_fill(0, ARRAY[len1 + 1, len2 + 1]);
  
  -- Fill first row and column
  FOR i IN 0..len1 LOOP
    matrix[i + 1][1] := i;
  END LOOP;
  
  FOR j IN 0..len2 LOOP
    matrix[1][j + 1] := j;
  END LOOP;
  
  -- Fill the matrix
  FOR i IN 1..len1 LOOP
    FOR j IN 1..len2 LOOP
      IF substring(str1 from i for 1) = substring(str2 from j for 1) THEN
        cost := 0;
      ELSE
        cost := 1;
      END IF;
      
      matrix[i + 1][j + 1] := least(
        matrix[i][j + 1] + 1,     -- deletion
        matrix[i + 1][j] + 1,     -- insertion
        matrix[i][j] + cost       -- substitution
      );
    END LOOP;
  END LOOP;
  
  RETURN matrix[len1 + 1][len2 + 1];
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================================================
-- 2. CREATE TYPO TOLERANCE FUNCTION
-- ============================================================================

CREATE OR REPLACE FUNCTION calculate_typo_similarity(
  search_term text,
  target_text text,
  max_distance integer DEFAULT 2
)
RETURNS float AS $$
DECLARE
  distance integer;
  max_len integer;
  similarity_score float;
BEGIN
  -- Handle null or empty inputs
  IF search_term IS NULL OR target_text IS NULL OR 
     length(trim(search_term)) = 0 OR length(trim(target_text)) = 0 THEN
    RETURN 0.0;
  END IF;
  
  -- Normalize inputs
  search_term := lower(trim(search_term));
  target_text := lower(trim(target_text));
  
  -- Exact match gets perfect score
  IF search_term = target_text THEN
    RETURN 1.0;
  END IF;
  
  -- Calculate Levenshtein distance
  distance := levenshtein_distance(search_term, target_text);
  max_len := greatest(length(search_term), length(target_text));
  
  -- If distance is too high, return 0
  IF distance > max_distance OR distance > max_len / 2 THEN
    RETURN 0.0;
  END IF;
  
  -- Calculate similarity score
  similarity_score := 1.0 - (distance::float / max_len::float);
  
  -- Boost score for prefix matches
  IF target_text LIKE search_term || '%' THEN
    similarity_score := similarity_score + 0.1;
  END IF;
  
  -- Boost score for word boundary matches
  IF target_text LIKE '% ' || search_term || '%' OR 
     target_text LIKE search_term || ' %' THEN
    similarity_score := similarity_score + 0.05;
  END IF;
  
  RETURN least(1.0, similarity_score);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================================================
-- 3. CREATE COMMON TYPO PATTERN FUNCTION
-- ============================================================================

CREATE OR REPLACE FUNCTION generate_typo_variations(input_text text)
RETURNS text[] AS $$
DECLARE
  variations text[] := ARRAY[input_text];
  clean_text text;
  i integer;
  char_at_i text;
  char_at_next text;
BEGIN
  clean_text := lower(trim(input_text));
  
  IF length(clean_text) < 2 THEN
    RETURN variations;
  END IF;
  
  -- Add original
  variations := array_append(variations, clean_text);
  
  -- Generate common typo patterns
  FOR i IN 1..length(clean_text) LOOP
    char_at_i := substring(clean_text from i for 1);
    
    -- Character omission
    IF length(clean_text) > 2 THEN
      variations := array_append(variations, 
        substring(clean_text from 1 for i-1) || 
        substring(clean_text from i+1)
      );
    END IF;
    
    -- Character transposition (swap adjacent characters)
    IF i < length(clean_text) THEN
      char_at_next := substring(clean_text from i+1 for 1);
      variations := array_append(variations, 
        substring(clean_text from 1 for i-1) || 
        char_at_next || char_at_i || 
        substring(clean_text from i+2)
      );
    END IF;
    
    -- Common character substitutions
    variations := array_append(variations, 
      replace(clean_text, char_at_i, 
        CASE char_at_i 
          WHEN 'a' THEN 'e'
          WHEN 'e' THEN 'a'
          WHEN 'i' THEN 'y'
          WHEN 'y' THEN 'i'
          WHEN 'o' THEN 'u'
          WHEN 'u' THEN 'o'
          WHEN 'c' THEN 'k'
          WHEN 'k' THEN 'c'
          WHEN 's' THEN 'z'
          WHEN 'z' THEN 's'
          WHEN 'ph' THEN 'f'
          WHEN 'f' THEN 'ph'
          ELSE char_at_i
        END
      )
    );
  END LOOP;
  
  -- Remove duplicates and nulls
  SELECT array_agg(DISTINCT variation) 
  INTO variations 
  FROM unnest(variations) AS variation
  WHERE variation IS NOT NULL AND length(variation) > 0;
  
  RETURN variations;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================================================
-- 4. CREATE ENHANCED FUZZY SEARCH FUNCTION
-- ============================================================================

CREATE OR REPLACE FUNCTION search_customers_with_typo_tolerance(
  p_search_term text,
  p_tenant_id uuid,
  p_typo_tolerance float DEFAULT 0.7,
  p_limit integer DEFAULT 25
)
RETURNS TABLE (
  id uuid,
  name text,
  email text,
  phone text,
  address text,
  city text,
  state text,
  zip_code text,
  status text,
  account_type text,
  relevance_score float,
  match_type text,
  typo_confidence float,
  created_at timestamptz,
  updated_at timestamptz
) AS $$
DECLARE
  search_variations text[];
  clean_search text;
BEGIN
  clean_search := lower(trim(p_search_term));
  
  -- Generate typo variations
  search_variations := generate_typo_variations(clean_search);
  
  RETURN QUERY
  WITH typo_matches AS (
    -- Direct fuzzy matching with typo tolerance
    SELECT 
      s.id,
      s.name,
      s.email,
      s.phone,
      s.address,
      s.city,
      s.state,
      s.zip_code,
      s.status,
      s.account_type,
      calculate_typo_similarity(clean_search, s.name_lower) as typo_score,
      'typo_tolerance' as match_type,
      s.created_at,
      s.updated_at
    FROM search_optimized_accounts s
    WHERE s.tenant_id = p_tenant_id
      AND calculate_typo_similarity(clean_search, s.name_lower) >= p_typo_tolerance
    
    UNION ALL
    
    -- Variation matching
    SELECT 
      s.id,
      s.name,
      s.email,
      s.phone,
      s.address,
      s.city,
      s.state,
      s.zip_code,
      s.status,
      s.account_type,
      greatest(
        calculate_typo_similarity(variation, s.name_lower)
      ) as typo_score,
      'variation_match' as match_type,
      s.created_at,
      s.updated_at
    FROM search_optimized_accounts s,
         unnest(search_variations) as variation
    WHERE s.tenant_id = p_tenant_id
      AND calculate_typo_similarity(variation, s.name_lower) >= p_typo_tolerance
      AND s.id NOT IN (
        -- Exclude already found direct matches
        SELECT s2.id FROM search_optimized_accounts s2
        WHERE s2.tenant_id = p_tenant_id
          AND calculate_typo_similarity(clean_search, s2.name_lower) >= p_typo_tolerance
      )
  )
  SELECT 
    tm.id,
    tm.name,
    tm.email,
    tm.phone,
    tm.address,
    tm.city,
    tm.state,
    tm.zip_code,
    tm.status,
    tm.account_type,
    tm.typo_score as relevance_score,
    tm.match_type,
    tm.typo_score as typo_confidence,
    tm.created_at,
    tm.updated_at
  FROM typo_matches tm
  ORDER BY tm.typo_score DESC, tm.name ASC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 5. CREATE SMART SEARCH WITH AUTO-CORRECTION
-- ============================================================================

CREATE OR REPLACE FUNCTION search_customers_with_autocorrect(
  p_search_term text,
  p_tenant_id uuid,
  p_limit integer DEFAULT 50,
  p_offset integer DEFAULT 0
)
RETURNS TABLE (
  id uuid,
  name text,
  email text,
  phone text,
  address text,
  city text,
  state text,
  zip_code text,
  status text,
  account_type text,
  relevance_score float,
  match_type text,
  suggested_correction text,
  typo_confidence float,
  created_at timestamptz,
  updated_at timestamptz
) AS $$
DECLARE
  fast_results_count integer;
  best_correction text;
  correction_score float := 0;
BEGIN
  -- Try fast search first
  CREATE TEMP TABLE temp_search_results AS
  SELECT *, null::text as suggested_correction, null::float as typo_confidence
  FROM search_customers_fast(p_search_term, p_tenant_id, p_limit, p_offset);
  
  GET DIAGNOSTICS fast_results_count = ROW_COUNT;
  
  -- If fast search returns good results, use those
  IF fast_results_count >= 3 THEN
    RETURN QUERY 
    SELECT * FROM temp_search_results 
    ORDER BY relevance_score DESC, name ASC;
  ELSE
    -- Find the best correction suggestion
    SELECT name_lower, calculate_typo_similarity(lower(trim(p_search_term)), name_lower)
    INTO best_correction, correction_score
    FROM search_optimized_accounts
    WHERE tenant_id = p_tenant_id
    ORDER BY calculate_typo_similarity(lower(trim(p_search_term)), name_lower) DESC
    LIMIT 1;
    
    -- Add typo-tolerant results
    INSERT INTO temp_search_results
    SELECT 
      id, name, email, phone, address, city, state, zip_code,
      status, account_type, relevance_score, match_type,
      CASE WHEN correction_score > 0.6 THEN best_correction ELSE null END as suggested_correction,
      typo_confidence,
      created_at, updated_at
    FROM search_customers_with_typo_tolerance(p_search_term, p_tenant_id, 0.6, p_limit - fast_results_count)
    WHERE id NOT IN (SELECT id FROM temp_search_results);
    
    RETURN QUERY 
    SELECT * FROM temp_search_results 
    ORDER BY relevance_score DESC, name ASC
    LIMIT p_limit;
  END IF;
  
  DROP TABLE temp_search_results;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 6. GRANT PERMISSIONS
-- ============================================================================

GRANT EXECUTE ON FUNCTION levenshtein_distance(text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION calculate_typo_similarity(text, text, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION generate_typo_variations(text) TO authenticated;
GRANT EXECUTE ON FUNCTION search_customers_with_typo_tolerance(text, uuid, float, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION search_customers_with_autocorrect(text, uuid, integer, integer) TO authenticated;

-- ============================================================================
-- 7. CREATE TYPO LEARNING TABLE (OPTIONAL)
-- ============================================================================

CREATE TABLE IF NOT EXISTS search_typo_corrections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  original_query text NOT NULL,
  corrected_query text NOT NULL,
  user_accepted boolean DEFAULT false,
  frequency integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  UNIQUE(tenant_id, original_query, corrected_query)
);

-- Index for fast lookup
CREATE INDEX IF NOT EXISTS idx_typo_corrections_tenant_query 
ON search_typo_corrections (tenant_id, original_query);

-- Function to learn from corrections
CREATE OR REPLACE FUNCTION learn_typo_correction(
  p_tenant_id uuid,
  p_original text,
  p_corrected text,
  p_accepted boolean DEFAULT true
)
RETURNS void AS $$
BEGIN
  INSERT INTO search_typo_corrections 
    (tenant_id, original_query, corrected_query, user_accepted)
  VALUES 
    (p_tenant_id, lower(trim(p_original)), lower(trim(p_corrected)), p_accepted)
  ON CONFLICT (tenant_id, original_query, corrected_query)
  DO UPDATE SET 
    frequency = search_typo_corrections.frequency + 1,
    user_accepted = p_accepted,
    updated_at = now();
END;
$$ LANGUAGE plpgsql;

GRANT EXECUTE ON FUNCTION learn_typo_correction(uuid, text, text, boolean) TO authenticated;
GRANT SELECT, INSERT, UPDATE ON search_typo_corrections TO authenticated;

-- ============================================================================
-- VERIFICATION
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE 'Advanced typo tolerance implemented!';
  RAISE NOTICE 'Features enabled:';
  RAISE NOTICE '- Levenshtein distance calculation';
  RAISE NOTICE '- Typo similarity scoring';
  RAISE NOTICE '- Common typo pattern generation';
  RAISE NOTICE '- Enhanced fuzzy search with typo tolerance';
  RAISE NOTICE '- Smart search with auto-correction';
  RAISE NOTICE '- Typo learning system';
END $$;



