import { Sparkles, TrendingUp, ShieldCheck, Zap } from "lucide-react";
import Marquee from "react-fast-marquee";

import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { MarqueImg } from "@/components/marquee-img";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="flex-col w-full pb-24 bg-gray-50/30 overflow-hidden">

      {/* Hero Section */}
      <div className="relative pt-32 pb-48 overflow-hidden">
        <div className="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)] opacity-10"></div>
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div
              className="space-y-8"
            >
              <h1 className="text-5xl md:text-8xl font-extrabold tracking-tight leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                  AI Superpower
                </span>
                <br />
                <span className="text-gray-900 text-4xl md:text-6xl mt-2 block">
                  for your career.
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground max-w-lg leading-relaxed">
                Master the art of the interview. Real-time feedback, confidence scoring, and tailored practice sessions.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to={"/generate"}>
                  <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all bg-gray-900 text-white">
                    Start Interviewing <Sparkles className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <div className="flex items-center gap-4 px-6 py-3 bg-white rounded-full border border-gray-100 shadow-sm">
                  <div className="flex -space-x-4">
                    <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-200"></div>
                    <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-300"></div>
                    <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-400"></div>
                  </div>
                  <div className="text-sm">
                    <span className="font-bold text-gray-900">10k+</span> users
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Image / Dashboard Preview */}
            <div
              className="relative lg:h-[600px] w-full"
            >
              <div className="absolute top-10 right-10 w-3/4 h-3/4 bg-gradient-to-tr from-blue-100 to-purple-100 rounded-[3rem] blur-3xl -z-10"></div>

              <div className="relative z-10 bg-white/40 backdrop-blur-md rounded-[2rem] border border-white/50 p-4 shadow-2xl transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
                <img
                  src="/assets/img/mock inter.png"
                  alt="Dashboard Preview"
                  className="w-full h-auto rounded-3xl shadow-sm"
                />

                {/* Floating Element 1 - Adjusted Position */}
                <div
                  className="absolute -left-2 md:-left-8 top-1/4 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3 z-20 transform scale-75 md:scale-100 origin-left"
                >
                  <div className="p-3 bg-green-100 rounded-xl text-green-600">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase">Confidence</p>
                    <p className="text-xl font-bold text-gray-900">+45%</p>
                  </div>
                </div>

                {/* Floating Element 2 - Adjusted Position */}
                <div
                  className="absolute -right-2 md:-right-6 bottom-1/4 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 max-w-[150px] md:max-w-[200px] z-20 transform scale-75 md:scale-100 origin-right"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-xs font-bold text-gray-700">AI Analysis</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-500 w-[92%]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Marquee Section */}
      <div className="w-full py-16">
        <p className="text-center text-sm font-bold text-gray-400 uppercase tracking-[0.2em] mb-10">Trusted by future leaders at</p>
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-50 to-transparent z-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-50 to-transparent z-10"></div>
          <Marquee pauseOnHover gradient={false} speed={40}>
            <MarqueImg img="/assets/img/logo/firebase.png" />
            <MarqueImg img="/assets/img/logo/meet.png" />
            <MarqueImg img="/assets/img/logo/zoom.png" />
            <MarqueImg img="/assets/img/logo/microsoft.png" />
            <MarqueImg img="/assets/img/logo/tailwindcss.png" />
            <MarqueImg img="/assets/img/logo/firebase.png" />
            <MarqueImg img="/assets/img/logo/meet.png" />
            <MarqueImg img="/assets/img/logo/zoom.png" />
          </Marquee>
        </div>
      </div>

      {/* Features - Bento Grid Style */}
      <Container className="py-32">
        <div
          className="text-center max-w-3xl mx-auto mb-20 space-y-4"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight">
            Everything you need to <span className="text-blue-600">succeed.</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Our AI-driven platform provides specific tools to target your weaknesses and amplify your strengths.
          </p>
        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 h-auto md:h-[600px]"
        >

          {/* Main Feature - Large */}
          <div
            className="md:col-span-2 md:row-span-2 relative overflow-hidden rounded-[2.5rem] bg-white border border-gray-100 shadow-xl group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-50"></div>
            <img
              src="/assets/img/img.png"
              alt="Interview Practice"
              className="absolute right-0 bottom-0 w-3/4 shadow-2xl rounded-tl-[2rem] border-t border-l border-white/50 transition-transform duration-700 group-hover:scale-105 group-hover:-translate-x-2 group-hover:-translate-y-2 object-cover object-top"
              style={{ maxHeight: '80%' }}
            />
            <div className="relative p-10 z-20 max-w-md bg-white/60 backdrop-blur-md rounded-3xl m-6 border border-white/20 shadow-2xl">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-600/20">
                <ShieldCheck className="text-white w-6 h-6" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">Personalized Feedback</h3>
              <p className="text-gray-700 font-medium leading-relaxed">
                Get detailed analysis on your tone, pace, and answer quality. improving your soft skills alongside technical knowledge.
              </p>
            </div>
          </div>

          {/* Secondary Feature - Top Right */}
          <div
            className="md:col-span-1 md:row-span-1 bg-gray-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gray-800 rounded-full blur-2xl opacity-50 -mr-10 -mt-10"></div>
            <div>
              <h3 className="text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500">98%</h3>
              <p className="text-gray-400 font-medium">Success Rate</p>
            </div>
            <p className="text-sm text-gray-400 mt-4">candidates feel more prepared after just 3 sessions.</p>
          </div>

          {/* CTA Feature - Bottom Right */}
          <div
            className="md:col-span-1 md:row-span-1 bg-blue-600 rounded-[2.5rem] p-8 relative overflow-hidden hover:bg-blue-700 transition-colors cursor-pointer group"
          >
            <Link to="/generate" className="absolute inset-0 z-20"></Link>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>

            <div className="h-full flex flex-col justify-between relative z-10">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">Start Now</h3>
                <div className="flex items-center text-blue-100 gap-2 group-hover:translate-x-2 transition-transform">
                  <span className="text-sm">Generate Interview</span>
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </Container>
    </div>
  );
};

export default HomePage;
