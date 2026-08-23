import { Subject } from '../types/subject';
import { Topic } from '../types/topic';
import { Schedule } from '../types/schedule';

export const INITIAL_SUBJECTS: Subject[] = [
  {
    id: 'subj-ga',
    Subject_Name: 'General Aptitude',
    Subject_Importance: 'Urgent', // Fixed 15 Marks (429 PYQs)
    Subject_Description: 'Quantitative arithmetic, logical reasoning syllogisms, spatial pattern folding, and English verbal grammar (429 Historical PYQs).',
    Subject_Color: '#eab308', // Yellow
    Subject_PYQ_Count: 429,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'subj-dm',
    Subject_Name: 'Discrete Mathematics',
    Subject_Importance: 'Urgent', // 390 Combined PYQs
    Subject_Description: 'Propositional & predicate logic, sets, relations, posets, combinatorics, graph theory, and recurrence relations (390 Historical PYQs).',
    Subject_Color: '#a855f7', // Purple
    Subject_PYQ_Count: 390,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 13).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'subj-algo',
    Subject_Name: 'Algorithms',
    Subject_Importance: 'Urgent', // 358 PYQs
    Subject_Description: 'Asymptotic notation, divide and conquer, greedy methods, dynamic programming, Dijkstra shortest paths, MST, and NP-completeness (358 Historical PYQs).',
    Subject_Color: '#14b8a6', // Teal
    Subject_PYQ_Count: 358,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'subj-os',
    Subject_Name: 'Operating Systems',
    Subject_Importance: 'Urgent', // 343 PYQs
    Subject_Description: 'Process lifecycle, CPU scheduling, synchronization semaphores, deadlock avoidance, paging memory management, and disk scheduling (343 Historical PYQs).',
    Subject_Color: '#8b5cf6', // Violet
    Subject_PYQ_Count: 343,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 11).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'subj-dl',
    Subject_Name: 'Digital Logic',
    Subject_Importance: 'High Scoring', // 313 PYQs
    Subject_Description: 'Boolean algebra, K-map minimization, multiplexers, adders, flip-flops, synchronous/asynchronous counters, and 2s complement systems (313 Historical PYQs).',
    Subject_Color: '#f59e0b', // Amber
    Subject_PYQ_Count: 313,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'subj-em',
    Subject_Name: 'Engineering Mathematics',
    Subject_Importance: 'Urgent', // 306 Combined PYQs
    Subject_Description: 'Linear algebra eigenvalues/vectors, matrix rank, calculus maxima/minima, and probability distributions Bayes theorem (306 Historical PYQs).',
    Subject_Color: '#0ea5e9', // Sky Blue
    Subject_PYQ_Count: 306,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'subj-dbms',
    Subject_Name: 'Database Management System',
    Subject_Importance: 'High Scoring', // 302 PYQs
    Subject_Description: 'ER modeling, relational algebra, SQL queries, functional dependencies, 3NF/BCNF normalization, ACID transactions, and B+ trees (302 Historical PYQs).',
    Subject_Color: '#f43f5e', // Rose
    Subject_PYQ_Count: 302,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'subj-toc',
    Subject_Name: 'Theory of Computation',
    Subject_Importance: 'High Scoring', // 293 PYQs
    Subject_Description: 'DFA/NFA minimization, regular expressions, context-free grammars, pushdown automata, Turing machines, and decidability reductions (293 Historical PYQs).',
    Subject_Color: '#ec4899', // Pink
    Subject_PYQ_Count: 293,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'subj-coa',
    Subject_Name: 'Computer Organisation & Architecture',
    Subject_Importance: 'Important', // 251 PYQs
    Subject_Description: 'Instruction formats, addressing modes, pipeline speedup & hazards, cache AMAT mapping, IEEE 754 floats, and DMA I/O transfers (251 Historical PYQs).',
    Subject_Color: '#84cc16', // Lime
    Subject_PYQ_Count: 251,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'subj-cd',
    Subject_Name: 'Compiler Design',
    Subject_Importance: 'Important', // 242 PYQs
    Subject_Description: 'Lexical analysis tokens, LL(1) and LR parsers, syntax-directed translation, three-address code, and basic block optimizations (242 Historical PYQs).',
    Subject_Color: '#6366f1', // Indigo
    Subject_PYQ_Count: 242,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'subj-ds',
    Subject_Name: 'Data Structures',
    Subject_Importance: 'High Scoring', // 238 PYQs
    Subject_Description: 'Arrays, linked lists, stacks, queues, binary trees, BST, AVL balance, binary heaps, graph representations, and hashing tables (238 Historical PYQs).',
    Subject_Color: '#10b981', // Emerald
    Subject_PYQ_Count: 238,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'subj-cn',
    Subject_Name: 'Computer Networks',
    Subject_Importance: 'Important', // 226 PYQs
    Subject_Description: 'OSI/TCP-IP models, IPv4/IPv6 addressing, subnetting, TCP flow/congestion control, routing algorithms, MAC protocols, and security (226 Historical PYQs).',
    Subject_Color: '#06b6d4', // Cyan
    Subject_PYQ_Count: 226,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'subj-prog',
    Subject_Name: 'C-Programming',
    Subject_Importance: 'High Scoring', // 131 PYQs
    Subject_Description: 'Operators precedence, control flow, functions, recursion call stacks, pointer arithmetic, dynamic memory, arrays, and structs (131 Historical PYQs).',
    Subject_Color: '#3b82f6', // Blue
    Subject_PYQ_Count: 131,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Helper to construct structured topics with accurate PYQ counts and verified Star flags
