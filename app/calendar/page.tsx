/**
 * Main Calendar Page - Refactored
 *
 * This is the orchestration layer that coordinates all calendar components.
 * Business logic has been extracted to custom hooks, and UI has been
 * broken down into smaller, focused components.
 *
 * Original: 1960 lines | Refactored: ~200 lines
 */

'use client';

import { useState, useEffect } from 'react';
import { HomeScreen } from './components/HomeScreen';
import { UpgradeModal } from './components/UpgradeModal';
import { DatePickerModal } from './components/DatePickerModal';
import { AddIndicatorModal } from './components/AddIndicatorModal';
import { EditIndicatorModal } from './components/EditIndicatorModal';
import { IndicatorInfoModal } from './components/IndicatorInfoModal';
import { EventFormModal } from './components/EventFormModal';
import { EventSummaryModal } from './components/EventSummaryModal';
import { CalendarGrid } from './components/CalendarGrid';
import { WeekNavigation } from './components/WeekNavigation';
import { useEvents } from './hooks/useEvents';
import { useIndicators } from './hooks/useIndicators';
import { useDragDrop } from './hooks/useDragDrop';
import { STRIPE_PRICE_IDS } from './lib/constants';
import { formatHeaderDate } from './lib/time-utils';
import { Event, Indicator } from './lib/types';
import { isDemoMode, disableDemoMode } from './lib/demo-data';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function CalendarPage() {
  const router = useRouter();
  const supabase = createClient();

  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  // Demo mode
  const [inDemoMode, setInDemoMode] = useState(false);

  // Check demo mode on mount
  useEffect(() => {
    setInDemoMode(isDemoMode());
  }, []);

  // Tab navigation
  const [activeTab, setActiveTab] = useState('home');

  // Date selection - defaults to today
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Modal visibility
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showAddIndicatorModal, setShowAddIndicatorModal] = useState(false);
  const [showEditIndicatorModal, setShowEditIndicatorModal] = useState(false);
  const [showIndicatorInfoModal, setShowIndicatorInfoModal] = useState(false);
  const [showEventFormModal, setShowEventFormModal] = useState(false);
  const [showEventSummaryModal, setShowEventSummaryModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Indicator editing
  const [isEditingIndicators, setIsEditingIndicators] = useState(false);
  const [selectedIndicator, setSelectedIndicator] = useState<Indicator | null>(null);

  // Selected event for viewing/editing
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [eventFormInitialHour, setEventFormInitialHour] = useState(9);

  // Stripe checkout
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);

  // ============================================================================
  // CUSTOM HOOKS
  // ============================================================================

  const { events, createEvent, updateEvent, deleteEvent, updateEventTime, setEvents } = useEvents();
  const { indicators, createIndicator, updateIndicator, deleteIndicator } = useIndicators(events);
  const dragDrop = useDragDrop(selectedDate, setSelectedDate, updateEventTime);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  /**
   * Handle Stripe checkout for subscription upgrade
   */
  const handleUpgrade = async (tier: 'basic' | 'premium') => {
    setIsProcessingCheckout(true);
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: STRIPE_PRICE_IDS[tier],
          tier: tier,
        }),
      });

      const { url, error } = await response.json();

      if (error) {
        alert('Failed to create checkout session. Please try again.');
        return;
      }

      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setIsProcessingCheckout(false);
    }
  };

  /**
   * Handle indicator click for viewing info (normal mode)
   */
  const handleIndicatorInfoClick = (indicator: Indicator) => {
    setSelectedIndicator(indicator);
    setShowIndicatorInfoModal(true);
  };

  /**
   * Handle indicator click for editing (edit mode)
   */
  const handleIndicatorEditClick = (indicator: Indicator) => {
    setSelectedIndicator(indicator);
    setShowEditIndicatorModal(true);
  };

  /**
   * Handle indicator update
   */
  const handleUpdateIndicator = async (updates: any) => {
    if (!selectedIndicator) return false;
    const success = await updateIndicator(selectedIndicator.id, updates);
    if (success) {
      setShowEditIndicatorModal(false);
      setSelectedIndicator(null);
    }
    return success;
  };

  /**
   * Handle indicator deletion with API call
   */
  const handleDeleteIndicator = async (id: string) => {
    await deleteIndicator(id);
    setShowEditIndicatorModal(false);
    setSelectedIndicator(null);
  };

  /**
   * Handle adding new indicator
   */
  const handleAddIndicator = async (
    eventType: string,
    measurementType: 'time' | 'frequency',
    goalValue: number
  ) => {
    await createIndicator(eventType, measurementType, goalValue);
  };

  /**
   * Handle calendar slot click (create new event)
   */
  const handleSlotClick = (hourIndex: number) => {
    setEventFormInitialHour(hourIndex);
    setSelectedEvent(null); // Clear selected event for creating new
    setShowEventFormModal(true);
  };

  /**
   * Handle event click (view event details)
   */
  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setShowEventSummaryModal(true);
  };

  /**
   * Handle edit event from summary modal
   */
  const handleEditEvent = () => {
    setShowEventSummaryModal(false);
    setShowEventFormModal(true);
  };

  /**
   * Handle save event (create or update)
   */
  const handleSaveEvent = async (eventData: Partial<Event>) => {
    if (selectedEvent) {
      // Update existing event
      const success = await updateEvent(selectedEvent.id, eventData);
      if (success) {
        setSelectedEvent(null);
      }
      return success;
    } else {
      // Create new event
      const success = await createEvent(eventData);
      return success;
    }
  };

  /**
   * Handle delete event
   */
  const handleDeleteEvent = async () => {
    if (selectedEvent) {
      await deleteEvent(selectedEvent.id);
      setSelectedEvent(null);
    }
  };

  /**
   * Exit demo mode and return to login
   */
  const handleExitDemo = () => {
    disableDemoMode();
    document.cookie = 'demoMode=; path=/; max-age=0'; // Clear cookie
    router.push('/login');
  };

  /**
   * Handle user logout
   */
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
      alert('Failed to sign out. Please try again.');
    } else {
      // Clear any demo mode settings
      disableDemoMode();
      document.cookie = 'demoMode=; path=/; max-age=0';
      router.push('/login');
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      {/* Demo Mode Banner */}
      {inDemoMode && (
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium">Demo Mode - Exploring with sample data</span>
          </div>
          <button
            onClick={handleExitDemo}
            className="text-sm font-medium hover:underline flex items-center gap-1"
          >
            Exit & Sign In
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      )}

      {/* ===== CALENDAR HEADER (Only shown on calendar tab) ===== */}
      {activeTab === 'calendar' && (
        <header className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
          <div className="w-10"></div>

          <button
            onClick={() => setShowDatePicker(true)}
            className="flex items-center gap-2 hover:bg-gray-800 px-3 py-2 rounded transition-colors"
          >
            <span className="text-lg font-normal">
              {formatHeaderDate(selectedDate)}
            </span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>

          <div className="flex items-center gap-2">
            {!inDemoMode && (
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-gray-800 rounded transition-colors"
                title="Logout"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            )}
          </div>
        </header>
      )}

      {/* ===== MAIN CONTENT AREA ===== */}
      {activeTab === 'home' && (
        <HomeScreen
          indicators={indicators}
          isEditing={isEditingIndicators}
          onToggleEdit={() => setIsEditingIndicators(!isEditingIndicators)}
          onDeleteIndicator={handleDeleteIndicator}
          onAddIndicator={() => setShowAddIndicatorModal(true)}
          onIndicatorInfoClick={handleIndicatorInfoClick}
          onIndicatorEditClick={handleIndicatorEditClick}
          onLogout={handleLogout}
          inDemoMode={inDemoMode}
        />
      )}

      {activeTab === 'calendar' && (
        <>
          <WeekNavigation
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
          <CalendarGrid
            selectedDate={selectedDate}
            events={events}
            isDragging={dragDrop.isDragging}
            draggedEvent={dragDrop.draggedEvent}
            dragStartY={dragDrop.dragStartY}
            dragCurrentY={dragDrop.dragCurrentY}
            onEventClick={handleEventClick}
            onSlotClick={handleSlotClick}
            onEventDragStart={dragDrop.handleDragStart}
            onEventDragMove={dragDrop.handleDragMove}
            onEventDragEnd={dragDrop.handleDragEnd}
          />
        </>
      )}

      {/* ===== BOTTOM NAVIGATION ===== */}
      <nav className="flex items-center justify-around border-t border-gray-800 pb-safe bg-black">
        <button
          onClick={() => setActiveTab('home')}
          className="flex flex-col items-center py-2 px-8 transition-colors relative"
        >
          <div className={`rounded-full px-6 py-2 ${activeTab === 'home' ? 'bg-pink-600' : ''}`}>
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('calendar')}
          className="flex flex-col items-center py-2 px-8 transition-colors relative"
        >
          <div className={`rounded-full px-6 py-2 ${activeTab === 'calendar' ? 'bg-pink-600' : ''}`}>
            <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm-8 4H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z" />
            </svg>
          </div>
        </button>

        {/* Placeholder buttons for future features */}
        {[...Array(3)].map((_, i) => (
          <button
            key={i}
            onClick={() => setShowUpgradeModal(true)}
            className="flex flex-col items-center py-3 px-6 transition-colors"
          >
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        ))}
      </nav>

      {/* ===== MODALS ===== */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        isProcessing={isProcessingCheckout}
        onUpgrade={handleUpgrade}
      />

      <AddIndicatorModal
        isOpen={showAddIndicatorModal}
        onClose={() => setShowAddIndicatorModal(false)}
        onAddIndicator={handleAddIndicator}
      />

      {selectedIndicator && (
        <>
          <EditIndicatorModal
            indicator={selectedIndicator}
            isOpen={showEditIndicatorModal}
            onClose={() => {
              setShowEditIndicatorModal(false);
              setSelectedIndicator(null);
            }}
            onSave={handleUpdateIndicator}
            onDelete={() => handleDeleteIndicator(selectedIndicator.id)}
          />

          <IndicatorInfoModal
            indicator={selectedIndicator}
            events={events}
            isOpen={showIndicatorInfoModal}
            onClose={() => {
              setShowIndicatorInfoModal(false);
              setSelectedIndicator(null);
            }}
          />
        </>
      )}

      <DatePickerModal
        isOpen={showDatePicker}
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
        onClose={() => setShowDatePicker(false)}
      />

      <EventFormModal
        isOpen={showEventFormModal}
        selectedDate={selectedDate}
        initialHour={eventFormInitialHour}
        editEvent={selectedEvent}
        onSave={handleSaveEvent}
        onClose={() => {
          setShowEventFormModal(false);
          setSelectedEvent(null);
        }}
      />

      {selectedEvent && (
        <EventSummaryModal
          event={selectedEvent}
          isOpen={showEventSummaryModal}
          onClose={() => {
            setShowEventSummaryModal(false);
            setSelectedEvent(null);
          }}
          onEdit={handleEditEvent}
          onDelete={handleDeleteEvent}
        />
      )}
    </div>
  );
}
