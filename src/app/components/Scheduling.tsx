import { useState } from "react";
import { Calendar } from "./ui/calendar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Calendar as CalendarIcon, Clock, Video, Check } from "lucide-react";
import { format, addDays, setHours, setMinutes, isBefore, isWeekend } from "date-fns";
import { useLanguage } from "../contexts/LanguageContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export function Scheduling() {
  const { t, language } = useLanguage();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    notes: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Generate available time slots
  const getAvailableTimeSlots = (date: Date | undefined) => {
    if (!date) return [];
    
    // Don't show times for weekends
    if (isWeekend(date)) return [];

    const slots = [];
    
    // Morning slots (9:00 AM - 12:00 PM)
    for (let hour = 9; hour < 12; hour++) {
      slots.push({
        time: `${hour}:00`,
        label: `${hour}:00 AM`,
        period: t("scheduling.morning")
      });
      slots.push({
        time: `${hour}:30`,
        label: `${hour}:30 AM`,
        period: t("scheduling.morning")
      });
    }
    
    // Afternoon slots (1:00 PM - 5:00 PM)
    for (let hour = 13; hour < 17; hour++) {
      const displayHour = hour > 12 ? hour - 12 : hour;
      slots.push({
        time: `${hour}:00`,
        label: `${displayHour}:00 PM`,
        period: t("scheduling.afternoon")
      });
      slots.push({
        time: `${hour}:30`,
        label: `${displayHour}:30 PM`,
        period: t("scheduling.afternoon")
      });
    }
    
    // Evening slots (5:00 PM - 6:00 PM)
    slots.push({
      time: `17:00`,
      label: `5:00 PM`,
      period: t("scheduling.evening")
    });
    slots.push({
      time: `17:30`,
      label: `5:30 PM`,
      period: t("scheduling.evening")
    });
    
    return slots;
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime(""); // Reset time when date changes
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const messages = {
      en: "Booking request submitted! You'll receive a confirmation email shortly.",
      fr: "Demande de réservation soumise ! Vous recevrez un e-mail de confirmation bientôt.",
      pt: "Solicitação de agendamento enviada! Você receberá um email de confirmação em breve."
    };
    alert(messages[language]);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setSelectedDate(undefined);
      setSelectedTime("");
      setFormData({ name: "", email: "", phone: "", service: "", notes: "" });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const timeSlots = getAvailableTimeSlots(selectedDate);
  const isFormValid = selectedDate && selectedTime && formData.name && formData.email && formData.service;

  // Group time slots by period
  const morningSlots = timeSlots.filter(s => s.period === t("scheduling.morning"));
  const afternoonSlots = timeSlots.filter(s => s.period === t("scheduling.afternoon"));
  const eveningSlots = timeSlots.filter(s => s.period === t("scheduling.evening"));

  const services = [
    { value: "personal", label: t("scheduling.servicePersonal") },
    { value: "newcomer", label: t("scheduling.serviceNewcomer") },
    { value: "smallBusiness", label: t("scheduling.serviceSmallBusiness") },
    { value: "compliance", label: t("scheduling.serviceCompliance") },
    { value: "planning", label: t("scheduling.servicePlanning") },
    { value: "representation", label: t("scheduling.serviceRepresentation") }
  ];

  return (
    <section id="scheduling" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-blue-600 uppercase tracking-wide mb-3">
            {t("scheduling.section")}
          </div>
          <h2 className="text-4xl text-slate-900 mb-4">
            {t("scheduling.title")}
          </h2>
          <p className="text-lg text-slate-600">
            {t("scheduling.description")}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Calendar Section */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8">
            <div className="flex items-center gap-2 mb-6">
              <CalendarIcon className="w-5 h-5 text-blue-600" />
              <h3 className="text-xl text-slate-900">{t("scheduling.selectDate")}</h3>
            </div>
            
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={(date) => 
                isBefore(date, new Date()) || 
                isWeekend(date) ||
                isBefore(date, addDays(new Date(), -1))
              }
              className="rounded-md border w-full"
            />

            {selectedDate && (
              <div className="mt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <h3 className="text-xl text-slate-900">{t("scheduling.selectTime")}</h3>
                </div>

                {timeSlots.length === 0 ? (
                  <p className="text-slate-500 text-center py-4">
                    {t("scheduling.noTimesAvailable")}
                  </p>
                ) : (
                  <div className="space-y-4">
                    {morningSlots.length > 0 && (
                      <div>
                        <div className="text-sm text-slate-600 mb-2">{t("scheduling.morning")}</div>
                        <div className="grid grid-cols-3 gap-2">
                          {morningSlots.map((slot) => (
                            <button
                              key={slot.time}
                              onClick={() => setSelectedTime(slot.time)}
                              className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                                selectedTime === slot.time
                                  ? "bg-blue-600 text-white border-blue-600"
                                  : "bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50"
                              }`}
                            >
                              {slot.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {afternoonSlots.length > 0 && (
                      <div>
                        <div className="text-sm text-slate-600 mb-2">{t("scheduling.afternoon")}</div>
                        <div className="grid grid-cols-3 gap-2">
                          {afternoonSlots.map((slot) => (
                            <button
                              key={slot.time}
                              onClick={() => setSelectedTime(slot.time)}
                              className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                                selectedTime === slot.time
                                  ? "bg-blue-600 text-white border-blue-600"
                                  : "bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50"
                              }`}
                            >
                              {slot.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {eveningSlots.length > 0 && (
                      <div>
                        <div className="text-sm text-slate-600 mb-2">{t("scheduling.evening")}</div>
                        <div className="grid grid-cols-3 gap-2">
                          {eveningSlots.map((slot) => (
                            <button
                              key={slot.time}
                              onClick={() => setSelectedTime(slot.time)}
                              className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                                selectedTime === slot.time
                                  ? "bg-blue-600 text-white border-blue-600"
                                  : "bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50"
                              }`}
                            >
                              {slot.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Booking Form Section */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8">
            <h3 className="text-xl text-slate-900 mb-6">
              {t("scheduling.bookingDetails")}
            </h3>

            {selectedDate && selectedTime && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">{t("scheduling.selectedDate")}:</span>
                  <span className="text-slate-900">
                    {format(selectedDate, "MMMM dd, yyyy")}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">{t("scheduling.selectedTime")}:</span>
                  <span className="text-slate-900">{selectedTime}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name">{t("scheduling.fullName")} *</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Smith"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{t("scheduling.email")} *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">{t("scheduling.phone")}</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="(555) 123-4567"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="service">{t("scheduling.serviceType")} *</Label>
                <Select
                  value={formData.service}
                  onValueChange={(value) => setFormData({ ...formData, service: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("scheduling.selectService")} />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service.value} value={service.value}>
                        {service.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">{t("scheduling.additionalNotes")}</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder={t("scheduling.notesPlaceholder")}
                  rows={4}
                  className="resize-none"
                />
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex items-start gap-3">
                <Video className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-slate-600">
                  {t("scheduling.virtualMeeting")}
                </p>
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={!isFormValid || isSubmitted}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitted ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    {t("scheduling.bookingSuccess")}
                  </>
                ) : (
                  <>
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    {t("scheduling.confirmBooking")}
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
