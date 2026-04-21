import { Landmark, LineChart, ShieldCheck, WalletCards } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/common/Button";
import { FieldGroup, Input } from "../../components/common/FormControls";

const schema = z.object({
  email: z.string().email("Gecerli bir e-posta giriniz."),
  password: z.string().min(6, "Parola en az 6 karakter olmali."),
});

const highlights = [
  {
    icon: LineChart,
    title: "Canli finansal gorunurluk",
    description: "Gelir, gider ve net denge ayni panelde ozetlenir.",
  },
  {
    icon: WalletCards,
    title: "Cari ve fatura omurgasi",
    description: "Musteri, tedarikci ve tahsilat akisi birlikte izlenir.",
  },
  {
    icon: ShieldCheck,
    title: "Rol bazli guvenlik",
    description: "Admin, muhasebeci ve goruntuleyici yetkileri ayrismistir.",
  },
];

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "selin.arslan@novafin.com",
      password: "Demo123!",
    },
  });

  const handleSubmit = async (values) => {
    try {
      setIsSubmitting(true);
      await login(values);
      toast.success("Oturum basariyla acildi.");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Giris yapilirken hata olustu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen p-4 lg:p-6">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-[1550px] overflow-hidden rounded-[36px] border border-white/70 bg-white/75 shadow-panel backdrop-blur-xl lg:grid-cols-[1.2fr_0.8fr]">
        <div className="panel-grid relative overflow-hidden bg-ink p-8 text-white lg:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(29,134,255,0.22),transparent_32%),radial-gradient(circle_at_80%_20%,rgba(47,162,111,0.18),transparent_28%)]" />
          <div className="relative z-10 flex h-full flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80">
                <Landmark className="h-4 w-4" />
                <span>Kurumsal Finans Komuta Paneli</span>
              </div>
              <h1 className="mt-8 max-w-2xl font-heading text-4xl font-extrabold leading-tight lg:text-6xl">
                NovaLedger ile gelir, gider ve tahsilat akisina profesyonel netlik kazandirin.
              </h1>
              <p className="mt-5 max-w-xl text-base text-white/72 lg:text-lg">
                Kucuk ve orta olcekli isletmeler icin gelistirilmis bu panel; dashboard kalitesi,
                muhasebe mantigi ve modul yapisini ayni cati altinda toplar.
              </p>
            </div>

            <div className="grid gap-4 xl:grid-cols-3">
              {highlights.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
                  >
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-heading text-lg font-bold">{item.title}</h3>
                    <p className="mt-2 text-sm text-white/68">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center p-6 lg:p-10">
          <div className="w-full max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-700">
              Guvenli Giris
            </p>
            <h2 className="mt-3 font-heading text-4xl font-extrabold text-ink">
              Panel oturumunu baslatin
            </h2>
            <p className="mt-3 text-sm text-muted">
              Demo veriyle calismak icin asagidaki hazir kullanici bilgilerinden birini
              kullanabilirsiniz.
            </p>

            <form className="mt-8 space-y-5" onSubmit={form.handleSubmit(handleSubmit)}>
              <FieldGroup label="E-posta" error={form.formState.errors.email?.message}>
                <Input {...form.register("email")} type="email" />
              </FieldGroup>
              <FieldGroup label="Parola" error={form.formState.errors.password?.message}>
                <Input {...form.register("password")} type="password" />
              </FieldGroup>
              <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                {isSubmitting ? "Giris yapiliyor..." : "Panele Gir"}
              </Button>
            </form>

            <div className="mt-8 grid gap-3 rounded-[28px] border border-slate-200 bg-slate-50 p-5 text-sm text-muted">
              <div className="rounded-2xl bg-white px-4 py-3">
                <p className="font-semibold text-ink">Admin</p>
                <p>selin.arslan@novafin.com / Demo123!</p>
              </div>
              <div className="rounded-2xl bg-white px-4 py-3">
                <p className="font-semibold text-ink">Muhasebeci</p>
                <p>emre.demir@novafin.com / Demo123!</p>
              </div>
              <div className="rounded-2xl bg-white px-4 py-3">
                <p className="font-semibold text-ink">Goruntuleyici</p>
                <p>ayse.kaya@novafin.com / Demo123!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
