import React, { useState } from "react";
import { toast } from "sonner";

interface SurveyData {
  userId: string;
  leagueRating: number;
  tournamentRating: number;
  tournamentsYearly: string;
  leagueFrequency: string;
  purposeOfPlay: string;
  practiceTime: string;
  coachingFrequency: string;
  favoriteClubs: string;
}

interface SurvayModalProps {
  userId: string;
  onComplete: () => void;
}

const SurvayModal: React.FC<SurvayModalProps> = ({ userId, onComplete }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<SurveyData>>({
    userId,
    leagueRating: 0,
    tournamentRating: 0,
    tournamentsYearly: "",
    leagueFrequency: "",
    purposeOfPlay: "",
    practiceTime: "",
    coachingFrequency: "",
    favoriteClubs: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Calculate points based on rules
  const calculatePoints = (data: Partial<SurveyData>) => {
    let points = 0;

    // Q1: League Rating
    if (data.leagueRating) {
      if (data.leagueRating < 800) points += 1;
      else if (data.leagueRating >= 800 && data.leagueRating <= 1400)
        points += 2;
      else if (data.leagueRating >= 1400 && data.leagueRating <= 2000)
        points += 3;
      else if (data.leagueRating > 2000) points += 4;
    }

    // Q2: Tournament Rating
    if (data.tournamentRating) {
      if (data.tournamentRating < 800) points += 1;
      else if (data.tournamentRating >= 800 && data.tournamentRating <= 1400)
        points += 2;
      else if (data.tournamentRating >= 1400 && data.tournamentRating <= 2000)
        points += 3;
      else if (data.tournamentRating > 2000) points += 4;
    }

    // Q3: Tournaments Yearly
    if (data.tournamentsYearly) {
      if (data.tournamentsYearly === "Less than 5") points += 1;
      else if (data.tournamentsYearly === "5") points += 2;
      else if (data.tournamentsYearly === "More than 5") points += 3;
    }

    // Q4: League Frequency
    if (data.leagueFrequency) {
      if (data.leagueFrequency === "Weekly") points += 3;
      else if (data.leagueFrequency === "Once or twice in a month") points += 2;
      else if (data.leagueFrequency === "Not regular") points += 1;
    }

    return points;
  };

  // Determine category based on total points
  const getCategory = (points: number) => {
    if (points >= 11) return "A (Top/Elite)";
    if (points >= 8) return "B (Advanced)";
    if (points >= 6) return "C (Intermediate)";
    return "D (Beginner/Entry)";
  };

  const handleInputChange = (
    field: keyof SurveyData,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.leagueRating || formData.leagueRating <= 0) {
          newErrors.leagueRating = "Please enter your league rating";
        }
        if (!formData.tournamentRating || formData.tournamentRating <= 0) {
          newErrors.tournamentRating = "Please enter your tournament rating";
        }
        break;
      case 2:
        if (!formData.tournamentsYearly) {
          newErrors.tournamentsYearly = "Please select an option";
        }
        if (!formData.leagueFrequency) {
          newErrors.leagueFrequency = "Please select an option";
        }
        break;
      case 3:
        if (!formData.purposeOfPlay.trim()) {
          newErrors.purposeOfPlay = "Please describe your purpose of play";
        }
        break;
      case 4:
        if (!formData.practiceTime.trim()) {
          newErrors.practiceTime = "Please describe your practice time";
        }
        if (!formData.coachingFrequency.trim()) {
          newErrors.coachingFrequency =
            "Please describe your coaching frequency";
        }
        break;
      case 5:
        if (!formData.favoriteClubs.trim()) {
          newErrors.favoriteClubs = "Please rank your favorite clubs";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    const totalPoints = calculatePoints(formData);
    const category = getCategory(totalPoints);

    const surveyData = {
      userId: userId,
      leagueRating: formData.leagueRating,
      tournamentRating: formData.tournamentRating,
      tournamentsYearly: formData.tournamentsYearly,
      leagueFrequency: formData.leagueFrequency,
      purposeOfPlay: formData.purposeOfPlay,
      practiceTime: formData.practiceTime,
      coachingFrequency: formData.coachingFrequency,
      favoriteClubs: formData.favoriteClubs,
    };

    console.log('Submitting survey data:', surveyData);

    try {
      const response = await fetch('/api/surveys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(surveyData),
      });

      const responseData = await response.json();
      console.log('Survey submission response:', responseData);

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to save survey');
      }

      toast.success(
        `Survey completed! Your responses have been saved successfully.`
      );
      setIsOpen(false);
      onComplete();
    } catch (error) {
      console.error("Error:", error);
      toast.error(error instanceof Error ? error.message : "An error occurred. Please try again.");
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center mb-6">
              Rating Information
            </h2>

            <div>
              <label className="block text-sm font-medium mb-2">
                What is your approx rating in the league?
              </label>
              <input
                type="number"
                value={formData.leagueRating || ""}
                onChange={(e) =>
                  handleInputChange(
                    "leagueRating",
                    parseInt(e.target.value) || 0
                  )
                }
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your league rating"
              />
              {errors.leagueRating && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.leagueRating}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                What is your approx rating in the tournament?
              </label>
              <input
                type="number"
                value={formData.tournamentRating || ""}
                onChange={(e) =>
                  handleInputChange(
                    "tournamentRating",
                    parseInt(e.target.value) || 0
                  )
                }
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your tournament rating"
              />
              {errors.tournamentRating && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.tournamentRating}
                </p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center mb-6">
              Playing Frequency
            </h2>

            <div>
              <label className="block text-sm font-medium mb-3">
                How many tournaments do you play yearly?
              </label>
              <div className="space-y-2">
                {["Less than 5", "5", "More than 5"].map((option) => (
                  <label key={option} className="flex items-center">
                    <input
                      type="radio"
                      name="tournamentsYearly"
                      value={option}
                      checked={formData.tournamentsYearly === option}
                      onChange={(e) =>
                        handleInputChange("tournamentsYearly", e.target.value)
                      }
                      className="mr-3"
                    />
                    {option}
                  </label>
                ))}
              </div>
              {errors.tournamentsYearly && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.tournamentsYearly}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">
                How often do you play league?
              </label>
              <div className="space-y-2">
                {["Weekly", "Once or twice in a month", "Not regular"].map(
                  (option) => (
                    <label key={option} className="flex items-center">
                      <input
                        type="radio"
                        name="leagueFrequency"
                        value={option}
                        checked={formData.leagueFrequency === option}
                        onChange={(e) =>
                          handleInputChange("leagueFrequency", e.target.value)
                        }
                        className="mr-3"
                      />
                      {option}
                    </label>
                  )
                )}
              </div>
              {errors.leagueFrequency && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.leagueFrequency}
                </p>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center mb-6">
              Motivation & Purpose
            </h2>

            <div>
              <label className="block text-sm font-medium mb-2">
                What is your purpose of play?
              </label>
              <textarea
                value={formData.purposeOfPlay || ""}
                onChange={(e) =>
                  handleInputChange("purposeOfPlay", e.target.value)
                }
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 h-24"
                placeholder="Describe your purpose of playing..."
              />
              {errors.purposeOfPlay && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.purposeOfPlay}
                </p>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center mb-6">
              Practice & Training
            </h2>

            <div>
              <label className="block text-sm font-medium mb-2">
                What is your usual time to practice?
              </label>
              <textarea
                value={formData.practiceTime || ""}
                onChange={(e) =>
                  handleInputChange("practiceTime", e.target.value)
                }
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 h-24"
                placeholder="Describe your practice schedule..."
              />
              {errors.practiceTime && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.practiceTime}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                How often do you take coaching?
              </label>
              <textarea
                value={formData.coachingFrequency || ""}
                onChange={(e) =>
                  handleInputChange("coachingFrequency", e.target.value)
                }
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 h-24"
                placeholder="Describe your coaching frequency..."
              />
              {errors.coachingFrequency && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.coachingFrequency}
                </p>
              )}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center mb-6">Preferences</h2>

            <div>
              <label className="block text-sm font-medium mb-2">
                Rank your favorite clubs
              </label>
              <textarea
                value={formData.favoriteClubs || ""}
                onChange={(e) =>
                  handleInputChange("favoriteClubs", e.target.value)
                }
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 h-32"
                placeholder="List and rank your favorite clubs (e.g., 1. Club A, 2. Club B, 3. Club C...)"
              />
              {errors.favoriteClubs && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.favoriteClubs}
                </p>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">Player Survey</h1>
            <span className="text-sm text-gray-500">
              Step {currentStep} of 5
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            ></div>
          </div>
        </div>

        {renderStep()}

        <div className="flex justify-between mt-8">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="px-6 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>

          {currentStep < 5 ? (
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Complete Survey
            </button>
          )}
        </div>

        <div className="mt-4 text-center text-sm text-gray-600">
          <p>⚠️ This survey is mandatory and cannot be skipped</p>
          <p>Your responses will be used for categorization and matching</p>
        </div>
      </div>
    </div>
  );
};

export default SurvayModal;
