export interface Article {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  imagePath: File | string;
  createdAt: Date;
  updatedAt: Date;
}
