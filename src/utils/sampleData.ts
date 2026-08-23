import { Subject } from '../types/subject';
import { Topic } from '../types/topic';
import { Schedule } from '../types/schedule';

export const INITIAL_SUBJECTS: Subject[] = [
  {
    id: 'subj-cn',
    Subject_Name: 'Computer Networks',
    Subject_Importance: 'Important',
    Subject_Description: 'OSI/TCP-IP models, IPv4/IPv6 addressing, subnetting, TCP flow/congestion control, routing algorithms, MAC protocols, and security.',
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
    Subject_Importance: 'High Scoring',
    Subject_Description: 'Linear algebra matrices, rank, eigenvalues, calculus limits, maxima/minima, Bayes theorem, and probability distributions.',
    Subject_Color: '#0ea5e9', // Sky
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'subj-ga',
    Subject_Name: 'General Aptitude',
    Subject_Importance: 'High Scoring',
    Subject_Description: 'Quantitative arithmetic, time & work, speed-distance-time, data interpretation, logical reasoning, syllogisms, and verbal English.',
    Subject_Color: '#eab308', // Yellow
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Helper to create fresh clean topic objects (All To-Do, 0 hours, clean tags, keeping only heavy-hitter Star)
function makeTopic(
  id: string,
  Subject_Id: string,
  Parent_Id: string | null,
  Topic_Name: string,
  Topic_Description: string,
  Topic_Order: number,
  isStar: boolean = false
): Topic {
  return {
    id,
    Subject_Id,
    Parent_Id,
    Topic_Name,
    Topic_Description,
    Topic_Status: 'To Do',
    Topic_Difficulty: isStar ? 'Important' : 'Normal',
    Topic_Tags: {
      Done: false,
      Require_Practice: false,
      Confidence: 'None',
      Skip: false,
      Star: isStar,
      Redo: false,
      Lecture_Needed: 0,
      Deadline: null,
      Recall_Activity: false,
      Practice_DPP: false,
    },
    Topic_Study_Hours: 0,
    Topic_Sessions: [],
    Topic_Blocks: [],
    Topic_Order,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

export const INITIAL_TOPICS: Topic[] = [
  // =========================================================================
  // 1. COMPUTER NETWORKS (CN)
  // =========================================================================
  makeTopic('cn-01', 'subj-cn', null, 'Introduction to Computer Networks', 'OSI 7-layer & TCP/IP 4-layer architectural models, packet vs circuit switching principles.', 1, false),
  makeTopic('cn-01-1', 'subj-cn', 'cn-01', 'OSI vs TCP/IP Architecture', 'Encapsulation/decapsulation, protocol data units (PDU) per layer, and service primitives.', 1, false),
  makeTopic('cn-01-2', 'subj-cn', 'cn-01', 'Packet Switching vs Circuit Switching', 'Store-and-forward latency, statistical multiplexing gain, and virtual circuit vs datagram networks.', 2, false),

  makeTopic('cn-02', 'subj-cn', null, 'IPV4 Addressing', 'Classful vs Classless (CIDR) notation, subnetting arithmetic, VLSM allocation, and supernetting route aggregation.', 2, true),
  makeTopic('cn-02-1', 'subj-cn', 'cn-02', 'Classful Addressing & Net ID / Host ID', 'Class A-E boundary bit masks, special IP ranges (127.0.0.1, RFC 1918 private subnets), and broadcast formulas.', 1, false),
  makeTopic('cn-02-2', 'subj-cn', 'cn-02', 'CIDR & Classless Subnetting', 'Prefix mask /n calculation, determining network ID, first/last usable host addresses, and direct broadcast addresses.', 2, true),
  makeTopic('cn-02-3', 'subj-cn', 'cn-02', 'VLSM & Variable Length Subnet Masking', 'Hierarchical block allocation satisfying heterogeneous host demand powers of 2 without wasted address space.', 3, true),
  makeTopic('cn-02-4', 'subj-cn', 'cn-02', 'Supernetting & Route Aggregation', 'Combining contiguous address blocks with matching prefix bits to reduce routing table entry counts.', 4, true),

  makeTopic('cn-03', 'subj-cn', null, 'Error Control & Flow Control', 'Sliding window protocols: Stop-and-Wait, Go-Back-N, Selective Repeat efficiency calculations and CRC error detection.', 3, true),
  makeTopic('cn-03-1', 'subj-cn', 'cn-03', 'Stop & Wait Protocol & Efficiency', 'Efficiency eta = 1 / (1 + 2a) where a = Tp / Tt; bandwidth-delay product and optimal packet size.', 1, true),
  makeTopic('cn-03-2', 'subj-cn', 'cn-03', 'Go-Back-N (GBN) Protocol', 'Sender window Ws = 2^k - 1, receiver Wr = 1, cumulative ACKs, retransmission timeout, and efficiency eta = Ws / (1 + 2a).', 2, true),
  makeTopic('cn-03-3', 'subj-cn', 'cn-03', 'Selective Repeat (SR) Protocol', 'Sender & receiver window sizes Ws = Wr = 2^(k-1), independent ACKs, out-of-order buffer management.', 3, true),
  makeTopic('cn-03-4', 'subj-cn', 'cn-03', 'CRC & Polynomial Division', 'Cyclic redundancy check generator polynomial modulo-2 arithmetic, burst error detection capabilities.', 4, true),

  makeTopic('cn-04', 'subj-cn', null, 'IPV4 Header & Fragmentation', 'IPv4 datagram format fields: IHL, Total Length, TTL, Identification, Flags (DF, MF), and 8-byte Fragment Offset calculations.', 4, true),
  makeTopic('cn-04-1', 'subj-cn', 'cn-04', 'IPv4 Header Fields & Checksum', 'Header length 4-byte scaling, TTL decrement loop prevention, protocol field multiplexing.', 1, false),
  makeTopic('cn-04-2', 'subj-cn', 'cn-04', 'Fragmentation, MTU & Offset Calculation', 'MTU boundary splitting, payload division by 8 for Offset, DF bit dropped packet error handling.', 2, true),

  makeTopic('cn-05', 'subj-cn', null, 'Medium Access Control', 'Random access protocols: Pure & Slotted ALOHA throughput formulas, CSMA/CD minimum frame length L >= 2*Tp*B.', 5, true),
  makeTopic('cn-05-1', 'subj-cn', 'cn-05', 'Pure & Slotted ALOHA', 'Vulnerable time 2*Tt (Pure, G*e^-2G max 18.4%) vs Tt (Slotted, G*e^-G max 36.8%) throughput efficiency.', 1, false),
  makeTopic('cn-05-2', 'subj-cn', 'cn-05', 'CSMA/CD & Exponential Backoff', 'Collision detection condition Frame Size >= 2 * Propagation Delay * Bandwidth, truncated binary backoff 2^k - 1.', 2, true),

  makeTopic('cn-06', 'subj-cn', null, 'Routing Protocols & Switching', 'Distance Vector (Bellman-Ford, Count to Infinity), Link State (Dijkstra, OSPF, Link State Packets), and Bridges/Switches.', 6, true),
  makeTopic('cn-06-1', 'subj-cn', 'cn-06', 'Distance Vector & Count to Infinity', 'Routing table vector exchange, split horizon and poison reverse mitigation techniques.', 1, true),
  makeTopic('cn-06-2', 'subj-cn', 'cn-06', 'Link State Routing (Dijkstra / OSPF)', 'Global network topology flooding, shortest path tree generation, and event-driven updates.', 2, true),

  makeTopic('cn-07', 'subj-cn', null, 'TCP & UDP Transport Protocols', '3-way handshake connection lifecycle, TCP flags, header structure, and TCP Congestion Control AIMD states.', 7, true),
  makeTopic('cn-07-1', 'subj-cn', 'cn-07', 'TCP 3-Way Handshake & Connection Termination', 'SYN, SYN-ACK, ACK sequence number synchronization and FIN/TIME-WAIT 2MSL teardown.', 1, false),
  makeTopic('cn-07-2', 'subj-cn', 'cn-07', 'TCP Congestion Control (Slow Start & AIMD)', 'Exponential Slow Start, Linear Congestion Avoidance, Fast Retransmit (3 dup ACKs), and Fast Recovery.', 2, true),

  makeTopic('cn-08', 'subj-cn', null, 'Application Layer & Network Security', 'DNS iterative/recursive resolution, HTTP persistent/pipelined, SMTP, and RSA/AES encryption principles.', 8, false),
  makeTopic('cn-08-1', 'subj-cn', 'cn-08', 'DNS, HTTP, SMTP & FTP', 'Port mappings (53, 80, 443, 25, 20/21), iterative vs recursive name resolution, and HTTP status codes.', 1, false),
  makeTopic('cn-08-2', 'subj-cn', 'cn-08', 'Network Security (RSA & Public Key Cryptography)', 'Euler totient phi(n) = (p-1)(q-1), modular inverse d = e^-1 mod phi(n), and digital signatures.', 2, true),

  // =========================================================================
  // 2. OPERATING SYSTEMS (OS)
  // =========================================================================
  makeTopic('os-01', 'subj-os', null, 'Introduction & Process Concept', 'Dual-mode CPU execution, system calls, PCB structure, process state models, and user vs kernel level threads.', 1, false),
  makeTopic('os-01-1', 'subj-os', 'os-01', 'System Calls & OS Dual-Mode', 'Trap instructions, kernel mode switch, context switching overhead, and fork() process creation trees.', 1, false),
  makeTopic('os-01-2', 'subj-os', 'os-01', 'Threads & Multithreading Models', 'Thread shared resources (code, data, files) vs private stack/registers, Many-to-One and Many-to-Many models.', 2, false),

  makeTopic('os-02', 'subj-os', null, 'CPU Scheduling', 'Preemptive vs non-preemptive algorithms: FCFS, SJF, SRTF, Round Robin with quantum, and priority scheduling metrics.', 2, true),
  makeTopic('os-02-1', 'subj-os', 'os-02', 'FCFS & Convoy Effect', 'First-Come First-Served FIFO queue ordering, convoy effect leading to high average waiting times.', 1, false),
  makeTopic('os-02-2', 'subj-os', 'os-02', 'SJF & Shortest Remaining Time First (SRTF)', 'Provably optimal average waiting time; preemptive SRTF Gantt chart scheduling calculations.', 2, true),
  makeTopic('os-02-3', 'subj-os', 'os-02', 'Round Robin Scheduling & Time Quantum', 'Preemptive time-sliced circular scheduling; effect of quantum q on context switches and response time.', 3, true),

  makeTopic('os-03', 'subj-os', null, 'Process Synchronization', 'Critical section conditions (Mutual Exclusion, Progress, Bounded Wait), Peterson algorithm, Semaphores, and classic IPC problems.', 3, true),
  makeTopic('os-03-1', 'subj-os', 'os-03', 'Critical Section Problem & Peterson Solution', 'Entry, Critical, and Exit sections; 2-process software synchronization using flag array and turn variable.', 1, true),
  makeTopic('os-03-2', 'subj-os', 'os-03', 'Counting & Binary Semaphores', 'Atomic Wait(P) and Signal(V) primitive operations, tracking positive resource counts and negative waiting queues.', 2, true),
  makeTopic('os-03-3', 'subj-os', 'os-03', 'Classic Synchronization Problems', 'Producer-Consumer bounded buffer, Readers-Writers priority starvation, and Dining Philosophers deadlock.', 3, true),

  makeTopic('os-04', 'subj-os', null, 'DeadLock', 'Necessary conditions (Coffman), Resource Allocation Graph (RAG), Deadlock Prevention, and Banker Algorithm safety checks.', 4, true),
  makeTopic('os-04-1', 'subj-os', 'os-04', 'Deadlock Conditions & Prevention', 'Mutual exclusion, Hold and Wait, No preemption, and Circular wait negation strategies.', 1, false),
  makeTopic('os-04-2', 'subj-os', 'os-04', 'Banker Algorithm (Safety & Resource Request)', 'Available, Max, Allocation, Need matrices calculation; finding safe sequences to avoid deadlocks.', 2, true),
  makeTopic('os-04-3', 'subj-os', 'os-04', 'Resource Allocation Graph & Detection', 'Cycle detection in single-unit vs multi-unit resource allocation graphs.', 3, false),

  makeTopic('os-05', 'subj-os', null, 'Memory Management', 'Contiguous allocation, Single & Multi-level Paging, TLB effective access time (EAT), and Inverted page tables.', 5, true),
  makeTopic('os-05-1', 'subj-os', 'os-05', 'Paging & Address Translation', 'Logical address (Page Number p, Offset d) to Physical address (Frame Number f, Offset d) mapping formulas.', 1, true),
  makeTopic('os-05-2', 'subj-os', 'os-05', 'Multi-Level Paging & Page Table Size', 'Hierarchical page table splitting, calculating page table memory overhead across nested levels.', 2, true),
  makeTopic('os-05-3', 'subj-os', 'os-05', 'TLB & Effective Memory Access Time (EMAT)', 'EMAT = h*(t_TLB + t_M) + (1-h)*(t_TLB + (k+1)*t_M) formula for k-level paging systems.', 3, true),

  makeTopic('os-06', 'subj-os', null, 'Virtual Memory', 'Demand paging, page fault handling routine, FIFO and Belady Anomaly, Optimal replacement, and LRU page algorithms.', 6, true),
  makeTopic('os-06-1', 'subj-os', 'os-06', 'Page Replacement Algorithms (FIFO, LRU, OPT)', 'FIFO queue ordering, Belady anomaly demonstration, Optimal lookahead replacement, and LRU stack tracking.', 1, true),
  makeTopic('os-06-2', 'subj-os', 'os-06', 'Thrashing & Working Set Model', 'Page fault frequency spikes when process locality set exceeds available physical frame allocation.', 2, false),

  makeTopic('os-07', 'subj-os', null, 'File System & Disk Scheduling', 'Unix inode multi-level block calculation, and disk head scheduling algorithms (SSTF, SCAN, C-SCAN, LOOK).', 7, false),
  makeTopic('os-07-1', 'subj-os', 'os-07', 'Unix Inode File Allocation Calculation', 'Direct, Single Indirect, Double Indirect, Triple Indirect block pointers capacity summation formulas.', 1, true),
  makeTopic('os-07-2', 'subj-os', 'os-07', 'Disk Scheduling (SSTF, SCAN, C-SCAN, LOOK)', 'Calculating total head movement / seek distance across cylinder requests for elevator and circular scan.', 2, false),

  // =========================================================================
  // 3. C-PROGRAMMING
  // =========================================================================
  makeTopic('prog-01', 'subj-prog', null, 'Data Types & Operators', 'Primitive data types, size & ranges, bitwise operations (&, |, ^, ~, <<, >>), and operator precedence & associativity.', 1, true),
  makeTopic('prog-01-1', 'subj-prog', 'prog-01', 'Operator Precedence & Associativity', 'Unary postfix > prefix > multiplicative > additive > shift > relational > bitwise > logical > ternary > assignment.', 1, true),
  makeTopic('prog-01-2', 'subj-prog', 'prog-01', 'Bitwise Operators & Bit Manipulation', 'Checking, setting, clearing bits using bitmasks, XOR swap, and power of 2 check (n & (n-1)) == 0.', 2, true),

  makeTopic('prog-02', 'subj-prog', null, 'Functions & Storage Classes', 'Pass-by-value vs pass-by-reference semantics, recursion tree call stack tracing, auto, static, extern, and register scopes.', 2, true),
  makeTopic('prog-02-1', 'subj-prog', 'prog-02', 'Recursion & Call Stack Tracing', 'Activation records tracking base cases, head vs tail recursion, and recursive return value unrolling.', 1, true),
  makeTopic('prog-02-2', 'subj-prog', 'prog-02', 'Storage Classes (static, extern, auto, register)', 'Static variable persistence between function calls, global linkage, and register hardware allocation.', 2, true),

  makeTopic('prog-03', 'subj-prog', null, 'Arrays & Pointers', 'Pointer arithmetic, pointer dereferencing, multi-dimensional array memory mapping, and function pointers.', 3, true),
  makeTopic('prog-03-1', 'subj-prog', 'prog-03', 'Pointer Arithmetic & Dereferencing', 'Array decay into pointer to first element, *(arr + i) == arr[i], and pointer scale factor sizeof(*ptr).', 1, true),
  makeTopic('prog-03-2', 'subj-prog', 'prog-03', '2D Arrays & Row-Major vs Column-Major Address', 'Address of A[i][j] = Base + ((i - L1)*N + (j - L2)) * Element_Size row-major formula calculations.', 2, true),
  makeTopic('prog-03-3', 'subj-prog', 'prog-03', 'Dynamic Memory Allocation (malloc, calloc, free)', 'Heap memory allocation, memory leaks prevention, dangling pointer risks, and pointer realloc resizing.', 3, false),

  makeTopic('prog-04', 'subj-prog', null, 'Structures & Unions', 'Memory alignment padding, sizeof structures, self-referential structs for linked lists, and union memory overlap.', 4, false),
  makeTopic('prog-04-1', 'subj-prog', 'prog-04', 'Structure Padding & Alignment Rules', 'Calculating padding bytes for natural alignment on 32-bit and 64-bit architectures.', 1, true),
  makeTopic('prog-04-2', 'subj-prog', 'prog-04', 'Unions vs Structures', 'Shared memory allocation equal to largest member, and tagged union usage.', 2, false),

  // =========================================================================
  // 4. DATA STRUCTURES
  // =========================================================================
  makeTopic('ds-01', 'subj-ds', null, 'Linked List', 'Singly, doubly, and circular linked list operations: node insertion, deletion, list reversal, and Floyd cycle detection.', 1, true),
  makeTopic('ds-01-1', 'subj-ds', 'ds-01', 'Singly & Doubly Linked List Operations', 'O(1) head insertion/deletion, O(n) middle operations, and pointer update ordering.', 1, false),
  makeTopic('ds-01-2', 'subj-ds', 'ds-01', 'Reversing a Linked List & Cycle Detection', 'Iterative 3-pointer reversal algorithm and Floyd Tortoise & Hare fast/slow pointer cycle detection.', 2, true),

  makeTopic('ds-02', 'subj-ds', null, 'Stack & Queues', 'LIFO/FIFO principles, Infix to Postfix conversion, Postfix evaluation, circular queue boundary formulas, and Min-Stack.', 2, true),
  makeTopic('ds-02-1', 'subj-ds', 'ds-02', 'Infix to Postfix & Expression Evaluation', 'Operator precedence stack parsing, associativity rules, and operand post-fix evaluation.', 1, true),
  makeTopic('ds-02-2', 'subj-ds', 'ds-02', 'Circular Queue & Double-Ended Queue (Deque)', 'Modulo arithmetic (rear + 1) % size == front full queue condition, and deque implementations.', 2, true),

  makeTopic('ds-03', 'subj-ds', null, 'Trees & Binary Search Trees', 'Tree properties (height, node counts, leaf relations), In/Pre/Post-order traversals, BST operations, and AVL tree rotations.', 3, true),
  makeTopic('ds-03-1', 'subj-ds', 'ds-03', 'Binary Tree Properties & Traversals', 'Leaf nodes L = I_2 + 1 relation, and unique tree reconstruction from Inorder + Preorder/Postorder.', 1, true),
  makeTopic('ds-03-2', 'subj-ds', 'ds-03', 'Binary Search Tree (BST) Operations', 'BST invariant, search, insertion, deletion (0, 1, or 2 children with inorder successor), and counting BSTs.', 2, true),
  makeTopic('ds-03-3', 'subj-ds', 'ds-03', 'AVL Tree Balancing & Rotations', 'Balance factor {-1, 0, 1}, single LL/RR and double LR/RL rotations, and min nodes for height h formula N(h).', 3, true),

  makeTopic('ds-04', 'subj-ds', null, 'Binary Heaps & Priority Queues', 'Min-Heap and Max-Heap complete binary tree array representation, O(n) bottom-up heapify, insert, and extract.', 4, true),
  makeTopic('ds-04-1', 'subj-ds', 'ds-04', 'Heapify Operation & Build Heap O(n)', 'Sum of geometric series proof for O(n) build-heap vs O(n log n) repeated insertions.', 1, true),
  makeTopic('ds-04-2', 'subj-ds', 'ds-04', 'Heap Insert, Delete & HeapSort', 'Percolate up / down operations in O(log n), and in-place O(n log n) HeapSort algorithm.', 2, true),

  makeTopic('ds-05', 'subj-ds', null, 'Hashing', 'Hash functions, collision resolution: Separate Chaining, Open Addressing (Linear, Quadratic, Double Hashing), and Load Factor.', 5, true),
  makeTopic('ds-05-1', 'subj-ds', 'ds-05', 'Linear & Quadratic Probing', 'Primary clustering in linear probing, probe sequence formulas h(k, i) = (h(k) + c1*i + c2*i^2) mod m.', 1, true),
  makeTopic('ds-05-2', 'subj-ds', 'ds-05', 'Separate Chaining & Load Factor', 'Expected search time O(1 + alpha) where load factor alpha = n/m, and dynamic table rehashing.', 2, false),

  // =========================================================================
  // 5. DIGITAL LOGIC
  // =========================================================================
  makeTopic('dl-01', 'subj-dl', null, 'Logic Gates & Minimization', 'Boolean theorems, De Morgan laws, 2-5 variable K-Maps, Prime Implicants (PI), Essential Prime Implicants (EPI).', 1, true),
  makeTopic('dl-01-1', 'subj-dl', 'dl-01', 'K-Map Minimization (2, 3, 4 Variables)', 'Gray code adjacency grouping in powers of 2, identifying EPIs and minimal SOP / POS expressions.', 1, true),
  makeTopic('dl-01-2', 'subj-dl', 'dl-01', 'Universal Gates (NAND / NOR Implementation)', 'Minimum number of 2-input NAND and NOR gates required to implement NOT, AND, OR, XOR, XNOR.', 2, true),

  makeTopic('dl-02', 'subj-dl', null, 'Combinational Circuit', 'Half/Full Adders, Ripple Carry Adder delay, Carry Lookahead Adder, Multiplexers (MUX as universal logic), Decoders, Encoders.', 2, true),
  makeTopic('dl-02-1', 'subj-dl', 'dl-02', 'Adders & Carry Lookahead Adders', 'Full adder logic sum = A ^ B ^ Cin, carry propagation and generation terms in CLA for O(1) delay.', 1, true),
  makeTopic('dl-02-2', 'subj-dl', 'dl-02', 'Multiplexers (MUX) & Demultiplexers', 'Implementing arbitrary n-variable boolean functions using 2^(n-1) to 1 MUX and cascading MUX trees.', 2, true),

  makeTopic('dl-03', 'subj-dl', null, 'Sequential Circuit', 'Latches, SR/JK/D/T Flip-Flops, Master-Slave JK, characteristic equations, and Synchronous / Asynchronous Mod-N Counters.', 3, true),
  makeTopic('dl-03-1', 'subj-dl', 'dl-03', 'Flip-Flops & Characteristic Equations', 'SR: Q+ = S + R*Q, JK: Q+ = J*Q + K*Q, D: Q+ = D, T: Q+ = T ^ Q; race-around condition solutions.', 1, true),
  makeTopic('dl-03-2', 'subj-dl', 'dl-03', 'Synchronous & Asynchronous Mod-N Counters', 'State transition tables, excitation tables, counter design, and lock-out state recovery.', 2, true),

  makeTopic('dl-04', 'subj-dl', null, 'Number System', 'Radix conversions, 1s & 2s complement signed arithmetic, range of numbers, and signed arithmetic overflow rules.', 4, true),
  makeTopic('dl-04-1', 'subj-dl', 'dl-04', '2s Complement Representation & Arithmetic', 'Range of n-bit 2s complement integers [-2^(n-1), 2^(n-1) - 1], sign extension, and arithmetic negation.', 1, true),
  makeTopic('dl-04-2', 'subj-dl', 'dl-04', 'Signed Overflow Detection', 'Overflow condition V = Cin ^ Cout on the sign bit, adding two positive or two negative operands.', 2, true),

  // =========================================================================
  // 6. THEORY OF COMPUTATION (TOC)
  // =========================================================================
  makeTopic('toc-01', 'subj-toc', null, 'Finite Automata', 'Deterministic (DFA), Non-deterministic (NFA), epsilon-NFA, subset construction, DFA minimization, and state count calculations.', 1, true),
  makeTopic('toc-01-1', 'subj-toc', 'toc-01', 'DFA Construction & State Count', 'Constructing minimal DFA for strings starting/ending with patterns, modulo string length counters.', 1, true),
  makeTopic('toc-01-2', 'subj-toc', 'toc-01', 'NFA to DFA Conversion & Minimization', 'Subset construction powerset 2^Q bound, and Myhill-Nerode / Table Filling equivalence partitioning.', 2, true),

  makeTopic('toc-02', 'subj-toc', null, 'Regular Expressions & Languages', 'Regular expressions algebraic identities (Arden Theorem), Pumping Lemma for regularity, and Closure properties.', 2, true),
  makeTopic('toc-02-1', 'subj-toc', 'toc-02', 'Closure Properties of Regular Languages', 'Regular languages closed under union, intersection, complement, concatenation, Kleene star, reversal, hom.', 1, true),
  makeTopic('toc-02-2', 'subj-toc', 'toc-02', 'Pumping Lemma for Regular Languages', 'Proving non-regularity of languages L = {a^n b^n} using string decomposition s = xyz with |xy| <= p.', 2, false),

  makeTopic('toc-03', 'subj-toc', null, 'Push Down Automata & CFG', 'Context-free grammars, derivations, ambiguity in CFGs, DPDA vs NPDA, CFL vs DCFL, and Chomsky Normal Form (CNF).', 3, true),
  makeTopic('toc-03-1', 'subj-toc', 'toc-03', 'Context-Free Grammars & Ambiguity', 'Leftmost and rightmost derivations, parse tree ambiguity, and inherently ambiguous languages.', 1, true),
  makeTopic('toc-03-2', 'subj-toc', 'toc-03', 'Pushdown Automata (DPDA vs NPDA)', 'Stack operations, acceptance by final state vs empty stack, and DCFL complementation closure.', 2, true),

  makeTopic('toc-04', 'subj-toc', null, 'Turing Machine & Chomsky Hierarchy', 'Standard TM model, Turing-recognizable (RE) vs Turing-decidable (Recursive) languages, and Chomsky 4-tier hierarchy.', 4, true),
  makeTopic('toc-04-1', 'subj-toc', 'toc-04', 'Turing Machines & Recursive vs RE Languages', 'Halting vs looping behavior; recursive languages closed under complement, RE languages not closed under complement.', 1, true),
  makeTopic('toc-04-2', 'subj-toc', 'toc-04', 'Chomsky Hierarchy of Languages', 'Type 3 (Regular) subset Type 2 (CFL) subset Type 1 (CSL) subset Type 0 (Unrestricted / RE).', 2, true),

  makeTopic('toc-05', 'subj-toc', null, 'Decidability & Undecidability', 'Halting problem of Turing machines, Rice Theorem (semantic properties), Post Correspondence Problem (PCP), and Decidability Matrix.', 5, true),
  makeTopic('toc-05-1', 'subj-toc', 'toc-05', 'Halting Problem & Reductions', 'Turing machine self-reference paradox proof and reducing known undecidable problems to target problems.', 1, true),
  makeTopic('toc-05-2', 'subj-toc', 'toc-05', 'Decidability Matrix across Language Classes', 'Emptiness, Membership, Finiteness, Equivalence, and Disjointness decidability table per grammar class.', 2, true),

  // =========================================================================
  // 7. COMPILER DESIGN
  // =========================================================================
  makeTopic('cd-01', 'subj-cd', null, 'Lexical Analysis', 'Token, pattern, lexeme concepts, transition diagrams, handling whitespace/comments, and input buffering schemes.', 1, false),
  makeTopic('cd-01-1', 'subj-cd', 'cd-01', 'Token, Lexeme & Regular Definitions', 'Token classification, recognizing identifiers vs keywords, and string matching using finite state automatons.', 1, false),

  makeTopic('cd-02', 'subj-cd', null, 'Syntax Analysis & Parsing', 'Top-Down parsing: FIRST & FOLLOW sets, LL(1) parse table, Left Recursion/Factoring; Bottom-Up: LR(0), SLR(1), CLR(1), LALR(1).', 2, true),
  makeTopic('cd-02-1', 'subj-cd', 'cd-02', 'FIRST & FOLLOW Sets Calculation', 'Rules for calculating FIRST(alpha) and FOLLOW(A) with epsilon propagation across productions.', 1, true),
  makeTopic('cd-02-2', 'subj-cd', 'cd-02', 'LL(1) Parsing Table & Conflicts', 'Constructing LL(1) parsing matrix M[A, a], identifying First/Follow conflicts, and grammar transformation.', 2, true),
  makeTopic('cd-02-3', 'subj-cd', 'cd-02', 'LR Parsers (LR(0), SLR(1), LALR(1), CLR(1))', 'Canonical LR item sets, Shift-Reduce and Reduce-Reduce conflicts, and parser power hierarchy: LR(0) < SLR(1) < LALR(1) < CLR(1).', 3, true),

  makeTopic('cd-03', 'subj-cd', null, 'Syntax Directed Translation', 'Syntax-Directed Definitions (SDD), Synthesized vs Inherited attributes, S-Attributed vs L-Attributed SDDs, and Evaluation order.', 3, true),
  makeTopic('cd-03-1', 'subj-cd', 'cd-03', 'Synthesized vs Inherited Attributes', 'Synthesized computed from children (bottom-up), Inherited computed from parent/left-siblings (top-down).', 1, true),
  makeTopic('cd-03-2', 'subj-cd', 'cd-03', 'S-Attributed vs L-Attributed SDDs', 'S-Attributed uses only synthesized (evaluated in LR parse); L-Attributed allows synthesized + left-inherited attributes.', 2, true),

  makeTopic('cd-04', 'subj-cd', null, 'Intermediate Code & Code Optimization', 'Three-Address Code (TAC), Quadruples/Triples, Basic Blocks, Control Flow Graphs, and Local/Loop Optimizations.', 4, true),
  makeTopic('cd-04-1', 'subj-cd', 'cd-04', 'Three Address Code & Basic Blocks', 'Determining Basic Block leaders (first instruction, target of jumps, instruction after jump), and constructing CFG.', 1, true),
  makeTopic('cd-04-2', 'subj-cd', 'cd-04', 'Code Optimization Techniques', 'Common subexpression elimination, constant folding/propagation, dead code elimination, and loop invariant code motion.', 2, true),

  // =========================================================================
  // 8. ALGORITHMS
  // =========================================================================
  makeTopic('algo-01', 'subj-algo', null, 'Analysis Of Algorithms', 'Asymptotic bounds (O, Omega, Theta, o, omega), order of growth comparisons, Master Theorem, and Recurrence relations.', 1, true),
  makeTopic('algo-01-1', 'subj-algo', 'algo-01', 'Asymptotic Notations & Function Ordering', 'Formal mathematical definitions of Big-O, Omega, Theta; ranking polynomial, logarithmic, exponential functions.', 1, true),
  makeTopic('algo-01-2', 'subj-algo', 'algo-01', 'Master Theorem for Recurrences', 'T(n) = a*T(n/b) + f(n) cases comparing n^(log_b a) with f(n), and extended logarithmic cases.', 2, true),

  makeTopic('algo-02', 'subj-algo', null, 'Design Strategies & Divide and Conquer', 'Merge Sort inversion count, Quick Sort partition best/worst/average analysis, and Binary Search analysis.', 2, true),
  makeTopic('algo-02-1', 'subj-algo', 'algo-02', 'Merge Sort & Inversion Counting', 'Divide and conquer recurrence T(n) = 2T(n/2) + O(n) -> O(n log n), counting inversions during merge phase.', 1, true),
  makeTopic('algo-02-2', 'subj-algo', 'algo-02', 'Quick Sort & Partitioning Analysis', 'Lomuto/Hoare partition mechanisms, O(n log n) average vs O(n^2) worst case on sorted inputs, randomized pivot.', 2, true),

  makeTopic('algo-03', 'subj-algo', null, 'Greedy Method', 'Huffman Coding prefix-free tree bits calculation, Fractional Knapsack, Activity Selection / Interval Scheduling, Job Sequencing.', 3, true),
  makeTopic('algo-03-1', 'subj-algo', 'algo-03', 'Huffman Coding & Optimal Prefix Codes', 'Bottom-up priority queue merge of least frequent characters, calculating total encoded message bits and tree length.', 1, true),
  makeTopic('algo-03-2', 'subj-algo', 'algo-03', 'Activity Selection & Fractional Knapsack', 'Sorting by finish time greedy choice proof, value-per-weight density greedy selection in fractional knapsack.', 2, false),

  makeTopic('algo-04', 'subj-algo', null, 'Dynamic Programming', 'Principle of Optimality, Memoization vs Tabulation, 0/1 Knapsack, LCS, Matrix Chain Multiplication (MCM), and LIS.', 4, true),
  makeTopic('algo-04-1', 'subj-algo', 'algo-04', '0/1 Knapsack Problem', 'DP state transition T[i, w] = max(T[i-1, w], val[i] + T[i-1, w-wt[i]]) in pseudo-polynomial O(n*W) time.', 1, true),
  makeTopic('algo-04-2', 'subj-algo', 'algo-04', 'Longest Common Subsequence (LCS)', 'Recurrence matching characters c[i, j] = c[i-1, j-1] + 1 else max(c[i-1, j], c[i, j-1]) in O(m*n) time.', 2, true),
  makeTopic('algo-04-3', 'subj-algo', 'algo-04', 'Matrix Chain Multiplication (MCM)', 'Minimum scalar multiplications m[i, j] = min_k (m[i, k] + m[k+1, j] + p_{i-1}*p_k*p_j) optimal parenthesization.', 3, true),

  makeTopic('algo-05', 'subj-algo', null, 'Graph Algorithms & Shortest Paths', 'BFS/DFS traversals, Topological sort, Dijkstra single-source shortest path, Bellman-Ford, Prim & Kruskal MST.', 5, true),
  makeTopic('algo-05-1', 'subj-algo', 'algo-05', 'Dijkstra & Bellman-Ford Shortest Paths', 'Dijkstra greedy relaxation with min-heap O((V+E)log V), Bellman-Ford O(V*E) negative weight cycle detection.', 1, true),
  makeTopic('algo-05-2', 'subj-algo', 'algo-05', 'Minimum Spanning Trees (Prim & Kruskal)', 'Prim cut property with min-heap vs Kruskal cycle property with Disjoint Set Union (DSU) in O(E log V).', 2, true),

  makeTopic('algo-06', 'subj-algo', null, 'NP-Completeness & Reductions', 'P, NP, NP-Hard, and NP-Complete complexity classes, polynomial time verifiers, and classic problem reductions (3-SAT, Vertex Cover).', 6, true),
  makeTopic('algo-06-1', 'subj-algo', 'algo-06', 'Complexity Classes (P, NP, NP-Complete, NP-Hard)', 'Deterministic vs non-deterministic polynomial time, Cook-Levin Theorem, and proving NP-Completeness via reduction.', 1, true),

  // =========================================================================
  // 9. DATABASE MANAGEMENT SYSTEM (DBMS)
  // =========================================================================
  makeTopic('dbms-01', 'subj-dbms', null, 'ER-Diagram & Relational Model', 'Entity sets, relationships (1:1, 1:N, M:N), weak entity sets, and minimum tables required when converting ER to Relational schema.', 1, false),
  makeTopic('dbms-01-1', 'subj-dbms', 'dbms-01', 'ER Modeling & Cardinality Constraints', 'Total vs partial participation, identifying relationships for weak entities with composite primary keys.', 1, false),
  makeTopic('dbms-01-2', 'subj-dbms', 'dbms-01', 'Converting ER Diagrams to Relational Tables', 'Minimum table count rules: combining 1:N into one table, M:N requiring separate junction table.', 2, true),

  makeTopic('dbms-02', 'subj-dbms', null, 'Relational Algebra & Tuple Calculus', 'Relational operators: Select (sigma), Project (pi), Cartesian product, Natural join (bowtie), Division (divide), and TRC safe queries.', 2, true),
  makeTopic('dbms-02-1', 'subj-dbms', 'dbms-02', 'Relational Algebra Operations', 'Selection filter, Projection deduplication, theta joins, division operator for all-matching queries.', 1, true),
  makeTopic('dbms-02-2', 'subj-dbms', 'dbms-02', 'Tuple Relational Calculus (TRC)', 'First-order logic formula syntax, existential and universal quantifiers, and domain independence safety.', 2, false),

  makeTopic('dbms-03', 'subj-dbms', null, 'Query Language (SQL)', 'DDL/DML commands, nested subqueries, correlated queries, aggregate functions with GROUP BY and HAVING, and SQL outer joins.', 3, true),
  makeTopic('dbms-03-1', 'subj-dbms', 'dbms-03', 'SQL Joins, Subqueries & Aggregations', 'Inner join, Left/Right/Full outer joins, GROUP BY multi-column grouping, HAVING predicate filtering.', 1, true),
  makeTopic('dbms-03-2', 'subj-dbms', 'dbms-03', 'Correlated Subqueries & EXISTS / NOT EXISTS', 'Row-by-row outer query evaluation, EXISTS truth value testing, and finding missing relationship subsets.', 2, true),

  makeTopic('dbms-04', 'subj-dbms', null, 'FDs and Normalisation', 'Armstrong axioms, attribute closure, candidate key finding, 1NF, 2NF, 3NF, BCNF, lossless decomposition, and dependency preservation.', 4, true),
  makeTopic('dbms-04-1', 'subj-dbms', 'dbms-04', 'Candidate Keys & Minimal Cover Calculation', 'Computing attribute closure X+, finding all prime attributes and candidate keys, canonical cover reduction.', 1, true),
  makeTopic('dbms-04-2', 'subj-dbms', 'dbms-04', 'Normal Forms (2NF, 3NF, BCNF)', '2NF: no partial dependency; 3NF: for X->Y, X is superkey OR Y is prime; BCNF: for X->Y, X must be superkey.', 2, true),
  makeTopic('dbms-04-3', 'subj-dbms', 'dbms-04', 'Lossless Join & Dependency Preservation', 'Decomposition R1, R2 is lossless if (R1 intersect R2) -> R1 OR (R1 intersect R2) -> R2; testing F+ preservation.', 3, true),

  makeTopic('dbms-05', 'subj-dbms', null, 'Transaction and Concurrency Control', 'ACID properties, Conflict Serializability (Precedence Graph cycles), View Serializability, Recoverability, Strict 2PL, and Deadlocks.', 5, true),
  makeTopic('dbms-05-1', 'subj-dbms', 'dbms-05', 'Conflict Serializability & Precedence Graph', 'Conflicting operations (same data item, at least one write); constructing precedence graph to test acyclicity.', 1, true),
  makeTopic('dbms-05-2', 'subj-dbms', 'dbms-05', 'Recoverability, Cascading Aborts & Strict Schedules', 'Recoverable: commit Ti after all Tj it read from; ACA: read committed items only; Strict: write/read committed items only.', 2, true),
  makeTopic('dbms-05-3', 'subj-dbms', 'dbms-05', 'Two-Phase Locking (2PL) & Timestamp Ordering', 'Growing and shrinking lock phases; Strict 2PL prevents cascading aborts; Timestamp Ordering with Thomas Write Rule.', 3, true),

  makeTopic('dbms-06', 'subj-dbms', null, 'File Organisation & Indexing', 'Primary, Secondary, Clustering indexes, dense vs sparse index entries, and B-Trees & B+ Tree order, height, and capacity calculations.', 6, true),
  makeTopic('dbms-06-1', 'subj-dbms', 'dbms-06', 'B-Tree & B+ Tree Node Capacity Calculation', 'Order p calculation from block size B, key size K, and record pointer Rp / block pointer P formulas.', 1, true),
  makeTopic('dbms-06-2', 'subj-dbms', 'dbms-06', 'Index Types (Primary, Secondary, Clustering)', 'Ordered vs unordered files, dense vs sparse index record access bounds, and multi-level index search.', 2, false),

  // =========================================================================
  // 10. COMPUTER ORGANISATION & ARCHITECTURE (COA)
  // =========================================================================
  makeTopic('coa-01', 'subj-coa', null, 'Machine Instruction and Addressing Modes', 'Instruction cycle, opcode expansion techniques, and addressing modes (Immediate, Direct, Indirect, Indexed, Register Indirect, Auto).', 1, true),
  makeTopic('coa-01-1', 'subj-coa', 'coa-01', 'Addressing Modes & Effective Address Calculation', 'Direct EA = A, Indirect EA = (A), Indexed EA = A + R, PC-Relative EA = PC + Offset calculation formulas.', 1, true),
  makeTopic('coa-01-2', 'subj-coa', 'coa-01', 'Instruction Formats & Expanding Opcode', 'Calculating maximum allowed 1-address and 0-address instructions given fixed word length and 2-address counts.', 2, true),

  makeTopic('coa-02', 'subj-coa', null, 'Floating Point Representation', 'IEEE 754 32-bit Single Precision (1 sign, 8 exponent bias 127, 23 mantissa) and 64-bit Double Precision representations.', 2, true),
  makeTopic('coa-02-1', 'subj-coa', 'coa-02', 'IEEE 754 32-bit Single Precision Format', 'Value = (-1)^s * (1.M) * 2^(E - 127), converting decimal floats to hexadecimal bit patterns and vice-versa.', 1, true),
  makeTopic('coa-02-2', 'subj-coa', 'coa-02', 'Special Values (Zero, Infinity, NaN, Denormalized)', 'Exponent E = 0 (denormalized, zero) vs E = 255 (Infinity, NaN) IEEE boundary condition handling.', 2, false),

  makeTopic('coa-03', 'subj-coa', null, 'Instruction And Pipelining', 'Pipeline stages (IF, ID, EX, MEM, WB), Speedup S = (k*n)/(k+n-1), Pipeline Hazards (Structural, Data RAW/WAR/WAW, Control branch delays).', 3, true),
  makeTopic('coa-03-1', 'subj-coa', 'coa-03', 'Pipeline Performance & Speedup Formula', 'Speedup = Non-pipelined time / Pipelined time = (n * k * t) / ((k + n - 1) * t + stall_cycles).', 1, true),
  makeTopic('coa-03-2', 'subj-coa', 'coa-03', 'Pipeline Hazards (RAW, Forwarding & Branch Penalties)', 'Data hazard RAW stall resolution via operand forwarding paths, branch penalty delay slot optimization.', 2, true),

  makeTopic('coa-04', 'subj-coa', null, 'Cache Memory', 'Direct Mapping, Fully Associative, Set-Associative Mapping (Tag, Set, Word Offset bits), Write policies, and AMAT access time calculations.', 4, true),
  makeTopic('coa-04-1', 'subj-coa', 'coa-04', 'Cache Mapping (Direct & Set-Associative)', 'Memory address bit division: Tag, Set Index = log2(sets), Block/Word Offset = log2(bytes_per_block).', 1, true),
  makeTopic('coa-04-2', 'subj-coa', 'coa-04', 'Average Memory Access Time (AMAT)', 'AMAT = Hit_Time + (Miss_Rate * Miss_Penalty); multi-level L1, L2 cache hierarchy calculations.', 2, true),

  makeTopic('coa-05', 'subj-coa', null, 'Memory Hierarchy & IO Interface', 'RAM/ROM chips connection, Memory expansion, Interrupt-driven IO, and Direct Memory Access (DMA) cycle stealing.', 5, false),
  makeTopic('coa-05-1', 'subj-coa', 'coa-05', 'DMA Controller & Cycle Stealing Calculations', 'DMA burst transfer time vs cycle-stealing CPU percentage slowdown = (Prep_time + Transfer_time) / Cycle_time.', 1, true),
  makeTopic('coa-05-2', 'subj-coa', 'coa-05', 'Memory Interleaving & Chip Interconnection', 'Low-order vs high-order interleaving for contiguous multi-word memory module access speedup.', 2, false),

  // =========================================================================
  // 11. DISCRETE MATHEMATICS (DM)
  // =========================================================================
  makeTopic('dm-01', 'subj-dm', null, 'Mathematical Logic', 'Propositional logic, truth tables, tautology, logical equivalences, laws of inference, and First-Order Predicate Logic quantifiers.', 1, true),
  makeTopic('dm-01-1', 'subj-dm', 'dm-01', 'Propositional Equivalences & Rules of Inference', 'Conditional P -> Q equivalent to ~P v Q, contrapositive ~Q -> ~P, Modus Ponens and Resolution refutation.', 1, true),
  makeTopic('dm-01-2', 'subj-dm', 'dm-01', 'First-Order Predicate Logic & Quantifiers', 'Universal (forall) and Existential (exists) quantifier rules, order of quantifiers, and translating English to logic.', 2, true),

  makeTopic('dm-02', 'subj-dm', null, 'Set Theory & Relations', 'Power sets, Cartesian products, relation properties (Reflexive, Symmetric, Anti-symmetric, Transitive), Equivalence classes, Posets, and Lattices.', 2, true),
  makeTopic('dm-02-1', 'subj-dm', 'dm-02', 'Equivalence Relations & Counting Relations', 'Reflexive closure, symmetric closure; counting reflexive (2^(n^2-n)), symmetric (2^(n(n+1)/2)) relations.', 1, true),
  makeTopic('dm-02-2', 'subj-dm', 'dm-02', 'Posets, Hasse Diagrams & Lattices', 'Partial order sets, maximal/minimal elements, bounds, and lattice property (unique LUB and GLB for every pair).', 2, true),

  makeTopic('dm-03', 'subj-dm', null, 'Combinatorics & Counting', 'Permutations & Combinations, Pigeonhole Principle (PHP), Principle of Inclusion-Exclusion (PIE), Derangements, and Generating functions.', 3, true),
  makeTopic('dm-03-1', 'subj-dm', 'dm-03', 'Pigeonhole Principle (PHP) Applications', 'Generalized PHP ceil(N/k) guaranteeing minimum item collisions in constrained subsets.', 1, true),
  makeTopic('dm-03-2', 'subj-dm', 'dm-03', 'Inclusion-Exclusion & Derangements', 'PIE formula for n sets, and derangements formula D(n) = n! * sum_{k=0}^n (-1)^k / k! with D(n) = (n-1)*(D(n-1)+D(n-2)).', 2, true),

  makeTopic('dm-04', 'subj-dm', null, 'Graph Theory', 'Handshaking Lemma, Complete/Bipartite graphs, Eulerian & Hamiltonian paths/cycles, Planar graphs (Euler formula), and Chromatic Coloring.', 4, true),
  makeTopic('dm-04-1', 'subj-dm', 'dm-04', 'Graph Properties & Handshaking Lemma', 'Sum of vertex degrees = 2 * |E|, counting odd degree vertices (always even), and bipartite graph odd cycle condition.', 1, true),
  makeTopic('dm-04-2', 'subj-dm', 'dm-04', 'Eulerian & Hamiltonian Graphs', 'Euler circuit if all degrees even; Euler path if exactly 0 or 2 odd vertices; Dirac theorem for Hamiltonian cycles.', 2, true),
  makeTopic('dm-04-3', 'subj-dm', 'dm-04', 'Planar Graphs & Euler Formula', 'Connected planar formula V - E + R = 2, max edges E <= 3V - 6 (or 2V - 4 for triangle-free), and Chromatic number chi(G).', 3, true),

  makeTopic('dm-05', 'subj-dm', null, 'Recurrence Relations & Generating Functions', 'Solving homogeneous and non-homogeneous linear recurrence relations with characteristic roots.', 5, false),
  makeTopic('dm-05-1', 'subj-dm', 'dm-05', 'Solving Linear Recurrence Relations', 'Finding characteristic equation roots, distinct vs repeated root general solution templates.', 1, true),

  // =========================================================================
  // 12. ENGINEERING MATHEMATICS (EM)
  // =========================================================================
  makeTopic('em-01', 'subj-em', null, 'Linear Algebra', 'Matrix operations, Rank of matrix, System of linear equations (AX = B consistency tests), Eigenvalues & Eigenvectors, and Cayley-Hamilton Theorem.', 1, true),
  makeTopic('em-01-1', 'subj-em', 'em-01', 'Rank & System of Linear Equations (AX = B)', 'Row echelon reduction, Augmented matrix [A|B] rank comparison: Unique (r=n), Infinite (r<n), No solution (r(A) < r(A|B)).', 1, true),
  makeTopic('em-01-2', 'subj-em', 'em-01', 'Eigenvalues, Eigenvectors & Properties', 'Trace(A) = sum(lambda), Det(A) = prod(lambda), eigenvalues of A^k and A^-1, orthogonal eigenvectors of symmetric matrices.', 2, true),
  makeTopic('em-01-3', 'subj-em', 'em-01', 'Cayley-Hamilton Theorem & Matrix Inverses', 'Every square matrix satisfies its characteristic polynomial |A - lambda*I| = 0; computing high powers A^n and A^-1.', 3, true),

  makeTopic('em-02', 'subj-em', null, 'Calculus', 'Limits, L Hopital Rule, Continuity & Differentiability, Mean Value Theorems (Rolle, Lagrange, Cauchy), Maxima/Minima, and Definite Integrals.', 2, true),
  makeTopic('em-02-1', 'subj-em', 'em-02', 'Limits & L Hopital Rule', '0/0 and inf/inf indeterminate forms reduction via numerator/denominator differentiation, standard limits.', 1, true),
  makeTopic('em-02-2', 'subj-em', 'em-02', 'Maxima, Minima & Mean Value Theorems', 'Critical points f (x) = 0, second derivative test f (x) sign, Rolle theorem f (c) = 0, Lagrange MVT f (c) = (f(b)-f(a))/(b-a).', 2, true),

  makeTopic('em-03', 'subj-em', null, 'Probability & Statistics', 'Axioms of probability, Conditional probability, Bayes Theorem, Random variables, Expectation, Variance, and Standard Distributions.', 3, true),
  makeTopic('em-03-1', 'subj-em', 'em-03', 'Conditional Probability & Bayes Theorem', 'P(A|B) = P(A cap B) / P(B), posterior probability updates using Total Probability Law expansion.', 1, true),
  makeTopic('em-03-2', 'subj-em', 'em-03', 'Discrete & Continuous Probability Distributions', 'Binomial (n*p, n*p*q), Poisson (mean lambda = var lambda), Uniform, and Normal (Gaussian mu, sigma^2) curve properties.', 2, true),

  // =========================================================================
  // 13. GENERAL APTITUDE (GA)
  // =========================================================================
  makeTopic('ga-01', 'subj-ga', null, 'Quantitative Aptitude', 'Percentages, Profit & Loss, Ratio & Proportion, Time and Work, Speed-Distance-Time, and Simple/Compound Interest.', 1, true),
  makeTopic('ga-01-1', 'subj-ga', 'ga-01', 'Percentages, Profit & Loss', 'Cost Price, Selling Price, Marked Price, Discount percentages, and successive percentage change formulas.', 1, true),
  makeTopic('ga-01-2', 'subj-ga', 'ga-01', 'Time and Work & Pipes-Cisterns', 'Unitary work rate method 1/T, combined efficiency, negative work in leakage pipes, and alternate day tasks.', 2, true),
  makeTopic('ga-01-3', 'subj-ga', 'ga-01', 'Speed, Distance, Time & Trains', 'Speed = Distance / Time, relative speed (opposite direction add, same direction subtract), and train crossing platforms.', 3, true),

  makeTopic('ga-02', 'subj-ga', null, 'Data Interpretation & Analytical Reasoning', 'Data tables, Bar charts, Pie charts, Line graphs, Syllogisms, Venn diagrams, Seating arrangements, and Blood relations.', 2, true),
  makeTopic('ga-02-1', 'subj-ga', 'ga-02', 'Data Interpretation (Charts & Graphs)', 'Fast percentage growth, ratio comparisons, and weighted average extraction from multi-bar/pie charts.', 1, true),
  makeTopic('ga-02-2', 'subj-ga', 'ga-02', 'Syllogisms & Venn Diagrams', 'Deductive reasoning validity checks using overlapping Euler circles for All, Some, None premises.', 2, true),

  makeTopic('ga-03', 'subj-ga', null, 'Spatial & Verbal Aptitude', '2D/3D shape transformations, paper folding/cutting, cube rotations, English grammar rules, vocabulary, and Reading Comprehension.', 3, false),
  makeTopic('ga-03-1', 'subj-ga', 'ga-03', 'Spatial Reasoning & Paper Folding', 'Mirror reflections, rotational symmetry, folding axes tracking, and opposite face identification on unfolded cubes.', 1, false),
  makeTopic('ga-03-2', 'subj-ga', 'ga-03', 'Verbal Ability & Reading Comprehension', 'Subject-verb agreement, tenses, vocabulary analogies, and critical reading paragraph inference extraction.', 2, false),
];

export const INITIAL_SCHEDULES: Schedule[] = [
  {
    id: 'sched-today',
    Schedule_Date: new Date().toISOString().split('T')[0],
    Schedule_Hours: 6.0,
    Schedule_Subjects: ['subj-cn', 'subj-os', 'subj-algo'],
    Schedule_Tag_Filters: ['Star'],
    Subject_Allocations: {
      'subj-cn': 120,
      'subj-os': 120,
      'subj-algo': 120,
    },
    Allocated_Topics: [
      {
        topic_id: 'cn-02',
        subject_id: 'subj-cn',
        topic_name: 'IPV4 Addressing',
        subject_name: 'Computer Networks',
        allocated_minutes: 120,
        completed: false,
      },
      {
        topic_id: 'os-03',
        subject_id: 'subj-os',
        topic_name: 'Process Synchronization',
        subject_name: 'Operating Systems',
        allocated_minutes: 120,
        completed: false,
      },
      {
        topic_id: 'algo-04',
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
