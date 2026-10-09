import { CreditCard, Plus, Trash } from "lucide-react";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import Button from "../components/atoms/Button";
import Card from "../components/atoms/Card";
import EmptyState from "../components/molecules/EmptyState";
import PageHeader from "../components/molecules/PageHeader";
import PaymentMethodCard from "../components/molecules/PaymentMethodCard";
import Modal from "../components/organisms/Modal";
import PaymentMethodForm from "../components/organisms/PaymentMethodForm";
import {
  paymentMethodRemoved,
  selectMyPaymentMethods,
} from "../features/payments/paymentsSlice";
import type { PaymentMethod } from "../features/payments/paymentTypes";
import { useAddPaymentMethod } from "../hooks/useAddPaymentMethod";
import { useConfirmation } from "../hooks/useConfirmation";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useToast } from "../hooks/useToast";
import { paymentMethodLabel } from "../services/paymentService";

export default function PaymentMethodsPage() {
  useDocumentTitle("Payment methods");
  const dispatch = useAppDispatch();
  const methods = useAppSelector(selectMyPaymentMethods);
  const addMethod = useAddPaymentMethod();
  const { showToast } = useToast();
  const { confirm, dialog } = useConfirmation();
  const [adding, setAdding] = useState(false);

  const handleRemove = async (method: PaymentMethod) => {
    const accepted = await confirm({
      title: "Remove this payment method?",
      description: `${paymentMethodLabel(method)} will no longer be offered at checkout.`,
      confirmText: "Remove",
      cancelText: "Keep it",
      variant: "danger",
    });
    if (!accepted) return;
    dispatch(paymentMethodRemoved(method.id));
    showToast("Payment method removed.");
  };

  const addButton = (
    <Button onClick={() => setAdding(true)}>
      <Plus aria-hidden="true" className="size-4" /> Add payment method
    </Button>
  );

  return (
    <>
      <PageHeader
        title="Payment methods"
        description="Simulated cards and UPI IDs for demo checkouts. Only masked references are stored."
        breadcrumbs={[
          { label: "Profile", to: "/customer/profile" },
          { label: "Payment methods" },
        ]}
        actions={methods.length > 0 && addButton}
      />

      {methods.length === 0 ? (
        <EmptyState
          icon={CreditCard}
          title="No payment methods yet"
          description="Add a demo debit card, credit card or UPI ID to pay for tickets."
          action={addButton}
        />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {methods.map((method) => (
            <Card key={method.id} className="p-4">
              <PaymentMethodCard
                method={method}
                actions={
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={() => handleRemove(method)}
                    aria-label={`Remove ${paymentMethodLabel(method)}`}
                  >
                    <Trash aria-hidden="true" className="size-4" />
                  </Button>
                }
              />
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={adding}
        onClose={() => setAdding(false)}
        title="Add payment method"
      >
        <PaymentMethodForm
          onSubmit={(input) => {
            addMethod(input);
            setAdding(false);
          }}
          onCancel={() => setAdding(false)}
        />
      </Modal>
      {dialog}
    </>
  );
}
