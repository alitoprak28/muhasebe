import { RefreshCcw, RotateCcw, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "../common/Button";
import { DataTable } from "../common/DataTable";
import { ErrorState } from "../common/ErrorState";
import { FieldGroup, Input, Select } from "../common/FormControls";
import { LoadingState } from "../common/LoadingState";
import { MetricCard } from "../common/MetricCard";
import { PageHeader } from "../common/PageHeader";
import { SectionCard } from "../common/SectionCard";
import { cn } from "../../utils/cn";

const initialFilters = {
  search: "",
  status: "",
  type: "",
  startDate: "",
  endDate: "",
};

export const EnterpriseTablePage = ({
  eyebrow,
  title,
  description,
  loader,
  columns,
  buildMetrics,
  tableTitle,
  tableDescription,
  emptyTitle,
  emptyDescription,
  searchPlaceholder = "Belge no, unvan veya aciklama ile arayin",
  statusOptions = [],
  typeOptions = [],
  actions,
  renderSideContent,
  className,
}) => {
  const [filters, setFilters] = useState(initialFilters);
  const [draftFilters, setDraftFilters] = useState(initialFilters);
  const [payload, setPayload] = useState({ rows: [], meta: null, summary: {} });
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setHasError(false);

      const response = await Promise.resolve(loader(filters));

      setPayload({
        rows: response.data || [],
        meta: response.meta || null,
        summary: response.summary || response.meta?.summary || {},
      });
    } catch (error) {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filters]);

  const metrics = useMemo(
    () => (buildMetrics ? buildMetrics(payload) : []),
    [buildMetrics, payload]
  );

  if (isLoading) {
    return <LoadingState label={`${title} verileri yukleniyor...`} />;
  }

  if (hasError) {
    return (
      <ErrorState
        title={`${title} modulu gecici olarak kullanilamiyor`}
        description="Veri akisi veya demo katmani yanit vermedigi icin ekran acilamadi."
        onRetry={loadData}
      />
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      <PageHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        actions={
          <>
            {actions}
            <Button variant="ghost" icon={RefreshCcw} onClick={loadData}>
              Yenile
            </Button>
          </>
        }
      />

      {metrics.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {metrics.map((metric) => (
            <MetricCard key={metric.title} {...metric} />
          ))}
        </div>
      ) : null}

      <SectionCard
        title="Filtreler"
        description="Listeyi belge tipi, durum, tarih ve serbest metin ile daraltin."
      >
        <div
          className={cn(
            "grid gap-4",
            statusOptions.length || typeOptions.length
              ? "xl:grid-cols-[1.4fr_1fr_1fr_1fr_1fr_auto_auto]"
              : "xl:grid-cols-[1.8fr_1fr_1fr_auto_auto]"
          )}
        >
          <FieldGroup label="Arama">
            <Input
              value={draftFilters.search}
              onChange={(event) =>
                setDraftFilters((prev) => ({ ...prev, search: event.target.value }))
              }
              placeholder={searchPlaceholder}
            />
          </FieldGroup>

          {typeOptions.length ? (
            <FieldGroup label="Tip">
              <Select
                value={draftFilters.type}
                onChange={(event) =>
                  setDraftFilters((prev) => ({ ...prev, type: event.target.value }))
                }
              >
                <option value="">Tum tipler</option>
                {typeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </FieldGroup>
          ) : null}

          {statusOptions.length ? (
            <FieldGroup label="Durum">
              <Select
                value={draftFilters.status}
                onChange={(event) =>
                  setDraftFilters((prev) => ({ ...prev, status: event.target.value }))
                }
              >
                <option value="">Tum durumlar</option>
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </FieldGroup>
          ) : null}

          <FieldGroup label="Baslangic">
            <Input
              type="date"
              value={draftFilters.startDate}
              onChange={(event) =>
                setDraftFilters((prev) => ({ ...prev, startDate: event.target.value }))
              }
            />
          </FieldGroup>

          <FieldGroup label="Bitis">
            <Input
              type="date"
              value={draftFilters.endDate}
              onChange={(event) =>
                setDraftFilters((prev) => ({ ...prev, endDate: event.target.value }))
              }
            />
          </FieldGroup>

          <div className="flex items-end">
            <Button className="w-full" icon={Search} onClick={() => setFilters(draftFilters)}>
              Uygula
            </Button>
          </div>

          <div className="flex items-end">
            <Button
              className="w-full"
              variant="ghost"
              icon={RotateCcw}
              onClick={() => {
                setDraftFilters(initialFilters);
                setFilters(initialFilters);
              }}
            >
              Sifirla
            </Button>
          </div>
        </div>
      </SectionCard>

      <div className={cn("grid gap-6", renderSideContent ? "xl:grid-cols-[1.45fr_0.85fr]" : "")}>
        <SectionCard title={tableTitle} description={tableDescription}>
          <DataTable
            columns={columns}
            data={payload.rows}
            emptyTitle={emptyTitle}
            emptyDescription={emptyDescription}
          />
        </SectionCard>

        {renderSideContent ? <div className="space-y-6">{renderSideContent(payload)}</div> : null}
      </div>
    </div>
  );
};
