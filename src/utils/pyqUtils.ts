import { Topic, TopicTreeNodeType } from '../types/topic';
import { INITIAL_TOPICS } from './sampleData';

const initialTopicMap = new Map(INITIAL_TOPICS.map((t) => [t.id, t]));

// Keyword mapping for GATE CSE topics and subtopics
const KEYWORD_PYQ_RULES: { keywords: string[]; pyq: number }[] = [
  // COA
  { keywords: ['cache mapping', 'address bits', 'tag bit', 'set index', 'offset'], pyq: 42 },
  { keywords: ['amat', 'average memory access', 'hierarchical memory'], pyq: 27 },
  { keywords: ['cache memory', 'direct mapping', 'set associative'], pyq: 69 },
  { keywords: ['pipeline speedup', 'throughput', 'clock period'], pyq: 24 },
  { keywords: ['data hazard', 'forwarding', 'operand forwarding', 'raw hazard', 'stall'], pyq: 15 },
  { keywords: ['pipelining', 'pipeline'], pyq: 39 },
  { keywords: ['machine instruction', 'instruction cycle'], pyq: 21 },
  { keywords: ['addressing mode', 'effective address'], pyq: 19 },
  { keywords: ['microprogramming', 'microinstruction', 'control unit'], pyq: 12 },
  { keywords: ['instruction format', 'expanding opcode'], pyq: 11 },
  { keywords: ['interrupt', 'vectored interrupt'], pyq: 10 },
  { keywords: ['dma', 'direct memory access', 'cycle stealing'], pyq: 8 },
  { keywords: ['io handling', 'memory-mapped i/o'], pyq: 8 },
  { keywords: ['data path', 'alu control'], pyq: 7 },

  // Computer Networks
  { keywords: ['vlsm', 'variable length subnet', 'subnet allocation'], pyq: 12 },
  { keywords: ['longest prefix', 'route aggregation', 'supernet'], pyq: 9 },
  { keywords: ['subnetting', 'cidr', 'subnet mask'], pyq: 21 },
  { keywords: ['tcp', '3-way handshake', 'transmission control protocol'], pyq: 20 },
  { keywords: ['stop & wait', 'stop and wait', 'efficiency eta'], pyq: 6 },
  { keywords: ['go-back-n', 'gbn', 'go back n'], pyq: 6 },
  { keywords: ['selective repeat', 'selective-repeat'], pyq: 4 },
  { keywords: ['sliding window', 'window size', 'flow control'], pyq: 16 },
  { keywords: ['routing', 'link state', 'dijkstra', 'ospf'], pyq: 14 },
  { keywords: ['application layer', 'dns', 'http', 'smtp', 'dhcp'], pyq: 13 },
  { keywords: ['ip packet', 'ipv4 header', 'fragmentation offset'], pyq: 12 },
  { keywords: ['network protocol', 'arp', 'icmp', 'nat', 'ipv6'], pyq: 11 },
  { keywords: ['congestion control', 'slow start', 'aimd', 'fast recovery'], pyq: 9 },
  { keywords: ['distance vector', 'count-to-infinity', 'split horizon'], pyq: 8 },
  { keywords: ['crc', 'cyclic redundancy', 'crc modulo'], pyq: 5 },
  { keywords: ['error detection', 'checksum', 'hamming distance', 'parity'], pyq: 8 },
  { keywords: ['ip addressing', 'classful addressing'], pyq: 8 },
  { keywords: ['mac', 'medium access', 'aloha', 'csma/cd'], pyq: 7 },

  // DBMS
  { keywords: ['sql (select clauses', 'structured query language', 'select clauses, group by'], pyq: 58 },
  { keywords: ['database normalization', 'functional dependencies, canonical minimal cover'], pyq: 56 },
  { keywords: ['relational algebra (selection', 'relational algebra', 'relational division'], pyq: 33 },
  { keywords: ['b tree (order p', 'b tree & b+ tree', 'b+ tree order p'], pyq: 32 },
  { keywords: ['transaction and concurrency', 'acid properties, serializability schedules'], pyq: 27 },
  { keywords: ['indexing (primary', 'dense vs sparse index structures', 'indexing in dbms'], pyq: 15 },
  { keywords: ['relational calculus (tuple', 'relational calculus', 'domain relational calculus (drc)'], pyq: 13 },
  { keywords: ['conflict serializable', 'conflict operations (r-w, w-r'], pyq: 12 },
  { keywords: ['er diagram', 'entity-relationship models, cardinality'], pyq: 12 },
  { keywords: ['candidate key', 'attribute closure x+ algorithms'], pyq: 7 },
  { keywords: ['joins (inner join', 'joins in dbms', 'natural join truth tables'], pyq: 7 },
  { keywords: ['referential integrity', 'foreign key constraints, cascade delete'], pyq: 6 },
  { keywords: ['functional dependency (fd)', 'armstrong axioms derivation', 'fd closure'], pyq: 3 },
  { keywords: ['natural join (natural join', 'natural join query operations'], pyq: 3 },
  { keywords: ['query (nested queries', 'correlated subqueries in sql'], pyq: 3 },
  { keywords: ['tuple relational calculus (trc)', 'trc existential and universal'], pyq: 3 },
  { keywords: ['relational model (relational', 'relational database schema constraints'], pyq: 2 },
  { keywords: ['armstrong axioms', 'reflexivity, augmentation, transitivity'], pyq: 1 },
  { keywords: ['database design', 'conceptual and logical database design'], pyq: 1 },
  { keywords: ['database schema', 'relational schema definitions, ddl'], pyq: 1 },
  { keywords: ['decomposition (lossless', 'lossless join test and dependency'], pyq: 1 },
  { keywords: ['multivalued dependency 4nf', 'fourth normal form, mvd'], pyq: 1 },
  { keywords: ['normal forms (1nf, 2nf', 'identifying normal forms 1nf 2nf 3nf'], pyq: 1 },
  { keywords: ['safe query', 'domain relational calculus safety conditions'], pyq: 1 },
  { keywords: ['super key', 'minimal super key and candidate key'], pyq: 1 },
  { keywords: ['timestamp ordering', 'thomas write rule, timestamp ordering protocol'], pyq: 1 },
  { keywords: ['two phase locking protocol', '2pl, strict 2pl, rigorous 2pl'], pyq: 1 },

  // Digital Logic
  { keywords: ['number representation', '2s complement arithmetic', 'signed magnitude representation'], pyq: 57 },
  { keywords: ['circuit output analysis', 'circuit output', 'propagation delay'], pyq: 40 },
  { keywords: ['boolean algebra theorems', 'boolean algebra', 'consensus theorem'], pyq: 34 },
  { keywords: ['digital counter', 'synchronous and asynchronous (ripple) counters', 'mod-n counter'], pyq: 18 },
  { keywords: ['k map minimization', 'k-map minimization', 'karnaugh map grouping'], pyq: 17 },
  { keywords: ['min sum of products form', 'minimal sum-of-products'], pyq: 16 },
  { keywords: ['ieee 754 floating point representation', 'ieee representation', 'ieee 754 floating point standard'], pyq: 14 },
  { keywords: ['multiplexer', 'multiplexers & mux tree', '4:1 mux', '8:1 mux'], pyq: 14 },
  { keywords: ['canonical normal form', 'minterms (m-notation)'], pyq: 10 },
  { keywords: ['adder & subtractor circuits', 'carry look-ahead adder', 'full adder ripple carry'], pyq: 9 },
  { keywords: ['flip-flops & timing', 'race-around condition'], pyq: 8 },
  { keywords: ['floating point representation', 'ieee 754 float conversion', 'exponent bias excess-127'], pyq: 8 },
  { keywords: ['booths algorithm', 'booth multiplier', 'booth recording'], pyq: 7 },
  { keywords: ['digital circuits', 'logic gate networks', 'circuit delay propagation'], pyq: 7 },
  { keywords: ['flip flop', 'sr, jk, d, t flip-flop truth tables'], pyq: 7 },
  { keywords: ['functional completeness', 'nand/nor universal gate set'], pyq: 7 },
  { keywords: ['min no gates', 'minimum number of 2-input nand/nor gates'], pyq: 6 },
  { keywords: ['memory interfacing', 'chip select address decoding', 'ram/rom capacity expansion'], pyq: 5 },
  { keywords: ['finite state machines', 'mealy and moore sequential circuits'], pyq: 4 },
  { keywords: ['rom (read only memory', 'rom / pla / pal programmable logic'], pyq: 4 },
  { keywords: ['synchronous asynchronous circuits', 'clock skew', 'asynchronous state transitions'], pyq: 4 },
  { keywords: ['decoder (binary decoder', 'decoder with enable lines', '3-to-8 decoder'], pyq: 3 },
  { keywords: ['array multiplier', 'combinational array multiplier cell delay'], pyq: 2 },
  { keywords: ['carry generator', 'carry generate g = a*b and propagate p = a^b'], pyq: 2 },
  { keywords: ['combinational circuit (multi-level', 'combinational circuit delay'], pyq: 2 },
  { keywords: ['fixed point representation', 'signed integer and fractional fixed point'], pyq: 2 },
  { keywords: ['min products of sum form', 'minimal product-of-sums (pos)'], pyq: 2 },
  { keywords: ['prime implicants', 'essential prime implicants finding'], pyq: 2 },
  { keywords: ['shift registers', 'siso, sipo, piso, pipo universal shift'], pyq: 2 },
  { keywords: ['binary codes', 'gray code, excess-3, bcd 8421'], pyq: 1 },
  { keywords: ['conjunctive normal form (cnf)', 'product of maxterms conversion'], pyq: 1 },
  { keywords: ['dual function', 'self-dual function property', 'duality principle'], pyq: 1 },
  { keywords: ['little endian big endian', 'byte ordering in memory addresses'], pyq: 1 },
  { keywords: ['number system (base r conversion', 'radix complement conversions'], pyq: 1 },
  { keywords: ['reduction (state reduction', 'implication chart method'], pyq: 1 },
  { keywords: ['ripple counter operation', 'asynchronous ripple counter propagation delay'], pyq: 1 },
  { keywords: ['static hazard', 'static-0 and static-1 hazard elimination'], pyq: 1 },

  // Operating Systems
  { keywords: ['process synchronization (peterson', 'critical section criteria (mutual exclusion'], pyq: 52 },
  { keywords: ['process scheduling (fcfs', 'cpu scheduling algorithms (fcfs'], pyq: 49 },
  { keywords: ['virtual memory (demand paging', 'virtual memory', 'demand paging, translation lookaside buffer'], pyq: 43 },
  { keywords: ['page replacement (fifo', 'page replacement', 'fifo, lru, optimal page replacement'], pyq: 31 },
  { keywords: ['disk (disk geometry', 'disk management & unix inodes', 'unix inode block pointer'], pyq: 30 },
  { keywords: ['resource allocation (deadlock', 'resource allocation', 'banker algorithm for safety'], pyq: 27 },
  { keywords: ['disk scheduling', 'fcfs, sstf, scan (elevator)'], pyq: 16 },
  { keywords: ['semaphore (counting', 'semaphore', 'counting and binary semaphore values'], pyq: 11 },
  { keywords: ['threads (user-level', 'threads', 'user-level threads vs kernel-level'], pyq: 10 },
  { keywords: ['memory management (single-level', 'memory management', 'page table base register (ptbr)'], pyq: 9 },
  { keywords: ['fork system call', 'fork() process creation'], pyq: 8 },
  { keywords: ['file system (directory', 'file system', 'file control blocks'], pyq: 7 },
  { keywords: ['io handling', 'programmed i/o, interrupt-driven'], pyq: 7 },
  { keywords: ['interrupts (hardware', 'interrupts', 'interrupt service routines (isr)'], pyq: 6 },
  { keywords: ['process (5-state', '5-state process model'], pyq: 5 },
  { keywords: ['context switch', 'dispatcher latency'], pyq: 4 },
  { keywords: ['deadlock prevention avoidance detection', 'negating coffman conditions'], pyq: 4 },
  { keywords: ['demand paging (pure', 'pure demand paging'], pyq: 3 },
  { keywords: ['os protection', 'privileged instructions, dual-mode'], pyq: 3 },
  { keywords: ['precedence graph', 'task precedence graphs'], pyq: 3 },
  { keywords: ['bankers algorithm', 'need = max - allocation'], pyq: 2 },
  { keywords: ['translation lookaside buffer (tlb)', 'tlb hit ratio'], pyq: 2 },
  { keywords: ['best fit', 'best fit, first fit, worst fit'], pyq: 1 },
  { keywords: ['dma (direct memory', 'direct memory access controller architecture'], pyq: 1 },
  { keywords: ['input output (memory-mapped', 'port-mapped (isolated) i/o'], pyq: 1 },
  { keywords: ['inter process communication', 'shared memory architecture, message passing'], pyq: 1 },
  { keywords: ['least recently used (lru)', 'lru stack and counter'], pyq: 1 },
  { keywords: ['linked allocation (linked list', 'file allocation table (fat)'], pyq: 1 },
  { keywords: ['multilevel paging', 'hierarchical paging, outer page table'], pyq: 1 },
  { keywords: ['resource allocation graph (rag)', 'rag cycle detection'], pyq: 1 },
  { keywords: ['round robin scheduling', 'time quantum sizing'], pyq: 1 },
  { keywords: ['srtf (shortest remaining', 'shortest remaining time first preemptive'], pyq: 1 },
  { keywords: ['system calls (system call interface', 'standard system calls exec()'], pyq: 1 },

  // Algorithms
  { keywords: ['identify function & algorithm trace', 'identify function and algorithm trace'], pyq: 38 },
  { keywords: ['recurrence relations in algorithms', 'master theorem cases'], pyq: 36 },
  { keywords: ['minimum spanning tree (kruskal', 'minimum spanning tree'], pyq: 35 },
  { keywords: ['time complexity & loop analysis', 'time complexity and loop analysis'], pyq: 31 },
  { keywords: ['graph search (bfs & dfs)', 'graph search (bfs and dfs)'], pyq: 23 },
  { keywords: ['asymptotic notations', 'asymptotic notation'], pyq: 22 },
  { keywords: ['comparison-based sorting', 'comparison lower bound omega(n log n)'], pyq: 22 },
  { keywords: ['quick sort (partitioning', 'quick sort'], pyq: 15 },
  { keywords: ['shortest path algorithms', 'dijkstra shortest path o((v+e)log v)'], pyq: 11 },
  { keywords: ['dynamic programming fundamentals', 'dynamic programming fundamentals & optimal'], pyq: 10 },
  { keywords: ['class p, np, np-complete', 'np-completeness'], pyq: 8 },

  // TOC
  { keywords: ['finite automata (dfa and nfa', 'dfa and nfa state machines', 'subset construction'], pyq: 43 },
  { keywords: ['context free language (cfl', 'context-free language', 'inherently ambiguous languages'], pyq: 35 },
  { keywords: ['regular language (properties', 'properties of regular languages', 'regular language'], pyq: 35 },
  { keywords: ['identify class of language', 'determining whether a given language l is regular'], pyq: 31 },
  { keywords: ['decidability (decidable', 'decidable vs undecidable problems', 'halting problem, rice theorem'], pyq: 30 },
  { keywords: ['regular expression (regex', 'regex identities, arden theorem', 'regular expression'], pyq: 29 },
  { keywords: ['minimal state automata', 'dfa state minimization algorithm', 'myhill-nerode'], pyq: 25 },
  { keywords: ['recursive and recursively enumerable', 'recursive and re languages', 'total turing machines'], pyq: 16 },
  { keywords: ['pushdown automata (pda', 'pushdown automata', 'acceptance by empty stack'], pyq: 15 },
  { keywords: ['closure property in toc', 'closure properties in toc', 'closure table under union'], pyq: 10 },
  { keywords: ['non determinism', 'nfa with epsilon transitions', 'subset construction power set 2^q'], pyq: 6 },
  { keywords: ['countable uncountable set in toc', 'cantor diagonalization in toc'], pyq: 3 },
  { keywords: ['regular grammar', 'right linear and left linear grammars'], pyq: 3 },
  { keywords: ['context free grammar (cfg', 'cfg production rules, derivation trees, ambiguity'], pyq: 2 },
  { keywords: ['number of states', 'minimum number of states in dfa'], pyq: 2 },
  { keywords: ['pumping lemma (pumping lemma', 'pumping lemma for regular languages', 'pumping length'], pyq: 2 },
  { keywords: ['reduction in toc', 'mapping reduction a <=m b', 'undecidability reduction proofs'], pyq: 2 },
  { keywords: ['dpda (deterministic pda', 'deterministic pushdown automata, dcfl vs cfl'], pyq: 1 },
  { keywords: ['finite state machines in toc', 'mealy and moore machines with outputs'], pyq: 1 },
  { keywords: ['medium (medium-level', 'medium language complexity recognizer'], pyq: 1 },
  { keywords: ['turing machine (single tape', 'turing machine transition function delta'], pyq: 1 },

  // Data Structures
  { keywords: ['binary tree', 'traversal', 'inorder', 'preorder', 'postorder'], pyq: 53 },
  { keywords: ['bst', 'binary search tree', 'inorder successor'], pyq: 36 },
  { keywords: ['binary heap', 'min-heap', 'max-heap', 'heapify'], pyq: 30 },
  { keywords: ['linked list', 'doubly linked', 'circular linked', 'floyd cycle'], pyq: 24 },
  { keywords: ['stack', 'postfix', 'infix to postfix'], pyq: 19 },
  { keywords: ['hashing', 'linear probing', 'quadratic probing', 'chaining'], pyq: 15 },
  { keywords: ['queue', 'circular queue', 'deque'], pyq: 15 },
  { keywords: ['array', 'row major', 'column major'], pyq: 13 },
  { keywords: ['general tree', 'n-ary tree'], pyq: 13 },
  { keywords: ['avl tree', 'balance factor', 'rotations'], pyq: 6 },

  // Compiler Design
  { keywords: ['grammar', 'context free grammar', 'left recursion'], pyq: 47 },
  { keywords: ['parsing', 'll(1)', 'first and follow'], pyq: 22 },
  { keywords: ['runtime environment', 'activation record', 'scoping'], pyq: 22 },
  { keywords: ['lr parser', 'slr', 'lalr', 'clr', 'shift-reduce'], pyq: 20 },
  { keywords: ['syntax directed', 'sdt', 's-attributed', 'l-attributed'], pyq: 19 },
  { keywords: ['parameter passing', 'pass by value', 'pass by reference'], pyq: 14 },
  { keywords: ['compilation phases', 'lexical analysis'], pyq: 13 },
  { keywords: ['intermediate code', '3-address code', 'tac', 'basic block'], pyq: 11 },
  { keywords: ['assembler', 'macro'], pyq: 9 },
  { keywords: ['operator precedence'], pyq: 9 },

  // Discrete Mathematics
  { keywords: ['combinatory', 'permutation', 'combination', 'inclusion-exclusion'], pyq: 18 },
  { keywords: ['balls in bins', 'stars and bars'], pyq: 6 },
  { keywords: ['generating function', 'generating functions'], pyq: 6 },
  { keywords: ['summation', 'sum of powers'], pyq: 4 },
  { keywords: ['pigeonhole', 'pigeonhole principle'], pyq: 2 },
  { keywords: ['graph connectivity', 'eulerian', 'hamiltonian', 'cut vertex'], pyq: 40 },
  { keywords: ['degree of graph', 'handshaking lemma'], pyq: 13 },
  { keywords: ['graph planarity', 'planar graph', 'euler formula'], pyq: 13 },
  { keywords: ['graph coloring', 'chromatic number'], pyq: 11 },
  { keywords: ['graph isomorphism'], pyq: 4 },
  { keywords: ['graph matching', 'hall marriage'], pyq: 2 },
  { keywords: ['graph algorithm', 'graph algorithms'], pyq: 1 },
  { keywords: ['jaccard', 'jaccard coefficient'], pyq: 1 },
  { keywords: ['propositional logic', 'tautology', 'truth table'], pyq: 40 },
  { keywords: ['first order logic', 'quantifier', 'predicate'], pyq: 35 },
  { keywords: ['logical reasoning in math', 'mathematical logical reasoning'], pyq: 3 },
  { keywords: ['relations', 'equivalence relation', 'partial order'], pyq: 38 },
  { keywords: ['group theory', 'subgroup', 'cyclic group', 'abelian'], pyq: 33 },
  { keywords: ['functions in discrete', 'injective', 'surjective', 'bijective', 'onto'], pyq: 30 },
  { keywords: ['set theory', 'power set', 'cartesian product'], pyq: 27 },
  { keywords: ['lattice', 'poset', 'hasse diagram'], pyq: 10 },
  { keywords: ['binary operation'], pyq: 8 },
  { keywords: ['number theory', 'modular arithmetic', 'gcd'], pyq: 7 },

  // Engineering Mathematics
  { keywords: ['eigen value', 'eigen vector', 'characteristic equation'], pyq: 33 },
  { keywords: ['matrix', 'orthogonal matrix', 'symmetric matrix'], pyq: 24 },
  { keywords: ['system of equations', 'rank(a)', 'consistency'], pyq: 17 },
  { keywords: ['determinant', 'inverse matrix'], pyq: 12 },
  { keywords: ['rank of matrix', 'rank-nullity'], pyq: 7 },
  { keywords: ['vector space', 'basis and dimension'], pyq: 7 },
  { keywords: ['lu decomposition', 'lu factorization'], pyq: 3 },
  { keywords: ['orthonormality', 'gram-schmidt', 'orthogonal projection'], pyq: 2 },
  { keywords: ['statistics & regression', 'statistics', 'correlation coefficient'], pyq: 2 },
  { keywords: ['cartesian coordinates', 'cartesian coordinate'], pyq: 1 },
  { keywords: ['probability', 'sample space'], pyq: 31 },
  { keywords: ['expectation', 'variance', 'expected value'], pyq: 15 },
  { keywords: ['conditional probability', 'bayes'], pyq: 14 },
  { keywords: ['uniform distribution'], pyq: 11 },
  { keywords: ['random variable', 'cdf', 'pdf'], pyq: 10 },
  { keywords: ['binomial distribution'], pyq: 6 },
  { keywords: ['exponential distribution', 'memoryless'], pyq: 6 },
  { keywords: ['independent events', 'statistical independence'], pyq: 6 },
  { keywords: ['poisson distribution'], pyq: 5 },
  { keywords: ['normal distribution', 'gaussian'], pyq: 4 },
  { keywords: ['limits', 'l\'hopital', 'limit'], pyq: 15 },
  { keywords: ['maxima minima', 'hessian', 'extrema'], pyq: 14 },
  { keywords: ['continuity', 'intermediate value'], pyq: 11 },
  { keywords: ['differentiation', 'partial derivative', 'gradient'], pyq: 11 },
  { keywords: ['definite integral', 'definite integrals'], pyq: 4 },
  { keywords: ['integration', 'indefinite integral'], pyq: 11 },

  // General Aptitude
  { keywords: ['most appropriate word', 'contextual vocabulary fill-in-the-blanks'], pyq: 47 },
  { keywords: ['passage reading', 'reading comprehension passages'], pyq: 23 },
  { keywords: ['permutations & combinations in ga', 'permutations, combinations and counting principles'], pyq: 24 },
  { keywords: ['time & work', 'work and wages, pipes and cisterns'], pyq: 21 },
  { keywords: ['geometry & mensuration', 'triangles, circles, 2d/3d mensuration areas'], pyq: 19 },
  { keywords: ['speed time & distance', 'trains, boats and streams, relative speed'], pyq: 18 },
  { keywords: ['number systems & divisibility', 'divisibility rules, unit digits, remainders'], pyq: 17 },
  { keywords: ['probability in ga', 'coin/dice/card probability word problems'], pyq: 17 },
  { keywords: ['verbal reasoning', 'critical reasoning, strengthening and weakening'], pyq: 15 },
  { keywords: ['algebraic equations', 'linear and simultaneous equations, word problems'], pyq: 15 },
  { keywords: ['word pairs', 'semantic word pair relationships'], pyq: 14 },
  { keywords: ['synonyms', 'identifying word meanings and synonyms'], pyq: 13 },
  { keywords: ['profit and loss', 'cost price, selling price, marked price, discount'], pyq: 12 },
  { keywords: ['progressions (ap & gp)', 'arithmetic and geometric progressions'], pyq: 12 },
  { keywords: ['sentence completion & cloze test', 'cloze test grammar completions'], pyq: 11 },
  { keywords: ['numerical computation', 'arithmetic fractions, decimals, powers, roots'], pyq: 9 },
  { keywords: ['ratio proportion', 'direct/inverse proportion, mixture problems'], pyq: 9 },
  { keywords: ['tenses', 'past, present, future tenses, perfect continuous'], pyq: 9 },
  { keywords: ['percentage', 'percentage increase/decrease, successive percentage'], pyq: 8 },
  { keywords: ['simple & compound interest', 'si and ci difference formulas'], pyq: 8 },
  { keywords: ['antonyms', 'opposite words, antonyms in context'], pyq: 7 },
  { keywords: ['functions in ga', 'domain, range, composition of functions'], pyq: 7 },
  { keywords: ['tabular data', 'interpreting tables, bar charts, pie charts'], pyq: 7 },
  { keywords: ['venn diagram', '2-set and 3-set venn diagram word problems'], pyq: 7 },
  { keywords: ['statements follow', 'logical conclusions from statements, syllogism'], pyq: 7 },
  { keywords: ['logarithms', 'logarithm identities: log(ab) = log a + log b'], pyq: 6 },
  { keywords: ['quadratic equations', 'roots of quadratic equation, discriminant'], pyq: 6 },
  { keywords: ['grammatical error', 'spotting errors in sentence clauses, prepositions'], pyq: 6 },
  { keywords: ['prepositions & conjunctions', 'correct preposition and connective usage'], pyq: 6 },
  { keywords: ['absolute value', 'modulus equations |x - a| <= b'], pyq: 5 },
  { keywords: ['direction sense', 'compass navigation problems, displacement'], pyq: 5 },
  { keywords: ['english grammar', 'subject-verb agreement, modifiers, parallelism'], pyq: 5 },
  { keywords: ['incorrect sentence part', 'sentence correction, faulty grammatical fragments'], pyq: 5 },
  { keywords: ['paper folding', 'visualizing crease patterns and holes'], pyq: 5 },
  { keywords: ['blood relations & family tree', 'family tree generation diagrams'], pyq: 4 },
  { keywords: ['patterns in two dimensions', '2d geometric transformations, tessellations'], pyq: 4 },
  { keywords: ['idioms & phrases', 'idiomatic expressions and figurative meanings'], pyq: 4 },
  { keywords: ['sequence series', 'number and letter sequence completion'], pyq: 3 },
  { keywords: ['seating arrangements & puzzles', 'linear and circular seating arrangements'], pyq: 3 },
  { keywords: ['image rotation', 'clockwise and counter-clockwise angular rotations'], pyq: 3 },
  { keywords: ['patterns in three dimensions', 'cube surface unrolling, dice nets'], pyq: 3 },
  { keywords: ['age relation', 'algebraic age relationship word equations'], pyq: 2 },
  { keywords: ['code words', 'letter substitution ciphers, code transformations'], pyq: 2 },
  { keywords: ['odd one', 'classification of numbers, words, and shapes'], pyq: 2 },
  { keywords: ['passage reading in analytical', 'analytical passage reading and inference'], pyq: 2 },
  { keywords: ['3d structure', 'combining 3d polyhedra, orthographic views'], pyq: 1 },
  { keywords: ['assembling pieces', 'fitting irregular pieces together to form complete shapes'], pyq: 1 },
  { keywords: ['assembling', 'mental assembly of disjointed 2d/3d parts'], pyq: 1 },
  { keywords: ['mirror image', 'lateral inversion reflections along axes'], pyq: 1 },
  { keywords: ['analogy in analytical', 'identifying analogical relationships and completing pairs'], pyq: 1 },
  { keywords: ['coding decoding', 'decoding encrypted messages using letter-position'], pyq: 1 },
];

