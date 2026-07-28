import { useParams, useNavigate } from "react-router-dom";
import ExpansionDetail from "../../../components/ExpansionDetail";
import NotFoundPage from "../../../pages/NotFoundPage";
import { useExpansionPacks } from "../hooks/useExpansionPacks";

function ExpansionDetailPage() {
  const { packId } = useParams();
  const navigate = useNavigate();
  const { packs, loading, error } = useExpansionPacks();

  if (loading) {
    return <p className="text-text w-full text-center py-20">Cargando...</p>;
  }

  const pack = packs.find((p) => String(p.id) === packId);

  if (error || !pack) {
    return <NotFoundPage />;
  }

  return <ExpansionDetail data={pack} onBack={() => navigate("/#catalogo")} />;
}

export default ExpansionDetailPage;
