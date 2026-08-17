import { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLingui } from "@lingui/react";
import ExpansionDetail from "../../../components/ExpansionDetail";
import NotFoundPage from "../../../pages/NotFoundPage";
import { useExpansionPacks } from "../hooks/useExpansionPacks";

function ExpansionDetailPage() {
  const { packId } = useParams();
  const navigate = useNavigate();
  const { i18n } = useLingui();
  const t = (id, message) => i18n._({ id, message });
  const { packs, loading, error } = useExpansionPacks();
  const lastPackRef = useRef(null);

  const pack = packs.find((p) => String(p.id) === packId);
  if (pack) lastPackRef.current = pack;

  // Cada idioma guarda los packs con ids distintos, así que al cambiar de
  // idioma el id de la URL deja de existir. Si veníamos mostrando un pack,
  // lo volvemos a encontrar por su imagen (estable entre idiomas) y
  // reemplazamos la URL por su id en el nuevo idioma.
  const equivalent = !pack && !loading && lastPackRef.current
    ? packs.find((p) => p.image === lastPackRef.current.image)
    : null;

  useEffect(() => {
    if (equivalent) {
      navigate(`/catalogo/${equivalent.id}`, { replace: true });
    }
  }, [equivalent, navigate]);

  if (loading) {
    return <p className="text-text w-full text-center py-20 min-[2560px]:py-28 min-[3840px]:py-36 min-[2560px]:text-3xl min-[3840px]:text-5xl">{t("catalog.loadingDetail", "Cargando...")}</p>;
  }

  if (!pack) {
    if (equivalent) {
      return <p className="text-text w-full text-center py-20 min-[2560px]:py-28 min-[3840px]:py-36 min-[2560px]:text-3xl min-[3840px]:text-5xl">{t("catalog.loadingDetail", "Cargando...")}</p>;
    }
    return <NotFoundPage />;
  }

  if (error) {
    return <NotFoundPage />;
  }

  return <ExpansionDetail data={pack} onBack={() => navigate("/#catalogo")} />;
}

export default ExpansionDetailPage;
