import { Interview } from "@/types";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";
import { TooltipButton } from "./tooltip-button";
import { Eye, Newspaper, Sparkles } from "lucide-react";
import { Button } from "./ui/button";

interface InterviewPinProps {
  interview: Interview;
  onMockPage?: boolean;
}

export const InterviewPin = ({
  interview,
  onMockPage = false,
}: InterviewPinProps) => {
  const navigate = useNavigate();

  return (
    <Card className="p-5 rounded-xl border border-border/50 bg-card hover:shadow-lg hover:border-primary/20 transition-all duration-300 cursor-pointer space-y-4 group">
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold truncate text-foreground/90 group-hover:text-primary transition-colors">
            {interview?.position}
          </CardTitle>
          <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
            {`${new Date(interview?.createdAt.toDate()).toLocaleDateString(
              "en-US",
              { dateStyle: "medium" }
            )}`}
          </p>
        </div>
        <CardDescription className="line-clamp-2 text-sm text-muted-foreground/80">
          {interview?.description}
        </CardDescription>
      </div>

      <div className="w-full flex items-center gap-2 flex-wrap">
        {interview?.techStack.split(",").map((word, index) => (
          <Badge
            key={index}
            variant={"secondary"}
            className="text-[10px] px-2 py-0.5 font-medium text-muted-foreground bg-secondary/50 hover:bg-secondary hover:text-foreground transition-colors"
          >
            {word.trim()}
          </Badge>
        ))}
      </div>

      <CardFooter
        className={cn(
          "w-full flex items-center p-0 pt-2",
          onMockPage ? "justify-end" : "justify-between"
        )}
      >
        {!onMockPage && (
          <div className="flex items-center gap-2 w-full">
            <TooltipButton
              content="View Details"
              buttonVariant={"outline"}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/generate/${interview?.id}`, { replace: true });
              }}
              disabled={false}
              buttonClassName="w-8 h-8 rounded-full p-0 hover:border-sky-500 hover:text-sky-500 hover:bg-sky-50"
              icon={<Eye className="w-4 h-4" />}
              loading={false}
            />

            <TooltipButton
              content="Feedback"
              buttonVariant={"outline"}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/generate/feedback/${interview?.id}`, {
                  replace: true,
                });
              }}
              disabled={false}
              buttonClassName="w-8 h-8 rounded-full p-0 hover:border-yellow-500 hover:text-yellow-500 hover:bg-yellow-50"
              icon={<Newspaper className="w-4 h-4" />}
              loading={false}
            />

            <div className="flex-grow" />

            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/generate/interview/${interview?.id}`, {
                  replace: true,
                });
              }}
              className="rounded-full px-6 transition-all shadow-sm hover:shadow-md"
            >
              Start
              <Sparkles className="ml-2 w-3 h-3" />
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};
