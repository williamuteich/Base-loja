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

export interface TeamCardProps {
    member: TeamMember;
    onEdit: (member: TeamMember) => void;
    onDelete: (member: TeamMember) => void;
}

export interface TeamFormProps {
    member?: TeamMember;
    onSave: (data: any) => Promise<void>;
    onCancel: () => void;
    isSaving: boolean;
}

export interface TeamHeaderProps {
    search: string;
    onSearchChange: (value: string) => void;
    onAddClick: () => void;
}

export interface TeamPaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}
