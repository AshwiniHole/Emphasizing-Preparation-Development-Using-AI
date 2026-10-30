import { useState } from "react";
import { TooltipButton } from "./tooltip-button";
import { ChevronRight, ChevronLeft, Volume2, VolumeX, Lightbulb } from "lucide-react";
import { RecordAnswer } from "./record-answer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface QuestionSectionProps {
  questions: { question: string; answer: string }[];
  interviewId?: string;
}

export const QuestionSection = ({ questions, interviewId }: QuestionSectionProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isWebCam, setIsWebCam] = useState(false);
  const [activeTab, setActiveTab] = useState(questions[0]?.question);
  const navigate = useNavigate();

  const [currentSpeech, setCurrentSpeech] =
    useState<SpeechSynthesisUtterance | null>(null);

  const handlePlayQuestion = (qst: string) => {
    if (isPlaying && currentSpeech) {
      // stop the speech if already playing
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setCurrentSpeech(null);
    } else {
      if ("speechSynthesis" in window) {
        const speech = new SpeechSynthesisUtterance(qst);
        window.speechSynthesis.speak(speech);
        setIsPlaying(true);
        setCurrentSpeech(speech);

        // handle the speech end
        speech.onend = () => {
          setIsPlaying(false);
          setCurrentSpeech(null);
        };
      }
    }
  };



  const handleNext = () => {
    const currentIndex = questions.findIndex((q) => q.question === activeTab);
    if (currentIndex < questions.length - 1) {
      setActiveTab(questions[currentIndex + 1].question);
    }
  };

  const handlePrevious = () => {
    const currentIndex = questions.findIndex((q) => q.question === activeTab);
    if (currentIndex > 0) {
      setActiveTab(questions[currentIndex - 1].question);
    }
  };

  const handleEndInterview = () => {
    if (interviewId) {
      navigate(`/generate/feedback/${interviewId}`, { replace: true });
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-160px)] flex flex-col justify-between">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-grow">
        {/* Left Column: Question */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 sticky top-20">
            <div className="flex items-center gap-2">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold">
                Question #{questions.findIndex(q => q.question === activeTab) + 1} of {questions.length}
              </span>
              <span className="text-xs text-muted-foreground font-medium">
                Difficulty: Medium
              </span>
            </div>

            <h3 className="text-xl md:text-2xl font-semibold tracking-wide leading-relaxed text-foreground/90">
              {activeTab}
            </h3>

            <div className="flex items-center gap-3 mt-2">
              <TooltipButton
                content={isPlaying ? "Stop Reading" : "Read Question"}
                icon={
                  isPlaying ? (
                    <VolumeX className="w-5 h-5 text-primary" />
                  ) : (
                    <Volume2 className="w-5 h-5 text-primary" />
                  )
                }
                onClick={() => handlePlayQuestion(activeTab)}
                buttonVariant="outline"
                buttonClassName="rounded-full w-10 h-10 p-0 hover:bg-primary/10 hover:border-primary/20"
              />
            </div>

            <div className="bg-muted/50 rounded-xl p-4 mt-4 border border-border/50">
              <div className="flex items-center gap-2 mb-2 text-primary">
                <Lightbulb className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Hint</span>
              </div>
              <p className="text-sm text-muted-foreground italic">
                Click "Record Answer" when you are ready. Speak clearly and try to structure your answer.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Recording */}
        <div className="flex flex-col w-full h-full bg-card rounded-2xl border border-border overflow-hidden relative shadow-sm">
          <RecordAnswer
            question={questions.find(q => q.question === activeTab)!}
            isWebCam={isWebCam}
            setIsWebCam={setIsWebCam}
            onAutoSaveComplete={() => {
              const currentIndex = questions.findIndex(q => q.question === activeTab);
              if (currentIndex < questions.length - 1) {
                handleNext();
              } else {
                handleEndInterview();
              }
            }}
          />
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="sticky bottom-0 w-full bg-background border-t border-border py-4 mt-6 flex items-center justify-between z-10">
        <Button
          disabled={activeTab === questions[0]?.question}
          onClick={handlePrevious}
          variant="outline"
          size="lg"
          className="rounded-full px-8"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        {activeTab !== questions[questions.length - 1]?.question ? (
          <Button
            onClick={handleNext}
            size="lg"
            className="rounded-full px-8"
          >
            Next Question
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={handleEndInterview}
            size="lg"
            className="rounded-full px-8"
            variant={"destructive"}
          >
            End Interview
          </Button>
        )}
      </div>
    </div>
  );
};