const makeTopic = (
  id: string,
  subjectId: string,
  parentId: string | null,
  name: string,
  description: string,
  order: number,
  isStar: boolean = false,
  pyqCount?: number
): Topic => ({
  id,
  Subject_Id: subjectId,
  Parent_Id: parentId,
  Topic_Name: name,
  Topic_Description: description,
  Topic_Status: 'To Do',
  Topic_Difficulty: isStar ? 'Important' : 'Normal',
  Topic_Study_Hours: 0,
  Topic_PYQ_Count: pyqCount,
  Topic_Order: order,
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
  // 1. COMPUTER ORGANIZATION & ARCHITECTURE (subj-coa) - 251 Total PYQs
  // =========================================================================
  makeTopic('coa-1', 'subj-coa', null, 'Cache Memory', 'Direct, Set-Associative, Fully Associative mapping, tag/set/offset bits, Write policies, and AMAT (69 PYQs).', 1, true, 69),
  makeTopic('coa-1-1', 'subj-coa', 'coa-1', 'Cache Mapping & Address Bits Splitting', 'Tag, Set index, and Word Offset partition formulas.', 1, true, 42),
  makeTopic('coa-1-2', 'subj-coa', 'coa-1', 'Average Memory Access Time (AMAT)', 'Hierarchical vs simultaneous memory access time calculations.', 2, true, 27),

  makeTopic('coa-2', 'subj-coa', null, 'Pipelining & Hazards', 'Instruction pipelining stages, speedup formulas, RAW/WAR/WAW data hazards, branch delays (39 PYQs).', 2, true, 39),
  makeTopic('coa-2-1', 'subj-coa', 'coa-2', 'Pipeline Speedup & Throughput Analysis', 'Speedup S = (n*k)/(k+n-1+stalls), clock period constraints.', 1, true, 24),
  makeTopic('coa-2-2', 'subj-coa', 'coa-2', 'Data Hazards & Operand Forwarding', 'Read-After-Write (RAW) dependency resolution with forwarding paths.', 2, true, 15),

  makeTopic('coa-3', 'subj-coa', null, 'Machine Instruction', 'Instruction execution cycles, opcode decoding, and register transfer operations (21 PYQs).', 3, true, 21),
  makeTopic('coa-4', 'subj-coa', null, 'Addressing Modes', 'Immediate, Direct, Indirect, Indexed, Base Register, and PC-Relative effective address calculations (19 PYQs).', 4, true, 19),
  makeTopic('coa-5', 'subj-coa', null, 'Microprogramming & Control Unit', 'Horizontal vs vertical microinstructions, control store addressing, micro-program sequencing (12 PYQs).', 5, true, 12),
  makeTopic('coa-6', 'subj-coa', null, 'Instruction Format', '0, 1, 2, 3 address instruction formats, expanding opcodes, register and address bit constraints (11 PYQs).', 6, true, 11),
  makeTopic('coa-7', 'subj-coa', null, 'Interrupts', 'Vectored vs non-vectored interrupts, interrupt latency, priority interrupt controllers (10 PYQs).', 7, true, 10),
  makeTopic('coa-8', 'subj-coa', null, 'Direct Memory Access (DMA)', 'DMA controller architecture, cycle stealing mode vs burst mode data transfer bandwidth (8 PYQs).', 8, true, 8),
  makeTopic('coa-9', 'subj-coa', null, 'IO Handling', 'Programmed I/O, interrupt-driven I/O, memory-mapped I/O vs I/O-mapped I/O (8 PYQs).', 9, true, 8),
  makeTopic('coa-10', 'subj-coa', null, 'Data Path Design', 'Single-cycle and multi-cycle datapath, ALU control signals, bus architectures (7 PYQs).', 10, true, 7),

  // =========================================================================
  // 2. COMPUTER NETWORKS (subj-cn) - 226 Total PYQs
  // =========================================================================
  makeTopic('cn-1', 'subj-cn', null, 'Subnetting & CIDR', 'Classless Inter-Domain Routing, prefix matching, subnet mask calculation, and VLSM (21 PYQs).', 1, true, 21),
  makeTopic('cn-1-1', 'subj-cn', 'cn-1', 'VLSM & Variable Length Subnet Allocation', 'Hierarchical prefix distribution, maximizing usable address space.', 1, true, 12),
  makeTopic('cn-1-2', 'subj-cn', 'cn-1', 'Longest Prefix Matching & Route Aggregation', 'Routing table lookups, CIDR supernet aggregation.', 2, true, 9),

  makeTopic('cn-2', 'subj-cn', null, 'TCP Protocol', '3-way handshake connection setup/teardown, sequence/ACK numbering, TCP flags and header fields (20 PYQs).', 2, true, 20),
  makeTopic('cn-3', 'subj-cn', null, 'Sliding Window Protocols', 'Stop-and-Wait, Go-Back-N, Selective Repeat efficiency formulas eta = 1/(1+2a) and window sizing (16 PYQs).', 3, true, 16),
  makeTopic('cn-3-1', 'subj-cn', 'cn-3', 'Stop & Wait Protocol & Efficiency', 'Efficiency eta = 1 / (1 + 2a) where a = Tp / Tt; bandwidth-delay product and optimal packet size.', 1, true, 6),
  makeTopic('cn-3-2', 'subj-cn', 'cn-3', 'Go-Back-N (GBN) Protocol', 'Sender window size Ws = 2^k - 1, receiver window Wr = 1, cumulative ACKs and timer retransmission.', 2, true, 6),
  makeTopic('cn-3-3', 'subj-cn', 'cn-3', 'Selective Repeat Protocol', 'Sender window Ws = 2^(k-1), receiver window Wr = 2^(k-1), independent retransmission and buffer bounds.', 3, true, 4),

  makeTopic('cn-4', 'subj-cn', null, 'Routing Algorithms', 'Link State (Dijkstra / OSPF), Distance Vector, hierarchical routing and autonomous systems (14 PYQs).', 4, true, 14),
  makeTopic('cn-5', 'subj-cn', null, 'Application Layer Protocols', 'DNS iterative/recursive resolution, HTTP/1.1 vs HTTP/2, SMTP, FTP, and DHCP (13 PYQs).', 5, true, 13),
  makeTopic('cn-6', 'subj-cn', null, 'IP Packet & Header', 'IPv4 header fields, TTL expiry, Total Length, and packet fragmentation offset arithmetic (12 PYQs).', 6, true, 12),
  makeTopic('cn-7', 'subj-cn', null, 'Network Protocols', 'ARP address resolution, ICMP error reporting, NAT translation, IPv6 header differences (11 PYQs).', 7, true, 11),
  makeTopic('cn-8', 'subj-cn', null, 'Congestion Control', 'TCP Slow Start, Congestion Avoidance AIMD, Fast Retransmit, Fast Recovery, and threshold halving (9 PYQs).', 8, true, 9),
  makeTopic('cn-9', 'subj-cn', null, 'Distance Vector Routing', 'Bellman-Ford vector updates, Count-to-Infinity problem, split horizon and poison reverse (8 PYQs).', 9, true, 8),
  makeTopic('cn-10', 'subj-cn', null, 'Error Detection & CRC', 'Cyclic Redundancy Check modulo-2 polynomial division, parity checks, Hamming distance (8 PYQs).', 10, true, 8),
  makeTopic('cn-10-1', 'subj-cn', 'cn-10', 'CRC Modulo-2 Polynomial Division', 'Generator polynomial G(x), remainder calculation, detecting burst errors.', 1, true, 5),
  makeTopic('cn-10-2', 'subj-cn', 'cn-10', 'Checksum & Hamming Distance', '1s complement checksum addition, minimum Hamming distance d_min to detect/correct errors.', 2, true, 3),

  makeTopic('cn-11', 'subj-cn', null, 'IP Addressing', 'Classful IPv4 addressing boundaries, special IP ranges, loopback, private IP blocks (8 PYQs).', 11, true, 8),
  makeTopic('cn-12', 'subj-cn', null, 'Medium Access Control (MAC)', 'Pure & Slotted ALOHA throughput formulas, CSMA/CD minimum frame length L >= 2*Tp*B (7 PYQs).', 12, false, 7),

  // =========================================================================
  // 3. DATABASE MANAGEMENT SYSTEM (subj-dbms) - 302 Total PYQs
  // =========================================================================
  makeTopic('db-1', 'subj-dbms', null, 'SQL Queries', 'SELECT clauses, GROUP BY, HAVING, subqueries, nested correlated subqueries, and NULL 3-valued logic (58 PYQs).', 1, true, 58),
  makeTopic('db-1-1', 'subj-dbms', 'db-1', 'Nested & Correlated Subqueries', 'EXISTS / NOT EXISTS, IN / NOT IN, correlated row evaluations.', 1, true, 32),
  makeTopic('db-1-2', 'subj-dbms', 'db-1', 'Aggregations & HAVING Filtering', 'GROUP BY multiple columns, aggregate function semantics.', 2, true, 26),

  makeTopic('db-2', 'subj-dbms', null, 'Database Normalization', '1NF, 2NF, 3NF, BCNF, Functional Dependencies, Canonical Minimal Cover, Lossless Join decomposition (56 PYQs).', 2, true, 56),
  makeTopic('db-2-1', 'subj-dbms', 'db-2', '3NF and BCNF Normal Forms', 'Superkey criteria, prime attributes, identifying highest normal form.', 1, true, 30),
  makeTopic('db-2-2', 'subj-dbms', 'db-2', 'Lossless Join & Dependency Preservation', 'Decomposition validation tests R1 cap R2 -> (R1 - R2).', 2, true, 26),

  makeTopic('db-3', 'subj-dbms', null, 'Relational Algebra', 'Selection, Projection, Join (Natural, Outer, Theta), Cartesian product, and Relational Division (33 PYQs).', 3, true, 33),
  makeTopic('db-4', 'subj-dbms', null, 'B Tree & B+ Tree', 'B/B+ Tree order p, maximum/minimum key bounds, node splits on insertion, disk block I/O calculations (32 PYQs).', 4, true, 32),
  makeTopic('db-5', 'subj-dbms', null, 'Transaction and Concurrency', 'ACID properties, Serializability schedules, View Serializability, Recoverable and Cascadeless schedules, 2PL (27 PYQs).', 5, true, 27),
  makeTopic('db-6', 'subj-dbms', null, 'Indexing', 'Primary, Secondary, Clustered, and Dense vs Sparse index structures and block access costs (15 PYQs).', 6, true, 15),
  makeTopic('db-7', 'subj-dbms', null, 'Relational Calculus', 'Tuple Relational Calculus (TRC), Domain Relational Calculus (DRC), and safety conditions (13 PYQs).', 7, true, 13),
  makeTopic('db-8', 'subj-dbms', null, 'Conflict Serializable', 'Conflict operations (R-W, W-R, W-W), Precedence Graphs cycle detection, equivalent serial order (12 PYQs).', 8, true, 12),
  makeTopic('db-9', 'subj-dbms', null, 'ER Diagram', 'Entity-Relationship models, cardinality ratios, participation constraints, mapping ER to tables (12 PYQs).', 9, true, 12),
  makeTopic('db-10', 'subj-dbms', null, 'Candidate Key', 'Attribute closure X+ algorithms, finding all minimal candidate keys and superkeys (7 PYQs).', 10, true, 7),
  makeTopic('db-11', 'subj-dbms', null, 'Joins in DBMS', 'INNER JOIN, LEFT/RIGHT/FULL OUTER JOIN, natural join truth tables and join algorithms (7 PYQs).', 11, true, 7),

  // =========================================================================
  // 4. DIGITAL LOGIC (subj-dl) - 313 Total PYQs
  // =========================================================================
  makeTopic('dl-1', 'subj-dl', null, 'Number Representation', 'Signed magnitude, 1s complement, 2s complement arithmetic, range formulas, and overflow detection (57 PYQs).', 1, true, 57),
  makeTopic('dl-2', 'subj-dl', null, 'Circuit Output Analysis', 'Tracing outputs of combinational and sequential gate circuits, propagation delays, glitch hazards (40 PYQs).', 2, true, 40),
  makeTopic('dl-3', 'subj-dl', null, 'Boolean Algebra', 'Boolean theorems, De Morgan laws, Consensus theorem, Duality, and Boolean function simplifications (34 PYQs).', 3, true, 34),
  makeTopic('dl-4', 'subj-dl', null, 'Digital Counter', 'Synchronous and Asynchronous (Ripple) counters, Mod-N counters, Up/Down counters, ring & Johnson counters (18 PYQs).', 4, true, 18),
  makeTopic('dl-5', 'subj-dl', null, 'K Map Minimization', 'Karnaugh Map grouping, Essential Prime Implicants, Prime Implicants, and Don\'t Care minimization (17 PYQs).', 5, true, 17),
  makeTopic('dl-6', 'subj-dl', null, 'Min Sum of Products Form (SOP)', 'Minimal Sum-of-Products and Product-of-Sums expressions, standard vs canonical forms (16 PYQs).', 6, true, 16),
  makeTopic('dl-7', 'subj-dl', null, 'IEEE Representation', 'IEEE 754 Floating Point Standard (32-bit single precision, 64-bit double precision, exponent bias, normalized values) (14 PYQs).', 7, true, 14),
  makeTopic('dl-8', 'subj-dl', null, 'Multiplexer', 'Implementing Boolean logic functions using 2:1, 4:1, 8:1 Multiplexers and Multiplexer tree expansion (14 PYQs).', 8, true, 14),
  makeTopic('dl-9', 'subj-dl', null, 'Canonical Normal Form', 'Minterms (m-notation) and Maxterms (M-notation), converting non-canonical expressions to canonical (10 PYQs).', 9, true, 10),
  makeTopic('dl-10', 'subj-dl', null, 'Adder Circuits', 'Half Adder, Full Adder, Ripple Carry Adder delay, Carry Look-Ahead Adder generation and propagation logic (9 PYQs).', 10, true, 9),
  makeTopic('dl-11', 'subj-dl', null, 'Flip-Flops & Timing', 'SR, JK, D, T Flip-Flops, race-around condition, Setup and Hold time constraints for max clock frequency (8 PYQs).', 11, false, 8),

  // =========================================================================
  // 5. OPERATING SYSTEM (subj-os) - 343 Total PYQs
  // =========================================================================
  makeTopic('os-1', 'subj-os', null, 'Process Synchronization', 'Critical Section criteria (Mutual Exclusion, Progress, Bounded Waiting), Peterson Algorithm, TestAndSet, and Semaphores (52 PYQs).', 1, true, 52),
  makeTopic('os-1-1', 'subj-os', 'os-1', 'Peterson Algorithm & Critical Section Proofs', 'Flag array and turn variable race condition validation.', 1, true, 26),
  makeTopic('os-1-2', 'subj-os', 'os-1', 'Classical Sync: Producer-Consumer & Reader-Writer', 'Binary and Counting semaphore synchronization scenarios.', 2, true, 26),

  makeTopic('os-2', 'subj-os', null, 'Process Scheduling', 'CPU Scheduling algorithms (FCFS, Non-preemptive/Preemptive SJF / SRTF, Round Robin with quantum, Priority) (49 PYQs).', 2, true, 49),
  makeTopic('os-3', 'subj-os', null, 'Virtual Memory', 'Demand paging, Translation Lookaside Buffer (TLB), Effective Memory Access Time (EMAT) calculations, multi-level page table lookups (43 PYQs).', 3, true, 43),
  makeTopic('os-4', 'subj-os', null, 'Page Replacement', 'FIFO, LRU, Optimal page replacement algorithms, Belady Anomaly, page fault counting on reference strings (31 PYQs).', 4, true, 31),
  makeTopic('os-5', 'subj-os', null, 'Disk Management', 'Disk geometry, Sector/Track addressing, rotational latency, transfer rate, and Unix Inode block pointer calculations (30 PYQs).', 5, true, 30),
  makeTopic('os-6', 'subj-os', null, 'Resource Allocation & Deadlocks', 'Deadlock necessary conditions, Resource Allocation Graphs (RAG), Banker Algorithm for safety and resource requests (27 PYQs).', 6, true, 27),
  makeTopic('os-7', 'subj-os', null, 'Disk Scheduling', 'FCFS, SSTF, SCAN (Elevator), C-SCAN, LOOK, C-LOOK seek time track movement calculations (16 PYQs).', 7, true, 16),
  makeTopic('os-8', 'subj-os', null, 'Semaphore', 'Counting semaphore values, concurrent P/V wait/signal operation sequences and deadlock states (11 PYQs).', 8, true, 11),
  makeTopic('os-9', 'subj-os', null, 'Threads & Concurrency', 'User-level threads vs Kernel-level threads, thread synchronization, thread control blocks (10 PYQs).', 9, true, 10),
  makeTopic('os-10', 'subj-os', null, 'Memory Management', 'Single-level and Multi-level paging address translation, Page Table Base Register (PTBR), internal/external fragmentation (9 PYQs).', 10, true, 9),

  // =========================================================================
  // 6. DISCRETE MATHEMATICS (subj-dm) - 390 Total PYQs
  //    Organized into 4 parent categories with subtopics
  // =========================================================================

  // --- Parent: Combinatory (51 PYQs) ---
  makeTopic('dm-comb', 'subj-dm', null, 'Combinatory', 'Permutations, combinations, recurrence relations, generating functions, and counting techniques (51 PYQs).', 1, true, 51),
  makeTopic('dm-1', 'subj-dm', 'dm-comb', 'Combinatory', 'Permutations & Combinations, Binomial theorem, inclusion-exclusion principle (18 PYQs).', 1, true, 18),
  makeTopic('dm-2', 'subj-dm', 'dm-comb', 'Recurrence Relation', 'Solving linear homogeneous and non-homogeneous recurrence relations, characteristic roots (7 PYQs).', 2, true, 7),
  makeTopic('dm-3', 'subj-dm', 'dm-comb', 'Balls In Bins', 'Distributing distinct/identical objects into distinct/identical bins, stars and bars (6 PYQs).', 3, true, 6),
  makeTopic('dm-4', 'subj-dm', 'dm-comb', 'Counting', 'Rule of sum, rule of product, combinatorial counting principles (6 PYQs).', 4, true, 6),
  makeTopic('dm-5', 'subj-dm', 'dm-comb', 'Generating Functions', 'Ordinary and exponential generating functions, closed forms for sequence generation (6 PYQs).', 5, true, 6),
  makeTopic('dm-6', 'subj-dm', 'dm-comb', 'Summation', 'Sum of powers of integers, geometric and arithmetic-geometric series formulas (4 PYQs).', 6, true, 4),
  makeTopic('dm-7', 'subj-dm', 'dm-comb', 'Modular Arithmetic', 'Fermat Little Theorem, modular inverses, Chinese Remainder Theorem basics (2 PYQs).', 7, true, 2),
  makeTopic('dm-8', 'subj-dm', 'dm-comb', 'Pigeonhole Principle', 'Generalized pigeonhole principle ceil(N/k), minimum elements to guarantee duplicates (2 PYQs).', 8, true, 2),

  // --- Parent: Graph Theory (88 PYQs) ---
  makeTopic('dm-graph', 'subj-dm', null, 'Graph Theory', 'Connectivity, degree sequences, planarity, coloring, isomorphism, and matching (88 PYQs).', 2, true, 88),
  makeTopic('dm-9', 'subj-dm', 'dm-graph', 'Graph Connectivity', 'Connected components, cut vertices, cut edges, bridges, Eulerian paths/circuits, Hamiltonian cycles (40 PYQs).', 1, true, 40),
  makeTopic('dm-10', 'subj-dm', 'dm-graph', 'Degree of Graph', 'Handshaking Lemma (Sum of degrees = 2|E|), degree sequences, Havel-Hakimi theorem (13 PYQs).', 2, true, 13),
  makeTopic('dm-11', 'subj-dm', 'dm-graph', 'Graph Planarity', 'Planar graphs, Euler formula V - E + F = 2, maximal planar graph edges E <= 3V - 6 (13 PYQs).', 3, true, 13),
  makeTopic('dm-12', 'subj-dm', 'dm-graph', 'Graph Coloring', 'Vertex chromatic number chi(G), edge chromatic index, four-color theorem bounds, bipartite coloring (11 PYQs).', 4, true, 11),
  makeTopic('dm-13', 'subj-dm', 'dm-graph', 'Graph Isomorphism', 'Graph invariant checks: vertex counts, degree multisets, adjacency matrix isomorphism (4 PYQs).', 5, true, 4),
  makeTopic('dm-14', 'subj-dm', 'dm-graph', 'Counting', 'Number of simple graphs on n vertices 2^C(n,2), labeled trees Cayley formula n^(n-2) (3 PYQs).', 6, true, 3),
  makeTopic('dm-15', 'subj-dm', 'dm-graph', 'Graph Matching', 'Maximal vs maximum matchings, Hall Marriage Theorem for bipartite graphs (2 PYQs).', 7, true, 2),
  makeTopic('dm-16a', 'subj-dm', 'dm-graph', 'Graph Algorithms', 'Graph traversal connectivity algorithms and path tests (1 PYQ).', 8, true, 1),
  makeTopic('dm-16b', 'subj-dm', 'dm-graph', 'Jaccard Coefficient', 'Graph vertex neighborhood similarity metric and link prediction (1 PYQ).', 9, true, 1),

  // --- Parent: Mathematical Logic (78 PYQs) ---
  makeTopic('dm-logic', 'subj-dm', null, 'Mathematical Logic', 'Propositional logic, first-order predicate calculus, inference rules, and logical deductions (78 PYQs).', 3, true, 78),
  makeTopic('dm-17', 'subj-dm', 'dm-logic', 'Propositional Logic', 'Truth tables, logical equivalences, Tautology/Contradiction, CNF/DNF, inference rules (40 PYQs).', 1, true, 40),
  makeTopic('dm-18', 'subj-dm', 'dm-logic', 'First Order Logic', 'Predicate quantifiers (Forall, Exists), quantifier negation, scope, validity and satisfiability of formulas (35 PYQs).', 2, true, 35),
  makeTopic('dm-19', 'subj-dm', 'dm-logic', 'Logical Reasoning', 'Translating complex English statements to predicate calculus and logic deductions (3 PYQs).', 3, true, 3),

  // --- Parent: Set Theory & Algebra (173 PYQs) ---
  makeTopic('dm-set-algebra', 'subj-dm', null, 'Set Theory & Algebra', 'Relations, group theory, functions, posets, lattices, and algebraic structures (173 PYQs).', 4, true, 173),
  makeTopic('dm-20', 'subj-dm', 'dm-set-algebra', 'Relations', 'Reflexive, Symmetric, Anti-symmetric, Transitive properties, Equivalence classes, and closures (38 PYQs).', 1, true, 38),
  makeTopic('dm-21', 'subj-dm', 'dm-set-algebra', 'Group Theory', 'Groups, Abelian Groups, Subgroups, Cyclic groups, Order of elements, Lagrange Theorem (33 PYQs).', 2, true, 33),
  makeTopic('dm-22', 'subj-dm', 'dm-set-algebra', 'Functions', 'Injective (One-to-One), Surjective (Onto), Bijective functions, number of onto functions formulas (30 PYQs).', 3, true, 30),
  makeTopic('dm-23', 'subj-dm', 'dm-set-algebra', 'Set Theory', 'Power sets, Cartesian products, set algebra laws, cardinality of sets, De Morgan laws (27 PYQs).', 4, true, 27),
  makeTopic('dm-24', 'subj-dm', 'dm-set-algebra', 'Lattice & Boolean Algebra', 'Partially ordered sets as Lattices, Meet (GLB), Join (LUB), Distributive and Complemented Lattices (10 PYQs).', 5, true, 10),
  makeTopic('dm-25', 'subj-dm', 'dm-set-algebra', 'Partial Order & Posets', 'Posets, Hasse diagrams, Maximal/Minimal vs Greatest/Least elements, Topological sorting of Posets (10 PYQs).', 6, true, 10),
  makeTopic('dm-26', 'subj-dm', 'dm-set-algebra', 'Binary Operation', 'Properties of binary operations: associativity, commutativity, identity, inverse elements (8 PYQs).', 7, true, 8),
  makeTopic('dm-27', 'subj-dm', 'dm-set-algebra', 'Number Theory', 'GCD, Euclidean algorithm, prime numbers, Euler Totient function phi(n) (7 PYQs).', 8, true, 7),
  makeTopic('dm-28', 'subj-dm', 'dm-set-algebra', 'Polynomials', 'Polynomial roots, irreducible polynomials in finite fields (4 PYQs).', 9, true, 4),
  makeTopic('dm-29', 'subj-dm', 'dm-set-algebra', 'Countable & Uncountable Sets', 'Countably infinite sets (Integers, Rationals) vs Uncountable sets (Reals, Power set of Naturals) (2 PYQs).', 10, true, 2),

  // =========================================================================
  // 7. ENGINEERING MATHEMATICS (subj-em) - 306 Total PYQs
  //    Organized into 3 parent categories with subtopics
  // =========================================================================

  // --- Parent: Linear Algebra (112 PYQs) ---
  makeTopic('em-la', 'subj-em', null, 'Linear Algebra', 'Eigenvalues, eigenvectors, matrix operations, determinants, rank, vector spaces, and linear systems (112 PYQs).', 1, true, 112),
  makeTopic('em-1', 'subj-em', 'em-la', 'Eigen Value', 'Characteristic equation |A - lambda*I| = 0, properties of eigenvalues (trace, det), Cayley-Hamilton Theorem (33 PYQs).', 1, true, 33),
  makeTopic('em-2', 'subj-em', 'em-la', 'Matrix', 'Matrix multiplication, Transpose, Symmetric, Skew-Symmetric, Orthogonal, Unitary, and Nilpotent matrices (24 PYQs).', 2, true, 24),
  makeTopic('em-3', 'subj-em', 'em-la', 'System of Equations', 'Matrix equation AX = B, augmented matrix [A|B], consistency test (Rank(A) vs Rank(A|B)), unique/infinite/no solution (17 PYQs).', 3, true, 17),
  makeTopic('em-4', 'subj-em', 'em-la', 'Determinant', 'Properties of determinants, row/column expansion, inverse matrix formula A^-1 = adj(A)/det(A) (12 PYQs).', 4, true, 12),
  makeTopic('em-5', 'subj-em', 'em-la', 'Rank of Matrix', 'Echelon form, row operations, linearly independent rows/columns, Rank-Nullity Theorem (7 PYQs).', 5, true, 7),
  makeTopic('em-6', 'subj-em', 'em-la', 'Vector Space', 'Vector spaces, subspaces, linear independence, basis vectors, and dimension (7 PYQs).', 6, true, 7),
  makeTopic('em-7', 'subj-em', 'em-la', 'LU Decomposition', 'Lower-Upper triangular matrix factorizations A = LU, forward and backward substitution (3 PYQs).', 7, true, 3),
  makeTopic('em-8', 'subj-em', 'em-la', 'Orthonormality', 'Orthogonal vectors, Gram-Schmidt orthonormalization, vector projections (2 PYQs).', 8, true, 2),
  makeTopic('em-9', 'subj-em', 'em-la', 'Statistics', 'Mean, variance, standard deviation, covariance, correlation coefficient (2 PYQs).', 9, true, 2),
  makeTopic('em-10', 'subj-em', 'em-la', 'Cartesian Coordinates', 'Dot product, cross product, vector magnitude and geometric representations (1 PYQ).', 10, true, 1),

  // --- Parent: Probability (125 PYQs) ---
  makeTopic('em-prob', 'subj-em', null, 'Probability', 'Axioms of probability, Bayes theorem, discrete & continuous random variables, and distributions (125 PYQs).', 2, true, 125),
  makeTopic('em-11', 'subj-em', 'em-prob', 'Probability', 'Axioms of probability, sample spaces, mutually exclusive events, addition rule (31 PYQs).', 1, true, 31),
  makeTopic('em-12', 'subj-em', 'em-prob', 'Expectation', 'Expected value E[X], Variance Var(X) = E[X^2] - (E[X])^2, linearity of expectation (15 PYQs).', 2, true, 15),
  makeTopic('em-13', 'subj-em', 'em-prob', 'Conditional Probability', 'P(A|B) = P(A cap B) / P(B), Total Probability Theorem, Bayes Rule for posterior probability (14 PYQs).', 3, true, 14),
  makeTopic('em-14', 'subj-em', 'em-prob', 'Uniform Distribution', 'Continuous and discrete uniform probability density functions and moments (11 PYQs).', 4, true, 11),
  makeTopic('em-15', 'subj-em', 'em-prob', 'Random Variable', 'Discrete and Continuous random variables, cumulative distribution functions (CDF) (10 PYQs).', 5, true, 10),
  makeTopic('em-16', 'subj-em', 'em-prob', 'Binomial Distribution', 'P(X = k) = C(n,k) p^k (1-p)^(n-k), Mean = n*p, Variance = n*p*(1-p) (6 PYQs).', 6, true, 6),
  makeTopic('em-17', 'subj-em', 'em-prob', 'Exponential Distribution', 'Probability density f(x) = lambda*e^(-lambda*x), memoryless property P(X > s+t | X > s) = P(X > t) (6 PYQs).', 7, true, 6),
  makeTopic('em-18', 'subj-em', 'em-prob', 'Independent Events', 'Condition for statistical independence P(A cap B) = P(A) * P(B) (6 PYQs).', 8, true, 6),
  makeTopic('em-19', 'subj-em', 'em-prob', 'Poisson Distribution', 'P(X = k) = e^-lambda * lambda^k / k!, Mean = lambda, Variance = lambda (5 PYQs).', 9, true, 5),
  makeTopic('em-20', 'subj-em', 'em-prob', 'Normal Distribution', 'Gaussian bell curve, standard normal distribution Z = (X - mu) / sigma, symmetry properties (4 PYQs).', 10, true, 4),

  // --- Parent: Calculus (69 PYQs) ---
  makeTopic('em-calc', 'subj-em', null, 'Calculus', 'Limits, continuity, differentiability, maxima/minima, partial derivatives, and integrals (69 PYQs).', 3, true, 69),
  makeTopic('em-21', 'subj-em', 'em-calc', 'Limits', 'Evaluation of limits, L\'Hopital Rule for 0/0 and inf/inf indeterminate forms (15 PYQs).', 1, true, 15),
  makeTopic('em-22', 'subj-em', 'em-calc', 'Maxima Minima', 'First derivative test, Second derivative test, multivariable extrema using Hessian matrix (14 PYQs).', 2, true, 14),
  makeTopic('em-23', 'subj-em', 'em-calc', 'Continuity', 'Left-hand limit = Right-hand limit = Function value at point, intermediate value theorem (11 PYQs).', 3, true, 11),
  makeTopic('em-24', 'subj-em', 'em-calc', 'Differentiation', 'Chain rule, product rule, partial derivatives, directional derivatives, gradient (11 PYQs).', 4, true, 11),
  makeTopic('em-25', 'subj-em', 'em-calc', 'Integration', 'Indefinite and standard integration techniques, substitution, integration by parts (11 PYQs).', 5, true, 11),
  makeTopic('em-26', 'subj-em', 'em-calc', 'Definite Integral', 'Fundamental Theorem of Calculus, properties of definite integrals (4 PYQs).', 6, true, 4),

  // =========================================================================
  // 8. GENERAL APTITUDE (subj-ga) - 429 Total PYQs
  //    Organized into 4 parent categories with subtopics
  // =========================================================================

  // --- Parent: Quantitative Aptitude (197 PYQs) ---
  makeTopic('ga-quant', 'subj-ga', null, 'Quantitative Aptitude', 'Arithmetic, algebra, data interpretation, probability, and quantitative reasoning (197 PYQs).', 1, true, 197),
  makeTopic('ga-1', 'subj-ga', 'ga-quant', 'Probability', 'Permutations, combinations, coin/dice/card probability word problems (17 PYQs).', 1, true, 17),
  makeTopic('ga-2', 'subj-ga', 'ga-quant', 'Numerical Computation', 'Arithmetic fractions, decimals, powers, roots, simplification (9 PYQs).', 2, true, 9),
  makeTopic('ga-3', 'subj-ga', 'ga-quant', 'Ratio Proportion', 'Direct/inverse proportion, mixture problems, partnerships, ages (9 PYQs).', 3, true, 9),
  makeTopic('ga-4', 'subj-ga', 'ga-quant', 'Percentage', 'Percentage increase/decrease, profit & loss, discount, simple & compound interest (8 PYQs).', 4, true, 8),
  makeTopic('ga-5', 'subj-ga', 'ga-quant', 'Functions', 'Domain, range, composition of functions, polynomial function evaluations (7 PYQs).', 5, true, 7),
  makeTopic('ga-6', 'subj-ga', 'ga-quant', 'Tabular Data', 'Interpreting tables, bar charts, pie charts, data sufficiency (7 PYQs).', 6, true, 7),
  makeTopic('ga-7', 'subj-ga', 'ga-quant', 'Venn Diagram', '2-set and 3-set Venn diagram word problems, set overlapping counts (7 PYQs).', 7, true, 7),
  makeTopic('ga-8', 'subj-ga', 'ga-quant', 'Logarithms', 'Logarithm identities: log(ab) = log a + log b, base change rules (6 PYQs).', 8, true, 6),
  makeTopic('ga-9', 'subj-ga', 'ga-quant', 'Quadratic Equations', 'Roots of quadratic equation, discriminant b^2 - 4ac, nature of roots (6 PYQs).', 9, true, 6),
  makeTopic('ga-10', 'subj-ga', 'ga-quant', 'Absolute Value', 'Modulus equations |x - a| <= b, solving linear inequalities (5 PYQs).', 10, true, 5),

  // --- Parent: Verbal Aptitude (165 PYQs) ---
  makeTopic('ga-verbal', 'subj-ga', null, 'Verbal Aptitude', 'English vocabulary, reading comprehension, grammar, and verbal reasoning (165 PYQs).', 2, true, 165),
  makeTopic('ga-11', 'subj-ga', 'ga-verbal', 'Most Appropriate Word', 'Contextual vocabulary fill-in-the-blanks, collocations, cloze tests (47 PYQs).', 1, true, 47),
  makeTopic('ga-12', 'subj-ga', 'ga-verbal', 'Passage Reading', 'Reading comprehension passages, author tone, main idea inference (23 PYQs).', 2, true, 23),
  makeTopic('ga-13', 'subj-ga', 'ga-verbal', 'Verbal Reasoning', 'Critical reasoning, strengthening and weakening arguments, logical assumptions (15 PYQs).', 3, true, 15),
  makeTopic('ga-14', 'subj-ga', 'ga-verbal', 'Word Pairs', 'Semantic word pair relationships (cause-effect, tool-user, part-whole) (14 PYQs).', 4, true, 14),
  makeTopic('ga-15', 'subj-ga', 'ga-verbal', 'Synonyms', 'Identifying word meanings and synonyms in technical context (13 PYQs).', 5, true, 13),
  makeTopic('ga-16', 'subj-ga', 'ga-verbal', 'Tenses', 'Past, present, future tenses, perfect continuous usage (9 PYQs).', 6, true, 9),
  makeTopic('ga-17', 'subj-ga', 'ga-verbal', 'Antonyms', 'Opposite words, antonyms in context (7 PYQs).', 7, true, 7),
  makeTopic('ga-18', 'subj-ga', 'ga-verbal', 'Grammatical Error', 'Spotting errors in sentence clauses, prepositions, articles (6 PYQs).', 8, true, 6),
  makeTopic('ga-19', 'subj-ga', 'ga-verbal', 'English Grammar', 'Subject-verb agreement, modifiers, parallelism, conditional sentences (5 PYQs).', 9, true, 5),
  makeTopic('ga-20', 'subj-ga', 'ga-verbal', 'Incorrect Sentence Part', 'Sentence correction, identifying faulty grammatical fragments (5 PYQs).', 10, true, 5),

  // --- Parent: Analytical Aptitude (48 PYQs) ---
  makeTopic('ga-analytical', 'subj-ga', null, 'Analytical Aptitude', 'Logical deduction, coding-decoding, direction sense, and analytical puzzles (48 PYQs).', 3, true, 48),
  makeTopic('ga-21', 'subj-ga', 'ga-analytical', 'Logical Reasoning', 'Deductive reasoning, arrangements, blood relations, puzzles (18 PYQs).', 1, true, 18),
  makeTopic('ga-22', 'subj-ga', 'ga-analytical', 'Statements Follow', 'Logical conclusions from statements, Venn diagram validations (7 PYQs).', 2, true, 7),
  makeTopic('ga-23', 'subj-ga', 'ga-analytical', 'Direction Sense', 'Compass navigation problems, displacement distance calculations (5 PYQs).', 3, true, 5),
  makeTopic('ga-24', 'subj-ga', 'ga-analytical', 'Sequence Series', 'Number and letter sequence completion, pattern deductions (3 PYQs).', 4, true, 3),
  makeTopic('ga-25', 'subj-ga', 'ga-analytical', 'Age Relation', 'Algebraic age relationship word equations (2 PYQs).', 5, true, 2),
  makeTopic('ga-26', 'subj-ga', 'ga-analytical', 'Code Words', 'Letter substitution ciphers, code transformations (2 PYQs).', 6, true, 2),
  makeTopic('ga-27', 'subj-ga', 'ga-analytical', 'Odd One', 'Classification of numbers, words, and shapes to find the outlier (2 PYQs).', 7, true, 2),
  makeTopic('ga-28a', 'subj-ga', 'ga-analytical', 'Passage Reading', 'Analytical passage reading and inference questions (2 PYQs).', 8, true, 2),
  makeTopic('ga-28b', 'subj-ga', 'ga-analytical', 'Analogy', 'Identifying analogical relationships and completing analogy pairs (1 PYQ).', 9, true, 1),
  makeTopic('ga-28c', 'subj-ga', 'ga-analytical', 'Coding Decoding', 'Decoding encrypted messages using letter-position patterns (1 PYQ).', 10, true, 1),

  // --- Parent: Spatial Aptitude (19 PYQs) ---
  makeTopic('ga-spatial', 'subj-ga', null, 'Spatial Aptitude', 'Visual and spatial reasoning: folding, rotation, 3D structures, mirror images (19 PYQs).', 4, true, 19),
  makeTopic('ga-29', 'subj-ga', 'ga-spatial', 'Paper Folding', 'Visualizing crease patterns and holes upon unfolding paper (5 PYQs).', 1, true, 5),
  makeTopic('ga-30', 'subj-ga', 'ga-spatial', 'Patterns In Two Dimensions', '2D geometric transformations, pattern completion, tessellations (4 PYQs).', 2, true, 4),
  makeTopic('ga-31', 'subj-ga', 'ga-spatial', 'Image Rotation', 'Clockwise and counter-clockwise 2D/3D angular rotations (3 PYQs).', 3, true, 3),
  makeTopic('ga-32', 'subj-ga', 'ga-spatial', 'Patterns In Three Dimensions', 'Cube surface unrolling, dice net representations (3 PYQs).', 4, true, 3),
  makeTopic('ga-33', 'subj-ga', 'ga-spatial', '3D Structure', 'Combining 3D polyhedra, orthographic front/side/top views (1 PYQ).', 5, true, 1),
  makeTopic('ga-34', 'subj-ga', 'ga-spatial', 'Assembling', 'Mental assembly of disjointed 2D/3D parts (1 PYQ).', 6, true, 1),
  makeTopic('ga-35', 'subj-ga', 'ga-spatial', 'Assembling Pieces', 'Fitting irregular pieces together to form complete shapes (1 PYQ).', 7, true, 1),
  makeTopic('ga-36', 'subj-ga', 'ga-spatial', 'Mirror Image', 'Lateral inversion reflections along horizontal and vertical axes (1 PYQ).', 8, true, 1),

  // =========================================================================
  // 9. ALGORITHMS (subj-algo) - 251 Total PYQs
  //    Organized into 7 GATE syllabus chapters with subtopics
  // =========================================================================

  // --- Chapter 1: Asymptotic Analysis & Recurrences (127 PYQs) ---
  makeTopic('alg-ch-asymp', 'subj-algo', null, 'Asymptotic Analysis & Recurrences', 'Asymptotic notations, time complexity analysis of loops, master theorem, and recurrence relations (127 PYQs).', 1, true),
  makeTopic('alg-1', 'subj-algo', 'alg-ch-asymp', 'Identify Function & Algorithm Trace', 'Tracing pseudocode, determining returned values and mathematical functions implemented (38 PYQs).', 1, true, 38),
  makeTopic('alg-2', 'subj-algo', 'alg-ch-asymp', 'Recurrence Relations', 'Master Theorem cases T(n) = aT(n/b) + f(n), Akra-Bazzi method, recursion tree analysis (36 PYQs).', 2, true, 36),
  makeTopic('alg-4', 'subj-algo', 'alg-ch-asymp', 'Time Complexity & Loop Analysis', 'Analyzing nested loops, logarithmic steps, best/worst/average case time complexities (31 PYQs).', 3, true, 31),
  makeTopic('alg-6', 'subj-algo', 'alg-ch-asymp', 'Asymptotic Notations', 'Big-O, Omega, Theta, Little-o, Little-omega formal definitions and limit comparisons (22 PYQs).', 4, true, 22),
  makeTopic('alg-sub-space', 'subj-algo', 'alg-ch-asymp', 'Space Complexity Analysis', 'Auxiliary space, recursion stack depth analysis, in-place vs extra memory space bounds.', 5, false),

  // --- Chapter 2: Divide and Conquer (15 PYQs) ---
  makeTopic('alg-ch-dc', 'subj-algo', null, 'Divide and Conquer', 'Divide and conquer paradigm, partitioning algorithms, order statistics, and matrix multiplication (15 PYQs).', 2, true),
  makeTopic('alg-8', 'subj-algo', 'alg-ch-dc', 'Quick Sort', 'Lomuto vs Hoare partitioning, worst case O(n^2) conditions, randomized pivot selection (15 PYQs).', 1, true, 15),
  makeTopic('alg-sub-merge', 'subj-algo', 'alg-ch-dc', 'Merge Sort & Inversions', 'Merge sort divide-and-conquer, counting inversions in an array in O(n log n) time.', 2, false),
  makeTopic('alg-sub-binsearch', 'subj-algo', 'alg-ch-dc', 'Binary Search & Variations', 'Binary search on sorted arrays, search in rotated sorted array, finding peak elements.', 3, false),
  makeTopic('alg-sub-median', 'subj-algo', 'alg-ch-dc', 'Median & Order Statistics', 'Quickselect algorithm for k-th smallest element, median of medians linear-time selection.', 4, false),
  makeTopic('alg-sub-matrix', 'subj-algo', 'alg-ch-dc', 'Strassen Matrix Multiplication', 'Strassen 7-multiplication divide-and-conquer recurrence T(n) = 7T(n/2) + O(n^2), O(n^2.81).', 5, false),

  // --- Chapter 3: Greedy Techniques (35 PYQs) ---
  makeTopic('alg-ch-greedy', 'subj-algo', null, 'Greedy Techniques', 'Greedy choice property, optimal substructure, minimum spanning trees, and scheduling (35 PYQs).', 3, true),
  makeTopic('alg-3', 'subj-algo', 'alg-ch-greedy', 'Minimum Spanning Tree', 'Kruskal algorithm with Union-Find O(E log E), Prim algorithm O(E log V), Cut and Cycle properties (35 PYQs).', 1, true, 35),
  makeTopic('alg-sub-huffman', 'subj-algo', 'alg-ch-greedy', 'Huffman Coding', 'Prefix-free codes, optimal merge patterns, constructing Huffman trees, average code length.', 2, false),
  makeTopic('alg-sub-frac-knap', 'subj-algo', 'alg-ch-greedy', 'Fractional Knapsack', 'Greedy value-per-weight sorting, fractional item division, O(n log n) greedy choice.', 3, false),
  makeTopic('alg-sub-interval', 'subj-algo', 'alg-ch-greedy', 'Activity Selection & Scheduling', 'Interval scheduling by earliest finish time, interval partitioning, minimum rooms.', 4, false),
  makeTopic('alg-sub-job', 'subj-algo', 'alg-ch-greedy', 'Job Sequencing with Deadlines', 'Maximizing profit under unit-time deadlines, Disjoint Set optimization.', 5, false),

  // --- Chapter 4: Graph Algorithms (34 PYQs) ---
  makeTopic('alg-ch-graph', 'subj-algo', null, 'Graph Algorithms', 'Graph traversals, single-source and all-pairs shortest paths, DAG topological ordering (34 PYQs).', 4, true),
  makeTopic('alg-5', 'subj-algo', 'alg-ch-graph', 'Graph Search (BFS & DFS)', 'Breadth-First Search (BFS), Depth-First Search (DFS), edge classification (tree/back/forward/cross) (23 PYQs).', 1, true, 23),
  makeTopic('alg-9', 'subj-algo', 'alg-ch-graph', 'Shortest Path Algorithms', 'Dijkstra shortest path O((V+E)log V), Bellman-Ford negative cycles O(VE), Floyd-Warshall O(V^3) (11 PYQs).', 2, true, 11),
  makeTopic('alg-sub-topo', 'subj-algo', 'alg-ch-graph', 'Topological Sorting & DAGs', 'Kahn in-degree algorithm, DFS-based topological ordering, detecting cycles in directed graphs.', 3, false),
  makeTopic('alg-sub-scc', 'subj-algo', 'alg-ch-graph', 'Strongly Connected Components', 'Kosaraju two-pass DFS algorithm, Tarjan low-link SCC algorithm in directed graphs.', 4, false),
  makeTopic('alg-sub-art', 'subj-algo', 'alg-ch-graph', 'Articulation Points & Bridges', 'DFS discovery and low values, cut vertices and cut edges in connected graphs.', 5, false),

  // --- Chapter 5: Dynamic Programming (10 PYQs) ---
  makeTopic('alg-ch-dp', 'subj-algo', null, 'Dynamic Programming', 'Overlapping subproblems, memoization vs tabulation, knapsack, LCS, and matrix chain multiplication (10 PYQs).', 5, true),
  makeTopic('alg-10', 'subj-algo', 'alg-ch-dp', 'Dynamic Programming Fundamentals', '0/1 Knapsack, Longest Common Subsequence (LCS), Matrix Chain Multiplication (MCM), optimal substructure (10 PYQs).', 1, true, 10),
  makeTopic('alg-sub-01knap', 'subj-algo', 'alg-ch-dp', '0/1 Knapsack Problem', 'DP table construction, state transition DP[i][w] = max(DP[i-1][w], DP[i-1][w-wt[i]] + val[i]), pseudo-polynomial time.', 2, false),
  makeTopic('alg-sub-lcs', 'subj-algo', 'alg-ch-dp', 'Longest Common Subsequence (LCS)', '2D DP grid matching, reconstruct optimal string, edit distance and string alignment.', 3, false),
  makeTopic('alg-sub-mcm', 'subj-algo', 'alg-ch-dp', 'Matrix Chain Multiplication (MCM)', 'Parenthesization of matrix products, minimum scalar multiplications, O(n^3) DP.', 4, false),
  makeTopic('alg-sub-obst', 'subj-algo', 'alg-ch-dp', 'Optimal Binary Search Tree (OBST)', 'Minimizing expected search cost for known key access probabilities, O(n^3) DP.', 5, false),
  makeTopic('alg-sub-lis', 'subj-algo', 'alg-ch-dp', 'Longest Increasing Subsequence', 'O(n^2) DP recurrence and O(n log n) patience sorting with binary search.', 6, false),

  // --- Chapter 6: Searching & Sorting (22 PYQs) ---
  makeTopic('alg-ch-sort', 'subj-algo', null, 'Searching & Sorting', 'Comparison sorting lower bounds, heap sort, non-comparison linear-time sorts (22 PYQs).', 6, true),
  makeTopic('alg-7', 'subj-algo', 'alg-ch-sort', 'Comparison-Based Sorting', 'Comparison lower bound Omega(n log n), Heap Sort, Selection Sort, Insertion Sort, stability (22 PYQs).', 1, true, 22),
  makeTopic('alg-sub-linear-sort', 'subj-algo', 'alg-ch-sort', 'Linear-Time Sorting', 'Counting Sort O(n+k), Radix Sort O(d*(n+k)), Bucket Sort average O(n).', 2, false),
  makeTopic('alg-sub-heap', 'subj-algo', 'alg-ch-sort', 'Binary Heap & Priority Queues', 'Build-Heap in O(n), Heapify in O(log n), Extract-Min/Max, Decrease-Key operations.', 3, false),
  makeTopic('alg-sub-lower-bound', 'subj-algo', 'alg-ch-sort', 'Lower Bounds for Sorting', 'Decision tree model, binary decision tree height ceil(log2(n!)) = Omega(n log n).', 4, false),

  // --- Chapter 7: NP-Completeness & Complexity (8 PYQs) ---
  makeTopic('alg-ch-np', 'subj-algo', null, 'NP-Completeness & Complexity', 'Deterministic and non-deterministic polynomial time, reductions, standard NP-complete problems (8 PYQs).', 7, true),
  makeTopic('alg-11', 'subj-algo', 'alg-ch-np', 'NP-Completeness', 'P, NP, NP-Complete, NP-Hard classes, 3-SAT, Vertex Cover, Clique, polynomial reductions (8 PYQs).', 1, true, 8),
  makeTopic('alg-sub-poly-red', 'subj-algo', 'alg-ch-np', 'Polynomial-Time Reductions', 'Proving NP-Completeness via reduction A <=p B, transitivity of polynomial reductions.', 2, false),
  makeTopic('alg-sub-npc-problems', 'subj-algo', 'alg-ch-np', 'Classic NP-Complete Problems', 'Cook-Levin Theorem (SAT), 3-SAT, Independent Set, Hamiltonian Cycle, TSP, Subset Sum.', 3, false),

  // =========================================================================
  // 10. COMPILER DESIGN (subj-cd) - 242 Total PYQs
  // =========================================================================
  makeTopic('cd-1', 'subj-cd', null, 'Grammar Analysis', 'Context-free grammar rules, ambiguity proofs, left recursion elimination, and left factoring (47 PYQs).', 1, true, 47),
  makeTopic('cd-2', 'subj-cd', null, 'Parsing Techniques', 'LL(1) parsing table construction, FIRST and FOLLOW set algorithms, parser conflict resolution (22 PYQs).', 2, true, 22),
  makeTopic('cd-3', 'subj-cd', null, 'Runtime Environment', 'Activation records on the stack, static/dynamic scoping, local variable allocations (22 PYQs).', 3, true, 22),
  makeTopic('cd-4', 'subj-cd', null, 'LR Parser', 'LR(0), SLR(1), LALR(1), CLR(1) item collections, Shift-Reduce and Reduce-Reduce conflicts, state counts (20 PYQs).', 4, true, 20),
  makeTopic('cd-5', 'subj-cd', null, 'Syntax Directed Translation', 'S-attributed (synthesized only) vs L-attributed definitions, dependency graphs, bottom-up action execution (19 PYQs).', 5, true, 19),
  makeTopic('cd-6', 'subj-cd', null, 'Parameter Passing', 'Pass by value, pass by reference, pass by copy-restore, and pass by name evaluation (14 PYQs).', 6, true, 14),
  makeTopic('cd-7', 'subj-cd', null, 'Compilation Phases', 'Lexical, Syntax, Semantic, Intermediate Code, Optimization, and Target Code generation roles (13 PYQs).', 7, true, 13),
  makeTopic('cd-8', 'subj-cd', null, 'Intermediate Code', 'Three-Address Code (TAC), Quadruples, Triples, Basic Blocks, Control Flow Graph leaders (11 PYQs).', 8, true, 11),
  makeTopic('cd-9', 'subj-cd', null, 'Assembler & Macros', 'Two-pass assembler design, symbol table generation, macro processors and loaders (9 PYQs).', 9, true, 9),
  makeTopic('cd-10', 'subj-cd', null, 'Operator Precedence Grammar', 'Operator grammars, precedence matrix relations, bottom-up shift-reduce operator parsing (9 PYQs).', 10, true, 9),

  // =========================================================================
  // 11. DATA STRUCTURES (subj-ds) - 238 Total PYQs
  // =========================================================================
  makeTopic('ds-1', 'subj-ds', null, 'Binary Tree', 'Inorder, Preorder, Postorder traversals, unique tree reconstructions, height & node count bounds L = I + 1 (53 PYQs).', 1, true, 53),
  makeTopic('ds-2', 'subj-ds', null, 'Binary Search Tree (BST)', 'BST search, insertion, node deletion cases, Inorder successor/predecessor (36 PYQs).', 2, true, 36),
  makeTopic('ds-3', 'subj-ds', null, 'Binary Heap', 'Min-Heap and Max-Heap properties, Build-Heap O(n) algorithm, Extract-Min/Max O(log n), Priority Queues (30 PYQs).', 3, true, 30),
  makeTopic('ds-4', 'subj-ds', null, 'Linked List', 'Singly, Doubly, and Circular Linked Lists, in-place reversal, Floyd cycle detection (24 PYQs).', 4, true, 24),
  makeTopic('ds-5', 'subj-ds', null, 'Stack Data Structure', 'LIFO stack operations, Infix to Postfix/Prefix conversion, Postfix expression evaluations (19 PYQs).', 5, true, 19),
  makeTopic('ds-6', 'subj-ds', null, 'Hashing', 'Open addressing (Linear Probing, Quadratic Probing, Double Hashing), Separate Chaining, load factor alpha = n/m (15 PYQs).', 6, true, 15),
  makeTopic('ds-7', 'subj-ds', null, 'Queue Data Structure', 'FIFO queues, Circular Queue modulo arithmetic, Double-ended queue (Deque) implementations (15 PYQs).', 7, true, 15),
  makeTopic('ds-8', 'subj-ds', null, 'Array Data Structure', 'Row-Major and Column-Major 2D/3D address calculation formulas (13 PYQs).', 8, true, 13),
  makeTopic('ds-9', 'subj-ds', null, 'General Tree Structures', 'N-ary trees, thread binary trees, tree representations as first-child next-sibling (13 PYQs).', 9, true, 13),
  makeTopic('ds-10', 'subj-ds', null, 'AVL Tree', 'AVL height balance factor in {-1, 0, +1}, single & double rotations (LL, RR, LR, RL), minimum nodes for height h (6 PYQs).', 10, true, 6),

  // =========================================================================
  // 12. C-PROGRAMMING (subj-prog) - 131 Total PYQs
  // =========================================================================
  makeTopic('pr-1', 'subj-prog', null, 'Programming In C Fundamentals', 'Data types, operator precedence, type conversions, bitwise operators, switch statements (29 PYQs).', 1, true, 29),
  makeTopic('pr-2', 'subj-prog', null, 'Recursion in C', 'Recursive stack execution tracing, base cases, static and global variables inside recursive calls (19 PYQs).', 2, true, 19),
  makeTopic('pr-3', 'subj-prog', null, 'Pointers in C', 'Pointer arithmetic, pointers to pointers, pointer arrays, array decaying, function pointers (15 PYQs).', 3, true, 15),
  makeTopic('pr-4', 'subj-prog', null, 'Array in C', 'Multidimensional arrays, pointer equivalence a[i] == *(a+i) == i[a], string null-terminator (13 PYQs).', 4, true, 13),
  makeTopic('pr-5', 'subj-prog', null, 'Parameter Passing in C', 'Pass by value vs simulated pass by reference via pointer dereferencing (12 PYQs).', 5, true, 12),
  makeTopic('pr-6', 'subj-prog', null, 'Loop Invariants', 'Loop termination conditions, invariant assertions, loop bounds verification (8 PYQs).', 6, true, 8),
  makeTopic('pr-7', 'subj-prog', null, 'Output Tracing', 'Evaluating complex print statement outputs, format specifiers, side effects in expressions (8 PYQs).', 7, true, 8),
  makeTopic('pr-8', 'subj-prog', null, 'Identify Function in C', 'Deducing the closed-form mathematical function or algorithm coded in C snippet (6 PYQs).', 8, true, 6),
  makeTopic('pr-9', 'subj-prog', null, 'Structure and Union', 'Memory layout, word alignment, structure padding, sizeof calculations, union overlapping fields (5 PYQs).', 9, true, 5),
  makeTopic('pr-10', 'subj-prog', null, 'Functions & Storage Classes', 'Scope, lifetime, auto, static, extern, register storage specifiers (2 PYQs).', 10, true, 2),

  // =========================================================================
  // 13. THEORY OF COMPUTATION (subj-toc) - 293 Total PYQs
  // =========================================================================
  makeTopic('toc-1', 'subj-toc', null, 'Finite Automata', 'DFA and NFA state machines, transition functions, subset construction, modulo language recognizers (43 PYQs).', 1, true, 43),
  makeTopic('toc-2', 'subj-toc', null, 'Context Free Language (CFL)', 'Context-free grammars, Pushdown Automata, parse trees, inherently ambiguous languages (35 PYQs).', 2, true, 35),
  makeTopic('toc-3', 'subj-toc', null, 'Regular Language', 'Properties of regular languages, closure properties, union/intersection/complement/concatenation (35 PYQs).', 3, true, 35),
  makeTopic('toc-4', 'subj-toc', null, 'Identify Class of Language', 'Determining whether a given language L is Regular, DCFL, CFL, CSL, Recursive, or RE (31 PYQs).', 4, true, 31),
  makeTopic('toc-5', 'subj-toc', null, 'Decidability', 'Decidable vs Undecidable problems for Regular, CFL, and Turing Machines, Halting Problem, Rice Theorem (30 PYQs).', 5, true, 30),
  makeTopic('toc-6', 'subj-toc', null, 'Regular Expression', 'RegEx identities, Arden Theorem, converting DFAs to regular expressions, non-regular language proofs (29 PYQs).', 6, true, 29),
  makeTopic('toc-7', 'subj-toc', null, 'Minimal State Automata', 'DFA state minimization algorithm, Myhill-Nerode equivalence theorem, minimum state bounds (25 PYQs).', 7, true, 25),
  makeTopic('toc-8', 'subj-toc', null, 'Recursive and RE Languages', 'Turing machine acceptance (halts on yes) vs total Turing machines (halts on all), Chomsky hierarchy (16 PYQs).', 8, true, 16),
  makeTopic('toc-9', 'subj-toc', null, 'Pushdown Automata (PDA)', 'Deterministic PDA (DCFL) vs Non-Deterministic PDA (CFL), acceptance by empty stack vs final state (15 PYQs).', 9, true, 15),
  makeTopic('toc-10', 'subj-toc', null, 'Closure Properties in TOC', 'Comprehensive closure table under Union, Intersection, Complement, Star, Homomorphism, Inverse (10 PYQs).', 10, true, 10),
];

export const INITIAL_SCHEDULES: Schedule[] = [
  {
    id: 'sched-today',
    Schedule_Date: new Date().toISOString().split('T')[0],
    Schedule_Hours: 6,
    Schedule_Subjects: ['subj-coa', 'subj-os', 'subj-dbms'],
    Schedule_Tag_Filters: ['Star'],
    Subject_Allocations: {
      'subj-coa': 120,
      'subj-os': 120,
      'subj-dbms': 120,
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
        topic_id: 'os-1',
        subject_id: 'subj-os',
        topic_name: 'Process Synchronization',
        subject_name: 'Operating Systems',
        allocated_minutes: 120,
        completed: false,
      },
      {
        topic_id: 'db-1',
        subject_id: 'subj-dbms',
        topic_name: 'SQL Queries',
        subject_name: 'Database Management System',
        allocated_minutes: 120,
        completed: false,
      },
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];
