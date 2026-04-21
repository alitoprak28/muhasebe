import { Link } from "react-router-dom";
import { Button } from "../components/common/Button";

export const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="max-w-xl rounded-[36px] border border-white/70 bg-white/80 p-10 text-center shadow-panel backdrop-blur-xl">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-700">
          404
        </p>
        <h1 className="mt-4 font-heading text-4xl font-extrabold text-ink">
          Aradiginiz sayfa bulunamadi
        </h1>
        <p className="mt-4 text-sm text-muted">
          Panel icindeki baglantiyi yenileyebilir veya ana sayfaya donerek islemlerinize devam
          edebilirsiniz.
        </p>
        <Link to="/" className="mt-6 inline-flex">
          <Button>Anasayfaya Don</Button>
        </Link>
      </div>
    </div>
  );
};
