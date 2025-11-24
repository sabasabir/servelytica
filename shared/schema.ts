import { pgTable, uuid, text, timestamp, boolean, integer, decimal, jsonb, pgEnum, check, unique, varchar, real } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';

// Enums
export const appRoleEnum = pgEnum('app_role', ['admin', 'coach', 'player']);
export const subscriptionTypeEnum = pgEnum('subscription_type', ['monthly', 'yearly', 'free']);
export const subscriptionStatusEnum = pgEnum('subscription_status', ['active', 'cancelled', 'expired', 'pending']);
export const coachProficiencyEnum = pgEnum('coach_proficiency', ['beginner', 'intermediate', 'advanced', 'expert']);
export const mediaTypeEnum = pgEnum('media_type', ['video', 'photo', 'audio', 'document', 'note']);

// Users table (replaces Supabase auth.users)
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  username: text('username').notNull().unique(),
  displayName: text('display_name'),
  replitUserId: text('replit_user_id').unique(),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// Core tables
export const profiles = pgTable('profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().unique(),
  username: text('username').unique().notNull(),
  displayName: text('display_name'),
  avatarUrl: text('avatar_url'),
  bio: text('bio'),
  phone: text('phone'),
  location: text('location'),
  playingExperience: text('playing_experience'),
  preferredPlayStyle: text('preferred_play_style'),
  memberSince: timestamp('member_since', { withTimezone: true }).defaultNow(),
  profileImage: text('profile_image'),
  sportId: uuid('sport_id'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const userRoles = pgTable('user_roles', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull(),
  role: appRoleEnum('role').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  uniqueUserRole: unique().on(table.userId, table.role),
}));

export const sports = pgTable('sports', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// Video and analysis tables
export const videos = pgTable('videos', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull(),
  filePath: text('file_path').notNull(),
  fileName: text('file_name').notNull(),
  fileSize: integer('file_size'),
  title: text('title'),
  description: text('description'),
  focusArea: text('focus_area'),
  uploadedAt: timestamp('uploaded_at', { withTimezone: true }).defaultNow(),
  analyzed: boolean('analyzed').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const videoCoaches = pgTable('video_coaches', {
  id: uuid('id').defaultRandom().primaryKey(),
  videoId: uuid('video_id').notNull(),
  coachId: uuid('coach_id').notNull(),
  status: text('status').default('pending').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true}).defaultNow().notNull(),
}, (table) => ({
  uniqueVideoCoach: unique().on(table.videoId, table.coachId),
}));

