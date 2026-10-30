import { Headings } from "@/components/headings";
import { InterviewPin } from "@/components/pin";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { db } from "@/config/firebase.config";
import { Interview } from "@/types";
import { useAuth } from "@clerk/clerk-react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export const Dashboard = () => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(false);
  const { userId } = useAuth();

  useEffect(() => {
    setLoading(true);
    const interviewQuery = query(
      collection(db, "interviews"),
      where("userId", "==", userId)
    );

    const unsubscribe = onSnapshot(
      interviewQuery,
      (snapshot) => {
        const interviewList: Interview[] = snapshot.docs.map((doc) => {
          const id = doc.id;
          return {
            id,
            ...doc.data(),
          };
        }) as Interview[];
        setInterviews(interviewList);
        setLoading(false);
      },
      (error) => {
        console.log("Error on fetching : ", error);
        toast.error("Error..", {
          description: "SOmething went wrong.. Try again later..",
        });
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  return (
    <>
      <div className="flex w-full items-center justify-between">
        {/* headings */}
        <div className="space-y-1">
          <Headings
            title="Dashboard"
            description="Create and start your AI Mock Interview"
            isSubHeading
          />
          <p className="text-sm text-muted-foreground">
            Manage your interviews and track your progress.
          </p>
        </div>
        <Link to={"/generate/create"}>
          <Button size={"sm"}>
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Button>
        </Link>
      </div>

      <Separator className="my-8" />
      {/* content section */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-4">
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-40 rounded-xl" />
          ))
        ) : interviews.length > 0 ? (
          interviews.map((interview) => (
            <InterviewPin key={interview.id} interview={interview} />
          ))
        ) : (
          <div className="col-span-full w-full flex flex-col items-center justify-center py-12 text-center">
            <div className="bg-muted/30 p-8 rounded-full mb-4">
              <img
                src="/assets/svg/not-found.svg"
                className="w-32 h-32 object-contain opacity-60"
                alt="No data"
              />
            </div>

            <h2 className="text-xl font-semibold text-foreground">
              No Interviews Found
            </h2>

            <p className="max-w-md text-sm text-muted-foreground mt-2">
              You haven't created any mock interviews yet. Click the button below to get started with your first AI-powered interview.
            </p>

            <Link to={"/generate/create"} className="mt-6">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create New Interview
              </Button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
};
