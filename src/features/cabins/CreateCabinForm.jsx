import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEditCabin } from "../../services/apiCabins";
import styled from "styled-components";
import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Textarea from "../../ui/Textarea";
import toast from "react-hot-toast";

const FormRow = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 24rem 1fr 1.2fr;
  gap: 2.4rem;
  padding: 1.2rem 0;

  &:first-child {
    padding-top: 0;
  }

  &:last-child {
    padding-bottom: 0;
  }

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-100);
  }

  &:has(button) {
    display: flex;
    justify-content: flex-end;
    gap: 1.2rem;
  }
`;

const Label = styled.label`
  font-weight: 500;
`;

const Error = styled.span`
  font-size: 1.4rem;
  color: var(--color-red-700);
`;

export default function CreateCabinForm({ cabinToEdit = {} }) {
  const { id: editId, ...editValues } = cabinToEdit;

  // DETERMINE IF THE CABIN WILL BE CREATED OR EDITED
  const isEditSession = Boolean(editId);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    setError,
  } = useForm({
    defaultValues: isEditSession ? editValues : {},
  });

  const queryClient = useQueryClient();
  const { mutate: mutateCreate, isPending: isCreating } = useMutation({
    mutationFn: createEditCabin,
    onSuccess: () => {
      toast.success("Cabin added successfully");
      queryClient.invalidateQueries({
        queryKey: ["cabins"],
      });
      reset();
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || error.message || "An error occurred";
      toast.error(message);
    },
  });

  const { mutate: mutateEdit, isPending: isEditing } = useMutation({
    mutationFn: ({ newCabinData, id }) => createEditCabin(newCabinData, id),
    onSuccess: () => {
      toast.success("Cabin edited successfully");
      queryClient.invalidateQueries({
        queryKey: ["cabins"],
      });
      reset();
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || error.message || "An error occurred";
      toast.error(message);
    },
  });

  // PENDING STATE WHEN CREATING/EDITING
  const isWorking = isCreating || isEditing;

  function handleOnSubmit(formData) {
    // DETERMINE THE IMG: NEW OR EXISTING
    const image =
      typeof formData.image === "string" ? formData.image : formData.image[0];

    // USE EXISTING IMG
    const finalImage =
      isEditSession && !formData.image[0] ? editValues.image : image;

    // IMG TYPE VALIDATION ONLY IF NEW IMG
    const acceptedTypes = ["image/jpeg", "image/png"];
    if (
      !isEditSession &&
      formData.image[0] &&
      !acceptedTypes.includes(formData.image[0]?.type)
    ) {
      setError("image", {
        type: "manual",
        message:
          "Invalid image format. Only .jpeg and .png formats are allowed.",
      });
      return;
    }

    // SUBMIT FORM WITH THE FINAL IMAGE
    if (isEditSession) {
      mutateEdit({
        newCabinData: { ...formData, image: finalImage },
        id: editId,
      });
    } else {
      mutateCreate({ ...formData, image: finalImage });
    }
  }

  function handleErrors(formErrors) {
    /* console.log(formErrors); */
  }

  const formValidation = {
    name: {
      required: "Cabin name cannot be empty",
      minLength: {
        value: 3,
        message: "Cabin name must be at least 3 characters",
      },
      validate: (value) => typeof value === "string" || "Name must be a string",
    },
    maxCapacity: {
      required: "Maximum capacity cannot be empty",
      min: {
        value: 1,
        message: "Maximum capacity cannot be 0 or negative",
      },
    },
    regularPrice: {
      required: "Regular price cannot be empty",
      min: {
        value: 1,
        message: "Regular price cannot be 0 or negative",
      },
    },
    discount: {
      required: "Discount needs to be greater or equal to 0",
      min: {
        value: 0,
        message: "Discount cannot be negative",
      },
      validate: (value) => {
        const numValue = Number(value);
        const regularPrice = Number(getValues("regularPrice"));
        return (
          !isNaN(numValue) &&
          (numValue < regularPrice ||
            "Discount needs to be less than regular price")
        );
      },
    },
    description: {
      required: "Add a brief description to the cabin",
      maxLength: {
        value: 500,
        message: "Description cannot exceed 500 characters",
      },
    },
  };

  return (
    <Form onSubmit={handleSubmit(handleOnSubmit, handleErrors)}>
      <FormRow>
        <Label htmlFor="name">Cabin name</Label>
        <Input
          type="text"
          id="name"
          required
          disabled={isWorking}
          {...register("name", formValidation.name)}
        />
        {errors?.name && <Error>{errors.name.message}</Error>}
      </FormRow>

      <FormRow>
        <Label htmlFor="maxCapacity">Maximum capacity</Label>
        <Input
          type="number"
          id="maxCapacity"
          defaultValue={1}
          min={1}
          required
          disabled={isWorking}
          {...register("maxCapacity", formValidation.maxCapacity)}
        />
        {errors.maxCapacity && <Error>{errors.maxCapacity.message}</Error>}
      </FormRow>

      <FormRow>
        <Label htmlFor="regularPrice">Regular price</Label>
        <Input
          type="number"
          id="regularPrice"
          defaultValue={1}
          min={1}
          disabled={isWorking}
          required
          {...register("regularPrice", formValidation.regularPrice)}
        />
        {errors.regularPrice && <Error>{errors.regularPrice.message}</Error>}
      </FormRow>

      <FormRow>
        <Label htmlFor="discount">Discount</Label>
        <Input
          type="number"
          id="discount"
          defaultValue={0}
          min={0}
          disabled={isWorking}
          required
          {...register("discount", formValidation.discount)}
        />
        {errors.discount && <Error>{errors.discount.message}</Error>}
      </FormRow>

      <FormRow>
        <Label htmlFor="description">Cabin description</Label>
        <Textarea
          type="number"
          id="description"
          defaultValue=""
          placeholder="Add a brief description"
          disabled={isWorking}
          required
          {...register("description", formValidation.description)}
        />
        {errors.description && <Error>{errors.description.message}</Error>}
      </FormRow>

      <FormRow>
        <Label htmlFor="image">Cabin photo</Label>
        <FileInput
          id="image"
          accept=".jpeg, .jpg, .png"
          {...register("image", {
            required: isEditSession ? false : "Please upload a cabin photo",
          })}
        />
        {errors.image && <Error>{errors.image.message}</Error>}
      </FormRow>

      <FormRow>
        <Button variation="secondary" type="reset">
          Cancel
        </Button>
        <Button disabled={isWorking}>
          {isEditSession ? "Edit" : "Create"}
        </Button>
      </FormRow>
    </Form>
  );
}
