import { Subject } from '../types/subject';
import { Topic } from '../types/topic';
import { Schedule } from '../types/schedule';

export const INITIAL_SUBJECTS: Subject[] = [
  {
    id: 'subj-cn',
    Subject_Name: 'Computer Networks',
    Subject_Importance: 'Important',
    Subject_Description: 'IPv4 addressing, subnetting, TCP/UDP transport, routing protocols, MAC layer, and network applications.',
    Subject_Color: '#06b6d4', // Cyan
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'subj-os',
    Subject_Name: 'Operating Systems',
    Subject_Importance: 'Urgent',
    Subject_Description: 'Process scheduling, synchronization semaphores, deadlock detection, paging memory, and file systems.',
    Subject_Color: '#8b5cf6', // Violet
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 13).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'subj-prog',
    Subject_Name: 'C-Programming',
    Subject_Importance: 'High Scoring',
    Subject_Description: 'Data types, control flow, functions, pointers arithmetic, arrays, strings, dynamic memory, and structures.',
    Subject_Color: '#3b82f6', // Blue
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'subj-ds',
    Subject_Name: 'Data Structures',
    Subject_Importance: 'High Scoring',
    Subject_Description: 'Arrays, linked lists, stacks, queues, binary search trees, AVL trees, graphs, and hashing techniques.',
    Subject_Color: '#10b981', // Emerald
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 11).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'subj-dl',
    Subject_Name: 'Digital Logic',
    Subject_Importance: 'Normal',
    Subject_Description: 'Boolean algebra, K-map minimization, combinational adders/multiplexers, sequential counters, and number systems.',
    Subject_Color: '#f59e0b', // Amber
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'subj-toc',
    Subject_Name: 'Theory of Computation',
    Subject_Importance: 'Important',
    Subject_Description: 'Finite automata DFA/NFA, context-free grammars, pushdown automata, Turing machines, and undecidability.',
    Subject_Color: '#ec4899', // Pink
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'subj-cd',
    Subject_Name: 'Compiler Design',
    Subject_Importance: 'Normal',
    Subject_Description: 'Lexical analysis, LL(1) and LR parsing, syntax-directed translation, three address code, and optimization.',
    Subject_Color: '#6366f1', // Indigo
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'subj-algo',
    Subject_Name: 'Algorithms',
    Subject_Importance: 'High Scoring',
    Subject_Description: 'Asymptotic complexity, divide and conquer, dynamic programming, greedy methods, graph algorithms, and NP-completeness.',
    Subject_Color: '#14b8a6', // Teal
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'subj-dbms',
    Subject_Name: 'Database Management System',
    Subject_Importance: 'Urgent',
    Subject_Description: 'Functional dependencies, 1NF-BCNF normalization, SQL queries, transactions ACID, concurrency 2PL, and B+ trees.',
    Subject_Color: '#f97316', // Orange
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'subj-coa',
    Subject_Name: 'Computer Organisation & Architecture',
    Subject_Importance: 'Important',
    Subject_Description: 'Instruction pipelining, cache memory hierarchy, addressing modes, ALU microprogramming, and I/O interface.',
    Subject_Color: '#84cc16', // Lime
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'subj-dm',
    Subject_Name: 'Discrete Mathematics',
    Subject_Importance: 'High Scoring',
    Subject_Description: 'Graph theory, propositional & predicate logic, sets, relations, posets, lattices, and combinatorics.',
    Subject_Color: '#a855f7', // Purple
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'subj-em',
    Subject_Name: 'Engineering Mathematics',
    Subject_Importance: 'Important',
    Subject_Description: 'Linear algebra, matrix eigenvalues, single-variable calculus, limits, and probability distributions.',
    Subject_Color: '#e11d48', // Rose
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'subj-ga',
    Subject_Name: 'General Aptitude',
    Subject_Importance: 'High Scoring',
    Subject_Description: 'Quantitative aptitude, percentages, profit & loss, time-speed-distance, permutations, logic, and spatial reasoning.',
    Subject_Color: '#0ea5e9', // Sky
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Helper to create topic objects
let topicSeq = 1;
function makeTopic(
  id: string,
  subjectId: string,
  parentId: string | null,
  name: string,
  order: number,
  tags: { done?: boolean; star?: boolean; practice?: boolean; confidence?: 'None' | 'Low' | 'Medium' | 'High'; diff?: any; hours?: number } = {}
): Topic {
  return {
    id,
    Subject_Id: subjectId,
    Parent_Id: parentId,
    Topic_Name: name,
    Topic_Description: '',
    Topic_Order: order,
    Topic_Status: tags.done ? 'Done' : 'To Do',
    Topic_Difficulty: tags.diff || 'Normal',
    Topic_Tags: {
      Done: Boolean(tags.done),
      Star: Boolean(tags.star),
      Require_Practice: Boolean(tags.practice),
      Confidence: tags.confidence || 'None',
      Skip: false,
      Redo: false,
      Lecture_Needed: 0,
      Deadline: null,
      Recall_Activity: false,
      Practice_DPP: Boolean(tags.practice),
    },
    Topic_Study_Hours: tags.hours || 0,
    Topic_Sessions: [],
    Topic_Blocks: [],
    created_at: new Date(Date.now() - 1000 * 60 * 60 * (200 - topicSeq++)).toISOString(),
    updated_at: new Date().toISOString(),
  };
}

