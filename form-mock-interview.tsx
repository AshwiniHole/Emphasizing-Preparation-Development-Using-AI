import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { db } from "@/config/firebase.config";
import { chatSession } from "@/scripts";
import { Interview } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { Loader, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { CustomBreadCrumb } from "./custom-bread-crumb";
import { Headings } from "./headings";
import { Button } from "./ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { Textarea } from "./ui/textarea";
import { useAuth } from "@clerk/clerk-react";

interface FormMockInterviewProps {
  initialData: Interview | null;
}

const formSchema = z.object({
  position: z
    .string()
    .min(1, "Position is required")
    .max(100, "Position must be 100 characters or less"),
  description: z.string().min(10, "Description is required"),
  jobIndustry: z.string().min(1, "Job Industry is required"),
  experience: z.coerce
    .number()
    .min(0, "Experience cannot be empty or negative"),
  techStack: z.string().min(1, "Tech stack must be at least a character"),
  level: z.string().min(1, "Level is required"),
});

type FormData = z.infer<typeof formSchema>;

export const FormMockInterview = ({ initialData }: FormMockInterviewProps) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {},
  });

  const { isValid, isSubmitting } = form.formState;
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { userId } = useAuth();

  const title = initialData
    ? initialData.position
    : "Create a new mock interview";

  const breadCrumpPage = initialData ? initialData?.position : "Create";
  const actions = initialData ? "Save Changes" : "Create";
  const toastMessage = initialData
    ? { title: "Updated..!", description: "Changes saved successfully..." }
    : { title: "Created..!", description: "New Mock Interview created..." };

  const cleanAiResponse = (responseText: string) => {
    let cleanText = responseText.trim();
    cleanText = cleanText.replace(/(json|```|`)/g, "");
    const jsonArrayMatch = cleanText.match(/\[.*\]/s);
    if (jsonArrayMatch) {
      cleanText = jsonArrayMatch[0];
    } else {
      throw new Error("No JSON array found in response");
    }

    try {
      return JSON.parse(cleanText);
    } catch (error) {
      throw new Error("Invalid JSON format: " + (error as Error)?.message);
    }
  };

  const generateAiResponse = async (data: FormData) => {
    const prompt = `As an experienced prompt engineer, generate a JSON array containing EXACTLY 5 technical interview questions along with detailed answers based on the following job information. Each object in the array should have the fields "question" and "answer", formatted as follows:

        [
          { "question": "<Question text>", "answer": "<Answer text>" },
          ...
        ]

        Job Information:
        - Job Position: ${data?.position}
        - Job Industry/Stream: ${data?.jobIndustry}
        - Job Description: ${data?.description}
        - Years of Experience Required: ${data?.experience}
        - Tech Stacks: ${data?.techStack}
        - Difficulty Level: ${data?.level}

        The questions should assess skills in ${data?.techStack} development and best practices, problem-solving, and experience handling complex requirements within the ${data?.jobIndustry} industry.
        
        CRITICAL REQUIREMENT: The questions MUST strictly match the ${data?.level} difficulty level.
        - If "Easy": Only ask fundamental concepts, basic syntax, and definitions.
        - If "Medium": Ask about application scenarios, standard problem-solving, and common design patterns.
        - If "Hard": Ask challenging questions about core system design, edge cases, complex memory/performance optimizations, and architecture.

        Please format the output strictly as an array of JSON objects without any additional labels, code blocks, or explanations. Return only the JSON array with questions and answers. Do not use markdown formatting.`;

    const aiResult = await chatSession.sendMessage(prompt);
    const cleanedResponse = cleanAiResponse(aiResult.response.text());
    return cleanedResponse;
  };

  const onSubmit = async (data: FormData) => {
    if (!isValid) {
      return; // Stop if the form is not valid
    }

    try {
      setLoading(true);
      const aiResult = await generateAiResponse(data);

      if (initialData) {
        // update
        await updateDoc(doc(db, "interviews", initialData?.id), {
          questions: aiResult,
          ...data,
          updatedAt: serverTimestamp(),
        });
        toast(toastMessage.title, { description: toastMessage.description });
      } else {
        // create a new mock interview
        await addDoc(collection(db, "interviews"), {
          ...data,
          userId,
          questions: aiResult,
          createdAt: serverTimestamp(),
        });
        toast(toastMessage.title, { description: toastMessage.description });
      }

      navigate("/generate", { replace: true });
    } catch (error) {
      console.error("Error creating interview:", error);
      toast.error("Error..", {
        description: `Something went wrong. Please try again later. Error: ${(error as Error).message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    if (initialData && window.confirm("Are you sure you want to delete this interview?")) {
      try {
        await deleteDoc(doc(db, "interviews", initialData.id));
        toast.success("Mock Interview deleted successfully");
        navigate("/generate", { replace: true });
      } catch (error) {
        console.log(error);
        toast.error("Error..", {
          description: `Failed to delete interview. Please try again later.`,
        });
      }
    }
  };

  useEffect(() => {
    if (initialData) {
      form.reset({
        position: initialData.position,
        jobIndustry: initialData.jobIndustry || "",
        description: initialData.description,
        experience: initialData.experience,
        techStack: initialData.techStack,
        level: initialData.level || "",
      });
    }
  }, [initialData, form]);

  return (
    <div className="w-full flex-col space-y-4">
      <CustomBreadCrumb
        breadCrumbPage={breadCrumpPage} // change breadCrumpPage to breadCrumbPage
        breadCrumpItems={[{ label: "Mock Interviews", link: "/generate" }]}
      />

      <div className="mt-4 flex items-center justify-between w-full">
        <Headings title={title} isSubHeading />

        {initialData && (
          <Button size={"icon"} variant={"ghost"} onClick={onDelete}>
            <Trash2 className="min-w-4 min-h-4 text-red-500" />
          </Button>
        )}
      </div>

      <Separator className="my-4" />

      <div className="my-6"></div>

      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full p-8 rounded-lg flex-col flex items-start justify-start gap-6 shadow-md "
        >
          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem className="w-full space-y-4">
                <div className="w-full flex items-center justify-between">
                  <FormLabel>Job Role / Job Position</FormLabel>
                  <FormMessage className="text-sm" />
                </div>
                <FormControl>
                  <Input
                    className="h-12"
                    disabled={loading}
                    placeholder="eg:- Full Stack Developer"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="jobIndustry"
            render={({ field }) => (
              <FormItem className="w-full space-y-4">
                <div className="w-full flex items-center justify-between">
                  <FormLabel>Job Industry / Stream</FormLabel>
                  <FormMessage className="text-sm" />
                </div>
                <FormControl>
                  <Input
                    className="h-12"
                    disabled={loading}
                    placeholder="eg:- Computer Engineering, Civil Engineering, Marketing"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="w-full space-y-4">
                <div className="w-full flex items-center justify-between">
                  <FormLabel>Job Description</FormLabel>
                  <FormMessage className="text-sm" />
                </div>
                <FormControl>
                  <Textarea
                    className="h-12"
                    disabled={loading}
                    placeholder="eg:- describe your job role"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="experience"
            render={({ field }) => (
              <FormItem className="w-full space-y-4">
                <div className="w-full flex items-center justify-between">
                  <FormLabel>Years of Experience</FormLabel>
                  <FormMessage className="text-sm" />
                </div>
                <FormControl>
                  <Input
                    type="number"
                    className="h-12"
                    disabled={loading}
                    placeholder="eg:- 5 Years"
                    min="0"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="level"
            render={({ field }) => (
              <FormItem className="w-full space-y-4">
                <div className="w-full flex items-center justify-between">
                  <FormLabel>Difficulty Level</FormLabel>
                  <FormMessage className="text-sm" />
                </div>
                <Select
                  disabled={loading}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select Level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="techStack"
            render={({ field }) => (
              <FormItem className="w-full space-y-4">
                <div className="w-full flex items-center justify-between">
                  <FormLabel>Tech Stacks</FormLabel>
                  <FormMessage className="text-sm" />
                </div>
                <FormControl>
                  <Textarea
                    className="h-12"
                    disabled={loading}
                    placeholder="eg:- React, Typescript..."
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="w-full flex items-center justify-end gap-6">
            <Button
              type="button"
              size={"sm"}
              variant={"outline"}
              disabled={isSubmitting || loading}
              onClick={() => form.reset({
                position: "",
                jobIndustry: "",
                description: "",
                experience: 0,
                techStack: "",
                level: "",
              })}
            >
              Reset
            </Button>
            <Button
              type="submit"
              size={"sm"}
              disabled={isSubmitting || loading || !isValid}
            >
              {loading ? (
                <Loader className="text-gray-50 animate-spin" />
              ) : (
                actions
              )}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};
