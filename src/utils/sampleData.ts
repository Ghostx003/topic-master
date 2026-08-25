import { Subject } from '../types/subject';
import { Topic } from '../types/topic';
import { Schedule } from '../types/schedule';

export const INITIAL_SUBJECTS: Subject[] = [
  {
    id: 'subj-dm',
    Subject_Name: 'Discrete Mathematics',
    Subject_Importance: 'Urgent',
    Subject_Color: '#6366f1',
    Subject_Description: 'Propositional & predicate logic, sets, relations, posets, combinatorics, graph theory, and recurrence relations.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'subj-em',
    Subject_Name: 'Engineering Mathematics',
    Subject_Importance: 'Important',
    Subject_Color: '#8b5cf6',
    Subject_Description: 'Linear algebra eigenvalues/vectors, matrix rank, calculus maxima/minima, and probability distributions Bayes theorem.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'subj-algo',
    Subject_Name: 'Algorithms',
    Subject_Importance: 'Urgent',
    Subject_Color: '#3b82f6',
    Subject_Description: 'Asymptotic notation, divide and conquer, greedy methods, dynamic programming, Dijkstra shortest paths, MST, and NP-completeness.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'subj-ds',
    Subject_Name: 'Data Structures',
    Subject_Importance: 'Important',
    Subject_Color: '#0ea5e9',
    Subject_Description: 'Arrays, linked lists, stacks, queues, binary trees, BST, AVL balance, binary heaps, graph representations, and hashing tables.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'subj-prog',
    Subject_Name: 'C-Programming',
    Subject_Importance: 'Normal',
    Subject_Color: '#06b6d4',
    Subject_Description: 'Operators precedence, control flow, functions, recursion call stacks, pointer arithmetic, dynamic memory, arrays, and structs.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'subj-toc',
    Subject_Name: 'Theory of Computation',
    Subject_Importance: 'Important',
    Subject_Color: '#10b981',
    Subject_Description: 'DFA/NFA minimization, regular expressions, context-free grammars, pushdown automata, Turing machines, and decidability reductions.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'subj-cd',
    Subject_Name: 'Compiler Design',
    Subject_Importance: 'Normal',
    Subject_Color: '#14b8a6',
    Subject_Description: 'Lexical analysis tokens, LL(1) and LR parsers, syntax-directed translation, three-address code, and basic block optimizations.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'subj-os',
    Subject_Name: 'Operating Systems',
    Subject_Importance: 'Urgent',
    Subject_Color: '#f59e0b',
    Subject_Description: 'Process lifecycle, CPU scheduling, synchronization semaphores, deadlock avoidance, paging memory management, and disk scheduling.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'subj-db',
    Subject_Name: 'Database Management System',
    Subject_Importance: 'Important',
    Subject_Color: '#f97316',
    Subject_Description: 'ER modeling, relational algebra, SQL queries, functional dependencies, 3NF/BCNF normalization, ACID transactions, and B+ trees.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'subj-coa',
    Subject_Name: 'Computer Organisation & Architecture',
    Subject_Importance: 'Important',
    Subject_Color: '#ef4444',
    Subject_Description: 'Instruction formats, addressing modes, pipeline speedup & hazards, cache AMAT mapping, IEEE 754 floats, and DMA I/O transfers.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'subj-cn',
    Subject_Name: 'Computer Networks',
    Subject_Importance: 'Normal',
    Subject_Color: '#ec4899',
    Subject_Description: 'OSI/TCP-IP models, IPv4/IPv6 addressing, subnetting, TCP flow/congestion control, routing algorithms, MAC protocols, and security.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'subj-dld',
    Subject_Name: 'Digital Logic',
    Subject_Importance: 'Urgent',
    Subject_Color: '#a855f7',
    Subject_Description: 'Boolean algebra, K-map minimization, multiplexers, adders, flip-flops, synchronous/asynchronous counters, and 2s complement systems.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'subj-ga',
    Subject_Name: 'General Aptitude',
    Subject_Importance: 'Urgent',
    Subject_Color: '#84cc16',
    Subject_Description: 'Quantitative arithmetic, logical reasoning syllogisms, spatial pattern folding, and English verbal grammar.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const makeTopic = (
  id: string,
  subjectId: string,
  parentId: string | null,
  name: string,
  description: string,
  orderIndex: number,
  isStar: boolean = false
): Topic => ({
  id,
  Subject_Id: subjectId,
  Parent_Id: parentId,
  Topic_Name: name,
  Topic_Description: description,
  Topic_Order: orderIndex,
  Topic_Status: 'To Do',
  Topic_Difficulty: 'Normal',
  Topic_Study_Hours: 0,
  Topic_Sessions: [],
  Topic_Blocks: [],
  Topic_Tags: {
    Done: false,
    Confidence: 'None',
    Require_Practice: false,
    Redo: false,
    Skip: false,
    Lecture_Needed: 0,
    Deadline: null,
    Recall_Activity: false,
    Practice_DPP: false,
    Star: isStar,
  },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
});

export const INITIAL_TOPICS: Topic[] = [
  // =========================================================================
  // DISCRETE MATHEMATICS (subj-dm)
  // =========================================================================
  // --- Chapter 1: Mathematical Logic ---
  makeTopic('dm-ch-logic', 'subj-dm', null, 'Mathematical Logic', 'Propositional logic, first-order predicate logic, truth tables, and mathematical induction.', 1, true),
  makeTopic('dm-sub-propositional-logic', 'subj-dm', 'dm-ch-logic', 'Propositional Logic', 'Core GATE CSE concepts and historical examination questions for Propositional Logic.', 1, true),
  makeTopic('dm-sub-first-order-logic', 'subj-dm', 'dm-ch-logic', 'First Order Logic', 'Core GATE CSE concepts and historical examination questions for First Order Logic.', 2, true),
  makeTopic('dm-sub-mathematical-induction', 'subj-dm', 'dm-ch-logic', 'Mathematical Induction', 'Core GATE CSE concepts and historical examination questions for Mathematical Induction.', 4, false),

  // --- Chapter 2: Sets, Relations & Functions ---
  makeTopic('dm-ch-set', 'subj-dm', null, 'Sets, Relations & Functions', 'Set operations, relations, equivalence relations, partial orders, lattices, and functions.', 2, true),
  makeTopic('dm-sub-set-theory', 'subj-dm', 'dm-ch-set', 'Set Theory', 'Core GATE CSE concepts and historical examination questions for Set Theory.', 1, true),
  makeTopic('dm-sub-relations', 'subj-dm', 'dm-ch-set', 'Relations', 'Core GATE CSE concepts and historical examination questions for Relations.', 2, true),
  makeTopic('dm-sub-functions', 'subj-dm', 'dm-ch-set', 'Functions', 'Core GATE CSE concepts and historical examination questions for Functions.', 3, true),
  makeTopic('dm-sub-partial-order', 'subj-dm', 'dm-ch-set', 'Partial Order', 'Core GATE CSE concepts and historical examination questions for Partial Order.', 4, true),
  makeTopic('dm-sub-lattice', 'subj-dm', 'dm-ch-set', 'Lattice', 'Core GATE CSE concepts and historical examination questions for Lattice.', 5, true),
  makeTopic('dm-sub-countable-uncountable-set', 'subj-dm', 'dm-ch-set', 'Countable Uncountable Set', 'Core GATE CSE concepts and historical examination questions for Countable Uncountable Set.', 6, false),
  makeTopic('dm-sub-onto', 'subj-dm', 'dm-ch-set', 'Onto', 'Core GATE CSE concepts and historical examination questions for Onto.', 7, false),
  makeTopic('dm-sub-identify-function', 'subj-dm', 'dm-ch-set', 'Identify Function', 'Core GATE CSE concepts and historical examination questions for Identify Function.', 8, false),
  makeTopic('dm-sub-jaccard-coefficient', 'subj-dm', 'dm-ch-set', 'Jaccard Coefficient', 'Core GATE CSE concepts and historical examination questions for Jaccard Coefficient.', 9, false),

  // --- Chapter 3: Combinatorics & Counting ---
  makeTopic('dm-ch-comb', 'subj-dm', null, 'Combinatorics & Counting', 'Permutations, combinations, Pigeonhole principle, generating functions, recurrence relations, and balls in bins.', 3, true),
  makeTopic('dm-sub-combinatory', 'subj-dm', 'dm-ch-comb', 'Combinatory', 'Core GATE CSE concepts and historical examination questions for Combinatory.', 1, true),
  makeTopic('dm-sub-counting', 'subj-dm', 'dm-ch-comb', 'Counting', 'Core GATE CSE concepts and historical examination questions for Counting.', 2, false),
  makeTopic('dm-sub-recurrence-relation', 'subj-dm', 'dm-ch-comb', 'Recurrence Relation', 'Core GATE CSE concepts and historical examination questions for Recurrence Relation.', 3, false),
  makeTopic('dm-sub-generating-functions', 'subj-dm', 'dm-ch-comb', 'Generating Functions', 'Core GATE CSE concepts and historical examination questions for Generating Functions.', 4, false),
  makeTopic('dm-sub-balls-in-bins', 'subj-dm', 'dm-ch-comb', 'Balls In Bins', 'Core GATE CSE concepts and historical examination questions for Balls In Bins.', 5, false),
  makeTopic('dm-sub-summation', 'subj-dm', 'dm-ch-comb', 'Summation', 'Core GATE CSE concepts and historical examination questions for Summation.', 6, false),
  makeTopic('dm-sub-pigeonhole-principle', 'subj-dm', 'dm-ch-comb', 'Pigeonhole Principle', 'Core GATE CSE concepts and historical examination questions for Pigeonhole Principle.', 7, false),

  // --- Chapter 4: Graph Theory ---
  makeTopic('dm-ch-graph', 'subj-dm', null, 'Graph Theory', 'Graph representations, connectivity, planarity, coloring, isomorphism, and matchings.', 4, true),
  makeTopic('dm-sub-graph-connectivity', 'subj-dm', 'dm-ch-graph', 'Graph Connectivity', 'Core GATE CSE concepts and historical examination questions for Graph Connectivity.', 1, true),
  makeTopic('dm-sub-degree-of-graph', 'subj-dm', 'dm-ch-graph', 'Degree of Graph', 'Core GATE CSE concepts and historical examination questions for Degree of Graph.', 2, true),
  makeTopic('dm-sub-graph-planarity', 'subj-dm', 'dm-ch-graph', 'Graph Planarity', 'Core GATE CSE concepts and historical examination questions for Graph Planarity.', 3, true),
  makeTopic('dm-sub-graph-coloring', 'subj-dm', 'dm-ch-graph', 'Graph Coloring', 'Core GATE CSE concepts and historical examination questions for Graph Coloring.', 4, true),
  makeTopic('dm-sub-graph-isomorphism', 'subj-dm', 'dm-ch-graph', 'Graph Isomorphism', 'Core GATE CSE concepts and historical examination questions for Graph Isomorphism.', 5, false),
  makeTopic('dm-sub-graph-matching', 'subj-dm', 'dm-ch-graph', 'Graph Matching', 'Core GATE CSE concepts and historical examination questions for Graph Matching.', 6, false),
  makeTopic('dm-sub-graph-algorithms', 'subj-dm', 'dm-ch-graph', 'Graph Algorithms', 'Core GATE CSE concepts and historical examination questions for Graph Algorithms.', 7, false),

  // --- Chapter 5: Algebraic Structures & Number Theory ---
  makeTopic('dm-ch-algebra', 'subj-dm', null, 'Algebraic Structures & Number Theory', 'Groups, subgroups, Lagrange theorem, binary operations, modular arithmetic, and polynomial rings.', 5, true),
  makeTopic('dm-sub-group-theory', 'subj-dm', 'dm-ch-algebra', 'Group Theory', 'Core GATE CSE concepts and historical examination questions for Group Theory.', 1, true),
  makeTopic('dm-sub-binary-operation', 'subj-dm', 'dm-ch-algebra', 'Binary Operation', 'Core GATE CSE concepts and historical examination questions for Binary Operation.', 2, false),
  makeTopic('dm-sub-modular-arithmetic', 'subj-dm', 'dm-ch-algebra', 'Modular Arithmetic', 'Core GATE CSE concepts and historical examination questions for Modular Arithmetic.', 5, false),

  // =========================================================================
  // ENGINEERING MATHEMATICS (subj-em)
  // =========================================================================
  // --- Chapter 1: Linear Algebra ---
  makeTopic('em-ch-la', 'subj-em', null, 'Linear Algebra', 'Matrices, determinants, systems of linear equations, rank, eigenvalues, eigenvectors, and vector spaces.', 1, true),
  makeTopic('em-sub-eigen-value', 'subj-em', 'em-ch-la', 'Eigen Value', 'Core GATE CSE concepts and historical examination questions for Eigen Value.', 1, true),
  makeTopic('em-sub-matrix', 'subj-em', 'em-ch-la', 'Matrix', 'Core GATE CSE concepts and historical examination questions for Matrix.', 2, true),
  makeTopic('em-sub-system-of-equations', 'subj-em', 'em-ch-la', 'System of Equations', 'Core GATE CSE concepts and historical examination questions for System of Equations.', 3, true),
  makeTopic('em-sub-determinant', 'subj-em', 'em-ch-la', 'Determinant', 'Core GATE CSE concepts and historical examination questions for Determinant.', 4, true),
  makeTopic('em-sub-rank-of-matrix', 'subj-em', 'em-ch-la', 'Rank of Matrix', 'Core GATE CSE concepts and historical examination questions for Rank of Matrix.', 5, false),
  makeTopic('em-sub-vector-space', 'subj-em', 'em-ch-la', 'Vector Space', 'Core GATE CSE concepts and historical examination questions for Vector Space.', 6, false),
  makeTopic('em-sub-lu-decomposition', 'subj-em', 'em-ch-la', 'Lu Decomposition', 'Core GATE CSE concepts and historical examination questions for Lu Decomposition.', 7, false),
  makeTopic('em-sub-orthonormality', 'subj-em', 'em-ch-la', 'Orthonormality', 'Core GATE CSE concepts and historical examination questions for Orthonormality.', 8, false),
  makeTopic('em-sub-singular-value-decomposition', 'subj-em', 'em-ch-la', 'Singular Value Decomposition', 'Core GATE CSE concepts and historical examination questions for Singular Value Decomposition.', 9, false),
  makeTopic('em-sub-gaussian-elimination', 'subj-em', 'em-ch-la', 'Gaussian Elimination', 'Core GATE CSE concepts and historical examination questions for Gaussian Elimination.', 10, false),
  makeTopic('em-sub-subspace', 'subj-em', 'em-ch-la', 'Subspace', 'Core GATE CSE concepts and historical examination questions for Subspace.', 11, false),
  makeTopic('em-sub-square-invariant', 'subj-em', 'em-ch-la', 'Square Invariant', 'Core GATE CSE concepts and historical examination questions for Square Invariant.', 13, false),

  // --- Chapter 2: Calculus ---
  makeTopic('em-ch-calc', 'subj-em', null, 'Calculus', 'Limits, continuity, differentiability, maxima/minima, mean value theorem, and integration.', 2, true),
  makeTopic('em-sub-maxima-minima', 'subj-em', 'em-ch-calc', 'Maxima Minima', 'Core GATE CSE concepts and historical examination questions for Maxima Minima.', 1, true),
  makeTopic('em-sub-limits', 'subj-em', 'em-ch-calc', 'Limits', 'Core GATE CSE concepts and historical examination questions for Limits.', 2, true),
  makeTopic('em-sub-differentiation', 'subj-em', 'em-ch-calc', 'Differentiation', 'Core GATE CSE concepts and historical examination questions for Differentiation.', 3, true),
  makeTopic('em-sub-integration', 'subj-em', 'em-ch-calc', 'Integration', 'Core GATE CSE concepts and historical examination questions for Integration.', 4, true),
  makeTopic('em-sub-continuity', 'subj-em', 'em-ch-calc', 'Continuity', 'Core GATE CSE concepts and historical examination questions for Continuity.', 5, true),
  makeTopic('em-sub-definite-integral', 'subj-em', 'em-ch-calc', 'Definite Integral', 'Core GATE CSE concepts and historical examination questions for Definite Integral.', 6, false),
  makeTopic('em-sub-absolute-value', 'subj-em', 'em-ch-calc', 'Absolute Value', 'Core GATE CSE concepts and historical examination questions for Absolute Value.', 7, false),
  makeTopic('em-sub-contour-plots', 'subj-em', 'em-ch-calc', 'Contour Plots', 'Core GATE CSE concepts and historical examination questions for Contour Plots.', 8, false),

  // --- Chapter 3: Probability & Statistics ---
  makeTopic('em-ch-prob', 'subj-em', null, 'Probability & Statistics', 'Axioms of probability, conditional probability, Bayes theorem, random variables, expectation, and distributions.', 3, true),
  makeTopic('em-sub-probability', 'subj-em', 'em-ch-prob', 'Probability', 'Core GATE CSE concepts and historical examination questions for Probability.', 1, true),
  makeTopic('em-sub-expectation', 'subj-em', 'em-ch-prob', 'Expectation', 'Core GATE CSE concepts and historical examination questions for Expectation.', 2, true),
  makeTopic('em-sub-conditional-probability', 'subj-em', 'em-ch-prob', 'Conditional Probability', 'Core GATE CSE concepts and historical examination questions for Conditional Probability.', 3, true),
  makeTopic('em-sub-uniform-distribution', 'subj-em', 'em-ch-prob', 'Uniform Distribution', 'Core GATE CSE concepts and historical examination questions for Uniform Distribution.', 4, true),
  makeTopic('em-sub-random-variable', 'subj-em', 'em-ch-prob', 'Random Variable', 'Core GATE CSE concepts and historical examination questions for Random Variable.', 5, true),
  makeTopic('em-sub-binomial-distribution', 'subj-em', 'em-ch-prob', 'Binomial Distribution', 'Core GATE CSE concepts and historical examination questions for Binomial Distribution.', 6, false),
  makeTopic('em-sub-exponential-distribution', 'subj-em', 'em-ch-prob', 'Exponential Distribution', 'Core GATE CSE concepts and historical examination questions for Exponential Distribution.', 7, false),
  makeTopic('em-sub-independent-events', 'subj-em', 'em-ch-prob', 'Independent Events', 'Core GATE CSE concepts and historical examination questions for Independent Events.', 8, false),
  makeTopic('em-sub-poisson-distribution', 'subj-em', 'em-ch-prob', 'Poisson Distribution', 'Core GATE CSE concepts and historical examination questions for Poisson Distribution.', 9, false),
  makeTopic('em-sub-statistics', 'subj-em', 'em-ch-prob', 'Statistics', 'Core GATE CSE concepts and historical examination questions for Statistics.', 10, false),
  makeTopic('em-sub-bayes-theorem', 'subj-em', 'em-ch-prob', 'Bayes Theorem', 'Core GATE CSE concepts and historical examination questions for Bayes Theorem.', 11, false),
  makeTopic('em-sub-normal-distribution', 'subj-em', 'em-ch-prob', 'Normal Distribution', 'Core GATE CSE concepts and historical examination questions for Normal Distribution.', 12, false),
  makeTopic('em-sub-bayesian-network', 'subj-em', 'em-ch-prob', 'Bayesian Network', 'Core GATE CSE concepts and historical examination questions for Bayesian Network.', 13, false),
  makeTopic('em-sub-bernoulli-distribution', 'subj-em', 'em-ch-prob', 'Bernoulli Distribution', 'Core GATE CSE concepts and historical examination questions for Bernoulli Distribution.', 14, false),
  makeTopic('em-sub-variance', 'subj-em', 'em-ch-prob', 'Variance', 'Core GATE CSE concepts and historical examination questions for Variance.', 15, false),
  makeTopic('em-sub-chi-square-distribution', 'subj-em', 'em-ch-prob', 'Chi Square Distribution', 'Core GATE CSE concepts and historical examination questions for Chi Square Distribution.', 16, false),
  makeTopic('em-sub-continuous-distribution', 'subj-em', 'em-ch-prob', 'Continuous Distribution', 'Core GATE CSE concepts and historical examination questions for Continuous Distribution.', 17, false),
  makeTopic('em-sub-probability-density-function', 'subj-em', 'em-ch-prob', 'Probability Density Function', 'Core GATE CSE concepts and historical examination questions for Probability Density Function.', 18, false),
  makeTopic('em-sub-probability-distribution', 'subj-em', 'em-ch-prob', 'Probability Distribution', 'Core GATE CSE concepts and historical examination questions for Probability Distribution.', 19, false),

  // --- Chapter 4: Numerical Methods ---
  makeTopic('em-ch-num', 'subj-em', null, 'Numerical Methods', 'Numerical computation, roots of equations, numerical integration, and error estimation.', 4, true),
  makeTopic('em-sub-numerical-computation', 'subj-em', 'em-ch-num', 'Numerical Computation', 'Core GATE CSE concepts and historical examination questions for Numerical Computation.', 1, false),

  // =========================================================================
  // ALGORITHMS (subj-algo)
  // =========================================================================
  // --- Chapter 1: Asymptotic Analysis & Recurrences ---
  makeTopic('alg-ch-asymp', 'subj-algo', null, 'Asymptotic Analysis & Recurrences', 'Big-O, Big-Omega, Big-Theta notation, Master theorem, recursion trees, and algorithm time complexity.', 1, true),
  makeTopic('alg-sub-asymptotic-analysis', 'subj-algo', 'alg-ch-asymp', 'Asymptotic Analysis', 'Core GATE CSE concepts and historical examination questions for Asymptotic Analysis.', 1, false),
  makeTopic('alg-sub-recursion-recurrence', 'subj-algo', 'alg-ch-asymp', 'Recursion & Recurrence', 'Core GATE CSE concepts and historical examination questions for Recursion & Recurrence.', 2, false),
  makeTopic('alg-sub-time-complexity', 'subj-algo', 'alg-ch-asymp', 'Time Complexity', 'Core GATE CSE concepts and historical examination questions for Time Complexity.', 3, true),
  makeTopic('alg-sub-algorithm-design', 'subj-algo', 'alg-ch-asymp', 'Algorithm Design', 'Core GATE CSE concepts and historical examination questions for Algorithm Design.', 4, false),
  makeTopic('alg-sub-space-complexity', 'subj-algo', 'alg-ch-asymp', 'Space Complexity', 'Core GATE CSE concepts and historical examination questions for Space Complexity.', 5, false),
  makeTopic('alg-sub-asymptotic-notations', 'subj-algo', 'alg-ch-asymp', 'Asymptotic Notations', 'Core GATE CSE concepts and historical examination questions for Asymptotic Notations.', 6, true),
  makeTopic('alg-sub-recurrence-relation', 'subj-algo', 'alg-ch-asymp', 'Recurrence Relation', 'Core GATE CSE concepts and historical examination questions for Recurrence Relation.', 7, true),
  makeTopic('alg-sub-recursion', 'subj-algo', 'alg-ch-asymp', 'Recursion', 'Core GATE CSE concepts and historical examination questions for Recursion.', 8, true),

  // --- Chapter 2: Divide and Conquer & Sorting ---
  makeTopic('alg-ch-dc', 'subj-algo', null, 'Divide and Conquer & Sorting', 'Merge sort, quick sort, binary search, counting inversions, and lower bounds for comparison sorting.', 2, true),
  makeTopic('alg-sub-divide-and-conquer', 'subj-algo', 'alg-ch-dc', 'Divide and Conquer', 'Core GATE CSE concepts and historical examination questions for Divide and Conquer.', 1, false),
  makeTopic('alg-sub-sorting-algorithms', 'subj-algo', 'alg-ch-dc', 'Sorting Algorithms', 'Core GATE CSE concepts and historical examination questions for Sorting Algorithms.', 2, false),
  makeTopic('alg-sub-binary-search', 'subj-algo', 'alg-ch-dc', 'Binary Search', 'Core GATE CSE concepts and historical examination questions for Binary Search.', 3, false),
  makeTopic('alg-sub-inversion', 'subj-algo', 'alg-ch-dc', 'Inversion', 'Core GATE CSE concepts and historical examination questions for Inversion.', 4, false),
  makeTopic('alg-sub-merging', 'subj-algo', 'alg-ch-dc', 'Merging', 'Core GATE CSE concepts and historical examination questions for Merging.', 5, false),
  makeTopic('alg-sub-bubble-sort', 'subj-algo', 'alg-ch-dc', 'Bubble Sort', 'Core GATE CSE concepts and historical examination questions for Bubble Sort.', 6, false),
  makeTopic('alg-sub-selection-sort', 'subj-algo', 'alg-ch-dc', 'Selection Sort', 'Core GATE CSE concepts and historical examination questions for Selection Sort.', 7, false),
  makeTopic('alg-sub-number-of-swap', 'subj-algo', 'alg-ch-dc', 'Number of Swap', 'Core GATE CSE concepts and historical examination questions for Number of Swap.', 8, false),
  makeTopic('alg-sub-maximum-minimum', 'subj-algo', 'alg-ch-dc', 'Maximum Minimum', 'Core GATE CSE concepts and historical examination questions for Maximum Minimum.', 9, false),
  makeTopic('alg-sub-quick-sort', 'subj-algo', 'alg-ch-dc', 'Quick Sort', 'Core GATE CSE concepts and historical examination questions for Quick Sort.', 10, true),
  makeTopic('alg-sub-merge-sort', 'subj-algo', 'alg-ch-dc', 'Merge Sort', 'Core GATE CSE concepts and historical examination questions for Merge Sort.', 11, false),
  makeTopic('alg-sub-insertion-sort', 'subj-algo', 'alg-ch-dc', 'Insertion Sort', 'Core GATE CSE concepts and historical examination questions for Insertion Sort.', 12, false),
  makeTopic('alg-sub-heap-sort', 'subj-algo', 'alg-ch-dc', 'Heap Sort', 'Core GATE CSE concepts and historical examination questions for Heap Sort.', 13, false),
  makeTopic('alg-sub-sorting', 'subj-algo', 'alg-ch-dc', 'Sorting', 'Core GATE CSE concepts and historical examination questions for Sorting.', 14, true),
  makeTopic('alg-sub-searching', 'subj-algo', 'alg-ch-dc', 'Searching', 'Core GATE CSE concepts and historical examination questions for Searching.', 15, false),
  makeTopic('alg-sub-algorithm-design-techniques', 'subj-algo', 'alg-ch-dc', 'Algorithm Design Techniques', 'Core GATE CSE concepts and historical examination questions for Algorithm Design Techniques.', 16, false),

  // --- Chapter 3: Greedy Algorithms & Dynamic Programming ---
  makeTopic('alg-ch-greedy', 'subj-algo', null, 'Greedy Algorithms & Dynamic Programming', 'Greedy choice property, optimal substructure, Huffman coding, Knapsack, Matrix chain, LCS, and LIS.', 3, true),
  makeTopic('alg-sub-dynamic-programming', 'subj-algo', 'alg-ch-greedy', 'Dynamic Programming', 'Core GATE CSE concepts and historical examination questions for Dynamic Programming.', 1, true),
  makeTopic('alg-sub-greedy-algorithms', 'subj-algo', 'alg-ch-greedy', 'Greedy Algorithms', 'Core GATE CSE concepts and historical examination questions for Greedy Algorithms.', 2, false),
  makeTopic('alg-sub-huffman-coding', 'subj-algo', 'alg-ch-greedy', 'Huffman Coding', 'Core GATE CSE concepts and historical examination questions for Huffman Coding.', 3, false),
  makeTopic('alg-sub-0-1-knapsack-subset-sum', 'subj-algo', 'alg-ch-greedy', '0/1 Knapsack & Subset Sum', 'Core GATE CSE concepts and historical examination questions for 0/1 Knapsack & Subset Sum.', 4, false),
  makeTopic('alg-sub-longest-common-subsequence', 'subj-algo', 'alg-ch-greedy', 'Longest Common Subsequence', 'Core GATE CSE concepts and historical examination questions for Longest Common Subsequence.', 5, false),
  makeTopic('alg-sub-matrix-chain-multiplication', 'subj-algo', 'alg-ch-greedy', 'Matrix Chain Multiplication', 'Core GATE CSE concepts and historical examination questions for Matrix Chain Multiplication.', 6, false),
  makeTopic('alg-sub-huffman-code', 'subj-algo', 'alg-ch-greedy', 'Huffman Code', 'Core GATE CSE concepts and historical examination questions for Huffman Code.', 7, false),
  makeTopic('alg-sub-matrix-chain-ordering', 'subj-algo', 'alg-ch-greedy', 'Matrix Chain Ordering', 'Core GATE CSE concepts and historical examination questions for Matrix Chain Ordering.', 8, false),

  // --- Chapter 4: Graph Algorithms & Traversals ---
  makeTopic('alg-ch-graph-alg', 'subj-algo', null, 'Graph Algorithms & Traversals', 'BFS, DFS, topological sorting, Dijkstra, Bellman-Ford, Floyd-Warshall, Prim, and Kruskal MST.', 4, true),
  makeTopic('alg-sub-shortest-path', 'subj-algo', 'alg-ch-graph-alg', 'Shortest Path', 'Core GATE CSE concepts and historical examination questions for Shortest Path.', 1, false),
  makeTopic('alg-sub-minimum-spanning-tree', 'subj-algo', 'alg-ch-graph-alg', 'Minimum Spanning Tree', 'Core GATE CSE concepts and historical examination questions for Minimum Spanning Tree.', 2, true),
  makeTopic('alg-sub-graph-search-bfs-dfs', 'subj-algo', 'alg-ch-graph-alg', 'Graph Search BFS DFS', 'Core GATE CSE concepts and historical examination questions for Graph Search BFS DFS.', 3, false),
  makeTopic('alg-sub-bellman-ford', 'subj-algo', 'alg-ch-graph-alg', 'Bellman Ford', 'Core GATE CSE concepts and historical examination questions for Bellman Ford.', 4, false),
  makeTopic('alg-sub-prims-algorithm', 'subj-algo', 'alg-ch-graph-alg', 'Prims Algorithm', 'Core GATE CSE concepts and historical examination questions for Prims Algorithm.', 5, false),
  makeTopic('alg-sub-breadth-first-search', 'subj-algo', 'alg-ch-graph-alg', 'Breadth First Search', 'Core GATE CSE concepts and historical examination questions for Breadth First Search.', 6, false),
  makeTopic('alg-sub-depth-first-search', 'subj-algo', 'alg-ch-graph-alg', 'Depth First Search', 'Core GATE CSE concepts and historical examination questions for Depth First Search.', 7, false),
  makeTopic('alg-sub-directed-acyclic-graph', 'subj-algo', 'alg-ch-graph-alg', 'Directed Acyclic Graph', 'Core GATE CSE concepts and historical examination questions for Directed Acyclic Graph.', 8, false),
  makeTopic('alg-sub-dijkstras-algorithm', 'subj-algo', 'alg-ch-graph-alg', 'Dijkstras Algorithm', 'Core GATE CSE concepts and historical examination questions for Dijkstras Algorithm.', 9, false),
  makeTopic('alg-sub-graph-search', 'subj-algo', 'alg-ch-graph-alg', 'Graph Search', 'Core GATE CSE concepts and historical examination questions for Graph Search.', 10, true),
  makeTopic('alg-sub-strongly-connected-components', 'subj-algo', 'alg-ch-graph-alg', 'Strongly Connected Components', 'Core GATE CSE concepts and historical examination questions for Strongly Connected Components.', 11, false),
  makeTopic('alg-sub-topological-sort', 'subj-algo', 'alg-ch-graph-alg', 'Topological Sort', 'Core GATE CSE concepts and historical examination questions for Topological Sort.', 12, false),
  makeTopic('alg-sub-graph-algorithms', 'subj-algo', 'alg-ch-graph-alg', 'Graph Algorithms', 'Core GATE CSE concepts and historical examination questions for Graph Algorithms.', 13, true),

  // --- Chapter 5: NP-Completeness, Heaps & Hashing ---
  makeTopic('alg-ch-np-hash', 'subj-algo', null, 'NP-Completeness, Heaps & Hashing', 'Classes P, NP, NP-Complete, NP-Hard, polynomial-time reductions, heaps, and hashing.', 5, true),
  makeTopic('alg-sub-np-completeness', 'subj-algo', 'alg-ch-np-hash', 'NP Completeness', 'Core GATE CSE concepts and historical examination questions for NP Completeness.', 1, false),
  makeTopic('alg-sub-heap-priority-queue', 'subj-algo', 'alg-ch-np-hash', 'Heap & Priority Queue', 'Core GATE CSE concepts and historical examination questions for Heap & Priority Queue.', 2, false),
  makeTopic('alg-sub-hashing', 'subj-algo', 'alg-ch-np-hash', 'Hashing', 'Core GATE CSE concepts and historical examination questions for Hashing.', 3, true),
  makeTopic('alg-sub-binary-heap', 'subj-algo', 'alg-ch-np-hash', 'Binary Heap', 'Core GATE CSE concepts and historical examination questions for Binary Heap.', 4, false),
  makeTopic('alg-sub-binary-tree', 'subj-algo', 'alg-ch-np-hash', 'Binary Tree', 'Core GATE CSE concepts and historical examination questions for Binary Tree.', 5, false),
  makeTopic('alg-sub-tree-traversal', 'subj-algo', 'alg-ch-np-hash', 'Tree Traversal', 'Core GATE CSE concepts and historical examination questions for Tree Traversal.', 6, false),
  makeTopic('alg-sub-uniform-hashing', 'subj-algo', 'alg-ch-np-hash', 'Uniform Hashing', 'Core GATE CSE concepts and historical examination questions for Uniform Hashing.', 7, false),
  makeTopic('alg-sub-abstract-syntax-tree', 'subj-algo', 'alg-ch-np-hash', 'Abstract Syntax Tree', 'Core GATE CSE concepts and historical examination questions for Abstract Syntax Tree.', 8, false),
  makeTopic('alg-sub-ambiguous-grammar', 'subj-algo', 'alg-ch-np-hash', 'Ambiguous Grammar', 'Core GATE CSE concepts and historical examination questions for Ambiguous Grammar.', 9, false),
  makeTopic('alg-sub-strings', 'subj-algo', 'alg-ch-np-hash', 'Strings', 'Core GATE CSE concepts and historical examination questions for Strings.', 10, false),
  makeTopic('alg-sub-runtime-environment', 'subj-algo', 'alg-ch-np-hash', 'Runtime Environment', 'Core GATE CSE concepts and historical examination questions for Runtime Environment.', 11, false),
  makeTopic('alg-sub-binary-search-tree', 'subj-algo', 'alg-ch-np-hash', 'Binary Search Tree', 'Core GATE CSE concepts and historical examination questions for Binary Search Tree.', 12, false),
  makeTopic('alg-sub-linear-probing', 'subj-algo', 'alg-ch-np-hash', 'Linear Probing', 'Core GATE CSE concepts and historical examination questions for Linear Probing.', 13, false),
  makeTopic('alg-sub-double-hashing', 'subj-algo', 'alg-ch-np-hash', 'Double Hashing', 'Core GATE CSE concepts and historical examination questions for Double Hashing.', 14, false),
  makeTopic('alg-sub-identify-function', 'subj-algo', 'alg-ch-np-hash', 'Identify Function', 'Core GATE CSE concepts and historical examination questions for Identify Function.', 15, true),

  // =========================================================================
  // DATA STRUCTURES (subj-ds)
  // =========================================================================
  // --- Chapter 1: Linear Data Structures ---
  makeTopic('ds-ch-linear', 'subj-ds', null, 'Linear Data Structures', 'Arrays, singly/doubly linked lists, circular linked lists, stacks, queues, and infix-prefix expressions.', 1, true),
  makeTopic('ds-sub-array', 'subj-ds', 'ds-ch-linear', 'Array', 'Core GATE CSE concepts and historical examination questions for Array.', 1, true),
  makeTopic('ds-sub-linked-list', 'subj-ds', 'ds-ch-linear', 'Linked List', 'Core GATE CSE concepts and historical examination questions for Linked List.', 2, true),
  makeTopic('ds-sub-stack', 'subj-ds', 'ds-ch-linear', 'Stack', 'Core GATE CSE concepts and historical examination questions for Stack.', 3, true),
  makeTopic('ds-sub-queue', 'subj-ds', 'ds-ch-linear', 'Queue', 'Core GATE CSE concepts and historical examination questions for Queue.', 4, true),
  makeTopic('ds-sub-infix-prefix', 'subj-ds', 'ds-ch-linear', 'Infix Prefix', 'Core GATE CSE concepts and historical examination questions for Infix Prefix.', 5, false),
  makeTopic('ds-sub-abstract-data-type', 'subj-ds', 'ds-ch-linear', 'Abstract Data Type', 'Core GATE CSE concepts and historical examination questions for Abstract Data Type.', 6, false),

  // --- Chapter 2: Trees & Binary Search Trees (BST) ---
  makeTopic('ds-ch-tree', 'subj-ds', null, 'Trees & Binary Search Trees (BST)', 'Binary trees, BST insertions/deletions, AVL self-balancing rotations, and tree traversals.', 2, true),
  makeTopic('ds-sub-binary-tree', 'subj-ds', 'ds-ch-tree', 'Binary Tree', 'Core GATE CSE concepts and historical examination questions for Binary Tree.', 1, true),
  makeTopic('ds-sub-binary-search-tree', 'subj-ds', 'ds-ch-tree', 'Binary Search Tree', 'Core GATE CSE concepts and historical examination questions for Binary Search Tree.', 2, true),
  makeTopic('ds-sub-avl-tree', 'subj-ds', 'ds-ch-tree', 'AVL Tree', 'Core GATE CSE concepts and historical examination questions for AVL Tree.', 3, false),
  makeTopic('ds-sub-tree', 'subj-ds', 'ds-ch-tree', 'Tree', 'Core GATE CSE concepts and historical examination questions for Tree.', 4, true),
  makeTopic('ds-sub-tree-traversal', 'subj-ds', 'ds-ch-tree', 'Tree Traversal', 'Core GATE CSE concepts and historical examination questions for Tree Traversal.', 5, false),

  // --- Chapter 3: Priority Queues & Binary Heaps ---
  makeTopic('ds-ch-heap', 'subj-ds', null, 'Priority Queues & Binary Heaps', 'Binary heaps, priority queues, heap operations, and applications.', 3, true),
  makeTopic('ds-sub-binary-heap', 'subj-ds', 'ds-ch-heap', 'Binary Heap', 'Core GATE CSE concepts and historical examination questions for Binary Heap.', 1, true),
  makeTopic('ds-sub-priority-queue', 'subj-ds', 'ds-ch-heap', 'Priority Queue', 'Core GATE CSE concepts and historical examination questions for Priority Queue.', 2, false),

  // --- Chapter 4: Advanced & Applied Data Structures ---
  makeTopic('ds-ch-misc', 'subj-ds', null, 'Advanced & Applied Data Structures', 'Hashing, variable scope, time complexity, and data structure applications.', 4, true),
  makeTopic('ds-sub-data-structures', 'subj-ds', 'ds-ch-misc', 'Data Structures', 'Core GATE CSE concepts and historical examination questions for Data Structures.', 1, false),
  makeTopic('ds-sub-uniform-hashing', 'subj-ds', 'ds-ch-misc', 'Uniform Hashing', 'Core GATE CSE concepts and historical examination questions for Uniform Hashing.', 2, false),
  makeTopic('ds-sub-variable-scope', 'subj-ds', 'ds-ch-misc', 'Variable Scope', 'Core GATE CSE concepts and historical examination questions for Variable Scope.', 3, false),
  makeTopic('ds-sub-functions', 'subj-ds', 'ds-ch-misc', 'Functions', 'Core GATE CSE concepts and historical examination questions for Functions.', 4, false),
  makeTopic('ds-sub-time-complexity', 'subj-ds', 'ds-ch-misc', 'Time Complexity', 'Core GATE CSE concepts and historical examination questions for Time Complexity.', 5, false),
  makeTopic('ds-sub-output', 'subj-ds', 'ds-ch-misc', 'Output', 'Core GATE CSE concepts and historical examination questions for Output.', 6, false),
  makeTopic('ds-sub-viable-prefix', 'subj-ds', 'ds-ch-misc', 'Viable Prefix', 'Core GATE CSE concepts and historical examination questions for Viable Prefix.', 7, false),

  // =========================================================================
  // C-PROGRAMMING (subj-prog)
  // =========================================================================
  // --- Chapter 1: Pointers & Dynamic Memory ---
  makeTopic('pr-ch-ptr', 'subj-prog', null, 'Pointers & Dynamic Memory', 'Pointers, pointer arithmetic, arrays of pointers, double pointers, malloc/free, and aliasing.', 1, true),
  makeTopic('pr-sub-pointers', 'subj-prog', 'pr-ch-ptr', 'Pointers', 'Core GATE CSE concepts and historical examination questions for Pointers.', 1, true),
  makeTopic('pr-sub-aliasing', 'subj-prog', 'pr-ch-ptr', 'Aliasing', 'Core GATE CSE concepts and historical examination questions for Aliasing.', 2, false),
  makeTopic('pr-sub-variable-binding', 'subj-prog', 'pr-ch-ptr', 'Variable Binding', 'Core GATE CSE concepts and historical examination questions for Variable Binding.', 3, false),

  // --- Chapter 2: Functions & Recursion ---
  makeTopic('pr-ch-func', 'subj-prog', null, 'Functions & Recursion', 'Function prototypes, call-by-value vs call-by-reference, recursion stack tracing, and static variables.', 2, true),
  makeTopic('pr-sub-recursion', 'subj-prog', 'pr-ch-func', 'Recursion', 'Core GATE CSE concepts and historical examination questions for Recursion.', 1, false),
  makeTopic('pr-sub-functions', 'subj-prog', 'pr-ch-func', 'Functions', 'Core GATE CSE concepts and historical examination questions for Functions.', 2, false),
  makeTopic('pr-sub-variable-scope', 'subj-prog', 'pr-ch-func', 'Variable Scope', 'Core GATE CSE concepts and historical examination questions for Variable Scope.', 3, false),

  // --- Chapter 3: Control Structures & Types ---
  makeTopic('pr-ch-ctrl', 'subj-prog', null, 'Control Structures & Types', 'Operators precedence, loops, switch-case, arrays, strings, structs, and unions.', 3, true),
  makeTopic('pr-sub-control-structures', 'subj-prog', 'pr-ch-ctrl', 'Control Structures', 'Core GATE CSE concepts and historical examination questions for Control Structures.', 1, false),
  makeTopic('pr-sub-arrays-and-strings', 'subj-prog', 'pr-ch-ctrl', 'Arrays and Strings', 'Core GATE CSE concepts and historical examination questions for Arrays and Strings.', 2, false),
  makeTopic('pr-sub-operators-and-expressions', 'subj-prog', 'pr-ch-ctrl', 'Operators and Expressions', 'Core GATE CSE concepts and historical examination questions for Operators and Expressions.', 3, false),
  makeTopic('pr-sub-structures-and-unions', 'subj-prog', 'pr-ch-ctrl', 'Structures and Unions', 'Core GATE CSE concepts and historical examination questions for Structures and Unions.', 4, false),
  makeTopic('pr-sub-switch-case', 'subj-prog', 'pr-ch-ctrl', 'Switch Case', 'Core GATE CSE concepts and historical examination questions for Switch Case.', 5, false),
  makeTopic('pr-sub-type-checking', 'subj-prog', 'pr-ch-ctrl', 'Type Checking', 'Core GATE CSE concepts and historical examination questions for Type Checking.', 6, false),
  makeTopic('pr-sub-programming-constructs', 'subj-prog', 'pr-ch-ctrl', 'Programming Constructs', 'Core GATE CSE concepts and historical examination questions for Programming Constructs.', 7, false),
  makeTopic('pr-sub-goto', 'subj-prog', 'pr-ch-ctrl', 'Goto', 'Core GATE CSE concepts and historical examination questions for Goto.', 8, false),
  makeTopic('pr-sub-closure-property', 'subj-prog', 'pr-ch-ctrl', 'Closure Property', 'Core GATE CSE concepts and historical examination questions for Closure Property.', 9, false),
  makeTopic('pr-sub-context-free-grammar', 'subj-prog', 'pr-ch-ctrl', 'Context Free Grammar', 'Core GATE CSE concepts and historical examination questions for Context Free Grammar.', 10, false),
  makeTopic('pr-sub-loop-invariants', 'subj-prog', 'pr-ch-ctrl', 'Loop Invariants', 'Core GATE CSE concepts and historical examination questions for Loop Invariants.', 11, false),
  makeTopic('pr-sub-output', 'subj-prog', 'pr-ch-ctrl', 'Output', 'Core GATE CSE concepts and historical examination questions for Output.', 12, false),
  makeTopic('pr-sub-programming-in-c', 'subj-prog', 'pr-ch-ctrl', 'Programming In C', 'Core GATE CSE concepts and historical examination questions for Programming In C.', 13, true),
  makeTopic('pr-sub-programming-paradigms', 'subj-prog', 'pr-ch-ctrl', 'Programming Paradigms', 'Core GATE CSE concepts and historical examination questions for Programming Paradigms.', 14, false),
  makeTopic('pr-sub-strings', 'subj-prog', 'pr-ch-ctrl', 'Strings', 'Core GATE CSE concepts and historical examination questions for Strings.', 15, false),
  makeTopic('pr-sub-structure', 'subj-prog', 'pr-ch-ctrl', 'Structure', 'Core GATE CSE concepts and historical examination questions for Structure.', 16, false),
  makeTopic('pr-sub-union', 'subj-prog', 'pr-ch-ctrl', 'Union', 'Core GATE CSE concepts and historical examination questions for Union.', 17, false),

  // =========================================================================
  // THEORY OF COMPUTATION (subj-toc)
  // =========================================================================
  // --- Chapter 1: Finite Automata & Regular Languages ---
  makeTopic('toc-ch-reg', 'subj-toc', null, 'Finite Automata & Regular Languages', 'DFA, NFA, regex, state minimization, pumping lemma, and regular grammar equivalence.', 1, true),
  makeTopic('toc-sub-finite-automata', 'subj-toc', 'toc-ch-reg', 'Finite Automata', 'Core GATE CSE concepts and historical examination questions for Finite Automata.', 1, true),
  makeTopic('toc-sub-regular-language', 'subj-toc', 'toc-ch-reg', 'Regular Language', 'Core GATE CSE concepts and historical examination questions for Regular Language.', 2, true),
  makeTopic('toc-sub-regular-expression', 'subj-toc', 'toc-ch-reg', 'Regular Expression', 'Core GATE CSE concepts and historical examination questions for Regular Expression.', 3, true),
  makeTopic('toc-sub-minimal-state-automata', 'subj-toc', 'toc-ch-reg', 'Minimal State Automata', 'Core GATE CSE concepts and historical examination questions for Minimal State Automata.', 4, true),
  makeTopic('toc-sub-non-determinism', 'subj-toc', 'toc-ch-reg', 'Non Determinism', 'Core GATE CSE concepts and historical examination questions for Non Determinism.', 5, false),
  makeTopic('toc-sub-number-of-states', 'subj-toc', 'toc-ch-reg', 'Number of States', 'Core GATE CSE concepts and historical examination questions for Number of States.', 6, false),
  makeTopic('toc-sub-regular-grammar', 'subj-toc', 'toc-ch-reg', 'Regular Grammar', 'Core GATE CSE concepts and historical examination questions for Regular Grammar.', 7, false),
  makeTopic('toc-sub-pumping-lemma', 'subj-toc', 'toc-ch-reg', 'Pumping Lemma', 'Core GATE CSE concepts and historical examination questions for Pumping Lemma.', 8, false),
  makeTopic('toc-sub-finite-state-machines', 'subj-toc', 'toc-ch-reg', 'Finite State Machines', 'Core GATE CSE concepts and historical examination questions for Finite State Machines.', 9, false),
  makeTopic('toc-sub-medium', 'subj-toc', 'toc-ch-reg', 'Medium', 'Core GATE CSE concepts and historical examination questions for Medium.', 10, false),

  // --- Chapter 2: Context-Free Languages & Pushdown Automata ---
  makeTopic('toc-ch-cfl', 'subj-toc', null, 'Context-Free Languages & Pushdown Automata', 'Context-free grammars, derivations, Chomsky Normal Form, deterministic and non-deterministic PDA.', 2, true),
  makeTopic('toc-sub-context-free-language', 'subj-toc', 'toc-ch-cfl', 'Context Free Language', 'Core GATE CSE concepts and historical examination questions for Context Free Language.', 1, true),
  makeTopic('toc-sub-pushdown-automata', 'subj-toc', 'toc-ch-cfl', 'Pushdown Automata', 'Core GATE CSE concepts and historical examination questions for Pushdown Automata.', 2, true),
  makeTopic('toc-sub-dpda', 'subj-toc', 'toc-ch-cfl', 'Dpda', 'Core GATE CSE concepts and historical examination questions for Dpda.', 3, false),

  // --- Chapter 3: Language Hierarchy & Closure Properties ---
  makeTopic('toc-ch-class', 'subj-toc', null, 'Language Hierarchy & Closure Properties', 'Chomsky hierarchy (Regular, DCFL, CFL, CSL, Recursive, REL), closure properties, and set countability.', 3, true),
  makeTopic('toc-sub-identify-class-language', 'subj-toc', 'toc-ch-class', 'Identify Class Language', 'Core GATE CSE concepts and historical examination questions for Identify Class Language.', 1, true),
  makeTopic('toc-sub-closure-property', 'subj-toc', 'toc-ch-class', 'Closure Property', 'Core GATE CSE concepts and historical examination questions for Closure Property.', 2, false),
  makeTopic('toc-sub-countable-uncountable-set', 'subj-toc', 'toc-ch-class', 'Countable Uncountable Set', 'Core GATE CSE concepts and historical examination questions for Countable Uncountable Set.', 3, false),

  // --- Chapter 4: Turing Machines, Decidability & Undecidability ---
  makeTopic('toc-ch-dec', 'subj-toc', null, 'Turing Machines, Decidability & Undecidability', 'Turing machines, recursive/RE languages, Halting problem, Rice theorem, and reductions.', 4, true),
  makeTopic('toc-sub-decidability', 'subj-toc', 'toc-ch-dec', 'Decidability', 'Core GATE CSE concepts and historical examination questions for Decidability.', 1, true),
  makeTopic('toc-sub-recursive-and-recursively-enumerable-languages', 'subj-toc', 'toc-ch-dec', 'Recursive and Recursively Enumerable Languages', 'Core GATE CSE concepts and historical examination questions for Recursive and Recursively Enumerable Languages.', 2, true),
  makeTopic('toc-sub-turing-machine', 'subj-toc', 'toc-ch-dec', 'Turing Machine', 'Core GATE CSE concepts and historical examination questions for Turing Machine.', 3, false),
  makeTopic('toc-sub-reduction', 'subj-toc', 'toc-ch-dec', 'Reduction', 'Core GATE CSE concepts and historical examination questions for Reduction.', 4, false),

  // =========================================================================
  // COMPILER DESIGN (subj-cd)
  // =========================================================================
  // --- Chapter 1: Lexical Analysis & Compilation Phases ---
  makeTopic('cd-ch-lex', 'subj-cd', null, 'Lexical Analysis & Compilation Phases', 'Phases of compiler, token generation, symbol tables, assemblers, linkers, and lexical analysis.', 1, true),
  makeTopic('cd-sub-compilation-phases', 'subj-cd', 'cd-ch-lex', 'Compilation Phases', 'Core GATE CSE concepts and historical examination questions for Compilation Phases.', 1, true),
  makeTopic('cd-sub-lexical-analysis', 'subj-cd', 'cd-ch-lex', 'Lexical Analysis', 'Core GATE CSE concepts and historical examination questions for Lexical Analysis.', 2, false),
  makeTopic('cd-sub-compiler-tokenization', 'subj-cd', 'cd-ch-lex', 'Compiler tokenization', 'Core GATE CSE concepts and historical examination questions for Compiler tokenization.', 3, false),
  makeTopic('cd-sub-symbol-table', 'subj-cd', 'cd-ch-lex', 'Symbol Table', 'Core GATE CSE concepts and historical examination questions for Symbol Table.', 4, false),
  makeTopic('cd-sub-assembler', 'subj-cd', 'cd-ch-lex', 'Assembler', 'Core GATE CSE concepts and historical examination questions for Assembler.', 5, false),
  makeTopic('cd-sub-linker', 'subj-cd', 'cd-ch-lex', 'Linker', 'Core GATE CSE concepts and historical examination questions for Linker.', 6, false),
  makeTopic('cd-sub-macros', 'subj-cd', 'cd-ch-lex', 'Macros', 'Core GATE CSE concepts and historical examination questions for Macros.', 7, false),

  // --- Chapter 2: Syntax Analysis & Parsing ---
  makeTopic('cd-ch-parse', 'subj-cd', null, 'Syntax Analysis & Parsing', 'Context-free grammars, derivations, LL(1), LR(0), SLR(1), LALR(1), CLR(1), and operator precedence.', 2, true),
  makeTopic('cd-sub-parsing', 'subj-cd', 'cd-ch-parse', 'Parsing', 'Core GATE CSE concepts and historical examination questions for Parsing.', 1, true),
  makeTopic('cd-sub-grammar', 'subj-cd', 'cd-ch-parse', 'Grammar', 'Core GATE CSE concepts and historical examination questions for Grammar.', 2, true),
  makeTopic('cd-sub-lr-parser', 'subj-cd', 'cd-ch-parse', 'LR Parser', 'Core GATE CSE concepts and historical examination questions for LR Parser.', 3, true),
  makeTopic('cd-sub-first-and-follow', 'subj-cd', 'cd-ch-parse', 'First and Follow', 'Core GATE CSE concepts and historical examination questions for First and Follow.', 4, false),
  makeTopic('cd-sub-ll-parser', 'subj-cd', 'cd-ch-parse', 'Ll Parser', 'Core GATE CSE concepts and historical examination questions for Ll Parser.', 5, false),
  makeTopic('cd-sub-operator-precedence', 'subj-cd', 'cd-ch-parse', 'Operator Precedence', 'Core GATE CSE concepts and historical examination questions for Operator Precedence.', 6, false),
  makeTopic('cd-sub-ambiguous-grammar', 'subj-cd', 'cd-ch-parse', 'Ambiguous Grammar', 'Core GATE CSE concepts and historical examination questions for Ambiguous Grammar.', 7, false),

  // --- Chapter 3: Syntax-Directed Translation & Intermediate Code ---
  makeTopic('cd-ch-sdt', 'subj-cd', null, 'Syntax-Directed Translation & Intermediate Code', 'S-attributed and L-attributed SDDs, 3AC quadruples/triples, DAGs, and backpatching.', 3, true),
  makeTopic('cd-sub-syntax-directed-translation', 'subj-cd', 'cd-ch-sdt', 'Syntax Directed Translation', 'Core GATE CSE concepts and historical examination questions for Syntax Directed Translation.', 1, true),
  makeTopic('cd-sub-intermediate-code', 'subj-cd', 'cd-ch-sdt', 'Intermediate Code', 'Core GATE CSE concepts and historical examination questions for Intermediate Code.', 2, true),
  makeTopic('cd-sub-expression-evaluation', 'subj-cd', 'cd-ch-sdt', 'Expression Evaluation', 'Core GATE CSE concepts and historical examination questions for Expression Evaluation.', 3, false),
  makeTopic('cd-sub-directed-acyclic-graph', 'subj-cd', 'cd-ch-sdt', 'Directed Acyclic Graph', 'Core GATE CSE concepts and historical examination questions for Directed Acyclic Graph.', 4, false),
  makeTopic('cd-sub-backpatching', 'subj-cd', 'cd-ch-sdt', 'Backpatching', 'Core GATE CSE concepts and historical examination questions for Backpatching.', 5, false),

  // --- Chapter 4: Runtime Environments & Parameter Passing ---
  makeTopic('cd-ch-runtime', 'subj-cd', null, 'Runtime Environments & Parameter Passing', 'Activation records, stack allocation, parameter passing mechanisms, and storage allocation.', 4, true),
  makeTopic('cd-sub-runtime-environment', 'subj-cd', 'cd-ch-runtime', 'Runtime Environment', 'Core GATE CSE concepts and historical examination questions for Runtime Environment.', 1, true),
  makeTopic('cd-sub-parameter-passing', 'subj-cd', 'cd-ch-runtime', 'Parameter Passing', 'Core GATE CSE concepts and historical examination questions for Parameter Passing.', 2, true),

  // --- Chapter 5: Code Optimization & Code Generation ---
  makeTopic('cd-ch-opt', 'subj-cd', null, 'Code Optimization & Code Generation', 'Basic blocks, flow graphs, loop optimizations, live variable analysis, and register allocation.', 5, true),
  makeTopic('cd-sub-code-optimization', 'subj-cd', 'cd-ch-opt', 'Code Optimization', 'Core GATE CSE concepts and historical examination questions for Code Optimization.', 1, false),
  makeTopic('cd-sub-basic-blocks', 'subj-cd', 'cd-ch-opt', 'Basic Blocks', 'Core GATE CSE concepts and historical examination questions for Basic Blocks.', 2, false),
  makeTopic('cd-sub-live-variable-analysis', 'subj-cd', 'cd-ch-opt', 'Live Variable Analysis', 'Core GATE CSE concepts and historical examination questions for Live Variable Analysis.', 3, false),
  makeTopic('cd-sub-register-allocation', 'subj-cd', 'cd-ch-opt', 'Register Allocation', 'Core GATE CSE concepts and historical examination questions for Register Allocation.', 4, false),
  makeTopic('cd-sub-static-single-assignment', 'subj-cd', 'cd-ch-opt', 'Static Single Assignment', 'Core GATE CSE concepts and historical examination questions for Static Single Assignment.', 5, false),

  // =========================================================================
  // OPERATING SYSTEMS (subj-os)
  // =========================================================================
  // --- Chapter 1: Processes, Threads & System Calls ---
  makeTopic('os-ch-proc', 'subj-os', null, 'Processes, Threads & System Calls', 'Process states, PCB, threads, fork/exec system calls, context switching, and IPC.', 1, true),
  makeTopic('os-sub-process', 'subj-os', 'os-ch-proc', 'Process', 'Core GATE CSE concepts and historical examination questions for Process.', 1, false),
  makeTopic('os-sub-threads', 'subj-os', 'os-ch-proc', 'Threads', 'Core GATE CSE concepts and historical examination questions for Threads.', 2, true),
  makeTopic('os-sub-fork-system-call', 'subj-os', 'os-ch-proc', 'Fork System Call', 'Core GATE CSE concepts and historical examination questions for Fork System Call.', 3, false),
  makeTopic('os-sub-context-switch', 'subj-os', 'os-ch-proc', 'Context Switch', 'Core GATE CSE concepts and historical examination questions for Context Switch.', 4, false),
  makeTopic('os-sub-inter-process-communication', 'subj-os', 'os-ch-proc', 'Inter Process Communication', 'Core GATE CSE concepts and historical examination questions for Inter Process Communication.', 5, false),
  makeTopic('os-sub-system-calls', 'subj-os', 'os-ch-proc', 'System Calls', 'Core GATE CSE concepts and historical examination questions for System Calls.', 6, false),
  makeTopic('os-sub-os-protection', 'subj-os', 'os-ch-proc', 'OS Protection', 'Core GATE CSE concepts and historical examination questions for OS Protection.', 7, false),

  // --- Chapter 2: CPU Scheduling ---
  makeTopic('os-ch-sched', 'subj-os', null, 'CPU Scheduling', 'Process scheduling algorithms, Gantt charts, turnaround/waiting time, Round Robin, and SRTF.', 2, true),
  makeTopic('os-sub-process-scheduling', 'subj-os', 'os-ch-sched', 'Process Scheduling', 'Core GATE CSE concepts and historical examination questions for Process Scheduling.', 1, true),
  makeTopic('os-sub-round-robin-scheduling', 'subj-os', 'os-ch-sched', 'Round Robin Scheduling', 'Core GATE CSE concepts and historical examination questions for Round Robin Scheduling.', 2, false),
  makeTopic('os-sub-srtf', 'subj-os', 'os-ch-sched', 'Srtf', 'Core GATE CSE concepts and historical examination questions for Srtf.', 3, false),

  // --- Chapter 3: Process Synchronization & Concurrency ---
  makeTopic('os-ch-sync', 'subj-os', null, 'Process Synchronization & Concurrency', 'Critical section problem, Peterson algorithm, semaphores, and precedence graphs.', 3, true),
  makeTopic('os-sub-process-synchronization', 'subj-os', 'os-ch-sync', 'Process Synchronization', 'Core GATE CSE concepts and historical examination questions for Process Synchronization.', 1, true),
  makeTopic('os-sub-semaphore', 'subj-os', 'os-ch-sync', 'Semaphore', 'Core GATE CSE concepts and historical examination questions for Semaphore.', 2, true),
  makeTopic('os-sub-precedence-graph', 'subj-os', 'os-ch-sync', 'Precedence Graph', 'Core GATE CSE concepts and historical examination questions for Precedence Graph.', 3, false),

  // --- Chapter 4: Deadlocks & Resource Allocation ---
  makeTopic('os-ch-deadlock', 'subj-os', null, 'Deadlocks & Resource Allocation', 'Deadlock conditions, Resource Allocation Graphs, Banker algorithm, and deadlock prevention.', 4, true),
  makeTopic('os-sub-resource-allocation', 'subj-os', 'os-ch-deadlock', 'Resource Allocation', 'Core GATE CSE concepts and historical examination questions for Resource Allocation.', 1, true),
  makeTopic('os-sub-bankers-algorithm', 'subj-os', 'os-ch-deadlock', 'Bankers Algorithm', 'Core GATE CSE concepts and historical examination questions for Bankers Algorithm.', 2, false),
  makeTopic('os-sub-deadlock-prevention-avoidance-detection', 'subj-os', 'os-ch-deadlock', 'Deadlock Prevention Avoidance Detection', 'Core GATE CSE concepts and historical examination questions for Deadlock Prevention Avoidance Detection.', 3, false),
  makeTopic('os-sub-resource-allocation-graph', 'subj-os', 'os-ch-deadlock', 'Resource Allocation Graph', 'Core GATE CSE concepts and historical examination questions for Resource Allocation Graph.', 4, false),

  // --- Chapter 5: Memory Management & Virtual Memory ---
  makeTopic('os-ch-mem', 'subj-os', null, 'Memory Management & Virtual Memory', 'Paging, multi-level page tables, TLB, page replacement, demand paging, and LRU.', 5, true),
  makeTopic('os-sub-memory-management', 'subj-os', 'os-ch-mem', 'Memory Management', 'Core GATE CSE concepts and historical examination questions for Memory Management.', 1, false),
  makeTopic('os-sub-page-replacement', 'subj-os', 'os-ch-mem', 'Page Replacement', 'Core GATE CSE concepts and historical examination questions for Page Replacement.', 2, true),
  makeTopic('os-sub-translation-lookaside-buffer', 'subj-os', 'os-ch-mem', 'Translation Lookaside Buffer', 'Core GATE CSE concepts and historical examination questions for Translation Lookaside Buffer.', 3, false),
  makeTopic('os-sub-demand-paging', 'subj-os', 'os-ch-mem', 'Demand Paging', 'Core GATE CSE concepts and historical examination questions for Demand Paging.', 4, false),
  makeTopic('os-sub-least-recently-used', 'subj-os', 'os-ch-mem', 'Least Recently Used', 'Core GATE CSE concepts and historical examination questions for Least Recently Used.', 5, false),
  makeTopic('os-sub-multilevel-paging', 'subj-os', 'os-ch-mem', 'Multilevel Paging', 'Core GATE CSE concepts and historical examination questions for Multilevel Paging.', 6, false),

  // --- Chapter 6: Storage, File Systems & Disk Management ---
  makeTopic('os-ch-storage', 'subj-os', null, 'Storage, File Systems & Disk Management', 'Disk geometry, disk scheduling algorithms, Unix Inodes, and file systems.', 6, true),
  makeTopic('os-sub-disk', 'subj-os', 'os-ch-storage', 'Disk', 'Core GATE CSE concepts and historical examination questions for Disk.', 1, true),
  makeTopic('os-sub-disk-scheduling', 'subj-os', 'os-ch-storage', 'Disk Scheduling', 'Core GATE CSE concepts and historical examination questions for Disk Scheduling.', 2, true),
  makeTopic('os-sub-file-system', 'subj-os', 'os-ch-storage', 'File System', 'Core GATE CSE concepts and historical examination questions for File System.', 3, false),

  // =========================================================================
  // DATABASE MANAGEMENT SYSTEM (subj-db)
  // =========================================================================
  // --- Chapter 1: SQL & Query Languages ---
  makeTopic('db-ch-sql', 'subj-db', null, 'SQL & Query Languages', 'SQL SELECT, WHERE, GROUP BY, HAVING, subqueries, natural/outer joins, and relational queries.', 1, true),
  makeTopic('db-sub-sql', 'subj-db', 'db-ch-sql', 'SQL', 'Core GATE CSE concepts and historical examination questions for SQL.', 1, true),
  makeTopic('db-sub-joins', 'subj-db', 'db-ch-sql', 'Joins', 'Core GATE CSE concepts and historical examination questions for Joins.', 2, false),
  makeTopic('db-sub-natural-join', 'subj-db', 'db-ch-sql', 'Natural Join', 'Core GATE CSE concepts and historical examination questions for Natural Join.', 3, false),
  makeTopic('db-sub-query', 'subj-db', 'db-ch-sql', 'Query', 'Core GATE CSE concepts and historical examination questions for Query.', 4, false),
  makeTopic('db-sub-safe-query', 'subj-db', 'db-ch-sql', 'Safe Query', 'Core GATE CSE concepts and historical examination questions for Safe Query.', 5, false),

  // --- Chapter 2: Relational Database Design & Normalization ---
  makeTopic('db-ch-norm', 'subj-db', null, 'Relational Database Design & Normalization', 'Functional dependencies, candidate keys, 1NF, 2NF, 3NF, BCNF, lossless join, and dependency preservation.', 2, true),
  makeTopic('db-sub-database-normalization', 'subj-db', 'db-ch-norm', 'Database Normalization', 'Core GATE CSE concepts and historical examination questions for Database Normalization.', 1, true),
  makeTopic('db-sub-candidate-key', 'subj-db', 'db-ch-norm', 'Candidate Key', 'Core GATE CSE concepts and historical examination questions for Candidate Key.', 2, false),
  makeTopic('db-sub-referential-integrity', 'subj-db', 'db-ch-norm', 'Referential Integrity', 'Core GATE CSE concepts and historical examination questions for Referential Integrity.', 3, false),
  makeTopic('db-sub-functional-dependency', 'subj-db', 'db-ch-norm', 'Functional Dependency', 'Core GATE CSE concepts and historical examination questions for Functional Dependency.', 4, false),
  makeTopic('db-sub-decomposition', 'subj-db', 'db-ch-norm', 'Decomposition', 'Core GATE CSE concepts and historical examination questions for Decomposition.', 5, false),
  makeTopic('db-sub-multivalued-dependency-4nf', 'subj-db', 'db-ch-norm', 'Multivalued Dependency 4nf', 'Core GATE CSE concepts and historical examination questions for Multivalued Dependency 4nf.', 6, false),
  makeTopic('db-sub-normal-forms', 'subj-db', 'db-ch-norm', 'Normal Forms', 'Core GATE CSE concepts and historical examination questions for Normal Forms.', 7, false),
  makeTopic('db-sub-super-key', 'subj-db', 'db-ch-norm', 'Super Key', 'Core GATE CSE concepts and historical examination questions for Super Key.', 8, false),
  makeTopic('db-sub-database-design', 'subj-db', 'db-ch-norm', 'Database Design', 'Core GATE CSE concepts and historical examination questions for Database Design.', 9, false),
  makeTopic('db-sub-database-schema', 'subj-db', 'db-ch-norm', 'Database Schema', 'Core GATE CSE concepts and historical examination questions for Database Schema.', 10, false),

  // --- Chapter 3: Relational Model & Relational Algebra ---
  makeTopic('db-ch-rel-alg', 'subj-db', null, 'Relational Model & Relational Algebra', 'Relational model, selection, projection, Cartesian product, division, and TRC/DRC.', 3, true),
  makeTopic('db-sub-relational-algebra', 'subj-db', 'db-ch-rel-alg', 'Relational Algebra', 'Core GATE CSE concepts and historical examination questions for Relational Algebra.', 1, true),
  makeTopic('db-sub-relational-calculus', 'subj-db', 'db-ch-rel-alg', 'Relational Calculus', 'Core GATE CSE concepts and historical examination questions for Relational Calculus.', 2, true),
  makeTopic('db-sub-tuple-relational-calculus', 'subj-db', 'db-ch-rel-alg', 'Tuple Relational Calculus', 'Core GATE CSE concepts and historical examination questions for Tuple Relational Calculus.', 3, false),
  makeTopic('db-sub-relational-model', 'subj-db', 'db-ch-rel-alg', 'Relational Model', 'Core GATE CSE concepts and historical examination questions for Relational Model.', 4, false),

  // --- Chapter 4: Transactions & Concurrency Control ---
  makeTopic('db-ch-trans', 'subj-db', null, 'Transactions & Concurrency Control', 'ACID properties, serializability, conflict serializability, 2PL, and timestamp ordering.', 4, true),
  makeTopic('db-sub-transaction-and-concurrency', 'subj-db', 'db-ch-trans', 'Transaction and Concurrency', 'Core GATE CSE concepts and historical examination questions for Transaction and Concurrency.', 1, true),
  makeTopic('db-sub-conflict-serializable', 'subj-db', 'db-ch-trans', 'Conflict Serializable', 'Core GATE CSE concepts and historical examination questions for Conflict Serializable.', 2, true),
  makeTopic('db-sub-two-phase-locking-protocol', 'subj-db', 'db-ch-trans', 'Two Phase Locking Protocol', 'Core GATE CSE concepts and historical examination questions for Two Phase Locking Protocol.', 3, false),
  makeTopic('db-sub-timestamp-ordering', 'subj-db', 'db-ch-trans', 'Timestamp Ordering', 'Core GATE CSE concepts and historical examination questions for Timestamp Ordering.', 4, false),

  // --- Chapter 5: Storage, Indexing & B/B+ Trees ---
  makeTopic('db-ch-index', 'subj-db', null, 'Storage, Indexing & B/B+ Trees', 'Primary/secondary/clustering indices, B-Trees, B+ Trees order, node splitting, and block access.', 5, true),
  makeTopic('db-sub-b-tree', 'subj-db', 'db-ch-index', 'B Tree', 'Core GATE CSE concepts and historical examination questions for B Tree.', 1, true),
  makeTopic('db-sub-indexing', 'subj-db', 'db-ch-index', 'Indexing', 'Core GATE CSE concepts and historical examination questions for Indexing.', 2, true),

  // --- Chapter 6: ER Model & Conceptual Design ---
  makeTopic('db-ch-er', 'subj-db', null, 'ER Model & Conceptual Design', 'Entity-Relationship diagrams, entity sets, weak entities, relationships, and table conversion.', 6, true),
  makeTopic('db-sub-er-diagram', 'subj-db', 'db-ch-er', 'ER Diagram', 'Core GATE CSE concepts and historical examination questions for ER Diagram.', 1, true),

  // =========================================================================
  // COMPUTER ORGANISATION & ARCHITECTURE (subj-coa)
  // =========================================================================
  // --- Chapter 1: Memory Hierarchy & Cache Organisation ---
  makeTopic('coa-ch-mem-hier', 'subj-coa', null, 'Memory Hierarchy & Cache Organisation', 'Direct, Set-Associative, Fully Associative cache mapping, AMAT, hit ratio, DRAM, and virtual memory.', 1, true),
  makeTopic('coa-sub-cache-memory', 'subj-coa', 'coa-ch-mem-hier', 'Cache Memory', 'Core GATE CSE concepts and historical examination questions for Cache Memory.', 1, true),
  makeTopic('coa-sub-virtual-memory', 'subj-coa', 'coa-ch-mem-hier', 'Virtual Memory', 'Core GATE CSE concepts and historical examination questions for Virtual Memory.', 2, true),
  makeTopic('coa-sub-memory-interfacing', 'subj-coa', 'coa-ch-mem-hier', 'Memory Interfacing', 'Core GATE CSE concepts and historical examination questions for Memory Interfacing.', 3, true),
  makeTopic('coa-sub-direct-mapping', 'subj-coa', 'coa-ch-mem-hier', 'Direct Mapping', 'Core GATE CSE concepts and historical examination questions for Direct Mapping.', 4, false),
  makeTopic('coa-sub-average-memory-access-time', 'subj-coa', 'coa-ch-mem-hier', 'Average Memory Access Time', 'Core GATE CSE concepts and historical examination questions for Average Memory Access Time.', 5, false),
  makeTopic('coa-sub-runtime-environment', 'subj-coa', 'coa-ch-mem-hier', 'Runtime Environment', 'Core GATE CSE concepts and historical examination questions for Runtime Environment.', 6, false),
  makeTopic('coa-sub-conflict-misses', 'subj-coa', 'coa-ch-mem-hier', 'Conflict Misses', 'Core GATE CSE concepts and historical examination questions for Conflict Misses.', 7, false),
  makeTopic('coa-sub-dram', 'subj-coa', 'coa-ch-mem-hier', 'DRAM', 'Core GATE CSE concepts and historical examination questions for DRAM.', 8, false),

  // --- Chapter 2: Instruction Pipelining & Hazards ---
  makeTopic('coa-ch-pipe', 'subj-coa', null, 'Instruction Pipelining & Hazards', 'Pipeline stages, throughput, speedup, structural, data, and branch hazards.', 2, true),
  makeTopic('coa-sub-pipelining', 'subj-coa', 'coa-ch-pipe', 'Pipelining', 'Core GATE CSE concepts and historical examination questions for Pipelining.', 1, true),
  makeTopic('coa-sub-speedup', 'subj-coa', 'coa-ch-pipe', 'Speedup', 'Core GATE CSE concepts and historical examination questions for Speedup.', 2, false),
  makeTopic('coa-sub-data-dependency', 'subj-coa', 'coa-ch-pipe', 'Data Dependency', 'Core GATE CSE concepts and historical examination questions for Data Dependency.', 3, false),
  makeTopic('coa-sub-data-hazards', 'subj-coa', 'coa-ch-pipe', 'Data Hazards', 'Core GATE CSE concepts and historical examination questions for Data Hazards.', 4, false),
  makeTopic('coa-sub-hazards', 'subj-coa', 'coa-ch-pipe', 'Hazards', 'Core GATE CSE concepts and historical examination questions for Hazards.', 5, false),
  makeTopic('coa-sub-stall', 'subj-coa', 'coa-ch-pipe', 'Stall', 'Core GATE CSE concepts and historical examination questions for Stall.', 6, false),

  // --- Chapter 3: Machine Instructions & Addressing Modes ---
  makeTopic('coa-ch-isa', 'subj-coa', null, 'Machine Instructions & Addressing Modes', 'Instruction formats, opcode expansion, addressing modes, instruction execution, and CISC/RISC.', 3, true),
  makeTopic('coa-sub-machine-instruction', 'subj-coa', 'coa-ch-isa', 'Machine Instruction', 'Core GATE CSE concepts and historical examination questions for Machine Instruction.', 1, true),
  makeTopic('coa-sub-addressing-modes', 'subj-coa', 'coa-ch-isa', 'Addressing Modes', 'Core GATE CSE concepts and historical examination questions for Addressing Modes.', 2, true),
  makeTopic('coa-sub-instruction-format', 'subj-coa', 'coa-ch-isa', 'Instruction Format', 'Core GATE CSE concepts and historical examination questions for Instruction Format.', 3, true),
  makeTopic('coa-sub-instruction-execution', 'subj-coa', 'coa-ch-isa', 'Instruction Execution', 'Core GATE CSE concepts and historical examination questions for Instruction Execution.', 4, false),
  makeTopic('coa-sub-cisc-risc-architecture', 'subj-coa', 'coa-ch-isa', 'CISC RISC Architecture', 'Core GATE CSE concepts and historical examination questions for CISC RISC Architecture.', 5, false),
  makeTopic('coa-sub-instruction-set-architecture', 'subj-coa', 'coa-ch-isa', 'Instruction Set Architecture', 'Core GATE CSE concepts and historical examination questions for Instruction Set Architecture.', 6, false),

  // --- Chapter 4: I/O Organization & Interfacing ---
  makeTopic('coa-ch-io', 'subj-coa', null, 'I/O Organization & Interfacing', 'Interrupts, I/O handling, DMA controller, memory-mapped I/O, and hardware interfaces.', 4, true),
  makeTopic('coa-sub-interrupts', 'subj-coa', 'coa-ch-io', 'Interrupts', 'Core GATE CSE concepts and historical examination questions for Interrupts.', 1, true),
  makeTopic('coa-sub-io-handling', 'subj-coa', 'coa-ch-io', 'IO Handling', 'Core GATE CSE concepts and historical examination questions for IO Handling.', 2, true),
  makeTopic('coa-sub-dma', 'subj-coa', 'coa-ch-io', 'DMA', 'Core GATE CSE concepts and historical examination questions for DMA.', 3, false),
  makeTopic('coa-sub-application-layer-protocols', 'subj-coa', 'coa-ch-io', 'Application Layer Protocols', 'Core GATE CSE concepts and historical examination questions for Application Layer Protocols.', 4, false),
  makeTopic('coa-sub-arp', 'subj-coa', 'coa-ch-io', 'Arp', 'Core GATE CSE concepts and historical examination questions for Arp.', 5, false),
  makeTopic('coa-sub-bit-stuffing', 'subj-coa', 'coa-ch-io', 'Bit Stuffing', 'Core GATE CSE concepts and historical examination questions for Bit Stuffing.', 6, false),
  makeTopic('coa-sub-bit-vector', 'subj-coa', 'coa-ch-io', 'Bit Vector', 'Core GATE CSE concepts and historical examination questions for Bit Vector.', 7, false),
  makeTopic('coa-sub-disk', 'subj-coa', 'coa-ch-io', 'Disk', 'Core GATE CSE concepts and historical examination questions for Disk.', 8, false),
  makeTopic('coa-sub-input-output', 'subj-coa', 'coa-ch-io', 'Input Output', 'Core GATE CSE concepts and historical examination questions for Input Output.', 9, false),
  makeTopic('coa-sub-linked-allocation', 'subj-coa', 'coa-ch-io', 'Linked Allocation', 'Core GATE CSE concepts and historical examination questions for Linked Allocation.', 10, false),

  // --- Chapter 5: Control Unit Design & Datapath ---
  makeTopic('coa-ch-cu', 'subj-coa', null, 'Control Unit Design & Datapath', 'Hardwired vs Microprogrammed control units, horizontal/vertical microinstructions, datapath ALU.', 5, true),
  makeTopic('coa-sub-microprogramming', 'subj-coa', 'coa-ch-cu', 'Microprogramming', 'Core GATE CSE concepts and historical examination questions for Microprogramming.', 1, true),
  makeTopic('coa-sub-data-path', 'subj-coa', 'coa-ch-cu', 'Data Path', 'Core GATE CSE concepts and historical examination questions for Data Path.', 2, false),
  makeTopic('coa-sub-control-unit', 'subj-coa', 'coa-ch-cu', 'Control Unit', 'Core GATE CSE concepts and historical examination questions for Control Unit.', 3, false),
  makeTopic('coa-sub-min-no-gates', 'subj-coa', 'coa-ch-cu', 'Min No Gates', 'Core GATE CSE concepts and historical examination questions for Min No Gates.', 4, false),
  makeTopic('coa-sub-min-products-of-sum-form', 'subj-coa', 'coa-ch-cu', 'Min Products of Sum Form', 'Core GATE CSE concepts and historical examination questions for Min Products of Sum Form.', 5, false),

  // =========================================================================
  // COMPUTER NETWORKS (subj-cn)
  // =========================================================================
  // --- Chapter 1: Transport Layer & Congestion Control ---
  makeTopic('cn-ch-trans', 'subj-cn', null, 'Transport Layer & Congestion Control', 'TCP, UDP, sliding window flow control, sequence numbers, congestion control, and token bucket.', 1, true),
  makeTopic('cn-sub-tcp-ip-and-flow-control', 'subj-cn', 'cn-ch-trans', 'TCP IP and Flow Control', 'Core GATE CSE concepts and historical examination questions for TCP IP and Flow Control.', 1, false),
  makeTopic('cn-sub-congestion-control', 'subj-cn', 'cn-ch-trans', 'Congestion Control', 'Core GATE CSE concepts and historical examination questions for Congestion Control.', 2, false),
  makeTopic('cn-sub-token-bucket', 'subj-cn', 'cn-ch-trans', 'Token Bucket', 'Core GATE CSE concepts and historical examination questions for Token Bucket.', 3, false),
  makeTopic('cn-sub-wrap-around-time', 'subj-cn', 'cn-ch-trans', 'Wrap Around Time', 'Core GATE CSE concepts and historical examination questions for Wrap Around Time.', 4, false),
  makeTopic('cn-sub-channel-utilization', 'subj-cn', 'cn-ch-trans', 'Channel Utilization', 'Core GATE CSE concepts and historical examination questions for Channel Utilization.', 5, false),
  makeTopic('cn-sub-probability', 'subj-cn', 'cn-ch-trans', 'Probability', 'Core GATE CSE concepts and historical examination questions for Probability.', 6, false),
  makeTopic('cn-sub-tcp', 'subj-cn', 'cn-ch-trans', 'TCP', 'Core GATE CSE concepts and historical examination questions for TCP.', 7, true),
  makeTopic('cn-sub-udp', 'subj-cn', 'cn-ch-trans', 'UDP', 'Core GATE CSE concepts and historical examination questions for UDP.', 8, false),
  makeTopic('cn-sub-sliding-window', 'subj-cn', 'cn-ch-trans', 'Sliding Window', 'Core GATE CSE concepts and historical examination questions for Sliding Window.', 9, true),
  makeTopic('cn-sub-sockets', 'subj-cn', 'cn-ch-trans', 'Sockets', 'Core GATE CSE concepts and historical examination questions for Sockets.', 10, false),

  // --- Chapter 2: Network Layer, IPv4 & Routing ---
  makeTopic('cn-ch-net', 'subj-cn', null, 'Network Layer, IPv4 & Routing', 'IPv4 header, CIDR subnetting, packet fragmentation, distance vector, link state, and ICMP.', 2, true),
  makeTopic('cn-sub-ipv4-and-subnetting', 'subj-cn', 'cn-ch-net', 'IPv4 and Subnetting', 'Core GATE CSE concepts and historical examination questions for IPv4 and Subnetting.', 1, false),
  makeTopic('cn-sub-routing-algorithms', 'subj-cn', 'cn-ch-net', 'Routing Algorithms', 'Core GATE CSE concepts and historical examination questions for Routing Algorithms.', 2, false),
  makeTopic('cn-sub-ip-packet', 'subj-cn', 'cn-ch-net', 'IP Packet', 'Core GATE CSE concepts and historical examination questions for IP Packet.', 3, true),
  makeTopic('cn-sub-subnetting', 'subj-cn', 'cn-ch-net', 'Subnetting', 'Core GATE CSE concepts and historical examination questions for Subnetting.', 4, true),
  makeTopic('cn-sub-distance-vector-routing', 'subj-cn', 'cn-ch-net', 'Distance Vector Routing', 'Core GATE CSE concepts and historical examination questions for Distance Vector Routing.', 5, false),
  makeTopic('cn-sub-icmp', 'subj-cn', 'cn-ch-net', 'Icmp', 'Core GATE CSE concepts and historical examination questions for Icmp.', 6, false),
  makeTopic('cn-sub-network-layer', 'subj-cn', 'cn-ch-net', 'Network Layer', 'Core GATE CSE concepts and historical examination questions for Network Layer.', 7, false),
  makeTopic('cn-sub-routing-protocols', 'subj-cn', 'cn-ch-net', 'Routing Protocols', 'Core GATE CSE concepts and historical examination questions for Routing Protocols.', 8, false),
  makeTopic('cn-sub-network-flow', 'subj-cn', 'cn-ch-net', 'Network Flow', 'Core GATE CSE concepts and historical examination questions for Network Flow.', 9, false),
  makeTopic('cn-sub-network-switching', 'subj-cn', 'cn-ch-net', 'Network Switching', 'Core GATE CSE concepts and historical examination questions for Network Switching.', 10, false),
  makeTopic('cn-sub-ip-addressing', 'subj-cn', 'cn-ch-net', 'IP Addressing', 'Core GATE CSE concepts and historical examination questions for IP Addressing.', 11, false),
  makeTopic('cn-sub-routing', 'subj-cn', 'cn-ch-net', 'Routing', 'Core GATE CSE concepts and historical examination questions for Routing.', 12, true),
  makeTopic('cn-sub-fragmentation', 'subj-cn', 'cn-ch-net', 'Fragmentation', 'Core GATE CSE concepts and historical examination questions for Fragmentation.', 13, false),

  // --- Chapter 3: Data Link Layer & MAC Protocols ---
  makeTopic('cn-ch-dl', 'subj-cn', null, 'Data Link Layer & MAC Protocols', 'Framing, byte/bit stuffing, CRC, Hamming codes, Stop-and-Wait, CSMA/CD, and Ethernet.', 3, true),
  makeTopic('cn-sub-data-link-layer-and-framing', 'subj-cn', 'cn-ch-dl', 'Data Link Layer and Framing', 'Core GATE CSE concepts and historical examination questions for Data Link Layer and Framing.', 1, false),
  makeTopic('cn-sub-mac-protocols-and-csma-cd', 'subj-cn', 'cn-ch-dl', 'MAC Protocols and CSMA CD', 'Core GATE CSE concepts and historical examination questions for MAC Protocols and CSMA CD.', 2, false),
  makeTopic('cn-sub-hamming-code', 'subj-cn', 'cn-ch-dl', 'Hamming Code', 'Core GATE CSE concepts and historical examination questions for Hamming Code.', 3, false),
  makeTopic('cn-sub-crc-polynomial', 'subj-cn', 'cn-ch-dl', 'CRC Polynomial', 'Core GATE CSE concepts and historical examination questions for CRC Polynomial.', 4, false),
  makeTopic('cn-sub-stop-and-wait', 'subj-cn', 'cn-ch-dl', 'Stop and Wait', 'Core GATE CSE concepts and historical examination questions for Stop and Wait.', 5, false),
  makeTopic('cn-sub-bit-stuffing', 'subj-cn', 'cn-ch-dl', 'Bit Stuffing', 'Core GATE CSE concepts and historical examination questions for Bit Stuffing.', 6, false),
  makeTopic('cn-sub-pure-aloha', 'subj-cn', 'cn-ch-dl', 'Pure Aloha', 'Core GATE CSE concepts and historical examination questions for Pure Aloha.', 7, false),
  makeTopic('cn-sub-slotted-aloha', 'subj-cn', 'cn-ch-dl', 'Slotted Aloha', 'Core GATE CSE concepts and historical examination questions for Slotted Aloha.', 8, false),
  makeTopic('cn-sub-bridges', 'subj-cn', 'cn-ch-dl', 'Bridges', 'Core GATE CSE concepts and historical examination questions for Bridges.', 9, false),
  makeTopic('cn-sub-lan-technologies', 'subj-cn', 'cn-ch-dl', 'LAN Technologies', 'Core GATE CSE concepts and historical examination questions for LAN Technologies.', 10, false),
  makeTopic('cn-sub-mac-protocol', 'subj-cn', 'cn-ch-dl', 'MAC Protocol', 'Core GATE CSE concepts and historical examination questions for MAC Protocol.', 11, false),
  makeTopic('cn-sub-data-communication', 'subj-cn', 'cn-ch-dl', 'Data Communication', 'Core GATE CSE concepts and historical examination questions for Data Communication.', 12, false),
  makeTopic('cn-sub-communication', 'subj-cn', 'cn-ch-dl', 'Communication', 'Core GATE CSE concepts and historical examination questions for Communication.', 13, false),
  makeTopic('cn-sub-csma-cd', 'subj-cn', 'cn-ch-dl', 'CSMA CD', 'Core GATE CSE concepts and historical examination questions for CSMA CD.', 14, false),
  makeTopic('cn-sub-ethernet', 'subj-cn', 'cn-ch-dl', 'Ethernet', 'Core GATE CSE concepts and historical examination questions for Ethernet.', 15, false),
  makeTopic('cn-sub-error-detection', 'subj-cn', 'cn-ch-dl', 'Error Detection', 'Core GATE CSE concepts and historical examination questions for Error Detection.', 16, false),

  // --- Chapter 4: Application Layer, OSI Model & Network Security ---
  makeTopic('cn-ch-app-sec', 'subj-cn', null, 'Application Layer, OSI Model & Network Security', 'HTTP, DNS, SMTP, FTP, OSI 7-layer model, cryptography, RSA, and digital signatures.', 4, true),
  makeTopic('cn-sub-application-layer-protocols', 'subj-cn', 'cn-ch-app-sec', 'Application Layer Protocols', 'Core GATE CSE concepts and historical examination questions for Application Layer Protocols.', 1, true),
  makeTopic('cn-sub-network-security', 'subj-cn', 'cn-ch-app-sec', 'Network Security', 'Core GATE CSE concepts and historical examination questions for Network Security.', 2, false),
  makeTopic('cn-sub-osi-model', 'subj-cn', 'cn-ch-app-sec', 'Osi Model', 'Core GATE CSE concepts and historical examination questions for Osi Model.', 3, false),
  makeTopic('cn-sub-network-protocols', 'subj-cn', 'cn-ch-app-sec', 'Network Protocols', 'Core GATE CSE concepts and historical examination questions for Network Protocols.', 4, true),
  makeTopic('cn-sub-armstrong-axioms', 'subj-cn', 'cn-ch-app-sec', 'Armstrong Axioms', 'Core GATE CSE concepts and historical examination questions for Armstrong Axioms.', 5, false),

  // =========================================================================
  // DIGITAL LOGIC (subj-dld)
  // =========================================================================
  // --- Chapter 1: Number Systems & Representations ---
  makeTopic('dl-ch-num', 'subj-dld', null, 'Number Systems & Representations', 'Binary, octal, hex, 1s/2s complement, IEEE 754 floating point, and Booth algorithm.', 1, true),
  makeTopic('dl-sub-number-representation', 'subj-dld', 'dl-ch-num', 'Number Representation', 'Core GATE CSE concepts and historical examination questions for Number Representation.', 1, true),
  makeTopic('dl-sub-ieee-representation', 'subj-dld', 'dl-ch-num', 'IEEE Representation', 'Core GATE CSE concepts and historical examination questions for IEEE Representation.', 2, true),
  makeTopic('dl-sub-floating-point-representation', 'subj-dld', 'dl-ch-num', 'Floating Point Representation', 'Core GATE CSE concepts and historical examination questions for Floating Point Representation.', 3, false),
  makeTopic('dl-sub-booths-algorithm', 'subj-dld', 'dl-ch-num', 'Booths Algorithm', 'Core GATE CSE concepts and historical examination questions for Booths Algorithm.', 4, false),
  makeTopic('dl-sub-fixed-point-representation', 'subj-dld', 'dl-ch-num', 'Fixed Point Representation', 'Core GATE CSE concepts and historical examination questions for Fixed Point Representation.', 5, false),
  makeTopic('dl-sub-number-system', 'subj-dld', 'dl-ch-num', 'Number System', 'Core GATE CSE concepts and historical examination questions for Number System.', 6, false),
  makeTopic('dl-sub-binary-codes', 'subj-dld', 'dl-ch-num', 'Binary Codes', 'Core GATE CSE concepts and historical examination questions for Binary Codes.', 7, false),
  makeTopic('dl-sub-little-endian-big-endian', 'subj-dld', 'dl-ch-num', 'Little Endian Big Endian', 'Core GATE CSE concepts and historical examination questions for Little Endian Big Endian.', 8, false),

  // --- Chapter 2: Boolean Algebra & Logic Gates ---
  makeTopic('dl-ch-bool', 'subj-dld', null, 'Boolean Algebra & Logic Gates', 'Boolean laws, SOP/POS minimization, K-Maps, prime implicants, functional completeness, and logic gates.', 2, true),
  makeTopic('dl-sub-boolean-algebra', 'subj-dld', 'dl-ch-bool', 'Boolean Algebra', 'Core GATE CSE concepts and historical examination questions for Boolean Algebra.', 1, true),
  makeTopic('dl-sub-k-map', 'subj-dld', 'dl-ch-bool', 'K Map', 'Core GATE CSE concepts and historical examination questions for K Map.', 2, true),
  makeTopic('dl-sub-min-sum-of-products-form', 'subj-dld', 'dl-ch-bool', 'Min Sum of Products Form', 'Core GATE CSE concepts and historical examination questions for Min Sum of Products Form.', 3, true),
  makeTopic('dl-sub-canonical-normal-form', 'subj-dld', 'dl-ch-bool', 'Canonical Normal Form', 'Core GATE CSE concepts and historical examination questions for Canonical Normal Form.', 4, true),
  makeTopic('dl-sub-functional-completeness', 'subj-dld', 'dl-ch-bool', 'Functional Completeness', 'Core GATE CSE concepts and historical examination questions for Functional Completeness.', 5, false),
  makeTopic('dl-sub-min-no-gates', 'subj-dld', 'dl-ch-bool', 'Min No Gates', 'Core GATE CSE concepts and historical examination questions for Min No Gates.', 6, false),
  makeTopic('dl-sub-prime-implicants', 'subj-dld', 'dl-ch-bool', 'Prime Implicants', 'Core GATE CSE concepts and historical examination questions for Prime Implicants.', 7, false),
  makeTopic('dl-sub-min-products-of-sum-form', 'subj-dld', 'dl-ch-bool', 'Min Products of Sum Form', 'Core GATE CSE concepts and historical examination questions for Min Products of Sum Form.', 8, false),
  makeTopic('dl-sub-conjunctive-normal-form', 'subj-dld', 'dl-ch-bool', 'Conjunctive Normal Form', 'Core GATE CSE concepts and historical examination questions for Conjunctive Normal Form.', 9, false),
  makeTopic('dl-sub-dual-function', 'subj-dld', 'dl-ch-bool', 'Dual Function', 'Core GATE CSE concepts and historical examination questions for Dual Function.', 10, false),
  makeTopic('dl-sub-static-hazard', 'subj-dld', 'dl-ch-bool', 'Static Hazard', 'Core GATE CSE concepts and historical examination questions for Static Hazard.', 11, false),

  // --- Chapter 3: Combinational Circuits ---
  makeTopic('dl-ch-circ', 'subj-dld', null, 'Combinational Circuits', 'Multiplexers, decoders, encoders, half/full adders, CLA, and ROMs.', 3, true),
  makeTopic('dl-sub-circuit-output', 'subj-dld', 'dl-ch-circ', 'Circuit Output', 'Core GATE CSE concepts and historical examination questions for Circuit Output.', 1, true),
  makeTopic('dl-sub-multiplexer', 'subj-dld', 'dl-ch-circ', 'Multiplexer', 'Core GATE CSE concepts and historical examination questions for Multiplexer.', 2, true),
  makeTopic('dl-sub-adder', 'subj-dld', 'dl-ch-circ', 'Adder', 'Core GATE CSE concepts and historical examination questions for Adder.', 3, false),
  makeTopic('dl-sub-digital-circuits', 'subj-dld', 'dl-ch-circ', 'Digital Circuits', 'Core GATE CSE concepts and historical examination questions for Digital Circuits.', 4, false),
  makeTopic('dl-sub-rom', 'subj-dld', 'dl-ch-circ', 'ROM', 'Core GATE CSE concepts and historical examination questions for ROM.', 5, false),
  makeTopic('dl-sub-decoder', 'subj-dld', 'dl-ch-circ', 'Decoder', 'Core GATE CSE concepts and historical examination questions for Decoder.', 6, false),
  makeTopic('dl-sub-combinational-circuit', 'subj-dld', 'dl-ch-circ', 'Combinational Circuit', 'Core GATE CSE concepts and historical examination questions for Combinational Circuit.', 7, false),
  makeTopic('dl-sub-array-multiplier', 'subj-dld', 'dl-ch-circ', 'Array Multiplier', 'Core GATE CSE concepts and historical examination questions for Array Multiplier.', 8, false),
  makeTopic('dl-sub-carry-generator', 'subj-dld', 'dl-ch-circ', 'Carry Generator', 'Core GATE CSE concepts and historical examination questions for Carry Generator.', 9, false),

  // --- Chapter 4: Sequential Circuits & Counters ---
  makeTopic('dl-ch-seq', 'subj-dld', null, 'Sequential Circuits & Counters', 'Flip-flops (SR, JK, D, T), synchronous/asynchronous counters, FSMs, and shift registers.', 4, true),
  makeTopic('dl-sub-digital-counter', 'subj-dld', 'dl-ch-seq', 'Digital Counter', 'Core GATE CSE concepts and historical examination questions for Digital Counter.', 1, true),
  makeTopic('dl-sub-flip-flop', 'subj-dld', 'dl-ch-seq', 'Flip Flop', 'Core GATE CSE concepts and historical examination questions for Flip Flop.', 2, false),
  makeTopic('dl-sub-finite-state-machines', 'subj-dld', 'dl-ch-seq', 'Finite State Machines', 'Core GATE CSE concepts and historical examination questions for Finite State Machines.', 3, false),
  makeTopic('dl-sub-synchronous-asynchronous-circuits', 'subj-dld', 'dl-ch-seq', 'Synchronous Asynchronous Circuits', 'Core GATE CSE concepts and historical examination questions for Synchronous Asynchronous Circuits.', 4, false),
  makeTopic('dl-sub-shift-registers', 'subj-dld', 'dl-ch-seq', 'Shift Registers', 'Core GATE CSE concepts and historical examination questions for Shift Registers.', 5, false),
  makeTopic('dl-sub-ripple-counter-operation', 'subj-dld', 'dl-ch-seq', 'Ripple Counter Operation', 'Core GATE CSE concepts and historical examination questions for Ripple Counter Operation.', 6, false),
  makeTopic('dl-sub-reduction', 'subj-dld', 'dl-ch-seq', 'Reduction', 'Core GATE CSE concepts and historical examination questions for Reduction.', 7, false),
  makeTopic('dl-sub-deadlock-prevention-avoidance-detection', 'subj-dld', 'dl-ch-seq', 'Deadlock Prevention Avoidance Detection', 'Core GATE CSE concepts and historical examination questions for Deadlock Prevention Avoidance Detection.', 8, false),
  makeTopic('dl-sub-demand-paging', 'subj-dld', 'dl-ch-seq', 'Demand Paging', 'Core GATE CSE concepts and historical examination questions for Demand Paging.', 9, false),
  makeTopic('dl-sub-bankers-algorithm', 'subj-dld', 'dl-ch-seq', 'Bankers Algorithm', 'Core GATE CSE concepts and historical examination questions for Bankers Algorithm.', 10, false),
  makeTopic('dl-sub-best-fit', 'subj-dld', 'dl-ch-seq', 'Best Fit', 'Core GATE CSE concepts and historical examination questions for Best Fit.', 11, false),
  makeTopic('dl-sub-context-switch', 'subj-dld', 'dl-ch-seq', 'Context Switch', 'Core GATE CSE concepts and historical examination questions for Context Switch.', 12, false),

  // =========================================================================
  // GENERAL APTITUDE (subj-ga)
  // =========================================================================
  // --- Chapter 1: Verbal Aptitude ---
  makeTopic("ga-ch-verbal", "subj-ga", null, "Verbal Aptitude", "Vocabulary, grammar, reading comprehension, sentence completion, synonyms, antonyms, and verbal reasoning.", 1, true),
  makeTopic("ga-sub-passage-reading", "subj-ga", "ga-ch-verbal", "Passage Reading", "Core GATE CSE concepts and historical examination questions for Passage Reading.", 1, true),
  makeTopic("ga-sub-most-appropriate-word", "subj-ga", "ga-ch-verbal", "Most Appropriate Word", "Core GATE CSE concepts and historical examination questions for Most Appropriate Word.", 2, true),
  makeTopic("ga-sub-verbal-reasoning", "subj-ga", "ga-ch-verbal", "Verbal Reasoning", "Core GATE CSE concepts and historical examination questions for Verbal Reasoning.", 3, true),
  makeTopic("ga-sub-word-pairs", "subj-ga", "ga-ch-verbal", "Word Pairs", "Core GATE CSE concepts and historical examination questions for Word Pairs.", 4, false),
  makeTopic("ga-sub-synonyms", "subj-ga", "ga-ch-verbal", "Synonyms", "Core GATE CSE concepts and historical examination questions for Synonyms.", 5, false),
  makeTopic("ga-sub-antonyms", "subj-ga", "ga-ch-verbal", "Antonyms", "Core GATE CSE concepts and historical examination questions for Antonyms.", 6, false),
  makeTopic("ga-sub-english-grammar", "subj-ga", "ga-ch-verbal", "English Grammar", "Core GATE CSE concepts and historical examination questions for English Grammar.", 7, false),
  makeTopic("ga-sub-phrase-meaning", "subj-ga", "ga-ch-verbal", "Phrase Meaning", "Core GATE CSE concepts and historical examination questions for Phrase Meaning.", 8, false),
  makeTopic("ga-sub-tenses", "subj-ga", "ga-ch-verbal", "Tenses", "Core GATE CSE concepts and historical examination questions for Tenses.", 9, false),
  makeTopic("ga-sub-word-meaning", "subj-ga", "ga-ch-verbal", "Word Meaning", "Core GATE CSE concepts and historical examination questions for Word Meaning.", 10, false),
  makeTopic("ga-sub-grammatical-error", "subj-ga", "ga-ch-verbal", "Grammatical Error", "Core GATE CSE concepts and historical examination questions for Grammatical Error.", 11, false),
  makeTopic("ga-sub-articles", "subj-ga", "ga-ch-verbal", "Articles", "Core GATE CSE concepts and historical examination questions for Articles.", 12, false),
  makeTopic("ga-sub-comparative-forms", "subj-ga", "ga-ch-verbal", "Comparative Forms", "Core GATE CSE concepts and historical examination questions for Comparative Forms.", 13, false),
  makeTopic("ga-sub-sentence-ordering", "subj-ga", "ga-ch-verbal", "Sentence Ordering", "Core GATE CSE concepts and historical examination questions for Sentence Ordering.", 14, false),
  makeTopic("ga-sub-incorrect-sentence-part", "subj-ga", "ga-ch-verbal", "Incorrect Sentence Part", "Core GATE CSE concepts and historical examination questions for Incorrect Sentence Part.", 15, false),
  makeTopic("ga-sub-narrative-sequencing", "subj-ga", "ga-ch-verbal", "Narrative Sequencing", "Core GATE CSE concepts and historical examination questions for Narrative Sequencing.", 16, false),
  makeTopic("ga-sub-prepositions", "subj-ga", "ga-ch-verbal", "Prepositions", "Core GATE CSE concepts and historical examination questions for Prepositions.", 17, false),

  // --- Chapter 2: Quantitative Aptitude ---
  makeTopic("ga-ch-quant", "subj-ga", null, "Quantitative Aptitude", "Arithmetic, elementary algebra, geometry, mensuration, percentages, profit-loss, time-work, and number systems.", 2, true),
  makeTopic("ga-sub-speed-time-distance", "subj-ga", "ga-ch-quant", "Speed Time Distance", "Core GATE CSE concepts and historical examination questions for Speed Time Distance.", 1, true),
  makeTopic("ga-sub-percentage", "subj-ga", "ga-ch-quant", "Percentage", "Core GATE CSE concepts and historical examination questions for Percentage.", 2, true),
  makeTopic("ga-sub-profit-loss", "subj-ga", "ga-ch-quant", "Profit Loss", "Core GATE CSE concepts and historical examination questions for Profit Loss.", 3, true),
  makeTopic("ga-sub-ratio-proportion", "subj-ga", "ga-ch-quant", "Ratio Proportion", "Core GATE CSE concepts and historical examination questions for Ratio Proportion.", 4, true),
  makeTopic("ga-sub-compound-interest", "subj-ga", "ga-ch-quant", "Compound Interest", "Core GATE CSE concepts and historical examination questions for Compound Interest.", 5, false),
  makeTopic("ga-sub-clock-time", "subj-ga", "ga-ch-quant", "Clock Time", "Core GATE CSE concepts and historical examination questions for Clock Time.", 6, false),
  makeTopic("ga-sub-mensuration", "subj-ga", "ga-ch-quant", "Mensuration", "Core GATE CSE concepts and historical examination questions for Mensuration.", 7, false),
  makeTopic("ga-sub-volume", "subj-ga", "ga-ch-quant", "Volume", "Core GATE CSE concepts and historical examination questions for Volume.", 8, false),
  makeTopic("ga-sub-circle", "subj-ga", "ga-ch-quant", "Circle", "Core GATE CSE concepts and historical examination questions for Circle.", 9, false),
  makeTopic("ga-sub-triangles", "subj-ga", "ga-ch-quant", "Triangles", "Core GATE CSE concepts and historical examination questions for Triangles.", 10, false),
  makeTopic("ga-sub-powers", "subj-ga", "ga-ch-quant", "Powers", "Core GATE CSE concepts and historical examination questions for Powers.", 11, false),
  makeTopic("ga-sub-polynomials", "subj-ga", "ga-ch-quant", "Polynomials", "Core GATE CSE concepts and historical examination questions for Polynomials.", 12, false),
  makeTopic("ga-sub-prime-numbers", "subj-ga", "ga-ch-quant", "Prime Numbers", "Core GATE CSE concepts and historical examination questions for Prime Numbers.", 13, false),
  makeTopic("ga-sub-number-theory", "subj-ga", "ga-ch-quant", "Number Theory", "Core GATE CSE concepts and historical examination questions for Number Theory.", 14, false),
  makeTopic("ga-sub-number-system", "subj-ga", "ga-ch-quant", "Number System", "Core GATE CSE concepts and historical examination questions for Number System.", 15, false),
  makeTopic("ga-sub-number-representation", "subj-ga", "ga-ch-quant", "Number Representation", "Core GATE CSE concepts and historical examination questions for Number Representation.", 16, false),
  makeTopic("ga-sub-number-series", "subj-ga", "ga-ch-quant", "Number Series", "Core GATE CSE concepts and historical examination questions for Number Series.", 17, false),
  makeTopic("ga-sub-sequence-series", "subj-ga", "ga-ch-quant", "Sequence Series", "Core GATE CSE concepts and historical examination questions for Sequence Series.", 18, false),
  makeTopic("ga-sub-permutation-and-combination", "subj-ga", "ga-ch-quant", "Permutation and Combination", "Core GATE CSE concepts and historical examination questions for Permutation and Combination.", 19, false),
  makeTopic("ga-sub-combinatory", "subj-ga", "ga-ch-quant", "Combinatory", "Core GATE CSE concepts and historical examination questions for Combinatory.", 20, false),
  makeTopic("ga-sub-quadratic-equations", "subj-ga", "ga-ch-quant", "Quadratic Equations", "Core GATE CSE concepts and historical examination questions for Quadratic Equations.", 21, false),
  makeTopic("ga-sub-multiplicity", "subj-ga", "ga-ch-quant", "Multiplicity", "Core GATE CSE concepts and historical examination questions for Multiplicity.", 22, false),
  makeTopic("ga-sub-cartesian-coordinates", "subj-ga", "ga-ch-quant", "Cartesian Coordinates", "Core GATE CSE concepts and historical examination questions for Cartesian Coordinates.", 23, false),
  makeTopic("ga-sub-work-time", "subj-ga", "ga-ch-quant", "Work Time", "Core GATE CSE concepts and historical examination questions for Work Time.", 24, false),
  makeTopic("ga-sub-average", "subj-ga", "ga-ch-quant", "Average", "Core GATE CSE concepts and historical examination questions for Average.", 25, false),
  makeTopic("ga-sub-age-relation", "subj-ga", "ga-ch-quant", "Age Relation", "Core GATE CSE concepts and historical examination questions for Age Relation.", 26, false),
  makeTopic("ga-sub-alligation-mixture", "subj-ga", "ga-ch-quant", "Alligation Mixture", "Core GATE CSE concepts and historical examination questions for Alligation Mixture.", 27, false),
  makeTopic("ga-sub-area", "subj-ga", "ga-ch-quant", "Area", "Core GATE CSE concepts and historical examination questions for Area.", 28, false),
  makeTopic("ga-sub-fractions", "subj-ga", "ga-ch-quant", "Fractions", "Core GATE CSE concepts and historical examination questions for Fractions.", 29, false),
  makeTopic("ga-sub-factors", "subj-ga", "ga-ch-quant", "Factors", "Core GATE CSE concepts and historical examination questions for Factors.", 30, false),
  makeTopic("ga-sub-logarithms", "subj-ga", "ga-ch-quant", "Logarithms", "Core GATE CSE concepts and historical examination questions for Logarithms.", 31, false),
  makeTopic("ga-sub-cost-market-price", "subj-ga", "ga-ch-quant", "Cost Market Price", "Core GATE CSE concepts and historical examination questions for Cost Market Price.", 32, false),
  makeTopic("ga-sub-arithmetic-series", "subj-ga", "ga-ch-quant", "Arithmetic Series", "Core GATE CSE concepts and historical examination questions for Arithmetic Series.", 33, false),
  makeTopic("ga-sub-functions", "subj-ga", "ga-ch-quant", "Functions", "Core GATE CSE concepts and historical examination questions for Functions.", 34, false),
  makeTopic("ga-sub-geometry", "subj-ga", "ga-ch-quant", "Geometry", "Core GATE CSE concepts and historical examination questions for Geometry.", 35, false),

  // --- Chapter 3: Analytical & Logical Reasoning ---
  makeTopic("ga-ch-analytical", "subj-ga", null, "Analytical & Logical Reasoning", "Deduction, induction, analogy, relations, seating arrangements, coding decoding, and data interpretation.", 3, true),
  makeTopic("ga-sub-logical-reasoning", "subj-ga", "ga-ch-analytical", "Logical Reasoning", "Core GATE CSE concepts and historical examination questions for Logical Reasoning.", 1, true),
  makeTopic("ga-sub-logical-inference", "subj-ga", "ga-ch-analytical", "Logical Inference", "Core GATE CSE concepts and historical examination questions for Logical Inference.", 2, true),
  makeTopic("ga-sub-coding-decoding", "subj-ga", "ga-ch-analytical", "Coding Decoding", "Core GATE CSE concepts and historical examination questions for Coding Decoding.", 3, true),
  makeTopic("ga-sub-analogy", "subj-ga", "ga-ch-analytical", "Analogy", "Core GATE CSE concepts and historical examination questions for Analogy.", 4, false),
  makeTopic("ga-sub-code-words", "subj-ga", "ga-ch-analytical", "Code Words", "Core GATE CSE concepts and historical examination questions for Code Words.", 5, false),
  makeTopic("ga-sub-odd-one", "subj-ga", "ga-ch-analytical", "Odd One", "Core GATE CSE concepts and historical examination questions for Odd One.", 6, false),
  makeTopic("ga-sub-family-relationship", "subj-ga", "ga-ch-analytical", "Family Relationship", "Core GATE CSE concepts and historical examination questions for Family Relationship.", 7, false),
  makeTopic("ga-sub-seating-arrangement", "subj-ga", "ga-ch-analytical", "Seating Arrangement", "Core GATE CSE concepts and historical examination questions for Seating Arrangement.", 8, false),
  makeTopic("ga-sub-round-table-arrangement", "subj-ga", "ga-ch-analytical", "Round Table Arrangement", "Core GATE CSE concepts and historical examination questions for Round Table Arrangement.", 9, false),
  makeTopic("ga-sub-direction-sense", "subj-ga", "ga-ch-analytical", "Direction Sense", "Core GATE CSE concepts and historical examination questions for Direction Sense.", 10, false),
  makeTopic("ga-sub-number-relations", "subj-ga", "ga-ch-analytical", "Number Relations", "Core GATE CSE concepts and historical examination questions for Number Relations.", 11, false),
  makeTopic("ga-sub-shortest-path", "subj-ga", "ga-ch-analytical", "Shortest Path", "Core GATE CSE concepts and historical examination questions for Shortest Path.", 12, false),
  makeTopic("ga-sub-statements-follow", "subj-ga", "ga-ch-analytical", "Statements Follow", "Core GATE CSE concepts and historical examination questions for Statements Follow.", 13, false),
  makeTopic("ga-sub-statement-sufficiency", "subj-ga", "ga-ch-analytical", "Statement Sufficiency", "Core GATE CSE concepts and historical examination questions for Statement Sufficiency.", 14, false),
  makeTopic("ga-sub-tables", "subj-ga", "ga-ch-analytical", "Tables", "Core GATE CSE concepts and historical examination questions for Tables.", 15, false),
  makeTopic("ga-sub-tabular-data", "subj-ga", "ga-ch-analytical", "Tabular Data", "Core GATE CSE concepts and historical examination questions for Tabular Data.", 16, false),
  makeTopic("ga-sub-pie-chart", "subj-ga", "ga-ch-analytical", "Pie Chart", "Core GATE CSE concepts and historical examination questions for Pie Chart.", 17, false),
  makeTopic("ga-sub-bar-graph", "subj-ga", "ga-ch-analytical", "Bar Graph", "Core GATE CSE concepts and historical examination questions for Bar Graph.", 18, false),
  makeTopic("ga-sub-line-graph", "subj-ga", "ga-ch-analytical", "Line Graph", "Core GATE CSE concepts and historical examination questions for Line Graph.", 19, false),
  makeTopic("ga-sub-data-interpretation", "subj-ga", "ga-ch-analytical", "Data Interpretation", "Core GATE CSE concepts and historical examination questions for Data Interpretation.", 20, false),
  makeTopic("ga-sub-venn-diagram", "subj-ga", "ga-ch-analytical", "Venn Diagram", "Core GATE CSE concepts and historical examination questions for Venn Diagram.", 21, false),
  makeTopic("ga-sub-graph-coloring", "subj-ga", "ga-ch-analytical", "Graph Coloring", "Core GATE CSE concepts and historical examination questions for Graph Coloring.", 22, false),

  // --- Chapter 4: Spatial Aptitude ---
  makeTopic("ga-ch-spatial", "subj-ga", null, "Spatial Aptitude", "Paper folding, 2D/3D transformations, pattern recognition, mirror images, cubes, and shape assembling.", 4, true),
  makeTopic("ga-sub-paper-folding", "subj-ga", "ga-ch-spatial", "Paper Folding", "Core GATE CSE concepts and historical examination questions for Paper Folding.", 1, false),
  makeTopic("ga-sub-patterns-in-two-dimensions", "subj-ga", "ga-ch-spatial", "Patterns In Two Dimensions", "Core GATE CSE concepts and historical examination questions for Patterns In Two Dimensions.", 2, false),
  makeTopic("ga-sub-image-rotation", "subj-ga", "ga-ch-spatial", "Image Rotation", "Core GATE CSE concepts and historical examination questions for Image Rotation.", 3, false),
  makeTopic("ga-sub-patterns-in-three-dimensions", "subj-ga", "ga-ch-spatial", "Patterns In Three Dimensions", "Core GATE CSE concepts and historical examination questions for Patterns In Three Dimensions.", 4, false),
  makeTopic("ga-sub-cubes", "subj-ga", "ga-ch-spatial", "Cubes", "Core GATE CSE concepts and historical examination questions for Cubes.", 5, false),
  makeTopic("ga-sub-d-structure", "subj-ga", "ga-ch-spatial", "d Structure", "Core GATE CSE concepts and historical examination questions for d Structure.", 6, false),
  makeTopic("ga-sub-assembling", "subj-ga", "ga-ch-spatial", "Assembling", "Core GATE CSE concepts and historical examination questions for Assembling.", 7, false),
  makeTopic("ga-sub-assembling-pieces", "subj-ga", "ga-ch-spatial", "Assembling Pieces", "Core GATE CSE concepts and historical examination questions for Assembling Pieces.", 8, false),
  makeTopic("ga-sub-mirror-image", "subj-ga", "ga-ch-spatial", "Mirror Image", "Core GATE CSE concepts and historical examination questions for Mirror Image.", 9, false),
  makeTopic("ga-sub-maps", "subj-ga", "ga-ch-spatial", "Maps", "Core GATE CSE concepts and historical examination questions for Maps.", 10, false),
  makeTopic("ga-sub-digital-image-processing", "subj-ga", "ga-ch-spatial", "Digital Image Processing", "Core GATE CSE concepts and historical examination questions for Digital Image Processing.", 11, false),

];

export const INITIAL_SCHEDULES: Schedule[] = [
  {
    id: 'sched-today',
    Schedule_Date: new Date().toISOString().split('T')[0],
    Schedule_Hours: 6,
    Schedule_Subjects: ['subj-os', 'subj-algo', 'subj-dm'],
    Schedule_Tag_Filters: ['Star'],
    Subject_Allocations: {
      'subj-os': 120,
      'subj-algo': 120,
      'subj-dm': 120,
    },
    Allocated_Topics: [
      {
        topic_id: 'os-sub-process-synchronization',
        subject_id: 'subj-os',
        topic_name: 'Process Synchronization',
        subject_name: 'Operating Systems',
        allocated_minutes: 60,
        completed: false,
      },
      {
        topic_id: 'alg-sub-dynamic-programming',
        subject_id: 'subj-algo',
        topic_name: 'Dynamic Programming',
        subject_name: 'Algorithms',
        allocated_minutes: 60,
        completed: false,
      },
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];
