import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ProductionEntry {
    id: bigint;
    workerId: Principal;
    date: string;
    towelType: TowelType;
    quantityMeters: number;
    notes: string;
    workerName: string;
}
export interface Stock {
    bathTowels: number;
    handTowels: number;
    faceTowels: number;
}
export interface DispatchEntry {
    id: bigint;
    destination: string;
    date: string;
    towelType: TowelType;
    quantityMeters: number;
    notes: string;
    adminId: Principal;
}
export interface Worker {
    principal: Principal;
    name: string;
    isAdmin: boolean;
}
export interface UserProfile {
    name: string;
}
export enum TowelType {
    bath = "bath",
    face = "face",
    hand = "hand"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addAdmin(principal: Principal, name: string): Promise<void>;
    addDispatchEntry(towelType: TowelType, quantityMeters: number, date: string, destination: string, notes: string): Promise<void>;
    addProductionEntry(towelType: TowelType, quantityMeters: number, date: string, notes: string): Promise<void>;
    addWorker(principal: Principal, name: string): Promise<void>;
    adjustStock(towelType: TowelType, quantityMeters: number, reason: string, date: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDispatchHistory(): Promise<Array<DispatchEntry>>;
    getProductionHistory(): Promise<Array<ProductionEntry>>;
    getStock(): Promise<Stock>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getWorkers(): Promise<Array<Worker>>;
    isCallerAdmin(): Promise<boolean>;
    removeAdmin(principal: Principal): Promise<void>;
    removeWorker(principal: Principal): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setInitialStock(bath: number, hand: number, face: number): Promise<void>;
}
