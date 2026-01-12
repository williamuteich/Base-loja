import TeamList from "./team-list";

export const metadata = {
    title: "Gerenciamento de Equipe | Dashboard Admin",
    description: "Gerencie os membros da equipe e colaboradores do sistema.",
};

export default function TeamPage() {
    return (
        <div className="space-y-6">
            <TeamList />
        </div>
    );
}
