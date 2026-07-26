import { Plus, Book, Clock, Users } from "lucide-react";

export default function AssignCoursesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Curriculum & Courses</h2>
          <p className="text-sm text-gray-500 mt-1">Assign tech modules to your classes.</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors">
          <Plus size={18} /> Assign New Course
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Course Card */}
        <CourseCard 
          title="Python for AI" 
          description="Introduction to Python syntax, data structures, and basic algorithms used in AI models."
          assignedTo="Class 9 & 10"
          students={120}
          duration="4 Weeks"
          status="Active"
        />

        <CourseCard 
          title="Neural Networks 101" 
          description="Deep dive into perceptrons, weights, biases, and training sets."
          assignedTo="Class 10"
          students={45}
          duration="6 Weeks"
          status="Active"
        />

        <CourseCard 
          title="Logic Gates & Hardware" 
          description="Understanding how computers process information at the lowest level."
          assignedTo="Class 8"
          students={85}
          duration="3 Weeks"
          status="Active"
        />

        <CourseCard 
          title="Algorithmic Trading" 
          description="Using code to analyze stock patterns and make decisions."
          assignedTo="Class 10"
          students={30}
          duration="5 Weeks"
          status="Draft"
        />

      </div>
    </div>
  );
}

function CourseCard({ title, description, assignedTo, students, duration, status }: { title: string, description: string, assignedTo: string, students: number, duration: string, status: string }) {
  const isActive = status === "Active";

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
      <div className="p-6 border-b border-gray-100 flex-1">
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
            <Book size={24} />
          </div>
          <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
            {status}
          </span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
      </div>
      <div className="p-4 bg-gray-50 flex items-center justify-between text-sm text-gray-500 rounded-b-xl border-t border-gray-100">
        <div className="flex items-center gap-1.5" title="Assigned Classes"><Users size={16} /> <span className="font-medium text-gray-700">{assignedTo}</span></div>
        <div className="flex items-center gap-1.5" title="Duration"><Clock size={16} /> {duration}</div>
      </div>
    </div>
  );
}
