import type { Topic } from "../services/mockData";
import { statusLabels } from "../services/mockData";
import { TopicStatusMark } from "./ui";
import { ArrowUpRight } from "lucide-react";
export function TopicPath({
  topics,
  compact = false,
  onSelect,
}: {
  topics: Topic[];
  compact?: boolean;
  onSelect: (topic: Topic) => void;
}) {
  return (
    <ol className={`topic-path ${compact ? "compact" : ""}`}>
      {topics.map((topic) => (
        <li key={topic.id} className={topic.state}>
          <button className="path-item" onClick={() => onSelect(topic)}>
            <TopicStatusMark state={topic.state} />
            <span className="path-index">{topic.number}</span>
            <span className="path-content">
              <strong>{compact ? topic.short : topic.title}</strong>
              <span className="path-status">
                {statusLabels[topic.state]}
                {!compact && topic.state === "completed"
                  ? ` · Mastery ${topic.mastery}%`
                  : ""}
              </span>
            </span>
            {!compact && (
              <span className="path-value">
                {topic.mastery > 0 ? `${topic.mastery}%` : "—"}
                <ArrowUpRight size={16} />
              </span>
            )}
          </button>
        </li>
      ))}
    </ol>
  );
}
