import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCabin } from "../../services/apiCabins";
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

export default function CreateCabinForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
  } = useForm();

  const queryClient = useQueryClient();
  const { mutate, isPending: isCreating } = useMutation({
    mutationFn: createCabin,
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
      /* console.log("Error from server:", message); */
    },
  });

  function handleOnSubmit(formData) {
    mutate({ ...formData, image: formData.image[0] });
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
          required
          {...register("description", formValidation.description)}
        />
        {errors.description && <Error>{errors.description.message}</Error>}
      </FormRow>

      <FormRow>
        <Label htmlFor="image">Cabin photo</Label>
        <FileInput
          id="image"
          accept="image/*"
          {...register("image", { required: "Please upload a cabin photo" })}
        />
        {errors.image && <Error>{errors.image.message}</Error>}
      </FormRow>

      <FormRow>
        <Button variation="secondary" type="reset">
          Cancel
        </Button>
        <Button disabled={isCreating}>Add cabin</Button>
      </FormRow>
    </Form>
  );
}
