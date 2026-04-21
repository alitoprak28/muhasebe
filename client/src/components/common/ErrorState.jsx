import { AlertTriangle } from "lucide-react";
import { Button } from "./Button";

export const ErrorState = ({ title, description, onRetry }) => {
  return (
    <div className="rounded-[28px] border border-danger-100 bg-danger-50 px-6 py-10">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-danger-500">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-heading text-xl font-bold text-danger-600">{title}</h3>
          <p className="mt-2 max-w-2xl text-sm text-danger-600/80">{description}</p>
          {onRetry ? (
            <Button className="mt-4" variant="danger" onClick={onRetry}>
              Tekrar Dene
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

