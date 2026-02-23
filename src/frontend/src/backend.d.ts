import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Material {
    id: bigint;
    name: string;
    unit: string;
    price: bigint;
}
export interface ProgressRecord {
    date: Time;
    jobId: bigint;
    percentage: bigint;
}
export interface Job {
    id: bigint;
    cost: bigint;
    name: string;
    unit: string;
    volume: bigint;
    parentId?: bigint;
}
export type Time = bigint;
export interface RealizationReport {
    actualPrice: bigint;
    date: Time;
    createdBy: Principal;
    materialId: bigint;
    vendorId: bigint;
}
export interface MaterialRequest {
    id: bigint;
    financePrice?: bigint;
    jobId: bigint;
    buyerPrice?: bigint;
    finalApproval: boolean;
    materialId: bigint;
    approvedByFinance: boolean;
    quantity: bigint;
    approvedByBuyer: boolean;
    requestedBy: Principal;
}
export interface Vendor {
    id: bigint;
    name: string;
    address: string;
    phone: string;
}
export interface RAPTemplate {
    id: bigint;
    jobs: Array<Job>;
    name: string;
}
export interface UserProfile {
    appRole: AppRole;
    name: string;
}
export enum AppRole {
    Buyer = "Buyer",
    Foreman = "Foreman",
    Admin = "Admin",
    Finance = "Finance"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addJob(name: string, volume: bigint, unit: string, cost: bigint, parentId: bigint | null): Promise<void>;
    addMaterial(name: string, unit: string, price: bigint): Promise<void>;
    addRealizationReport(materialId: bigint, actualPrice: bigint, vendorId: bigint): Promise<void>;
    addVendor(name: string, address: string, phone: string): Promise<void>;
    approveMaterialRequestByBuyer(requestId: bigint, price: bigint, quantity: bigint): Promise<void>;
    approveMaterialRequestByFinance(requestId: bigint, finalPrice: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    assignUserRole(user: Principal, profile: UserProfile): Promise<void>;
    createMaterialRequest(jobId: bigint, materialId: bigint, quantity: bigint): Promise<void>;
    createRAPTemplate(name: string, jobsList: Array<Job>): Promise<void>;
    deleteJob(id: bigint): Promise<void>;
    deleteMaterial(id: bigint): Promise<void>;
    deleteRAPTemplate(id: bigint): Promise<void>;
    deleteVendor(id: bigint): Promise<void>;
    getAllJobs(): Promise<Array<Job>>;
    getAllMaterialRequests(): Promise<Array<MaterialRequest>>;
    getAllMaterials(): Promise<Array<Material>>;
    getAllProgressRecords(): Promise<Array<ProgressRecord>>;
    getAllRAPTemplates(): Promise<Array<RAPTemplate>>;
    getAllRealizationReports(): Promise<Array<RealizationReport>>;
    getAllVendors(): Promise<Array<Vendor>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMaterialUsageSummary(materialId: bigint): Promise<{
        totalApproved: bigint;
        totalRequested: bigint;
    }>;
    getMyMaterialRequests(): Promise<Array<MaterialRequest>>;
    getPendingBuyerApprovals(): Promise<Array<MaterialRequest>>;
    getPendingFinanceApprovals(): Promise<Array<MaterialRequest>>;
    getProgressRecordsByJob(jobId: bigint): Promise<Array<ProgressRecord>>;
    getRealizationReportsByMaterial(materialId: bigint): Promise<Array<RealizationReport>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    recordProgress(jobId: bigint, percentage: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateJob(id: bigint, name: string, volume: bigint, unit: string, cost: bigint, parentId: bigint | null): Promise<void>;
    updateMaterial(id: bigint, name: string, unit: string, price: bigint): Promise<void>;
    updateRAPTemplate(id: bigint, name: string, jobsList: Array<Job>): Promise<void>;
    updateVendor(id: bigint, name: string, address: string, phone: string): Promise<void>;
}
