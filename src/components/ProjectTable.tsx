import { useState, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Share2, Printer, Plus, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useReactToPrint } from "react-to-print";

type Project = {
  id: string;
  projectName: string;
  description: string;
  date: string;
  totalCost: number;
  shahadotAmount: number;
  jonyAmount: number;
  shahadotStatus: string;
  jonyStatus: string;
};

const statusOptions = [
  { value: "payble", label: "Payable", color: "bg-green-500" },
  { value: "pending", label: "Pending", color: "bg-yellow-500" },
  { value: "reject", label: "Reject", color: "bg-red-500" },
  { value: "partial payment", label: "Partial Payment", color: "bg-orange-500" },
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      projectName: "Website Development",
      description: "Company website with e-commerce functionality",
      date: "2023-10-15",
      totalCost: 120000,
      shahadotAmount: 70000,
      jonyAmount: 50000,
      shahadotStatus: "payble",
      jonyStatus: "pending",
    },
    {
      id: "2",
      projectName: "Mobile App",
      description: "Cross-platform mobile application for iOS and Android",
      date: "2023-11-20",
      totalCost: 180000,
      shahadotAmount: 100000,
      jonyAmount: 80000,
      shahadotStatus: "partial payment",
      jonyStatus: "payble",
    },
  ]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  // Print functionality
  const handlePrint = useReactToPrint({
    content: () => tableRef.current,
    pageStyle: `
      @page { size: A4 landscape; margin: 10mm; }
      @media print {
        body { padding: 0; }
        .no-print { display: none !important; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 8px; }
        th { background-color: #f2f2f2; }
        .badge { color: white !important; }
      }
    `,
  });

  // Handle form submission
  const handleSubmit = (project: Project) => {
    if (project.id) {
      // Update existing project
      setProjects(projects.map(p => p.id === project.id ? project : p));
    } else {
      // Add new project
      setProjects([...projects, { ...project, id: Date.now().toString() }]);
    }
    setIsFormOpen(false);
    setCurrentProject(null);
  };

  // Handle delete confirmation
  const handleDeleteClick = (id: string) => {
    setProjectToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (projectToDelete) {
      setProjects(projects.filter(p => p.id !== projectToDelete));
    }
    setDeleteDialogOpen(false);
    setProjectToDelete(null);
  };

  // Handle share functionality
  const handleShare = async (project: Project) => {
    const shareData = {
      title: project.projectName,
      text: `Project Details:
      - Description: ${project.description}
      - Date: ${project.date}
      - Total Cost: ${project.totalCost}৳
      - Shahadot's Amount: ${project.shahadotAmount}৳
      - Jony's Amount: ${project.jonyAmount}৳`,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback for browsers without Web Share API
        await navigator.clipboard.writeText(shareData.text);
        alert("Project details copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = [
      "Project Name", "Description", "Date", "Total Cost", 
      "Shahadot's Amount", "Jony's Amount", 
      "Shahadot's Status", "Jony's Status", "Diu Total Taka"
    ];
    
    const csvContent = [
      headers.join(","),
      ...projects.map(project => [
        `"${project.projectName}"`,
        `"${project.description}"`,
        project.date,
        project.totalCost,
        project.shahadotAmount,
        project.jonyAmount,
        project.shahadotStatus,
        project.jonyStatus,
        (project.shahadotAmount - project.jonyAmount)
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `projects_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 mb-8 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Project Management</h1>
            <p className="opacity-90">Track and manage all your projects in one place</p>
          </div>
          <Button 
            onClick={() => { setCurrentProject(null); setIsFormOpen(true); }} 
            className="bg-white text-blue-600 hover:bg-gray-100"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Project
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Project List</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1">
              <Printer className="h-4 w-4" /> Print
            </Button>
            <Button variant="outline" size="sm" onClick={exportToCSV} className="gap-1">
              <Download className="h-4 w-4" /> CSV
            </Button>
          </div>
        </div>

        <div ref={tableRef} className="overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader className="bg-gray-50 dark:bg-gray-700">
              <TableRow>
                <TableHead className="font-semibold">Project</TableHead>
                <TableHead className="font-semibold">Description</TableHead>
                <TableHead className="font-semibold">Date</TableHead>
                <TableHead className="font-semibold">Total Cost</TableHead>
                <TableHead className="font-semibold">Shahadot</TableHead>
                <TableHead className="font-semibold">Jony</TableHead>
                <TableHead className="font-semibold">Shahadot Status</TableHead>
                <TableHead className="font-semibold">Jony Status</TableHead>
                <TableHead className="font-semibold">Diu Total</TableHead>
                <TableHead className="font-semibold no-print">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                    No projects found. Add your first project to get started.
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {projects.map(project => (
                    <TableRow key={project.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <TableCell className="font-medium">{project.projectName}</TableCell>
                      <TableCell>
                        <div className="max-w-xs max-h-20 overflow-y-auto">
                          {project.description}
                        </div>
                      </TableCell>
                      <TableCell>{project.date}</TableCell>
                      <TableCell className="font-medium">{project.totalCost.toLocaleString()}৳</TableCell>
                      <TableCell>{project.shahadotAmount.toLocaleString()}৳</TableCell>
                      <TableCell>{project.jonyAmount.toLocaleString()}৳</TableCell>
                      <TableCell>
                        <Badge className={
                          statusOptions.find(s => s.value === project.shahadotStatus)?.color + " text-white"
                        }>
                          {project.shahadotStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={
                          statusOptions.find(s => s.value === project.jonyStatus)?.color + " text-white"
                        }>
                          {project.jonyStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {(project.shahadotAmount - project.jonyAmount).toLocaleString()}৳
                      </TableCell>
                      <TableCell className="no-print">
                        <div className="flex gap-1">
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            onClick={() => { setCurrentProject(project); setIsFormOpen(true); }}
                            className="text-blue-600 hover:bg-blue-50"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            onClick={() => handleDeleteClick(project.id)}
                            className="text-red-600 hover:bg-red-50"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            onClick={() => handleShare(project)}
                            className="text-green-600 hover:bg-green-50"
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-gray-100 dark:bg-gray-700 font-semibold">
                    <TableCell colSpan={3} className="text-right">Total:</TableCell>
                    <TableCell>{projects.reduce((sum, p) => sum + p.totalCost, 0).toLocaleString()}৳</TableCell>
                    <TableCell>{projects.reduce((sum, p) => sum + p.shahadotAmount, 0).toLocaleString()}৳</TableCell>
                    <TableCell>{projects.reduce((sum, p) => sum + p.jonyAmount, 0).toLocaleString()}৳</TableCell>
                    <TableCell colSpan={4}></TableCell>
                  </TableRow>
                </>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Project Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  {currentProject ? "Edit Project" : "Add New Project"}
                </h2>
                <button 
                  onClick={() => setIsFormOpen(false)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const formData = new FormData(form);
                
                handleSubmit({
                  id: currentProject?.id || Date.now().toString(),
                  projectName: formData.get("projectName") as string,
                  description: formData.get("description") as string,
                  date: formData.get("date") as string,
                  totalCost: Number(formData.get("totalCost")),
                  shahadotAmount: Number(formData.get("shahadotAmount")),
                  jonyAmount: Number(formData.get("jonyAmount")),
                  shahadotStatus: formData.get("shahadotStatus") as string,
                  jonyStatus: formData.get("jonyStatus") as string,
                });
              }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="projectName">Project Name</Label>
                    <Input 
                      id="projectName" 
                      name="projectName" 
                      defaultValue={currentProject?.projectName} 
                      required 
                    />
                  </div>
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input 
                      type="date" 
                      id="date" 
                      name="date" 
                      defaultValue={currentProject?.date || new Date().toISOString().split("T")[0]} 
                      required 
                    />
                  </div>
                  <div>
                    <Label htmlFor="totalCost">Total Cost (৳)</Label>
                    <Input 
                      type="number" 
                      id="totalCost" 
                      name="totalCost" 
                      defaultValue={currentProject?.totalCost} 
                      required 
                    />
                  </div>
                  <div>
                    <Label htmlFor="shahadotAmount">Shahadot's Amount (৳)</Label>
                    <Input 
                      type="number" 
                      id="shahadotAmount" 
                      name="shahadotAmount" 
                      defaultValue={currentProject?.shahadotAmount} 
                      required 
                    />
                  </div>
                  <div>
                    <Label htmlFor="jonyAmount">Jony's Amount (৳)</Label>
                    <Input 
                      type="number" 
                      id="jonyAmount" 
                      name="jonyAmount" 
                      defaultValue={currentProject?.jonyAmount} 
                      required 
                    />
                  </div>
                  <div>
                    <Label htmlFor="shahadotStatus">Shahadot's Status</Label>
                    <Select 
                      name="shahadotStatus" 
                      defaultValue={currentProject?.shahadotStatus || "pending"}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="jonyStatus">Jony's Status</Label>
                    <Select 
                      name="jonyStatus" 
                      defaultValue={currentProject?.jonyStatus || "pending"}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="mb-4">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    name="description" 
                    defaultValue={currentProject?.description} 
                    rows={3} 
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {currentProject ? "Update" : "Create"} Project
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this project? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete} 
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Project
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}