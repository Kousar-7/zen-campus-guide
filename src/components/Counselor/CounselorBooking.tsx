import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  MapPin,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  Star,
  Navigation,
  BookOpen,
  Heart,
  CheckCircle
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Counselor {
  id: string;
  name: string;
  title: string;
  specialties: string[];
  rating: number;
  experience: number;
  location: string;
  distance: number;
  availability: string[];
  price: number;
  image: string;
  isOnline: boolean;
}

interface Appointment {
  id: string;
  counselorId: string;
  date: string;
  time: string;
  type: 'in-person' | 'online';
  notes: string;
  status: 'pending' | 'confirmed' | 'completed';
}

export const CounselorBooking = () => {
  const [counselors, setCounselors] = useState<Counselor[]>([]);
  const [selectedCounselor, setSelectedCounselor] = useState<Counselor | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showBooking, setShowBooking] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [searchRadius, setSearchRadius] = useState("10");
  
  // Booking form state
  const [bookingForm, setBookingForm] = useState({
    date: '',
    time: '',
    type: 'in-person' as 'in-person' | 'online',
    notes: ''
  });

  // Mock counselor data
  const mockCounselors: Counselor[] = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      title: 'Licensed Clinical Psychologist',
      specialties: ['Anxiety', 'Depression', 'Student Counseling', 'CBT'],
      rating: 4.9,
      experience: 12,
      location: 'Downtown Campus Center',
      distance: 0.5,
      availability: ['Mon', 'Wed', 'Fri'],
      price: 120,
      image: '👩‍⚕️',
      isOnline: true
    },
    {
      id: '2',
      name: 'Dr. Michael Chen',
      title: 'Student Wellness Specialist',
      specialties: ['Academic Stress', 'Performance Anxiety', 'Mindfulness'],
      rating: 4.8,
      experience: 8,
      location: 'Student Health Center',
      distance: 0.8,
      availability: ['Tue', 'Thu', 'Sat'],
      price: 100,
      image: '👨‍⚕️',
      isOnline: true
    },
    {
      id: '3',
      name: 'Dr. Emily Rodriguez',
      title: 'Mental Health Counselor',
      specialties: ['Crisis Support', 'PTSD', 'Group Therapy', 'Trauma'],
      rating: 4.7,
      experience: 15,
      location: 'Community Wellness Center',
      distance: 2.1,
      availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      price: 90,
      image: '👩‍⚕️',
      isOnline: false
    }
  ];

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          // Load counselors based on location
          setCounselors(mockCounselors.filter(c => c.distance <= parseInt(searchRadius)));
        },
        () => {
          // Fallback to showing all counselors
          setCounselors(mockCounselors);
          toast({
            title: "Location Access",
            description: "Unable to get your location. Showing all available counselors."
          });
        }
      );
    } else {
      setCounselors(mockCounselors);
    }
  }, [searchRadius]);

  const handleBookAppointment = () => {
    if (!selectedCounselor || !bookingForm.date || !bookingForm.time) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const newAppointment: Appointment = {
      id: Date.now().toString(),
      counselorId: selectedCounselor.id,
      date: bookingForm.date,
      time: bookingForm.time,
      type: bookingForm.type,
      notes: bookingForm.notes,
      status: 'pending'
    };

    setAppointments(prev => [...prev, newAppointment]);
    setShowBooking(false);
    setSelectedCounselor(null);
    setBookingForm({ date: '', time: '', type: 'in-person', notes: '' });

    toast({
      title: "Appointment Booked! 📅",
      description: `Your appointment with ${selectedCounselor.name} has been submitted for confirmation.`
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500/20 text-green-600';
      case 'pending': return 'bg-yellow-500/20 text-yellow-600';
      case 'completed': return 'bg-blue-500/20 text-blue-600';
      default: return 'bg-gray-500/20 text-gray-600';
    }
  };

  if (showBooking && selectedCounselor) {
    return (
      <Card className="bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Book Appointment with {selectedCounselor.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Counselor Info */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="text-2xl">{selectedCounselor.image}</div>
              <div>
                <h3 className="font-semibold">{selectedCounselor.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedCounselor.title}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500" />
                {selectedCounselor.rating}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {selectedCounselor.distance} km away
              </span>
              <span>${selectedCounselor.price}/session</span>
            </div>
          </div>

          {/* Booking Form */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Preferred Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={bookingForm.date}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, date: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <Label htmlFor="time">Preferred Time</Label>
                <Select value={bookingForm.time} onValueChange={(value) => setBookingForm(prev => ({ ...prev, time: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="09:00">9:00 AM</SelectItem>
                    <SelectItem value="10:00">10:00 AM</SelectItem>
                    <SelectItem value="11:00">11:00 AM</SelectItem>
                    <SelectItem value="14:00">2:00 PM</SelectItem>
                    <SelectItem value="15:00">3:00 PM</SelectItem>
                    <SelectItem value="16:00">4:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="type">Session Type</Label>
              <Select value={bookingForm.type} onValueChange={(value: 'in-person' | 'online') => setBookingForm(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in-person">In-Person</SelectItem>
                  {selectedCounselor.isOnline && <SelectItem value="online">Online Session</SelectItem>}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Anything specific you'd like to discuss..."
                value={bookingForm.notes}
                onChange={(e) => setBookingForm(prev => ({ ...prev, notes: e.target.value }))}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button onClick={handleBookAppointment} className="flex-1">
              <CheckCircle className="w-4 h-4 mr-2" />
              Book Appointment
            </Button>
            <Button variant="outline" onClick={() => setShowBooking(false)}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Find a Counselor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search Options */}
        <div className="flex gap-4">
          <div className="flex-1">
            <Label htmlFor="radius">Search Radius</Label>
            <Select value={searchRadius} onValueChange={setSearchRadius}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 km</SelectItem>
                <SelectItem value="10">10 km</SelectItem>
                <SelectItem value="25">25 km</SelectItem>
                <SelectItem value="50">50 km</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" className="mt-6">
            <Navigation className="w-4 h-4 mr-2" />
            Update Location
          </Button>
        </div>

        {/* My Appointments */}
        {appointments.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              My Appointments
            </h3>
            {appointments.slice(-2).map((appointment) => {
              const counselor = counselors.find(c => c.id === appointment.counselorId);
              return (
                <div key={appointment.id} className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium">{counselor?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {appointment.date} at {appointment.time}
                      </p>
                    </div>
                    <Badge className={getStatusColor(appointment.status)}>
                      {appointment.status}
                    </Badge>
                  </div>
                  <p className="text-sm">
                    {appointment.type === 'online' ? '💻 Online Session' : '🏢 In-Person'}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* Available Counselors */}
        <div className="space-y-3">
          <h3 className="font-semibold">Available Counselors Near You</h3>
          {counselors.map((counselor) => (
            <div key={counselor.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{counselor.image}</div>
                  <div>
                    <h4 className="font-semibold">{counselor.name}</h4>
                    <p className="text-sm text-muted-foreground">{counselor.title}</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => {
                    setSelectedCounselor(counselor);
                    setShowBooking(true);
                  }}
                >
                  Book Now
                </Button>
              </div>

              <div className="flex flex-wrap gap-1 mb-3">
                {counselor.specialties.map((specialty) => (
                  <Badge key={specialty} variant="secondary" className="text-xs">
                    {specialty}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    {counselor.rating}
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    {counselor.experience}y exp
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {counselor.distance} km
                  </span>
                </div>
                <span className="font-medium">${counselor.price}</span>
              </div>

              {counselor.isOnline && (
                <Badge variant="outline" className="mt-2 bg-green-500/10 text-green-600 border-green-500/30">
                  💻 Online Available
                </Badge>
              )}
            </div>
          ))}
        </div>

        {/* Crisis Support */}
        <Card className="bg-red-500/10 border-red-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-5 h-5 text-red-500" />
              <h3 className="font-semibold text-red-700">Need Immediate Support?</h3>
            </div>
            <p className="text-sm text-red-600 mb-3">
              If you're experiencing a mental health crisis, please reach out immediately.
            </p>
            <div className="flex gap-2">
              <Button size="sm" variant="destructive">
                <Phone className="w-4 h-4 mr-2" />
                Crisis Hotline
              </Button>
              <Button size="sm" variant="outline" className="border-red-500/30 text-red-600">
                <Mail className="w-4 h-4 mr-2" />
                Emergency Contact
              </Button>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};