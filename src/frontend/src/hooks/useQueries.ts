import { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type DispatchEntry,
  type ProductionEntry,
  type Stock,
  TowelType,
  UserRole,
  type Worker,
} from "../backend.d";
import { useActor } from "./useActor";

// ─── Queries ────────────────────────────────────────────────────────────────

export function useStock() {
  const { actor, isFetching } = useActor();
  return useQuery<Stock>({
    queryKey: ["stock"],
    queryFn: async () => {
      if (!actor) return { bathTowels: 0, handTowels: 0, faceTowels: 0 };
      return actor.getStock();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useProductionHistory() {
  const { actor, isFetching } = useActor();
  return useQuery<ProductionEntry[]>({
    queryKey: ["productionHistory"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProductionHistory();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useDispatchHistory() {
  const { actor, isFetching } = useActor();
  return useQuery<DispatchEntry[]>({
    queryKey: ["dispatchHistory"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getDispatchHistory();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useWorkers() {
  const { actor, isFetching } = useActor();
  return useQuery<Worker[]>({
    queryKey: ["workers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getWorkers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUserRole() {
  const { actor, isFetching } = useActor();
  return useQuery<UserRole>({
    queryKey: ["userRole"],
    queryFn: async () => {
      if (!actor) return UserRole.guest;
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Mutations ───────────────────────────────────────────────────────────────

export function useAddProductionEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      towelType,
      quantityMeters,
      date,
      notes,
    }: {
      towelType: TowelType;
      quantityMeters: number;
      date: string;
      notes: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addProductionEntry(towelType, quantityMeters, date, notes);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["productionHistory"] });
      void queryClient.invalidateQueries({ queryKey: ["stock"] });
    },
  });
}

export function useAddDispatchEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      towelType,
      quantityMeters,
      date,
      destination,
      notes,
    }: {
      towelType: TowelType;
      quantityMeters: number;
      date: string;
      destination: string;
      notes: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addDispatchEntry(
        towelType,
        quantityMeters,
        date,
        destination,
        notes,
      );
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["dispatchHistory"] });
      void queryClient.invalidateQueries({ queryKey: ["stock"] });
    },
  });
}

export function useAdjustStock() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      towelType,
      quantityMeters,
      reason,
      date,
    }: {
      towelType: TowelType;
      quantityMeters: number;
      reason: string;
      date: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.adjustStock(towelType, quantityMeters, reason, date);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["stock"] });
    },
  });
}

export function useSetInitialStock() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      bath,
      hand,
      face,
    }: {
      bath: number;
      hand: number;
      face: number;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.setInitialStock(bath, hand, face);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["stock"] });
    },
  });
}

export function useAddWorker() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      principal,
      name,
    }: { principal: string; name: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addWorker(Principal.fromText(principal), name);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["workers"] });
    },
  });
}

export function useRemoveWorker() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (principal: Principal) => {
      if (!actor) throw new Error("Not connected");
      return actor.removeWorker(principal);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["workers"] });
    },
  });
}

export function useAddAdmin() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      principal,
      name,
    }: { principal: string; name: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addAdmin(Principal.fromText(principal), name);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["workers"] });
    },
  });
}

export function useRemoveAdmin() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (principal: Principal) => {
      if (!actor) throw new Error("Not connected");
      return actor.removeAdmin(principal);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["workers"] });
    },
  });
}

export { TowelType };
