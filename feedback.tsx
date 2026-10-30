import { db } from "@/config/firebase.config";
import { Interview, UserAnswer } from "@/types";
import { useAuth } from "@clerk/clerk-react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { LoaderPage } from "./loader-page";
import { CustomBreadCrumb } from "@/components/custom-bread-crumb";
import { Headings } from "@/components/headings";
import { InterviewPin } from "@/components/pin";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { CircleCheck, Star } from "lucide-react";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

export const Feedback = () => {
  const { interviewId } = useParams<{ interviewId: string }>();
  const [interview, setInterview] = useState<Interview | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [feedbacks, setFeedbacks] = useState<UserAnswer[]>([]);
  const [activeFeed, setActiveFeed] = useState("");
  const { userId } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!interviewId) {
      navigate("/generate", { replace: true });
    }
  }, [interviewId, navigate]);

  useEffect(() => {
    if (interviewId) {
      const fetchInterview = async () => {
        try {
          const interviewDoc = await getDoc(doc(db, "interviews", interviewId));
          if (interviewDoc.exists()) {
            setInterview({
              id: interviewDoc.id,
              ...interviewDoc.data(),
            } as Interview);
          }
        } catch (error) {
          console.error(error);
        }
      };

      const fetchFeedbacks = async () => {
        setIsLoading(true);
        try {
          const querySnapRef = query(
            collection(db, "userAnswers"),
            where("userId", "==", userId),
            where("mockIdRef", "==", interviewId)
          );

          const querySnap = await getDocs(querySnapRef);

          const interviewData: UserAnswer[] = querySnap.docs.map((doc) => {
            return { id: doc.id, ...doc.data() } as UserAnswer;
          });

          // Sort by createdAt descending so latest attempts come first
          interviewData.sort((a, b) => {
            const aTime = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
            const bTime = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
            return bTime - aTime;
          });

          // Keep only the latest answer for each unique question
          const uniqueFeedbacks: UserAnswer[] = [];
          const seenQuestions = new Set<string>();

          for (const feed of interviewData) {
            if (!seenQuestions.has(feed.question)) {
              seenQuestions.add(feed.question);
              uniqueFeedbacks.push(feed);
            }
          }

          setFeedbacks(uniqueFeedbacks);
        } catch (error) {
          console.error(error);
          toast("Error", {
            description: "Something went wrong. Please try again later.",
          });
        } finally {
          setIsLoading(false);
        }
      };

      fetchInterview();
      fetchFeedbacks();
    }
  }, [interviewId, userId]);

  const overAllRating = useMemo(() => {
    if (feedbacks.length === 0) return "0.0";
    const totalRatings = feedbacks.reduce((acc, f) => acc + f.rating, 0);
    return (totalRatings / feedbacks.length).toFixed(1);
  }, [feedbacks]);

  const { totalQuestions, attemptedQuestions, missedQuestions } = useMemo(() => {
    const total = interview?.questions?.length || 0;
    const attempted = feedbacks.length;
    return {
      totalQuestions: total,
      attemptedQuestions: attempted,
      missedQuestions: Math.max(0, total - attempted),
    };
  }, [interview, feedbacks]);

  const areasForImprovement = useMemo(() => {
    if (!feedbacks.length) return [];
    // Sort by rating ascending, take the lowest 3
    return [...feedbacks]
      .sort((a, b) => a.rating - b.rating)
      .slice(0, 3)
      .filter((f) => f.improvementTips)
      .map((f) => ({
        id: f.id,
        question: f.question,
        tip: f.improvementTips,
      }));
  }, [feedbacks]);

  const emotionIcons: Record<string, string> = {
    confident: "🟢 Confident",
    fear: "🔴 Fearful",
    neutral: "🟡 Neutral",
  };

  const FeedbackCard = ({
    title,
    iconColor,
    bg,
    children,
  }: {
    title: string;
    iconColor: string;
    bg: string;
    children: React.ReactNode;
  }) => (
    <Card className={`border-none space-y-3 p-4 ${bg} rounded-lg shadow-md`}>
      <CardTitle className={`flex items-center text-lg`}>
        <CircleCheck className={`mr-2 ${iconColor}`} />
        {title}
      </CardTitle>
      <CardDescription className="font-medium text-gray-700">
        {children}
      </CardDescription>
    </Card>
  );

  if (isLoading) {
    return <LoaderPage className="w-full h-[70vh]" />;
  }

  return (
    <div className="flex flex-col w-full gap-8 py-5">
      <div className="flex items-center justify-between w-full gap-2">
        <CustomBreadCrumb
          breadCrumbPage="Feedback"
          breadCrumpItems={[
            { label: "Mock Interviews", link: "/generate" },
            {
              label: `${interview?.position}`,
              link: `/generate/interview/${interview?.id}`,
            },
          ]}
        />
      </div>

      {(() => {
        const ratingValue = Number(overAllRating);
        let reviewTitle = "Keep Practicing! 💪";
        let reviewDescription = "Don't give up! Review your feedback below to identify areas where you can improve for your next interview.";
        if (ratingValue >= 8) {
          reviewTitle = "Excellent Job! 🎉";
          reviewDescription = "Congratulations! You did exceptionally well. Review your feedback below to see your strengths and fine-tune your answers.";
        } else if (ratingValue >= 5) {
          reviewTitle = "Good Effort! 👍";
          reviewDescription = "You're on the right track! Review the feedback below to see what you did well and what needs improvement.";
        }

        return (
          <Headings
            title={reviewTitle}
            description={reviewDescription}
          />
        );
      })()}

      <div className="bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-900/20 dark:to-green-900/10 rounded-2xl p-6 border border-emerald-200 dark:border-emerald-800 flex flex-col items-center justify-center shadow-sm">
        <h2 className="text-lg font-medium text-emerald-700 dark:text-emerald-400 mb-2">Your Overall Score</h2>
        <div className="text-5xl font-black text-emerald-600 dark:text-emerald-500 tracking-tighter">
          {overAllRating} <span className="text-2xl font-bold text-emerald-500/50 tracking-normal inline-block align-middle pb-2">/ 10</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 border shadow-sm">
          <CardTitle className="text-sm text-muted-foreground">Questions Attempted</CardTitle>
          <CardDescription className="text-2xl font-bold text-gray-800 dark:text-gray-200 mt-2">
            {attemptedQuestions} <span className="text-sm font-normal text-muted-foreground">/ {totalQuestions}</span>
          </CardDescription>
        </Card>
        <Card className="p-4 border shadow-sm">
          <CardTitle className="text-sm text-muted-foreground">Questions Missed</CardTitle>
          <CardDescription className="text-2xl font-bold text-gray-800 dark:text-gray-200 mt-2">
            {missedQuestions}
          </CardDescription>
        </Card>
        <Card className="p-4 border shadow-sm">
          <CardTitle className="text-sm text-muted-foreground">Overall Performance</CardTitle>
          <CardDescription className="text-2xl font-bold text-gray-800 dark:text-gray-200 mt-2">
            {Number(overAllRating) >= 7 ? "Great" : Number(overAllRating) >= 4 ? "Average" : "Needs Work"}
          </CardDescription>
        </Card>
      </div>

      {areasForImprovement.length > 0 && (
        <Card className="p-5 border shadow-sm bg-blue-50/50 dark:bg-blue-900/10">
          <CardTitle className="flex items-center text-lg text-blue-700 dark:text-blue-400 mb-3">
            Areas for Improvement
          </CardTitle>
          <div className="space-y-4">
            {areasForImprovement.map((area, idx) => (
              <div key={area.id} className="text-sm">
                <p className="font-semibold text-gray-700 dark:text-gray-300">
                  {idx + 1}. {area.question}
                </p>
                <p className="text-gray-600 dark:text-gray-400 mt-1 italic">
                  Tip: {area.tip}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {interview && <InterviewPin interview={interview} onMockPage />}

      <Headings title="Interview Feedback" isSubHeading />

      {feedbacks.length > 0 ? (
        <Accordion type="single" collapsible className="space-y-6">
          {feedbacks.map((feed) => (
            <AccordionItem
              key={feed.id}
              value={feed.id}
              className="border rounded-lg shadow-md"
            >
              <AccordionTrigger
                onClick={() => setActiveFeed(feed.id)}
                className={cn(
                  "px-5 py-3 flex items-center justify-between text-base rounded-t-lg transition-colors hover:no-underline",
                  activeFeed === feed.id
                    ? "bg-gradient-to-r from-purple-50 to-blue-50"
                    : "hover:bg-gray-50"
                )}
              >
                <span>{feed.question}</span>
              </AccordionTrigger>

              <AccordionContent className="px-5 py-6 bg-white rounded-b-lg space-y-5 shadow-inner">
                <div className="text-lg font-semibold text-gray-700">
                  <Star className="inline mr-2 text-yellow-400" />
                  Rating: {feed.rating}
                </div>

                <FeedbackCard title="Expected Answer" iconColor="text-green-600" bg="bg-green-50">
                  {feed.correct_ans}
                </FeedbackCard>

                <FeedbackCard title="Your Answer" iconColor="text-yellow-600" bg="bg-yellow-50">
                  {feed.user_ans}
                </FeedbackCard>

                <FeedbackCard title="Feedback" iconColor="text-red-600" bg="bg-red-50">
                  {feed.feedback}
                </FeedbackCard>

                {feed.emotion ? (
                  <FeedbackCard title="Expression Feedback" iconColor="text-blue-600" bg="bg-blue-50">
                    The candidate appeared <strong>{emotionIcons[feed.emotion] || feed.emotion}</strong> while answering this question.
                  </FeedbackCard>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    No expression feedback available.
                  </p>
                )}

                {feed.improvementTips && (
                  <FeedbackCard title="Tips for Improvement" iconColor="text-purple-600" bg="bg-purple-50">
                    {feed.improvementTips}
                  </FeedbackCard>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <p className="text-center text-muted-foreground italic">
          No feedback data available for this interview.
        </p>
      )}
    </div>
  );
};
