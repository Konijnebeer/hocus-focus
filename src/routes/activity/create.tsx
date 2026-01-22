import {useForm} from "@tanstack/react-form";
import {createFileRoute} from "@tanstack/react-router";
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldError,
    FieldLabel,
} from "@/components/ui/field";
import {Input} from "@/components/ui/input";

import {Button} from "@/components/ui/button";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    InputGroupTextarea,
} from "@/components/ui/input-group";

export const Route = createFileRoute("/activity/create")({
    component: RouteComponent,
});

function RouteComponent() {
    const form = useForm({
        defaultValues: {
            title: "",
            description: "",
            place: '',
            time: '',
            numParticipants: '',
            imageUrl: ""
        },
        onSubmit: async ({value}) => {
            console.log("Form submitted:", value);
        },
    });

    return (
        <main className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
            <div className="w-full max-w-2xl">
                <h1 className="text-3xl font-bold mb-8 text-center">Create New Activity</h1>

                <form
                    className="flex flex-col items-center space-y-8"
                    onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        form.handleSubmit();
                    }}
                >
                    {/* Section 1: Title & Participants */}
                    <div className="flex flex-col space-y-8 border-b-4 border-solid border-gray-100 pb-8 w-full items-center">
                        <div className="flex flex-col md:flex-row items-start justify-center gap-6 w-full">
                            <form.Field name="title">
                                {(field) => (
                                    <Field>
                                        <FieldLabel htmlFor={field.name}>Activity Title</FieldLabel>
                                        <FieldContent>
                                            <Input
                                                id={field.name}
                                                name={field.name}
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                placeholder="Enter activity title"
                                                maxLength={155}
                                                className="min-w-12 resize-none"
                                            />
                                            <FieldError>{field.state.meta.errors}</FieldError>
                                        </FieldContent>
                                    </Field>
                                )}
                            </form.Field>

                            <form.Field name="numParticipants">
                                {(field) => (
                                    <Field>
                                        <FieldLabel htmlFor={field.name}>Number of participants</FieldLabel>
                                        <FieldContent>
                                            <Input
                                                id={field.name}
                                                name={field.name}
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                placeholder="Enter max. amount"
                                                maxLength={255}
                                            />
                                            <FieldError>{field.state.meta.errors}</FieldError>
                                        </FieldContent>
                                    </Field>
                                )}
                            </form.Field>
                        </div>

                        <form.Field name="description">
                            {(field) => (
                                <Field className="w-full">
                                    <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                                    <FieldContent>
                                        <InputGroup>
                                            <InputGroupTextarea
                                                id={field.name}
                                                name={field.name}
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                placeholder="Enter activity description"
                                                rows={5}
                                                className="min-h-12 resize-none"
                                            />
                                            <InputGroupAddon align="block-end">
                                                <InputGroupText className="tabular-nums">
                                                    {field.state.value.length}/500 characters
                                                </InputGroupText>
                                            </InputGroupAddon>
                                        </InputGroup>
                                        <FieldDescription>
                                            Provide details about what this activity involves
                                        </FieldDescription>
                                        <FieldError>{field.state.meta.errors}</FieldError>
                                    </FieldContent>
                                </Field>
                            )}
                        </form.Field>
                    </div>

                    {/* Section 2: Location */}
                    <div className="pt-5 flex flex-col space-y-8 border-b-4 border-solid border-gray-100 pb-8 w-full">
                        <form.Field name="place">
                            {(field) => (
                                <Field>
                                    <FieldLabel htmlFor={field.name}>Location</FieldLabel>
                                    <FieldContent>
                                        <Input
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            placeholder="Enter activity location"
                                        />
                                        <FieldError>{field.state.meta.errors}</FieldError>
                                    </FieldContent>
                                </Field>
                            )}
                        </form.Field>


                    {/* Section 3: Time */}

                        <form.Field name="time">
                            {(field) => (
                                <Field>
                                    <FieldLabel htmlFor={field.name}>Time</FieldLabel>
                                    <FieldContent>
                                        <Input
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            placeholder="Enter activity time"
                                        />
                                        <FieldError>{field.state.meta.errors}</FieldError>
                                    </FieldContent>
                                </Field>
                            )}
                        </form.Field>
                    </div>

                    {/* Section 4: Image & Submit */}
                    <div className="pt-5 flex flex-col space-y-8 w-full">
                        <form.Field name="imageUrl">
                            {(field) => (
                                <Field>
                                    <FieldLabel htmlFor={field.name}>Image URL</FieldLabel>
                                    <FieldContent>
                                        <Input
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            placeholder="/images/activity.jpg"
                                        />
                                        <FieldDescription>
                                            Enter the URL or path to the activity image
                                        </FieldDescription>
                                        <FieldError>{field.state.meta.errors}</FieldError>
                                    </FieldContent>
                                </Field>
                            )}
                        </form.Field>

                        <div className="flex gap-4 justify-end">
                            <Button type="submit">Create Activity</Button>
                        </div>
                    </div>
                </form>
            </div>
        </main>
    )
        ;
}
