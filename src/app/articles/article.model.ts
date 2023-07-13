export interface Article {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  imagePath: File | string;
  creator: string;
  createdAt: Date;
  updatedAt: Date;
}
