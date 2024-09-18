export interface QuizData {
    id: number;
    name: string;
    status: string;
    answerCount: number;
    correctCount: number;
    dueDate: string | null;
    completedDate: string | null;
    setterId: number;
    setterName: string;
    setterEmail: string;
    subjectId: number;
    displaySubject: string;
    testType: string;
    questionCount: number;
    course: string;
    specificationId: number;
    qualificationId: number;
    assessmentId: number;
    isRetake: boolean;
    depth: number;
    origin: number;
    overdue: number;
    quizComment: string;
    isArchived: boolean;
    startDate: string | null;
    seedId: string | null;
    stage: string;
    questions: number[];
    questionMap: Record<number, Question>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    answerMap: Record<string, any>; // Replace any with a more specific type if needed
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    reviewMap: Record<string, any>; // Replace any with a more specific type if needed
    topicSummary: TopicSummary[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    excerpts: any[]; // Replace any with a more specific type if needed
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    links: any[]; // Replace any with a more specific type if needed
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    studyGuides: any[]; // Replace any with a more specific type if needed
    runningHeader: string;
    backgroundFolders: string[];
    allowRetake: boolean;
}
  
export interface Question {
    id: number;
    question: string;
    type: 'text' | 'multiple'; // or any other types you expect
    extra: string;
    image: string | null;
    questionRenderer: string;
    reasoning: string;
    reasoningImage: string | null;
    answer?: string | null;
    choices?: string[]; // optional, only for 'multiple' type questions
}
  
export interface TopicSummary {
    topicId: number;
    name: string;
    answered: number;
    correct: number;
    percent: number;
}