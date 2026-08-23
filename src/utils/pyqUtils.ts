import { Topic, TopicTreeNodeType } from '../types/topic';
import { PYQYearFilter } from '../types/pyq';
import { getQuestionsForTopic, filterQuestionsByYear } from '../services/pyqService';
import { INITIAL_TOPICS, INITIAL_SUBJECTS } from './sampleData';

const initialTopicMap = new Map(INITIAL_TOPICS.map((t) => [t.id, t]));

// Keyword mapping for GATE CSE topics and subtopics
const KEYWORD_PYQ_RULES: { keywords: string[]; pyq: number }[] = [
  // COA
  { keywords: ['cache memory (cache architecture', 'cache lines, block size, hit ratio in coa', 'cache memory in coa'], pyq: 69 },
  { keywords: ['pipelining (pipeline stages', 'instruction pipeline execution in coa', 'pipelining in coa'], pyq: 39 },
  { keywords: ['machine instruction (instruction types', 'opcodes and operands in coa'], pyq: 21 },
  { keywords: ['addressing modes (immediate', 'effective address calculation in coa'], pyq: 19 },
  { keywords: ['microprogramming (horizontal', 'vertical microprogramming, control store in coa'], pyq: 12 },
  { keywords: ['instruction format (fixed length', 'variable length, expanding opcode in coa'], pyq: 11 },
  { keywords: ['interrupts (hardware interrupts', 'vectored vs non-vectored interrupts in coa'], pyq: 10 },
  { keywords: ['dma (direct memory access', 'cycle stealing, burst mode in coa'], pyq: 8 },
  { keywords: ['io handling (programmed i/o', 'interrupt-driven i/o, memory-mapped i/o in coa'], pyq: 8 },
  { keywords: ['data path (alu, datapath buses', 'register transfer in coa'], pyq: 7 },
  { keywords: ['instruction execution (fetch', 'decode, execute, memory access cycles in coa'], pyq: 7 },
  { keywords: ['memory interfacing (address decoding', 'chip select, memory expansion in coa'], pyq: 6 },
  { keywords: ['speedup (pipeline speedup', 'speedup s = non-pipelined time / pipelined time in coa'], pyq: 6 },
  { keywords: ['direct mapping (direct mapped cache', 'line index tag calculation in coa'], pyq: 5 },
  { keywords: ['data dependency (raw, war, waw', 'read-after-write data dependencies in coa'], pyq: 4 },
  { keywords: ['average memory access time (amat', 'amat = h*tc + (1-h)*tm in coa'], pyq: 3 },
  { keywords: ['virtual memory in coa (tlb', 'virtual memory page tables in coa'], pyq: 3 },
  { keywords: ['cisc risc architecture (cisc vs risc', 'instruction set design comparisons in coa'], pyq: 2 },
  { keywords: ['runtime environment in coa (hardware stack', 'stack pointer and frame pointer in coa'], pyq: 2 },
  { keywords: ['bit vector (bit vector mask', 'bitmask operations in processor registers in coa'], pyq: 1 },
  { keywords: ['conflict misses (cache conflict misses', 'set associative conflict reduction in coa'], pyq: 1 },
  { keywords: ['control unit (hardwired control unit', 'state machine control unit in coa'], pyq: 1 },
  { keywords: ['data hazards (operand forwarding', 'bypassing data hazards in coa'], pyq: 1 },
  { keywords: ['disk in coa (magnetic disk', 'disk seek time and rotational latency in coa'], pyq: 1 },
  { keywords: ['dram (dynamic ram', 'dram refresh cycles and capacitor storage in coa'], pyq: 1 },
  { keywords: ['hazards (structural, data, control', 'pipeline hazard classifications in coa'], pyq: 1 },
  { keywords: ['instruction set architecture (isa', 'isa specifications in coa'], pyq: 1 },
  { keywords: ['stall (pipeline bubble', 'stall cycles due to hazards in coa'], pyq: 1 },

  // Computer Networks
  { keywords: ['subnetting (cidr', 'classless inter-domain routing, subnetting in cn', 'subnet masks'], pyq: 21 },
  { keywords: ['tcp (3-way handshake', 'transmission control protocol header and flags', 'tcp in cn'], pyq: 20 },
  { keywords: ['sliding window (sliding window', 'sliding window protocols in cn', 'go-back-n and selective repeat'], pyq: 16 },
  { keywords: ['routing (link state', 'routing algorithms and graph models in cn'], pyq: 14 },
  { keywords: ['application layer protocols (dns', 'http, dns, smtp, ftp application layer in cn'], pyq: 13 },
  { keywords: ['ip packet (ipv4 packet', 'ip packet header, ttl, fragmentation fields'], pyq: 12 },
  { keywords: ['network protocols (network protocols', 'core network layer protocols in cn'], pyq: 11 },
  { keywords: ['congestion control (tcp slow start', 'aimd congestion avoidance in cn'], pyq: 9 },
  { keywords: ['distance vector routing (bellman-ford', 'count-to-infinity problem in cn'], pyq: 8 },
  { keywords: ['error detection (parity', 'error detection and correction techniques in cn'], pyq: 8 },
  { keywords: ['ip addressing (classful', 'ipv4 addressing boundaries and classes in cn'], pyq: 8 },
  { keywords: ['ethernet (ieee 802.3', 'ethernet frame format, min frame size in cn'], pyq: 7 },
  { keywords: ['lan technologies (local area network', 'token ring and lan technologies in cn'], pyq: 7 },
  { keywords: ['csma cd (csma/cd', 'csma cd minimum frame length formula in cn'], pyq: 6 },
  { keywords: ['stop and wait (stop & wait', 'stop and wait flow control efficiency in cn'], pyq: 6 },
  { keywords: ['crc polynomial (crc modulo-2', 'generator polynomial g(x) division in cn'], pyq: 5 },
  { keywords: ['fragmentation (ipv4 fragmentation', 'fragmentation offset calculations in cn'], pyq: 5 },
  { keywords: ['communication (data communication fundamentals', 'transmission modes simplex duplex in cn'], pyq: 4 },
  { keywords: ['mac protocol (medium access control', 'channel allocation mac protocols in cn'], pyq: 4 },
  { keywords: ['network flow (data throughput', 'bottleneck capacity and network flow in cn'], pyq: 4 },
  { keywords: ['network switching (circuit switching', 'packet switching vs message switching in cn'], pyq: 4 },
  { keywords: ['sockets (network socket', 'socket addressing ip:port in cn'], pyq: 4 },
  { keywords: ['udp (user datagram protocol', 'udp connectionless transport in cn'], pyq: 4 },
  { keywords: ['bridges (learning bridges', 'spanning tree bridge forwarding in cn'], pyq: 3 },
  { keywords: ['bit stuffing (framing bit stuffing', 'flag byte 01111110 bit stuffing in cn'], pyq: 2 },
  { keywords: ['hamming code (hamming distance', 'minimum hamming distance error correction in cn'], pyq: 2 },
  { keywords: ['token bucket (traffic policing', 'token bucket and leaky bucket algorithms in cn'], pyq: 2 },
  { keywords: ['wrap around time (tcp sequence', 'sequence number wrap around time in cn'], pyq: 2 },
  { keywords: ['arp (address resolution protocol', 'ip to mac mapping in cn'], pyq: 1 },
  { keywords: ['channel utilization (channel utilization', 'bandwidth-delay efficiency in cn'], pyq: 1 },
  { keywords: ['data communication (analog vs digital', 'baud rate and bit rate in cn'], pyq: 1 },
  { keywords: ['icmp (internet control message', 'ping, traceroute error messages in cn'], pyq: 1 },
  { keywords: ['osi model (7-layer osi', 'osi reference model layer responsibilities in cn'], pyq: 1 },
  { keywords: ['probability in cn (packet drop', 'ber and packet error probability in cn'], pyq: 1 },
  { keywords: ['pure aloha (vulnerable time', 'pure aloha throughput g*e^(-2g) in cn'], pyq: 1 },
  { keywords: ['routing protocols (interior vs exterior', 'rip, ospf, bgp routing protocols in cn'], pyq: 1 },
  { keywords: ['slotted aloha (slotted aloha', 'slotted aloha throughput g*e^(-g) in cn'], pyq: 1 },
  { keywords: ['network layer in cn', 'datagram forwarding and network layer duties in cn'], pyq: 6 },

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
  { keywords: ['identify function in algo', 'identify function & algorithm trace', 'identify function and algorithm trace'], pyq: 38 },
  { keywords: ['recurrence relations in algorithms', 'recurrence relation', 'master theorem cases'], pyq: 36 },
  { keywords: ['minimum spanning tree (kruskal', 'minimum spanning tree'], pyq: 35 },
  { keywords: ['time complexity & loop analysis', 'time complexity and loop analysis', 'time complexity in algo'], pyq: 31 },
  { keywords: ['graph search (bfs & dfs)', 'graph search in algo'], pyq: 23 },
  { keywords: ['asymptotic notations', 'asymptotic notation'], pyq: 22 },
  { keywords: ['sorting in algo', 'comparison-based sorting', 'sorting comparison bounds'], pyq: 22 },
  { keywords: ['quick sort (partitioning', 'quick sort in algo'], pyq: 15 },
  { keywords: ['graph algorithms in algo', 'general graph algorithms'], pyq: 11 },
  { keywords: ['dynamic programming fundamentals', 'dynamic programming in algo'], pyq: 10 },
  { keywords: ['algorithm design techniques', 'greedy vs dynamic vs divide and conquer'], pyq: 9 },
  { keywords: ['algorithm design (algorithm', 'algorithm design fundamentals'], pyq: 8 },
  { keywords: ['searching in algo', 'linear vs binary search algorithms'], pyq: 8 },
  { keywords: ['shortest path (shortest path', 'shortest path in graphs', 'all pairs shortest path'], pyq: 8 },
  { keywords: ['hashing in algo', 'hash tables and collision resolution in algorithms'], pyq: 6 },
  { keywords: ['huffman code (prefix-free', 'huffman coding optimal prefix codes'], pyq: 6 },
  { keywords: ['dijkstras algorithm', 'dijkstra single-source shortest path'], pyq: 5 },
  { keywords: ['greedy algorithms (greedy choice', 'greedy algorithms paradigm'], pyq: 5 },
  { keywords: ['recursion in algo', 'recursion stack tree trace and base conditions'], pyq: 5 },
  { keywords: ['binary search in algo', 'binary search on sorted arrays'], pyq: 4 },
  { keywords: ['merge sort (divide-and-conquer', 'merge sort recursion tree'], pyq: 4 },
  { keywords: ['topological sort (kahn', 'topological sort in dags'], pyq: 4 },
  { keywords: ['binary search tree in algo', 'bst search, insertion and deletion'], pyq: 3 },
  { keywords: ['breadth first search (bfs', 'bfs shortest path in unweighted graphs'], pyq: 3 },
  { keywords: ['matrix chain ordering (mcm', 'matrix chain multiplication ordering'], pyq: 3 },
  { keywords: ['strongly connected components (scc', 'scc kosaraju and tarjan algorithms'], pyq: 3 },
  { keywords: ['bellman ford (bellman-ford', 'bellman ford negative weight cycles'], pyq: 2 },
  { keywords: ['depth first search (dfs', 'dfs edge classification'], pyq: 2 },
  { keywords: ['directed acyclic graph in algo', 'dag properties and dependencies'], pyq: 2 },
  { keywords: ['double hashing (h(k,i', 'double hashing collision resolution'], pyq: 2 },
  { keywords: ['heap sort (build-heap', 'heap sort in-place sorting'], pyq: 2 },
  { keywords: ['insertion sort (insertion', 'insertion sort adaptive algorithm'], pyq: 2 },
  { keywords: ['inversion in array', 'inversion count in arrays'], pyq: 2 },
  { keywords: ['linear probing (open addressing', 'linear probing primary clustering'], pyq: 2 },
  { keywords: ['merging (merge two sorted', 'merging sorted arrays'], pyq: 2 },
  { keywords: ['prims algorithm (prim', 'prim algorithm for mst'], pyq: 2 },
  { keywords: ['selection sort (selection', 'selection sort minimum swaps'], pyq: 2 },
  { keywords: ['binary heap in algo', 'min-heap and max-heap array representations'], pyq: 1 },
  { keywords: ['binary tree in algo', 'binary tree node properties and relations'], pyq: 1 },
  { keywords: ['bubble sort (adjacent swap', 'bubble sort comparisons and passes'], pyq: 1 },
  { keywords: ['computer science fundamentals in algo', 'core algorithmic paradigm'], pyq: 1 },
  { keywords: ['maximum minimum (simultaneous', 'finding max and min in 3n/2 comparisons'], pyq: 1 },
  { keywords: ['number of swap (counting', 'number of swaps in sorting algorithms'], pyq: 1 },
  { keywords: ['space complexity in algo', 'auxiliary space and recursion depth bounds'], pyq: 1 },
  { keywords: ['tree traversal in algo', 'tree traversals in algorithms'], pyq: 1 },
  { keywords: ['uniform hashing (simple uniform', 'simple uniform hashing assumption'], pyq: 1 },

  // Compiler Design
  { keywords: ['grammar (context-free', 'context free grammar rules', 'grammar analysis in cd'], pyq: 47 },
  { keywords: ['parsing (ll(1', 'parsing techniques in compiler design', 'syntax parsing'], pyq: 22 },
  { keywords: ['runtime environment (activation', 'activation records on stack', 'runtime storage management'], pyq: 22 },
  { keywords: ['lr parser (lr(0', 'lr(0), slr(1), lalr(1), clr(1)', 'shift-reduce parser'], pyq: 20 },
  { keywords: ['syntax directed translation (sdt', 's-attributed and l-attributed definitions'], pyq: 19 },
  { keywords: ['parameter passing (pass by value', 'pass by value, pass by reference'], pyq: 14 },
  { keywords: ['compilation phases (lexical', 'compilation phases overview'], pyq: 13 },
  { keywords: ['intermediate code (three-address', 'three-address code (tac), quadruples'], pyq: 11 },
  { keywords: ['assembler (two-pass', 'two-pass assembler design'], pyq: 9 },
  { keywords: ['operator precedence (operator grammars', 'operator precedence parser'], pyq: 9 },
  { keywords: ['code optimization (loop optimization', 'common subexpression elimination, dead code'], pyq: 8 },
  { keywords: ['first and follow (first & follow', 'first and follow set algorithms'], pyq: 6 },
  { keywords: ['lexical analysis (dfa tokenization', 'lexical analysis tokens'], pyq: 6 },
  { keywords: ['register allocation (graph coloring', 'register allocation heuristics'], pyq: 6 },
  { keywords: ['macros in cd', 'macro processors and expanders'], pyq: 4 },
  { keywords: ['linker (relocation', 'linker and loader mechanisms'], pyq: 3 },
  { keywords: ['live variable analysis (data-flow', 'liveness data-flow equations'], pyq: 3 },
  { keywords: ['static single assignment (ssa', 'ssa form and phi functions'], pyq: 3 },
  { keywords: ['ambiguous grammar (identifying', 'ambiguity resolution in cfg'], pyq: 2 },
  { keywords: ['basic blocks (leader identification', 'basic blocks and flow graphs'], pyq: 2 },
  { keywords: ['directed acyclic graph in cd', 'dag representation of basic blocks'], pyq: 2 },
  { keywords: ['expression evaluation in cd', 'syntax tree expression evaluation'], pyq: 2 },
  { keywords: ['ll parser (ll(1) top-down', 'll(1) parsing table conflicts'], pyq: 2 },
  { keywords: ['variable scope (static and dynamic', 'static vs dynamic scoping rules'], pyq: 2 },
  { keywords: ['abstract syntax tree (ast', 'ast tree constructions'], pyq: 1 },
  { keywords: ['backpatching (handling boolean', 'backpatching jump targets'], pyq: 1 },
  { keywords: ['compiler tokenization', 'regular definitions and lexeme generation'], pyq: 1 },
  { keywords: ['symbol table in cd', 'symbol table operations and data structures'], pyq: 1 },
  { keywords: ['viable prefix in parsing', 'viable prefix and valid items'], pyq: 1 },

  // Data Structures
  { keywords: ['binary tree (inorder', 'binary tree traversals & unique reconstruction', 'binary tree in ds'], pyq: 53 },
  { keywords: ['binary search tree (bst', 'bst search, insertion, node deletion'], pyq: 36 },
  { keywords: ['binary heap (min-heap', 'binary heap min-heap max-heap properties', 'binary heap in ds'], pyq: 30 },
  { keywords: ['linked list (singly', 'linked list traversal, floyd cycle'], pyq: 24 },
  { keywords: ['stack (lifo', 'stack data structure operations', 'infix to postfix in ds'], pyq: 19 },
  { keywords: ['queue (fifo', 'queue data structure, circular queue', 'double-ended queue (deque) in ds'], pyq: 15 },
  { keywords: ['hashing (open addressing', 'hash table chaining and probing in ds'], pyq: 15 },
  { keywords: ['array (row-major', 'array data structure, 2d/3d address formulas'], pyq: 13 },
  { keywords: ['tree (general tree', 'general tree structures, n-ary trees'], pyq: 13 },
  { keywords: ['avl tree (avl height', 'avl height balance factor rotations'], pyq: 6 },
  { keywords: ['infix prefix (infix to prefix', 'infix prefix postfix conversions'], pyq: 4 },
  { keywords: ['data structures (abstract data structures', 'data structure primitives and representations'], pyq: 4 },
  { keywords: ['priority queue (min/max', 'priority queue operations with binary heap'], pyq: 2 },
  { keywords: ['abstract data type (adt', 'adt specifications and data encapsulation'], pyq: 1 },
  { keywords: ['time complexity in ds', 'amortized analysis of data structure operations'], pyq: 1 },
  { keywords: ['tree traversal in ds', 'inorder, preorder, postorder, level order tree traversals'], pyq: 1 },
  { keywords: ['uniform hashing in ds', 'simple uniform hashing assumption in data structures'], pyq: 1 },

  // C-Programming
  { keywords: ['programming in c (c language', 'data types, operator precedence, type conversions in c'], pyq: 29 },
  { keywords: ['recursion (recursive', 'recursion in c, call stack execution'], pyq: 19 },
  { keywords: ['pointers (pointer arithmetic', 'pointers to pointers, function pointers in c'], pyq: 15 },
  { keywords: ['array in c (multidimensional', 'multidimensional arrays, pointer equivalence a[i]'], pyq: 13 },
  { keywords: ['parameter passing in c (pass by value', 'simulated pass by reference via pointer'], pyq: 12 },
  { keywords: ['output (evaluating printf', 'evaluating complex print statement outputs in c'], pyq: 9 },
  { keywords: ['loop invariants (loop termination', 'invariant assertions in c loops'], pyq: 8 },
  { keywords: ['identify function in c (deducing', 'deducing mathematical function from c code'], pyq: 6 },
  { keywords: ['structure (memory layout', 'structure padding, sizeof calculations in c'], pyq: 5 },
  { keywords: ['functions in c (function prototypes', 'storage classes, static and extern functions'], pyq: 2 },
  { keywords: ['goto (unconditional jump', 'goto statements and control transfer in c'], pyq: 2 },
  { keywords: ['programming paradigms (imperative', 'procedural vs structured programming in c'], pyq: 2 },
  { keywords: ['strings in c (null-terminated', 'string manipulation and array bounds in c'], pyq: 2 },
  { keywords: ['switch case (fall-through', 'switch statements, break and default in c'], pyq: 2 },
  { keywords: ['aliasing (pointer aliasing', 'restrict qualifier and aliasing side effects in c'], pyq: 1 },
  { keywords: ['programming constructs (block scoping', 'conditional and iteration constructs in c'], pyq: 1 },
  { keywords: ['runtime environment in c (call stack', 'activation record layout for c functions'], pyq: 1 },
  { keywords: ['type checking in c (implicit', 'explicit type casting and promotions in c'], pyq: 1 },
  { keywords: ['union (union overlapping', 'union memory sharing and alignment in c'], pyq: 1 },
  { keywords: ['variable binding (static binding', 'binding time and scope linkage in c'], pyq: 1 },

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
/**
 * Authoritative, dynamic PYQ Count Resolver for any topic or hierarchy node.
 * Checks explicit attributes, catalog database, keyword rules, year filters, and parent/child hierarchies.
 */
export function getAuthoritativeTopicPYQ(
  topicOrNode: Topic | TopicTreeNodeType,
  allTopics: Topic[] = [],
  yearFilter: PYQYearFilter = 'all',
  subjectName?: string
): number {
  if (!topicOrNode) return 0;

  // 1. If this is a tree node with children, it is a parent topic.
  //    Parent PYQ count is STRICTLY and ALWAYS equal to the sum of all its subtopics.
  if ('children' in topicOrNode && Array.isArray((topicOrNode as any).children) && (topicOrNode as any).children.length > 0) {
    return (topicOrNode as any).children.reduce(
      (acc: number, c: any) => acc + getAuthoritativeTopicPYQ(c, allTopics, yearFilter, subjectName),
      0
    );
  }

  // 2. If it has children in allTopics, it is a parent topic.
  //    Parent PYQ count is STRICTLY and ALWAYS equal to the sum of all its subtopics.
  if (allTopics.length > 0) {
    const children = allTopics.filter((t) => t.Parent_Id === topicOrNode.id);
    if (children.length > 0) {
      return children.reduce(
        (acc, c) => acc + getAuthoritativeTopicPYQ(c, allTopics, yearFilter, subjectName),
        0
      );
    }
  }

  // 3. Look up in the authoritative 3,683 GATE PYQ questions database
  const effSubjectName =
    subjectName ||
    INITIAL_SUBJECTS.find((s) => s.id === topicOrNode.Subject_Id)?.Subject_Name ||
    '';

  if (effSubjectName) {
    const matchedQs = getQuestionsForTopic(effSubjectName, topicOrNode.Topic_Name, []);
    if (matchedQs.length > 0) {
      if (yearFilter === 'all') {
        return matchedQs.length;
      }
      return filterQuestionsByYear(matchedQs, yearFilter).length;
    }
  }

  // If a year filter is active and this topic has no questions in the DB for that year
  if (yearFilter !== 'all') {
    return 0;
  }

  // 4. Direct explicit count (leaf topics only — no children above)
  if (typeof topicOrNode.Topic_PYQ_Count === 'number' && topicOrNode.Topic_PYQ_Count > 0) {
    return topicOrNode.Topic_PYQ_Count;
  }

  // 5. Initial Sample Dataset match by ID (for leaf topics with no children)
  const fromInitial = initialTopicMap.get(topicOrNode.id)?.Topic_PYQ_Count;
  if (fromInitial && fromInitial > 0) {
    return fromInitial;
  }

  // 6. Keyword / Concept matching (for leaf topics with no children and no catalog entry)
  const nameLower = (topicOrNode.Topic_Name || '').toLowerCase();
  const descLower = (topicOrNode.Topic_Description || '').toLowerCase();
  const text = `${nameLower} ${descLower}`;

  for (const rule of KEYWORD_PYQ_RULES) {
    if (rule.keywords.some((kw) => text.includes(kw.toLowerCase()))) {
      return rule.pyq;
    }
  }

  // 7. Unknown / custom-created topic with no children → return 0, never fabricate counts
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
