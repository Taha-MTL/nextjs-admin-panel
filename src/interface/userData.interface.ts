export default interface UserData {
  id: string;
  email: string;
  password: string;
  rememberMe: boolean;
  fullName: string | null;
  title: string | null;
  emailAddress: string | null;
  username: string | null;
  bio: string | null;
  photoURL: string | null;
}
