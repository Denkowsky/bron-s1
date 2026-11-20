"use client";

import { useEffect, useId, useRef, useState, type RefObject } from "react";
import { Check } from "lucide-react";
import { QUIZ_QUESTIONS, type QuizQuestion } from "@/data/quizQuestions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const LETTERS = ["A", "B", "C"] as const;
const TOTAL = QUIZ_QUESTIONS.length;

type Phase = "quiz" | "result";

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

function resultStatus(correct: number): string {
  if (correct >= 12) {
    return "Dobry wynik. Na prawdziwym patencie pierwsze 4 pytania z ustawy i bezpieczeństwa muszą być jednak w 100% bezbłędne.";
  }
  if (correct >= 9) {
    return "Blisko progu. Egzamin teoretyczny wymaga co najmniej 9 poprawnych odpowiedzi na 10, a błąd w pierwszych 4 pytaniach z ustawy i bezpieczeństwa oblewa całość.";
  }
  return "Poniżej progu egzaminu teoretycznego. Wróć do ustawy o broni i amunicji i do zasad bezpieczeństwa na strzelnicy.";
}

export function PatentQuiz() {
  const [phase, setPhase] = useState<Phase>("quiz");
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);

  const question = QUIZ_QUESTIONS[index];
  const answered = selected !== null;
  const isLast = index === TOTAL - 1;
  const nextRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (answered && phase === "quiz") nextRef.current?.focus();
  }, [answered, phase, index]);

  function choose(optionIndex: number) {
    if (answered) return;
    setSelected(optionIndex);
    if (optionIndex === question.correctIndex) setCorrectCount((count) => count + 1);
  }

  function goNext() {
    if (!answered) return;
    if (isLast) {
      setPhase("result");
      return;
    }
    setIndex((current) => current + 1);
    setSelected(null);
  }

  function restart() {
    setPhase("quiz");
    setIndex(0);
    setSelected(null);
    setCorrectCount(0);
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      {phase === "quiz" ? (
        <QuizStep
          question={question}
          index={index}
          selected={selected}
          correctCount={correctCount}
          onChoose={choose}
          onNext={goNext}
          nextRef={nextRef}
        />
      ) : (
        <ResultScreen correct={correctCount} onRestart={restart} />
      )}
    </div>
  );
}

function QuizStep({
  question,
  index,
  selected,
  correctCount,
  onChoose,
  onNext,
  nextRef,
}: {
  question: QuizQuestion;
  index: number;
  selected: number | null;
  correctCount: number;
  onChoose: (optionIndex: number) => void;
  onNext: () => void;
  nextRef: RefObject<HTMLButtonElement | null>;
}) {
  const answered = selected !== null;
  const isLast = index === TOTAL - 1;
  const legendId = useId();

  return (
    <section className="rounded-md border border-zinc-800 bg-zinc-900/70" aria-labelledby={legendId}>
      <div className="border-b border-zinc-800 px-4 py-3 sm:px-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <p className="font-mono text-sm tabular-nums text-zinc-100">
            <span className="text-amber-500">{pad(index + 1)}</span>
            <span className="text-zinc-600"> / {pad(TOTAL)}</span>
          </p>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="h-5 rounded-sm border-zinc-700 px-2 font-mono text-[10px] tracking-wide text-zinc-300"
            >
              {question.category}
            </Badge>
            <p className="font-mono text-xs tabular-nums text-zinc-400">
              Poprawne{" "}
              <span className="text-zinc-100">
                {pad(correctCount)} / {pad(TOTAL)}
              </span>
            </p>
          </div>
        </div>
        <progress
          className="quiz-progress"
          value={index}
          max={TOTAL}
          aria-label="Postęp quizu"
        />
      </div>

      <form
        className="px-4 py-5 sm:px-5"
        onSubmit={(event) => {
          event.preventDefault();
          if (answered) onNext();
        }}
      >
        <fieldset disabled={answered}>
          <legend id={legendId} className="mb-4 text-base leading-relaxed font-medium text-zinc-100">
            {question.question}
          </legend>
          <div className="grid gap-2">
            {question.options.map((option, optionIndex) => {
              const isCorrect = optionIndex === question.correctIndex;
              const isChosen = optionIndex === selected;
              const letter = LETTERS[optionIndex];
              const inputId = `${question.id}-${letter}`;
              return (
                <div key={letter}>
                  <input
                    id={inputId}
                    className="peer sr-only"
                    type="radio"
                    name={question.id}
                    value={letter}
                    checked={isChosen}
                    onChange={() => onChoose(optionIndex)}
                  />
                  <label
                    htmlFor={inputId}
                    className={cn(
                      "flex cursor-pointer items-start gap-3 rounded-md border border-zinc-800 bg-zinc-950 px-3 py-3 text-sm text-zinc-200 transition-colors",
                      "peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-amber-500",
                      !answered && "hover:border-zinc-600",
                      answered && isCorrect && "border-emerald-500/70 bg-emerald-950/20",
                      answered && isChosen && !isCorrect && "border-red-500/70 bg-red-950/20",
                      answered && "cursor-default",
                    )}
                  >
                    <span className="mt-0.5 w-4 shrink-0 font-mono text-xs text-zinc-500">{letter}</span>
                    <span className="leading-relaxed">
                      {option}
                      {answered && isCorrect ? (
                        <span className="mt-1 block font-mono text-[11px] tracking-wide text-emerald-400">
                          Poprawna
                        </span>
                      ) : null}
                      {answered && isChosen && !isCorrect ? (
                        <span className="mt-1 block font-mono text-[11px] tracking-wide text-red-400">
                          Twoja odpowiedź
                        </span>
                      ) : null}
                    </span>
                  </label>
                </div>
              );
            })}
          </div>
        </fieldset>

        {answered ? (
          <div className="mt-4 rounded-md border border-zinc-800 bg-zinc-950 px-3 py-3" role="status">
            <p className="font-mono text-xs text-amber-500">{question.legalBasis}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-zinc-300">{question.explanation}</p>
          </div>
        ) : null}

        <div className="mt-4 flex justify-end">
          <Button
            ref={nextRef}
            type="submit"
            disabled={!answered}
            className="h-10 rounded-md bg-amber-500 px-4 font-medium text-zinc-950 hover:bg-amber-400 disabled:bg-zinc-800 disabled:text-zinc-500"
          >
            {isLast ? "Zobacz wynik" : "Następne pytanie"}
            <span aria-hidden>→</span>
          </Button>
        </div>
      </form>
    </section>
  );
}

