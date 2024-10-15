import { useForm } from 'react-hook-form';
import { useCreateCabin } from 'features/cabins/useCreateCabin';
import { useEditCabin } from './useEditCabin';
import { Textarea } from 'ui/Textarea';
import FormRow from 'ui/FormRow';
import Input from 'ui/Input';
import Form from 'ui/Form';
import Button from 'ui/Button';
import FileInput from 'ui/FileInput';

export default function CreateCabinForm({ cabinToEdit, closeModal }) {
  const { mutate: createCabin, isLoading: isCreating } = useCreateCabin();
  const { mutate: editCabin, isLoading: isEditing } = useEditCabin();
  const isWorking = isCreating || isEditing;

  const { id: editId, ...editValues } = cabinToEdit || {};
  delete editValues.created_at;
  const isEditSession = Boolean(editId);

  const { 
    register, 
    handleSubmit, 
    formState: {
        errors
    }, 
    reset, 
    getValues 
} = useForm({
    defaultValues: isEditSession ? editValues : {},
  });

  const onSubmit = function (data) {

    const options = {
      onSuccess: (data) => {
        closeModal?.();
        reset();
      },
    };

    const image = typeof data.image === 'object' ? data.image[0] : data.image;

    if (isEditSession) {
        editCabin(
            {
              newCabinData: { ...data, image },
              id: editId,
            },
            options
          );
    } else {
        createCabin({ ...data, image }, options);
    }
  };

  const onError = function (errors) {
    console.log('Failed validation!', errors);
  };
  
  return (
    <Form onSubmit={handleSubmit(onSubmit, onError)} type='modal'>
      <FormRow label='Cabin name' error={errors?.name?.message}>
        <Input
          type='text'
          id='name'
          disabled={isWorking}
          {...register('name', { required: 'This field is required' })}/>
      </FormRow>

      <FormRow label='Maximum capacity' error={errors?.maxCapacity?.message}>
        <Input
          type='number'
          id='maxCapacity'
          disabled={isWorking}
          {...register('maxCapacity', {
            required: 'This field is required',
            min: {
              value: 1,
              message: 'Capacity should be at least 1',
            },
          })}/>
      </FormRow>

      <FormRow label='Regular price' error={errors?.regularPrice?.message}>
        <Input
          type='number'
          id='regularPrice'
          disabled={isWorking}
          {...register('regularPrice', {
            required: 'This field is required',
            min: {
              value: 1,
              message: 'Price should be at least 1',
            },
          })}/>
      </FormRow>

      <FormRow label='Discount' error={errors?.discount?.message}>
        <Input
          type='number'
          id='discount'
          defaultValue={0}
          disabled={isWorking}
          {...register('discount', {
            required: "Can't be empty, make it at least 0",
            validate: (value) =>
              getValues().regularPrice >= value ||
              'Discount should be less than regular price',
          })}/>
      </FormRow>

      <FormRow
        label='Description for website'
        error={errors?.description?.message}>
        <Textarea
          type='number'
          id='description'
          defaultValue=''
          disabled={isWorking}
          {...register('description', { required: 'This field is required' })}/>
      </FormRow>

      <FormRow label='Cabin photo' error={errors?.image?.message}>
        <FileInput
          id='image'
          accept='image/*'
          disabled={isWorking}
          {...register('image', {
            required: isEditSession ? false : 'This field is required',
          })}/>
      </FormRow>

      <FormRow>
        <Button
          variation='secondary'
          type='reset'
          disabled={isWorking}
          onClick={() => closeModal?.()}>
            Cancel
        </Button>
        <Button 
          disabled={isWorking}>
            {isEditSession ? 'Edit cabin' : 'Create new cabin'}
        </Button>
      </FormRow>
    </Form>
  );
}

