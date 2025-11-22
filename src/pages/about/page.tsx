import { Button } from '@/components/ui/button';
import LostLinkLogo from '@/assets/LostLink.svg';
import {
  LayoutDashboard,
  LogIn,
  ArrowLeft,
  Heart,
  Users,
  Shield,
  Clock,
  MapPin,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/lib/stores/auth.store';
import { Card, CardContent } from '@/components/ui/card';

export default function AboutPage() {
  const token = useAuthStore((s) => s.token);

  return (
    <>
      <div className="flex flex-col px-4 sm:px-8 md:px-16 lg:px-32 py-6 gap-8 overflow-y-scroll">
        {/* Header */}
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3">
            <ArrowLeft size={20} className="text-gray-600" />
            <img src={LostLinkLogo} alt="LostLink Logo" className="transition-all w-24 sm:w-32" />
          </Link>
          {token ? (
            <Link to="/dashboard">
              <Button className="flex text-white items-center py-5 rounded-lg gap-2">
                <span className="hidden sm:inline">Dashboard</span>
                <LayoutDashboard size={18} />
              </Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button className="flex text-white items-center py-5 rounded-lg gap-2">
                <span className="hidden sm:inline">Log In</span>
                <LogIn size={18} />
              </Button>
            </Link>
          )}
        </div>

        {/* Hero Section */}
        <div className="text-center py-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            About <span className="text-blue-600">LostLink</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Connecting lost items with their owners through technology, making the process of
            reuniting people with their belongings simple and efficient.
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-8 md:p-12">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-blue-900 mb-6">Our Mission</h2>
            <p className="text-lg text-blue-800 leading-relaxed">
              LostLink is dedicated to solving the universal problem of lost and found items. We
              believe that technology should make it easier for people to reclaim their lost
              belongings and for finders to connect with owners quickly and securely.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg rounded-2xl hover:shadow-xl transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="p-4 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Recovery</h3>
              <p className="text-gray-600 text-sm">
                Fast and efficient system to match lost items with their owners
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg rounded-2xl hover:shadow-xl transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="p-4 bg-green-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure & Safe</h3>
              <p className="text-gray-600 text-sm">
                Protected platform ensuring privacy and security for all users
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg rounded-2xl hover:shadow-xl transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="p-4 bg-purple-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Community Driven</h3>
              <p className="text-gray-600 text-sm">
                Built for and by the community to serve everyone's needs
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg rounded-2xl hover:shadow-xl transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="p-4 bg-red-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <MapPin className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Location Based</h3>
              <p className="text-gray-600 text-sm">
                Smart location tracking to help narrow down search areas
              </p>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">How LostLink Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Report Found Item</h3>
              <p className="text-gray-600">
                Someone finds a lost item and reports it on our platform with details and photos
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart Matching</h3>
              <p className="text-gray-600">
                Our system matches the found item with reported lost items using AI and location
                data
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Reunite</h3>
              <p className="text-gray-600">
                Owner and finder are connected safely to arrange the return of the lost item
              </p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-3xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">1000+</div>
              <div className="text-gray-600">Items Reunited</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">500+</div>
              <div className="text-gray-600">Students Helped</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">15+</div>
              <div className="text-gray-600">Campus Locations</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center py-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Get Started?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Whether you've lost something precious or found an item that belongs to someone else,
            LostLink is here to help make the connection.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button size="lg" className="px-8 py-3 text-white">
                Browse Lost Items
              </Button>
            </Link>
            {!token && (
              <Link to="/login">
                <Button size="lg" variant="outline" className="px-8 py-3">
                  Join as Admin
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="flex flex-col gap-2 justify-center items-center py-4">
        <p className="text-sm text-gray-700">
          &copy; {new Date().getFullYear()} LostLink. All rights reserved.
        </p>
        <p className="text-sm text-gray-700">
          Made with <Heart className="w-4 h-4 inline text-red-500" /> by{' '}
          <a href="https://fh.usg.az" target="_blank" className="hover:underline">
            Future Hub
          </a>
        </p>
      </footer>
    </>
  );
}