/**
 * Universal authoritative resolver for Topic & Subtopic PYQ counts.
 * Checks explicit attributes, catalog database, keyword rules, and parent/child hierarchies.
 */
export function getAuthoritativeTopicPYQ(
  topicOrNode: Topic | TopicTreeNodeType,
  allTopics: Topic[] = []
): number {
  // 1. If this is a tree node with children, it is a parent topic.
  //    Parent PYQ count is STRICTLY and ALWAYS equal to the sum of all its subtopics.
  if ('children' in topicOrNode && Array.isArray((topicOrNode as any).children) && (topicOrNode as any).children.length > 0) {
    return (topicOrNode as any).children.reduce(
      (acc: number, c: any) => acc + getAuthoritativeTopicPYQ(c, allTopics),
      0
    );
  }

  // 2. If it has children in allTopics, it is a parent topic.
  //    Parent PYQ count is STRICTLY and ALWAYS equal to the sum of all its subtopics.
  if (allTopics.length > 0) {
    const children = allTopics.filter((t) => t.Parent_Id === topicOrNode.id);
    if (children.length > 0) {
      return children.reduce(
        (acc, c) => acc + getAuthoritativeTopicPYQ(c, allTopics),
        0
      );
    }
  }

  // 3. Direct explicit count (leaf topics only — no children above)
  if (typeof topicOrNode.Topic_PYQ_Count === 'number' && topicOrNode.Topic_PYQ_Count > 0) {
    return topicOrNode.Topic_PYQ_Count;
  }


  // 4. Initial Sample Dataset match by ID (for leaf topics with no children)
  const fromInitial = initialTopicMap.get(topicOrNode.id)?.Topic_PYQ_Count;
  if (fromInitial && fromInitial > 0) {
    return fromInitial;
  }

  // 5. Keyword / Concept matching (for leaf topics with no children and no catalog entry)
  const nameLower = (topicOrNode.Topic_Name || '').toLowerCase();
  const descLower = (topicOrNode.Topic_Description || '').toLowerCase();
  const text = `${nameLower} ${descLower}`;

  for (const rule of KEYWORD_PYQ_RULES) {
    if (rule.keywords.some((kw) => text.includes(kw.toLowerCase()))) {
      return rule.pyq;
    }
  }

  // 6. Unknown / custom-created topic with no children → return 0, never fabricate counts
  return 0;
}

/**
 * Returns Tailwind class strings for color-coded PYQ badge.
 * 🔴 30+   Ultra High Yield  → red
 * 🟡 15-29 High Yield        → amber/yellow
 * 🟢 1-14  Core Concepts     → emerald/green
 */
export function getPyqBadgeStyle(pyqCount: number): {
  wrapper: string;
  icon: string;
  label: string;
} {
  if (pyqCount >= 30) {
    return {
      wrapper:
        'bg-rose-950/70 border-rose-500/50 shadow-[0_0_12px_rgba(244,63,94,0.3)] ring-1 ring-rose-500/20',
      icon: 'text-rose-400',
      label: 'text-rose-200',
    };
  }
  if (pyqCount >= 15) {
    return {
      wrapper:
        'bg-amber-950/70 border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.25)] ring-1 ring-amber-500/20',
      icon: 'text-amber-400',
      label: 'text-amber-200',
    };
  }
  // 1–14: green
  return {
    wrapper:
      'bg-emerald-950/70 border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.2)] ring-1 ring-emerald-500/20',
    icon: 'text-emerald-400',
    label: 'text-emerald-200',
  };
}
