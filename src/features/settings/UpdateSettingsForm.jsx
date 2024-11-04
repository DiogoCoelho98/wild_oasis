import { useSettings } from "./useSettings";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow.jsx";
import Input from "../../ui/Input";
import Spinner from "../../ui/Spinner.jsx";

export default function UpdateSettingsForm() {
  const {
    isPending,
    settings: {
      minBookingLength,
      maxBookingLength,
      maxNumberGuetsPerBooking,
      breakfastPrice,
    } = {},
  } = useSettings();

  if (isPending) {
    return <Spinner />;
  }

  return (
    <Form>
      <FormRow label="Minimum nights/booking">
        <Input type="number" id="min-nights" defaultValue={minBookingLength} />
      </FormRow>
      <FormRow label="Maximum nights/booking">
        <Input type="number" id="max-nights" defaultValue={maxBookingLength} />
      </FormRow>
      <FormRow label="Maximum guests/booking">
        <Input
          type="number"
          id="max-guests"
          defaultValue={maxNumberGuetsPerBooking}
        />
      </FormRow>
      <FormRow label="Breakfast price">
        <Input
          type="number"
          id="breakfast-price"
          defaultValue={breakfastPrice}
        />
      </FormRow>
    </Form>
  );
}
