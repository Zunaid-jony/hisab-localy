
import { useState, useEffect } from "react";
import ProjectForm from "@/components/ProjectForm";
import ProjectTable from "@/components/ProjectTable";
import { Project } from "@/types/project";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [projects, setProjects] = useState<Project[]>(() => {
    const savedProjects = localStorage.getItem("projects");
    return savedProjects ? JSON.parse(savedProjects) : [];
  });

  const [open, setOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>(undefined);

  useEffect(() => {
    localStorage.setItem("projects", JSON.stringify(projects));
  }, [projects]);

  const handleSubmit = (formData: FormData) => {
    const projectData = {
      projectName: formData.get("projectName") as string,
      description: formData.get("description") as string,
      date: formData.get("date") as string,
      submitDate: formData.get("submitDate") as string,
      totalCost: Number(formData.get("totalCost")),
      shahadotAmount: Number(formData.get("shahadotAmount")),
      jonyAmount: Number(formData.get("jonyAmount")),
      shahadotStatus: formData.get("shahadotStatus") as Project["shahadotStatus"],
      jonyStatus: formData.get("jonyStatus") as Project["jonyStatus"],
    };

    if (editingProject) {
      // Update existing project
      const updatedProjects = projects.map(p => 
        p.id === editingProject.id ? { ...projectData, id: editingProject.id } : p
      );
      setProjects(updatedProjects);
      toast({
        title: "Success",
        description: "Project updated successfully",
      });
      setEditingProject(undefined);
    } else {
      // Add new project
      const newProject: Project = {
        id: Date.now().toString(),
        ...projectData,
      };
      setProjects([...projects, newProject]);
      toast({
        title: "Success",
        description: "New project added successfully",
      });
    }
    
    setOpen(false);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    setProjects(projects.filter((p) => p.id !== id));
    toast({
      title: "Success",
      description: "Project deleted successfully",
    });
  };

  const handleShare = async (project: Project) => {
    const text = `
    Project Name: ${project.projectName}
    Description: ${project.description}
    Date: ${project.date}
    Total Cost: ${project.totalCost}
    Shahadot's Amount: ${project.shahadotAmount} (${project.shahadotStatus})
    Jony's Amount: ${project.jonyAmount} (${project.jonyStatus})
    `;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Project Details",
          text: text,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      navigator.clipboard.writeText(text);
      toast({
        title: "Copied",
        description: "Project details copied to clipboard",
      });
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="space-y-8">
       

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          {/* <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">All Projects</h2>
          </div> */}
          <div className="p-6">
            <ProjectTable
              projects={projects}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onShare={handleShare}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
