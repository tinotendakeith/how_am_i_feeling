import { useMemo, useState } from 'react';
import { jsPDF } from 'jspdf';

const emotions = [
  'Anxious',
  'Overwhelmed',
  'Sad',
  'Angry',
  'Numb',
  'Confused',
  'Lonely',
  'Tired',
  'Stressed',
  'Calm',
  'Hopeful',
  "I'm not sure",
];

const bodyAreas = [
  'Chest',
  'Stomach',
  'Head',
  'Shoulders',
  'Throat',
  'Hands',
  'Whole body',
  "I don't feel it physically",
  "I'm not sure",
];

const triggers = [
  'A conversation',
  'Work or school pressure',
  'Family',
  'Relationship issues',
  'Money stress',
  'Health concerns',
  'Memories from the past',
  'Social media',
  "I don't know",
  'Other',
];

const thoughtChecks = [
  'It feels true',
  "I'm not sure",
  'It might be a pattern',
  'I need to think about it differently',
];

const resetOptions = [
  'Take 5 slow breaths',
  'Try the 5-4-3-2-1 grounding exercise',
  'Step outside for 2 minutes',
  'Drink water and pause',
  'Send a message to someone you trust',
  'Write down what you need',
];

const needs = [
  'Rest',
  'Space',
  'Support',
  'Clarity',
  'To talk to someone',
  'To journal',
  'To book therapy',
  "I'm not sure",
];

const supportOptions = [
  'I can manage this for now',
  'I need to talk to someone',
  'I may need professional support',
];

const disclaimer =
  'This tool is for self-reflection and emotional awareness only. It is not a diagnosis or a replacement for therapy, medical advice, or crisis support. If you feel unsafe or in immediate danger, please contact emergency services or a trusted person immediately.';

type StepId =
  | 'welcome'
  | 'feeling'
  | 'body'
  | 'trigger'
  | 'thought'
  | 'reframe'
  | 'reset'
  | 'next'
  | 'summary';

type FormState = {
  emotions: string[];
  emotionText: string;
  bodyAreas: string[];
  bodyText: string;
  triggers: string[];
  triggerText: string;
  thoughtText: string;
  thoughtCheck: string;
  balancedThought: string;
  resetOption: string;
  needs: string[];
  supportChoice: string;
};

const initialState: FormState = {
  emotions: [],
  emotionText: '',
  bodyAreas: [],
  bodyText: '',
  triggers: [],
  triggerText: '',
  thoughtText: '',
  thoughtCheck: '',
  balancedThought: '',
  resetOption: '',
  needs: [],
  supportChoice: '',
};

const steps: Array<{ id: StepId; label: string }> = [
  { id: 'welcome', label: 'Welcome' },
  { id: 'feeling', label: 'Feeling' },
  { id: 'body', label: 'Body' },
  { id: 'trigger', label: 'Trigger' },
  { id: 'thought', label: 'Thought' },
  { id: 'reframe', label: 'Reframe' },
  { id: 'reset', label: 'Reset' },
  { id: 'next', label: 'Next step' },
  { id: 'summary', label: 'Summary' },
];

function formatList(items: string[], fallback = 'noticing what came up'): string {
  if (items.length === 0) return fallback;
  if (items.length === 1) return items[0].toLowerCase();
  return `${items.slice(0, -1).join(', ').toLowerCase()} and ${items.at(-1)?.toLowerCase()}`;
}

