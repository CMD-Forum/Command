-- Written by ChatGPT, no way I could do this.

-- Create the function to update the tsvector column
CREATE OR REPLACE FUNCTION update_search_idx()
RETURNS TRIGGER AS $$
BEGIN
  -- Ensure we are referencing the correct columns of the table
  NEW."searchIdx" := to_tsvector(
    'english',
    COALESCE(NEW."title", '') || ' ' ||
    COALESCE(NEW."content", '') || ' ' ||
    COALESCE(NEW."href", '') || ' ' ||
    COALESCE(NEW."imagealt", '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger for the Post table
CREATE TRIGGER update_search_idx_trigger
BEFORE INSERT OR UPDATE ON "Post"
FOR EACH ROW
EXECUTE FUNCTION update_search_idx();

-- Add searchIdx column to the Community table allowing NULL initially
ALTER TABLE "Community" ADD COLUMN "searchIdx" tsvector;

-- Add searchIdx column to the Post table allowing NULL initially
ALTER TABLE "Post" ADD COLUMN "searchIdx" tsvector;

-- Add searchIdx column to the User table allowing NULL initially
ALTER TABLE "User" ADD COLUMN "searchIdx" tsvector;

-- Create the trigger for the Community table to update searchIdx
CREATE TRIGGER update_community_search_idx
BEFORE INSERT OR UPDATE ON "Community"
FOR EACH ROW
EXECUTE FUNCTION update_search_idx();

-- Create the trigger for the User table to update searchIdx
CREATE TRIGGER update_user_search_idx
BEFORE INSERT OR UPDATE ON "User"
FOR EACH ROW
EXECUTE FUNCTION update_search_idx();

-- Populate searchIdx for Post table
UPDATE "Post"
SET "searchIdx" = to_tsvector(
  'english', 
  COALESCE("title", '') || ' ' || 
  COALESCE("content", '') || ' ' || 
  COALESCE("href", '') || ' ' || 
  COALESCE("imagealt", '')
);

-- Populate searchIdx for Community table
UPDATE "Community"
SET "searchIdx" = to_tsvector(
  'english', 
  COALESCE("name", '') || ' ' || 
  COALESCE("display_name", '') || ' ' || 
  COALESCE("description", '')
);

-- Populate searchIdx for User table
UPDATE "User"
SET "searchIdx" = to_tsvector(
  'english', 
  COALESCE("username", '')
);

-- Ensure no NULL values in searchIdx before making it NOT NULL
-- Populate any NULL values with empty `tsvector` for consistency
UPDATE "Post" SET "searchIdx" = COALESCE("searchIdx", to_tsvector('english', ''));
UPDATE "Community" SET "searchIdx" = COALESCE("searchIdx", to_tsvector('english', ''));
UPDATE "User" SET "searchIdx" = COALESCE("searchIdx", to_tsvector('english', ''));

-- Make the searchIdx column in Post NOT NULL
ALTER TABLE "Post" ALTER COLUMN "searchIdx" SET NOT NULL;

-- Make the searchIdx column in Community NOT NULL
ALTER TABLE "Community" ALTER COLUMN "searchIdx" SET NOT NULL;

-- Make the searchIdx column in User NOT NULL
ALTER TABLE "User" ALTER COLUMN "searchIdx" SET NOT NULL;