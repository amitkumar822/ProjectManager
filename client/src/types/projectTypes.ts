export interface Project {
  _id: string;
  title: string;
  description: string;
  status: "active" | "completed";
  user: string;
  createdAt: string;
  updatedAt: string;
}
