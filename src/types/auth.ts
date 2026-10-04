export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
  targetExam: string;
  isPro: boolean;
  streakDays: number;
  testsGiven: number;
  createdAt: string;
}
