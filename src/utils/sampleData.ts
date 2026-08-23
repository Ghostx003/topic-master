import { Subject } from '../types/subject';
import { Topic } from '../types/topic';
import { Schedule } from '../types/schedule';

export const INITIAL_SUBJECTS: Subject[] = [
  {
    id: 'subj-cn',
    Subject_Name: 'Computer Networks',
    Subject_Importance: 'Important',
    Subject_Description: 'OSI/TCP-IP models, IPv4/IPv6 addressing, subnetting, TCP flow/congestion control, routing algorithms, MAC protocols, and network security.',
    Subject_Color: '#06b6d4', // Cyan
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'subj-os',
    Subject_Name: 'Operating Systems',
    Subject_Importance: 'Urgent',
    Subject_Description: 'Process lifecycle, CPU scheduling, synchronization semaphores, deadlock avoidance, paging memory management, and disk scheduling.',
    Subject_Color: '#8b5cf6', // Violet
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 13).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'subj-prog',
    Subject_Name: 'C-Programming',
    Subject_Importance: 'High Scoring',
    Subject_Description: 'Operators precedence, control flow, functions, recursion call stacks, pointer arithmetic, dynamic memory, arrays, and structs.',
    Subject_Color: '#3b82f6', // Blue
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'subj-ds',
    Subject_Name: 'Data Structures',
    Subject_Importance: 'High Scoring',
    Subject_Description: 'Arrays, linked lists, stacks, queues, binary trees, BST, AVL balance, binary heaps, graph representations, and hashing tables.',
    Subject_Color: '#10b981', // Emerald
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 11).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'subj-dl',
    Subject_Name: 'Digital Logic',
    Subject_Importance: 'Normal',
    Subject_Description: 'Boolean algebra, K-map minimization, multiplexers, adders, flip-flops, synchronous/asynchronous counters, and 2s complement systems.',
    Subject_Color: '#f59e0b', // Amber
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'subj-toc',
    Subject_Name: 'Theory of Computation',
    Subject_Importance: 'Important',
    Subject_Description: 'DFA/NFA minimization, regular expressions, context-free grammars, pushdown automata, Turing machines, and decidability reductions.',
    Subject_Color: '#ec4899', // Pink
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'subj-cd',
    Subject_Name: 'Compiler Design',
    Subject_Importance: 'Normal',
    Subject_Description: 'Lexical analysis tokens, LL(1) and LR parsers, syntax-directed translation, three-address code, and basic block optimizations.',
    Subject_Color: '#6366f1', // Indigo
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'subj-algo',
    Subject_Name: 'Algorithms',
    Subject_Importance: 'High Scoring',
    Subject_Description: 'Asymptotic notation, divide and conquer, greedy methods, dynamic programming, Dijkstra shortest paths, MST, and NP-completeness.',
    Subject_Color: '#14b8a6', // Teal
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'subj-dbms',
    Subject_Name: 'Database Management System',
    Subject_Importance: 'Important',
    Subject_Description: 'ER modeling, relational algebra, SQL queries, functional dependencies, 3NF/BCNF normalization, ACID transactions, and B+ trees.',
    Subject_Color: '#f43f5e', // Rose
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'subj-coa',
    Subject_Name: 'Computer Organisation & Architecture',
    Subject_Importance: 'Important',
    Subject_Description: 'Instruction formats, addressing modes, pipeline speedup & hazards, cache AMAT mapping, IEEE 754 floats, and DMA I/O transfers.',
    Subject_Color: '#84cc16', // Lime
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'subj-dm',
    Subject_Name: 'Discrete Mathematics',
    Subject_Importance: 'High Scoring',
    Subject_Description: 'Propositional & predicate logic, sets, relations, posets, combinatorics, pigeonhole principle, graph theory, and recurrence relations.',
    Subject_Color: '#a855f7', // Purple
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'subj-em',
    Subject_Name: 'Engineering Mathematics',
    Subject_Importance: 'Important',
    Subject_Description: 'Linear algebra eigenvalues/vectors, matrix rank, calculus maxima/minima, and probability distributions Bayes theorem.',
    Subject_Color: '#0ea5e9', // Sky Blue
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'subj-ga',
    Subject_Name: 'General Aptitude',
    Subject_Importance: 'High Scoring',
    Subject_Description: 'Quantitative arithmetic, logical reasoning syllogisms, spatial pattern folding, and English verbal grammar.',
    Subject_Color: '#eab308', // Yellow
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Helper to construct structured topics with clean To-Do state and accurate Star heavy-hitter tags
const makeTopic = (
  id: string,
  subjectId: string,
  parentId: string | null,
  name: string,
  description: string,
  order: number,
  isStar: boolean = false
): Topic => ({
  id,
  Subject_Id: subjectId,
  Parent_Id: parentId,
  Topic_Name: name,
  Topic_Description: description,
  Topic_Status: 'To Do',
  Topic_Difficulty: isStar ? 'Important' : 'Normal',
  Topic_Study_Hours: 0,
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
  // ==========================================
  // 1. COMPUTER NETWORKS (subj-cn)
  // ==========================================
  makeTopic('cn-1', 'subj-cn', null, 'IPv4 Addressing & Subnetting', 'Classful vs CIDR subnet masks, Network/Broadcast IDs, subnet allocation, and VLSM.', 1, true),
  makeTopic('cn-1-1', 'subj-cn', 'cn-1', 'Classful Addressing & Net ID / Host ID', 'Class A, B, C range boundaries, leading bits, valid host count 2^h - 2.', 1, false),
  makeTopic('cn-1-2', 'subj-cn', 'cn-1', 'CIDR & Classless Subnetting', 'Prefix length /n, subnet mask calculation, subnet bit borrowing, host capacity.', 2, true),
  makeTopic('cn-1-3', 'subj-cn', 'cn-1', 'VLSM & Variable Length Subnetting', 'Hierarchical prefix allocation, minimizing wasted address space.', 3, true),
  makeTopic('cn-1-4', 'subj-cn', 'cn-1', 'Supernetting & Route Aggregation', 'Combining contiguous CIDR blocks, longest prefix matching in routing tables.', 4, true),

  makeTopic('cn-2', 'subj-cn', null, 'IP Packet Header & Fragmentation', 'IPv4 header fields, TTL expiry, and MTU boundary fragmentation offset arithmetic.', 2, true),
  makeTopic('cn-2-1', 'subj-cn', 'cn-2', 'IPv4 Header Fields & Checksum', 'VER, HLEN (x4 scale), Total Length, TTL, Protocol numbers (TCP=6, UDP=17).', 1, false),
  makeTopic('cn-2-2', 'subj-cn', 'cn-2', 'Packet Fragmentation Offset & Flags', 'MTU boundary split, 8-byte offset scale factor, MF/DF flag bits analysis.', 2, true),

  makeTopic('cn-3', 'subj-cn', null, 'Data Link Layer & Flow Control', 'Framing, CRC error detection, and sliding window flow control protocols.', 3, true),
  makeTopic('cn-3-1', 'subj-cn', 'cn-3', 'CRC & Polynomial Error Detection', 'Generator polynomial modulo-2 binary division, transmitted frame bit length.', 1, true),
  makeTopic('cn-3-2', 'subj-cn', 'cn-3', 'Stop & Wait Protocol Efficiency', 'Propagation delay Tp, transmission delay Tt, efficiency formula η = 1 / (1 + 2a).', 2, true),
  makeTopic('cn-3-3', 'subj-cn', 'cn-3', 'Go-Back-N (GBN) Protocol', 'Sender window Ws = 2^k - 1, receiver window Wr = 1, cumulative ACKs, retransmissions.', 3, true),
  makeTopic('cn-3-4', 'subj-cn', 'cn-3', 'Selective Repeat (SR) Protocol', 'Sender window Ws = 2^(k-1), receiver window Wr = 2^(k-1), individual ACKs.', 4, true),

  makeTopic('cn-4', 'subj-cn', null, 'Medium Access Control (MAC)', 'Random access protocols: ALOHA throughput formulas, CSMA/CD minimum frame length.', 4, true),
  makeTopic('cn-4-1', 'subj-cn', 'cn-4', 'Pure & Slotted ALOHA', 'Vulnerable time 2*Tt (Pure, G*e^-2G max 18.4%) vs Tt (Slotted, G*e^-G max 36.8%).', 1, false),
  makeTopic('cn-4-2', 'subj-cn', 'cn-4', 'CSMA/CD & Exponential Backoff', 'Collision detection condition Frame Size >= 2 * Propagation Delay * Bandwidth, truncated binary backoff 2^k - 1.', 2, true),

  makeTopic('cn-5', 'subj-cn', null, 'Routing Protocols & Switching', 'Distance Vector (Bellman-Ford, Count to Infinity), Link State (Dijkstra, OSPF), and Bridges/Switches.', 5, true),
  makeTopic('cn-5-1', 'subj-cn', 'cn-5', 'Distance Vector & Count to Infinity', 'Routing table vector exchange, split horizon and poison reverse mitigation techniques.', 1, true),
  makeTopic('cn-5-2', 'subj-cn', 'cn-5', 'Link State Routing (Dijkstra / OSPF)', 'Global network topology flooding, shortest path tree generation, and event-driven updates.', 2, true),
  makeTopic('cn-5-3', 'subj-cn', 'cn-5', 'Bridges & Transparent Switching', 'Self-learning MAC address tables, collision domains vs broadcast domains.', 3, false),

  makeTopic('cn-6', 'subj-cn', null, 'TCP & UDP Transport Protocols', '3-way handshake connection lifecycle, TCP flags, header structure, and TCP Congestion Control AIMD states.', 6, true),
  makeTopic('cn-6-1', 'subj-cn', 'cn-6', 'TCP 3-Way Handshake & Teardown', 'SYN, SYN-ACK, ACK sequence numbers, FIN teardown, TIME_WAIT state purpose.', 1, true),
  makeTopic('cn-6-2', 'subj-cn', 'cn-6', 'TCP Congestion Control (AIMD)', 'Slow Start (exponential), Congestion Avoidance (linear), Threshold halving, Triple Dup ACK vs Timeout.', 2, true),
  makeTopic('cn-6-3', 'subj-cn', 'cn-6', 'UDP Datagram & Checksum', 'Connectionless overhead, pseudo-header checksum, real-time streaming usage.', 3, false),

  makeTopic('cn-7', 'subj-cn', null, 'Application Layer Protocols & Security', 'DNS record resolution, HTTP/HTTPS persistent connections, SMTP, and RSA Cryptography.', 7, false),
  makeTopic('cn-7-1', 'subj-cn', 'cn-7', 'DNS Hierarchy & Resolution', 'Iterative vs recursive query resolution, Authoritative vs Root nameservers.', 1, false),
  makeTopic('cn-7-2', 'subj-cn', 'cn-7', 'HTTP/1.1 vs HTTP/2 & Web Caching', 'Non-persistent vs persistent pipelined connections, conditional GET headers.', 2, false),
  makeTopic('cn-7-3', 'subj-cn', 'cn-7', 'RSA Public Key Cryptography', 'Prime selection, Euler totient phi(n), modular inverse d = e^-1 mod phi(n), encryption/decryption.', 3, true),

  // ==========================================
  // 2. OPERATING SYSTEMS (subj-os)
  // ==========================================
  makeTopic('os-1', 'subj-os', null, 'Process Management & Forking', 'Process Control Block (PCB), context switching overhead, process state transitions, and fork system call trees.', 1, true),
  makeTopic('os-1-1', 'subj-os', 'os-1', 'Process States & PCB Structure', 'Ready, Running, Waiting, Terminated, context switch saving registers/stack.', 1, false),
  makeTopic('os-1-2', 'subj-os', 'os-1', 'Fork System Call Trees & Zombie Processes', 'Child process PID return values, concurrent execution tracing, zombie/orphan lifecycles.', 2, true),

  makeTopic('os-2', 'subj-os', null, 'CPU Scheduling Algorithms', 'FCFS, SJF, SRTF, Round Robin with time quantum selection, Priority scheduling, and multi-level feedback queues.', 2, true),
  makeTopic('os-2-1', 'subj-os', 'os-2', 'Non-Preemptive vs Preemptive SJF (SRTF)', 'Gantt chart generation, minimizing average waiting time, starvation conditions.', 1, true),
  makeTopic('os-2-2', 'subj-os', 'os-2', 'Round Robin Scheduling & Quantum Sizing', 'Context switch overhead impact, responsiveness vs throughput trade-off.', 2, true),
  makeTopic('os-2-3', 'subj-os', 'os-2', 'Multi-Level Feedback Queue (MLFQ)', 'Dynamic priority decay, aging mechanisms to prevent priority starvation.', 3, false),

  makeTopic('os-3', 'subj-os', null, 'Process Synchronization', 'Critical Section problem, Mutual Exclusion, Progress, Bounded Waiting, Peterson algorithm, and Counting Semaphores.', 3, true),
  makeTopic('os-3-1', 'subj-os', 'os-3', 'Critical Section Criteria & Hardware Locks', 'Mutual exclusion, progress, bounded waiting, TestAndSet atomic instructions.', 1, true),
  makeTopic('os-3-2', 'subj-os', 'os-3', 'Peterson Algorithm for 2 Processes', 'Flag array and turn variable verification for race conditions.', 2, true),
  makeTopic('os-3-3', 'subj-os', 'os-3', 'Counting & Binary Semaphores', 'Wait (P) and Signal (V) operations, value range calculations under concurrent threads.', 3, true),
  makeTopic('os-3-4', 'subj-os', 'os-3', 'Classical Synchronization Problems', 'Producer-Consumer, Reader-Writer (Readers preference vs Writers preference), Dining Philosophers.', 4, true),

  makeTopic('os-4', 'subj-os', null, 'Deadlocks: Detection, Prevention & Avoidance', 'Necessary conditions for deadlock, Resource Allocation Graph (RAG), and Banker Algorithm for multi-instance safety.', 4, true),
  makeTopic('os-4-1', 'subj-os', 'os-4', 'Deadlock Conditions & RAG Cycles', 'Mutual exclusion, Hold & Wait, No Preemption, Circular Wait, knot detection in RAG.', 1, false),
  makeTopic('os-4-2', 'subj-os', 'os-4', 'Banker Algorithm for Safety & Resource Request', 'Need matrix computation, safety state sequence finding, resource request validation.', 2, true),

  makeTopic('os-5', 'subj-os', null, 'Memory Management & Paging', 'Contiguous memory allocation, logical to physical address translation, Page Tables, and Multilevel Paging.', 5, true),
  makeTopic('os-5-1', 'subj-os', 'os-5', 'Single & Multi-Level Page Table Translation', 'Page number/offset split, Page Table Entry (PTE) size, Page Table Base Register (PTBR).', 1, true),
  makeTopic('os-5-2', 'subj-os', 'os-5', 'Inverted Page Tables & Segmentation', 'Hashing global frame table by process ID, segmentation with base/limit registers.', 2, false),

  makeTopic('os-6', 'subj-os', null, 'Virtual Memory & Page Replacement', 'Demand paging, Translation Lookaside Buffer (TLB) Effective Memory Access Time, and Page Replacement Algorithms.', 6, true),
  makeTopic('os-6-1', 'subj-os', 'os-6', 'TLB Hit Ratio & Effective Memory Access Time (EMAT)', 'Formula: EMAT = h*(TLB + M) + (1-h)*(TLB + 2*M), multi-level page table EMAT.', 1, true),
  makeTopic('os-6-2', 'subj-os', 'os-6', 'Page Replacement: FIFO, LRU, Optimal & Belady Anomaly', 'Page fault counting on reference strings, FIFO Belady anomaly demonstration, stack property in LRU.', 2, true),
  makeTopic('os-6-3', 'subj-os', 'os-6', 'Thrashing & Working Set Model', 'Page fault frequency, working set window Delta, frame allocation to avoid CPU collapse.', 3, false),

  makeTopic('os-7', 'subj-os', null, 'Disk Scheduling & File Systems', 'Disk geometry, Seek time calculations (FCFS, SSTF, SCAN, C-SCAN, LOOK, C-LOOK), and Unix Inode structural calculations.', 7, true),
  makeTopic('os-7-1', 'subj-os', 'os-7', 'Disk Arm Scheduling Algorithms', 'Track movement calculations for SCAN/ELEVATOR vs C-SCAN (unidirectional) vs LOOK.', 1, true),
  makeTopic('os-7-2', 'subj-os', 'os-7', 'Unix Inode File System Structure', 'Direct, Single Indirect, Double Indirect, Triple Indirect block pointers and maximum file size calculations.', 2, true),

  // ==========================================
  // 3. C-PROGRAMMING (subj-prog)
  // ==========================================
  makeTopic('pr-1', 'subj-prog', null, 'Operators, Expressions & Control Flow', 'Operator precedence, associativity rules, short-circuit boolean evaluation, type conversions, and switch-case flow.', 1, false),
  makeTopic('pr-1-1', 'subj-prog', 'pr-1', 'Operator Precedence & Associativity', 'Prefix/Postfix ++/--, bitwise vs logical operators, ternary evaluation.', 1, false),
  makeTopic('pr-1-2', 'subj-prog', 'pr-1', 'Short-Circuiting in Logical Expressions', 'Evaluation skipping in && (stops on 0) and || (stops on 1).', 2, true),

  makeTopic('pr-2', 'subj-prog', null, 'Pointers & Pointer Arithmetic', 'Pointer arithmetic, pointers to pointers, pointer arrays, array decaying, and function pointers.', 2, true),
  makeTopic('pr-2-1', 'subj-prog', 'pr-2', 'Pointer Arithmetic & Array Subscripting', 'Equivalence of a[i] == *(a+i) == i[a], multi-dimensional array address offsets.', 1, true),
  makeTopic('pr-2-2', 'subj-prog', 'pr-2', 'Array of Pointers vs Pointer to Array', 'Syntax differences: int *arr[10] vs int (*ptr)[10], memory allocation.', 2, true),
  makeTopic('pr-2-3', 'subj-prog', 'pr-2', 'Function Pointers & Callbacks', 'Declaring and calling via function pointer signatures: void (*fp)(int).', 3, false),

  makeTopic('pr-3', 'subj-prog', null, 'Recursion & Call Stack Execution', 'Recursive tracing, base conditions, tree recursion call stacks, and static/global variable side effects in recursion.', 3, true),
  makeTopic('pr-3-1', 'subj-prog', 'pr-3', 'Tree Recursion & Stack Activation Records', 'Recursive return value aggregation, activation record stack depth, unwinding phases.', 1, true),
  makeTopic('pr-3-2', 'subj-prog', 'pr-3', 'Static & Global Variables inside Recursive Functions', 'Persistent state across recursive activations, tracing output mutations.', 2, true),

  makeTopic('pr-4', 'subj-prog', null, 'Structures, Unions & Dynamic Memory', 'Memory layout, padding/alignment, struct dereferencing, and malloc/calloc/realloc/free management.', 4, false),
  makeTopic('pr-4-1', 'subj-prog', 'pr-4', 'Struct Padding & Data Alignment', 'Word alignment boundaries, sizeof calculations, bit fields in structures.', 1, false),
  makeTopic('pr-4-2', 'subj-prog', 'pr-4', 'Dynamic Memory Management & Memory Leaks', 'malloc vs calloc initialization, dangling pointers, memory leak causes.', 2, false),

  // ==========================================
  // 4. DATA STRUCTURES (subj-ds)
  // ==========================================
  makeTopic('ds-1', 'subj-ds', null, 'Arrays & Linked Lists', 'Array address calculations (row-major vs column-major), Singly/Doubly/Circular linked lists, and cycle detection.', 1, false),
  makeTopic('ds-1-1', 'subj-ds', 'ds-1', 'Row-Major & Column-Major Array Offsets', 'Address calculation formula: Base + ((i - L1)*dim2 + (j - L2)) * element_size.', 1, true),
  makeTopic('ds-1-2', 'subj-ds', 'ds-1', 'Linked List Operations & Floyd Cycle Detection', 'In-place linked list reversal, slow/fast pointer cycle detection and entry point.', 2, false),

  makeTopic('ds-2', 'subj-ds', null, 'Stacks, Queues & Applications', 'LIFO stack operations, Infix to Postfix/Prefix conversion, Postfix expression evaluation, and Circular Queues.', 2, true),
  makeTopic('ds-2-1', 'subj-ds', 'ds-2', 'Infix, Postfix & Prefix Conversions', 'Stack-based operator precedence handling, parentheses matching, expression evaluation.', 1, true),
  makeTopic('ds-2-2', 'subj-ds', 'ds-2', 'Circular Queue & Deque Implementations', 'Modulo arithmetic for full/empty queue conditions: (rear+1)%N == front.', 2, false),

  makeTopic('ds-3', 'subj-ds', null, 'Binary Trees & Tree Traversals', 'Tree properties (height, node counts), Inorder, Preorder, Postorder traversals, and unique tree reconstruction.', 3, true),
  makeTopic('ds-3-1', 'subj-ds', 'ds-3', 'Tree Properties & Node Count Bounds', 'Strict binary tree leaf nodes: L = I + 1, maximum nodes at depth d: 2^d.', 1, true),
  makeTopic('ds-3-2', 'subj-ds', 'ds-3', 'Tree Reconstruction from Traversals', 'Unique binary tree construction requiring Inorder + (Preorder OR Postorder).', 2, true),

  makeTopic('ds-4', 'subj-ds', null, 'Binary Search Trees (BST) & AVL Trees', 'BST search/insertion/deletion, Inorder predecessor/successor, and AVL tree rotations & height balance.', 4, true),
  makeTopic('ds-4-1', 'subj-ds', 'ds-4', 'BST Search, Insertion & Deletion Cases', 'Node deletion cases (0, 1, 2 children), BST validation from preorder sequence.', 1, true),
  makeTopic('ds-4-2', 'subj-ds', 'ds-4', 'AVL Tree Rotations & Balance Factor', 'LL, RR, LR, RL single and double rotations, minimum nodes for height h: N(h) = N(h-1) + N(h-2) + 1.', 2, true),

  makeTopic('ds-5', 'subj-ds', null, 'Binary Heaps & Priority Queues', 'Min-Heap and Max-Heap properties, array representation, Heapify algorithm, and Heap Sort analysis.', 5, true),
  makeTopic('ds-5-1', 'subj-ds', 'ds-5', 'Heapify Algorithm & Build-Heap Complexity', 'Bottom-up O(n) Build-Heap derivation vs top-down O(n log n) insertion sequence.', 1, true),
  makeTopic('ds-5-2', 'subj-ds', 'ds-5', 'Extract-Min/Max & Priority Queue Operations', 'Percolate down / up operations in O(log n), Kth largest element using heap.', 2, true),

  makeTopic('ds-6', 'subj-ds', null, 'Hashing & Collision Resolution', 'Hash functions, Linear Probing, Quadratic Probing, Double Hashing, Separate Chaining, and load factor.', 6, true),
  makeTopic('ds-6-1', 'subj-ds', 'ds-6', 'Open Addressing Collision Probing', 'Linear probing clustering vs Quadratic probing vs Double hashing secondary hash.', 1, true),
  makeTopic('ds-6-2', 'subj-ds', 'ds-6', 'Separate Chaining & Search Complexities', 'Load factor alpha = n/m, average successful and unsuccessful search times.', 2, true),

  // ==========================================
  // 5. DIGITAL LOGIC (subj-dl)
  // ==========================================
  makeTopic('dl-1', 'subj-dl', null, 'Boolean Algebra & K-Map Minimization', 'Boolean theorems, SOP/POS forms, Karnaugh Maps, Prime Implicants, and Essential Prime Implicants.', 1, true),
  makeTopic('dl-1-1', 'subj-dl', 'dl-1', 'Boolean Laws & Canonical Forms', 'De Morgan laws, Consensus theorem, Duality principle, minterms and maxterms.', 1, false),
  makeTopic('dl-1-2', 'subj-dl', 'dl-1', 'K-Map Minimization with Don\'t Cares', 'Finding Essential Prime Implicants, minimizing multi-variable Boolean expressions.', 2, true),

  makeTopic('dl-2', 'subj-dl', null, 'Number Representations & Arithmetic', 'Signed magnitude, 1s complement, 2s complement range/arithmetic, overflow detection, and IEEE 754 floating point format.', 2, true),
  makeTopic('dl-2-1', 'subj-dl', 'dl-2', '2s Complement Representation & Overflow', 'Range [-2^(n-1), 2^(n-1)-1], overflow detection rule (Cin XOR Cout of MSB).', 1, true),
  makeTopic('dl-2-2', 'subj-dl', 'dl-2', 'IEEE 754 Floating-Point Standard', 'Single precision (32-bit: 1 sign, 8 exponent with bias 127, 23 mantissa), normalized values.', 2, true),

  makeTopic('dl-3', 'subj-dl', null, 'Combinational Logic Circuits', 'Multiplexers, Demultiplexers, Decoders, Encoders, Priority Encoders, Half/Full Adders, and Carry Look-Ahead Adders.', 3, true),
  makeTopic('dl-3-1', 'subj-dl', 'dl-3', 'Multiplexer Implementation of Logic Functions', 'Implementing n-variable boolean functions using 2^(n-1) to 1 MUX.', 1, true),
  makeTopic('dl-3-2', 'subj-dl', 'dl-3', 'Decoders & Encoders with Enable Lines', 'Constructing higher order decoders from smaller decoders, active-low logic.', 2, false),
  makeTopic('dl-3-3', 'subj-dl', 'dl-3', 'Carry Look-Ahead Adder Delay Analysis', 'Carry propagate Pi and generate Gi logic, constant addition delay.', 3, true),

  makeTopic('dl-4', 'subj-dl', null, 'Sequential Circuits & Flip-Flops', 'SR, JK, D, T Flip-Flops, characteristic equations, Master-Slave configuration, and Setup/Hold timing violations.', 4, true),
  makeTopic('dl-4-1', 'subj-dl', 'dl-4', 'Flip-Flop Characteristic & Excitation Equations', 'JK race-around condition, D flip-flop Q(t+1)=D, T flip-flop toggle logic.', 1, true),
  makeTopic('dl-4-2', 'subj-dl', 'dl-4', 'Setup Time, Hold Time & Maximum Clock Frequency', 'Clock period Tclk >= Tcq + Tcomb + Tsetup, skew calculations.', 2, true),

  makeTopic('dl-5', 'subj-dl', null, 'Counters & State Machines', 'Synchronous & Asynchronous (Ripple) counters, Mod-N counters, Up/Down counters, and Mealy vs Moore state models.', 5, true),
  makeTopic('dl-5-1', 'subj-dl', 'dl-5', 'Synchronous vs Ripple Counter Delays', 'Ripple counter propagation delay n*Tpd vs synchronous clocking.', 1, true),
  makeTopic('dl-5-2', 'subj-dl', 'dl-5', 'Mod-N Counter Design & State Diagram Sequence', 'Unused states, lockout prevention, ring counter and Johnson counter mod values.', 2, true),

  // ==========================================
  // 6. THEORY OF COMPUTATION (subj-toc)
  // ==========================================
  makeTopic('toc-1', 'subj-toc', null, 'Finite Automata: DFA & NFA', 'Deterministic and Non-Deterministic Finite Automata, subset construction, DFA state minimization, and dead states.', 1, true),
  makeTopic('toc-1-1', 'subj-toc', 'toc-1', 'DFA Construction & Substring/Modulus Languages', 'Constructing minimal DFAs for binary numbers divisible by k, modulo arithmetic states.', 1, true),
  makeTopic('toc-1-2', 'subj-toc', 'toc-1', 'DFA State Minimization & Myhill-Nerode Theorem', 'Table-filling equivalence partitioning algorithm, finding minimum state count.', 2, true),
  makeTopic('toc-1-3', 'subj-toc', 'toc-1', 'NFA to DFA Conversion & State Power-Set Bounds', 'Subset construction algorithm, maximum states in equivalent DFA (2^n).', 3, false),

  makeTopic('toc-2', 'subj-toc', null, 'Regular Expressions & Regular Languages', 'Regular expressions, Arden Theorem, Pumping Lemma for regular languages, and closure properties of regular languages.', 2, true),
  makeTopic('toc-2-1', 'subj-toc', 'toc-2', 'Regular Expression Identities & Equivalence', 'Arden theorem: R = Q + RP => R = QP*, converting DFA transitions to RegEx.', 1, false),
  makeTopic('toc-2-2', 'subj-toc', 'toc-2', 'Pumping Lemma for Regular Languages & Non-Regularity', 'Pumping lemma condition |xy| <= p, y != epsilon, proving languages like a^n b^n are non-regular.', 2, true),
  makeTopic('toc-2-3', 'subj-toc', 'toc-2', 'Closure Properties of Regular Languages', 'Union, intersection, complement, concatenation, Kleene star, reversal, homomorphism.', 3, true),

  makeTopic('toc-3', 'subj-toc', null, 'Context-Free Grammars & Pushdown Automata', 'CFG generation, ambiguous grammars, Chomsky Normal Form, and Deterministic vs Non-Deterministic Pushdown Automata.', 3, true),
  makeTopic('toc-3-1', 'subj-toc', 'toc-3', 'CFG Ambiguity & Inherently Ambiguous Languages', 'Multiple leftmost derivations/parse trees for the same string, ambiguity undecidability.', 1, true),
  makeTopic('toc-3-2', 'subj-toc', 'toc-3', 'Pushdown Automata (DPDA vs NPDA)', 'DPDA (DCFL) strictly less powerful than NPDA (CFL), acceptance by empty stack vs final state.', 2, true),
  makeTopic('toc-3-3', 'subj-toc', 'toc-3', 'Closure Properties of CFL & DCFL', 'CFL closed under union/concatenation/star, NOT closed under intersection/complement.', 3, true),

  makeTopic('toc-4', 'subj-toc', null, 'Turing Machines & Chomsky Hierarchy', 'Turing machine formal definition, Recursive vs Recursively Enumerable languages, and Chomsky 4-tier grammar hierarchy.', 4, true),
  makeTopic('toc-4-1', 'subj-toc', 'toc-4', 'Chomsky Hierarchy: Types 0, 1, 2, 3', 'Regular (Type 3) subset of DCFL subset of CFL (Type 2) subset of CSL (Type 1) subset of Recursive subset of RE (Type 0).', 1, true),
  makeTopic('toc-4-2', 'subj-toc', 'toc-4', 'Recursive (REC) vs Recursively Enumerable (RE)', 'REC halts on all inputs (decidable), RE halts on yes-instances (semi-decidable).', 2, true),

  makeTopic('toc-5', 'subj-toc', null, 'Decidability, Halting Problem & Reductions', 'Decidable vs Undecidable problems across language classes, Halting Problem proof, Rice Theorem, and PCP.', 5, true),
  makeTopic('toc-5-1', 'subj-toc', 'toc-5', 'Decidability Table for Language Families', 'Membership, Emptiness, Finiteness, Equivalence, Intersection-emptiness decidability grid.', 1, true),
  makeTopic('toc-5-2', 'subj-toc', 'toc-5', 'Halting Problem & Rice\'s Theorem', 'Halting problem undecidability proof, Rice Theorem on non-trivial semantic properties of RE languages.', 2, true),
  makeTopic('toc-5-3', 'subj-toc', 'toc-5', 'Post Correspondence Problem (PCP)', 'PCP and Modified PCP undecidability, reductions from PCP to CFG ambiguity.', 3, false),

  // ==========================================
  // 7. COMPILER DESIGN (subj-cd)
  // ==========================================
  makeTopic('cd-1', 'subj-cd', null, 'Lexical Analysis', 'Tokenization, Lex specification, transition diagrams, longest match rule, and handling buffer pairs.', 1, false),
  makeTopic('cd-1-1', 'subj-cd', 'cd-1', 'Token, Pattern, Lexeme Recognition', 'Differentiating keywords, identifiers, constants, regular expressions in Lex.', 1, false),

  makeTopic('cd-2', 'subj-cd', null, 'Top-Down Parsing: LL(1)', 'FIRST and FOLLOW set computation algorithms, LL(1) parsing table construction, and eliminating left recursion & left factoring.', 2, true),
  makeTopic('cd-2-1', 'subj-cd', 'cd-2', 'FIRST & FOLLOW Computation Algorithms', 'Nullable productions, epsilon propagation rules, end-marker $ placement.', 1, true),
  makeTopic('cd-2-2', 'subj-cd', 'cd-2', 'LL(1) Parsing Table & Conflict Detection', 'Table cell collisions M[A, a], condition for grammar to be LL(1) (disjoint FIRST sets).', 2, true),
  makeTopic('cd-2-3', 'subj-cd', 'cd-2', 'Eliminating Left Recursion & Left Factoring', 'Immediate left recursion elimination A -> A alpha | beta to A -> beta A\', A\' -> alpha A\' | eps.', 3, false),

  makeTopic('cd-3', 'subj-cd', null, 'Bottom-Up Parsing: LR Parsers', 'Shift-reduce parsing, LR(0) items, SLR(1), CLR(1), LALR(1) item sets, and resolving Shift-Reduce / Reduce-Reduce conflicts.', 3, true),
  makeTopic('cd-3-1', 'subj-cd', 'cd-3', 'LR(0) and SLR(1) Parsing Tables & Conflicts', 'Augmented grammar, CLOSURE, GOTO operations, SLR(1) reduction only in FOLLOW(A).', 1, true),
  makeTopic('cd-3-2', 'subj-cd', 'cd-3', 'CLR(1) vs LALR(1) Parsing & State Merging', 'LR(1) lookahead propagation, merging states with identical cores, LALR(1) introduce RR conflicts only.', 2, true),
  makeTopic('cd-3-3', 'subj-cd', 'cd-3', 'Parser Power Hierarchy Comparison', 'LR(0) < SLR(1) < LALR(1) < CLR(1), number of states: LR(0) = SLR(1) = LALR(1) < CLR(1).', 3, true),

  makeTopic('cd-4', 'subj-cd', null, 'Syntax-Directed Translation (SDT)', 'Syntax-Directed Definitions (SDD), Synthesized vs Inherited attributes, S-attributed definitions, and L-attributed definitions.', 4, true),
  makeTopic('cd-4-1', 'subj-cd', 'cd-4', 'S-Attributed Definitions & Bottom-Up Evaluation', 'Only synthesized attributes, evaluated during bottom-up parsing reductions.', 1, true),
  makeTopic('cd-4-2', 'subj-cd', 'cd-4', 'L-Attributed Definitions & Dependency Graphs', 'Inherited attributes depend only on parent and left siblings, top-down and bottom-up evaluation.', 2, true),

  makeTopic('cd-5', 'subj-cd', null, 'Intermediate Code Generation & Code Optimization', 'Three-Address Code (TAC), Quadruples, Triples, Basic Blocks, Control Flow Graphs (CFG), and Loop Optimizations.', 5, true),
  makeTopic('cd-5-1', 'subj-cd', 'cd-5', 'Three-Address Code Generation & DAG Representation', 'Directed Acyclic Graphs (DAG) for basic blocks, subexpression elimination.', 1, true),
  makeTopic('cd-5-2', 'subj-cd', 'cd-5', 'Basic Block Partitioning & CFG Leaders', 'Leader identification rules: First statement, target of jump, statement following jump.', 2, true),
  makeTopic('cd-5-3', 'subj-cd', 'cd-5', 'Code Optimization Techniques', 'Constant folding, constant propagation, dead code elimination, loop invariant code motion.', 3, false),

  // ==========================================
  // 8. ALGORITHMS (subj-algo)
  // ==========================================
  makeTopic('alg-1', 'subj-algo', null, 'Asymptotic Analysis & Recurrences', 'Big-O, Omega, Theta, Little-o/omega notations, Master Theorem cases, Akra-Bazzi method, and recursion tree analysis.', 1, true),
  makeTopic('alg-1-1', 'subj-algo', 'alg-1', 'Asymptotic Growth Rates & Function Ordering', 'Comparing log n, n^c, c^n, n!, n^n growth rates using limits.', 1, true),
  makeTopic('alg-1-2', 'subj-algo', 'alg-1', 'Master Theorem for Divide & Conquer', 'Cases T(n) = aT(n/b) + f(n): compare f(n) with n^(log_b a), log factors.', 2, true),

  makeTopic('alg-2', 'subj-algo', null, 'Sorting & Searching Algorithms', 'Comparison sorts: Merge Sort, Quick Sort (partitioning & worst-case analysis), Heap Sort, Counting Sort, and lower bounds.', 2, true),
  makeTopic('alg-2-1', 'subj-algo', 'alg-2', 'Quick Sort Partitioning & Worst-Case Analysis', 'Lomuto/Hoare partitioning, worst-case O(n^2) when already sorted with extreme pivot, randomized quicksort.', 1, true),
  makeTopic('alg-2-2', 'subj-algo', 'alg-2', 'Merge Sort & Comparison Lower Bound Omega(n log n)', 'Divide & conquer stability, decision tree model for comparison-based sorting lower bound.', 2, true),

  makeTopic('alg-3', 'subj-algo', null, 'Greedy Algorithms', 'Greedy-choice property, Fractional Knapsack, Huffman Coding tree construction, and Activity Selection scheduling.', 3, true),
  makeTopic('alg-3-1', 'subj-algo', 'alg-3', 'Huffman Coding & Optimal Prefix Codes', 'Bottom-up prefix code tree, minimum bits calculation for message transmission.', 1, true),
  makeTopic('alg-3-2', 'subj-algo', 'alg-3', 'Fractional Knapsack & Activity Selection', 'Sorting by value/weight ratio or finish times, optimal greedy schedule proof.', 2, false),

  makeTopic('alg-4', 'subj-algo', null, 'Dynamic Programming', 'Optimal substructure, overlapping subproblems, 0/1 Knapsack, Longest Common Subsequence (LCS), Matrix Chain Multiplication (MCM).', 4, true),
  makeTopic('alg-4-1', 'subj-algo', 'alg-4', '0/1 Knapsack Problem DP Formulation', 'DP state transition T[i, w] = max(T[i-1, w], val[i] + T[i-1, w-wt[i]]), space optimization.', 1, true),
  makeTopic('alg-4-2', 'subj-algo', 'alg-4', 'Longest Common Subsequence (LCS) & Edit Distance', 'Table filling algorithm O(m*n), string transformation cost analysis.', 2, true),
  makeTopic('alg-4-3', 'subj-algo', 'alg-4', 'Matrix Chain Multiplication (MCM)', 'Parenthesization cost minimization m[i,j] = min(m[i,k] + m[k+1,j] + p_{i-1}p_k p_j).', 3, true),

  makeTopic('alg-5', 'subj-algo', null, 'Graph Algorithms: Traversal, Shortest Paths & MST', 'BFS, DFS, Topological Sorting, Dijkstra, Bellman-Ford, Floyd-Warshall, Kruskal, and Prim algorithms.', 5, true),
  makeTopic('alg-5-1', 'subj-algo', 'alg-5', 'BFS, DFS & Topological Sorting', 'Queue BFS vs Stack DFS, cycle detection in directed graphs, Kahn algorithm.', 1, true),
  makeTopic('alg-5-2', 'subj-algo', 'alg-5', 'Shortest Paths: Dijkstra, Bellman-Ford, Floyd-Warshall', 'Dijkstra non-negative weights O((V+E)log V), Bellman-Ford negative cycle detection O(V*E), Floyd-Warshall O(V^3).', 2, true),
  makeTopic('alg-5-3', 'subj-algo', 'alg-5', 'Minimum Spanning Trees: Kruskal & Prim', 'Kruskal using Disjoint Set Union (DSU) O(E log E), Prim greedy cut property O(E log V).', 3, true),

  makeTopic('alg-6', 'subj-algo', null, 'NP-Completeness & Reductions', 'P vs NP, NP-Hard vs NP-Complete definitions, polynomial-time reductions, Circuit SAT, 3-SAT, Vertex Cover, and Clique.', 6, false),
  makeTopic('alg-6-1', 'subj-algo', 'alg-6', 'P, NP, NP-Complete & NP-Hard Classes', 'Deterministic vs non-deterministic polynomial time, verification vs finding certificates.', 1, false),
  makeTopic('alg-6-2', 'subj-algo', 'alg-6', 'Classical NP-Complete Problems & Reductions', 'Cook-Levin Theorem (SAT), 3-SAT to Vertex Cover and Independent Set reductions.', 2, true),

  // ==========================================
  // 9. DATABASE MANAGEMENT SYSTEMS (subj-dbms)
  // ==========================================
  makeTopic('db-1', 'subj-dbms', null, 'ER-Model & Relational Model', 'Entity-Relationship diagrams, cardinality/participation constraints, converting ER to relational tables, and weak entities.', 1, false),
  makeTopic('db-1-1', 'subj-dbms', 'db-1', 'ER Diagrams to Relational Tables Mapping', 'Minimum tables required for 1:1, 1:N, M:N relationships, handling weak entity keys.', 1, true),

  makeTopic('db-2', 'subj-dbms', null, 'Relational Algebra & Tuple Calculus', 'Selection, Projection, Cartesian Product, Set Difference, Joins (Natural, Outer, Theta), Division, and TRC safety.', 2, true),
  makeTopic('db-2-1', 'subj-dbms', 'db-2', 'Relational Algebra Operators & Relational Division', 'Division operator R / S for "for all" queries, natural join vs cross product.', 1, true),
  makeTopic('db-2-2', 'subj-dbms', 'db-2', 'Tuple & Domain Relational Calculus (TRC / DRC)', 'First-order logic queries, safe vs unsafe expressions in relational calculus.', 2, false),

  makeTopic('db-3', 'subj-dbms', null, 'SQL Queries, Joins & Aggregations', 'SELECT clauses, GROUP BY, HAVING, subqueries, Correlated Subqueries, INNER/LEFT/RIGHT/FULL OUTER JOIN, and NULL logic.', 3, true),
  makeTopic('db-3-1', 'subj-dbms', 'db-3', 'SQL Joins & NULL Value 3-Valued Logic', 'TRUE, FALSE, UNKNOWN truth tables, LEFT OUTER JOIN with NULL filtering.', 1, true),
  makeTopic('db-3-2', 'subj-dbms', 'db-3', 'GROUP BY, HAVING & Nested Correlated Subqueries', 'Aggregate functions (COUNT, SUM, AVG), EXISTS / NOT EXISTS correlated subqueries.', 2, true),

  makeTopic('db-4', 'subj-dbms', null, 'Functional Dependencies & Normalization', 'Armstrong axioms, Attribute Closure, Candidate Keys, Canonical Cover, 1NF, 2NF, 3NF, BCNF, and Decomposition.', 4, true),
  makeTopic('db-4-1', 'subj-dbms', 'db-4', 'Attribute Closure & Finding Candidate Keys', 'Computing X+, finding all candidate keys and super keys algorithm.', 1, true),
  makeTopic('db-4-2', 'subj-dbms', 'db-4', 'Canonical / Minimal Cover of Functional Dependencies', 'Eliminating extraneous left attributes, removing redundant FDs.', 2, true),
  makeTopic('db-4-3', 'subj-dbms', 'db-4', 'Normal Forms: 2NF, 3NF, BCNF Identification', '2NF (no partial dependency), 3NF (transitive dependency: X is superkey or Y is prime), BCNF (X is superkey).', 3, true),
  makeTopic('db-4-4', 'subj-dbms', 'db-4', 'Lossless Join & Dependency Preserving Decompositions', 'Lossless join test: R1 cap R2 -> (R1 - R2) or (R2 - R1), dependency preservation checking.', 4, true),

  makeTopic('db-5', 'subj-dbms', null, 'Transactions & Concurrency Control', 'ACID properties, Schedule Serializability, Conflict Serializability (Precedence Graphs), Recoverability, and 2PL.', 5, true),
  makeTopic('db-5-1', 'subj-dbms', 'db-5', 'Conflict Serializability & Precedence Graph Cycles', 'Conflict operations (R-W, W-R, W-W on same data item), topological sort for equivalent serial order.', 1, true),
  makeTopic('db-5-2', 'subj-dbms', 'db-5', 'Recoverable & Cascadeless Schedules', 'Dirty read problem, uncommitted dependency abort recovery order.', 2, true),
  makeTopic('db-5-3', 'subj-dbms', 'db-5', 'Two-Phase Locking (2PL) & Strict / Rigorous 2PL', 'Growing vs shrinking phase, Strict 2PL ensures conflict serializability + recoverable schedule.', 3, true),

  makeTopic('db-6', 'subj-dbms', null, 'File Organization & B / B+ Trees', 'Primary, Secondary, Clustered indexing, B-Tree and B+ Tree order, maximum/minimum keys, node splits, and height.', 6, true),
  makeTopic('db-6-1', 'subj-dbms', 'db-6', 'B+ Tree Structure & Node Key Bounds', 'Order p: leaf node vs internal node pointer/key counts, ceiling(p/2) minimum capacity.', 1, true),
  makeTopic('db-6-2', 'subj-dbms', 'db-6', 'Search, Insert & Block Access Calculations in B+ Trees', 'Calculating I/O block accesses for search, node splitting on overflow.', 2, true),

  // ==========================================
  // 10. COMPUTER ORGANIZATION & ARCHITECTURE (subj-coa)
  // ==========================================
  makeTopic('coa-1', 'subj-coa', null, 'Machine Instructions & Addressing Modes', 'Instruction formats (0, 1, 2, 3 address), Addressing modes (Immediate, Direct, Indirect, Indexed, Base, Relative), and instruction cycles.', 1, true),
  makeTopic('coa-1-1', 'subj-coa', 'coa-1', 'Addressing Modes & Effective Address Calculations', 'Immediate, Register Indirect, Auto-increment, PC-Relative offset, Indexed addressing.', 1, true),
  makeTopic('coa-1-2', 'subj-coa', 'coa-1', 'Instruction Encoding & Expanding Opcodes', 'Variable length opcode encoding, maximum instructions given register count and address bits.', 2, true),

  makeTopic('coa-2', 'subj-coa', null, 'Instruction Pipelining & Hazard Analysis', 'Pipeline stages (IF, ID, EX, MEM, WB), Speedup formula, Structural, Data (RAW, WAR, WAW), and Control Hazards with branch penalties.', 2, true),
  makeTopic('coa-2-1', 'subj-coa', 'coa-2', 'Pipeline Speedup, Throughput & Efficiency', 'Formula: Speedup S = (n * k) / (k + n - 1 + stalls) as n -> infinity S -> k.', 1, true),
  makeTopic('coa-2-2', 'subj-coa', 'coa-2', 'Data Hazards & Operand Forwarding', 'Read-After-Write (RAW) true dependency, stall cycles calculation with/without forwarding.', 2, true),
  makeTopic('coa-2-3', 'subj-coa', 'coa-2', 'Control Hazards & Branch Prediction', 'Branch penalty clock cycles, delayed branching, branch target buffer (BTB).', 3, true),

  makeTopic('coa-3', 'subj-coa', null, 'Cache Memory Organization & AMAT', 'Direct mapped, Fully Associative, Set-Associative mapping, Tag/Set/Offset bit partitions, Write-through vs Write-back, and AMAT.', 3, true),
  makeTopic('coa-3-1', 'subj-coa', 'coa-3', 'Cache Address Splitting: Tag, Set, Block Offset', 'Formulas: Offset = log2(Block Size), Set = log2(Num Sets), Tag = Addr - Set - Offset.', 1, true),
  makeTopic('coa-3-2', 'subj-coa', 'coa-3', 'Average Memory Access Time (AMAT) & Multi-Level Cache', 'AMAT = T_L1 + M_L1 * (T_L2 + M_L2 * T_Main), simultaneous vs hierarchical access.', 2, true),
  makeTopic('coa-3-3', 'subj-coa', 'coa-3', 'Write Policies & Cache Replacement (LRU, FIFO)', 'Write-through with write-buffer vs write-back with dirty bit, LRU bit tracking.', 3, false),

  makeTopic('coa-4', 'subj-coa', null, 'Main Memory Interleaving & Virtual Memory', 'High-order vs Low-order interleaved memory banks, memory access cycle time, Page tables, and TLB hit access.', 4, true),
  makeTopic('coa-4-1', 'subj-coa', 'coa-4', 'Memory Interleaving & Bandwidth Analysis', 'Low-order interleaving for continuous pipeline memory bandwidth.', 1, false),
  makeTopic('coa-4-2', 'subj-coa', 'coa-4', 'Virtual Memory Address Translation in Hardware', 'Virtual Page Number (VPN) to Physical Frame Number (PFN) translation with TLB.', 2, true),

  makeTopic('coa-5', 'subj-coa', null, 'Data-Path, Control Unit & I/O / DMA', 'Single-cycle vs multi-cycle datapath, Hardwired vs Microprogrammed control, Interrupt latency, and Direct Memory Access (DMA).', 5, false),
  makeTopic('coa-5-1', 'subj-coa', 'coa-5', 'Hardwired vs Microprogrammed Control Units', 'Horizontal vs vertical microinstructions, control store size calculations.', 1, false),
  makeTopic('coa-5-2', 'subj-coa', 'coa-5', 'I/O Organization & DMA Transfer Modes', 'Cycle stealing mode vs Burst mode DMA transfer bandwidth calculations.', 2, true),

  // ==========================================
  // 11. DISCRETE MATHEMATICS (subj-dm)
  // ==========================================
  makeTopic('dm-1', 'subj-dm', null, 'Propositional & First-Order Logic', 'Truth tables, Logical equivalences, Tautology/Contradiction, CNF/DNF normal forms, Predicate quantifiers (Forall, Exists), and validity.', 1, true),
  makeTopic('dm-1-1', 'subj-dm', 'dm-1', 'Propositional Logic & Tautological Equivalences', 'Implication p -> q == ~p v q, Contrapositive, De Morgan rules in logic.', 1, true),
  makeTopic('dm-1-2', 'subj-dm', 'dm-1', 'First-Order Predicate Logic & Quantifier Scope', 'Negating quantifiers ~(forall x P(x)) == exists x ~P(x), translating English statements.', 2, true),

  makeTopic('dm-2', 'subj-dm', null, 'Sets, Relations, Functions & Posets', 'Equivalence relations, Partial Orders (Posets), Hasse diagrams, Lattices (complete/distributive), and Injective/Surjective functions.', 2, true),
  makeTopic('dm-2-1', 'subj-dm', 'dm-2', 'Relations: Reflexive, Symmetric, Transitive & Closures', 'Number of reflexive 2^(n^2-n), symmetric 2^(n(n+1)/2), and equivalence relations (Bell numbers).', 1, true),
  makeTopic('dm-2-2', 'subj-dm', 'dm-2', 'Posets, Hasse Diagrams & Lattices', 'GLB (meet), LUB (join), complemented and distributive lattice properties.', 2, true),

  makeTopic('dm-3', 'subj-dm', null, 'Combinatorics & Recurrence Relations', 'Permutations & Combinations, Pigeonhole Principle, Inclusion-Exclusion, Generating Functions, and Homogeneous/Non-homogeneous Recurrences.', 3, true),
  makeTopic('dm-3-1', 'subj-dm', 'dm-3', 'Pigeonhole Principle & Combinatorial Counting', 'Generalized pigeonhole principle ceil(N/k), stars and bars distribution formula C(n+k-1, k-1).', 1, true),
  makeTopic('dm-3-2', 'subj-dm', 'dm-3', 'Linear Recurrence Relations & Characteristic Roots', 'Solving an = c1*a_{n-1} + c2*a_{n-2}, repeated roots, particular solutions.', 2, true),

  makeTopic('dm-4', 'subj-dm', null, 'Graph Theory: Paths, Cycles & Coloring', 'Handshaking lemma, Euler tours, Hamiltonian cycles, Planar graphs, Euler formula, Chromatic numbers, and Graph Isomorphism.', 4, true),
  makeTopic('dm-4-1', 'subj-dm', 'dm-4', 'Handshaking Lemma & Degree Sequences', 'Sum of degrees = 2 * |E|, Havel-Hakimi theorem for graphical degree sequences.', 1, true),
  makeTopic('dm-4-2', 'subj-dm', 'dm-4', 'Eulerian Graphs vs Hamiltonian Graphs', 'Eulerian iff all vertices have even degree, Dirac/Ore sufficient conditions for Hamiltonian.', 2, true),
  makeTopic('dm-4-3', 'subj-dm', 'dm-4', 'Planar Graphs, Euler Formula & Graph Coloring', 'Euler formula V - E + F = 2, max edges E <= 3V - 6, chromatic number chi(G) bounds.', 3, true),

  makeTopic('dm-5', 'subj-dm', null, 'Group Theory & Algebraic Structures', 'Semi-groups, Monoids, Groups, Abelian Groups, Subgroups, Cyclic groups, and Lagrange Theorem.', 5, false),
  makeTopic('dm-5-1', 'subj-dm', 'dm-5', 'Groups, Cyclic Groups & Lagrange Theorem', 'Order of group and elements, order of subgroup divides order of finite group.', 1, false),

  // ==========================================
  // 12. ENGINEERING MATHEMATICS (subj-em)
  // ==========================================
  makeTopic('em-1', 'subj-em', null, 'Linear Algebra: Matrices & Systems', 'Matrix operations, Determinants, Rank of a matrix, Systems of Linear Equations (AX=B consistency, unique/infinite/no solution).', 1, true),
  makeTopic('em-1-1', 'subj-em', 'em-1', 'Matrix Rank & Systems of Linear Equations AX = B', 'Augmented matrix [A|B], consistency condition rank(A) = rank(A|B), unique vs infinite solutions.', 1, true),

  makeTopic('em-2', 'subj-em', null, 'Eigenvalues, Eigenvectors & Cayley-Hamilton', 'Characteristic equation |A - lambda*I| = 0, properties of eigenvalues (trace=sum, det=product), Diagonalization, and Cayley-Hamilton Theorem.', 2, true),
  makeTopic('em-2-1', 'subj-em', 'em-2', 'Eigenvalue Properties & Spectral Theorems', 'Symmetric matrix real eigenvalues, orthogonal eigenvectors, trace and determinant shortcuts.', 1, true),
  makeTopic('em-2-2', 'subj-em', 'em-2', 'Cayley-Hamilton Theorem & Matrix Inverses', 'Matrix satisfies its own characteristic polynomial A^n + ... = 0, calculating high matrix powers.', 2, true),

  makeTopic('em-3', 'subj-em', null, 'Calculus: Limits, Continuity & Extrema', 'Limits (L\'Hopital rule), Continuity, Differentiability, Mean Value Theorems, Taylor/Maclaurin series, and Maxima/Minima of single/multi variables.', 3, false),
  makeTopic('em-3-1', 'subj-em', 'em-3', 'Limits & L\'Hopital Rule', 'Indeterminate forms 0/0 and inf/inf, standard exponential limits (1 + a/x)^x -> e^a.', 1, false),
  makeTopic('em-3-2', 'subj-em', 'em-3', 'Maxima, Minima & Saddle Points', 'First and second derivative tests, Hessian matrix discriminant for multivariable extrema.', 2, true),

  makeTopic('em-4', 'subj-em', null, 'Probability & Distributions', 'Sample space, Conditional Probability, Bayes\' Theorem, Random Variables, Expectation, Variance, Uniform, Normal, Poisson, Exponential distributions.', 4, true),
  makeTopic('em-4-1', 'subj-em', 'em-4', 'Conditional Probability & Bayes\' Theorem', 'P(A|B) = P(B|A)*P(A) / P(B), total probability theorem application.', 1, true),
  makeTopic('em-4-2', 'subj-em', 'em-4', 'Discrete Distributions: Binomial & Poisson', 'Binomial P(X=k)=C(n,k)p^k q^(n-k), Poisson P(X=k)=e^-lambda * lambda^k / k! with mean=variance=lambda.', 2, true),
  makeTopic('em-4-3', 'subj-em', 'em-4', 'Continuous Distributions: Uniform, Normal & Exponential', 'Probability density functions, memoryless property of exponential distribution P(X > s+t | X > s) = P(X > t).', 3, true),

  // ==========================================
  // 13. GENERAL APTITUDE (subj-ga)
  // ==========================================
  makeTopic('ga-1', 'subj-ga', null, 'Quantitative Aptitude', 'Percentages, Profit & Loss, Ratio & Proportion, Work & Time, Speed Time Distance, Number Systems, and Elementary Statistics.', 1, true),
  makeTopic('ga-1-1', 'subj-ga', 'ga-1', 'Work & Time, Pipes & Cisterns', 'Efficiency method, combined work rate 1/T = 1/A + 1/B.', 1, true),
  makeTopic('ga-1-2', 'subj-ga', 'ga-1', 'Speed, Time & Distance, Relative Speed', 'Relative speed for trains (same vs opposite direction), average speed formula.', 2, true),

  makeTopic('ga-2', 'subj-ga', null, 'Analytical & Spatial Aptitude', 'Logical deductions, Syllogisms, Seating arrangements, Blood relations, Paper folding, Mirror reflection, and 2D/3D rotations.', 2, true),
  makeTopic('ga-2-1', 'subj-ga', 'ga-2', 'Syllogisms & Logical Deductions', 'Venn diagram representations of "All", "Some", "No" propositions.', 1, true),
  makeTopic('ga-2-2', 'subj-ga', 'ga-2', 'Spatial Aptitude: Paper Folding & 3D Assembly', 'Mirror reflections, surface unfolding of cubes, pattern completion.', 2, true),

  makeTopic('ga-3', 'subj-ga', null, 'Verbal Aptitude', 'English grammar (tenses, subject-verb agreement, prepositions), vocabulary in context, reading comprehension, and narrative sequencing.', 3, false),
  makeTopic('ga-3-1', 'subj-ga', 'ga-3', 'English Grammar & Sentence Correction', 'Subject-verb agreement, conditional clauses, dangling modifiers.', 1, false),
  makeTopic('ga-3-2', 'subj-ga', 'ga-3', 'Reading Comprehension & Critical Reasoning', 'Identifying author premise, strengthening/weakening arguments, inferences.', 2, false),
];

export const INITIAL_SCHEDULES: Schedule[] = [
  {
    id: 'sched-today',
    Schedule_Date: new Date().toISOString().split('T')[0],
    Schedule_Hours: 6,
    Schedule_Subjects: ['subj-cn', 'subj-os', 'subj-algo'],
    Schedule_Tag_Filters: ['Star'],
    Subject_Allocations: {
      'subj-cn': 120,
      'subj-os': 120,
      'subj-algo': 120,
    },
    Allocated_Topics: [
      {
        topic_id: 'cn-1',
        subject_id: 'subj-cn',
        topic_name: 'IPv4 Addressing & Subnetting',
        subject_name: 'Computer Networks',
        allocated_minutes: 120,
        completed: false,
      },
      {
        topic_id: 'os-3',
        subject_id: 'subj-os',
        topic_name: 'Process Synchronization',
        subject_name: 'Operating Systems',
        allocated_minutes: 120,
        completed: false,
      },
      {
        topic_id: 'alg-4',
        subject_id: 'subj-algo',
        topic_name: 'Dynamic Programming',
        subject_name: 'Algorithms',
        allocated_minutes: 120,
        completed: false,
      },
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];
