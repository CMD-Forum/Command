-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_search_idx_trigger ON "Post";
DROP TRIGGER IF EXISTS update_community_search_idx ON "Community";
DROP TRIGGER IF EXISTS update_user_search_idx ON "User";

-- Drop the existing function if it exists
DROP FUNCTION IF EXISTS public.update_search_idx();

-- Drop existing searchIdx columns if they exist
ALTER TABLE "Community" DROP COLUMN IF EXISTS "searchIdx";
ALTER TABLE "Post" DROP COLUMN IF EXISTS "searchIdx";
ALTER TABLE "User" DROP COLUMN IF EXISTS "searchIdx";

-- Add searchIdx columns
ALTER TABLE "Community" ADD COLUMN "searchIdx" tsvector;
ALTER TABLE "Post" ADD COLUMN "searchIdx" tsvector;
ALTER TABLE "User" ADD COLUMN "searchIdx" tsvector;

-- Create the function to update the tsvector column
CREATE FUNCTION public.update_search_idx()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_TABLE_NAME = 'Post' THEN
        NEW."searchIdx" := to_tsvector(
            'english',
            COALESCE(NEW."title", '') || ' ' ||
            COALESCE(NEW."content", '') || ' ' ||
            COALESCE(NEW."imagealt", '')
        );
    ELSIF TG_TABLE_NAME = 'Community' THEN
        NEW."searchIdx" := to_tsvector(
            'english',
            COALESCE(NEW."name", '') || ' ' ||
            COALESCE(NEW."display_name", '') || ' ' ||
            COALESCE(NEW."description", '')
        );
    ELSIF TG_TABLE_NAME = 'User' THEN
        NEW."searchIdx" := to_tsvector(
            'english',
            COALESCE(NEW."username", '')
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER update_search_idx_trigger
BEFORE INSERT OR UPDATE ON "Post"
FOR EACH ROW
EXECUTE FUNCTION public.update_search_idx();

CREATE TRIGGER update_community_search_idx
BEFORE INSERT OR UPDATE ON "Community"
FOR EACH ROW
EXECUTE FUNCTION public.update_search_idx();

CREATE TRIGGER update_user_search_idx
BEFORE INSERT OR UPDATE ON "User"
FOR EACH ROW
EXECUTE FUNCTION public.update_search_idx();

-- Populate searchIdx columns
UPDATE "Post" SET "searchIdx" = to_tsvector(
    'english', 
    COALESCE("title", '') || ' ' || 
    COALESCE("content", '') || ' ' || 
    COALESCE("imagealt", '')
);
UPDATE "Community" SET "searchIdx" = to_tsvector(
    'english', 
    COALESCE("name", '') || ' ' || 
    COALESCE("display_name", '') || ' ' || 
    COALESCE("description", '')
);
UPDATE "User" SET "searchIdx" = to_tsvector(
    'english', 
    COALESCE("username", '')
);

-- Set NOT NULL constraints
ALTER TABLE "Post" ALTER COLUMN "searchIdx" SET NOT NULL;
ALTER TABLE "Community" ALTER COLUMN "searchIdx" SET NOT NULL;
ALTER TABLE "User" ALTER COLUMN "searchIdx" SET NOT NULL;
