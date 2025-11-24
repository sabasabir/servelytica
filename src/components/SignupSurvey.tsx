import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export interface SignupSurveyData {
  leagueRating: number;
  tournamentRating: number;
  tournamentsYearly: string;
  leagueFrequency: string;
  purposeOfPlay: string;
  practiceTime: string;
  coachingFrequency: string;
  favoriteClubs: string;
}

interface SignupSurveyProps {
  data: Partial<SignupSurveyData>;
  onChange: (data: Partial<SignupSurveyData>) => void;
}

const SignupSurvey: React.FC<SignupSurveyProps> = ({ data, onChange }) => {
  const handleChange = (field: keyof SignupSurveyData, value: string | number) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Player Profile Questions</CardTitle>
        <p className="text-sm text-gray-600 mt-2">Help us understand your playing level</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* League Rating */}
        <div className="space-y-2">
          <Label className="font-semibold text-sm">What is your League Rating? *</Label>
          <Input
            type="number"
            value={data.leagueRating || ""}
            onChange={(e) => handleChange("leagueRating", parseInt(e.target.value) || 0)}
            placeholder="e.g., 1000"
            min="0"
          />
          <p className="text-xs text-gray-500">Enter your current league rating</p>
        </div>

        {/* Tournament Rating */}
        <div className="space-y-2">
          <Label className="font-semibold text-sm">What is your Tournament Rating? *</Label>
          <Input
            type="number"
            value={data.tournamentRating || ""}
            onChange={(e) => handleChange("tournamentRating", parseInt(e.target.value) || 0)}
            placeholder="e.g., 900"
            min="0"
          />
          <p className="text-xs text-gray-500">Enter your current tournament rating</p>
        </div>

        {/* Tournaments Yearly */}
        <div className="space-y-2">
          <Label className="font-semibold text-sm">How many tournaments do you play per year? *</Label>
          <Select value={data.tournamentsYearly || ""} onValueChange={(val) => handleChange("tournamentsYearly", val)}>
            <SelectTrigger>
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Less than 5">Less than 5</SelectItem>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="More than 5">More than 5</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* League Frequency */}
        <div className="space-y-2">
          <Label className="font-semibold text-sm">How often do you play in league? *</Label>
          <Select value={data.leagueFrequency || ""} onValueChange={(val) => handleChange("leagueFrequency", val)}>
            <SelectTrigger>
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Weekly">Weekly</SelectItem>
              <SelectItem value="Once or twice in a month">Once or twice in a month</SelectItem>
              <SelectItem value="Not regular">Not regular</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Purpose of Play */}
        <div className="space-y-2">
          <Label className="font-semibold text-sm">What is your main purpose for playing?</Label>
          <Input
            type="text"
            value={data.purposeOfPlay || ""}
            onChange={(e) => handleChange("purposeOfPlay", e.target.value)}
            placeholder="e.g., Recreation, Competition, Fitness..."
          />
        </div>

        {/* Practice Time */}
        <div className="space-y-2">
          <Label className="font-semibold text-sm">How much time do you dedicate to practice per week?</Label>
          <Input
            type="text"
            value={data.practiceTime || ""}
            onChange={(e) => handleChange("practiceTime", e.target.value)}
            placeholder="e.g., 5-10 hours"
          />
        </div>

        {/* Coaching Frequency */}
        <div className="space-y-2">
          <Label className="font-semibold text-sm">How often do you take coaching?</Label>
          <Select value={data.coachingFrequency || ""} onValueChange={(val) => handleChange("coachingFrequency", val)}>
            <SelectTrigger>
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Weekly">Weekly</SelectItem>
              <SelectItem value="Monthly">Monthly</SelectItem>
              <SelectItem value="Occasionally">Occasionally</SelectItem>
              <SelectItem value="Never">Never</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Favorite Clubs */}
        <div className="space-y-2">
          <Label className="font-semibold text-sm">What are your favorite clubs/venues?</Label>
          <Input
            type="text"
            value={data.favoriteClubs || ""}
            onChange={(e) => handleChange("favoriteClubs", e.target.value)}
            placeholder="e.g., Club A, Club B..."
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default SignupSurvey;
