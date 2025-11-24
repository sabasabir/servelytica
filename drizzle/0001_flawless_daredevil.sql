CREATE TABLE "survey_responses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"league_rating" integer,
	"tournament_rating" integer,
	"tournaments_yearly" text,
	"league_frequency" text,
	"purpose_of_play" text,
	"practice_time" text,
	"coaching_frequency" text,
	"favorite_clubs" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "survey_responses_user_id_unique" UNIQUE("user_id")
);
