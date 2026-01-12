export type TeamRole = "ADMIN" | "COLLABORATOR" | "CLIENT";

export interface TeamMember {
    id: string;
    name: string;
    lastName: string;
    email: string;
    role: TeamRole;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}
