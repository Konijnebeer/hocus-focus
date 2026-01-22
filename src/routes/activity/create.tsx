import { useForm } from "@tanstack/react-form";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { saveActivity } from "@/database/activityDb";
import type { Activity } from "@/database/activityDb";
import { useState } from "react";

export const Route = createFileRoute("/activity/create")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      category: "yoga" as "yoga" | "hiking" | "pilates",
      location: "",
      duration: "",
      date: "",
      hour: "",
      numParticipants: "",
      image: "",
    },
    onSubmit: async ({ value }) => {
      try {
        setIsSubmitting(true);
        setError(null);

        // Get logged-in user
        const loggedInUserId = localStorage.getItem("loggedInUserId");
        if (!loggedInUserId) {
          setError("You must be logged in to create an activity");
          setIsSubmitting(false);
          return;
        }

        // Validate required fields
        if (
          !value.title ||
          !value.description ||
          !value.location ||
          !value.date ||
          !value.hour
        ) {
          setError("Please fill in all required fields");
          setIsSubmitting(false);
          return;
        }

        // Create activity object
        const activity: Activity = {
          id: `activity-${Date.now()}`,
          title: value.title,
          description: value.description,
          category: value.category,
          location: value.location,
          duration: parseInt(value.duration) || 60,
          date: value.date,
          hour: value.hour,
          numParticipants: parseInt(value.numParticipants) || 10,
          image: value.image || "/images/default.jpg",
          status: "active",
          creatorId: loggedInUserId,
          createdAt: Math.floor(Date.now() / 1000),
        };

        // Save to database
        await saveActivity(activity);

        // Navigate to the activity page
        navigate({ to: "/activity/$id", params: { id: activity.id } });
      } catch (err) {
        console.error("Error creating activity:", err);
        setError("Failed to create activity. Please try again.");
        setIsSubmitting(false);
      }
    },
  });

  return (
    <main className="min-h-screen bg-background flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-8 text-center text-foreground">
          Create New Activity
        </h1>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive rounded-md">
            <p className="text-destructive text-sm">{error}</p>
          </div>
        )}

        <form
          className="flex flex-col items-center space-y-8"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          {/* Section 1: Title & Category */}
          <div className="flex flex-col space-y-8 border-b-4 border-solid border-border pb-8 w-full items-center">
            <div className="flex flex-col md:flex-row items-start justify-center gap-6 w-full">
              <form.Field name="title">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>
                      Activity Title *
                    </FieldLabel>
                    <FieldContent>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Enter activity title"
                        maxLength={155}
                        required
                      />
                      <FieldError>{field.state.meta.errors}</FieldError>
                    </FieldContent>
                  </Field>
                )}
              </form.Field>

              <form.Field name="category">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Category *</FieldLabel>
                    <FieldContent>
                      <Select
                        value={field.state.value}
                        onValueChange={(value) =>
                          field.handleChange(
                            value as "yoga" | "hiking" | "pilates",
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yoga">Yoga</SelectItem>
                          <SelectItem value="hiking">Hiking</SelectItem>
                          <SelectItem value="pilates">Pilates</SelectItem>
                        </SelectContent>
                      </Select>
                      <FieldError>{field.state.meta.errors}</FieldError>
                    </FieldContent>
                  </Field>
                )}
              </form.Field>
            </div>

            <form.Field name="description">
              {(field) => (
                <Field className="w-full">
                  <FieldLabel htmlFor={field.name}>Description *</FieldLabel>
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
                        required
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

          {/* Section 2: Location & Details */}
          <div className="pt-5 flex flex-col space-y-8 border-b-4 border-solid border-border pb-8 w-full">
            <form.Field name="location">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Location *</FieldLabel>
                  <FieldContent>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Enter activity location"
                      required
                    />
                    <FieldError>{field.state.meta.errors}</FieldError>
                  </FieldContent>
                </Field>
              )}
            </form.Field>

            <div className="flex flex-col md:flex-row items-start justify-center gap-6 w-full">
              <form.Field name="duration">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>
                      Duration (minutes)
                    </FieldLabel>
                    <FieldContent>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="number"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="60"
                        min="1"
                      />
                      <FieldError>{field.state.meta.errors}</FieldError>
                    </FieldContent>
                  </Field>
                )}
              </form.Field>

              <form.Field name="numParticipants">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>
                      Max Participants
                    </FieldLabel>
                    <FieldContent>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="number"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="10"
                        min="1"
                      />
                      <FieldError>{field.state.meta.errors}</FieldError>
                    </FieldContent>
                  </Field>
                )}
              </form.Field>
            </div>
          </div>

          {/* Section 3: Date & Time */}
          <div className="pt-5 flex flex-col space-y-8 border-b-4 border-solid border-border pb-8 w-full">
            <div className="flex flex-col md:flex-row items-start justify-center gap-6 w-full">
              <form.Field name="date">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Date *</FieldLabel>
                    <FieldContent>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="date"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        required
                      />
                      <FieldError>{field.state.meta.errors}</FieldError>
                    </FieldContent>
                  </Field>
                )}
              </form.Field>

              <form.Field name="hour">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Time *</FieldLabel>
                    <FieldContent>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="time"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        required
                      />
                      <FieldError>{field.state.meta.errors}</FieldError>
                    </FieldContent>
                  </Field>
                )}
              </form.Field>
            </div>
          </div>

          {/* Section 4: Image & Submit */}
          <div className="pt-5 flex flex-col space-y-8 w-full">
            <form.Field name="image">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Activity Image</FieldLabel>
                  <FieldContent>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="file"
                      accept="image/*"
                      onBlur={field.handleBlur}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          // Convert to base64 data URL
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            const result = reader.result as string;
                            field.handleChange(result);
                            setImagePreview(result);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    {imagePreview && (
                      <div className="mt-4">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full max-w-md h-48 object-cover rounded-lg border border-border"
                        />
                      </div>
                    )}
                    <FieldDescription>
                      Upload an image for your activity
                    </FieldDescription>
                    <FieldError>{field.state.meta.errors}</FieldError>
                  </FieldContent>
                </Field>
              )}
            </form.Field>

            <div className="flex gap-4 justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Activity"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
