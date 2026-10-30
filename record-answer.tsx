import { useAuth } from "@clerk/clerk-react";
import { Loader, Mic, RefreshCw, Save, Video, VideoOff, WebcamIcon } from "lucide-react";
import { useCallback, useEffect, useState, useRef } from "react";
import useSpeechToText, { ResultType } from "react-hook-speech-to-text";
import { useParams } from "react-router-dom";
import WebCam from "react-webcam";
import { TooltipButton } from "./tooltip-button";
import { toast } from "sonner";
import * as tf from "@tensorflow/tfjs";
import * as blazeface from "@tensorflow-models/blazeface";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import { chatSession } from "@/scripts";
import { SaveModal } from "./save-modal";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/config/firebase.config";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface RecordAnswerProps {
  question: { question: string; answer: string };
  isWebCam: boolean;
  setIsWebCam: (value: boolean) => void;
}

interface AIResponse {
  ratings: number;
  feedback: string;
  emotion: string; // Emotion feedback
  improvementTips: string; // Suggestions for improvement based on emotional feedback
  multipleSpeakersDetected: boolean; // Analyzes transcript for multiple distinct inputs
}

export const RecordAnswer = ({
  question,
  isWebCam,
  setIsWebCam,
  onAutoSaveComplete,
}: RecordAnswerProps & { onAutoSaveComplete?: () => void }) => {
  const {
    interimResult,
    isRecording,
    results,
    setResults,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  const [userAnswer, setUserAnswer] = useState("");
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiResult, setAiResult] = useState<AIResponse | null>(null);
  const [emotion, setEmotion] = useState<string | null>(null); // Emotion state
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastSpeechTime, setLastSpeechTime] = useState<number>(Date.now());
  const [timeLeft, setTimeLeft] = useState<number>(120); // 2 minutes in seconds

  const webcamRef = useRef<WebCam>(null);
  const faceDetectionIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const objectDetectionIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Audio Context Refs for Real-time pitch tracking
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const recentPitchesRef = useRef<number[]>([]);
  const basePitchRef = useRef<number | null>(null);

  const { userId } = useAuth();
  const { interviewId } = useParams();

  // Initialize Face & Object Detection Models
  useEffect(() => {
    const loadModels = async () => {
      try {
        await tf.ready();
        const [faceModel, objectModel] = await Promise.all([
          blazeface.load(),
          cocoSsd.load()
        ]);
        startFaceDetection(faceModel);
        startObjectDetection(objectModel);
      } catch (error) {
        console.error("Failed to load detection models", error);
      }
    };

    loadModels();

    return () => {
      if (faceDetectionIntervalRef.current) {
        clearInterval(faceDetectionIntervalRef.current);
      }
      if (objectDetectionIntervalRef.current) {
        clearInterval(objectDetectionIntervalRef.current);
      }
    };
  }, []);

  const startFaceDetection = (model: blazeface.BlazeFaceModel) => {
    faceDetectionIntervalRef.current = setInterval(async () => {
      if (webcamRef.current && webcamRef.current.video && webcamRef.current.video.readyState === 4) {
        const video = webcamRef.current.video;
        const predictions = await model.estimateFaces(video, false);

        if (predictions.length > 1) {
          toast.warning("Multiple people detected!", {
            description: "Please ensure only one person is in front of the camera.",
            duration: 5000,
          });
        }
      }
    }, 2000); // Check every 2 seconds
  };

  const startObjectDetection = (model: cocoSsd.ObjectDetection) => {
    objectDetectionIntervalRef.current = setInterval(async () => {
      if (webcamRef.current && webcamRef.current.video && webcamRef.current.video.readyState === 4) {
        const video = webcamRef.current.video;
        const predictions = await model.detect(video);

        const hasPhone = predictions.some((p: { class: string, score: number }) => p.class === "cell phone" && p.score > 0.5);
        if (hasPhone) {
          toast.warning("Mobile phone detected!", {
            description: "Please put away your phone during the interview.",
            duration: 5000,
          });
        }
      }
    }, 2000); // Check every 2 seconds
  };

  // Removed manual recordUserAnswer in favor of continuous monitoring
  const cleanJsonResponse = (responseText: string) => {
    let cleanText = responseText.trim();
    cleanText = cleanText.replace(/(json|```|`)/g, "");
    console.log(cleanText);
    try {
      return JSON.parse(cleanText);
    } catch (error) {
      throw new Error("Invalid JSON format: " + (error as Error)?.message);
    }
  };

  const generateResult = useCallback(async (
    qst: string,
    qstAns: string,
    userAns: string
  ): Promise<AIResponse> => {
    setIsAiGenerating(true);
    const prompt = `
      Question: "${qst}"
      User Answer: "${userAns}"
      Correct Answer: "${qstAns}"
      Please analyze the user's answer and provide a rating (from 1 to 10) based on its quality, along with feedback on the answer.
      Also, provide "improvementTips" with actionable advice on how to improve the answer.
      Finally, perform a deep analysis of the user's emotional tone/confidence based on the answer text and provide it as "emotion" (e.g., "Confident", "Hesitant", "Nervous", "Neutral", etc.).
      
      Critical Proctoring Step: Analyze the transcript for signs of multiple people speaking (e.g. conversational overlap, asking someone else for the answer, hearing someone else dictate an answer, or disjointed two-person dialogue). Set "multipleSpeakersDetected" to true if you strongly suspect more than one person is speaking or feeding answers. Set it to false otherwise.

      Return the result in JSON format with the fields "ratings" (number), "feedback" (string), "emotion" (string), "improvementTips" (string), and "multipleSpeakersDetected" (boolean).
      Do not use markdown formatting.
    `;

    try {
      const aiResult = await chatSession.sendMessage(prompt);
      const parsedResult: AIResponse = cleanJsonResponse(aiResult.response.text());
      return parsedResult;
    } catch (error) {
      console.log(error);
      toast("Error", {
        description: "An error occurred while generating feedback.",
      });
      return {
        ratings: 0,
        feedback: "Unable to generate feedback",
        emotion: "neutral", // Default to neutral if an error occurs
        improvementTips: "Try to express yourself more clearly and concisely.",
        multipleSpeakersDetected: false,
      };
    } finally {
      setIsAiGenerating(false);
    }
  }, []);



  const recordNewAnswer = () => {
    setUserAnswer("");
    setResults([]);
    stopSpeechToText();
    startSpeechToText();
  };

  const saveUserAnswer = useCallback(async (finalAnswer: string) => {
    if (finalAnswer.length < 30) {
      toast.error("Answer too short", {
        description: "Your answer should be more than 30 characters before saving.",
      });
      return;
    }

    setLoading(true);
    let aiResp = aiResult;
    let emoResp = emotion;

    if (!aiResp || !emoResp) {
      // Automatically generate feedback if it wasn't pre-generated
      toast.info("Generating feedback", { description: "Please wait..." });
      aiResp = await generateResult(question.question, question.answer, finalAnswer);
      emoResp = aiResp.emotion;
      setAiResult(aiResp);
      setEmotion(emoResp);
    }

    if (aiResp.multipleSpeakersDetected) {
      toast.error("Multiple voices detected!", {
        description: "Your session has been flagged for multiple speakers or unauthorized assistance.",
        duration: 8000
      });
    }

    try {
      // NOTE: Removed the check that prevents saving multiple times so candidates can try again/append if needed.
      // Saving separately is inherently supported by just adding a new document.
      await addDoc(collection(db, "userAnswers"), {
        mockIdRef: interviewId,
        question: question.question,
        correct_ans: question.answer,
        user_ans: finalAnswer,
        feedback: aiResp.feedback,
        rating: aiResp.ratings,
        userId,
        emotion: emoResp,
        improvementTips: aiResp.improvementTips,
        createdAt: serverTimestamp(),
      });

      toast("Saved automatically", { description: "Your answer has been saved." });

      setUserAnswer("");
      setResults([]);
      setAiResult(null);
      setEmotion(null);
      // Let the parent component know we saved automatically, e.g., to move to the next question
      if (onAutoSaveComplete) {
        onAutoSaveComplete();
      }
    } catch (error) {
      toast("Error", {
        description: "An error occurred while saving.",
      });
      console.log(error);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }, [aiResult, emotion, generateResult, interviewId, onAutoSaveComplete, question.answer, question.question, userId]);

  // Keep recording on
  useEffect(() => {
    if (!isRecording && !loading) {
      startSpeechToText();
    }
  }, [isRecording, loading, startSpeechToText]);

  // Real-time Voice Detection via Pitch Variance Tracking
  useEffect(() => {
    if (!isRecording) {
      if (audioContextRef.current?.state !== "closed") {
        audioContextRef.current?.close();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    let mediaStream: MediaStream | null = null;
    const startAudioAnalysis = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStream = stream;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioContextRef.current = audioCtx;

        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 2048;
        analyserRef.current = analyser;

        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        // Reset tracking vars
        recentPitchesRef.current = [];
        basePitchRef.current = null;
        let warningCooldown = false;

        const analyzePitch = () => {
          if (!analyserRef.current) return;

          analyserRef.current.getByteFrequencyData(dataArray);

          // Find the dominant frequency bin (simplified pitch proxy)
          let maxVal = -1;
          let maxIdx = -1;
          for (let i = 0; i < bufferLength; i++) {
            if (dataArray[i] > maxVal) {
              maxVal = dataArray[i];
              maxIdx = i;
            }
          }

          // If volume is low, ignore (silence or background noise)
          // Increased threshold to 100 to reduce false positives from background noise
          if (maxVal > 100) {
            const dominantFreq = maxIdx * (audioCtx.sampleRate / analyser.fftSize);

            // Keep a rolling window of the last 20 frames (~300ms)
            recentPitchesRef.current.push(dominantFreq);
            if (recentPitchesRef.current.length > 20) {
              recentPitchesRef.current.shift();
            }

            // Calculate average of the window to smooth out glitches
            const avgPitch = recentPitchesRef.current.reduce((a, b) => a + b, 0) / recentPitchesRef.current.length;

            // Establish a baseline pitch during the first few seconds of talking
            if (basePitchRef.current === null && recentPitchesRef.current.length === 20) {
              basePitchRef.current = avgPitch;
            }

            if (basePitchRef.current !== null && recentPitchesRef.current.length === 20 && !warningCooldown) {
              // Check if current average pitch is significantly different from baseline
              // (e.g. standard deviation jump). 
              const pitchVariance = Math.abs(avgPitch - basePitchRef.current);

              // Threshold increased to > 600Hz variance to reduce false positives
              // (Men avg ~85-180Hz, Women ~165-255Hz, huge spikes imply new speaker or severe noise)
              if (pitchVariance > 600) {
                toast.error("Multiple voices detected in real-time!", {
                  description: "Another distinct voice was detected. Please ensure you are alone.",
                  duration: 5000
                });
                warningCooldown = true;
                // Reset cooldown after 10s
                setTimeout(() => { warningCooldown = false; }, 10000);
              }
            }
          }

          animationFrameRef.current = requestAnimationFrame(analyzePitch);
        };

        analyzePitch();

      } catch (err) {
        console.error("Audio analysis failed to start: ", err);
      }
    };

    startAudioAnalysis();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close().catch(console.error);
      }
      if (mediaStream) {
        mediaStream.getTracks().forEach(t => t.stop());
      }
    };
  }, [isRecording]);

  // Handle continuous results and silence detection
  useEffect(() => {
    // Only update from speech-to-text if recording
    if (!isRecording) return;

    const combineTranscripts = results
      .filter((result): result is ResultType => typeof result !== "string")
      .map((result) => result.transcript)
      .join(" ");

    // Check if the user is actually speaking (interimResult means they are mid-sentence usually)
    if (combineTranscripts.length > userAnswer.length || interimResult) {
      setLastSpeechTime(Date.now());
    }

    if (combineTranscripts) {
      setUserAnswer(combineTranscripts);
    }
  }, [results, interimResult, isRecording]);

  // Silence Detection & 2-Minute Time Limit Loop (Checks every second)
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const nextTime = prev - 1;

        // If time reaches 0, auto-save regardless of answer length, then reset.
        if (nextTime <= 0) {
          if (!loading && !isAiGenerating) {
            toast.info("Time's up! Automatically saving...", { duration: 3000 });
            saveUserAnswer(userAnswer);
            // Ensure it doesn't try repeatedly
            setLastSpeechTime(Date.now());
          }
          return 0;
        }

        const timeSinceLastSpeech = Date.now() - lastSpeechTime;
        // If user has spoken something substantial, and has been silent for 30 seconds (30000ms)
        if (userAnswer.length >= 30 && timeSinceLastSpeech > 30000 && !loading && !isAiGenerating) {
          saveUserAnswer(userAnswer);
          setLastSpeechTime(Date.now()); // reset to prevent multiple triggers
        }

        return nextTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [userAnswer, lastSpeechTime, loading, isAiGenerating, saveUserAnswer]);

  // Reset timer on new question
  useEffect(() => {
    setTimeLeft(120);
    setLastSpeechTime(Date.now());
    setUserAnswer("");
    setResults([]);
    setAiResult(null);
    setEmotion(null);
  }, [question.question, setResults]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full flex flex-col items-center gap-4 h-full">
      {/* save modal */}
      <SaveModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() => saveUserAnswer(userAnswer)}
        loading={loading}
      />

      <div className="w-full h-full flex-grow bg-black rounded-xl overflow-hidden relative flex items-center justify-center border border-border/50 shadow-inner min-h-[400px]">
        {isWebCam ? (
          <WebCam
            audio={false}
            ref={webcamRef}
            onUserMedia={() => setIsWebCam(true)}
            onUserMediaError={() => setIsWebCam(false)}
            className="w-full h-full object-cover"
            mirrored={true}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-muted/20 backdrop-blur-sm">
            <WebcamIcon className="min-w-24 min-h-24 text-muted-foreground/30" />
            <p className="text-muted-foreground mt-4 text-sm">Camera is switched off</p>
          </div>
        )}

        {/* Overlay Controls */}
        <div className="absolute top-4 left-4 bg-background/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
          <span className={`text-sm font-semibold tracking-wider ${timeLeft <= 30 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
            {formatTime(timeLeft)}
          </span>
        </div>
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-background/20 backdrop-blur-md border border-white/10 p-3 rounded-full shadow-lg">
          <TooltipButton
            content={isWebCam ? "Turn Off Camera" : "Turn On Camera"}
            icon={isWebCam ? <VideoOff className="w-5 h-5 text-white" /> : <Video className="w-5 h-5 text-white" />}
            onClick={() => setIsWebCam(!isWebCam)}
            buttonVariant="ghost"
            buttonClassName="hover:bg-white/20 rounded-full w-10 h-10 p-0 text-white"
          />

          <TooltipButton
            content="Recording (Auto)"
            icon={<Mic className="w-6 h-6 text-red-500 fill-red-500 animate-pulse" />}
            onClick={() => toast.info("Microphone is continuously recording during the answer.")}
            buttonVariant="ghost"
            buttonClassName="hover:bg-white/20 rounded-full w-12 h-12 p-0 border border-white/20"
          />

          <TooltipButton
            content="Reset Answer"
            icon={<RefreshCw className="w-5 h-5 text-white" />}
            onClick={recordNewAnswer}
            buttonVariant="ghost"
            buttonClassName="hover:bg-white/20 rounded-full w-10 h-10 p-0 text-white"
          />
        </div>

        <div className="absolute top-4 right-4">
          <Button
            size="sm"
            onClick={() => setOpen(true)}
            disabled={!userAnswer || userAnswer.length < 30 || loading}
            className="bg-white/90 text-black hover:bg-white border-0 shadow-sm"
          >
            {loading || isAiGenerating ? <Loader className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            Save & Next
          </Button>
        </div>
      </div>

      <div className="w-full p-4 border rounded-xl bg-card shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <Mic className="w-4 h-4 text-primary" />
            Your Answer
          </h2>
          {interimResult && (
            <span className="text-xs text-muted-foreground animate-pulse">
              Recording...
            </span>
          )}
        </div>

        <Textarea
          value={userAnswer}
          onChange={(e) => {
            setUserAnswer(e.target.value);
            setLastSpeechTime(Date.now());
          }}
          placeholder="Click the mic button to start recording, or type your answer here..."
          className="text-sm text-foreground/80 leading-relaxed min-h-[120px] max-h-[250px] p-3 bg-muted/30 rounded-md border border-border/50 focus-visible:ring-1 focus-visible:ring-primary/50 resize-y"
          disabled={loading || isAiGenerating}
        />

        {aiResult && (
          <div className="mt-4 pt-4 border-t border-border/50 space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/30 p-3 rounded-lg">
                <span className="text-xs font-semibold uppercase text-muted-foreground block mb-1">Emotion</span>
                <span className="text-sm font-medium capitalize text-primary">{emotion}</span>
              </div>
              <div className="bg-muted/30 p-3 rounded-lg">
                <span className="text-xs font-semibold uppercase text-muted-foreground block mb-1">Rating</span>
                <span className="text-sm font-medium capitalize text-primary">{aiResult.ratings}/10</span>
              </div>
            </div>

            <div className="bg-blue-50/50 dark:bg-blue-950/20 p-3 rounded-lg border border-blue-100 dark:border-blue-900/50">
              <span className="text-xs font-semibold uppercase text-blue-600 dark:text-blue-400 block mb-1">Improvement Tip</span>
              <span className="text-sm text-blue-700 dark:text-blue-300">{aiResult.improvementTips}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
