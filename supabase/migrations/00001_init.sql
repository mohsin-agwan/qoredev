-- Enable the pgvector extension for vector similarity search
CREATE EXTENSION IF NOT EXISTS vector;

-- Profiles table: one row per authenticated user
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  email       TEXT,
  full_name   TEXT,
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Automatically create a profile row when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Documents table: stores text chunks with vector embeddings (1536 dims for OpenAI embedding models)
CREATE TABLE IF NOT EXISTS public.documents (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  title       TEXT,
  content     TEXT NOT NULL,
  embedding   vector(1536),
  metadata    JSONB DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own documents"
  ON public.documents FOR ALL
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS documents_embedding_idx
  ON public.documents
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- Vector similarity search: returns documents ordered by cosine distance
CREATE OR REPLACE FUNCTION public.match_documents(
  query_embedding vector(1536),
  match_threshold FLOAT DEFAULT 0.78,
  match_count     INT   DEFAULT 10
)
RETURNS TABLE (
  id         UUID,
  user_id    UUID,
  title      TEXT,
  content    TEXT,
  metadata   JSONB,
  similarity FLOAT
)
LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT
    d.id,
    d.user_id,
    d.title,
    d.content,
    d.metadata,
    1 - (d.embedding <=> query_embedding) AS similarity
  FROM public.documents d
  WHERE 1 - (d.embedding <=> query_embedding) > match_threshold
    AND d.user_id = auth.uid()
  ORDER BY d.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