export const videoFeedback = pgTable('video_feedback', {
  id: uuid('id').defaultRandom().primaryKey(),
  videoId: uuid('video_id').notNull(),
  coachId: uuid('coach_id').notNull(),
  playerId: uuid('player_id').notNull(),
  feedbackText: text('feedback_text').notNull(),
  rating: integer('rating'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// Performance metrics
export const performanceMetrics = pgTable('performance_metrics', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull(),
  month: text('month').notNull(),
  rating: integer('rating').default(0).notNull(),
  wins: integer('wins').default(0).notNull(),
  losses: integer('losses').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// Pricing and subscriptions
export const pricing = pgTable('pricing', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  monthlyPrice: decimal('monthly_price', { precision: 10, scale: 2 }).default('0').notNull(),
  yearlyPrice: decimal('yearly_price', { precision: 10, scale: 2 }).default('0').notNull(),
  features: text('features').array().notNull().default([]),
  recommended: boolean('recommended').default(false).notNull(),
  buttonText: text('button_text').default('Get Started').notNull(),
  buttonVariant: text('button_variant').default('outline').notNull(),
  displayOrder: integer('display_order').default(0).notNull(),
  analysisLimit: integer('analysis_limit').default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const usersSubscription = pgTable('users_subscription', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull(),
  pricingPlanId: uuid('pricing_plan_id').notNull(),
  subscriptionType: subscriptionTypeEnum('subscription_type').default('free').notNull(),
  status: subscriptionStatusEnum('status').default('pending').notNull(),
  startDate: timestamp('start_date', { withTimezone: true }).defaultNow().notNull(),
  endDate: timestamp('end_date', { withTimezone: true }),
  pricePaid: decimal('price_paid', { precision: 10, scale: 2 }).default('0').notNull(),
  currency: text('currency').default('USD').notNull(),
  autoRenew: boolean('auto_renew').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const analysisUsage = pgTable('analysis_usage', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull(),
  videoId: uuid('video_id').notNull(),
  analysisDate: timestamp('analysis_date', { withTimezone: true }).defaultNow().notNull(),
  resetDate: timestamp('reset_date', { withTimezone: true }).notNull(),
  subscriptionPlanId: uuid('subscription_plan_id').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// Coach profiles and specialties
export const specialtyTypes = pgTable('specialty_types', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull().unique(),
  description: text('description'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const focusAreas = pgTable('focus_areas', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull().unique(),
  description: text('description'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const coachProfiles = pgTable('coach_profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().unique(),
  yearsCoaching: integer('years_coaching').default(0),
  certifications: text('certifications').array(),
  languages: text('languages').array(),
  coachingPhilosophy: text('coaching_philosophy'),
  ratePerHour: decimal('rate_per_hour'),
  currency: text('currency').default('USD'),
  availabilitySchedule: jsonb('availability_schedule'),
  verified: boolean('verified').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const coachSpecialties = pgTable('coach_specialties', {
  id: uuid('id').defaultRandom().primaryKey(),
  coachProfileId: uuid('coach_profile_id').notNull(),
  specialtyTypeId: uuid('specialty_type_id').notNull(),
  proficiency: coachProficiencyEnum('proficiency').default('intermediate').notNull(),
  yearsExperience: integer('years_experience').default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  uniqueCoachSpecialty: unique().on(table.coachProfileId, table.specialtyTypeId),
}));

export const coachAchievements = pgTable('coach_achievements', {
  id: uuid('id').defaultRandom().primaryKey(),
  coachProfileId: uuid('coach_profile_id').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  year: integer('year'),
  organization: text('organization'),
  achievementType: text('achievement_type'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const coachEducation = pgTable('coach_education', {
  id: uuid('id').defaultRandom().primaryKey(),
  coachProfileId: uuid('coach_profile_id').notNull(),
  degree: text('degree').notNull(),
  institution: text('institution').notNull(),
  yearCompleted: integer('year_completed'),
  fieldOfStudy: text('field_of_study'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const coachStatistics = pgTable('coach_statistics', {
  id: uuid('id').defaultRandom().primaryKey(),
  coachProfileId: uuid('coach_profile_id').notNull().unique(),
  totalSessions: integer('total_sessions').default(0),
  totalStudents: integer('total_students').default(0),
  averageRating: decimal('average_rating', { precision: 3, scale: 2 }).default('0'),
  totalReviews: integer('total_reviews').default(0),
  responseTimeHours: integer('response_time_hours').default(24),
  successRate: decimal('success_rate', { precision: 5, scale: 2 }).default('0'),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// Motion Analysis tables
export const motionAnalysisSessions = pgTable('motion_analysis_sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull(),
  videoId: uuid('video_id'),
  videoUrl: text('video_url'),
  videoFilePath: text('video_file_path'),
  title: text('title').notNull(),
  description: text('description'),
  sportType: text('sport_type').default('table-tennis'),
  mediaType: mediaTypeEnum('media_type').default('video').notNull(),
  analysisStatus: text('analysis_status').default('pending'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const motionAnalysisResults = pgTable('motion_analysis_results', {
  id: uuid('id').defaultRandom().primaryKey(),
  sessionId: uuid('session_id').notNull(),
  analysisType: text('analysis_type').notNull(),
  score: decimal('score', { precision: 3, scale: 2 }),
  feedback: text('feedback'),
  areasOfImprovement: jsonb('areas_of_improvement'),
  strengths: jsonb('strengths'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const motionAnalysisFrames = pgTable('motion_analysis_frames', {
  id: uuid('id').defaultRandom().primaryKey(),
  sessionId: uuid('session_id').notNull(),
  frameNumber: integer('frame_number').notNull(),
  timestampMs: integer('timestamp_ms').notNull(),
  annotations: jsonb('annotations'),
  poseData: jsonb('pose_data'),
  techniqueNotes: text('technique_notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const motionAnalysisAnnotations = pgTable('motion_analysis_annotations', {
  id: uuid('id').defaultRandom().primaryKey(),
  frameId: uuid('frame_id'),
  sessionId: uuid('session_id').notNull(),
  annotationType: text('annotation_type').notNull(),
  coordinates: jsonb('coordinates').notNull(),
  color: text('color').default('#FF0000'),
  label: text('label'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const motionTrackingData = pgTable('motion_tracking_data', {
  id: uuid('id').defaultRandom().primaryKey(),
  sessionId: uuid('session_id').notNull(),
  timestampMs: integer('timestamp_ms').notNull(),
  jointPositions: jsonb('joint_positions'),
  velocityData: jsonb('velocity_data'),
  accelerationData: jsonb('acceleration_data'),
  angleData: jsonb('angle_data'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// Private Analysis Space tables
export const coachStudentRelationships = pgTable('coach_student_relationships', {
  id: uuid('id').defaultRandom().primaryKey(),
  coachId: uuid('coach_id').notNull(),
  studentId: uuid('student_id').notNull(),
  status: varchar('status', { length: 50 }).default('pending').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  acceptedAt: timestamp('accepted_at', { withTimezone: true }),
  notes: text('notes'),
}, (table) => ({
  uniqueCoachStudent: unique().on(table.coachId, table.studentId),
}));

export const privateAnalysisSessions = pgTable('private_analysis_sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  coachId: uuid('coach_id').notNull(),
  studentId: uuid('student_id').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  status: varchar('status', { length: 50 }).default('draft').notNull(),
  sessionType: varchar('session_type', { length: 50 }).default('video_analysis').notNull(),
  scheduledFor: timestamp('scheduled_for', { withTimezone: true }),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const sessionVideos = pgTable('session_videos', {
  id: uuid('id').defaultRandom().primaryKey(),
  sessionId: uuid('session_id').notNull(),
  videoId: uuid('video_id'),
  videoUrl: text('video_url'),
  videoFilePath: text('video_file_path'),
  title: varchar('title', { length: 255 }),
  description: text('description'),
  uploadedBy: uuid('uploaded_by').notNull(),
  durationSeconds: integer('duration_seconds'),
  thumbnailUrl: text('thumbnail_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const sessionComments = pgTable('session_comments', {
  id: uuid('id').defaultRandom().primaryKey(),
  sessionId: uuid('session_id').notNull(),
  userId: uuid('user_id').notNull(),
  parentCommentId: uuid('parent_comment_id'),
  commentText: text('comment_text').notNull(),
  videoTimestampSeconds: real('video_timestamp_seconds'),
  isPrivate: boolean('is_private').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  edited: boolean('edited').default(false),
});

export const sessionAnnotations = pgTable('session_annotations', {
  id: uuid('id').defaultRandom().primaryKey(),
  sessionId: uuid('session_id').notNull(),
  videoId: uuid('video_id'),
  userId: uuid('user_id').notNull(),
  annotationType: varchar('annotation_type', { length: 50 }).notNull(),
  coordinates: jsonb('coordinates').notNull(),
  color: varchar('color', { length: 7 }).default('#FF0000'),
  label: text('label'),
  videoTimestampSeconds: real('video_timestamp_seconds'),
  frameNumber: integer('frame_number'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const sessionNotes = pgTable('session_notes', {
  id: uuid('id').defaultRandom().primaryKey(),
  sessionId: uuid('session_id').notNull(),
  userId: uuid('user_id').notNull(),
  noteType: varchar('note_type', { length: 50 }).default('general').notNull(),
  noteText: text('note_text').notNull(),
  isShared: boolean('is_shared').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const analysisRequests = pgTable('analysis_requests', {
  id: uuid('id').defaultRandom().primaryKey(),
  studentId: uuid('student_id').notNull(),
  coachId: uuid('coach_id').notNull(),
  videoId: uuid('video_id'),
  requestType: varchar('request_type', { length: 50 }).default('general').notNull(),
  priority: varchar('priority', { length: 20 }).default('normal').notNull(),
  requestMessage: text('request_message'),
  status: varchar('status', { length: 50 }).default('pending').notNull(),
  sessionId: uuid('session_id'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  respondedAt: timestamp('responded_at', { withTimezone: true }),
  completedAt: timestamp('completed_at', { withTimezone: true }),
});

export const sessionProgress = pgTable('session_progress', {
  id: uuid('id').defaultRandom().primaryKey(),
  sessionId: uuid('session_id').notNull(),
  studentId: uuid('student_id').notNull(),
  metricType: varchar('metric_type', { length: 50 }).notNull(),
  metricValue: decimal('metric_value', { precision: 5, scale: 2 }),
  notes: text('notes'),
  recordedAt: timestamp('recorded_at', { withTimezone: true }).defaultNow().notNull(),
  recordedBy: uuid('recorded_by').notNull(),
});

export const analysisNotifications = pgTable('analysis_notifications', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull(),
  notificationType: varchar('notification_type', { length: 50 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  message: text('message').notNull(),
  relatedSessionId: uuid('related_session_id'),
  relatedRequestId: uuid('related_request_id'),
  isRead: boolean('is_read').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  readAt: timestamp('read_at', { withTimezone: true }),
});

// Blog and Community tables
export const tags = pgTable('tags', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 50 }).unique().notNull(),
  slug: varchar('slug', { length: 50 }).unique().notNull(),
  description: text('description'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const articles = pgTable('articles', {
  id: uuid('id').defaultRandom().primaryKey(),
  authorId: uuid('author_id').notNull(),
  categoryId: uuid('category_id'),
  title: text('title').notNull(),
  content: text('content').notNull(),
  slug: text('slug').unique(),
  status: varchar('status', { length: 20 }).default('draft'),
  seoTitle: varchar('seo_title', { length: 100 }),
  seoDescription: varchar('seo_description', { length: 160 }),
  seoKeywords: text('seo_keywords').array(),
  featuredImage: varchar('featured_image', { length: 500 }),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  views: integer('views').default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const articleTags = pgTable('article_tags', {
  id: uuid('id').defaultRandom().primaryKey(),
  articleId: uuid('article_id').notNull(),
  tagId: uuid('tag_id').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  uniqueArticleTag: unique().on(table.articleId, table.tagId),
}));

export const reactions = pgTable('reactions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull(),
  contentType: varchar('content_type', { length: 20 }).notNull(),
  contentId: uuid('content_id').notNull(),
  reactionType: varchar('reaction_type', { length: 20 }).default('like'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  uniqueReaction: unique().on(table.userId, table.contentType, table.contentId),
}));

export const bookmarks = pgTable('bookmarks', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull(),
  contentType: varchar('content_type', { length: 20 }).notNull(),
  contentId: uuid('content_id').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  uniqueBookmark: unique().on(table.userId, table.contentType, table.contentId),
}));

export const userFollows = pgTable('user_follows', {
  id: uuid('id').defaultRandom().primaryKey(),
  followerId: uuid('follower_id').notNull(),
  followingId: uuid('following_id').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  uniqueFollow: unique().on(table.followerId, table.followingId),
}));

export const forumCategories = pgTable('forum_categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).unique().notNull(),
  description: text('description'),
  icon: varchar('icon', { length: 50 }),
  parentId: uuid('parent_id'),
  displayOrder: integer('display_order').default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const forumThreads = pgTable('forum_threads', {
  id: uuid('id').defaultRandom().primaryKey(),
  categoryId: uuid('category_id').notNull(),
  authorId: uuid('author_id').notNull(),
  title: varchar('title', { length: 200 }).notNull(),
  content: text('content').notNull(),
  status: varchar('status', { length: 20 }).default('open'),
  isPinned: boolean('is_pinned').default(false),
  views: integer('views').default(0),
  lastActivityAt: timestamp('last_activity_at', { withTimezone: true }).defaultNow(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const forumPosts = pgTable('forum_posts', {
  id: uuid('id').defaultRandom().primaryKey(),
  threadId: uuid('thread_id').notNull(),
  authorId: uuid('author_id').notNull(),
  parentId: uuid('parent_id'),
  content: text('content').notNull(),
  isSolution: boolean('is_solution').default(false),
  editedAt: timestamp('edited_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const questions = pgTable('questions', {
  id: uuid('id').defaultRandom().primaryKey(),
  authorId: uuid('author_id').notNull(),
  title: varchar('title', { length: 200 }).notNull(),
  content: text('content').notNull(),
  category: varchar('category', { length: 50 }),
  tags: text('tags').array(),
  status: varchar('status', { length: 20 }).default('open'),
  views: integer('views').default(0),
  hasAcceptedAnswer: boolean('has_accepted_answer').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const answers = pgTable('answers', {
  id: uuid('id').defaultRandom().primaryKey(),
  questionId: uuid('question_id').notNull(),
  authorId: uuid('author_id').notNull(),
  content: text('content').notNull(),
  isAccepted: boolean('is_accepted').default(false),
  editedAt: timestamp('edited_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const userReputation = pgTable('user_reputation', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().unique(),
  points: integer('points').default(0),
  level: integer('level').default(1),
  articlesCount: integer('articles_count').default(0),
  commentsCount: integer('comments_count').default(0),
  questionsCount: integer('questions_count').default(0),
  answersCount: integer('answers_count').default(0),
  acceptedAnswersCount: integer('accepted_answers_count').default(0),
  helpfulVotesReceived: integer('helpful_votes_received').default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const reputationEvents = pgTable('reputation_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull(),
  eventType: varchar('event_type', { length: 50 }).notNull(),
  pointsChange: integer('points_change').notNull(),
  description: text('description'),
  relatedContentType: varchar('related_content_type', { length: 20 }),
  relatedContentId: uuid('related_content_id'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const notifications = pgTable('notifications', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull(),
  type: varchar('type', { length: 50 }).notNull(),
  title: varchar('title', { length: 200 }).notNull(),
  message: text('message'),
  relatedContentType: varchar('related_content_type', { length: 20 }),
  relatedContentId: uuid('related_content_id'),
  isRead: boolean('is_read').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const surveyResponses = pgTable('survey_responses', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().unique(),
  leagueRating: integer('league_rating'),
  tournamentRating: integer('tournament_rating'),
  tournamentsYearly: text('tournaments_yearly'),
  leagueFrequency: text('league_frequency'),
  purposeOfPlay: text('purpose_of_play'),
  practiceTime: text('practice_time'),
  coachingFrequency: text('coaching_frequency'),
  favoriteClubs: text('favorite_clubs'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const comments = pgTable('comments', {
  id: uuid('id').defaultRandom().primaryKey(),
  articleId: uuid('article_id').notNull(),
  authorId: uuid('author_id').notNull(),
  parentId: uuid('parent_id'),
  content: text('content').notNull(),
  editedAt: timestamp('edited_at', { withTimezone: true }),
  isPinned: boolean('is_pinned').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const categories = pgTable('categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').unique().notNull(),
  description: text('description'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// Testimonials and Feedback tables
export const testimonials = pgTable('testimonials', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull(),
  coachId: uuid('coach_id'),
  content: text('content').notNull(),
  rating: integer('rating'),
  videoId: uuid('video_id'),
  isFeatured: boolean('is_featured').default(false),
  isApproved: boolean('is_approved').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  ratingCheck: check('rating_check', sql`rating >= 1 AND rating <= 5`),
}));

// User Matching tables
export const userMatches = pgTable('user_matches', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull(),
  matchedUserId: uuid('matched_user_id').notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  radiusKm: integer('radius_km').notNull(),
  matchScore: integer('match_score'),
  status: text('status').default('active').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  uniqueUserMatch: unique().on(table.userId, table.matchedUserId),
}));

export const userMatchPreferences = pgTable('user_match_preferences', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().unique(),
  radiusKm: integer('radius_km').default(50),
  skillLevel: text('skill_level').array(),
  playStyle: text('play_style').array(),
  availabilityDays: text('availability_days').array(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// Booking and Scheduling tables
export const bookings = pgTable('bookings', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull(),
  coachId: uuid('coach_id').notNull(),
  bookingDate: timestamp('booking_date', { withTimezone: true }).notNull(),
  durationMinutes: integer('duration_minutes').default(60),
  status: text('status').default('pending').notNull(),
  bookingType: text('booking_type').default('lesson').notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const coachAvailability = pgTable('coach_availability', {
  id: uuid('id').defaultRandom().primaryKey(),
  coachId: uuid('coach_id').notNull(),
  dayOfWeek: integer('day_of_week').notNull(),
  startTime: text('start_time').notNull(),
  endTime: text('end_time').notNull(),
  isAvailable: boolean('is_available').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  dayOfWeekCheck: check('day_of_week_check', sql`day_of_week >= 0 AND day_of_week <= 6`),
}));

// Coach Videos table
export const coachVideos = pgTable('coach_videos', {
  id: uuid('id').defaultRandom().primaryKey(),
  coachId: uuid('coach_id').notNull(),
  videoUrl: text('video_url').notNull(),
  filePath: text('file_path').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  videoType: text('video_type').default('demo').notNull(),
  durationSeconds: integer('duration_seconds'),
  isFeatured: boolean('is_featured').default(false),
  viewCount: integer('view_count').default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// Live Streaming tables
export const liveSessions = pgTable('live_sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  coachId: uuid('coach_id').notNull(),
  studentId: uuid('student_id').notNull(),
  sessionType: text('session_type').default('live_coaching').notNull(),
  roomId: text('room_id').notNull().unique(),
  streamKey: text('stream_key'),
  playbackUrl: text('playback_url'),
  status: text('status').default('scheduled').notNull(),
  scheduledStart: timestamp('scheduled_start', { withTimezone: true }).notNull(),
  actualStart: timestamp('actual_start', { withTimezone: true }),
  actualEnd: timestamp('actual_end', { withTimezone: true }),
  durationMinutes: integer('duration_minutes'),
  recordingUrl: text('recording_url'),
  sessionNotes: text('session_notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const liveSessionParticipants = pgTable('live_session_participants', {
  id: uuid('id').defaultRandom().primaryKey(),
  sessionId: uuid('session_id').notNull(),
  userId: uuid('user_id').notNull(),
  role: text('role').default('viewer').notNull(),
  joinedAt: timestamp('joined_at', { withTimezone: true }),
  leftAt: timestamp('left_at', { withTimezone: true }),
  totalWatchTimeSeconds: integer('total_watch_time_seconds').default(0),
});

// Connection Requests and Connections tables
export const connectionRequests = pgTable('connection_requests', {
  id: uuid('id').defaultRandom().primaryKey(),
  senderId: uuid('sender_id').notNull(),
  receiverId: uuid('receiver_id').notNull(),
  message: text('message'),
  status: varchar('status', { length: 20 }).default('pending').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  uniqueConnectionRequest: unique().on(table.senderId, table.receiverId),
}));

export const connections = pgTable('connections', {
  id: uuid('id').defaultRandom().primaryKey(),
  user1Id: uuid('user1_id').notNull(),
  user2Id: uuid('user2_id').notNull(),
  status: varchar('status', { length: 20 }).default('active').notNull(),
  connectionDate: timestamp('connection_date', { withTimezone: true }).defaultNow().notNull(),
  lastMessageAt: timestamp('last_message_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  uniqueConnection: unique().on(table.user1Id, table.user2Id),
}));

// Featured Coaches table
export const featuredCoaches = pgTable('featured_coaches', {
  id: uuid('id').defaultRandom().primaryKey(),
  coachId: uuid('coach_id').notNull(),
  displayOrder: integer('display_order').default(0).notNull(),
  featuredSince: timestamp('featured_since', { withTimezone: true }).defaultNow().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  uniqueCoachFeature: unique().on(table.coachId),
}));