export const INITIAL_TOPICS: Topic[] = [
  // ================= 1. COMPUTER NETWORKS =================
  makeTopic('top-cn-1', 'subj-cn', null, 'IPV4 Addressing', 1, { star: true, confidence: 'High' }),
  makeTopic('sub-cn-1-1', 'subj-cn', 'top-cn-1', 'Classful Addressing & Net ID / Host ID', 1, { done: true }),
  makeTopic('sub-cn-1-2', 'subj-cn', 'top-cn-1', 'CIDR & Classless Subnetting', 2, { practice: true }),
  makeTopic('sub-cn-1-3', 'subj-cn', 'top-cn-1', 'VLSM & Variable Length Subnet Masking', 3),
  makeTopic('sub-cn-1-4', 'subj-cn', 'top-cn-1', 'Supernetting & Route Aggregation', 4),
  makeTopic('sub-cn-1-5', 'subj-cn', 'top-cn-1', 'Special IP Addresses (Loopback, Broadcast, Private)', 5),

  makeTopic('top-cn-2', 'subj-cn', null, 'Error Control & Flow Control', 2, { practice: true }),
  makeTopic('sub-cn-2-1', 'subj-cn', 'top-cn-2', 'Stop and Wait ARQ & Efficiency', 1),
  makeTopic('sub-cn-2-2', 'subj-cn', 'top-cn-2', 'Go-Back-N (GBN) Protocol & Window Sizing', 2),
  makeTopic('sub-cn-2-3', 'subj-cn', 'top-cn-2', 'Selective Repeat (SR) ARQ', 3),
  makeTopic('sub-cn-2-4', 'subj-cn', 'top-cn-2', 'CRC (Cyclic Redundancy Check) Generator Polynomial', 4),
  makeTopic('sub-cn-2-5', 'subj-cn', 'top-cn-2', 'Hamming Code & Error Correction', 5),

  makeTopic('top-cn-3', 'subj-cn', null, 'IPV4 Header & Fragmentation', 3),
  makeTopic('sub-cn-3-1', 'subj-cn', 'top-cn-3', 'IPv4 Header Fields & Checksum', 1),
  makeTopic('sub-cn-3-2', 'subj-cn', 'top-cn-3', 'MTU and Fragmentation Offset Calculation', 2, { star: true }),
  makeTopic('sub-cn-3-3', 'subj-cn', 'top-cn-3', 'Identification, Flags (DF, MF)', 3),

  makeTopic('top-cn-4', 'subj-cn', null, 'TCP & UDP', 4, { star: true, confidence: 'Medium' }),
  makeTopic('sub-cn-4-1', 'subj-cn', 'top-cn-4', 'TCP Header Format & Flags (SYN, ACK, FIN, RST)', 1),
  makeTopic('sub-cn-4-2', 'subj-cn', 'top-cn-4', 'TCP 3-Way Handshake & Connection Teardown', 2),
  makeTopic('sub-cn-4-3', 'subj-cn', 'top-cn-4', 'Flow Control & Sliding Window in TCP', 3),
  makeTopic('sub-cn-4-4', 'subj-cn', 'top-cn-4', 'Congestion Control: Slow Start, AIMD, Fast Retransmit', 4, { practice: true }),
  makeTopic('sub-cn-4-5', 'subj-cn', 'top-cn-4', 'UDP Header & Stateless Transport', 5),

  makeTopic('top-cn-5', 'subj-cn', null, 'Medium Access Control', 5),
  makeTopic('sub-cn-5-1', 'subj-cn', 'top-cn-5', 'Pure ALOHA & Slotted ALOHA Efficiency', 1),
  makeTopic('sub-cn-5-2', 'subj-cn', 'top-cn-5', 'CSMA/CD & Minimum Frame Size Condition', 2, { star: true }),
  makeTopic('sub-cn-5-3', 'subj-cn', 'top-cn-5', 'CSMA/CA & Exponential Backoff Algorithm', 3),
  makeTopic('sub-cn-5-4', 'subj-cn', 'top-cn-5', 'Ethernet Standard (IEEE 802.3) & Framing', 4),

  makeTopic('top-cn-6', 'subj-cn', null, 'Routing Protocols & Switching', 6, { practice: true }),
  makeTopic('sub-cn-6-1', 'subj-cn', 'top-cn-6', 'Distance Vector Routing & Count-to-Infinity Problem', 1),
  makeTopic('sub-cn-6-2', 'subj-cn', 'top-cn-6', 'Link State Routing & Dijkstra Shortest Path', 2),
  makeTopic('sub-cn-6-3', 'subj-cn', 'top-cn-6', 'Bridges, Hubs, Switches & Spanning Tree Protocol (STP)', 3),

  makeTopic('top-cn-7', 'subj-cn', null, 'Application Layer Protocols', 7),
  makeTopic('sub-cn-7-1', 'subj-cn', 'top-cn-7', 'Domain Name System (DNS) & Resource Records', 1),
  makeTopic('sub-cn-7-2', 'subj-cn', 'top-cn-7', 'HTTP & HTTPS (Persistent vs Non-Persistent)', 2),
  makeTopic('sub-cn-7-3', 'subj-cn', 'top-cn-7', 'SMTP, POP3, IMAP Email Protocols', 3),
  makeTopic('sub-cn-7-4', 'subj-cn', 'top-cn-7', 'DHCP & NAT (Network Address Translation)', 4),

  makeTopic('top-cn-8', 'subj-cn', null, 'IP Support protocol', 8),
  makeTopic('sub-cn-8-1', 'subj-cn', 'top-cn-8', 'ICMP Protocol & Ping / Traceroute', 1),
  makeTopic('sub-cn-8-2', 'subj-cn', 'top-cn-8', 'ARP & RARP Operations', 2),

  makeTopic('top-cn-9', 'subj-cn', null, 'OSI & TCP/Stack Protocol', 9),
  makeTopic('sub-cn-9-1', 'subj-cn', 'top-cn-9', '7 Layers of OSI Model & Encapsulation', 1, { done: true }),
  makeTopic('sub-cn-9-2', 'subj-cn', 'top-cn-9', 'TCP/IP 4-Layer Reference Model', 2, { done: true }),

  // ================= 2. OPERATING SYSTEMS =================
  makeTopic('top-os-1', 'subj-os', null, 'Introduction & Background', 1, { done: true }),
  makeTopic('sub-os-1-1', 'subj-os', 'top-os-1', 'Kernel Architecture (Monolithic vs Microkernel)', 1, { done: true }),
  makeTopic('sub-os-1-2', 'subj-os', 'top-os-1', 'Dual Mode Operation (User Mode vs Kernel Mode)', 2, { done: true }),
  makeTopic('sub-os-1-3', 'subj-os', 'top-os-1', 'System Booting & Interrupt Handling', 3, { done: true }),

  makeTopic('top-os-2', 'subj-os', null, 'Process Management', 2, { star: true }),
  makeTopic('sub-os-2-1', 'subj-os', 'top-os-2', 'Process States & PCB (Process Control Block)', 1),
  makeTopic('sub-os-2-2', 'subj-os', 'top-os-2', 'Process Creation using fork() and exec()', 2, { practice: true }),
  makeTopic('sub-os-2-3', 'subj-os', 'top-os-2', 'Context Switching & Dispatch Latency', 3),

  makeTopic('top-os-3', 'subj-os', null, 'CPU Scheduling', 3, { star: true, confidence: 'High' }),
  makeTopic('sub-os-3-1', 'subj-os', 'top-os-3', 'FCFS (First-Come, First-Served) & Convoy Effect', 1, { done: true }),
  makeTopic('sub-os-3-2', 'subj-os', 'top-os-3', 'SJF & SRTF (Shortest Job / Remaining Time First)', 2, { done: true }),
  makeTopic('sub-os-3-3', 'subj-os', 'top-os-3', 'Round Robin Scheduling & Time Quantum Tuning', 3, { done: true }),
  makeTopic('sub-os-3-4', 'subj-os', 'top-os-3', 'Priority Scheduling & Aging Heuristics', 4),
  makeTopic('sub-os-3-5', 'subj-os', 'top-os-3', 'Multi-level Queue & Multi-level Feedback Queue', 5),

  makeTopic('top-os-4', 'subj-os', null, 'Process Synchronization', 4, { star: true, practice: true }),
  makeTopic('sub-os-4-1', 'subj-os', 'top-os-4', 'Critical Section Problem & Hardware Instructions (TSL)', 1),
  makeTopic('sub-os-4-2', 'subj-os', 'top-os-4', 'Peterson’s Algorithm for 2 Processes', 2),
  makeTopic('sub-os-4-3', 'subj-os', 'top-os-4', 'Counting and Binary Semaphores (Wait & Signal)', 3, { practice: true }),
  makeTopic('sub-os-4-4', 'subj-os', 'top-os-4', 'Producer-Consumer / Bounded Buffer Problem', 4),
  makeTopic('sub-os-4-5', 'subj-os', 'top-os-4', 'Readers-Writers Problem', 5),
  makeTopic('sub-os-4-6', 'subj-os', 'top-os-4', 'Dining Philosophers Problem', 6),

  makeTopic('top-os-5', 'subj-os', null, 'DeadLock', 5, { star: true }),
  makeTopic('sub-os-5-1', 'subj-os', 'top-os-5', '4 Necessary Coffman Conditions', 1, { done: true }),
  makeTopic('sub-os-5-2', 'subj-os', 'top-os-5', 'Resource Allocation Graph (RAG) & Cycle Detection', 2),
  makeTopic('sub-os-5-3', 'subj-os', 'top-os-5', 'Deadlock Prevention vs Avoidance', 3),
  makeTopic('sub-os-5-4', 'subj-os', 'top-os-5', 'Banker’s Algorithm (Safety & Resource Request)', 4, { practice: true }),
  makeTopic('sub-os-5-5', 'subj-os', 'top-os-5', 'Deadlock Detection & Recovery Strategies', 5),

  makeTopic('top-os-6', 'subj-os', null, 'Memory Management', 6, { star: true, practice: true }),
  makeTopic('sub-os-6-1', 'subj-os', 'top-os-6', 'Contiguous Allocation & Internal / External Fragmentation', 1),
  makeTopic('sub-os-6-2', 'subj-os', 'top-os-6', 'Paging & Single-Level Page Tables', 2),
  makeTopic('sub-os-6-3', 'subj-os', 'top-os-6', 'Multi-Level Paging & Inverted Page Tables', 3),
  makeTopic('sub-os-6-4', 'subj-os', 'top-os-6', 'Translation Lookaside Buffer (TLB) & Effective Memory Access Time', 4, { star: true }),
  makeTopic('sub-os-6-5', 'subj-os', 'top-os-6', 'Page Replacement: FIFO, Optimal, LRU, Second-Chance', 5, { practice: true }),
  makeTopic('sub-os-6-6', 'subj-os', 'top-os-6', 'Thrashing & Working Set Model', 6),

  makeTopic('top-os-7', 'subj-os', null, 'File System & Device Management', 7),
  makeTopic('sub-os-7-1', 'subj-os', 'top-os-7', 'File Allocation (Contiguous, Linked, Indexed)', 1),
  makeTopic('sub-os-7-2', 'subj-os', 'top-os-7', 'Unix Inode Structure & File Pointers', 2),
  makeTopic('sub-os-7-3', 'subj-os', 'top-os-7', 'Disk Scheduling: FCFS, SSTF, SCAN, C-SCAN, LOOK, C-LOOK', 3, { practice: true }),

  makeTopic('top-os-8', 'subj-os', null, 'System Calls & Threads', 8),
  makeTopic('sub-os-8-1', 'subj-os', 'top-os-8', 'User-Level vs Kernel-Level Threads', 1),
  makeTopic('sub-os-8-2', 'subj-os', 'top-os-8', 'Multithreading Models (1:1, M:1, M:N)', 2),

  // ================= 3. C-PROGRAMMING =================
  makeTopic('top-cp-1', 'subj-prog', null, 'Data Types & Operators', 1, { done: true }),
  makeTopic('sub-cp-1-1', 'subj-prog', 'top-cp-1', 'Data Types, Range & Type Promotion Rules', 1, { done: true }),
  makeTopic('sub-cp-1-2', 'subj-prog', 'top-cp-1', 'Operator Precedence & Associativity Matrix', 2, { done: true }),
  makeTopic('sub-cp-1-3', 'subj-prog', 'top-cp-1', 'Bitwise Operators (&, |, ^, ~, <<, >>)', 3, { practice: true }),

  makeTopic('top-cp-2', 'subj-prog', null, 'Control Flow Statements', 2, { done: true }),
  makeTopic('sub-cp-2-1', 'subj-prog', 'top-cp-2', 'Conditionals: If-Else & Switch-Case Fallthrough', 1, { done: true }),
  makeTopic('sub-cp-2-2', 'subj-prog', 'top-cp-2', 'Loops (For, While, Do-While) & Break/Continue', 2, { done: true }),

  makeTopic('top-cp-3', 'subj-prog', null, 'Functions & Storage Classes', 3, { star: true }),
  makeTopic('sub-cp-3-1', 'subj-prog', 'top-cp-3', 'Parameter Passing: Call by Value vs Reference', 1),
  makeTopic('sub-cp-3-2', 'subj-prog', 'top-cp-3', 'Recursive Functions & Stack Frame Analysis', 2, { practice: true }),
  makeTopic('sub-cp-3-3', 'subj-prog', 'top-cp-3', 'Storage Classes: auto, register, static, extern', 3, { star: true }),

  makeTopic('top-cp-4', 'subj-prog', null, 'Arrays & Pointers', 4, { star: true, practice: true }),
  makeTopic('sub-cp-4-1', 'subj-prog', 'top-cp-4', '1D and 2D Arrays (Row-Major vs Column-Major Mapping)', 1),
  makeTopic('sub-cp-4-2', 'subj-prog', 'top-cp-4', 'Pointer Arithmetic & Dereferencing Expressions', 2, { star: true }),
  makeTopic('sub-cp-4-3', 'subj-prog', 'top-cp-4', 'Array of Pointers vs Pointer to an Array', 3),
  makeTopic('sub-cp-4-4', 'subj-prog', 'top-cp-4', 'Dynamic Memory Allocation (malloc, calloc, realloc, free)', 4),

  makeTopic('top-cp-5', 'subj-prog', null, 'Strings', 5),
  makeTopic('sub-cp-5-1', 'subj-prog', 'top-cp-5', 'Null-Terminated Strings & Character Pointers', 1),
  makeTopic('sub-cp-5-2', 'subj-prog', 'top-cp-5', 'Standard Library String Functions (strlen, strcpy, strcmp)', 2),

  makeTopic('top-cp-6', 'subj-prog', null, 'Structures & Union', 6),
  makeTopic('sub-cp-6-1', 'subj-prog', 'top-cp-6', 'Structure Padding, Alignment & sizeof Operator', 1, { star: true }),
  makeTopic('sub-cp-6-2', 'subj-prog', 'top-cp-6', 'Unions & Overlapping Memory Allocation', 2),

  makeTopic('top-cp-7', 'subj-prog', null, 'Miscellaneous Topics', 7),
  makeTopic('sub-cp-7-1', 'subj-prog', 'top-cp-7', 'Preprocessor Macros (#define, #ifdef, ## operator)', 1),
  makeTopic('sub-cp-7-2', 'subj-prog', 'top-cp-7', 'Typedef, Enumerations & Type Aliases', 2),

  // ================= 4. DATA STRUCTURES =================
  makeTopic('top-ds-1', 'subj-ds', null, 'Introduction & Arrays', 1, { done: true }),
  makeTopic('sub-ds-1-1', 'subj-ds', 'top-ds-1', 'Asymptotic Complexities in Array Operations', 1, { done: true }),
  makeTopic('sub-ds-1-2', 'subj-ds', 'top-ds-1', 'Sparse Matrix Representation & 2D Matrix Address Formulae', 2, { done: true }),

  makeTopic('top-ds-2', 'subj-ds', null, 'Linked List', 2),
  makeTopic('sub-ds-2-1', 'subj-ds', 'top-ds-2', 'Singly Linked List Operations (Insert, Delete, Search)', 1),
  makeTopic('sub-ds-2-2', 'subj-ds', 'top-ds-2', 'Doubly Linked List & Circular Linked List', 2),
  makeTopic('sub-ds-2-3', 'subj-ds', 'top-ds-2', 'Reverse Linked List & Cycle Finding (Floyd’s Tortoise & Hare)', 3, { star: true }),

  makeTopic('top-ds-3', 'subj-ds', null, 'Stack & Queues', 3, { star: true }),
  makeTopic('sub-ds-3-1', 'subj-ds', 'top-ds-3', 'Stack Implementation & Infix to Postfix Conversion', 1),
  makeTopic('sub-ds-3-2', 'subj-ds', 'top-ds-3', 'Postfix & Prefix Expression Evaluation', 2, { practice: true }),
  makeTopic('sub-ds-3-3', 'subj-ds', 'top-ds-3', 'Queue, Circular Queue & Double Ended Queue (Deque)', 3),
  makeTopic('sub-ds-3-4', 'subj-ds', 'top-ds-3', 'Queue implementation using Stacks', 4),

  makeTopic('top-ds-4', 'subj-ds', null, 'Trees', 4, { star: true, practice: true }),
  makeTopic('sub-ds-4-1', 'subj-ds', 'top-ds-4', 'Binary Tree Properties & Tree Traversal (In, Pre, Post, Level)', 1),
  makeTopic('sub-ds-4-2', 'subj-ds', 'top-ds-4', 'Reconstructing Tree from Traversals', 2, { star: true }),
  makeTopic('sub-ds-4-3', 'subj-ds', 'top-ds-4', 'Binary Search Tree (BST) Operations & Inorder Successor', 3),
  makeTopic('sub-ds-4-4', 'subj-ds', 'top-ds-4', 'AVL Trees & Rotations (LL, RR, LR, RL)', 4, { practice: true }),
  makeTopic('sub-ds-4-5', 'subj-ds', 'top-ds-4', 'Binary Heaps (Min Heap & Max Heap Construction)', 5),

  makeTopic('top-ds-5', 'subj-ds', null, 'Graphs', 5, { star: true }),
  makeTopic('sub-ds-5-1', 'subj-ds', 'top-ds-5', 'Adjacency Matrix & Adjacency List Representations', 1),
  makeTopic('sub-ds-5-2', 'subj-ds', 'top-ds-5', 'Breadth-First Search (BFS) & Shortest Path in Unweighted Graph', 2),
  makeTopic('sub-ds-5-3', 'subj-ds', 'top-ds-5', 'Depth-First Search (DFS) & Classification of Edges', 3),

  makeTopic('top-ds-6', 'subj-ds', null, 'Hashing', 6),
  makeTopic('sub-ds-6-1', 'subj-ds', 'top-ds-6', 'Hash Functions & Collision Resolution using Chaining', 1),
  makeTopic('sub-ds-6-2', 'subj-ds', 'top-ds-6', 'Open Addressing: Linear Probing, Quadratic Probing, Double Hashing', 2, { practice: true }),

  // ================= 5. DIGITAL LOGIC =================
  makeTopic('top-dl-1', 'subj-dl', null, 'Logic Gates & Minimization', 1, { done: true }),
  makeTopic('sub-dl-1-1', 'subj-dl', 'top-dl-1', 'Universal Gates (NAND / NOR Implementation)', 1, { done: true }),
  makeTopic('sub-dl-1-2', 'subj-dl', 'top-dl-1', 'Boolean Algebra Laws, Canonical SOP & POS', 2, { done: true }),
  makeTopic('sub-dl-1-3', 'subj-dl', 'top-dl-1', 'Karnaugh Maps (K-Maps) 2, 3, 4 Variables & Don’t Cares', 3, { practice: true }),
  makeTopic('sub-dl-1-4', 'subj-dl', 'top-dl-1', 'Prime Implicants & Essential Prime Implicants', 4),

  makeTopic('top-dl-2', 'subj-dl', null, 'Combinational Circuit', 2, { star: true }),
  makeTopic('sub-dl-2-1', 'subj-dl', 'top-dl-2', 'Half Adder, Full Adder, Ripple Carry & Carry Lookahead Adder', 1),
  makeTopic('sub-dl-2-2', 'subj-dl', 'top-dl-2', 'Multiplexers & Implementing Logic Functions using MUX', 2, { star: true }),
  makeTopic('sub-dl-2-3', 'subj-dl', 'top-dl-2', 'Decoders, Encoders & Priority Encoders', 3),

  makeTopic('top-dl-3', 'subj-dl', null, 'Sequential Circuit', 3, { star: true, practice: true }),
  makeTopic('sub-dl-3-1', 'subj-dl', 'top-dl-3', 'Latches vs Flip-Flops (SR, JK, D, T Flip-Flops)', 1),
  makeTopic('sub-dl-3-2', 'subj-dl', 'top-dl-3', 'Master-Slave Flip-Flop & Race-Around Condition', 2),
  makeTopic('sub-dl-3-3', 'subj-dl', 'top-dl-3', 'Synchronous & Asynchronous Up/Down Counters', 3, { practice: true }),
  makeTopic('sub-dl-3-4', 'subj-dl', 'top-dl-3', 'Ring Counter & Johnson (Twisted Ring) Counter', 4),

  makeTopic('top-dl-4', 'subj-dl', null, 'Number System', 4, { done: true }),
  makeTopic('sub-dl-4-1', 'subj-dl', 'top-dl-4', 'Base Conversions (Binary, Octal, Decimal, Hexadecimal)', 1, { done: true }),
  makeTopic('sub-dl-4-2', 'subj-dl', 'top-dl-4', '1’s Complement & 2’s Complement Arithmetic & Overflow', 2, { done: true }),

  // ================= 6. THEORY OF COMPUTATION =================
  makeTopic('top-toc-1', 'subj-toc', null, 'Finite Automata', 1, { star: true, confidence: 'High' }),
  makeTopic('sub-toc-1-1', 'subj-toc', 'top-toc-1', 'DFA Construction & NFA to DFA Subset Construction', 1, { done: true }),
  makeTopic('sub-toc-1-2', 'subj-toc', 'top-toc-1', 'DFA State Minimization using Myhill-Nerode Theorem', 2),
  makeTopic('sub-toc-1-3', 'subj-toc', 'top-toc-1', 'Regular Expressions & Arden’s Theorem', 3),
  makeTopic('sub-toc-1-4', 'subj-toc', 'top-toc-1', 'Closure Properties of Regular Languages', 4, { star: true }),
  makeTopic('sub-toc-1-5', 'subj-toc', 'top-toc-1', 'Pumping Lemma for Regular Languages', 5),

  makeTopic('top-toc-2', 'subj-toc', null, 'Push Down Automata', 2, { star: true }),
  makeTopic('sub-toc-2-1', 'subj-toc', 'top-toc-2', 'Context-Free Grammars (CFG) & Ambiguity in CFG', 1),
  makeTopic('sub-toc-2-2', 'subj-toc', 'top-toc-2', 'Deterministic PDA (DPDA) vs Non-Deterministic PDA (NPDA)', 2),
  makeTopic('sub-toc-2-3', 'subj-toc', 'top-toc-2', 'Closure Properties of Context-Free Languages (CFL)', 3),

  makeTopic('top-toc-3', 'subj-toc', null, 'Turing Machine & Recursively Enumerable', 3),
  makeTopic('sub-toc-3-1', 'subj-toc', 'top-toc-3', 'Turing Machine Definitions & Transition Functions', 1),
  makeTopic('sub-toc-3-2', 'subj-toc', 'top-toc-3', 'Recursive (REC) vs Recursively Enumerable (RE) Languages', 2),
  makeTopic('sub-toc-3-3', 'subj-toc', 'top-toc-3', 'Chomsky Hierarchy of Languages', 3),

  makeTopic('top-toc-4', 'subj-toc', null, 'Decidability', 4, { star: true, practice: true }),
  makeTopic('sub-toc-4-1', 'subj-toc', 'top-toc-4', 'Halting Problem of Turing Machine', 1, { star: true }),
  makeTopic('sub-toc-4-2', 'subj-toc', 'top-toc-4', 'Decidability Table for FA, CFG, CSG, and TM', 2, { practice: true }),
  makeTopic('sub-toc-4-3', 'subj-toc', 'top-toc-4', 'Post Correspondence Problem (PCP)', 3),

  // ================= 7. COMPILER DESIGN =================
  makeTopic('top-cd-1', 'subj-cd', null, 'Lexical & Syntax Analysis', 1, { star: true }),
  makeTopic('sub-cd-1-1', 'subj-cd', 'top-cd-1', 'Lexical Analyzer & Token Specification', 1),
  makeTopic('sub-cd-1-2', 'subj-cd', 'top-cd-1', 'Elimination of Left Recursion & Left Factoring', 2),
  makeTopic('sub-cd-1-3', 'subj-cd', 'top-cd-1', 'Computation of FIRST and FOLLOW Sets', 3, { practice: true }),
  makeTopic('sub-cd-1-4', 'subj-cd', 'top-cd-1', 'LL(1) Predictive Parsing Table & Conflicts', 4, { star: true }),
  makeTopic('sub-cd-1-5', 'subj-cd', 'top-cd-1', 'Bottom-Up Parsing: LR(0), SLR(1), CLR(1), LALR(1)', 5, { practice: true }),

  makeTopic('top-cd-2', 'subj-cd', null, 'Syntax Directed Translation', 2),
  makeTopic('sub-cd-2-1', 'subj-cd', 'top-cd-2', 'Synthesized vs Inherited Attributes', 1),
  makeTopic('sub-cd-2-2', 'subj-cd', 'top-cd-2', 'S-Attributed and L-Attributed SDDs', 2, { star: true }),

  makeTopic('top-cd-3', 'subj-cd', null, 'Intermediate Code & Code Optimization', 3),
  makeTopic('sub-cd-3-1', 'subj-cd', 'top-cd-3', 'Three Address Code: Quadruples, Triples, Indirect Triples', 1),
  makeTopic('sub-cd-3-2', 'subj-cd', 'top-cd-3', 'Basic Blocks & Control Flow Graphs (CFG)', 2),
  makeTopic('sub-cd-3-3', 'subj-cd', 'top-cd-3', 'Loop Optimization, Dead Code Elimination & Constant Folding', 3),

  // ================= 8. ALGORITHMS =================
  makeTopic('top-al-1', 'subj-algo', null, 'Analysis Of Algorithms', 1, { done: true }),
  makeTopic('sub-al-1-1', 'subj-algo', 'top-al-1', 'Asymptotic Notations (Big-O, Omega, Theta)', 1, { done: true }),
  makeTopic('sub-al-1-2', 'subj-algo', 'top-al-1', 'Master Theorem for Divide-and-Conquer Recurrences', 2, { done: true }),
  makeTopic('sub-al-1-3', 'subj-algo', 'top-al-1', 'Recursion Tree & Substitution Methods', 3),

  makeTopic('top-al-2', 'subj-algo', null, 'Design Strategies & Greedy Method', 2, { star: true }),
  makeTopic('sub-al-2-1', 'subj-algo', 'top-al-2', 'Merge Sort & Quick Sort Partitioning Complexity', 1),
  makeTopic('sub-al-2-2', 'subj-algo', 'top-al-2', 'Fractional Knapsack Problem', 2),
  makeTopic('sub-al-2-3', 'subj-algo', 'top-al-2', 'Huffman Coding & Prefix Codes Optimization', 3, { practice: true }),
  makeTopic('sub-al-2-4', 'subj-algo', 'top-al-2', 'Activity Selection & Job Sequencing with Deadlines', 4),

  makeTopic('top-al-3', 'subj-algo', null, 'Dynamic Programming', 3, { star: true, practice: true }),
  makeTopic('sub-al-3-1', 'subj-algo', 'top-al-3', '0/1 Knapsack Problem', 1, { practice: true }),
  makeTopic('sub-al-3-2', 'subj-algo', 'top-al-3', 'Longest Common Subsequence (LCS)', 2),
  makeTopic('sub-al-3-3', 'subj-algo', 'top-al-3', 'Matrix Chain Multiplication (MCM)', 3, { star: true }),
  makeTopic('sub-al-3-4', 'subj-algo', 'top-al-3', 'Subset Sum Problem & Coin Change Problem', 4),

  makeTopic('top-al-4', 'subj-algo', null, 'Graph Algorithms & Heap Algorithms', 4, { star: true, practice: true }),
  makeTopic('sub-al-4-1', 'subj-algo', 'top-al-4', 'Minimum Spanning Tree: Prim’s & Kruskal’s Algorithms', 1),
  makeTopic('sub-al-4-2', 'subj-algo', 'top-al-4', 'Single Source Shortest Path: Dijkstra’s Algorithm', 2, { star: true }),
  makeTopic('sub-al-4-3', 'subj-algo', 'top-al-4', 'Bellman-Ford & Floyd-Warshall Algorithms', 3),
  makeTopic('sub-al-4-4', 'subj-algo', 'top-al-4', 'HeapSort & Priority Queue Operations', 4),

  makeTopic('top-al-5', 'subj-algo', null, 'Backtracking & Branch-Bound', 5),
  makeTopic('sub-al-5-1', 'subj-algo', 'top-al-5', 'N-Queens Problem & State Space Tree', 1),
  makeTopic('sub-al-5-2', 'subj-algo', 'top-al-5', 'P, NP, NP-Complete, and NP-Hard Classes', 2, { star: true }),

  // ================= 9. DATABASE MANAGEMENT SYSTEM =================
  makeTopic('top-db-1', 'subj-dbms', null, "FD's and Normalisation", 1, { star: true, practice: true }),
  makeTopic('sub-db-1-1', 'subj-dbms', 'top-db-1', 'Functional Dependencies & Armstrong’s Axioms', 1),
  makeTopic('sub-db-1-2', 'subj-dbms', 'top-db-1', 'Attribute Closure & Finding Candidate Keys', 2, { star: true }),
  makeTopic('sub-db-1-3', 'subj-dbms', 'top-db-1', '1NF, 2NF, 3NF, and BCNF Normal Forms', 3, { practice: true }),
  makeTopic('sub-db-1-4', 'subj-dbms', 'top-db-1', 'Lossless Join & Dependency Preserving Decomposition', 4, { star: true }),

  makeTopic('top-db-2', 'subj-dbms', null, 'Transaction and Concurrency Control', 2, { star: true }),
  makeTopic('sub-db-2-1', 'subj-dbms', 'top-db-2', 'ACID Properties & Transaction State Diagram', 1),
  makeTopic('sub-db-2-2', 'subj-dbms', 'top-db-2', 'Conflict Serializability & Precedence Graphs', 2, { practice: true }),
  makeTopic('sub-db-2-3', 'subj-dbms', 'top-db-2', 'View Serializability & Blind Writes', 3),
  makeTopic('sub-db-2-4', 'subj-dbms', 'top-db-2', 'Two-Phase Locking (2PL, Strict 2PL, Rigorous 2PL)', 4, { star: true }),
  makeTopic('sub-db-2-5', 'subj-dbms', 'top-db-2', 'Timestamp-Based Protocols & Thomas Write Rule', 5),

  makeTopic('top-db-3', 'subj-dbms', null, 'ER Model', 3),
  makeTopic('sub-db-3-1', 'subj-dbms', 'top-db-3', 'Entities, Attributes & Cardinality Ratios', 1),
  makeTopic('sub-db-3-2', 'subj-dbms', 'top-db-3', 'Converting ER Diagrams to Relational Schema', 2),

  makeTopic('top-db-4', 'subj-dbms', null, 'Query Language (SQL)', 4, { star: true }),
  makeTopic('sub-db-4-1', 'subj-dbms', 'top-db-4', 'Relational Algebra Operations (Select, Project, Join, Division)', 1),
  makeTopic('sub-db-4-2', 'subj-dbms', 'top-db-4', 'SQL Queries, Joins (Inner, Left, Right, Full)', 2),
  makeTopic('sub-db-4-3', 'subj-dbms', 'top-db-4', 'GROUP BY, HAVING, and Aggregate Functions', 3),
  makeTopic('sub-db-4-4', 'subj-dbms', 'top-db-4', 'Correlated Subqueries & Nested Queries', 4, { practice: true }),

  makeTopic('top-db-5', 'subj-dbms', null, 'File Organisation & Indexing', 5, { practice: true }),
  makeTopic('sub-db-5-1', 'subj-dbms', 'top-db-5', 'Primary, Secondary, and Clustering Index', 1),
  makeTopic('sub-db-5-2', 'subj-dbms', 'top-db-5', 'B-Tree & B+ Tree Node Capacity, Insertion, Deletion', 2, { star: true }),

  // ================= 10. COMPUTER ORGANISATION & ARCHITECTURE =================
  makeTopic('top-co-1', 'subj-coa', null, 'Introduction Of COA', 1, { done: true }),
  makeTopic('sub-co-1-1', 'subj-coa', 'top-co-1', 'Von Neumann Architecture & Bus Interconnection', 1, { done: true }),
  makeTopic('sub-co-1-2', 'subj-coa', 'top-co-1', 'CPI, Clock Rate, MIPS & Performance Metrics', 2, { done: true }),

  makeTopic('top-co-2', 'subj-coa', null, 'Machine Instruction and Addressing Modes', 2, { star: true }),
  makeTopic('sub-co-2-1', 'subj-coa', 'top-co-2', 'Addressing Modes (Immediate, Direct, Indirect, Indexed, Base Register)', 1, { star: true }),
  makeTopic('sub-co-2-2', 'subj-coa', 'top-co-2', 'Instruction Formats & Opcode Encoding Range', 2),

  makeTopic('top-co-3', 'subj-coa', null, 'Floating Point Representation', 3),
  makeTopic('sub-co-3-1', 'subj-coa', 'top-co-3', 'IEEE 754 Single Precision 32-bit Floating Point', 1, { star: true }),
  makeTopic('sub-co-3-2', 'subj-coa', 'top-co-3', 'Normalized, Subnormal Numbers & Underflow/Overflow', 2),

  makeTopic('top-co-4', 'subj-coa', null, 'ALU and Control Unit', 4),
  makeTopic('sub-co-4-1', 'subj-coa', 'top-co-4', 'Hardwired vs Microprogrammed Control Unit', 1),
  makeTopic('sub-co-4-2', 'subj-coa', 'top-co-4', 'Horizontal vs Vertical Micro-instructions', 2),

  makeTopic('top-co-5', 'subj-coa', null, 'Instruction And Pipelining', 5, { star: true, practice: true }),
  makeTopic('sub-co-5-1', 'subj-coa', 'top-co-5', 'Instruction Pipeline Stages & Clock Cycle Time', 1),
  makeTopic('sub-co-5-2', 'subj-coa', 'top-co-5', 'Pipeline Hazards: Structural, Data (RAW, WAR, WAW), Control', 2, { star: true }),
  makeTopic('sub-co-5-3', 'subj-coa', 'top-co-5', 'Operand Forwarding & Branch Penalty Calculation', 3),
  makeTopic('sub-co-5-4', 'subj-coa', 'top-co-5', 'Pipeline Speedup & Efficiency Formulae', 4, { practice: true }),

  makeTopic('top-co-6', 'subj-coa', null, 'Cache Memory', 6, { star: true, practice: true }),
  makeTopic('sub-co-6-1', 'subj-coa', 'top-co-6', 'Direct Mapped, Fully Associative, Set Associative Mapping', 1, { star: true }),
  makeTopic('sub-co-6-2', 'subj-coa', 'top-co-6', 'Cache Hit Ratio & Average Memory Access Time (AMAT)', 2, { practice: true }),
  makeTopic('sub-co-6-3', 'subj-coa', 'top-co-6', 'Write-Through vs Write-Back Cache Policies', 3),

  makeTopic('top-co-7', 'subj-coa', null, 'Secondary Memory & IO Interface', 7),
  makeTopic('sub-co-7-1', 'subj-coa', 'top-co-7', 'Programmed I/O, Interrupt Driven I/O, Direct Memory Access (DMA)', 1),
  makeTopic('sub-co-7-2', 'subj-coa', 'top-co-7', 'Magnetic Disk Architecture: Seek Time, Rotational Latency, Transfer Rate', 2),

  // ================= 11. DISCRETE MATHEMATICS =================
  makeTopic('top-dm-1', 'subj-dm', null, 'Graph Theory', 1, { star: true }),
  makeTopic('sub-dm-1-1', 'subj-dm', 'top-dm-1', 'Handshaking Lemma & Degree Sequences', 1),
  makeTopic('sub-dm-1-2', 'subj-dm', 'top-dm-1', 'Eulerian & Hamiltonian Graphs Conditions', 2),
  makeTopic('sub-dm-1-3', 'subj-dm', 'top-dm-1', 'Planar Graphs, Euler’s Formula (V - E + F = 2) & Region Bounds', 3, { star: true }),
  makeTopic('sub-dm-1-4', 'subj-dm', 'top-dm-1', 'Graph Coloring & Chromatic Number', 4),

  makeTopic('top-dm-2', 'subj-dm', null, 'Mathematical Logic', 2, { done: true }),
  makeTopic('sub-dm-2-1', 'subj-dm', 'top-dm-2', 'Propositional Logic, Truth Tables & Tautologies', 1, { done: true }),
  makeTopic('sub-dm-2-2', 'subj-dm', 'top-dm-2', 'Predicate Logic Quantifiers (Universal & Existential)', 2, { done: true }),
  makeTopic('sub-dm-2-3', 'subj-dm', 'top-dm-2', 'Rules of Inference & Logical Equivalences', 3),

  makeTopic('top-dm-3', 'subj-dm', null, 'Set Theory', 3),
  makeTopic('sub-dm-3-1', 'subj-dm', 'top-dm-3', 'Relations: Reflexive, Symmetric, Transitive, Equivalence', 1),
  makeTopic('sub-dm-3-2', 'subj-dm', 'top-dm-3', 'Partial Order Relations, Hasse Diagrams & Lattices', 2, { star: true }),
  makeTopic('sub-dm-3-3', 'subj-dm', 'top-dm-3', 'Functions: Injective, Surjective, Bijective, Pigeonhole Principle', 3),

  makeTopic('top-dm-4', 'subj-dm', null, 'Combinatorics', 4, { practice: true }),
  makeTopic('sub-dm-4-1', 'subj-dm', 'top-dm-4', 'Permutations & Combinations with Repetition Rules', 1),
  makeTopic('sub-dm-4-2', 'subj-dm', 'top-dm-4', 'Principle of Inclusion-Exclusion (PIE)', 2),
  makeTopic('sub-dm-4-3', 'subj-dm', 'top-dm-4', 'Generating Functions & Solving Recurrence Relations', 3),

  // ================= 12. ENGINEERING MATHEMATICS =================
  makeTopic('top-em-1', 'subj-em', null, 'Linear Algebra', 1, { star: true, confidence: 'High' }),
  makeTopic('sub-em-1-1', 'subj-em', 'top-em-1', 'Matrix Determinants, Rank of a Matrix & Echelon Form', 1, { done: true }),
  makeTopic('sub-em-1-2', 'subj-em', 'top-em-1', 'System of Linear Equations (Unique, Infinite, No Solution)', 2, { done: true }),
  makeTopic('sub-em-1-3', 'subj-em', 'top-em-1', 'Eigenvalues, Eigenvectors & Cayley-Hamilton Theorem', 3, { star: true }),

  makeTopic('top-em-2', 'subj-em', null, 'Calculus', 2),
  makeTopic('sub-em-2-1', 'subj-em', 'top-em-2', 'Limits, Continuity & Differentiability', 1),
  makeTopic('sub-em-2-2', 'subj-em', 'top-em-2', 'Maxima, Minima & Mean Value Theorems', 2),

  makeTopic('top-em-3', 'subj-em', null, 'Probability & Statistics', 3, { star: true, practice: true }),
  makeTopic('sub-em-3-1', 'subj-em', 'top-em-3', 'Conditional Probability & Bayes’ Theorem', 1, { star: true }),
  makeTopic('sub-em-3-2', 'subj-em', 'top-em-3', 'Random Variables, PDF, PMF & CDF', 2),
  makeTopic('sub-em-3-3', 'subj-em', 'top-em-3', 'Uniform, Binomial, Poisson, Exponential, Normal Distributions', 3, { practice: true }),
  makeTopic('sub-em-3-4', 'subj-em', 'top-em-3', 'Mean, Variance, Standard Deviation & Covariance', 4),

  // ================= 13. GENERAL APTITUDE =================
  makeTopic('top-ga-1', 'subj-ga', null, 'Averages', 1, { done: true }),
  makeTopic('sub-ga-1-1', 'subj-ga', 'top-ga-1', 'Weighted Average & Replacement Formulas', 1, { done: true }),

  makeTopic('top-ga-2', 'subj-ga', null, 'Percentages', 2, { done: true }),
  makeTopic('sub-ga-2-1', 'subj-ga', 'top-ga-2', 'Successive Percentage Changes & Expenditure Problems', 1, { done: true }),

  makeTopic('top-ga-3', 'subj-ga', null, 'Simple & Compound Interest', 3),
  makeTopic('sub-ga-3-1', 'subj-ga', 'top-ga-3', 'Difference between CI and SI for 2 and 3 Years', 1),

  makeTopic('top-ga-4', 'subj-ga', null, 'Profit and Loss', 4),
  makeTopic('sub-ga-4-1', 'subj-ga', 'top-ga-4', 'Marked Price, Discount & Dishonest Seller', 1),

  makeTopic('top-ga-5', 'subj-ga', null, 'Mixtures & Alligations', 5),
  makeTopic('sub-ga-5-1', 'subj-ga', 'top-ga-5', 'Rule of Alligation & Repeated Replacement Formula', 1),

  makeTopic('top-ga-6', 'subj-ga', null, 'Ratio and Propotion', 6),
  makeTopic('sub-ga-6-1', 'subj-ga', 'top-ga-6', 'Direct/Inverse Proportions & Partnership Shares', 1),

  makeTopic('top-ga-7', 'subj-ga', null, 'Counting Theory', 7),
  makeTopic('sub-ga-7-1', 'subj-ga', 'top-ga-7', 'Fundamental Principles of Multiplication & Addition', 1),

  makeTopic('top-ga-8', 'subj-ga', null, 'Time and Work', 8, { star: true }),
  makeTopic('sub-ga-8-1', 'subj-ga', 'top-ga-8', 'Efficiency Ratio & Work-Wages Calculation', 1),

  makeTopic('top-ga-9', 'subj-ga', null, 'Pipes and Cisterns', 9),
  makeTopic('sub-ga-9-1', 'subj-ga', 'top-ga-9', 'Inlet & Outlet Flow Rates', 1),

  makeTopic('top-ga-10', 'subj-ga', null, 'Speed, Distance and Time', 10, { star: true }),
  makeTopic('sub-ga-10-1', 'subj-ga', 'top-ga-10', 'Average Speed Formula & Relative Speed Calculations', 1),

  makeTopic('top-ga-11', 'subj-ga', null, 'Boats, Trains, Races', 11),
  makeTopic('sub-ga-11-1', 'subj-ga', 'top-ga-11', 'Upstream/Downstream Speeds & Train Crossing Pole/Platform', 1),

  makeTopic('top-ga-12', 'subj-ga', null, 'Mensuration 2D, 3D & Geometry', 12),
  makeTopic('sub-ga-12-1', 'subj-ga', 'top-ga-12', 'Plane Figures & Solid Surface Area / Volume', 1),

  makeTopic('top-ga-13', 'subj-ga', null, 'Data Interpretation', 13, { practice: true }),
  makeTopic('sub-ga-13-1', 'subj-ga', 'top-ga-13', 'Pie Charts, Bar Graphs & Tabular Interpretation', 1),

  makeTopic('top-ga-14', 'subj-ga', null, 'Probability & Set Theory', 14),
  makeTopic('sub-ga-14-1', 'subj-ga', 'top-ga-14', 'Cards, Dices, Coins & Venn Diagrams Probability', 1),

  makeTopic('top-ga-15', 'subj-ga', null, 'Permutation & Combinations', 15, { star: true }),
  makeTopic('sub-ga-15-1', 'subj-ga', 'top-ga-15', 'Arrangements of Words with Repeating Letters', 1),

  makeTopic('top-ga-16', 'subj-ga', null, 'Calenders & Clocks', 16),
  makeTopic('sub-ga-16-1', 'subj-ga', 'top-ga-16', 'Odd Days, Leap Year Rule & Hand Overlap Angles', 1),

  makeTopic('top-ga-17', 'subj-ga', null, 'Number System (Aptitude)', 17),
  makeTopic('sub-ga-17-1', 'subj-ga', 'top-ga-17', 'Divisibility Rules, Unit Digits & Remainder Theorems', 1),

  makeTopic('top-ga-18', 'subj-ga', null, 'Blood Relations', 18),
  makeTopic('sub-ga-18-1', 'subj-ga', 'top-ga-18', 'Coded Blood Relations & Family Tree', 1),

  makeTopic('top-ga-19', 'subj-ga', null, 'Coding & Decoding', 19),
  makeTopic('sub-ga-19-1', 'subj-ga', 'top-ga-19', 'Pattern Shifting & Substitution Ciphers', 1),

  makeTopic('top-ga-20', 'subj-ga', null, 'Directions', 20),
  makeTopic('sub-ga-20-1', 'subj-ga', 'top-ga-20', 'Cardinal Turns, Pythagoras Distance & Shadow Position', 1),

  makeTopic('top-ga-21', 'subj-ga', null, 'Arrangements and Rankings', 21),
  makeTopic('sub-ga-21-1', 'subj-ga', 'top-ga-21', 'Linear Position from Left/Right & Circular Seating', 1),

  makeTopic('top-ga-22', 'subj-ga', null, 'Cubes & Dices', 22),
  makeTopic('sub-ga-22-1', 'subj-ga', 'top-ga-22', 'Opposite Faces of Folded Dice & Painted Cubes', 1),

  makeTopic('top-ga-23', 'subj-ga', null, 'Venn Digrams', 23),
  makeTopic('sub-ga-23-1', 'subj-ga', 'top-ga-23', 'Syllogisms & 3-Set Logic Puzzles', 1),

  makeTopic('top-ga-24', 'subj-ga', null, 'Paper Folding & Image Formations', 24),
  makeTopic('sub-ga-24-1', 'subj-ga', 'top-ga-24', 'Mirror Images, Water Images & Pattern Unfolding', 1),
];

export const INITIAL_SCHEDULES: Schedule[] = [
  {
    id: 'sched-today',
    Schedule_Date: new Date().toISOString().split('T')[0],
    Schedule_Hours: 4.5,
    Schedule_Subjects: ['subj-cn', 'subj-os', 'subj-algo'],
    Schedule_Tag_Filters: ['Require_Practice', 'Star'],
    Subject_Allocations: {
      'subj-cn': 60,
      'subj-os': 90,
      'subj-algo': 120,
    },
    Allocated_Topics: [
      {
        subject_id: 'subj-cn',
        subject_name: 'Computer Networks',
        topic_id: 'top-cn-1',
        topic_name: 'IPV4 Addressing',
        allocated_minutes: 60,
        completed: false,
      },
      {
        subject_id: 'subj-os',
        subject_name: 'Operating Systems',
        topic_id: 'top-os-3',
        topic_name: 'CPU Scheduling',
        allocated_minutes: 90,
        completed: false,
      },
      {
        subject_id: 'subj-algo',
        subject_name: 'Algorithms',
        topic_id: 'top-al-3',
        topic_name: 'Dynamic Programming',
        allocated_minutes: 120,
        completed: false,
      },
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];
