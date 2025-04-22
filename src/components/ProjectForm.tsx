
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Project } from "@/types/project";

const ProjectForm = ({
  onSubmit,
  editProject,
}: {
  onSubmit: (formData: FormData) => void;
  editProject?: Project;
}) => {
  const [project, setProject] = useState<Partial<Project>>({});

  useEffect(() => {
    if (editProject) {
      setProject(editProject);
    }
  }, [editProject]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="projectName">Project Name</Label>
          <Input 
            id="projectName" 
            name="projectName" 
            defaultValue={project.projectName || ""} 
            required 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea 
            id="description" 
            name="description"
            defaultValue={project.description || ""} 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input 
            id="date" 
            name="date" 
            type="date" 
            defaultValue={project.date || ""} 
            required 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="submitDate">Submission Date</Label>
          <Input 
            id="submitDate" 
            name="submitDate" 
            type="date" 
            defaultValue={project.submitDate || ""} 
            required 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="totalCost">Total Cost</Label>
          <Input 
            id="totalCost" 
            name="totalCost" 
            type="number" 
            defaultValue={project.totalCost || ""} 
            required 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="shahadotAmount">Shahadot's Amount</Label>
          <Input 
            id="shahadotAmount" 
            name="shahadotAmount" 
            type="number" 
            defaultValue={project.shahadotAmount || ""} 
            required 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="jonyAmount">Jony's Amount</Label>
          <Input 
            id="jonyAmount" 
            name="jonyAmount" 
            type="number" 
            defaultValue={project.jonyAmount || ""} 
            required 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="shahadotStatus">Shahadot's Status</Label>
          <Select name="shahadotStatus" defaultValue={project.shahadotStatus || ""} required>
            <SelectTrigger>
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="payble">Payable</SelectItem>
              <SelectItem value="reject">Rejected</SelectItem>
              <SelectItem value="partial payment">Partial Payment</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="jonyStatus">Jony's Status</Label>
          <Select name="jonyStatus" defaultValue={project.jonyStatus || ""} required>
            <SelectTrigger>
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="payble">Payable</SelectItem>
              <SelectItem value="reject">Rejected</SelectItem>
              <SelectItem value="partial payment">Partial Payment</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button type="submit" className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700">
        {editProject ? "Update Project" : "Save Project"}
      </Button>
    </form>
  );
};

export default ProjectForm;
