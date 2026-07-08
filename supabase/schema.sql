-- Create ENUM for user roles
CREATE TYPE user_role AS ENUM ('admin', 'teacher', 'parent', 'student');

-- Create profiles table linked to auth.users
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  role user_role DEFAULT 'student',
  avatar_url TEXT,
  parent_id UUID REFERENCES public.profiles(id), -- For students to link to parents
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone."
  ON public.profiles FOR SELECT
  USING ( true );

CREATE POLICY "Users can insert their own profile."
  ON public.profiles FOR INSERT
  WITH CHECK ( auth.uid() = id );

CREATE POLICY "Users can update own profile."
  ON public.profiles FOR UPDATE
  USING ( auth.uid() = id );

-- Create courses table
CREATE TABLE public.courses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  learning_path TEXT, -- e.g., 'Explorer', 'Creator'
  age_group TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- Courses are viewable by everyone
CREATE POLICY "Courses are viewable by everyone."
  ON public.courses FOR SELECT
  USING ( true );

-- Only admins can modify courses
CREATE POLICY "Admins can insert courses."
  ON public.courses FOR INSERT
  WITH CHECK ( EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin') );

CREATE POLICY "Admins can update courses."
  ON public.courses FOR UPDATE
  USING ( EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin') );

-- Create user_progress table
CREATE TABLE public.user_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'enrolled', -- 'enrolled', 'in_progress', 'completed'
  progress_percentage INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(student_id, course_id)
);

ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- Progress view policies
CREATE POLICY "Students can view their own progress"
  ON public.user_progress FOR SELECT
  USING ( auth.uid() = student_id );

CREATE POLICY "Parents can view their children's progress"
  ON public.user_progress FOR SELECT
  USING ( EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = public.user_progress.student_id AND parent_id = auth.uid()
  ) );

CREATE POLICY "Teachers and Admins can view all progress"
  ON public.user_progress FOR SELECT
  USING ( EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND (role = 'admin' OR role = 'teacher')
  ) );

-- Trigger to automatically create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, role)
  VALUES (new.id, new.raw_user_meta_data->>'first_name', new.raw_user_meta_data->>'last_name', COALESCE((new.raw_user_meta_data->>'role')::user_role, 'student'::user_role));
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
