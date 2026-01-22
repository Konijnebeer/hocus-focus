import { useForm } from "@tanstack/react-form";
import { createFileRoute } from "@tanstack/react-router";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
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
      imageUrl: "",
    },
    onSubmit: async ({ value }) => {
      console.log("Form submitted:", value);
    },
  });

  return (
    <main className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Create New Activity</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <div className="space-y-6">
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
                  />

                  <FieldError>{field.state.meta.errors}</FieldError>
                </FieldContent>
              </Field>
            )}
          </form.Field>

          <form.Field name="description">
            {(field) => (
              <Field>
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
                      // aria-invalid={isInvalid}
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
    </main>
  );
}