function ResultScreen({ correct, onRestart }: { correct: number; onRestart: () => void }) {
  const percent = Math.round((correct / TOTAL) * 100);
  const codeId = useId();
  const errorId = useId();
  const [code, setCode] = useState("");
  const [rejected, setRejected] = useState(false);

  return (
    <div className="space-y-4">
      <section className="rounded-md border border-zinc-800 bg-zinc-900/70 px-4 py-5 sm:px-5" aria-labelledby="quiz-result">
        <h2 id="quiz-result" className="font-mono text-[11px] font-medium tracking-[0.12em] text-zinc-400 uppercase">
          Wynik próby
        </h2>
        <p className="mt-3 font-mono text-4xl font-semibold tracking-tight text-zinc-100 tabular-nums">
          {correct} / {TOTAL}{" "}
          <span className="text-2xl text-zinc-400">({percent}%)</span>
        </p>
        <progress
          className="quiz-progress mt-4"
          value={correct}
          max={TOTAL}
          aria-label="Udział poprawnych odpowiedzi"
        />
        <p className="mt-4 text-sm leading-relaxed text-zinc-300">{resultStatus(correct)}</p>
        <p className="mt-2 text-xs leading-relaxed text-zinc-500">
          To próbka 15 pytań, a nie oficjalny zestaw Komisji Licencyjno-Patentowej PZSS. Nie zastępuje tekstu ustawy.
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={onRestart}
          className="mt-4 h-10 rounded-md border-zinc-700 bg-transparent text-zinc-100 hover:bg-zinc-800"
        >
          Rozwiąż ponownie
        </Button>
      </section>

      <section className="rounded-md border border-zinc-800 bg-zinc-900/70 px-4 py-5 sm:px-5" aria-labelledby="quiz-paywall">
        <h2 id="quiz-paywall" className="text-lg font-semibold tracking-tight text-zinc-100">
          Odblokuj pełną bazę pytań na Patent Strzelecki 2026
        </h2>
        <ul className="mt-4 space-y-2.5">
          {[
            "Pełna baza 350+ aktualnych pytań (UoBiA, KK, regulaminy PZSS, budowa broni).",
            "Tryb symulacji egzaminu (10 pytań, limit 15 minut, rygor 4 pierwszych pytań).",
            "Natychmiastowy dostęp na 90 dni bez subskrypcji.",
          ].map((benefit) => (
            <li key={benefit} className="flex gap-2.5 text-sm leading-relaxed text-zinc-300">
              <Check className="mt-0.5 size-4 shrink-0 text-amber-500" aria-hidden />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
        <p className="mt-5 font-mono text-3xl font-semibold text-zinc-100 tabular-nums">
          39 zł
          <span className="ml-2 font-sans text-xs font-normal text-zinc-500">jednorazowo, BLIK / szybki przelew</span>
        </p>
        <Button asChild className="mt-4 h-11 w-full rounded-md bg-amber-500 font-medium text-zinc-950 hover:bg-amber-400 sm:w-auto">
          <a href="#checkout-blik" target="_blank" rel="noopener noreferrer">
            Kup dostęp (BLIK) — 39 zł
          </a>
        </Button>

        <details className="mt-5 border-t border-zinc-800 pt-3">
          <summary className="cursor-pointer text-sm text-zinc-400 hover:text-zinc-200">
            Masz już kod dostępu?
          </summary>
          <form
            className="mt-3 flex flex-col gap-2 sm:flex-row"
            onSubmit={(event) => {
              event.preventDefault();
              setRejected(true);
            }}
          >
            <label className="sr-only" htmlFor={codeId}>
              Kod dostępu
            </label>
            <input
              id={codeId}
              value={code}
              onChange={(event) => {
                setCode(event.target.value);
                setRejected(false);
              }}
              autoComplete="off"
              spellCheck={false}
              aria-invalid={rejected}
              aria-describedby={rejected ? errorId : undefined}
              placeholder="Kod dostępu"
              className="h-10 flex-1 rounded-md border border-zinc-800 bg-zinc-950 px-3 font-mono text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
            />
            <Button
              type="submit"
              variant="outline"
              className="h-10 rounded-md border-zinc-700 bg-transparent text-zinc-100 hover:bg-zinc-800"
            >
              Aktywuj
            </Button>
          </form>
          {rejected ? (
            <p id={errorId} role="alert" className="mt-2 text-xs text-red-400">
              Nieprawidłowy kod dostępu
            </p>
          ) : null}
        </details>
      </section>
    </div>
  );
}
