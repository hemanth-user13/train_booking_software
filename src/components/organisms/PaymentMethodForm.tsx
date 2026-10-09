import { zodResolver } from "@hookform/resolvers/zod";
import { useId } from "react";
import { useForm, useWatch } from "react-hook-form";
import type { PaymentMethodType } from "../../features/payments/paymentTypes";
import { PAYMENT_TYPE_LABELS } from "../../services/paymentService";
import {
  paymentMethodSchema,
  type PaymentMethodValues,
} from "../../validation/schemas";
import Button from "../atoms/Button";
import Input from "../atoms/Input";
import Alert from "../molecules/Alert";
import FormField from "../molecules/FormField";
import SegmentedTabs from "../molecules/SegmentedTabs";

/** Only display-safe values leave this form: never the full card number, never a CVV. */
export interface PaymentMethodInput {
  type: PaymentMethodType;
  holderName?: string;
  last4?: string;
  expiry?: string;
  upiId?: string;
}

interface PaymentMethodFormProps {
  onSubmit: (input: PaymentMethodInput) => void;
  onCancel?: () => void;
}

export default function PaymentMethodForm({
  onSubmit,
  onCancel,
}: PaymentMethodFormProps) {
  const id = useId();
  const {
    register,
    handleSubmit,
    setValue,
    control,
    clearErrors,
    formState: { errors },
  } = useForm<PaymentMethodValues>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      type: "DEBIT_CARD",
      holderName: "",
      cardNumber: "4111 1111 1111 1111",
      expiry: "10/26",
      upiId: "",
    },
  });

  const type = useWatch({ control, name: "type" });
  const fieldId = (name: string) => `${id}-${name}`;

  const submit = (values: PaymentMethodValues) => {
    if (values.type === "UPI") {
      onSubmit({ type: "UPI", upiId: values.upiId.toLowerCase() });
      return;
    }
    onSubmit({
      type: values.type,
      holderName: values.holderName,
      last4: values.cardNumber.replace(/\s/g, "").slice(-4),
      expiry: values.expiry,
    });
  };

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="space-y-4">
      <SegmentedTabs
        label="Payment method type"
        value={type}
        onChange={(next) => {
          setValue("type", next);
          clearErrors();
        }}
        tabs={(Object.keys(PAYMENT_TYPE_LABELS) as PaymentMethodType[]).map(
          (value) => ({
            value,
            label: PAYMENT_TYPE_LABELS[value],
          }),
        )}
      />

      {type === "UPI" ? (
        <FormField
          label="UPI ID"
          htmlFor={fieldId("upi")}
          error={errors.upiId?.message}
          required
        >
          <Input
            id={fieldId("upi")}
            placeholder="yourname@okbank"
            invalid={!!errors.upiId}
            aria-describedby={`${fieldId("upi")}-msg`}
            {...register("upiId")}
          />
        </FormField>
      ) : (
        <>
          <FormField
            label="Name on card"
            htmlFor={fieldId("holder")}
            error={errors.holderName?.message}
            required
          >
            <Input
              id={fieldId("holder")}
              autoComplete="off"
              invalid={!!errors.holderName}
              aria-describedby={`${fieldId("holder")}-msg`}
              {...register("holderName")}
            />
          </FormField>
          <div className="grid gap-4 sm:grid-cols-[1fr_7rem]">
            <FormField
              label="Demo card number"
              htmlFor={fieldId("card")}
              error={errors.cardNumber?.message}
              hint="Only the last 4 digits are kept."
              required
            >
              <Input
                id={fieldId("card")}
                inputMode="numeric"
                autoComplete="off"
                maxLength={19}
                placeholder="4111 1111 1111 1111"
                // value={"4111 1111 1111 1111"}
                invalid={!!errors.cardNumber}
                aria-describedby={`${fieldId("card")}-msg`}
                {...register("cardNumber")}
              />
            </FormField>
            <FormField
              label="Expiry"
              htmlFor={fieldId("expiry")}
              error={errors.expiry?.message}
              required
            >
              <Input
                id={fieldId("expiry")}
                placeholder="MM/YY"
                maxLength={5}
                autoComplete="off"
                invalid={!!errors.expiry}
                aria-describedby={`${fieldId("expiry")}-msg`}
                {...register("expiry")}
              />
            </FormField>
          </div>
        </>
      )}

      <Alert tone="info">
        Demo only. Never enter real card details. No CVV is asked for or stored.
      </Alert>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit">Save payment method</Button>
      </div>
    </form>
  );
}
