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
  { keywords: ['nested', 'correlated subquery', 'exists', 'subquery'], pyq: 32 },
  { keywords: ['aggregation', 'having', 'group by'], pyq: 26 },
  { keywords: ['sql', 'select clause'], pyq: 58 },
  { keywords: ['3nf', 'bcnf', 'boyce codd', 'superkey'], pyq: 30 },
  { keywords: ['lossless join', 'dependency preservation', 'decomposition'], pyq: 26 },
  { keywords: ['normalization', 'functional dependencies', '1nf', '2nf'], pyq: 56 },
  { keywords: ['relational algebra', 'relational division'], pyq: 33 },
  { keywords: ['b tree', 'b+ tree', 'b-tree', 'b+tree', 'index tree'], pyq: 32 },
  { keywords: ['transaction', 'concurrency', '2pl', 'serializability'], pyq: 27 },
  { keywords: ['indexing', 'dense index', 'sparse index', 'b tree index'], pyq: 15 },
  { keywords: ['relational calculus', 'trc', 'drc'], pyq: 13 },
  { keywords: ['conflict serializable', 'precedence graph'], pyq: 12 },
  { keywords: ['er diagram', 'cardinality ratio'], pyq: 12 },
  { keywords: ['candidate key', 'attribute closure'], pyq: 7 },
  { keywords: ['join', 'inner join', 'outer join', 'joins'], pyq: 7 },

  // Digital Logic
  { keywords: ['number representation', '2s complement arithmetic', 'signed magnitude representation'], pyq: 57 },
  { keywords: ['circuit output analysis', 'circuit output', 'propagation delay'], pyq: 40 },
  { keywords: ['boolean algebra theorems', 'boolean algebra', 'consensus theorem'], pyq: 34 },
  { keywords: ['digital counter', 'synchronous and asynchronous (ripple) counters', 'ripple counter', 'mod-n counter'], pyq: 18 },
  { keywords: ['k map minimization', 'k-map minimization', 'karnaugh map grouping'], pyq: 17 },
  { keywords: ['min sum of products form', 'minimal sum-of-products'], pyq: 16 },
  { keywords: ['ieee 754 floating point representation', 'ieee representation', 'ieee 754 floating point standard'], pyq: 14 },
  { keywords: ['multiplexer', 'multiplexers & mux tree', '4:1 mux', '8:1 mux'], pyq: 14 },
  { keywords: ['canonical normal form', 'minterms (m-notation)'], pyq: 10 },
  { keywords: ['adder & subtractor circuits', 'carry look-ahead adder', 'full adder ripple carry'], pyq: 9 },
  { keywords: ['flip-flops & timing', 'flip-flops', 'race-around condition'], pyq: 8 },

  // Operating Systems
  { keywords: ['peterson algorithm & critical section', 'peterson algorithm race condition'], pyq: 26 },
  { keywords: ['classical synchronization problems', 'producer-consumer (bounded buffer)', 'reader-writer (readers preference'], pyq: 26 },
  { keywords: ['process scheduling (fcfs', 'cpu scheduling algorithms (fcfs'], pyq: 49 },
  { keywords: ['virtual memory, tlb & emat', 'demand paging, translation lookaside buffer (tlb)'], pyq: 43 },
  { keywords: ['page replacement algorithms', 'fifo, lru, optimal page replacement'], pyq: 31 },
  { keywords: ['disk management & unix inodes', 'disk geometry, sector/track', 'unix inode block pointer'], pyq: 30 },
  { keywords: ['resource allocation & banker algorithm', 'resource allocation & deadlocks'], pyq: 27 },
  { keywords: ['disk scheduling algorithms', 'fcfs, sstf, scan (elevator)'], pyq: 16 },
  { keywords: ['semaphores & p/v operations', 'counting semaphore values, concurrent p/v'], pyq: 11 },
  { keywords: ['threads & concurrency', 'user-level threads vs kernel-level'], pyq: 10 },
  { keywords: ['paging & address translation', 'single-level and multi-level paging address translation'], pyq: 9 },

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
  { keywords: ['finite automata', 'dfa', 'nfa', 'subset construction'], pyq: 43 },
  { keywords: ['context free', 'cfg', 'cfl'], pyq: 35 },
  { keywords: ['regular language', 'closure of regular'], pyq: 35 },
  { keywords: ['identify class', 'class of language', 'chomsky'], pyq: 31 },
  { keywords: ['decidability', 'halting problem', 'rice theorem', 'undecidable'], pyq: 30 },
  { keywords: ['regular expression', 'regex', 'arden theorem'], pyq: 29 },
  { keywords: ['minimal state', 'dfa minimization', 'myhill-nerode'], pyq: 25 },
  { keywords: ['recursive and re', 'turing machine'], pyq: 16 },
  { keywords: ['pushdown automata', 'pda', 'dpda'], pyq: 15 },
  { keywords: ['closure property', 'closure properties'], pyq: 10 },

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
  { keywords: ['most appropriate word', 'vocabulary'], pyq: 47 },
  { keywords: ['passage reading', 'reading comprehension'], pyq: 23 },
  { keywords: ['verbal reasoning', 'critical reasoning'], pyq: 15 },
  { keywords: ['word pairs', 'analogy', 'analogies'], pyq: 14 },
  { keywords: ['synonyms', 'synonym'], pyq: 13 },
  { keywords: ['logical reasoning', 'blood relation', 'seating'], pyq: 18 },
  { keywords: ['statements follow', 'syllogism'], pyq: 7 },
  { keywords: ['direction sense', 'compass'], pyq: 5 },
  { keywords: ['sequence series', 'number series'], pyq: 3 },
  { keywords: ['tabular data', 'data interpretation', 'pie chart'], pyq: 7 },
  { keywords: ['venn diagram'], pyq: 7 },
  { keywords: ['paper folding'], pyq: 5 },
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
