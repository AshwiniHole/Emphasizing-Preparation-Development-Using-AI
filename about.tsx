import { motion } from "framer-motion";

const teamMembers = [
  {
    name: "Vaibhavi S. Hivarkar",
    role: "Developer",
    image: "/assets/img/vaibhavi.jpg",
    linkedIn: "https://www.linkedin.com/in/vaibhavi-hivarkar-11281032a",
    phone: "8080082102",
    email: "vaibhavihivarkar08@gmail.com",
  },
  {
    name: "Ashwini S. Hole",
    role: "Developer",
    image: "/assets/img/ashwini.jpg",
    linkedIn: "https://www.linkedin.com/in/ashwini-hole-21575b33b",
    phone: "9322299232",
    email: "ashwinihole108@gmail.com",
  },
  {
    name: "Kanchan S. Lokhande",
    role: "Developer",
    image: "/assets/img/kanchan.jpg",
    linkedIn: "https://www.linkedin.com/in/kanchan-lokhande-29bbb7331?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    phone: "7020091305",
    email: "Kanchanlokhande8373@gmail.com",
  },
  {
    name: "Neha M. Kokane",
    role: "Developer",
    image: "/assets/img/neha.jpg",
    linkedIn: "https://www.linkedin.com/in/neha-kokane-61072b26",
    phone: "9158322158",
    email: "nehakokane1203@gmail.com",
  },
];

export default function AboutUs() {
  return (
    <div className="min-h-screen py-20 bg-gradient-to-br from-blue-500 via-blue-600 to-teal-500 text-white">
      <div className="container mx-auto px-6">
        {/* Project Introduction Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-extrabold mb-8 tracking-tight">
            AI Mock Interview Project
          </h2>
          <p className="text-xl md:text-2xl leading-relaxed max-w-4xl mx-auto font-light text-blue-50">
            Empowering students with AI-driven interview preparation. A final-year project crafted by <span className="font-semibold text-yellow-300">Vaibhavi S. Hivarkar</span>, <a href="https://www.linkedin.com/in/ashwini-hole-21575b33b" target="_blank" rel="noopener noreferrer" className="font-semibold text-yellow-300 hover:text-yellow-400 underline decoration-yellow-400/30 decoration-2 underline-offset-4 transition-colors">Ashwini S. Hole</a>, <span className="font-semibold text-yellow-300">Kanchan S. Lokhande</span>, and <span className="font-semibold text-yellow-300">Neha M. Kokane</span> from <strong>SB PATIL COLLEGE OF ENGINEERING INDAPUR</strong>.
          </p>
        </motion.div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h3 className="text-4xl font-bold text-center mb-16 relative inline-block left-1/2 transform -translate-x-1/2">
            Meet the Minds
            <span className="block h-1 w-24 bg-yellow-400 mt-4 mx-auto rounded-full"></span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            {teamMembers.map((member, index) => (
              <motion.a
                key={index}
                href={member.linkedIn}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative pt-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
              >
                {/* Card Body */}
                <div className="relative bg-white/5 backdrop-blur-xl rounded-tl-[4rem] rounded-br-[4rem] rounded-tr-2xl rounded-bl-2xl p-6 border border-white/10 overflow-visible transition-all duration-300 hover:bg-white/10 hover:border-yellow-400/30 group-hover:shadow-[0_0_30px_rgba(250,204,21,0.1)] h-full flex flex-col">

                  {/* Floating Avatar (Popping out) */}
                  <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 w-32 h-32">
                    <div className="absolute inset-0 bg-yellow-400 rounded-full blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                    <img
                      src={member.image}
                      alt={member.name}
                      className={`w-full h-full object-cover rounded-full border-4 border-white shadow-lg relative z-10 ${
                        member.name === "Neha M. Kokane" ? "object-[50%_15%]" : ""
                      }`}
                    />
                  </div>

                  <h4 className="text-2xl font-bold text-white mb-2 mt-16">{member.name}</h4>
                  <p className="text-blue-200 font-medium tracking-wide text-sm uppercase">{member.role}</p>

                  <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <span className="text-sm font-semibold text-yellow-300 flex items-center gap-2">
                      View Profile
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                    </span>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
