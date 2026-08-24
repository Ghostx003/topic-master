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
  // 1. OPERATING SYSTEMS (subj-os)
  // =========================================================================
  // --- Chapter 1: Processes, Threads & System Calls ---
  makeTopic('os-ch-proc', 'subj-os', null, 'Processes, Threads & System Calls', 'Process states, PCB, user/kernel threads, fork/exec system calls, context switching, and IPC.', 1, true),
  makeTopic('os-sub-proc', 'subj-os', 'os-ch-proc', 'Process & Process States', '5-state process model (New, Ready, Running, Waiting, Terminated) and Process Control Block (PCB).', 1, true),
  makeTopic('os-9', 'subj-os', 'os-ch-proc', 'Threads', 'User-level threads vs Kernel-level threads, multithreading models, thread control blocks.', 2, true),
  makeTopic('os-sub-fork', 'subj-os', 'os-ch-proc', 'Fork System Call', 'fork() process creation tree calculations, return value 0/PID, parent-child processes.', 3, true),
  makeTopic('os-sub-context', 'subj-os', 'os-ch-proc', 'Context Switch', 'CPU register saving, state restoration, dispatcher latency, preemptive vs non-preemptive switching.', 4, true),
  makeTopic('os-sub-ipc', 'subj-os', 'os-ch-proc', 'Inter Process Communication', 'Shared memory architecture, message passing queues, socket communication, pipes.', 5, true),
  makeTopic('os-sub-syscall', 'subj-os', 'os-ch-proc', 'System Calls', 'System call interface, trap instructions, standard system calls exec(), wait(), exit().', 6, true),

  // --- Chapter 2: CPU Scheduling ---
  makeTopic('os-ch-sched', 'subj-os', null, 'CPU Scheduling', 'Scheduling algorithms FCFS, SJF, SRTF, Round Robin, priority scheduling, and multi-level queues.', 2, true),
  makeTopic('os-2', 'subj-os', 'os-ch-sched', 'Process Scheduling', 'CPU Scheduling algorithms, Gantt charts, turnaround time, waiting time, and response time.', 1, true),
  makeTopic('os-sub-fcfs', 'subj-os', 'os-2', 'First-Come First-Served (FCFS)', 'Non-preemptive scheduling order by arrival time, convoy effect, and average waiting time calculations.', 1, false),
  makeTopic('os-sub-sjf', 'subj-os', 'os-2', 'Shortest Job First (SJF & SRTF)', 'Non-preemptive SJF and Preemptive Shortest Remaining Time First (SRTF) optimal waiting time.', 2, false),
  makeTopic('os-sub-rr', 'subj-os', 'os-2', 'Round Robin Scheduling', 'Time quantum sizing, context switch overhead, queue management, turnaround and waiting time.', 3, false),
  makeTopic('os-sub-prio', 'subj-os', 'os-2', 'Priority Scheduling', 'Preemptive and non-preemptive priority assignments, starvation problems, and aging solutions.', 4, false),
  makeTopic('os-sub-mlfq', 'subj-os', 'os-2', 'Multi-Level Feedback Queue (MLFQ)', 'Multiple priority ready queues, dynamic priority adjustments, and I/O bound vs CPU bound processes.', 5, false),

  // --- Chapter 3: Process Synchronization ---
  makeTopic('os-ch-sync', 'subj-os', null, 'Process Synchronization', 'Critical section problem, Peterson algorithm, classical sync, semaphores, and precedence graphs.', 3, true),
  makeTopic('os-1', 'subj-os', 'os-ch-sync', 'Process Synchronization', 'Critical Section criteria (Mutual Exclusion, Progress, Bounded Waiting), Peterson Algorithm.', 1, true),
  makeTopic('os-8', 'subj-os', 'os-ch-sync', 'Semaphore', 'Counting and binary semaphore values, concurrent P/V wait/signal operation sequences and deadlock states.', 2, true),
  makeTopic('os-sub-sync-crit', 'subj-os', 'os-1', 'Critical Section Problem & Hardware Locks', 'Mutual exclusion, progress, bounded waiting, TestAndSet and CompareAndSwap atomic instructions.', 1, false),
  makeTopic('os-sub-sync-peterson', 'subj-os', 'os-1', 'Peterson Algorithm for 2 Processes', 'Shared flag array and turn variable correctness proofs for 2-process mutual exclusion.', 2, false),
  makeTopic('os-sub-sync-classic', 'subj-os', 'os-1', 'Classical Synchronization Problems', 'Producer-Consumer (bounded buffer), Readers-Writers priority, and Dining Philosophers.', 3, false),

  // --- Chapter 4: Deadlocks & Resource Allocation ---
  makeTopic('os-ch-deadlock', 'subj-os', null, 'Deadlocks & Resource Allocation', 'Necessary deadlock conditions, Resource Allocation Graphs, Banker algorithm, safety and recovery.', 4, true),
  makeTopic('os-6', 'subj-os', 'os-ch-deadlock', 'Resource Allocation', 'Deadlock necessary conditions (Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait), Banker Algorithm.', 1, true),
  makeTopic('os-sub-banker', 'subj-os', 'os-6', 'Bankers Algorithm & Safe Sequences', 'Allocation, Max, Need (Max - Allocation), and Available matrices; safety test and resource requests.', 1, false),
  makeTopic('os-sub-rag', 'subj-os', 'os-6', 'Resource Allocation Graphs (RAG)', 'RAG cycle detection, single vs multiple instance resource deadlock, and wait-for graphs.', 2, false),

  // --- Chapter 5: Memory Management & Virtual Memory ---
  makeTopic('os-ch-mem', 'subj-os', null, 'Memory Management & Virtual Memory', 'Paging, multi-level page tables, TLB, EMAT, page replacement algorithms, and allocation policies.', 5, true),
  makeTopic('os-10', 'subj-os', 'os-ch-mem', 'Memory Management', 'Contiguous memory allocation (First Fit, Best Fit, Worst Fit), internal vs external fragmentation.', 1, true),
  makeTopic('os-3', 'subj-os', 'os-ch-mem', 'Virtual Memory', 'Demand paging, Translation Lookaside Buffer (TLB), Effective Memory Access Time (EMAT) calculations, page table lookups.', 2, true),
  makeTopic('os-4', 'subj-os', 'os-ch-mem', 'Page Replacement', 'FIFO, LRU, Optimal page replacement algorithms, Belady Anomaly, page fault counting on reference strings.', 3, true),
  makeTopic('os-sub-tlb', 'subj-os', 'os-3', 'Translation Lookaside Buffer (TLB)', 'TLB hit ratio, TLB miss penalty, multi-level paging EMAT = Hit*(TLB+RAM) + Miss*(TLB+(k+1)*RAM).', 1, false),
  makeTopic('os-sub-ml-page', 'subj-os', 'os-3', 'Multi-Level Paging', 'Hierarchical paging, outer page table, inner page table, page directory index calculations.', 2, false),
  makeTopic('os-sub-lru', 'subj-os', 'os-4', 'Least Recently Used (LRU) & Optimal', 'LRU stack/counter implementations, stack algorithm property, comparing LRU vs FIFO vs Optimal.', 1, false),

  // --- Chapter 6: Storage, File Systems & I/O ---
  makeTopic('os-ch-storage', 'subj-os', null, 'Storage, File Systems & I/O', 'Disk geometry, seek times, Unix Inode pointers, disk scheduling algorithms, and I/O handling.', 6, true),
  makeTopic('os-5', 'subj-os', 'os-ch-storage', 'Disk', 'Disk geometry, Sector/Track addressing, rotational latency, transfer rate, and Unix Inode block pointer calculations.', 1, true),
  makeTopic('os-7', 'subj-os', 'os-ch-storage', 'Disk Scheduling', 'FCFS, SSTF, SCAN (Elevator), C-SCAN, LOOK, C-LOOK seek time track movement calculations.', 2, true),
  makeTopic('os-sub-fs', 'subj-os', 'os-ch-storage', 'File System', 'Directory structures, file control blocks, file access methods, file attributes and mounting.', 3, true),
  makeTopic('os-sub-io', 'subj-os', 'os-ch-storage', 'IO Handling', 'Programmed I/O, Interrupt-Driven I/O, I/O subsystem kernel services, device drivers and controllers.', 4, true),

  // =========================================================================
  // 2. COMPILER DESIGN (subj-cd)
  // =========================================================================
  // --- Chapter 1: Lexical Analysis & System Software ---
  makeTopic('cd-ch-lex', 'subj-cd', null, 'Lexical Analysis & System Software', 'Phases of compiler, token generation, lexeme, regular definitions, assemblers, linkers, loaders.', 1, true),
  makeTopic('cd-7', 'subj-cd', 'cd-ch-lex', 'Compilation Phases', 'Lexical, Syntax, Semantic, Intermediate Code, Code Optimization, and Target Code Generation phases.', 1, true),
  makeTopic('cd-sub-lex', 'subj-cd', 'cd-ch-lex', 'Lexical Analysis', 'Token recognition, pattern matching, regular definitions, input buffering, and Lex tool.', 2, true),
  makeTopic('cd-9', 'subj-cd', 'cd-ch-lex', 'Assembler', 'Two-pass assembler, symbol table generation, opcode table, and location counter management.', 3, true),
  makeTopic('cd-sub-linker', 'subj-cd', 'cd-ch-lex', 'Linker & Loader', 'Static vs dynamic linking, relocation, absolute vs relocatable loaders, and object modules.', 4, true),

  // --- Chapter 2: Parsing & Syntax Analysis ---
  makeTopic('cd-ch-parse', 'subj-cd', null, 'Parsing & Syntax Analysis', 'Grammars, ambiguity elimination, LL(1) top-down parsing, and LR bottom-up parsing hierarchy.', 2, true),
  makeTopic('cd-1', 'subj-cd', 'cd-ch-parse', 'Grammar', 'Context-free grammars, ambiguity proofs, left recursion elimination, and left factoring.', 1, true),
  makeTopic('cd-sub-topdown', 'subj-cd', 'cd-ch-parse', 'Top-Down Parsers (LL(1))', 'Recursive descent parsing, predictive parsing, FIRST and FOLLOW sets computation, LL(1) tables.', 2, true),
  makeTopic('cd-sub-ff', 'subj-cd', 'cd-sub-topdown', 'FIRST & FOLLOW Sets', 'FIRST set derivation rules for terminals/non-terminals, FOLLOW set endmarker $ and epsilon handling.', 1, false),
  makeTopic('cd-sub-ll1-table', 'subj-cd', 'cd-sub-topdown', 'LL(1) Parsing Table & Conflicts', 'LL(1) table construction M[A,a], detecting multiple entries / conflicts, LL(1) grammar condition.', 2, false),
  makeTopic('cd-2', 'subj-cd', 'cd-ch-parse', 'Parsing', 'Shift-reduce parsing, handle pruning, shift-reduce conflicts, reduce-reduce conflicts.', 3, true),
  makeTopic('cd-4', 'subj-cd', 'cd-ch-parse', 'LR Parser', 'Bottom-up parsing power: LR(0), SLR(1), LALR(1), and CLR(1) item sets and parsing table construction.', 4, true),
  makeTopic('cd-sub-lr0-slr1', 'subj-cd', 'cd-4', 'LR(0) & SLR(1) Parsing', 'LR(0) item set closures, goto transitions, shift-reduce conflicts, using FOLLOW sets for SLR(1) reductions.', 1, false),
  makeTopic('cd-sub-lalr-clr', 'subj-cd', 'cd-4', 'CLR(1) & LALR(1) Parsers', 'Canonical LR(1) lookahead items, merging states with identical cores for LALR(1), parsing power hierarchy.', 2, false),

  // --- Chapter 3: Syntax-Directed Translation & Intermediate Code ---
  makeTopic('cd-ch-sdt', 'subj-cd', null, 'Syntax-Directed Translation & Intermediate Code', 'S-attributed and L-attributed SDDs, 3AC quadruples/triples, and basic block DAGs.', 3, true),
  makeTopic('cd-5', 'subj-cd', 'cd-ch-sdt', 'Syntax Directed Translation', 'Synthesized attributes, Inherited attributes, S-attributed and L-attributed definitions.', 1, true),
  makeTopic('cd-8', 'subj-cd', 'cd-ch-sdt', 'Intermediate Code', 'Three-address code (3AC) generation, quadruples, triples, indirect triples, and backpatching.', 2, true),
  makeTopic('cd-sub-dag', 'subj-cd', 'cd-ch-sdt', 'Directed Acyclic Graph', 'DAG representation of basic blocks, local common subexpression elimination, and value numbering.', 3, true),

  // --- Chapter 4: Runtime Environments ---
  makeTopic('cd-ch-runtime', 'subj-cd', null, 'Runtime Environments', 'Activation records, stack allocation, parameter passing, and scope rules.', 4, true),
  makeTopic('cd-3', 'subj-cd', 'cd-ch-runtime', 'Runtime Environment', 'Activation records, frame pointer, stack pointer, return address, dynamic and static links.', 1, true),
  makeTopic('cd-6', 'subj-cd', 'cd-ch-runtime', 'Parameter Passing', 'Pass by value, pass by reference, pass by copy-restore (value-result), and pass by name.', 2, true),

  // --- Chapter 5: Code Optimization & Code Generation ---
  makeTopic('cd-ch-opt', 'subj-cd', null, 'Code Optimization & Code Generation', 'Basic blocks, flow graphs, loop optimizations, and data-flow equations.', 5, true),
  makeTopic('cd-sub-bb', 'subj-cd', 'cd-ch-opt', 'Basic Blocks', 'Identifying leader instructions, partitioning 3AC into basic blocks, and control flow graphs.', 1, true),
  makeTopic('cd-sub-opt', 'subj-cd', 'cd-ch-opt', 'Code Optimization', 'Constant folding, constant propagation, dead code elimination, loop invariant motion, strength reduction.', 2, true),
  makeTopic('cd-sub-live', 'subj-cd', 'cd-ch-opt', 'Live Variable Analysis', 'Data-flow equations: in[B] = use[B] U (out[B] - def[B]), reaching definitions, available expressions.', 3, true),

  // =========================================================================
  // 3. THEORY OF COMPUTATION (subj-toc)
  // =========================================================================
  // --- Chapter 1: Regular Expressions & Finite Automata ---
  makeTopic('toc-ch-reg', 'subj-toc', null, 'Regular Expressions & Finite Automata', 'DFA, NFA, minimal state automata, regular expressions, Arden theorem, and pumping lemma.', 1, true),
  makeTopic('toc-1', 'subj-toc', 'toc-ch-reg', 'Finite Automata', 'Deterministic Finite Automata (DFA) formal definitions, state transition functions, string acceptance.', 1, true),
  makeTopic('toc-sub-nfa', 'subj-toc', 'toc-1', 'Non-Deterministic Finite Automata (NFA)', 'NFA to DFA subset construction (2^Q states), epsilon-NFA transitions, and dead states.', 1, false),
  makeTopic('toc-7', 'subj-toc', 'toc-ch-reg', 'Minimal State Automata', 'Myhill-Nerode equivalence relations, table filling algorithm, 0/1/k-equivalence state partitioning.', 2, true),
  makeTopic('toc-6', 'subj-toc', 'toc-ch-reg', 'Regular Expression', 'Regular expressions syntax, Arden Theorem (R = Q + RP -> R = QP*), and proving non-regularity.', 3, true),
  makeTopic('toc-sub-pump-reg', 'subj-toc', 'toc-6', 'Pumping Lemma for Regular Languages', 'Pumping length p, decomposition w = xyz with |xy| <= p, |y| >= 1, proving languages non-regular.', 1, false),

  // --- Chapter 2: Context-Free Languages & Pushdown Automata ---
  makeTopic('toc-ch-cfl', 'subj-toc', null, 'Context-Free Languages & Pushdown Automata', 'Context-free grammars, derivations, Chomsky/Greibach normal forms, PDA, and pumping lemma.', 2, true),
  makeTopic('toc-2', 'subj-toc', 'toc-ch-cfl', 'Context Free Language', 'Context-free grammars (CFG), leftmost/rightmost derivations, parse trees, ambiguity in grammars.', 1, true),
  makeTopic('toc-9', 'subj-toc', 'toc-ch-cfl', 'Pushdown Automata', 'Deterministic PDA (DPDA) vs Non-Deterministic PDA (NPDA), acceptance by final state vs empty stack.', 2, true),
  makeTopic('toc-sub-cnf', 'subj-toc', 'toc-2', 'Chomsky Normal Form (CNF)', 'CNF production format (A -> BC or A -> a), derivation length 2n - 1 for string of length n.', 1, false),

  // --- Chapter 3: Language Hierarchy & Closure Properties ---
  makeTopic('toc-ch-class', 'subj-toc', null, 'Language Hierarchy & Closure Properties', 'Chomsky hierarchy (Regular, DCFL, CFL, CSL, REC, RE) and closure properties under operations.', 3, true),
  makeTopic('toc-4', 'subj-toc', 'toc-ch-class', 'Identify Class Language', 'Identifying class of language: Regular vs DCFL vs CFL vs CSL vs Recursive vs RE.', 1, true),
  makeTopic('toc-10', 'subj-toc', 'toc-ch-class', 'Closure Property', 'Closure properties table (Union, Intersection, Complement, Concatenation, Kleene Star, Homomorphism).', 2, true),
  makeTopic('toc-sub-countable', 'subj-toc', 'toc-ch-class', 'Countable Uncountable Set', 'Countable languages, Cantor diagonalization, set of all languages 2^(Sigma*) is uncountable.', 3, true),

  // --- Chapter 4: Turing Machines, Decidability & Reducibility ---
  makeTopic('toc-ch-dec', 'subj-toc', null, 'Turing Machines, Decidability & Reducibility', 'Turing machines, halting problem, decidability/undecidability, Rice theorem, and reductions.', 4, true),
  makeTopic('toc-sub-tm', 'subj-toc', 'toc-ch-dec', 'Turing Machine', 'Single-tape and multi-tape Turing Machines, transition function delta, configuration transitions.', 1, true),
  makeTopic('toc-8', 'subj-toc', 'toc-ch-dec', 'Recursive and Recursively Enumerable Languages', 'Turing machine acceptance (halts on yes) vs total Turing machines (halts on all).', 2, true),
  makeTopic('toc-5', 'subj-toc', 'toc-ch-dec', 'Decidability', 'Decidable vs Undecidable problems for Regular, CFL, and Turing Machines, Halting Problem, Rice Theorem.', 3, true),
  makeTopic('toc-sub-rice', 'subj-toc', 'toc-5', 'Rice Theorem & Reductions', 'Rice Theorem Part 1 and Part 2 on non-trivial semantic properties, mapping reduction A <=m B.', 1, false),

  // =========================================================================
  // 4. ALGORITHMS (subj-algo)
  // =========================================================================
  // --- Chapter 1: Asymptotic Analysis & Recurrences ---
  makeTopic('alg-ch-asymp', 'subj-algo', null, 'Asymptotic Analysis & Recurrences', 'Asymptotic notations, time and space complexity analysis of loops, master theorem, recursion tree analysis, and algorithmic tracing.', 1, true),
  makeTopic('alg-6', 'subj-algo', 'alg-ch-asymp', 'Asymptotic Notations', 'Big-O, Omega, Theta, Little-o, Little-omega formal definitions and limit comparisons.', 1, true),
  makeTopic('alg-4', 'subj-algo', 'alg-ch-asymp', 'Time Complexity', 'Analyzing nested loops, logarithmic steps, best/worst/average case time complexities.', 2, true),
  makeTopic('alg-2', 'subj-algo', 'alg-ch-asymp', 'Recurrence Relation', 'Master Theorem cases T(n) = aT(n/b) + f(n), Akra-Bazzi method, recursion tree analysis.', 3, true),
  makeTopic('alg-1', 'subj-algo', 'alg-ch-asymp', 'Identify Function', 'Tracing pseudocode, determining returned values and mathematical functions implemented.', 4, true),
  makeTopic('alg-sub-recur', 'subj-algo', 'alg-ch-asymp', 'Recursion', 'Recursion call stack depth, base termination conditions, recursion tree traces.', 5, true),
  makeTopic('alg-sub-loop-inv', 'subj-algo', 'alg-ch-asymp', 'Loop Invariants', 'Loop termination conditions, invariant assertions, loop bounds verification and algorithmic correctness.', 6, true),
  makeTopic('alg-sub-output', 'subj-algo', 'alg-ch-asymp', 'Output', 'Evaluating iterative loops, pseudocode execution tracing, side effects in algorithmic control flow.', 7, true),
  makeTopic('alg-sub-aliasing', 'subj-algo', 'alg-ch-asymp', 'Aliasing', 'Memory referencing, pointer aliasing, variable side effects during function calls and loop iterations.', 8, true),
  makeTopic('alg-sub-des-tech', 'subj-algo', 'alg-ch-asymp', 'Algorithm Design Techniques', 'Greedy vs dynamic vs divide and conquer paradigms, optimal choice heuristics.', 9, true),
  makeTopic('alg-sub-alg-des', 'subj-algo', 'alg-ch-asymp', 'Algorithm Design', 'Correctness proofs, state representations, problem reductions.', 10, true),
  makeTopic('alg-sub-space', 'subj-algo', 'alg-ch-asymp', 'Space Complexity', 'Auxiliary space, recursion stack depth analysis, in-place vs extra memory bounds.', 11, true),
  makeTopic('alg-sub-cs', 'subj-algo', 'alg-ch-asymp', 'Computer Science', 'Core computer science fundamentals, state models, computational limits.', 12, true),

  // --- Chapter 2: Divide and Conquer, Searching & Sorting ---
  makeTopic('alg-ch-sort', 'subj-algo', null, 'Divide and Conquer, Searching & Sorting', 'Comparison sorting lower bounds, divide-and-conquer sorts, binary search, inversions, and stability.', 2, true),
  makeTopic('alg-7', 'subj-algo', 'alg-ch-sort', 'Sorting', 'Comparison lower bound Omega(n log n), sorting classifications, adaptive sorting, stability properties.', 1, true),
  makeTopic('alg-8', 'subj-algo', 'alg-ch-sort', 'Quick Sort', 'Lomuto vs Hoare partitioning, worst case O(n^2) conditions, randomized pivot selection.', 2, true),
  makeTopic('alg-sub-merge', 'subj-algo', 'alg-ch-sort', 'Merge Sort', 'Merge sort divide-and-conquer, recurrence T(n) = 2T(n/2) + O(n), auxiliary O(n) space.', 3, true),
  makeTopic('alg-sub-search', 'subj-algo', 'alg-ch-sort', 'Searching', 'Linear search, binary search variations, search in rotated sorted array, peak finding.', 4, true),
  makeTopic('alg-sub-binsearch', 'subj-algo', 'alg-ch-sort', 'Binary Search', 'Binary search interval halving, logarithmic time complexity O(log n), search boundaries.', 5, true),
  makeTopic('alg-sub-heap-sort', 'subj-algo', 'alg-ch-sort', 'Heap Sort', 'Heap Sort algorithm, in-place O(n log n) worst-case time, Build-Heap initialization.', 6, true),
  makeTopic('alg-sub-ins-sort', 'subj-algo', 'alg-ch-sort', 'Insertion Sort', 'Insertion sort adaptive algorithm, O(n) best-case for nearly sorted lists, O(n^2) worst case.', 7, true),

  // --- Chapter 3: Graph Algorithms & Traversals ---
  makeTopic('alg-ch-graph', 'subj-algo', null, 'Graph Algorithms & Traversals', 'Graph traversals, single-source and all-pairs shortest paths, DAG topological ordering, SCCs.', 3, true),
  makeTopic('alg-5', 'subj-algo', 'alg-ch-graph', 'Graph Search', 'Breadth-First Search (BFS), Depth-First Search (DFS), edge classification (tree/back/forward/cross).', 1, true),
  makeTopic('alg-sub-topo', 'subj-algo', 'alg-ch-graph', 'Topological Sort', 'DAG topological sorting, Kahn in-degree zero algorithm, DFS departure finish times.', 2, true),
  makeTopic('alg-sub-scc', 'subj-algo', 'alg-ch-graph', 'Strongly Connected Components', 'Kosaraju two-pass DFS algorithm, Tarjan low-link algorithm, component condensation DAG.', 3, true),
  makeTopic('alg-sub-graph-alg', 'subj-algo', 'alg-ch-graph', 'Graph Algorithms', 'Cycle detection in directed/undirected graphs, bipartite testing, connected components.', 4, true),

  // --- Chapter 4: Greedy Algorithms & Shortest Paths ---
  makeTopic('alg-ch-greedy', 'subj-algo', null, 'Greedy Algorithms & Shortest Paths', 'Greedy choice property, minimum spanning trees (Kruskal, Prim), Dijkstra, Bellman-Ford, and Huffman.', 4, true),
  makeTopic('alg-3', 'subj-algo', 'alg-ch-greedy', 'Minimum Spanning Tree', 'Kruskal (Disjoint Set Union) and Prim (Priority Queue) algorithms, cut/cycle properties, uniqueness.', 1, true),
  makeTopic('alg-9', 'subj-algo', 'alg-ch-greedy', 'Shortest Path', 'Single-source shortest paths: Dijkstra algorithm (non-negative weights) and Bellman-Ford (negative edges).', 2, true),
  makeTopic('alg-sub-dijkstra', 'subj-algo', 'alg-ch-greedy', 'Dijkstras Algorithm', 'Dijkstra greedy vertex relaxation d[v] = min(d[v], d[u] + w), priority queue O((V+E) log V).', 3, true),
  makeTopic('alg-sub-huffman', 'subj-algo', 'alg-ch-greedy', 'Huffman Code', 'Optimal prefix codes, Huffman greedy tree construction, average bits per character calculation.', 4, true),

  // --- Chapter 5: Dynamic Programming ---
  makeTopic('alg-ch-dp', 'subj-algo', null, 'Dynamic Programming', 'Optimal substructure, overlapping subproblems, 0/1 knapsack, LCS, LIS, MCM, and Floyd-Warshall.', 5, true),
  makeTopic('alg-10', 'subj-algo', 'alg-ch-dp', 'Dynamic Programming', '0/1 Knapsack, Longest Common Subsequence (LCS), Longest Increasing Subsequence (LIS), Subset Sum.', 1, true),
  makeTopic('alg-sub-mcm', 'subj-algo', 'alg-ch-dp', 'Matrix Chain Ordering', 'Matrix Chain Multiplication parenthesization recurrence m[i,j] = min(m[i,k] + m[k+1,j] + p_i-1 p_k p_j).', 2, true),

  // --- Chapter 6: Hashing & Tree Structures ---
  makeTopic('alg-ch-hash', 'subj-algo', null, 'Hashing & Tree Structures', 'Hash functions, linear/quadratic probing, double hashing, binary search trees, and heaps.', 6, true),
  makeTopic('alg-sub-hashing', 'subj-algo', 'alg-ch-hash', 'Hashing', 'Hash tables, collision resolution via chaining and open addressing, load factor alpha = n/m.', 1, true),
  makeTopic('alg-sub-lin-probe', 'subj-algo', 'alg-ch-hash', 'Linear Probing', 'Linear probing collision resolution h(k,i) = (h(k) + i) mod m, primary clustering.', 2, true),
  makeTopic('alg-sub-double-hash', 'subj-algo', 'alg-ch-hash', 'Double Hashing', 'Double hashing collision resolution h(k,i) = (h1(k) + i * h2(k)) mod m, uniform hashing.', 3, true),
  makeTopic('alg-sub-bst', 'subj-algo', 'alg-ch-hash', 'Binary Search Tree', 'BST search, insertion, deletion, and tree traversals in algorithm contexts.', 4, true),

  // =========================================================================
  // 5. DATA STRUCTURES (subj-ds)
  // =========================================================================
  // --- Chapter 1: Linear Data Structures ---
  makeTopic('ds-ch-linear', 'subj-ds', null, 'Linear Data Structures', 'Arrays, linked lists, stacks, queues, and expression evaluation.', 1, true),
  makeTopic('ds-8', 'subj-ds', 'ds-ch-linear', 'Array', '1D and 2D arrays, row-major and column-major address calculations Base + (i*N + j)*size.', 1, true),
  makeTopic('ds-4', 'subj-ds', 'ds-ch-linear', 'Linked List', 'Singly, doubly, and circular linked lists, pointer manipulation, reversal, cycle detection.', 2, true),
  makeTopic('ds-5', 'subj-ds', 'ds-ch-linear', 'Stack', 'Stack LIFO operations, push/pop array and pointer implementations, applications.', 3, true),
  makeTopic('ds-7', 'subj-ds', 'ds-ch-linear', 'Queue', 'Queue FIFO operations, circular queue wrap-around (rear+1)%N == front, deque, priority queue.', 4, true),
  makeTopic('ds-sub-infix', 'subj-ds', 'ds-ch-linear', 'Infix Prefix', 'Infix to postfix and prefix conversion using operator precedence and associativity, evaluation.', 5, true),

  // --- Chapter 2: Trees & Binary Search Trees (BST) ---
  makeTopic('ds-ch-tree', 'subj-ds', null, 'Trees & Binary Search Trees (BST)', 'Binary tree properties, traversals, BST operations, AVL balance rotations.', 2, true),
  makeTopic('ds-1', 'subj-ds', 'ds-ch-tree', 'Binary Tree', 'Binary tree node relations (L = N2 + 1), full, complete, and strictly binary trees, height bounds.', 1, true),
  makeTopic('ds-sub-tree-trav', 'subj-ds', 'ds-1', 'Tree Traversal & Reconstruction', 'Inorder, Preorder, Postorder, and Level-Order traversals; unique tree reconstruction.', 1, false),
  makeTopic('ds-2', 'subj-ds', 'ds-ch-tree', 'Binary Search Tree', 'BST property (Left < Root < Right), search, insert, delete with inorder successor/predecessor.', 2, true),
  makeTopic('ds-10', 'subj-ds', 'ds-ch-tree', 'AVL Tree', 'Self-balancing BST, balance factor in {-1, 0, 1}, LL, RR, LR, RL single and double rotations.', 3, true),

  // --- Chapter 3: Priority Queues & Binary Heaps ---
  makeTopic('ds-ch-heap', 'subj-ds', null, 'Priority Queues & Binary Heaps', 'Min-heap, max-heap, array representations, heapify, and build-heap.', 3, true),
  makeTopic('ds-3', 'subj-ds', 'ds-ch-heap', 'Binary Heap', 'Max-Heap and Min-Heap array representations, heapify O(log n), Build-Heap linear O(n).', 1, true),
  makeTopic('ds-sub-pq', 'subj-ds', 'ds-ch-heap', 'Priority Queue', 'Priority Queue ADT, extract-min, decrease-key operations using binary heaps.', 2, true),

  // --- Chapter 4: Hashing & Hash Tables ---
  makeTopic('ds-ch-hash', 'subj-ds', null, 'Hashing & Hash Tables', 'Hash functions, chaining, open addressing, uniform hashing assumptions.', 4, true),
  makeTopic('ds-6', 'subj-ds', 'ds-ch-hash', 'Hashing', 'Hash table dictionary operations, collision resolution techniques, load factor alpha.', 1, true),
  makeTopic('ds-sub-unif-hash', 'subj-ds', 'ds-ch-hash', 'Uniform Hashing', 'Simple Uniform Hashing Assumption (SUHA), expected search time Theta(1 + alpha).', 2, true),

  // =========================================================================
  // 6. C-PROGRAMMING (subj-prog)
  // =========================================================================
  // --- Chapter 1: C Fundamentals, Control Flow & Loops ---
  makeTopic('pr-ch-fund', 'subj-prog', null, 'C Fundamentals, Control Flow & Loops', 'Data types, operator precedence, bitwise operations, loops, conditional statements, and output tracing.', 1, true),
  makeTopic('pr-1', 'subj-prog', 'pr-ch-fund', 'Programming In C', 'C syntax, primitive data types, format specifiers, type casting, operator precedence table.', 1, true),
  makeTopic('pr-7', 'subj-prog', 'pr-ch-fund', 'Output', 'Tracing printf outputs, post-increment/pre-increment side effects, bitwise operations, loops.', 2, true),
  makeTopic('pr-6', 'subj-prog', 'pr-ch-fund', 'Loop Invariants', 'Loop termination conditions, invariant assertions, iteration complexity, nested loops.', 3, true),
  makeTopic('pr-8', 'subj-prog', 'pr-ch-fund', 'Identify Function', 'Determining returned value or mathematical function executed by C code snippets.', 4, true),

  // --- Chapter 2: Functions, Parameter Passing & Recursion ---
  makeTopic('pr-ch-recur', 'subj-prog', null, 'Functions, Parameter Passing & Recursion', 'Function calls, activation records, parameter passing mechanisms, and recursive tracing.', 2, true),
  makeTopic('pr-10', 'subj-prog', 'pr-ch-recur', 'Functions', 'Function declarations, return values, scope rules, local vs global variables, static variables.', 1, true),
  makeTopic('pr-2', 'subj-prog', 'pr-ch-recur', 'Recursion', 'Recursion call stack execution, base termination conditions, tail recursion, stack depth.', 2, true),
  makeTopic('pr-5', 'subj-prog', 'pr-ch-recur', 'Parameter Passing', 'Pass by value vs simulated pass by reference using pointer arguments, evaluation order.', 3, true),

  // --- Chapter 3: Pointers, Arrays & Strings ---
  makeTopic('pr-ch-ptr', 'subj-prog', null, 'Pointers, Arrays & Strings', 'Pointer arithmetic, pointers to pointers, array-pointer decay, dynamic memory allocation.', 3, true),
  makeTopic('pr-3', 'subj-prog', 'pr-ch-ptr', 'Pointers', 'Pointer dereferencing (*), address-of (&), pointer arithmetic, void pointers, function pointers.', 1, true),
  makeTopic('pr-4', 'subj-prog', 'pr-ch-ptr', 'Array', '1D and 2D arrays, array indexing a[i] == *(a+i), passing arrays to functions, multidimensional arrays.', 2, true),
  makeTopic('pr-sub-strings', 'subj-prog', 'pr-ch-ptr', 'Strings', 'Null-terminated string arrays, string library functions (strlen, strcpy, strcmp), string literals.', 3, true),
  makeTopic('pr-sub-aliasing', 'subj-prog', 'pr-ch-ptr', 'Aliasing', 'Pointer aliasing, multiple pointers referencing the same memory block and side effects.', 4, true),

  // --- Chapter 4: Structures & Unions ---
  makeTopic('pr-ch-struct', 'subj-prog', null, 'Structures & Unions', 'Structure alignment, padding, self-referential structures, and unions.', 4, true),
  makeTopic('pr-9', 'subj-prog', 'pr-ch-struct', 'Structure', 'Structure declarations, dot (.) and arrow (->) operators, structure padding/alignment rules.', 1, true),
  makeTopic('pr-sub-union', 'subj-prog', 'pr-ch-struct', 'Union', 'Unions memory sharing, sizeof evaluation, bit-fields, enum types.', 2, true),

  // =========================================================================
  // 7. DIGITAL LOGIC (subj-dld)
  // =========================================================================
  // --- Chapter 1: Number Systems & Boolean Algebra ---
  makeTopic('dl-ch-num', 'subj-dld', null, 'Number Systems & Boolean Algebra', 'Number representation, 2s complement, Boolean laws, and canonical minterms/maxterms.', 1, true),
  makeTopic('dl-1', 'subj-dld', 'dl-ch-num', 'Number Representation', 'Base-r radix conversions, 1s and 2s complement signed integers, range of numbers, overflow detection.', 1, true),
  makeTopic('dl-7', 'subj-dld', 'dl-ch-num', 'Boolean Function', 'Boolean algebra laws, De Morgan theorems, duality, canonical SOP (minterms) and POS (maxterms).', 2, true),
  makeTopic('dl-sub-fp', 'subj-dld', 'dl-ch-num', 'Floating Point Representation', 'IEEE 754 floating point format, normalized mantissa, excess-127 biased exponent representation.', 3, true),

  // --- Chapter 2: Karnaugh Maps & Logic Minimization ---
  makeTopic('dl-ch-kmap', 'subj-dld', null, 'Karnaugh Maps & Logic Minimization', 'K-map grouping, prime implicants, essential prime implicants, and logic gates.', 2, true),
  makeTopic('dl-2', 'subj-dld', 'dl-ch-kmap', 'K-Map Minimization', '2, 3, 4, 5 variable K-Maps, grouping rules, Prime Implicants, Essential Prime Implicants, dont cares.', 1, true),
  makeTopic('dl-3', 'subj-dld', 'dl-ch-kmap', 'Logic Gates', 'AND, OR, NOT, NAND, NOR, XOR, XNOR truth tables, universal gates, XOR parity properties.', 2, true),

  // --- Chapter 3: Combinational Circuits ---
  makeTopic('dl-ch-circ', 'subj-dld', null, 'Combinational Circuits', 'Multiplexers, decoders, encoders, adders, subtractors, and carry lookahead adders.', 3, true),
  makeTopic('dl-5', 'subj-dld', 'dl-ch-circ', 'Multiplexer', '2:1, 4:1, 8:1, 16:1 multiplexers, implementing boolean functions using MUX, Shannon expansion.', 1, true),
  makeTopic('dl-10', 'subj-dld', 'dl-ch-circ', 'Adder & Subtractor Circuits', 'Half Adder, Full Adder, Ripple Carry Adder delay, Carry Look-Ahead Adder generation logic.', 2, true),
  makeTopic('dl-sub-dec', 'subj-dld', 'dl-ch-circ', 'Decoder', 'Binary decoders with enable lines, 2-to-4, 3-to-8 decoder expansion, implementing logic with decoders.', 3, true),

  // --- Chapter 4: Sequential Circuits & Flip-Flops ---
  makeTopic('dl-ch-seq', 'subj-dld', null, 'Sequential Circuits & Flip-Flops', 'Flip-flops, characteristic equations, timing constraints, and race-around condition.', 4, true),
  makeTopic('dl-11', 'subj-dld', 'dl-ch-seq', 'Flip-Flops & Timing', 'SR, JK, D, T Flip-Flops, race-around condition, Setup and Hold time constraints for max clock frequency.', 1, true),
  makeTopic('dl-sub-ff', 'subj-dld', 'dl-ch-seq', 'Flip Flop', 'Flip-flop excitation tables, characteristic equations, flip-flop conversions (JK to D, T to JK).', 2, true),
  makeTopic('dl-sub-fsm', 'subj-dld', 'dl-ch-seq', 'Finite State Machines', 'Mealy vs Moore synchronous sequential machine modeling, state diagrams, and state equations.', 3, true),

  // --- Chapter 5: Counters & Shift Registers ---
  makeTopic('dl-ch-cnt', 'subj-dld', null, 'Counters & Shift Registers', 'Synchronous & ripple counters, Mod-N counters, and shift registers.', 5, true),
  makeTopic('dl-4', 'subj-dld', 'dl-ch-cnt', 'Digital Counter', 'Synchronous and Asynchronous (Ripple) counters, Mod-N counters, Up/Down counters, ring & Johnson counters.', 1, true),
  makeTopic('dl-sub-shift', 'subj-dld', 'dl-ch-cnt', 'Shift Registers', 'SISO, SIPO, PISO, PIPO shift registers, bidirectional shift registers, and universal shift registers.', 2, true),

  // =========================================================================
  // 8. COMPUTER ORGANISATION & ARCHITECTURE (subj-coa)
  // =========================================================================
  // --- Chapter 1: Machine Instructions & Addressing Modes ---
  makeTopic('coa-ch-inst', 'subj-coa', null, 'Machine Instructions & Addressing Modes', 'Instruction formats, opcode fields, addressing modes, and RISC/CISC paradigms.', 1, true),
  makeTopic('coa-3', 'subj-coa', 'coa-ch-inst', 'Machine Instruction', 'Instruction execution cycles, opcode decoding, and register transfer operations.', 1, true),
  makeTopic('coa-4', 'subj-coa', 'coa-ch-inst', 'Addressing Modes', 'Immediate, Direct, Indirect, Indexed, Base Register, and PC-Relative effective address calculations.', 2, true),
  makeTopic('coa-6', 'subj-coa', 'coa-ch-inst', 'Instruction Format', '0, 1, 2, 3 address instruction formats, expanding opcodes, register and address bit constraints.', 3, true),
  makeTopic('coa-sub-risc', 'subj-coa', 'coa-ch-inst', 'CISC RISC Architecture', 'Complex vs Reduced Instruction Set Computer architectures, load-store vs register-memory ISA.', 4, true),

  // --- Chapter 2: CPU Control Unit & Datapath ---
  makeTopic('coa-ch-cpu', 'subj-coa', null, 'CPU Control Unit & Datapath', 'Hardwired vs microprogrammed control unit, horizontal and vertical microprogramming, ALU and datapath design.', 2, true),
  makeTopic('coa-5', 'subj-coa', 'coa-ch-cpu', 'Microprogramming', 'Horizontal vs vertical microinstructions, control store addressing, micro-program sequencing.', 1, true),
  makeTopic('coa-10', 'subj-coa', 'coa-ch-cpu', 'Data Path', 'Single-cycle and multi-cycle datapath, ALU control signals, internal bus architectures.', 2, true),

  // --- Chapter 3: Instruction Pipelining & Hazards ---
  makeTopic('coa-ch-pipe', 'subj-coa', null, 'Instruction Pipelining & Hazards', 'Pipelined execution, speedup, structural, data (RAW/WAR/WAW) and control hazards, forwarding, and branch stalls.', 3, true),
  makeTopic('coa-2', 'subj-coa', 'coa-ch-pipe', 'Pipelining', 'Instruction pipelining stages, throughput, pipeline register latency, ideal CPI.', 1, true),
  makeTopic('coa-sub-speedup', 'subj-coa', 'coa-ch-pipe', 'Speedup', 'Pipeline speedup S = (n*k)/(k+n-1+stalls), efficiency, throughput formulas.', 2, true),
  makeTopic('coa-sub-datahaz', 'subj-coa', 'coa-ch-pipe', 'Data Hazards', 'Read-After-Write (RAW), Write-After-Read (WAR), Write-After-Write (WAW) dependencies and operand forwarding.', 3, true),

  // --- Chapter 4: Memory Hierarchy & Cache Memory ---
  makeTopic('coa-ch-mem', 'subj-coa', null, 'Memory Hierarchy & Cache Memory', 'Cache direct/set-associative/fully-associative mapping, replacement policies, write policies, AMAT, and DRAM.', 4, true),
  makeTopic('coa-1', 'subj-coa', 'coa-ch-mem', 'Cache Memory', 'Direct, Set-Associative, Fully Associative mapping, tag/set/offset bits, Write-Through vs Write-Back.', 1, true),
  makeTopic('coa-sub-dir-map', 'subj-coa', 'coa-1', 'Direct Mapping', 'Direct mapped cache tag and line index partitioning, memory block modulo mapping.', 1, false),
  makeTopic('coa-sub-amat', 'subj-coa', 'coa-1', 'Average Memory Access Time (AMAT)', 'AMAT = H1*T1 + (1-H1)*(H2*T2 + (1-H2)*Tm) hierarchical access calculations.', 2, false),
  makeTopic('coa-sub-mem-int', 'subj-coa', 'coa-ch-mem', 'Memory Interfacing', 'Address decoding logic, chip select generation, memory capacity expansion (word/length).', 2, true),

  // --- Chapter 5: I/O Organization & DMA ---
  makeTopic('coa-ch-io', 'subj-coa', null, 'I/O Organization & DMA', 'Interrupt-driven I/O, DMA controller architecture, cycle stealing vs burst transfer modes.', 5, true),
  makeTopic('coa-7', 'subj-coa', 'coa-ch-io', 'Interrupts', 'Vectored vs non-vectored interrupts, interrupt latency, priority interrupt controllers.', 1, true),
  makeTopic('coa-8', 'subj-coa', 'coa-ch-io', 'DMA', 'DMA controller architecture, cycle stealing mode vs burst mode data transfer bandwidth.', 2, true),
  makeTopic('coa-9', 'subj-coa', 'coa-ch-io', 'IO Handling', 'Programmed I/O, interrupt-driven I/O, memory-mapped I/O vs I/O-mapped I/O.', 3, true),

  // =========================================================================
  // 9. DATABASE MANAGEMENT SYSTEM (subj-db)
  // =========================================================================
  // --- Chapter 1: ER Model & Relational Algebra ---
  makeTopic('db-ch-er', 'subj-db', null, 'ER Model & Relational Algebra', 'ER modeling, entity-relationship constraints, relational algebra operators, and calculus.', 1, true),
  makeTopic('db-7', 'subj-db', 'db-ch-er', 'ER Diagram', 'Entities, relationships, participation constraints (total/partial), cardinality ratios, converting ER to tables.', 1, true),
  makeTopic('db-4', 'subj-db', 'db-ch-er', 'Relational Algebra', 'Select, Project, Cartesian Product, Join (natural, outer), Division operator, tuple relational calculus.', 2, true),

  // --- Chapter 2: SQL Queries ---
  makeTopic('db-ch-sql', 'subj-db', null, 'SQL Queries', 'SQL DDL/DML, nested subqueries, joins, aggregation, grouping, and NULL value logic.', 2, true),
  makeTopic('db-5', 'subj-db', 'db-ch-sql', 'SQL', 'SELECT queries, GROUP BY, HAVING, subqueries, correlated subqueries, INNER/OUTER JOINs, aggregates.', 1, true),

  // --- Chapter 3: Functional Dependencies & Normalization ---
  makeTopic('db-ch-norm', 'subj-db', null, 'Functional Dependencies & Normalization', 'Attribute closure, candidate keys, minimal cover, 1NF, 2NF, 3NF, BCNF, lossless decomposition.', 3, true),
  makeTopic('db-3', 'subj-db', 'db-ch-norm', 'Functional Dependency', 'Armstrong axioms, attribute closure X+, finding candidate keys and superkeys, minimal cover of FDs.', 1, true),
  makeTopic('db-6', 'subj-db', 'db-ch-norm', 'Normalization', '1NF, 2NF, 3NF, BCNF decomposition testing, lossless join property, and dependency preservation.', 2, true),

  // --- Chapter 4: Transactions & Concurrency Control ---
  makeTopic('db-ch-trans', 'subj-db', null, 'Transactions & Concurrency Control', 'ACID properties, conflict/view serializability, 2PL, recoverability, and timestamp ordering.', 4, true),
  makeTopic('db-1', 'subj-db', 'db-ch-trans', 'Transactions', 'ACID properties, transaction states, dirty read, non-repeatable read, phantom read anomalies.', 1, true),
  makeTopic('db-2', 'subj-db', 'db-ch-trans', 'Serializability', 'Conflict serializability, precedence graphs, view serializability, recoverable and cascadeless schedules.', 2, true),

  // --- Chapter 5: Storage & B/B+ Trees ---
  makeTopic('db-ch-index', 'subj-db', null, 'Storage & B/B+ Trees', 'File organization, primary/secondary/clustered index, B-Trees and B+ Trees order calculations.', 5, true),
  makeTopic('db-8', 'subj-db', 'db-ch-index', 'B and B+ Tree', 'B-Tree & B+ Tree search, insertion node splitting, deletion, order constraints, block pointer capacity.', 1, true),
  makeTopic('db-9', 'subj-db', 'db-ch-index', 'Indexing', 'Primary vs Secondary Indexing, Clustered vs Non-Clustered index, Dense vs Sparse index structures.', 2, true),

  // =========================================================================
  // 10. COMPUTER NETWORKS (subj-cn)
  // =========================================================================
  // --- Chapter 1: Data Link Layer & Framing ---
  makeTopic('cn-ch-dll', 'subj-cn', null, 'Data Link Layer & Framing', 'Framing, CRC error detection, Hamming codes, Stop-and-Wait, Go-Back-N, Selective Repeat.', 1, true),
  makeTopic('cn-3', 'subj-cn', 'cn-ch-dll', 'Sliding Window', 'Stop-and-Wait, Go-Back-N, Selective Repeat efficiency formulas eta = 1/(1+2a) and window sizing.', 1, true),
  makeTopic('cn-10', 'subj-cn', 'cn-ch-dll', 'Error Detection', 'Cyclic Redundancy Check modulo-2 polynomial division, parity checks, Hamming distance.', 2, true),
  makeTopic('cn-sub-sw', 'subj-cn', 'cn-3', 'Stop and Wait ARQ', 'Stop and wait flow control efficiency eta = 1/(1+2a), optimal frame length and timeout calculations.', 1, false),
  makeTopic('cn-sub-gbn-sr', 'subj-cn', 'cn-3', 'Go-Back-N vs Selective Repeat', 'GBN sender window 2^k - 1, receiver 1; Selective Repeat sender and receiver 2^(k-1).', 2, false),

  // --- Chapter 2: Medium Access Control & LANs ---
  makeTopic('cn-ch-mac', 'subj-cn', null, 'Medium Access Control & LANs', 'ALOHA, CSMA/CD backoff, IEEE 802.3 Ethernet frame structure, and switching.', 2, true),
  makeTopic('cn-sub-csmacd', 'subj-cn', 'cn-ch-mac', 'CSMA CD', 'Carrier Sense Multiple Access with Collision Detection, minimum frame size L >= 2 * B * T_prop.', 1, true),
  makeTopic('cn-sub-aloha', 'subj-cn', 'cn-ch-mac', 'Aloha', 'Pure ALOHA (efficiency 18.4%) and Slotted ALOHA (efficiency 36.8%) throughput G*e^(-2G).', 2, true),
  makeTopic('cn-sub-ethernet', 'subj-cn', 'cn-ch-mac', 'Ethernet', 'IEEE 802.3 Ethernet frame structure, preamble, MAC address format, 10Mbps/100Mbps Ethernet rules.', 3, true),

  // --- Chapter 3: Network Layer, IP & Routing ---
  makeTopic('cn-ch-net', 'subj-cn', null, 'Network Layer, IP & Routing', 'IPv4/IPv6 addressing, subnetting, CIDR, distance vector, link state routing, ARP, ICMP, NAT.', 3, true),
  makeTopic('cn-1', 'subj-cn', 'cn-ch-net', 'IP Addressing', 'IPv4 classful and classless (CIDR) addressing, subnet mask, broadcast addresses, subnet calculations.', 1, true),
  makeTopic('cn-2', 'subj-cn', 'cn-ch-net', 'Routing', 'Distance Vector Routing (Bellman-Ford count-to-infinity), Link State Routing (Dijkstra OSPF), BGP.', 2, true),
  makeTopic('cn-5', 'subj-cn', 'cn-ch-net', 'IPv4 Datagram Header', 'IPv4 packet header fields, TTL, Header Checksum, Identification, Flags (DF/MF), Fragment Offset.', 3, true),
  makeTopic('cn-7', 'subj-cn', 'cn-ch-net', 'Fragmentation', 'Maximum Transmission Unit (MTU) packet fragmentation calculations, fragment offset scaling.', 4, true),

  // --- Chapter 4: Transport Layer & TCP/UDP ---
  makeTopic('cn-ch-trans', 'subj-cn', null, 'Transport Layer & TCP/UDP', 'TCP 3-way handshake, flow control, congestion control, window scaling, and UDP.', 4, true),
  makeTopic('cn-4', 'subj-cn', 'cn-ch-trans', 'TCP', 'TCP 3-way handshake connection establishment, sequence/ACK numbers, congestion window dynamics.', 1, true),
  makeTopic('cn-6', 'subj-cn', 'cn-ch-trans', 'Congestion Control', 'Slow Start (exponential cwnd doubling), Congestion Avoidance (additive increase), Fast Retransmit.', 2, true),
  makeTopic('cn-8', 'subj-cn', 'cn-ch-trans', 'UDP', 'User Datagram Protocol header format, connectionless unreliable delivery, port numbers.', 3, true),

  // --- Chapter 5: Application Layer & Network Security ---
  makeTopic('cn-ch-app', 'subj-cn', null, 'Application Layer & Network Security', 'DNS resolution, HTTP, sockets, RSA public key cryptography, Diffie-Hellman.', 5, true),
  makeTopic('cn-9', 'subj-cn', 'cn-ch-app', 'Network Security', 'Symmetric vs Asymmetric encryption, RSA algorithm c = m^e mod n, Diffie-Hellman key exchange.', 1, true),
  makeTopic('cn-sub-dns', 'subj-cn', 'cn-ch-app', 'DNS', 'Domain Name System hierarchical resolution, recursive vs iterative queries, DNS record types.', 2, true),
  makeTopic('cn-sub-http', 'subj-cn', 'cn-ch-app', 'HTTP', 'HTTP/1.0 non-persistent vs HTTP/1.1 persistent connections, pipelining, request methods and status codes.', 3, true),
  makeTopic('cn-sub-socket', 'subj-cn', 'cn-ch-app', 'Sockets', 'Socket API functions: socket(), bind(), listen(), accept(), connect(), send(), recv().', 4, true),

  // =========================================================================
  // 11. DISCRETE MATHEMATICS (subj-dm)
  // =========================================================================
  // --- Chapter 1: Mathematical Logic ---
  makeTopic('dm-ch-logic', 'subj-dm', null, 'Mathematical Logic', 'Propositional logic, truth tables, first-order predicate calculus, inference rules, and quantifiers.', 1, true),
  makeTopic('dm-17', 'subj-dm', 'dm-ch-logic', 'Propositional Logic', 'Truth tables, logical equivalences, Tautology/Contradiction, CNF/DNF, inference rules.', 1, true),
  makeTopic('dm-18', 'subj-dm', 'dm-ch-logic', 'First Order Logic', 'Predicate quantifiers (Forall, Exists), quantifier negation, scope, validity and satisfiability of formulas.', 2, true),
  makeTopic('dm-19', 'subj-dm', 'dm-ch-logic', 'Logical Reasoning', 'Translating complex English statements to predicate calculus and logic deductions.', 3, true),

  // --- Chapter 2: Sets, Relations & Functions ---
  makeTopic('dm-ch-set', 'subj-dm', null, 'Sets, Relations & Functions', 'Set operations, power sets, Cartesian products, equivalence relations, posets, and functions.', 2, true),
  makeTopic('dm-23', 'subj-dm', 'dm-ch-set', 'Set Theory', 'Power sets, Cartesian products, set algebra laws, cardinality of sets, De Morgan laws.', 1, true),
  makeTopic('dm-20', 'subj-dm', 'dm-ch-set', 'Relations', 'Reflexive, Symmetric, Anti-symmetric, Transitive properties, Equivalence classes, and closures.', 2, true),
  makeTopic('dm-22', 'subj-dm', 'dm-ch-set', 'Functions', 'Injective (One-to-One), Surjective (Onto), Bijective functions, number of onto functions formulas.', 3, true),
  makeTopic('dm-25', 'subj-dm', 'dm-ch-set', 'Partial Order & Posets', 'Posets, Hasse diagrams, Maximal/Minimal vs Greatest/Least elements, Topological sorting of Posets.', 4, true),
  makeTopic('dm-24', 'subj-dm', 'dm-ch-set', 'Lattice & Boolean Algebra', 'Partially ordered sets as Lattices, Meet (GLB), Join (LUB), Distributive and Complemented Lattices.', 5, true),
  makeTopic('dm-29', 'subj-dm', 'dm-ch-set', 'Countable & Uncountable Sets', 'Countably infinite sets (Integers, Rationals) vs Uncountable sets (Reals, Power set of Naturals).', 6, true),

  // --- Chapter 3: Combinatorics & Counting ---
  makeTopic('dm-ch-comb', 'subj-dm', null, 'Combinatorics & Counting', 'Permutations, combinations, balls in bins, pigeonhole principle, generating functions, and recurrences.', 3, true),
  makeTopic('dm-1', 'subj-dm', 'dm-ch-comb', 'Combinatory', 'Permutations & Combinations, Binomial theorem, inclusion-exclusion principle.', 1, true),
  makeTopic('dm-3', 'subj-dm', 'dm-ch-comb', 'Balls In Bins', 'Distributing distinct/identical objects into distinct/identical bins, stars and bars.', 2, true),
  makeTopic('dm-sub-balls-dist', 'subj-dm', 'dm-3', 'Distinguishable Balls into Distinct Bins', 'Distributing n distinct items into k distinct boxes (Total: k^n, Injective: P(k,n), Surjective: k! * S(n,k)).', 1, false),
  makeTopic('dm-sub-balls-indist', 'subj-dm', 'dm-3', 'Stars & Bars (Indistinguishable Balls)', 'Distributing n identical items into k distinct boxes C(n+k-1, k-1) and positive constraints C(n-1, k-1).', 2, false),
  makeTopic('dm-sub-stirling', 'subj-dm', 'dm-3', 'Stirling Numbers of the 2nd Kind S(n,k)', 'Partitioning n distinct items into k non-empty identical subsets: S(n,k) = k*S(n-1,k) + S(n-1,k-1).', 3, false),
  makeTopic('dm-sub-int-part', 'subj-dm', 'dm-3', 'Integer Partitions P(n,k)', 'Partitioning n identical items into k identical non-empty parts and generating functions.', 4, false),
  makeTopic('dm-8', 'subj-dm', 'dm-ch-comb', 'Pigeonhole Principle', 'Generalized pigeonhole principle ceil(N/k), minimum elements to guarantee duplicates.', 3, true),
  makeTopic('dm-5', 'subj-dm', 'dm-ch-comb', 'Generating Functions', 'Ordinary and exponential generating functions, closed forms for sequence generation.', 4, true),
  makeTopic('dm-2', 'subj-dm', 'dm-ch-comb', 'Recurrence Relation', 'Solving linear homogeneous and non-homogeneous recurrence relations, characteristic roots.', 5, true),
  makeTopic('dm-4', 'subj-dm', 'dm-ch-comb', 'Counting', 'Rule of sum, rule of product, combinatorial counting principles.', 6, true),

  // --- Chapter 4: Graph Theory ---
  makeTopic('dm-ch-graph', 'subj-dm', null, 'Graph Theory', 'Connectivity, degree sequences, planarity, coloring, isomorphism, and matching.', 4, true),
  makeTopic('dm-10', 'subj-dm', 'dm-ch-graph', 'Degree of Graph', 'Handshaking Lemma (Sum of degrees = 2|E|), degree sequences, Havel-Hakimi theorem.', 1, true),
  makeTopic('dm-9', 'subj-dm', 'dm-ch-graph', 'Graph Connectivity', 'Connected components, cut vertices, cut edges, bridges, Eulerian paths/circuits, Hamiltonian cycles.', 2, true),
  makeTopic('dm-11', 'subj-dm', 'dm-ch-graph', 'Graph Planarity', 'Planar graphs, Euler formula V - E + F = 2, maximal planar graph edges E <= 3V - 6.', 3, true),
  makeTopic('dm-12', 'subj-dm', 'dm-ch-graph', 'Graph Coloring', 'Vertex chromatic number chi(G), edge chromatic index, four-color theorem bounds, bipartite coloring.', 4, true),
  makeTopic('dm-15', 'subj-dm', 'dm-ch-graph', 'Graph Matching', 'Maximal vs maximum matchings, Hall Marriage Theorem for bipartite graphs.', 5, true),
  makeTopic('dm-13', 'subj-dm', 'dm-ch-graph', 'Graph Isomorphism', 'Graph invariant checks: vertex counts, degree multisets, adjacency matrix isomorphism.', 6, true),

  // --- Chapter 5: Group Theory & Abstract Algebra ---
  makeTopic('dm-ch-algebra', 'subj-dm', null, 'Group Theory & Abstract Algebra', 'Groups, subgroups, cyclic groups, Lagrange theorem, modular arithmetic, and number theory.', 5, true),
  makeTopic('dm-21', 'subj-dm', 'dm-ch-algebra', 'Group Theory', 'Groups, Abelian Groups, Subgroups, Cyclic groups, Order of elements, Lagrange Theorem.', 1, true),
  makeTopic('dm-27', 'subj-dm', 'dm-ch-algebra', 'Number Theory', 'GCD, Euclidean algorithm, prime numbers, Euler Totient function phi(n).', 2, true),
  makeTopic('dm-7', 'subj-dm', 'dm-ch-algebra', 'Modular Arithmetic', 'Fermat Little Theorem, modular inverses, Chinese Remainder Theorem basics.', 3, true),

  // =========================================================================
  // 12. ENGINEERING MATHEMATICS (subj-em)
  // =========================================================================
  // --- Chapter 1: Linear Algebra ---
  makeTopic('em-ch-la', 'subj-em', null, 'Linear Algebra', 'Eigenvalues, eigenvectors, matrix operations, determinants, rank, vector spaces, and linear systems.', 1, true),
  makeTopic('em-1', 'subj-em', 'em-ch-la', 'Eigen Value', 'Characteristic equation |A - lambda*I| = 0, properties of eigenvalues (trace, det), Cayley-Hamilton Theorem.', 1, true),
  makeTopic('em-2', 'subj-em', 'em-ch-la', 'Matrix', 'Matrix multiplication, Transpose, Symmetric, Skew-Symmetric, Orthogonal, Unitary, and Nilpotent matrices.', 2, true),
  makeTopic('em-3', 'subj-em', 'em-ch-la', 'System of Equations', 'Matrix equation AX = B, augmented matrix [A|B], consistency test (Rank(A) vs Rank(A|B)), unique/infinite/no solution.', 3, true),
  makeTopic('em-4', 'subj-em', 'em-ch-la', 'Determinant', 'Properties of determinants, row/column expansion, inverse matrix formula A^-1 = adj(A)/det(A).', 4, true),
  makeTopic('em-5', 'subj-em', 'em-ch-la', 'Rank of Matrix', 'Echelon form, row operations, linearly independent rows/columns, Rank-Nullity Theorem.', 5, true),

  // --- Chapter 2: Calculus ---
  makeTopic('em-ch-calc', 'subj-em', null, 'Calculus', 'Limits, continuity, differentiability, maxima/minima, partial derivatives, and integrals.', 2, true),
  makeTopic('em-21', 'subj-em', 'em-ch-calc', 'Limits', 'Evaluation of limits, L\'Hopital Rule for 0/0 and inf/inf indeterminate forms.', 1, true),
  makeTopic('em-22', 'subj-em', 'em-ch-calc', 'Maxima Minima', 'First derivative test, Second derivative test, multivariable extrema using Hessian matrix.', 2, true),
  makeTopic('em-23', 'subj-em', 'em-ch-calc', 'Continuity', 'Left-hand limit = Right-hand limit = Function value at point, intermediate value theorem.', 3, true),
  makeTopic('em-24', 'subj-em', 'em-ch-calc', 'Differentiation', 'Chain rule, product rule, partial derivatives, directional derivatives, gradient.', 4, true),
  makeTopic('em-26', 'subj-em', 'em-ch-calc', 'Definite Integral', 'Fundamental Theorem of Calculus, properties of definite integrals.', 5, true),

  // --- Chapter 3: Probability & Statistics ---
  makeTopic('em-ch-prob', 'subj-em', null, 'Probability & Statistics', 'Axioms of probability, Bayes theorem, discrete & continuous random variables, and distributions.', 3, true),
  makeTopic('em-11', 'subj-em', 'em-ch-prob', 'Probability', 'Axioms of probability, sample spaces, mutually exclusive events, addition rule.', 1, true),
  makeTopic('em-13', 'subj-em', 'em-ch-prob', 'Conditional Probability', 'P(A|B) = P(A cap B) / P(B), Total Probability Theorem, Bayes Rule for posterior probability.', 2, true),
  makeTopic('em-12', 'subj-em', 'em-ch-prob', 'Expectation', 'Expected value E[X], Variance Var(X) = E[X^2] - (E[X])^2, linearity of expectation.', 3, true),
  makeTopic('em-15', 'subj-em', 'em-ch-prob', 'Random Variable', 'Discrete and Continuous random variables, cumulative distribution functions (CDF).', 4, true),
  makeTopic('em-16', 'subj-em', 'em-ch-prob', 'Binomial Distribution', 'P(X = k) = C(n,k) p^k (1-p)^(n-k), Mean = n*p, Variance = n*p*(1-p).', 5, true),
  makeTopic('em-19', 'subj-em', 'em-ch-prob', 'Poisson Distribution', 'P(X = k) = e^-lambda * lambda^k / k!, Mean = lambda, Variance = lambda.', 6, true),
  makeTopic('em-20', 'subj-em', 'em-ch-prob', 'Normal Distribution', 'Gaussian bell curve, standard normal distribution Z = (X - mu) / sigma, symmetry properties.', 7, true),
  makeTopic('em-17', 'subj-em', 'em-ch-prob', 'Exponential Distribution', 'Probability density f(x) = lambda*e^(-lambda*x), memoryless property P(X > s+t | X > s) = P(X > t).', 8, true),

  // =========================================================================
  // 13. GENERAL APTITUDE (subj-ga)
  // =========================================================================
  // --- Chapter 1: Quantitative Aptitude ---
  makeTopic('ga-ch-quant', 'subj-ga', null, 'Quantitative Aptitude', 'Permutations, combinations, time & work, speed time distance, percentages, geometry, and probability.', 1, true),
  makeTopic('ga-sub-time-work', 'subj-ga', 'ga-ch-quant', 'Time & Work', 'Work rate, combined worker efficiency, pipes and cisterns, alternating work schedules.', 1, true),
  makeTopic('ga-sub-spd', 'subj-ga', 'ga-ch-quant', 'Speed Time & Distance', 'Average speed, relative speed, trains crossing objects, upstream and downstream boat speed.', 2, true),
  makeTopic('ga-sub-perm-comb', 'subj-ga', 'ga-ch-quant', 'Permutations & Combinations', 'Fundamental counting principle, linear/circular permutations, selection combinations, probability.', 3, true),
  makeTopic('ga-sub-geom', 'subj-ga', 'ga-ch-quant', 'Geometry & Mensuration', 'Triangles, Pythagoras theorem, circles, tangent properties, 2D/3D area and volume formulas.', 4, true),
  makeTopic('ga-1', 'subj-ga', 'ga-ch-quant', 'Probability', 'Basic probability calculations, dice, cards, coins, and event combinations.', 5, true),
  makeTopic('ga-2', 'subj-ga', 'ga-ch-quant', 'Ratio Proportion', 'Direct and inverse proportions, mixtures and alligations, partnership profit sharing.', 6, true),
  makeTopic('ga-3', 'subj-ga', 'ga-ch-quant', 'Percentage', 'Percentage increase/decrease, successive percentage changes, marks and population problems.', 7, true),
  makeTopic('ga-4', 'subj-ga', 'ga-ch-quant', 'Profit Loss', 'Cost price, selling price, marked price, discount, profit/loss percentage formulas.', 8, true),

  // --- Chapter 2: Verbal Aptitude ---
  makeTopic('ga-ch-verbal', 'subj-ga', null, 'Verbal Aptitude', 'Grammar, sentence completion, reading comprehension, vocabulary, synonyms, and antonyms.', 2, true),
  makeTopic('ga-11', 'subj-ga', 'ga-ch-verbal', 'Most Appropriate Word', 'Contextual word selection, vocabulary usage, and sentence completion.', 1, true),
  makeTopic('ga-12', 'subj-ga', 'ga-ch-verbal', 'Passage Reading', 'Reading comprehension, central theme, author tone, and factual deduction from text.', 2, true),
  makeTopic('ga-13', 'subj-ga', 'ga-ch-verbal', 'Verbal Reasoning', 'Sentence arrangement, paragraph jumbles, logical coherence, and argument analysis.', 3, true),
  makeTopic('ga-14', 'subj-ga', 'ga-ch-verbal', 'Word Pairs', 'Analogy word pairs, semantic relationships between pairs of English words.', 4, true),
  makeTopic('ga-15', 'subj-ga', 'ga-ch-verbal', 'Synonyms', 'Vocabulary synonyms, closest meaning words in context.', 5, true),
  makeTopic('ga-16', 'subj-ga', 'ga-ch-verbal', 'Antonyms', 'Vocabulary antonyms, opposite meaning words in context.', 6, true),
  makeTopic('ga-17', 'subj-ga', 'ga-ch-verbal', 'Grammar', 'Subject-verb agreement, tense consistency, prepositions, articles, and modifier placement.', 7, true),

  // --- Chapter 3: Analytical Aptitude ---
  makeTopic('ga-ch-analytical', 'subj-ga', null, 'Analytical Aptitude', 'Logical reasoning, syllogisms, seating arrangements, blood relations, series, and direction sense.', 3, true),
  makeTopic('ga-21', 'subj-ga', 'ga-ch-analytical', 'Logical Reasoning', 'Deductive reasoning, condition evaluations, truth-tellers and liars logic puzzles.', 1, true),
  makeTopic('ga-22', 'subj-ga', 'ga-ch-analytical', 'Statements Follow', 'Syllogisms, statements and conclusions, logical validity of deduction statements.', 2, true),
  makeTopic('ga-23', 'subj-ga', 'ga-ch-analytical', 'Direction Sense', 'Compass direction navigation, turn angles, shortest distance displacements.', 3, true),
  makeTopic('ga-sub-blood', 'subj-ga', 'ga-ch-analytical', 'Blood Relations & Family Tree', 'Family tree generation mapping, maternal/paternal relationships, coded blood relations.', 4, true),
  makeTopic('ga-24', 'subj-ga', 'ga-ch-analytical', 'Sequence Series', 'Arithmetic, geometric, alternating, and alphanumeric series pattern identification.', 5, true),
  makeTopic('ga-25', 'subj-ga', 'ga-ch-analytical', 'Data Interpretation', 'Bar charts, pie charts, tables, line graphs, and percentage comparison questions.', 6, true),

  // --- Chapter 4: Spatial Aptitude ---
  makeTopic('ga-ch-spatial', 'subj-ga', null, 'Spatial Aptitude', 'Visual and spatial reasoning: folding, rotation, 3D structures, mirror images.', 4, true),
  makeTopic('ga-29', 'subj-ga', 'ga-ch-spatial', 'Paper Folding', 'Visualizing crease patterns and holes upon unfolding paper.', 1, true),
  makeTopic('ga-30', 'subj-ga', 'ga-ch-spatial', 'Patterns In Two Dimensions', '2D geometric transformations, pattern completion, tessellations.', 2, true),
  makeTopic('ga-31', 'subj-ga', 'ga-ch-spatial', 'Image Rotation', 'Clockwise and counter-clockwise 2D/3D angular rotations.', 3, true),
  makeTopic('ga-32', 'subj-ga', 'ga-ch-spatial', 'Patterns In Three Dimensions', 'Cube surface unrolling, dice net representations.', 4, true),
  makeTopic('ga-33', 'subj-ga', 'ga-ch-spatial', '3D Structure', 'Combining 3D polyhedra, orthographic front/side/top views.', 5, true),
  makeTopic('ga-34', 'subj-ga', 'ga-ch-spatial', 'Assembling', 'Mental assembly of disjointed 2D/3D parts.', 6, true),
  makeTopic('ga-35', 'subj-ga', 'ga-ch-spatial', 'Assembling Pieces', 'Fitting irregular pieces together to form complete shapes.', 7, true),
  makeTopic('ga-36', 'subj-ga', 'ga-ch-spatial', 'Mirror Image', 'Lateral inversion reflections along horizontal and vertical axes.', 8, true),
];

export const INITIAL_SCHEDULES: Schedule[] = [
  {
    id: 'sched-today',
    Schedule_Date: new Date().toISOString().split('T')[0],
    Schedule_Hours: 6,
    Schedule_Subjects: ['subj-coa', 'subj-os', 'subj-db'],
    Schedule_Tag_Filters: ['Star'],
    Subject_Allocations: {
      'subj-coa': 120,
      'subj-os': 120,
      'subj-db': 120,
    },
    Allocated_Topics: [
      {
        topic_id: 'coa-1',
        subject_id: 'subj-coa',
        topic_name: 'Cache Memory',
        subject_name: 'Computer Organisation & Architecture',
        allocated_minutes: 120,
        completed: false,
      },
      {
        topic_id: 'os-2',
        subject_id: 'subj-os',
        topic_name: 'Process Scheduling',
        subject_name: 'Operating Systems',
        allocated_minutes: 120,
        completed: false,
      },
      {
        topic_id: 'db-5',
        subject_id: 'subj-db',
        topic_name: 'SQL',
        subject_name: 'Database Management System',
        allocated_minutes: 120,
        completed: false,
      },
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];
