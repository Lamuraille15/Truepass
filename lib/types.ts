export type Profile = {
  id: string;
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  username: string;
  job_title: string | null;
  bio: string | null;
  location: string | null;
  photo_url: string | null;
  phone: string | null;
  website: string | null;
  linkedin: string | null;
  github: string | null;
  updated_at: string | null;
};

export type Skill = { id: string; profile_id: string; skill: string };
export type Experience = {
  id: string;
  profile_id: string;
  position: string;
  company: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
};
export type Education = {
  id: string;
  profile_id: string;
  school: string;
  degree: string;
  year: string | null;
};
export type Project = {
  id: string;
  profile_id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  url: string | null;
};

export type Review = {
  id: string;
  profile_id: string;
  author: string;
  content: string;
  rating: number;
  created_at?: string;
};

export type PublicProfile = Profile & {
  skills: Skill[];
  experiences: Experience[];
  education: Education[];
  projects: Project[];
  reviews: Review[];          // 👈 la ligne manquante
};

export type TrustLinkConfig = {
  id: string;
  user_id: string;
  username: string;
  expires_in_days: number;
  password_protected: boolean;
  show_info: boolean;
  show_skills: boolean;
  show_projects: boolean;
  show_experiences: boolean;
  show_documents: boolean;
  show_testimonials: boolean;
};
