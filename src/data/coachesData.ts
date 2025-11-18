
import { Coach } from "@/types/Coach";

export const allCoaches: Coach[] = [
  {
    id: 1,
    name: "Michael Chen",
    username: "michael_chen",
    image: "/placeholder.svg",
    title: "Former National Champion",
    rating: 4.9,
    reviews: 124,
    responseTime: "24 hours",
    specialties: ["Footwork", "Service", "Strategy"],
    experience: "15+ years",
    category: "professional",
    achievements: [
      {
        year: "2019",
        title: "National Team Coach",
        description: "Led national team to Asian Championships semifinals"
      },
      {
        year: "2015",
        title: "National Singles Champion",
        description: "Won the national championships men's singles title"
      }
    ]
  },
  {
    id: 2,
    name: "Sarah Wong",
    username: "sarah_wong",
    image: "/placeholder.svg",
    title: "Olympic Medalist",
    rating: 5.0,
    reviews: 98,
    responseTime: "48 hours",
    specialties: ["Backhand", "Loops", "Match Analysis"],
    experience: "12+ years",
    category: "elite",
    achievements: [
      {
        year: "2016",
        title: "Olympic Bronze Medalist",
        description: "Women's Singles Table Tennis"
      }
    ]
  },
  {
    id: 3,
    name: "David Müller",
    username: "david_muller",
    image: "/placeholder.svg",
    title: "Professional Coach",
    rating: 4.8,
    reviews: 156,
    responseTime: "24 hours",
    specialties: ["Serve Return", "Technique", "Mental Game"],
    experience: "10+ years",
    category: "professional",
    achievements: []
  },
  {
    id: 4,
    name: "Liu Yang",
    username: "liu_yang",
    image: "/placeholder.svg",
    title: "National Team Coach",
    rating: 4.9,
    reviews: 87,
    responseTime: "36 hours",
    specialties: ["Penhold Style", "Forehand Loop", "Serve"],
    experience: "20+ years",
    category: "elite",
    achievements: [
      {
        year: "2018",
        title: "Coach of the Year",
        description: "National Table Tennis Association award recipient"
      }
    ]
  },
  {
    id: 5,
    name: "Emily Johnson",
    username: "emily_johnson",
    image: "/placeholder.svg",
    title: "Certified ITTF Coach",
    rating: 4.7,
    reviews: 73,
    responseTime: "24 hours",
    specialties: ["Beginner Training", "Fundamentals", "Technique"],
    experience: "8+ years",
    category: "certified",
    achievements: []
  },
  {
    id: 6,
    name: "Carlos Rodriguez",
    username: "carlos_rodriguez",
    image: "/placeholder.svg",
    title: "Former Pro Player",
    rating: 4.8,
    reviews: 92,
    responseTime: "48 hours",
    specialties: ["Defensive Play", "Chopping", "Match Strategy"],
    experience: "15+ years",
    category: "professional",
    achievements: [
      {
        year: "2012",
        title: "Continental Champion",
        description: "Men's Singles, Pan-American Championships"
      }
    ]
  }
];
