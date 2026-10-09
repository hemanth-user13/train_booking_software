import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import ConfirmationDialog, {
  type ConfirmVariant,
} from "../components/organisms/ConfirmationDialog";

export interface ConfirmOptions {
  title: string;
  description?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmVariant;
  onConfirm?: () => Promise<void> | void;
}

export function useConfirmation() {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const resolverRef = useRef<((accepted: boolean) => void) | null>(null);

  const settle = useCallback((accepted: boolean) => {
    resolverRef.current?.(accepted);
    resolverRef.current = null;
    setOptions(null);
    setLoading(false);
    setError(null);
  }, []);

  const confirm = useCallback((next: ConfirmOptions) => {
    // A new request replaces any pending one, which counts as "cancelled".
    resolverRef.current?.(false);
    setOptions(next);
    setError(null);
    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve;
    });
  }, []);

  // If the owning component unmounts, don't leave a caller awaiting forever.
  useEffect(() => {
    return () => {
      resolverRef.current?.(false);
      resolverRef.current = null;
    };
  }, []);

  const handleConfirm = async () => {
    if (!options || loading) return; // blocks double clicks
    if (!options.onConfirm) {
      settle(true);
      return;
    }
    setLoading(true);
    try {
      await options.onConfirm();
      settle(true);
    } catch (err) {
      setLoading(false);
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    }
  };

  const handleCancel = () => {
    if (!loading) settle(false);
  };

  const dialog = (
    <ConfirmationDialog
      open={options !== null}
      title={options?.title ?? ""}
      description={options?.description}
      confirmText={options?.confirmText}
      cancelText={options?.cancelText}
      variant={options?.variant}
      loading={loading}
      error={error}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
  );

  return { confirm, dialog };
}
