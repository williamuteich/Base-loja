"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { TeamMember, TeamResponse } from "@/types/team";
import { getAdminTeam, createTeamMember, updateTeamMember, deleteTeamMember } from "@/services/team";
import TeamHeader from "./components/team-header";
import TeamCard from "./components/team-card";
import GenericPagination from "../../components/generic-pagination";
import SkeletonTeam from "./components/skeleton-team";
import GenericModal from "../../components/generic-modal";
import DeleteConfirmation from "../../components/delete-confirmation";
import TeamForm from "./components/team-form";

export default function TeamList() {
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<TeamMember | undefined>(undefined);
    const [isSaving, setIsSaving] = useState(false);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [memberToDelete, setMemberToDelete] = useState<TeamMember | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const loadTeam = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data: TeamResponse = await getAdminTeam(page, 10, debouncedSearch);
            setMembers(data.data || []);
            setTotalPages(data.meta.totalPages);
            setTotalItems(data.meta.total);
        } catch (err) {
            setError("Falha ao carregar a equipe. Tente novamente.");
            toast.error("Erro ao carregar equipe");
        } finally {
            setIsLoading(false);
        }
    }, [page, debouncedSearch]);

    useEffect(() => {
        loadTeam();
    }, [loadTeam]);

    const handleOpenModal = (member?: TeamMember) => {
        setSelectedMember(member);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedMember(undefined);
    };

    const handleSave = async (data: any) => {
        setIsSaving(true);
        try {
            if (selectedMember) {
                await updateTeamMember(selectedMember.id, data);
                toast.success("Membro da equipe atualizado! 👥✨");
            } else {
                await createTeamMember(data);
                toast.success("Novo membro adicionado com sucesso! 🎉");
            }
            handleCloseModal();
            loadTeam();
        } catch (error: any) {
            toast.error(error.message || "Erro ao salvar membro");
        } finally {
            setIsSaving(false);
        }
    };

    const handleOpenDeleteModal = (member: TeamMember) => {
        setMemberToDelete(member);
        setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setMemberToDelete(null);
    };

    const handleDelete = async () => {
        if (!memberToDelete) return;
        setIsDeleting(true);
        try {
            await deleteTeamMember(memberToDelete.id);
            toast.success("Membro removido da equipe com sucesso! 🗑️");
            handleCloseDeleteModal();
            loadTeam();
        } catch (error) {
            toast.error("Erro ao remover membro");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="space-y-6">
            <TeamHeader
                search={search}
                onSearchChange={setSearch}
                onAddClick={() => handleOpenModal()}
            />

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <SkeletonTeam key={i} />
                    ))}
                </div>
            ) : error ? (
                <div className="bg-rose-50 border border-rose-200 p-8 rounded-2xl text-center">
                    <p className="text-rose-600 font-medium">{error}</p>
                    <button
                        onClick={() => loadTeam()}
                        className="mt-4 text-sm font-bold text-rose-700 hover:underline cursor-pointer"
                    >
                        Tentar novamente
                    </button>
                </div>
            ) : members.length === 0 ? (
                <div className="bg-white border border-slate-200 p-12 rounded-2xl text-center">
                    <p className="text-slate-500">Nenhum membro encontrado.</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {members.map((member) => (
                            <TeamCard
                                key={member.id}
                                member={member}
                                onEdit={handleOpenModal}
                                onDelete={handleOpenDeleteModal}
                            />
                        ))}
                    </div>

                    <div className="mt-8 p-4 border border-slate-200 bg-slate-50 flex items-center justify-center rounded-2xl">
                        <GenericPagination
                            page={page}
                            totalPages={totalPages}
                            onPageChange={setPage}
                        />
                    </div>
                </>
            )}

            <GenericModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={selectedMember ? "Editar Membro" : "Novo Membro da Equipe"}
            >
                <TeamForm
                    member={selectedMember}
                    isSaving={isSaving}
                    onSave={handleSave}
                    onCancel={handleCloseModal}
                />
            </GenericModal>

            <GenericModal
                isOpen={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
                title="Remover Membro"
            >
                <DeleteConfirmation
                    onConfirm={handleDelete}
                    onCancel={handleCloseDeleteModal}
                    isDeleting={isDeleting}
                    title="Cuidado! Ação irreversível"
                    description={`Tem certeza que deseja remover ${memberToDelete?.name} da equipe? Esta ação não pode ser desfeita.`}
                />
            </GenericModal>
        </div>
    );
}
