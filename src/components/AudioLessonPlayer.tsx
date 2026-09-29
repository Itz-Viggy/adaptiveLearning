import { useEffect, useRef, useState } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  FileText,
} from "lucide-react";
import type { Topic } from "../services/mockData";
import { narration } from "../services/mockData";
import { useLearning } from "../store/useLearning";
const time = (n: number) =>
  `${Math.floor(n / 60)}:${String(Math.floor(n % 60)).padStart(2, "0")}`;
export function AudioLessonPlayer({ topic }: { topic: Topic }) {
  const audio = useRef<HTMLAudioElement>(null);
  const initialPosition = useRef(
    useLearning.getState().positions[topic.id] || 0,
  );
  const restored = useRef(false);
  const [current, setCurrent] = useState(initialPosition.current);
  const [duration, setDuration] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(false);
  const preferences = useLearning((s) => s.preferences);
  const [speed, setSpeed] = useState(preferences.speed);
  const [volume, setVolume] = useState(1);
  const [transcript, setTranscript] = useState(preferences.transcript);
  const position = useLearning((s) => s.position);
  const complete = useLearning((s) => s.complete);
  const completed = useLearning((s) => s.completed.includes(topic.id));
  function toggle() {
    const el = audio.current;
    if (!el) return;
    if (el.paused) void el.play().catch(() => setError(true));
    else el.pause();
  }
  function seek(value: number) {
    const el = audio.current;
    if (el && Number.isFinite(el.duration)) {
      el.currentTime = Math.max(0, Math.min(el.duration, value));
      setCurrent(el.currentTime);
      position(topic.id, el.currentTime);
    }
  }
  useEffect(() => {
    const el = audio.current;
    if (!el) return;
    const initialize = () => {
      if (!Number.isFinite(el.duration)) return;
      setDuration(el.duration);
      if (!restored.current) {
        el.currentTime = Math.min(initialPosition.current, el.duration);
        setCurrent(el.currentTime);
        restored.current = true;
      }
    };
    // A cached file may finish loading while a lazy route is still suspended.
    // Read existing metadata as well as listening for future metadata events.
    el.addEventListener("loadedmetadata", initialize);
    el.addEventListener("durationchange", initialize);
    if (el.readyState >= 1) initialize();
    return () => {
      el.removeEventListener("loadedmetadata", initialize);
      el.removeEventListener("durationchange", initialize);
    };
  }, [topic.id]);
  useEffect(() => {
    if (audio.current) audio.current.playbackRate = speed;
  }, [speed]);
  useEffect(() => {
    if (audio.current) audio.current.volume = volume;
  }, [volume]);
  useEffect(() => {
    const el = audio.current;
    return () => {
      if (el) {
        position(topic.id, el.currentTime);
        el.pause();
      }
    };
  }, [position, topic.id]);
  return (
    <>
      <section
        className="audio-player"
        aria-label="Topic audio lesson"
        onKeyDown={(e) => {
          if (
            (e.target as HTMLElement).tagName === "INPUT" ||
            (e.target as HTMLElement).tagName === "SELECT"
          )
            return;
          if (
            e.code === "Space" &&
            (e.target as HTMLElement).tagName !== "BUTTON"
          ) {
            e.preventDefault();
            toggle();
          }
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            seek(current - 15);
          }
          if (e.key === "ArrowRight") {
            e.preventDefault();
            seek(current + 15);
          }
        }}
        tabIndex={0}
      >
        <audio
          ref={audio}
          src={`/audio/${topic.id}.m4a`}
          preload="metadata"
          onTimeUpdate={() => {
            const el = audio.current!;
            setCurrent(el.currentTime);
            if (Math.floor(el.currentTime) % 3 === 0)
              position(topic.id, el.currentTime);
            if (
              !completed &&
              el.duration &&
              el.currentTime / el.duration >= 0.9
            )
              complete(topic.id);
          }}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => {
            setPlaying(false);
            complete(topic.id);
          }}
          onError={() => setError(true)}
        />
        <div className="audio-label">
          <span className="eyebrow">
            {completed ? "Lesson listened" : "Topic audio lesson"}
          </span>
          <span className="mono">LOCAL NARRATION</span>
        </div>
        {error ? (
          <div className="audio-error">
            <p>
              Audio couldn’t be loaded. You can read the complete transcript
              below.
            </p>
            <button
              onClick={() => {
                setError(false);
                audio.current?.load();
              }}
            >
              Retry audio
            </button>
          </div>
        ) : (
          <>
            <div className="audio-main">
              <button
                className="play-button"
                onClick={toggle}
                aria-label={playing ? "Pause lesson" : "Play lesson"}
              >
                {playing ? (
                  <Pause size={23} />
                ) : (
                  <Play size={23} fill="currentColor" />
                )}
              </button>
              <div className="wave-track" aria-hidden="true">
                {Array.from({ length: 62 }, (_, i) => (
                  <span
                    key={i}
                    style={{
                      height: `${12 + Math.abs(Math.sin(i * 1.3) * Math.cos(i * 0.3)) * 36}px`,
                      background:
                        i / 62 <= current / (duration || 1)
                          ? "var(--signal-orange)"
                          : "var(--ink-700)",
                    }}
                  />
                ))}
              </div>
              <span className="audio-time mono">
                {time(current)} <span>/ {time(duration)}</span>
              </span>
            </div>
            <label className="sr-only" htmlFor={`seek-${topic.id}`}>
              Audio position
            </label>
            <input
              id={`seek-${topic.id}`}
              className="audio-seek"
              type="range"
              min="0"
              max={duration || 100}
              step="0.1"
              value={current}
              onChange={(e) => seek(Number(e.target.value))}
              aria-valuetext={`${time(current)} of ${time(duration)}`}
            />
            <div className="audio-controls">
              <button
                aria-label="Back 15 seconds"
                onClick={() => seek(current - 15)}
              >
                <RotateCcw size={17} />
                <span>15</span>
              </button>
              <button
                aria-label="Forward 15 seconds"
                onClick={() => seek(current + 15)}
              >
                <RotateCw size={17} />
                <span>15</span>
              </button>
              <select
                aria-label="Playback speed"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
              >
                {[0.75, 1, 1.25, 1.5, 2].map((n) => (
                  <option value={n} key={n}>
                    {n}×
                  </option>
                ))}
              </select>
              <div className="volume-control">
                <Volume2 size={17} />
                <input
                  aria-label="Volume"
                  type="range"
                  min="0"
                  max="1"
                  step=".05"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                />
              </div>
              <button
                className="transcript-toggle"
                aria-expanded={transcript}
                aria-controls="transcript"
                onClick={() => setTranscript(!transcript)}
              >
                <FileText size={16} />
                <span>Transcript</span>
              </button>
            </div>
          </>
        )}
      </section>
      {(transcript || error) && (
        <section id="transcript" className="transcript">
          <div className="eyebrow">Lesson transcript</div>
          <h3>{topic.title}</h3>
          {narration(topic)
            .split(/(?<=\.) /)
            .map((s, i) => (
              <p key={i}>{s}</p>
            ))}
        </section>
      )}
    </>
  );
}
