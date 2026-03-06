import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Shield, Trash2, UserPlus, UserX, Users } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Worker } from "../backend.d";
import {
  useAddAdmin,
  useAddWorker,
  useRemoveAdmin,
  useRemoveWorker,
  useWorkers,
} from "../hooks/useQueries";

function WorkerRow({
  worker,
  index,
}: {
  worker: Worker;
  index: number;
}) {
  const removeMutation = useRemoveWorker();
  const removeAdminMutation = useRemoveAdmin();
  const addAdminMutation = useAddAdmin();

  const principalStr = worker.principal.toString();

  async function handleRemoveWorker() {
    try {
      await removeMutation.mutateAsync(worker.principal);
      toast.success(`${worker.name} removed from workers`);
    } catch {
      toast.error("Failed to remove worker");
    }
  }

  async function handleRemoveAdmin() {
    try {
      await removeAdminMutation.mutateAsync(worker.principal);
      toast.success(`${worker.name} removed from admins`);
    } catch {
      toast.error("Failed to remove admin");
    }
  }

  async function handleMakeAdmin() {
    try {
      await addAdminMutation.mutateAsync({
        principal: principalStr,
        name: worker.name,
      });
      toast.success(`${worker.name} promoted to admin`);
    } catch {
      toast.error("Failed to make admin");
    }
  }

  const idx = index + 1;

  return (
    <motion.div
      data-ocid={`workers.item.${idx}`}
      className="flex items-center gap-3 py-3 border-b border-border/50 last:border-0"
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      {/* Avatar placeholder */}
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-sm font-bold"
        style={{
          background: worker.isAdmin
            ? "linear-gradient(135deg, oklch(0.65 0.16 55), oklch(0.72 0.13 40))"
            : "oklch(var(--secondary))",
          color: worker.isAdmin ? "white" : "oklch(var(--foreground))",
        }}
      >
        {worker.name.charAt(0).toUpperCase()}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm truncate">{worker.name}</span>
          {worker.isAdmin && (
            <Badge
              className="text-xs"
              style={{
                background: "oklch(0.72 0.17 58 / 0.2)",
                color: "oklch(0.52 0.15 55)",
                border: "1px solid oklch(0.72 0.17 58 / 0.4)",
              }}
            >
              <Shield className="w-3 h-3 mr-1" />
              Admin
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground font-mono truncate">
          {principalStr.slice(0, 20)}...
        </p>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        {/* Toggle admin */}
        {worker.isAdmin ? (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs gap-1.5"
                disabled={removeAdminMutation.isPending}
              >
                <UserX className="w-3 h-3" />
                <span className="hidden sm:inline">Remove Admin</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Remove Admin Access</AlertDialogTitle>
                <AlertDialogDescription>
                  Remove admin privileges from <strong>{worker.name}</strong>?
                  They will retain worker access.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel data-ocid="workers.remove_admin.cancel_button">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleRemoveAdmin}
                  data-ocid="workers.remove_admin.confirm_button"
                >
                  Remove Admin
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs gap-1.5"
            disabled={addAdminMutation.isPending}
            onClick={handleMakeAdmin}
          >
            <Shield className="w-3 h-3" />
            <span className="hidden sm:inline">Make Admin</span>
          </Button>
        )}

        {/* Remove worker */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:bg-destructive/10"
              data-ocid={`workers.delete_button.${idx}`}
              disabled={removeMutation.isPending}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent data-ocid="workers.delete.dialog">
            <AlertDialogHeader>
              <AlertDialogTitle>Remove Worker</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to remove <strong>{worker.name}</strong>{" "}
                from the system? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel data-ocid="workers.delete.cancel_button">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleRemoveWorker}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                data-ocid="workers.delete.confirm_button"
              >
                Remove
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </motion.div>
  );
}

export function WorkersPage() {
  const [newPrincipal, setNewPrincipal] = useState("");
  const [newName, setNewName] = useState("");
  const [adminPrincipal, setAdminPrincipal] = useState("");
  const [adminName, setAdminName] = useState("");

  const { data: workers, isLoading } = useWorkers();
  const addWorkerMutation = useAddWorker();
  const addAdminMutation = useAddAdmin();

  async function handleAddWorker(ev: React.FormEvent) {
    ev.preventDefault();
    if (!newPrincipal.trim() || !newName.trim()) return;
    try {
      await addWorkerMutation.mutateAsync({
        principal: newPrincipal.trim(),
        name: newName.trim(),
      });
      toast.success(`${newName} added as worker!`);
      setNewPrincipal("");
      setNewName("");
    } catch {
      toast.error("Failed to add worker. Check the principal ID.");
    }
  }

  async function handleAddAdmin(ev: React.FormEvent) {
    ev.preventDefault();
    if (!adminPrincipal.trim() || !adminName.trim()) return;
    try {
      await addAdminMutation.mutateAsync({
        principal: adminPrincipal.trim(),
        name: adminName.trim(),
      });
      toast.success(`${adminName} added as admin!`);
      setAdminPrincipal("");
      setAdminName("");
    } catch {
      toast.error("Failed to add admin. Check the principal ID.");
    }
  }

  const regularWorkers = (workers ?? []).filter((w) => !w.isAdmin);
  const adminWorkers = (workers ?? []).filter((w) => w.isAdmin);

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-1">
          <Users className="w-5 h-5 text-primary" />
          <h1 className="font-display text-2xl font-bold">Workers</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Manage factory workers and administrator access
        </p>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Add worker form */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <UserPlus className="w-4 h-4 text-primary" />
                Add Worker
              </CardTitle>
              <CardDescription className="text-sm">
                Add a new worker using their Internet Identity principal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddWorker} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="worker-principal">Principal ID *</Label>
                  <Input
                    id="worker-principal"
                    type="text"
                    placeholder="xxxxx-xxxxx-xxxxx-xxxxx-xxx"
                    value={newPrincipal}
                    onChange={(e) => setNewPrincipal(e.target.value)}
                    data-ocid="workers.principal.input"
                    className="font-mono text-sm"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="worker-name">Full Name *</Label>
                  <Input
                    id="worker-name"
                    type="text"
                    placeholder="e.g. Ravi Kumar"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    data-ocid="workers.name.input"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={
                    addWorkerMutation.isPending || !newPrincipal || !newName
                  }
                  data-ocid="workers.add.submit_button"
                  className="w-full"
                >
                  {addWorkerMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    "Add Worker"
                  )}
                </Button>
                {addWorkerMutation.isError && (
                  <p
                    data-ocid="workers.add.error_state"
                    className="text-sm text-destructive"
                  >
                    Failed to add worker. Check the principal ID.
                  </p>
                )}
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Add admin form */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Shield className="w-4 h-4 text-primary" />
                Add Administrator
              </CardTitle>
              <CardDescription className="text-sm">
                Grant administrative privileges to a principal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddAdmin} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="admin-principal">Principal ID *</Label>
                  <Input
                    id="admin-principal"
                    type="text"
                    placeholder="xxxxx-xxxxx-xxxxx-xxxxx-xxx"
                    value={adminPrincipal}
                    onChange={(e) => setAdminPrincipal(e.target.value)}
                    className="font-mono text-sm"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="admin-name">Full Name *</Label>
                  <Input
                    id="admin-name"
                    type="text"
                    placeholder="e.g. Sunita Sharma"
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={
                    addAdminMutation.isPending || !adminPrincipal || !adminName
                  }
                  className="w-full"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.65 0.16 55), oklch(0.72 0.13 40))",
                  }}
                >
                  {addAdminMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    "Add Administrator"
                  )}
                </Button>
                {addAdminMutation.isError && (
                  <p className="text-sm text-destructive">
                    Failed to add admin. Check the principal ID.
                  </p>
                )}
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Workers list */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Users className="w-4 h-4 text-primary" />
                All Workers
              </CardTitle>
              <Badge variant="outline">{(workers ?? []).length} total</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div data-ocid="workers.list.loading_state" className="space-y-3">
                {["w1", "w2", "w3", "w4"].map((k) => (
                  <div key={k} className="flex items-center gap-3">
                    <Skeleton className="w-9 h-9 rounded-full shimmer" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-4 w-32 shimmer" />
                      <Skeleton className="h-3 w-48 shimmer" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (workers ?? []).length === 0 ? (
              <div
                data-ocid="workers.list.empty_state"
                className="text-center py-12 text-muted-foreground"
              >
                <Users className="w-10 h-10 mx-auto mb-3 opacity-25" />
                <p className="font-medium">No workers registered yet</p>
                <p className="text-sm mt-1">Add workers using the form above</p>
              </div>
            ) : (
              <div>
                {adminWorkers.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2 px-1">
                      Administrators ({adminWorkers.length})
                    </p>
                    {adminWorkers.map((w, i) => (
                      <WorkerRow
                        key={w.principal.toString()}
                        worker={w}
                        index={i}
                      />
                    ))}
                  </div>
                )}

                {regularWorkers.length > 0 && (
                  <div>
                    {adminWorkers.length > 0 && (
                      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2 mt-4 px-1">
                        Workers ({regularWorkers.length})
                      </p>
                    )}
                    {regularWorkers.map((w, i) => (
                      <WorkerRow
                        key={w.principal.toString()}
                        worker={w}
                        index={adminWorkers.length + i}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
