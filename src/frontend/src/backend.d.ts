import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface TextContent {
    spanish: string;
    english: string;
}
export interface ContentBlock {
    id: bigint;
    title: TextContent;
    content: TextContent;
    order: bigint;
    createdAt: Time;
    createdBy: Principal;
    blockType: BlockType;
    isVisible: boolean;
    image?: ExternalBlob;
}
export type Time = bigint;
export interface AdminUser {
    username: string;
    password: string;
    createdAt: Time;
    createdBy: string;
    fullName: string;
    isActive: boolean;
}
export interface SectionContentView {
    id: string;
    title: TextContent;
    background?: ExternalBlob;
    order: bigint;
    createdBy: Principal;
    lastUpdated: Time;
    description: TextContent;
    contentBlocks: Array<ContentBlock>;
    isVisible: boolean;
    image?: ExternalBlob;
}
export interface SocialMediaLink {
    url: string;
    icon?: ExternalBlob;
    platform: string;
}
export interface Package {
    id: string;
    name: TextContent;
    description: TextContent;
    image: ExternalBlob;
    price: TextContent;
}
export interface ContentBlockView {
    id: bigint;
    title: TextContent;
    content: TextContent;
    order: bigint;
    createdAt: Time;
    createdBy: Principal;
    blockType: BlockType;
    isVisible: boolean;
    image?: ExternalBlob;
}
export interface HowToOrderStep {
    title: TextContent;
    description: TextContent;
    stepNumber: bigint;
    image?: ExternalBlob;
}
export interface InstagramFeedConfig {
    title: TextContent;
    displayOrder: bigint;
    createdBy: string;
    instagramHandle: string;
    lastUpdated: Time;
    description: TextContent;
    isVisible: boolean;
    instagramEmbedCode: string;
}
export interface Product {
    id: string;
    title: TextContent;
    description: TextContent;
    image: ExternalBlob;
    price: TextContent;
}
export interface UserProfile {
    name: string;
    email?: string;
    language: Language;
}
export enum BlockType {
    textBlock = "textBlock",
    imageBlock = "imageBlock",
    mixedBlock = "mixedBlock"
}
export enum Language {
    spanish = "spanish",
    english = "english"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addContentBlock(sessionId: string, sectionId: string, title: TextContent, content: TextContent, image: ExternalBlob | null, blockType: BlockType, order: bigint, isVisible: boolean): Promise<ContentBlock>;
    addHowToOrderStep(sessionId: string, stepNumber: bigint, title: TextContent, description: TextContent, image: ExternalBlob | null): Promise<HowToOrderStep>;
    addPackage(sessionId: string, name: TextContent, description: TextContent, image: ExternalBlob, price: TextContent): Promise<Package>;
    addProduct(sessionId: string, title: TextContent, description: TextContent, image: ExternalBlob, price: TextContent): Promise<Product>;
    addSocialMediaLink(sessionId: string, platform: string, url: string, icon: ExternalBlob | null): Promise<SocialMediaLink>;
    adminDeleteContentBlock(sessionId: string, sectionId: string, blockId: bigint): Promise<void>;
    adminLogin(username: string, password: string): Promise<string>;
    adminLogout(sessionId: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createAdditionalSection(sessionId: string, title: TextContent, description: TextContent, image: ExternalBlob | null, background: ExternalBlob | null, order: bigint, isVisible: boolean): Promise<string>;
    createAdminUser(sessionId: string, username: string, fullName: string, password: string): Promise<void>;
    deleteAdditionalSection(sessionId: string, id: string): Promise<void>;
    deletePackage(sessionId: string, id: string): Promise<void>;
    deleteProduct(sessionId: string, id: string): Promise<void>;
    deleteSocialMediaLink(sessionId: string, platform: string): Promise<void>;
    editHowToOrderStep(sessionId: string, stepNumber: bigint, title: TextContent, description: TextContent, image: ExternalBlob | null): Promise<HowToOrderStep>;
    editPackage(sessionId: string, id: string, name: TextContent, description: TextContent, image: ExternalBlob, price: TextContent): Promise<Package>;
    editProduct(sessionId: string, id: string, title: TextContent, description: TextContent, image: ExternalBlob, price: TextContent): Promise<Product>;
    editSocialMediaLink(sessionId: string, platform: string, url: string, icon: ExternalBlob | null): Promise<SocialMediaLink>;
    getAdminUsers(sessionId: string): Promise<Array<AdminUser>>;
    getAllAdditionalSections(): Promise<Array<SectionContentView>>;
    getAllContentBlocksAdmin(sessionId: string, sectionId: string): Promise<Array<ContentBlockView>>;
    getAllHowToOrderSteps(): Promise<Array<HowToOrderStep>>;
    getAllPackageIds(): Promise<Array<string>>;
    getAllPackages(): Promise<Array<Package>>;
    getAllProducts(): Promise<Array<Product>>;
    getAllSectionsAdmin(sessionId: string): Promise<Array<SectionContentView>>;
    getAllSocialMediaLinks(): Promise<Array<SocialMediaLink>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getInstagramFeedConfig(): Promise<InstagramFeedConfig | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getVisibleContentBlockAdmin(sessionId: string, sectionId: string): Promise<Array<ContentBlockView>>;
    isAdmin(): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateAdditionalSection(sessionId: string, id: string, title: TextContent, description: TextContent, image: ExternalBlob | null, background: ExternalBlob | null, order: bigint, isVisible: boolean): Promise<void>;
    updateInstagramFeedConfig(sessionId: string, instagramHandle: string, instagramEmbedCode: string, title: TextContent, description: TextContent, displayOrder: bigint, isVisible: boolean): Promise<void>;
    validateSession(sessionId: string): Promise<boolean>;
}
