"use client";

import { useState, useMemo } from "react";
import { ChevronDown, CheckCircle, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

/*
  Supabase table required — run this SQL in your Supabase dashboard:

  CREATE TABLE location_survey_responses (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_name text NOT NULL,
    agent_role text,
    responses jsonb NOT NULL DEFAULT '{}',
    missing_locations text,
    notes text,
    created_at timestamptz DEFAULT now(),
    country_code text DEFAULT 'GY'
  );

  -- RLS: allow anonymous inserts, restrict reads to authenticated
  ALTER TABLE location_survey_responses ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "Anyone can insert" ON location_survey_responses FOR INSERT WITH CHECK (true);
  CREATE POLICY "Auth users can read" ON location_survey_responses FOR SELECT USING (auth.role() = 'authenticated');
*/

/* ================================================================
   LOCATION DATA
   ================================================================ */

const SECTIONS: { name: string; locations: string[] }[] = [
  {
    name: "Georgetown",
    locations: [
      "Kitty", "Campbellville", "Queenstown", "Bel Air Park", "Bel Air Gardens",
      "Lamaha Gardens", "Prashad Nagar", "Subryanville", "South Ruimveldt", "Sophia",
      "Kingston", "Alberttown", "Lodge", "Houston", "Ruimveldt",
      "Meadow Brook Gardens", "Agricola",
    ],
  },
  {
    name: "East Bank Demerara",
    locations: [
      "Providence", "Diamond", "Grove", "Eccles", "Farm", "Peter's Hall",
      "Herstelling", "Land of Canaan", "Mocha", "Craig", "Supply",
      "Covent Gardens", "Timehri", "Windsor Estates", "Republic Gardens",
      "Nandy Park", "Richmondville", "Atlantic Gardens",
    ],
  },
  {
    name: "East Coast Demerara",
    locations: [
      "Ogle", "Plaisance", "Beterverwagting (BV)", "Lusignan", "Mon Repos",
      "Turkeyen", "Industry", "Enmore", "Mahaica", "Shamrock Gardens",
      "Bladen Hall", "Victoria", "Buxton", "Annandale", "Sparendaam",
    ],
  },
  {
    name: "West Bank Demerara",
    locations: [
      "Vreed-en-Hoop", "La Grange", "Schoon Ord", "La Parfaite Harmonie",
      "Wales", "Sisters Village", "Good Intent", "Patentia",
    ],
  },
  {
    name: "West Coast Demerara",
    locations: [
      "Parika", "Tuschen", "Uitvlugt", "Leonora", "Den Amstel",
      "Windsor Forest", "Zeelugt",
    ],
  },
  {
    name: "Berbice and Other",
    locations: [
      "New Amsterdam", "Rose Hall", "Corriverton", "Skeldon",
      "Fort Wellington", "Linden", "Bartica", "Anna Regina", "Lethem", "Soesdyke",
    ],
  },
];

type Rating = "hot" | "active" | "none";

/* ================================================================
   COMPONENT
   ================================================================ */

export default function LocationSurveyPage() {
  const [agentName, setAgentName] = useState("");
  const [agentRole, setAgentRole] = useState("Agent");
  const [responses, setResponses] = useState<Record<string, Record<string, Rating>>>({});
  const [missingLocations, setMissingLocations] = useState("");
  const [notes, setNotes] = useState("");
  const [expandedSection, setExpandedSection] = useState<string>(SECTIONS[0].name);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const supabase = createClient();

  /* ---- Rating handler ---- */

  const setRating = (section: string, location: string, rating: Rating) => {
    setResponses((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [location]: rating,
      },
    }));
  };

  /* ---- Progress ---- */

  const { completedSections, totalAnswered } = useMemo(() => {
    let completed = 0;
    let answered = 0;
    for (const section of SECTIONS) {
      const sectionResponses = responses[section.name];
      if (!sectionResponses) continue;
      const count = Object.keys(sectionResponses).length;
      answered += count;
      if (count > 0) completed++;
    }
    return { completedSections: completed, totalAnswered: answered };
  }, [responses]);

  const totalLocations = SECTIONS.reduce((sum, s) => sum + s.locations.length, 0);

  /* ---- Submit ---- */

  const handleSubmit = async () => {
    if (!agentName.trim()) return;
    setSubmitting(true);
    setError("");

    try {
      const { error: insertError } = await supabase
        .from("location_survey_responses")
        .insert({
          agent_name: agentName.trim(),
          agent_role: agentRole,
          responses,
          missing_locations: missingLocations.trim() || null,
          notes: notes.trim() || null,
          country_code: "GY",
        });

      if (insertError) throw insertError;
      setSubmitted(true);
    } catch (err: any) {
      console.error("Survey submission error:", err);
      setError("Could not submit. Check your internet and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  /* ---- Success screen ---- */

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank you!</h2>
          <p className="text-gray-600">
            Your responses have been saved. You can close this page.
          </p>
        </div>
      </div>
    );
  }

  /* ---- Main render ---- */

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-4">
        <div className="max-w-lg mx-auto">
          <span className="text-lg font-bold text-green-600">Guyana Home Hub</span>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Intro */}
        <div>
          <h1 className="text-xl font-bold text-gray-900 mb-1">Help Us Build Location Search</h1>
          <p className="text-sm text-gray-500">
            Tap <strong>HOT</strong>, <strong>ACTIVE</strong>, or <strong>NONE</strong> for each area.
            Takes 3 minutes. Your input helps buyers find properties in the right neighborhoods.
          </p>
        </div>

        {/* Agent Info */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
            <input
              type="text"
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              placeholder="e.g. John Smith"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-base focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Role</label>
            <select
              value={agentRole}
              onChange={(e) => setAgentRole(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
            >
              <option value="Agent">Agent</option>
              <option value="Managing Partner">Managing Partner</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
        </div>

        {/* Progress */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-600">{totalAnswered} of {totalLocations} locations rated</span>
            <span className="text-gray-400">{completedSections} of {SECTIONS.length} sections</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.round((totalAnswered / totalLocations) * 100)}%` }}
            />
          </div>
        </div>

        {/* Location Sections */}
        {SECTIONS.map((section) => {
          const isExpanded = expandedSection === section.name;
          const sectionResponses = responses[section.name] || {};
          const answeredCount = Object.keys(sectionResponses).length;

          return (
            <div key={section.name} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {/* Section Header */}
              <button
                onClick={() => setExpandedSection(isExpanded ? "" : section.name)}
                className="w-full flex items-center justify-between px-4 py-3.5 text-left"
              >
                <div>
                  <span className="font-semibold text-gray-900">{section.name}</span>
                  <span className="text-xs text-gray-400 ml-2">
                    {answeredCount}/{section.locations.length}
                  </span>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Location List */}
              {isExpanded && (
                <div className="border-t border-gray-100 px-4 py-3 space-y-3">
                  {section.locations.map((location) => {
                    const current = sectionResponses[location];
                    return (
                      <div key={location} className="flex items-center justify-between gap-3">
                        <span className="text-sm font-medium text-gray-800 min-w-0 flex-shrink">{location}</span>
                        <div className="flex gap-1.5 flex-shrink-0">
                          <button
                            onClick={() => setRating(section.name, location, "hot")}
                            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all min-h-[44px] ${
                              current === "hot"
                                ? "bg-green-600 text-white shadow-sm"
                                : "bg-gray-100 text-gray-500 hover:bg-green-50"
                            }`}
                          >
                            HOT
                          </button>
                          <button
                            onClick={() => setRating(section.name, location, "active")}
                            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all min-h-[44px] ${
                              current === "active"
                                ? "bg-amber-500 text-white shadow-sm"
                                : "bg-gray-100 text-gray-500 hover:bg-amber-50"
                            }`}
                          >
                            ACTIVE
                          </button>
                          <button
                            onClick={() => setRating(section.name, location, "none")}
                            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all min-h-[44px] ${
                              current === "none"
                                ? "bg-gray-600 text-white shadow-sm"
                                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                            }`}
                          >
                            NONE
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* Missing Locations */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1">What did we miss?</label>
            <textarea
              value={missingLocations}
              onChange={(e) => setMissingLocations(e.target.value)}
              placeholder="Type any neighborhoods, subdivisions, or gated communities we missed. Separate with commas."
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-base resize-none focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1">Any other notes? <span className="font-normal text-gray-400">(optional)</span></label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="General comments or suggestions..."
              rows={2}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-base resize-none focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!agentName.trim() || submitting}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl text-base transition-colors flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit My Responses"
          )}
        </button>

        {/* Bottom spacing for mobile */}
        <div className="h-8" />
      </div>
    </div>
  );
}
