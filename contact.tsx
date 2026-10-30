import React from "react";

const Contact: React.FC = () => {
  return (
    <div className="p-10 text-center">
      <h1 className="text-4xl font-bold text-blue-700 mb-6">Contact Us</h1>
      <p className="text-lg text-gray-700 mb-4">
        We’d love to hear from you! Whether you have a question, suggestion, or simply want to connect — feel free to reach out to us:
      </p>
      <ul className="text-md text-gray-600 space-y-4 mb-4">
        <li>
          <strong>Vaibhavi S. Hivarkar</strong><br />
          📞 8080082102<br />
          📧 <a href="mailto:vaibhavihivarkar08@gmail.com" className="text-blue-500 hover:underline">vaibhavihivarkar08@gmail.com</a>
        </li>
        <li>
          <strong>Ashwini S. Hole</strong><br />
          📞 9322299232<br />
          📧 <a href="mailto:ashwinihole108@gmail.com" className="text-blue-500 hover:underline">ashwinihole108@gmail.com</a>
        </li>
        <li>
          <strong>Kanchan S. Lokhande</strong><br />
          📞 7775915704<br />
          📧 <a href="mailto:Kanchanlokhande8373@gmail.com" className="text-blue-500 hover:underline">Kanchanlokhande8373@gmail.com</a>
        </li>
        <li>
          <strong>Neha M. Kokane</strong><br />
          📞 9158322158<br />
          📧 <a href="mailto:nehakokane1203@gmail.com" className="text-blue-500 hover:underline">nehakokane1203@gmail.com</a>
        </li>
      </ul>
      <p className="mt-4 italic text-gray-500">
        Feel free to ask us anything — we are here to support and guide you on your learning journey!
      </p>
    </div>
  );
};

export default Contact;