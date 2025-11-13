# Focus Lock-In Session App - Product Requirements Document

## Executive Summary
A real-time collaborative focus session app where users join lock-in sessions with 40-minute work cycles and 5-minute breaks. Built with Convex, TanStack, and Better Auth for the 2025 hackathon.

## Core Concepts
- **Rooms**: Permanent shareable spaces that always exist
- **Sessions**: Personal to each user, can migrate between rooms
- **Cycles**: Configurable work periods + break periods (default: 40min work + 5min break)
- **Presence**: Real-time visibility of participants
- **Event-Sourced Timer**: Immutable event log for consistent timer state across clients

## MVP Features

### 1. Session Management
- [x] Create permanent shareable rooms
- [x] Join sessions at any time (including mid-cycle)
- [x] Personal sessions that persist across app closes
- [x] Session reconnection after accidental disconnects
- [x] Session continuation option on return
- [x] Configurable work/break durations per room

### 2. User Authentication
- [x] Anonymous access
- [x] Google OAuth
- [x] Magic Link
- [x] Microsoft OAuth
- [x] Anonymous to account conversion (Better Auth)

### 3. Question Flow
- [x] Pre-session questions (free text + multi-select)
- [x] Cycle start questions
- [x] Cycle end questions
- [x] Session exit questions
- [x] Standard question set (hackathon scope)

### 4. Real-Time Features
- [x] Event-sourced timer with optimistic locking for concurrent pause/resume
- [x] Shared countdown timer across room participants
- [x] Presence indicator (who's online)
- [x] Cycle count display per participant
- [x] Audio notifications for cycle transitions (Tone.js)
- [x] Client-side timer state computation (100ms updates)

### 5. User Experience
- [x] Single route `/rooms/[id]` with state machine
- [x] Mid-cycle join notifications
- [x] Session debrief form (optional)
- [x] Mobile responsive design
- [x] Optimistic updates with conflict resolution for timer controls

## Data Model

### Event-Sourced Timer Structure
```typescript
Timer {
  id: string
  config: {
    cycleDuration: number (ms)
    breakDuration: number (ms)
  }
  currentPhase: 'work' | 'break'
  initialDuration: number (ms for current phase)
  events: TimerEvent[]
  version: number (optimistic locking)
  createdAt: timestamp
}

TimerEvent = 
  | { type: 'started', timestamp: number }
  | { type: 'paused', timestamp: number }
  | { type: 'resumed', timestamp: number }
  | { type: 'skipped', timestamp: number }
```

### Core Tables (Effect Schema)
```typescript
Rooms {
  _id: RoomId
  createdAt: timestamp
  createdBy: UserId?
  timer: Timer
  participants: Presence[]
}

Sessions {
  _id: SessionId
  userId: UserId
  roomId: RoomId
  startedAt: timestamp
  status: 'active' | 'paused' | 'completed'
  cyclesCompleted: number
  currentCycleStart: timestamp
  lastActivityAt: timestamp
}

Cycles {
  _id: CycleId
  sessionId: SessionId
  type: 'work' | 'break'
  startedAt: timestamp
  endedAt: timestamp?
  duration: number? (actual duration in ms)
}

Responses {
  _id: ResponseId
  cycleId: CycleId
  questionId: string
  answer: string | string[]
  answeredAt: timestamp
}

Users {
  _id: UserId
  email: string?
  name: string?
  avatar: string?
  totalSessions: number
  totalFocusTime: number (ms)
  createdAt: timestamp
  lastActiveAt: timestamp
}
```

### Timer State Computation
```typescript
function computeTimerState(timer: Timer): {
  state: 'running' | 'paused' | 'completed'
  remaining: number
  elapsed: number
  currentPhase: 'work' | 'break'
} {
  // Pure function that computes current state from event log
  // Handles pause/resume, calculates elapsed time, determines remaining
  // All clients compute identical state from same events
}
```

## State Machine Architecture

### Session States
```
JOINING → QUESTIONS → ACTIVE_CYCLE → BREAK → QUESTIONS → ACTIVE_CYCLE
    ↓         ↓           ↓           ↓        ↓
  EXIT ← DEBRIEF ← COMPLETED ← QUESTIONS ← EXIT
```

### Route Structure
```
/rooms/[id] - Main session container
├── joining-form
├── questions
├── active-cycle (work/break)
├── debrief
└── session-completed
```

## Technical Implementation

### Frontend Stack
- TanStack Router for routing
- TanStack Store for state management
- Shadcn/UI components (Radix UI)
- Tailwind CSS
- Tone.js for audio

### Backend Stack
- Convex for real-time data
- Better Auth for authentication
- Convex Presence for participant tracking

### Key Technical Decisions

#### Event-Sourced Timer Architecture
- Immutable event log for all timer operations (start/pause/resume/skip)
- Client-side state computation every 100ms (no database reads)
- Optimistic locking with version numbers for concurrent operations
- Pure `computeTimerState()` function ensures consistency across clients

#### Database Operations Strategy
- **Minimal Writes**: Only append events on user actions
- **No Timer Reads**: State computed locally from event log
- **Conflict Resolution**: Version-based optimistic locking
- **Atomic Updates**: Single operation per timer action

#### Session Persistence
- Sessions never auto-close (MVP approach)
- Users choose to continue or close on return
- Optional debrief form for session completion
- All data preserved in Convex

#### Real-Time Updates
- Convex subscriptions for timer event updates
- Presence for participant status
- Reactive UI updates across all clients
- Local timer state computation (100ms intervals)

## Post-MVP Features (Future Scope)
- [ ] Custom question sets per session
- [ ] Video calls during breaks (Jitsi integration)
- [ ] Analytics and progress tracking
- [ ] Session themes and customization
- [ ] Team management features
- [ ] Email notifications for session reminders
- [ ] Advanced analytics dashboard

## Success Metrics
- Session completion rate
- Average session duration
- User retention (anonymous → authenticated)
- Concurrent participants per link

## Constraints & Assumptions
- Hackathon timeline: ~48 hours
- No participant limit per room
- Standard question set for MVP
- Mobile-first responsive design
- Event-sourced timer for consistency
- Effect Schema with Confect for type safety
- Optimistic locking for concurrent timer operations

## Open Questions
1. Question content specifics (to be provided)
2. Exact audio notification patterns
3. Session debrief question priority
4. Analytics depth for authenticated users
5. Default timer durations (40min work + 5min break confirmed?)
6. Timer event retention policy (keep all events or prune old ones?)
