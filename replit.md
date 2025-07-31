# CallAgent - AI Voice Assistant Application

## Overview

This is a fully functional real-time AI voice assistant application built with React, Express, and Google's Gemini AI. The application provides a seamless voice-to-voice conversation interface where users can speak to an AI assistant and receive intelligent spoken responses back. It features a modern, responsive UI with comprehensive voice controls, real-time WebSocket communication, and robust error handling.

**Status**: ✅ Completed and working (January 2025)

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

**January 30, 2025**:
- ✅ Fixed infinite loop issue that caused continuous AI responses
- ✅ Implemented duplicate message prevention
- ✅ Added minimum transcript length filtering to avoid noise processing
- ✅ Enhanced speech recognition state management
- ✅ Resolved browser compatibility issues with crypto module
- ✅ Fixed TypeScript errors for Web Speech API
- ✅ Application now working properly with stable voice conversations

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI Framework**: Radix UI components with shadcn/ui styling system
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: React hooks with local component state
- **Data Fetching**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for client-side routing
- **Build Tool**: Vite for development and production builds

The frontend follows a component-based architecture with custom hooks for browser APIs (Speech Recognition, Speech Synthesis, WebSockets). The application uses a single-page layout with a conversation panel and controls sidebar.

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Real-time Communication**: WebSocket server for live voice interactions
- **AI Integration**: Google Gemini API for natural language processing
- **Session Management**: In-memory storage with optional database persistence

The backend implements a RESTful API with WebSocket support for real-time features. It uses middleware for request logging and error handling.

## Key Components

### Voice Processing System
- **Speech Recognition**: Browser Web Speech API for voice input
- **Speech Synthesis**: Browser Speech Synthesis API for voice output
- **Audio Controls**: Configurable voice speed, volume, and speaker selection

### AI Integration
- **Service**: Google Gemini 2.5 Flash model
- **Features**: Conversational context maintenance, optimized for voice responses
- **Error Handling**: Connection testing and graceful failure recovery

### Real-time Communication
- **WebSocket Server**: Custom implementation for live voice data
- **Connection Management**: Auto-reconnection with exponential backoff
- **Message Types**: Support for different communication patterns

### Database Schema
- **Users**: ID, username, password authentication
- **Conversations**: User-linked conversation history with JSON message storage
- **Messages**: Structured format with roles, content, timestamps, and type metadata

## Data Flow

1. **Voice Input**: User speaks → Speech Recognition → Text transcription
2. **AI Processing**: Text → Gemini API → AI response generation
3. **Voice Output**: AI response → Speech Synthesis → Audio playback
4. **Persistence**: Conversations stored in database with message history
5. **Real-time Updates**: WebSocket communication for live session data

The application maintains conversation context across interactions and provides visual feedback for each stage of the voice processing pipeline.

## External Dependencies

### Core Runtime
- **Database**: PostgreSQL (configured for Neon serverless)
- **AI Service**: Google Gemini API with authentication
- **Browser APIs**: Web Speech API, Speech Synthesis API

### Development Tools
- **UI Components**: Radix UI primitives with shadcn/ui styling
- **Development**: Vite with hot module replacement
- **TypeScript**: Full type safety across frontend and backend
- **Styling**: Tailwind CSS with PostCSS processing

### Optional Integrations
- **Replit**: Development environment integration with live preview
- **Error Tracking**: Runtime error overlay for development

## Deployment Strategy

### Development Mode
- **Frontend**: Vite dev server with HMR and live reload
- **Backend**: tsx with watch mode for auto-restart
- **Database**: Drizzle Kit for schema management and migrations
- **Environment**: Local development with environment variables

### Production Build
- **Frontend**: Vite production build with asset optimization
- **Backend**: esbuild bundle for Node.js deployment
- **Static Assets**: Served from Express with appropriate caching headers
- **Database**: Migration-based schema deployment

### Environment Configuration
- **Database**: `DATABASE_URL` for PostgreSQL connection
- **AI Service**: `GEMINI_API_KEY` for Google AI authentication
- **Development**: Additional Replit-specific configuration for cloud IDE

The application is designed for easy deployment to various platforms with minimal configuration changes required.