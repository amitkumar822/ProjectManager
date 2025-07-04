import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const HomePage = () => {
  return (
    <>
      <div className="min-h-screen w-full bg-gradient-to-br from-indigo-100 via-sky-100 to-emerald-100 flex flex-col">
        {/* Hero Section */}
        <section className="flex flex-col-reverse md:flex-row items-center justify-between px-6 md:px-16 py-16 gap-10">
          <div className="md:w-1/2 space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 leading-tight">
              Manage Your <span className="text-indigo-600">Projects</span> & <span className="text-emerald-600">Tasks</span> Easily
            </h1>
            <p className="text-lg text-gray-600 max-w-xl">
              Boost productivity with our intuitive project and task management system.
              Track, manage, and collaborate effortlessly.
            </p>
            <div className="flex gap-4">
              <Link to="/login">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md text-base">
                  Get Started <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="outline" className="border-indigo-600 text-indigo-600 hover:bg-indigo-50">
                  View Dashboard
                </Button>
              </Link>
            </div>
          </div>

          <div className="md:w-1/2">
            <img
              src="https://img.freepik.com/free-vector/project-management-teamwork-concept_74855-20070.jpg?w=1060&t=st=1719990000"
              alt="Team working illustration"
              className="w-full h-auto rounded-xl shadow-lg"
            />
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-white py-16 px-6 md:px-16">
          <h2 className="text-3xl md:text-4xl font-semibold text-center text-gray-800 mb-12">
            Why Choose Us?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Easy to Use",
                desc: "Simple and intuitive UI to manage projects and tasks without a learning curve.",
                img: "https://img.freepik.com/free-vector/user-interface-concept-illustration_114360-2581.jpg?w=740"
              },
              {
                title: "Real-Time Collaboration",
                desc: "Collaborate with team members and stay in sync on all project activities.",
                img: "https://img.freepik.com/free-vector/team-goals-concept-illustration_114360-1071.jpg?w=740"
              },
              {
                title: "Stay Organized",
                desc: "Categorize, prioritize and track task statuses with visual clarity.",
                img: "https://img.freepik.com/free-vector/flat-design-kanban-illustration_23-2149317331.jpg?w=740"
              }
            ].map((feature, idx) => (
              <div key={idx} className="bg-indigo-50 rounded-xl shadow p-6 text-center">
                <img src={feature.img} alt={feature.title} className="w-full h-48 object-cover rounded-md mb-4" />
                <h3 className="text-xl font-semibold text-indigo-700 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-gradient-to-r from-indigo-500 to-emerald-500 text-white text-center px-6 md:px-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg mb-6">Create your free account and start managing your work efficiently today.</p>
          <Link to="/login">
            <Button className="bg-white text-indigo-700 hover:bg-white/90 px-6 py-3 text-lg font-medium">
              Sign Up for Free
            </Button>
          </Link>
        </section>
      </div>
    </>
  );
};

export default HomePage;
