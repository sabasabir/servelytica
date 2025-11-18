
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type UserRole = 'coach' | 'player';

interface PersonalDetailsSectionProps {
  name: string;
  setName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
}

const PersonalDetailsSection = ({
  name,
  setName,
  email,
  setEmail,
  role,
  setRole
}: PersonalDetailsSectionProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input 
          id="name" 
          placeholder="John Doe" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email" 
          type="email" 
          placeholder="name@example.com" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label>I am a</Label>
        <RadioGroup 
          value={role} 
          onValueChange={(value) => setRole(value as UserRole)}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="player" id="player" />
            <Label htmlFor="player" className="cursor-pointer">Player</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="coach" id="coach" />
            <Label htmlFor="coach" className="cursor-pointer">Coach</Label>
          </div>
        </RadioGroup>
      </div>
    </>
  );
};

export default PersonalDetailsSection;
