"use client";

import { useState, useEffect, useRef } from "react";
import AuthGuard from "@/src/components/AuthGuard";
import { ChevronDown, ChevronUp } from "lucide-react";
import "./timetable.css";

interface Subject {
  id: string;
  name: string;
  preference: string;
  importance: string;
  minHours: number;
}

interface Option {
  value: string;
  label: string;
}

const PREFERENCE_OPTIONS: Option[] = [
  { value: "love", label: "❤️ Love it" },
  { value: "like", label: "👍 Like it" },
  { value: "neutral", label: "😐 Neutral" },
  { value: "dislike", label: "👎 Dislike it" },
  { value: "hate", label: "😡 Hate it" },
];

const IMPORTANCE_OPTIONS: Option[] = [
  { value: "critical", label: "🔥 Critical" },
  { value: "high", label: "⚡ High" },
  { value: "medium", label: "🔹 Medium" },
  { value: "low", label: "💤 Low" },
];

const CustomSelect = ({
  options,
  value,
  onChange,
  isOpen,
  onToggle,
}: {
  options: Option[];
  value: string;
  onChange: (val: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        onToggle(); // Close if clicked outside
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onToggle]);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="custom-select-container" ref={containerRef}>
      <div
        className={`custom-select-trigger ${isOpen ? "is-open" : ""}`}
        onClick={onToggle}
      >
        <span>{selectedOption ? selectedOption.label : "Select..."}</span>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </div>
      {isOpen && (
        <div className="custom-select-options">
          {options.map((opt) => (
            <div
              key={opt.value}
              className={`custom-option ${
                opt.value === value ? "selected" : ""
              }`}
              onClick={() => {
                onChange(opt.value);
                onToggle();
              }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function TimetablePage() {
  const [totalHours, setTotalHours] = useState<number>(0);
  const [subjectCount, setSubjectCount] = useState<number>(0);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  
  // Track which specific dropdown is active: "subjectId-type"
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const count = Math.max(0, subjectCount);
    if (count !== subjects.length) {
      if (count > subjects.length) {
        const newSubjects = [...subjects];
        for (let i = subjects.length; i < count; i++) {
          newSubjects.push({
            id: crypto.randomUUID(),
            name: "",
            preference: "neutral",
            importance: "medium",
            minHours: 1,
          });
        }
        setSubjects(newSubjects);
      } else {
        setSubjects(subjects.slice(0, count));
      }
    }
  }, [subjectCount]);

  const updateSubject = (id: string, field: keyof Subject, value: any) => {
    setSubjects((prev) =>
      prev.map((sub) => (sub.id === id ? { ...sub, [field]: value } : sub))
    );
  };

  const handleGenerate = () => {
    console.log({ totalHours, subjects });
  };

  const handleToggleDropdown = (id: string) => {
    setActiveDropdown((prev) => (prev === id ? null : id));
  };

  return (
    <AuthGuard>
      <div className="timetable-container">
        <header className="timetable-header">
          <h1>
            Study<span>Plan</span>
          </h1>
          <p>Configure your weekly learning schedule.</p>
        </header>

        <div className="config-section">
          <div className="input-group">
            <label>Weekly Available Hours</label>
            <input
              type="number"
              className="main-input"
              placeholder="e.g. 40"
              value={totalHours || ""}
              onChange={(e) => setTotalHours(parseInt(e.target.value) || 0)}
            />
          </div>

          <div className="input-group">
            <label>Number of Subjects</label>
            <input
              type="number"
              className="main-input"
              placeholder="e.g. 6"
              value={subjectCount || ""}
              onChange={(e) => setSubjectCount(parseInt(e.target.value) || 0)}
            />
          </div>
        </div>

        <div className="subjects-section">
          <div className="section-title">
            <span>Subject Details</span>
            {subjects.length > 0 && (
              <span className="subject-count-badge">
                {subjects.length} Subjects
              </span>
            )}
          </div>

          {subjects.length === 0 ? (
            <div className="empty-state">
              <p>Enter the number of subjects above to begin.</p>
            </div>
          ) : (
            <div className="subjects-grid">
              {subjects.map((subject, index) => {
                // Check if any dropdown in this specific card is active
                const isCardActive = 
                  activeDropdown === `${subject.id}-preference` || 
                  activeDropdown === `${subject.id}-importance`;

                return (
                  <div
                    key={subject.id}
                    className={`subject-card ${isCardActive ? "is-active" : ""}`}
                    style={{ animationDelay: `${index * 60}ms` }}
                  >
                    <div className="field-wrapper">
                      <label>Subject Name</label>
                      <input
                        type="text"
                        className="sub-input"
                        placeholder={`Subject ${index + 1}`}
                        value={subject.name}
                        onChange={(e) =>
                          updateSubject(subject.id, "name", e.target.value)
                        }
                      />
                    </div>

                    <div className="field-wrapper">
                      <label>Preference</label>
                      <CustomSelect
                        options={PREFERENCE_OPTIONS}
                        value={subject.preference}
                        isOpen={activeDropdown === `${subject.id}-preference`}
                        onToggle={() => handleToggleDropdown(`${subject.id}-preference`)}
                        onChange={(val) =>
                          updateSubject(subject.id, "preference", val)
                        }
                      />
                    </div>

                    <div className="field-wrapper">
                      <label>Importance</label>
                      <CustomSelect
                        options={IMPORTANCE_OPTIONS}
                        value={subject.importance}
                        isOpen={activeDropdown === `${subject.id}-importance`}
                        onToggle={() => handleToggleDropdown(`${subject.id}-importance`)}
                        onChange={(val) =>
                          updateSubject(subject.id, "importance", val)
                        }
                      />
                    </div>

                    <div className="field-wrapper">
                      <label>Min Hours</label>
                      <input
                        type="number"
                        className="sub-input"
                        min={1}
                        value={subject.minHours}
                        onChange={(e) =>
                          updateSubject(
                            subject.id,
                            "minHours",
                            parseInt(e.target.value) || 0
                          )
                        }
                      />
                    </div>
                  </div>
                );
              })}
              <button className="generate-btn" onClick={handleGenerate}>
                Generate Timetable
              </button>
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}