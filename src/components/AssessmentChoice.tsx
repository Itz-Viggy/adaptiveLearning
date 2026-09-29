export function AssessmentChoice({
  index,
  text,
  selected,
  onSelect,
}: {
  index: number;
  text: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <label className={`assessment-choice ${selected ? "selected" : ""}`}>
      <input
        type="radio"
        name="answer"
        value={index}
        checked={selected}
        onChange={onSelect}
      />
      <span className="choice-letter">{String.fromCharCode(65 + index)}</span>
      <span>{text}</span>
      <span className="choice-state">{selected ? "Selected" : ""}</span>
    </label>
  );
}
