
export type ProjectStatus = "pending" | "payble" | "reject" | "partial payment";

export interface Project {
  id: string;
  projectName: string;
  description: string;
  date: string;
  submitDate: string;
  totalCost: number;
  shahadotAmount: number;
  jonyAmount: number;
  shahadotStatus: ProjectStatus;
  jonyStatus: ProjectStatus;
}
