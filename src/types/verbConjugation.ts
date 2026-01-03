export type VerbConjugation = {
  translation: string;
  infinitive: string;
  present: {
    indefinite: {
      én: string;
      te: string;
      ő: string;
      mi: string;
      ti: string;
      ők: string;
    };
    definite: {
      én: string;
      te: string;
      ő: string;
      mi: string;
      ti: string;
      ők: string;
    } | null;
  };
  past: {
    indefinite: {
      én: string;
      te: string;
      ő: string;
      mi: string;
      ti: string;
      ők: string;
    };
    definite: {
      én: string;
      te: string;
      ő: string;
      mi: string;
      ti: string;
      ők: string;
    } | null;
  };
};