function App() {
  const [stepIndex, setStepIndex] = useState(0);
  const [form, setForm] = useState<FormState>(initialState);

  const currentStep = steps[stepIndex];
  const progress = Math.round(((stepIndex + 1) / steps.length) * 100);

  const summary = useMemo(
    () =>
      `Today, you noticed that you may be feeling ${formatList(
        form.emotions,
        'something that deserves attention',
      )}. You felt it mostly in ${formatList(form.bodyAreas, 'your body or awareness')}. It may have been connected to ${formatList(
        form.triggers,
        'something that is still becoming clear',
      )}. One kinder thought you explored was: "${
        form.balancedThought.trim() || 'I can meet this moment with patience.'
      }" Your next step is: ${formatList(form.needs, 'one gentle next step')}.`,
    [form],
  );

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const toggleMulti = (key: 'emotions' | 'bodyAreas' | 'triggers' | 'needs', value: string) => {
    setForm((current) => {
      const values = current[key];
      return {
        ...current,
        [key]: values.includes(value)
          ? values.filter((item) => item !== value)
          : [...values, value],
      };
    });
  };

  const goNext = () => setStepIndex((index) => Math.min(index + 1, steps.length - 1));
  const goBack = () => setStepIndex((index) => Math.max(index - 1, 0));
  const restart = () => {
    setForm(initialState);
    setStepIndex(0);
  };

  const downloadPdf = () => {
    const doc = new jsPDF();
    const today = new Date().toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const rows = [
      ['Date', today],
      ['Selected emotions', form.emotions.join(', ') || 'Not specified'],
      ['Body awareness', form.bodyAreas.join(', ') || 'Not specified'],
      ['Body description', form.bodyText || 'Not specified'],
      ['Possible trigger', form.triggers.join(', ') || 'Not specified'],
      ['Trigger notes', form.triggerText || 'Not specified'],
      ['Thought reflection', form.thoughtText || 'Not specified'],
      ['Thought check', form.thoughtCheck || 'Not specified'],
      ['Balanced thought', form.balancedThought || 'Not specified'],
      ['Reset option', form.resetOption || 'Not specified'],
      ['Next step', form.needs.join(', ') || 'Not specified'],
      ['Support choice', form.supportChoice || 'Not specified'],
    ];

    doc.setFillColor(31, 122, 140);
    doc.rect(0, 0, 210, 28, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('Healing in Paradise', 16, 13);
    doc.setFontSize(12);
    doc.text('How Am I Feeling? Reflection', 16, 21);

    doc.setTextColor(46, 46, 46);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    let y = 40;

    rows.forEach(([label, value]) => {
      const wrapped = doc.splitTextToSize(value, 126);
      if (y + wrapped.length * 6 > 270) {
        doc.addPage();
        y = 20;
      }
      doc.setFont('helvetica', 'bold');
      doc.text(`${label}:`, 16, y);
      doc.setFont('helvetica', 'normal');
      doc.text(wrapped, 68, y);
      y += Math.max(10, wrapped.length * 6 + 4);
    });

    const wrappedDisclaimer = doc.splitTextToSize(disclaimer, 178);
    if (y + wrappedDisclaimer.length * 5 > 278) {
      doc.addPage();
      y = 20;
    }
    doc.setFont('helvetica', 'bold');
    doc.text('Gentle note:', 16, y);
    doc.setFont('helvetica', 'normal');
    doc.text(wrappedDisclaimer, 16, y + 7);
    doc.save('healing-in-paradise-reflection.pdf');
  };

  return (
    <main className="min-h-screen bg-softMist text-ink">
      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        <header className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-paradiseTeal">Healing in Paradise</p>
            <p className="text-xs text-ink/60">Your responses are not saved unless you download them.</p>
          </div>
          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-paradiseTeal shadow-sm">
            {currentStep.label}
          </span>
        </header>

        <ProgressBar progress={progress} current={stepIndex + 1} total={steps.length} />

        <section className="mt-5 flex flex-1 items-center">
          <div className="w-full rounded-lg bg-white p-5 shadow-soft sm:p-8">
            {currentStep.id === 'welcome' && (
              <StepWrapper
                eyebrow="A gentle check-in"
                title="How Am I Feeling?"
                subtitle="A gentle guide to help you pause, understand your emotions, and take the next small step."
              >
                <p className="text-base leading-7 text-ink/75">
                  Sometimes it's not that something is wrong. Sometimes everything just feels unclear. This
                  tool will help you slow down, check in with yourself, and understand what you may be feeling.
                </p>
                <p className="rounded-lg bg-softMist p-4 text-sm leading-6 text-ink/70">{disclaimer}</p>
              </StepWrapper>
            )}

            {currentStep.id === 'feeling' && (
              <StepWrapper title="What are you feeling right now?" subtitle="Choose whatever fits. You can pick more than one.">
                <MultiSelectOptions
                  label="Current feelings"
                  options={emotions}
                  selected={form.emotions}
                  onToggle={(value) => toggleMulti('emotions', value)}
                />
                <TextAreaPrompt
                  label="Describe it in your own words."
                  value={form.emotionText}
                  onChange={(value) => updateField('emotionText', value)}
                />
              </StepWrapper>
            )}

            {currentStep.id === 'body' && (
              <StepWrapper title="Where do you feel this in your body?" subtitle="There is no right answer here. Not noticing it physically is also okay.">
                <MultiSelectOptions
                  label="Body awareness"
                  options={bodyAreas}
                  selected={form.bodyAreas}
                  onToggle={(value) => toggleMulti('bodyAreas', value)}
                />
                <TextAreaPrompt
                  label="What does it feel like?"
                  value={form.bodyText}
                  onChange={(value) => updateField('bodyText', value)}
                />
              </StepWrapper>
            )}

            {currentStep.id === 'trigger' && (
              <StepWrapper title="What might have triggered this feeling?" subtitle="If you are not sure yet, that is allowed too.">
                <MultiSelectOptions
                  label="Possible triggers"
                  options={triggers}
                  selected={form.triggers}
                  onToggle={(value) => toggleMulti('triggers', value)}
                />
                <TextAreaPrompt
                  label="Write anything that may have contributed."
                  value={form.triggerText}
                  onChange={(value) => updateField('triggerText', value)}
                />
              </StepWrapper>
            )}

            {currentStep.id === 'thought' && (
              <StepWrapper title="What thoughts are going through your mind?" subtitle="Let the words be simple. A sentence or two is enough.">
                <TextAreaPrompt
                  label="Thoughts going through my mind"
                  value={form.thoughtText}
                  onChange={(value) => updateField('thoughtText', value)}
                />
                <SingleSelectOptions
                  label="Is this thought definitely true, or could it be a feeling or pattern?"
                  options={thoughtChecks}
                  selected={form.thoughtCheck}
                  onSelect={(value) => updateField('thoughtCheck', value)}
                />
              </StepWrapper>
            )}

            {currentStep.id === 'reframe' && (
              <StepWrapper title="Let's look at this gently." subtitle="Try one kinder, more balanced way to hold what is happening.">
                <div className="grid gap-3">
                  {[
                    'What would I say to a friend feeling this way?',
                    'Is there another way to understand this situation?',
                    'What is one kinder, more balanced thought I can try?',
                  ].map((prompt) => (
                    <p key={prompt} className="rounded-lg bg-softMist p-4 text-sm leading-6 text-ink/75">
                      {prompt}
                    </p>
                  ))}
                </div>
                <TextAreaPrompt
                  label="My kinder/balanced thought is..."
                  value={form.balancedThought}
                  onChange={(value) => updateField('balancedThought', value)}
                />
              </StepWrapper>
            )}

            {currentStep.id === 'reset' && (
              <StepWrapper title="Choose one small reset." subtitle="Pick something small enough to do next.">
                <SingleSelectOptions
                  label="Reset option"
                  options={resetOptions}
                  selected={form.resetOption}
                  onSelect={(value) => updateField('resetOption', value)}
                />
                {form.resetOption === 'Try the 5-4-3-2-1 grounding exercise' && <ResetExercise />}
              </StepWrapper>
            )}

            {currentStep.id === 'next' && (
              <StepWrapper title="What do you need right now?" subtitle="A next step can be small and still matter.">
                <MultiSelectOptions
                  label="Current need"
                  options={needs}
                  selected={form.needs}
                  onToggle={(value) => toggleMulti('needs', value)}
                />
                <SingleSelectOptions
                  label="Can you handle this alone right now, or would support help?"
                  options={supportOptions}
                  selected={form.supportChoice}
                  onSelect={(value) => updateField('supportChoice', value)}
                />
              </StepWrapper>
            )}

            {currentStep.id === 'summary' && (
              <SummaryPage summary={summary} onDownload={downloadPdf} onRestart={restart} />
            )}

            <nav className="mt-8 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={goBack}
                disabled={stepIndex === 0}
                className="rounded-lg border border-paradiseTeal/20 px-5 py-3 text-sm font-semibold text-paradiseTeal transition hover:bg-paradiseTeal/5 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Back
              </button>

              {currentStep.id !== 'summary' ? (
                <button
                  type="button"
                  onClick={goNext}
                  className="rounded-lg bg-paradiseTeal px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#196777]"
                >
                  {currentStep.id === 'welcome' ? 'Start Check-In' : 'Next'}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={restart}
                  className="rounded-lg border border-paradiseTeal/20 px-5 py-3 text-sm font-semibold text-paradiseTeal transition hover:bg-paradiseTeal/5"
                >
                  Start Again
                </button>
              )}
            </nav>
          </div>
        </section>
      </div>
    </main>
  );
}

function ProgressBar({ progress, current, total }: { progress: number; current: number; total: number }) {
  return (
    <div aria-label={`Step ${current} of ${total}`} className="w-full">
      <div className="mb-2 flex items-center justify-between text-xs font-medium text-ink/60">
        <span>Step {current} of {total}</span>
        <span>{progress}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white">
        <div
          className="h-full rounded-full bg-healingGreen transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

function StepWrapper({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="animate-rise space-y-6">
      <div className="space-y-3">
        {eyebrow && <p className="text-sm font-semibold text-healingGreen">{eyebrow}</p>}
        <h1 className="font-heading text-3xl leading-tight text-ink sm:text-4xl">{title}</h1>
        {subtitle && <p className="text-base leading-7 text-ink/70">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function MultiSelectOptions({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <fieldset className="space-y-3">
      <legend className="sr-only">{label}</legend>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {options.map((option) => {
          const isSelected = selected.includes(option);
          return (
            <button
              key={option}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onToggle(option)}
              className={`min-h-12 rounded-lg border px-4 py-3 text-left text-sm font-semibold transition ${
                isSelected
                  ? 'border-paradiseTeal bg-paradiseTeal text-white shadow-sm'
                  : 'border-ink/10 bg-white text-ink hover:border-paradiseTeal/50 hover:bg-softMist'
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function SingleSelectOptions({
  label,
  options,
  selected,
  onSelect,
}: {
  label: string;
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-semibold text-ink/75">{label}</legend>
      <div className="grid grid-cols-1 gap-3">
        {options.map((option) => {
          const isSelected = selected === option;
          return (
            <button
              key={option}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelect(option)}
              className={`min-h-12 rounded-lg border px-4 py-3 text-left text-sm font-semibold transition ${
                isSelected
                  ? 'border-paradiseTeal bg-paradiseTeal text-white shadow-sm'
                  : 'border-ink/10 bg-white text-ink hover:border-paradiseTeal/50 hover:bg-softMist'
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function TextAreaPrompt({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-semibold text-ink/75">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        className="w-full resize-none rounded-lg border border-ink/10 bg-softMist px-4 py-3 text-base leading-7 text-ink placeholder:text-ink/40"
        placeholder="Write as much or as little as you want."
      />
    </label>
  );
}

function ResetExercise() {
  return (
    <div className="rounded-lg bg-softMist p-4 text-sm leading-7 text-ink/75">
      <p>Name 5 things you can see.</p>
      <p>Name 4 things you can feel.</p>
      <p>Name 3 things you can hear.</p>
      <p>Name 2 things you can smell.</p>
      <p>Name 1 thing you can taste.</p>
    </div>
  );
}

function SummaryPage({
  summary,
  onDownload,
  onRestart,
}: {
  summary: string;
  onDownload: () => void;
  onRestart: () => void;
}) {
  return (
    <StepWrapper title="Your reflection" subtitle="Here is a gentle summary of what you noticed today.">
      <div className="rounded-lg bg-softMist p-5 text-base leading-8 text-ink/80">{summary}</div>
      <p className="text-base leading-7 text-ink/75">
        Noticing how you feel is already a meaningful step. You don't have to solve everything today.
      </p>
      <CTASection onDownload={onDownload} onRestart={onRestart} />
    </StepWrapper>
  );
}

function CTASection({ onDownload, onRestart }: { onDownload: () => void; onRestart: () => void }) {
  return (
    <div className="space-y-4 rounded-lg border border-paradiseTeal/10 bg-white p-5">
      <p className="text-sm leading-6 text-ink/70">
        If this feeling has been ongoing, overwhelming, or difficult to manage alone, support is available.
      </p>
      <div className="grid gap-3 sm:grid-cols-3">
        <a
          href="#book-therapy-session"
          className="rounded-lg bg-healingGreen px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#249957]"
        >
          Book a Therapy Session
        </a>
        <button
          type="button"
          onClick={onDownload}
          className="rounded-lg bg-paradiseTeal px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#196777]"
        >
          Download My Reflection
        </button>
        <button
          type="button"
          onClick={onRestart}
          className="rounded-lg border border-paradiseTeal/20 px-4 py-3 text-sm font-semibold text-paradiseTeal transition hover:bg-paradiseTeal/5"
        >
          Start Again
        </button>
      </div>
    </div>
  );
}

export default App;
