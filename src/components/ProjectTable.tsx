import { useState, useRef, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Edit,
  Trash,
  Share2,
  Printer,
  Plus,
  Download,
  Mail,
  ChevronDown,
} from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  {
    value: "partial payment",
    label: "Partial Payment",
    color: "bg-orange-500",
  },
];

const STORAGE_KEY = "projectsData";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(() => {
    // Load data from localStorage if available
    if (typeof window !== "undefined") {
      const savedData = localStorage.getItem(STORAGE_KEY);
      return savedData ? JSON.parse(savedData) : [];
    }
    return [];
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [projectToShare, setProjectToShare] = useState<Project | null>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  // Save to localStorage whenever projects change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    }
  }, [projects]);

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
      setProjects((prevProjects) =>
        prevProjects.map((p) => (p.id === project.id ? project : p))
      );
    } else {
      const newProject = {
        ...project,
        id: Date.now().toString(),
      };
      setProjects((prevProjects) => [...prevProjects, newProject]);
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
      setProjects((prevProjects) =>
        prevProjects.filter((p) => p.id !== projectToDelete)
      );
    }
    setDeleteDialogOpen(false);
    setProjectToDelete(null);
  };

  // Handle share click
  const handleShareClick = (project: Project) => {
    setProjectToShare(project);
    setShareDialogOpen(true);
  };

  // Update status
  const updateStatus = (
    id: string,
    field: "shahadotStatus" | "jonyStatus",
    value: string
  ) => {
    setProjects((prevProjects) =>
      prevProjects.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  // Share via Web Share API or clipboard
  const handleShare = async () => {
    if (!projectToShare) return;

    const shareData = {
      title: projectToShare.projectName,
      text: `Project Details:
- Description: ${projectToShare.description}
- Date: ${projectToShare.date}
- Total Cost: ${projectToShare.totalCost}৳
- Shahadot's Amount: ${projectToShare.shahadotAmount}৳
- Jony's Amount: ${projectToShare.jonyAmount}৳
- Shahadot's Status: ${projectToShare.shahadotStatus}
- Jony's Status: ${projectToShare.jonyStatus}`,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.text);
        alert("Project details copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
    setShareDialogOpen(false);
  };

  // Share via WhatsApp
  const shareViaWhatsApp = () => {
    if (!projectToShare) return;

    const message =
      `*${projectToShare.projectName}*\n\n` +
      `Description: ${projectToShare.description}\n` +
      `Date: ${projectToShare.date}\n` +
      `Total Cost: ${projectToShare.totalCost}৳\n` +
      `Shahadot's Amount: ${projectToShare.shahadotAmount}৳\n` +
      `Jony's Amount: ${projectToShare.jonyAmount}৳\n` +
      `Shahadot's Status: ${projectToShare.shahadotStatus}\n` +
      `Jony's Status: ${projectToShare.jonyStatus}`;

    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
    setShareDialogOpen(false);
  };

  // Share via Email
  const shareViaEmail = () => {
    if (!projectToShare) return;

    const subject = `Project Details: ${projectToShare.projectName}`;
    const body =
      `Project Details:\n\n` +
      `Project Name: ${projectToShare.projectName}\n` +
      `Description: ${projectToShare.description}\n` +
      `Date: ${projectToShare.date}\n` +
      `Total Cost: ${projectToShare.totalCost}৳\n` +
      `Shahadot's Amount: ${projectToShare.shahadotAmount}৳\n` +
      `Jony's Amount: ${projectToShare.jonyAmount}৳\n` +
      `Shahadot's Status: ${projectToShare.shahadotStatus}\n` +
      `Jony's Status: ${projectToShare.jonyStatus}`;

    const url = `mailto:?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = url;
    setShareDialogOpen(false);
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = [
      "Project Name",
      "Description",
      "Date",
      "Total Cost",
      "Shahadot's Amount",
      "Jony's Amount",
      "Shahadot's Status",
      "Jony's Status",
      "Diu Total Taka",
    ];

    const csvContent = [
      headers.join(","),
      ...projects.map((project) =>
        [
          `"${project.projectName}"`,
          `"${project.description}"`,
          project.date,
          project.totalCost,
          project.shahadotAmount,
          project.jonyAmount,
          project.shahadotStatus,
          project.jonyStatus,
          project.shahadotAmount - project.jonyAmount,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `projects_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Get row background color based on status
  const getRowColor = (project: Project) => {
    if (
      project.shahadotStatus === "payble" &&
      project.jonyStatus === "payble"
    ) {
      return "bg-green-50 dark:bg-green-900/30";
    } else if (
      project.shahadotStatus === "reject" ||
      project.jonyStatus === "reject"
    ) {
      return "bg-red-50 dark:bg-red-900/30";
    } else if (
      project.shahadotStatus === "partial payment" ||
      project.jonyStatus === "partial payment"
    ) {
      return "bg-orange-50 dark:bg-orange-900/30";
    }
    return "";
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 mb-8 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Project Management</h1>
            <p className="opacity-90">
              Track and manage all your projects in one place
            </p>
          </div>
          <Button
            onClick={() => {
              setCurrentProject(null);
              setIsFormOpen(true);
            }}
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
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="gap-1"
            >
              <Printer className="h-4 w-4" /> Print
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={exportToCSV}
              className="gap-1"
            >
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
                <TableHead className="font-semibold no-print">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={10}
                    className="text-center py-8 text-gray-500"
                  >
                    No projects found. Add your first project to get started.
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {projects.map((project) => (
                    <TableRow
                      key={project.id}
                      className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${getRowColor(
                        project
                      )}`}
                    >
                      <TableCell className="font-medium">
                        {project.projectName}
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs max-h-20 overflow-y-auto">
                          {project.description}
                        </div>
                      </TableCell>
                      <TableCell>{project.date}</TableCell>
                      <TableCell className="font-medium">
                        {project.totalCost.toLocaleString()}৳
                      </TableCell>
                      <TableCell>
                        {project.shahadotAmount.toLocaleString()}৳
                      </TableCell>
                      <TableCell>
                        {" "}
                        <span className="bg-green-500 px-3 rounded-md text-white ">
                          {project.jonyAmount.toLocaleString()}৳
                        </span>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2"
                            >
                              <Badge
                                className={
                                  statusOptions.find(
                                    (s) => s.value === project.shahadotStatus
                                  )?.color + " text-white"
                                }
                              >
                                {project.shahadotStatus}
                                <ChevronDown className="ml-1 h-3 w-3" />
                              </Badge>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {statusOptions.map((option) => (
                              <DropdownMenuItem
                                key={`shahadot-${option.value}`}
                                onClick={() =>
                                  updateStatus(
                                    project.id,
                                    "shahadotStatus",
                                    option.value
                                  )
                                }
                              >
                                {option.label}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2"
                            >
                              <Badge
                                className={
                                  statusOptions.find(
                                    (s) => s.value === project.jonyStatus
                                  )?.color + " text-white"
                                }
                              >
                                {project.jonyStatus}
                                <ChevronDown className="ml-1 h-3 w-3" />
                              </Badge>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {statusOptions.map((option) => (
                              <DropdownMenuItem
                                key={`jony-${option.value}`}
                                onClick={() =>
                                  updateStatus(
                                    project.id,
                                    "jonyStatus",
                                    option.value
                                  )
                                }
                              >
                                {option.label}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                      <TableCell className="font-medium">
                        <span className="bg-red-500 px-3 rounded-md text-white ">
                          {(
                            project.shahadotAmount / 2 -
                            project.jonyAmount
                          ).toLocaleString()}
                          ৳
                        </span>
                      </TableCell>
                      <TableCell className="no-print">
                        <div className="flex gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              setCurrentProject(project);
                              setIsFormOpen(true);
                            }}
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
                            onClick={() => handleShareClick(project)}
                            className="text-green-600 hover:bg-green-50"
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-gray-100 dark:bg-gray-700 font-semibold">
                    <TableCell colSpan={3} className="text-right">
                      Total:
                    </TableCell>
                    <TableCell>
                      {projects
                        .reduce((sum, p) => sum + p.totalCost, 0)
                        .toLocaleString()}
                      ৳
                    </TableCell>
                    <TableCell>
                      {projects
                        .reduce((sum, p) => sum + p.shahadotAmount, 0)
                        .toLocaleString()}
                      ৳
                    </TableCell>
                    <TableCell>
                      {projects
                        .reduce((sum, p) => sum + p.jonyAmount, 0)
                        .toLocaleString()}
                      ৳
                    </TableCell>
                    <TableCell colSpan={2}></TableCell>
                    <TableCell>
                      {projects
                        .reduce(
                          (sum, p) =>
                            sum + (p.shahadotAmount / 2 - p.jonyAmount),
                          0
                        )
                        .toLocaleString()}
                      ৳
                    </TableCell>
                    <TableCell></TableCell>
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

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);

                  handleSubmit({
                    id: currentProject?.id || "",
                    projectName: formData.get("projectName") as string,
                    description: formData.get("description") as string,
                    date: formData.get("date") as string,
                    totalCost: Number(formData.get("totalCost")),
                    shahadotAmount: Number(formData.get("shahadotAmount")),
                    jonyAmount: Number(formData.get("jonyAmount")),
                    shahadotStatus: formData.get("shahadotStatus") as string,
                    jonyStatus: formData.get("jonyStatus") as string,
                  });
                }}
              >
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
                      defaultValue={
                        currentProject?.date ||
                        new Date().toISOString().split("T")[0]
                      }
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
                    <Label htmlFor="shahadotAmount">
                      Shahadot's Amount (৳)
                    </Label>
                    <Input
                      type="number"
                      id="shahadotAmount"
                      name="shahadotAmount"
                      defaultValue={currentProject?.shahadotAmount}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="totalCost">i will get money (৳)</Label>
                    <Input
                      type="number"
                      id="totalCost"
                      name="totalCost"
                      defaultValue={currentProject?.totalCost}
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
                        {statusOptions.map((option) => (
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
                        {statusOptions.map((option) => (
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
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsFormOpen(false)}
                  >
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
              Are you sure you want to delete this project? This action cannot
              be undone.
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

      {/* Share Options Dialog */}
      <AlertDialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Share Project Details</AlertDialogTitle>
            <AlertDialogDescription>
              Choose how you want to share this project information.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid grid-cols-1 gap-2 mb-4">
            <Button
              variant="outline"
              onClick={handleShare}
              className="justify-start gap-2"
            >
              <Share2 className="h-4 w-4" />
              Share via System Dialog
            </Button>
            <Button
              variant="outline"
              onClick={shareViaWhatsApp}
              className="justify-start gap-2"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Share via WhatsApp
            </Button>
            <Button
              variant="outline"
              onClick={shareViaEmail}
              className="justify-start gap-2"
            >
              <Mail className="h-4 w-4" />
              Share via Email
            </Button>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
