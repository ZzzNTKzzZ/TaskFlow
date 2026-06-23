import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import WorkspaceService from "@/services/workspace.service";
import { useEffect } from "react";

// Hook to query the list of workspaces
export const useWorkspaces = (limit?: number) => {
  return useQuery({
    queryKey: ["workspaces", limit],
    queryFn: () => WorkspaceService.getWorkspaces(limit),
  });
};

// Hook to get a single workspace details
export const useWorkspace = (id: string) => {
  return useQuery({
    queryKey: ["workspace", id],
    queryFn: () => WorkspaceService.getWorkspace(id),
    enabled: !!id,
  });
};

// Hook to create a workspace
export const useCreateWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => WorkspaceService.createWorkspace(name),
    onSuccess: async (createdWorkspace) => {
      // 1. Invalidate queries to trigger background refetch
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });

      // 2. Broadcast events for legacy eventBus compatibility
      try {
        const eventBus = await import("@/services/eventBus");
        if (createdWorkspace) {
          eventBus.emit("workspace:created", {
            tempId: "tmp-creating",
            created: createdWorkspace,
          });
        }
      } catch (e) {
        console.error("eventBus emit error in hook:", e);
      }
    },
  });
};

// Hook to delete a workspace
export const useDeleteWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => WorkspaceService.deleteWorkspace(id),
    onSuccess: async (data, workspaceId) => {
      // 1. Invalidate cache
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });

      // 2. Broadcast event
      try {
        const eventBus = await import("@/services/eventBus");
        eventBus.emit("workspace:deleted", workspaceId);
      } catch (e) {
        console.error("eventBus emit error in hook:", e);
      }
    },
  });
};
