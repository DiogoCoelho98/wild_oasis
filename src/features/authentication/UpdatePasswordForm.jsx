import { useForm } from "react-hook-form";
import { useUpdateUser } from './useUpdateUser';
import Button from 'ui/Button';
import Form from 'ui/Form';
import FormRow from 'ui/FormRow';
import Input from 'ui/Input';

export default function UpdatePasswordForm() {
    const {
        register,
        handleSubmit,
        formState: {
            errors, 
            isValid
        },
        getValues,
        reset
    } = useForm();

    const { mutate: updateUser, isLoading: isUpdating } = useUpdateUser();

    function onSubmit({ password }) {
        updateUser({ password }, { onSuccess: () => reset() });
    }
    function handleReset(e) {
        e.preventDefault();
    }

    return (
        <Form onSumbit={handleSubmit(onSubmit)}>
            <FormRow
                label="Password (min. 8 characters)"
                error={errors?.password?.message}>
                    <Input 
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        disabled={isUpdating}
                        {...register("password", {
                            required: "This field is required",
                            minLength: {
                                value: "8",
                                message: "Password needs to be at least 8 characters long"
                            }
                        })}/>
            </FormRow>
            <FormRow
                label="Confirm password"
                error={errors?.passwordConfirm?.message}>
                    <Input 
                        type="password"
                        id="password"
                        autoComplete="new-password"
                        disabled={isUpdating}
                        {...register("passwordConfirmed", {
                            required: "This field is required",
                            validate: (value) => 
                                getValues().password === value || "Passwords need to match"
                        })}/>
            </FormRow>
            <FormRow>
                <Button
                    onClick={handleReset}
                    type="reset"
                    variation="secondary">
                    Cancel
                </Button>
                <Button
                    disabled={isUpdating}>
                    Update password
                </Button>
            </FormRow>
        </Form>
    );
}