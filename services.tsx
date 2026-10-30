import React from "react";

const Services: React.FC = () => {
  return (
    <div className="p-10 text-center">
      <h1 className="text-4xl font-bold text-purple-700 mb-6">Our Services</h1>
      <p className="text-lg text-gray-700 mb-4">
        Our platform offers a wide range of services designed to help students and job seekers excel in their interviews and career journeys. Here’s what we provide:
      </p>
      <ul className="text-left max-w-3xl mx-auto text-md text-gray-600 list-disc list-inside space-y-3">
        <li>Conducting realistic <strong>AI-powered mock interviews</strong> that simulate real-world scenarios.</li>
        <li>Providing <strong>valuable, personalized feedback</strong> to help improve performance.</li>
        <li><strong>Generating interview questions</strong> tailored to your selected domain and experience.</li>
        <li>Offering <strong>suggestions and tips</strong> to improve communication and technical responses.</li>
        <li>Delivering a clean, modern, and <strong>interactive web interface</strong> for a seamless user experience.</li>
        <li>Helping users <strong>track their progress</strong> through feedback and evaluation reports.</li>
        <li>Preparing users for both <strong>technical and HR interviews</strong> through AI-based assistance.</li>
        <li>Building <strong>confidence and readiness</strong> in a low-pressure, supportive environment.</li>
      </ul>
      <p className="mt-6 text-md text-gray-600 italic">
        Our goal is simple — to make your interview preparation smarter, faster, and more effective. Let us be part of your success story!
      </p>
    </div>
  );
};

export default Services;
