import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom"; // or just <a href=""> if not using React Router

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold">Welcome to LostLink</h1>
        <p className="text-gray-600">Find and manage lost items within your university.</p>
        <Link to="/login">
          <Button>Go to Admin Login</Button>
        </Link>
      </div>
    </div>
  );
}
