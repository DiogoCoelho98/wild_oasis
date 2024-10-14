import { useUser } from 'features/authentication/useUser';
import { useState } from 'react';
import { useUpdateUser } from './useUpdateUser';
import Button from 'ui/Button';
import FileInput from 'ui/FileInput';
import Form from 'ui/Form';
import FormRow from 'ui/FormRow';
import Input from 'ui/Input';


export default function UpdateUserDataForm() {
    const [ fullName, setFullName ] = useState("");
    const [ avatar, setAvatar ] = useState("");

    const {
        user: {
            email,
            userMetaData: {
                fullName: currentFullName
            }
        }
    } = useUser();

    const {
        mutate: updateUser,
        isLoading: isUpdating
    } = useUpdateUser();

    function handleSubmit(e) {
        e.preventDefault();
        if (!fullName) {
            return
        }
        updateUser(
            {
                fullName,
                avatar
            },
            {
                onSuccess: () => {
                    setAvatar(null);
                    e.target.reset();
                }
            }
        )
    }

    function handleCancel() {
        setFullName(currentFullName);
        setAvatar(null);
    }

    return (
        <Form onSubmit={handleSubmit}>
            <FormRow>
                <Input 
                    value={email}
                    disabled/>
            </FormRow>
            <FormRow
                label="Full name">
                    <Input 
                        type="text"
                        id="fullname"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        disabled={isUpdating}/>
            </FormRow>
            <FormRow
                label="Avatar image">
                <FileInput
                    id="avatar"
                    accept="image/*"
                    onChange={(e) => setAvatar(e.target.value)}/>
            </FormRow>
            <FormRow>
                <Button
                    onClick={handleCancel}
                    type="reset"
                    variation="secondary">
                        Cancel
                </Button>
                <Button
                    disabled={isUpdating}>
                        Update account
                </Button>
            </FormRow>
        </Form>
    );
}