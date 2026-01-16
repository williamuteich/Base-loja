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

export interface TeamResponse {
    data: TeamMember[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
