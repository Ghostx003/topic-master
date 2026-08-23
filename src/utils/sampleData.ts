import { Subject } from '../types/subject';
import { Topic } from '../types/topic';
import { Schedule } from '../types/schedule';

export const INITIAL_SUBJECTS: Subject[] = [
  {
    id: 'subj-ga',
    Subject_Name: 'General Aptitude',
    Subject_Importance: 'Urgent',
    Subject_Description: 'Quantitative arithmetic, logical reasoning syllogisms, spatial pattern folding, and English verbal grammar.',
    Subject_Color: '#eab308', // Yellow
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'subj-dm',
    Subject_Name: 'Discrete Mathematics',
    Subject_Importance: 'Urgent', // 390 Combined PYQs
    Subject_Description: 'Propositional & predicate logic, sets, relations, posets, combinatorics, graph theory, and recurrence relations.',
    Subject_Color: '#a855f7', // Purple
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 13).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'subj-algo',
    Subject_Name: 'Algorithms',
    Subject_Importance: 'Urgent',
    Subject_Description: 'Asymptotic notation, divide and conquer, greedy methods, dynamic programming, Dijkstra shortest paths, MST, and NP-completeness.',
    Subject_Color: '#14b8a6', // Teal
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'subj-os',
    Subject_Name: 'Operating Systems',
    Subject_Importance: 'Urgent',
    Subject_Description: 'Process lifecycle, CPU scheduling, synchronization semaphores, deadlock avoidance, paging memory management, and disk scheduling.',
    Subject_Color: '#8b5cf6', // Violet
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 11).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'subj-dl',
    Subject_Name: 'Digital Logic',
    Subject_Importance: 'High Scoring',
    Subject_Description: 'Boolean algebra, K-map minimization, multiplexers, adders, flip-flops, synchronous/asynchronous counters, and 2s complement systems.',
    Subject_Color: '#f59e0b', // Amber
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'subj-em',
    Subject_Name: 'Engineering Mathematics',
    Subject_Importance: 'Urgent', // 306 Combined PYQs
    Subject_Description: 'Linear algebra eigenvalues/vectors, matrix rank, calculus maxima/minima, and probability distributions Bayes theorem.',
    Subject_Color: '#0ea5e9', // Sky Blue
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'subj-dbms',
    Subject_Name: 'Database Management System',
    Subject_Importance: 'High Scoring',
    Subject_Description: 'ER modeling, relational algebra, SQL queries, functional dependencies, 3NF/BCNF normalization, ACID transactions, and B+ trees.',
    Subject_Color: '#f43f5e', // Rose
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'subj-toc',
    Subject_Name: 'Theory of Computation',
    Subject_Importance: 'High Scoring',
    Subject_Description: 'DFA/NFA minimization, regular expressions, context-free grammars, pushdown automata, Turing machines, and decidability reductions.',
    Subject_Color: '#ec4899', // Pink
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'subj-coa',
    Subject_Name: 'Computer Organisation & Architecture',
    Subject_Importance: 'Important',
    Subject_Description: 'Instruction formats, addressing modes, pipeline speedup & hazards, cache AMAT mapping, IEEE 754 floats, and DMA I/O transfers.',
    Subject_Color: '#84cc16', // Lime
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'subj-cd',
    Subject_Name: 'Compiler Design',
    Subject_Importance: 'Important',
    Subject_Description: 'Lexical analysis tokens, LL(1) and LR parsers, syntax-directed translation, three-address code, and basic block optimizations.',
    Subject_Color: '#6366f1', // Indigo
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'subj-ds',
    Subject_Name: 'Data Structures',
    Subject_Importance: 'High Scoring',
    Subject_Description: 'Arrays, linked lists, stacks, queues, binary trees, BST, AVL balance, binary heaps, graph representations, and hashing tables.',
    Subject_Color: '#10b981', // Emerald
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'subj-cn',
    Subject_Name: 'Computer Networks',
    Subject_Importance: 'Important',
    Subject_Description: 'OSI/TCP-IP models, IPv4/IPv6 addressing, subnetting, TCP flow/congestion control, routing algorithms, MAC protocols, and security.',
    Subject_Color: '#06b6d4', // Cyan
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'subj-prog',
    Subject_Name: 'C-Programming',
    Subject_Importance: 'High Scoring',
    Subject_Description: 'Operators precedence, control flow, functions, recursion call stacks, pointer arithmetic, dynamic memory, arrays, and structs.',
    Subject_Color: '#3b82f6', // Blue
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
  //    Organized into 5 official GATE syllabus chapters with subtopics
  // =========================================================================

  // --- Chapter 1: Machine Instructions, Addressing Modes & Instruction Formats ---
  makeTopic('coa-ch-inst', 'subj-coa', null, 'Machine Instructions, Addressing Modes & Instruction Formats', 'Machine instructions, opcode formats, expanding opcodes, addressing modes, instruction execution cycle, and RISC/CISC paradigms.', 1, true),
  makeTopic('coa-3', 'subj-coa', 'coa-ch-inst', 'Machine Instruction', 'Instruction execution cycles, opcode decoding, and register transfer operations.', 1, true),
  makeTopic('coa-4', 'subj-coa', 'coa-ch-inst', 'Addressing Modes', 'Immediate, Direct, Indirect, Indexed, Base Register, and PC-Relative effective address calculations.', 2, true),
  makeTopic('coa-6', 'subj-coa', 'coa-ch-inst', 'Instruction Format', '0, 1, 2, 3 address instruction formats, expanding opcodes, register and address bit constraints.', 3, true),
  makeTopic('coa-sub-exec', 'subj-coa', 'coa-ch-inst', 'Instruction Execution', 'Instruction fetch, decode, operand fetch, execute, and write-back phases, PC updates.', 4, true),
  makeTopic('coa-sub-risc', 'subj-coa', 'coa-ch-inst', 'CISC RISC Architecture', 'Complex vs Reduced Instruction Set Computer architectures, load-store vs register-memory ISA.', 5, true),
  makeTopic('coa-sub-isa', 'subj-coa', 'coa-ch-inst', 'Instruction Set Architecture', 'ISA specifications, programmer visible registers, condition codes, instruction semantics.', 6, true),

  // --- Chapter 2: CPU Control Unit, Data Path & Microprogramming ---
  makeTopic('coa-ch-cpu', 'subj-coa', null, 'CPU Control Unit, Data Path & Microprogramming', 'Hardwired vs microprogrammed control unit, horizontal and vertical microprogramming, ALU and datapath design.', 2, true),
  makeTopic('coa-5', 'subj-coa', 'coa-ch-cpu', 'Microprogramming', 'Horizontal vs vertical microinstructions, control store addressing, micro-program sequencing.', 1, true),
  makeTopic('coa-10', 'subj-coa', 'coa-ch-cpu', 'Data Path', 'Single-cycle and multi-cycle datapath, ALU control signals, internal bus architectures.', 2, true),
  makeTopic('coa-sub-runtime', 'subj-coa', 'coa-ch-cpu', 'Runtime Environment', 'Hardware runtime stack, frame pointer, stack pointer, return address register management.', 3, true),
  makeTopic('coa-sub-ctrl', 'subj-coa', 'coa-ch-cpu', 'Control Unit', 'Hardwired control unit state machine, timing signals generation, ring counters and decoders.', 4, true),
  makeTopic('coa-sub-bitvec', 'subj-coa', 'coa-ch-cpu', 'Bit Vector', 'Bit vector masking, flag register conditions (zero, carry, overflow, sign).', 5, true, 1),

  // --- Chapter 3: Instruction Pipelining & Hazards ---
  makeTopic('coa-ch-pipe', 'subj-coa', null, 'Instruction Pipelining & Hazards', 'Pipelined execution, speedup, structural, data (RAW/WAR/WAW) and control hazards, forwarding, and branch stalls.', 3, true),
  makeTopic('coa-2', 'subj-coa', 'coa-ch-pipe', 'Pipelining', 'Instruction pipelining stages, throughput, pipeline register latency, ideal CPI.', 1, true),
  makeTopic('coa-sub-speedup', 'subj-coa', 'coa-ch-pipe', 'Speedup', 'Pipeline speedup S = (n*k)/(k+n-1+stalls), efficiency, throughput formulas.', 2, true, 6),
  makeTopic('coa-sub-datadep', 'subj-coa', 'coa-ch-pipe', 'Data Dependency', 'Read-After-Write (RAW), Write-After-Read (WAR), Write-After-Write (WAW) dependencies.', 3, true, 4),
  makeTopic('coa-sub-datahaz', 'subj-coa', 'coa-ch-pipe', 'Data Hazards', 'Resolving data hazards via operand forwarding/bypassing paths without stalls.', 4, true),
  makeTopic('coa-sub-hazards', 'subj-coa', 'coa-ch-pipe', 'Hazards', 'Classifying structural resource conflicts, data dependencies, and branch control hazards.', 5, true),
  makeTopic('coa-sub-stall', 'subj-coa', 'coa-ch-pipe', 'Stall', 'Pipeline bubbles, calculating penalty clock cycles due to memory delays and branch penalties.', 6, true),

  // --- Chapter 4: Memory Hierarchy (Cache Mapping, AMAT & Main Memory) ---
  makeTopic('coa-ch-mem', 'subj-coa', null, 'Memory Hierarchy (Cache Mapping, AMAT & Main Memory)', 'Cache direct/set-associative/fully-associative mapping, replacement policies, write policies, AMAT, and DRAM.', 4, true),
  makeTopic('coa-1', 'subj-coa', 'coa-ch-mem', 'Cache Memory', 'Direct, Set-Associative, Fully Associative mapping, tag/set/offset bits, Write-Through vs Write-Back.', 1, true),
  makeTopic('coa-sub-mem-int', 'subj-coa', 'coa-ch-mem', 'Memory Interfacing', 'Address decoding logic, chip select generation, memory capacity expansion (word/length).', 2, true, 6),
  makeTopic('coa-sub-dir-map', 'subj-coa', 'coa-ch-mem', 'Direct Mapping', 'Direct mapped cache tag and line index partitioning, memory block modulo mapping.', 3, true),
  makeTopic('coa-sub-amat', 'subj-coa', 'coa-ch-mem', 'Average Memory Access Time', 'AMAT = H1*T1 + (1-H1)*(H2*T2 + (1-H2)*Tm) hierarchical access calculations.', 4, true, 3),
  makeTopic('coa-sub-vmem', 'subj-coa', 'coa-ch-mem', 'Virtual Memory', 'Virtual to physical address translation, Page tables, TLB hits and misses in memory access.', 5, true),
  makeTopic('coa-sub-conf-miss', 'subj-coa', 'coa-ch-mem', 'Conflict Misses', 'Compulsory (cold), Capacity, and Conflict cache misses analysis.', 6, true, 1),
  makeTopic('coa-sub-dram', 'subj-coa', 'coa-ch-mem', 'DRAM', 'Dynamic RAM refresh overhead, RAS/CAS row-column multiplexed addressing.', 7, true),

  // --- Chapter 5: I/O Organization (Interrupts, DMA & I/O Handling) ---
  makeTopic('coa-ch-io', 'subj-coa', null, 'I/O Organization (Interrupts, DMA & I/O Handling)', 'Programmed I/O, interrupt-driven I/O, vectored interrupts, DMA controller, and cycle stealing modes.', 5, true),
  makeTopic('coa-7', 'subj-coa', 'coa-ch-io', 'Interrupts', 'Vectored vs non-vectored interrupts, interrupt latency, priority interrupt controllers.', 1, true),
  makeTopic('coa-8', 'subj-coa', 'coa-ch-io', 'DMA', 'DMA controller architecture, cycle stealing mode vs burst mode data transfer bandwidth.', 2, true),
  makeTopic('coa-9', 'subj-coa', 'coa-ch-io', 'IO Handling', 'Programmed I/O, interrupt-driven I/O, memory-mapped I/O vs I/O-mapped I/O.', 3, true),
  makeTopic('coa-sub-disk', 'subj-coa', 'coa-ch-io', 'Disk', 'Magnetic disk structure, track/sector layout, seek time and rotational latency in I/O transfers.', 4, true),

  // =========================================================================
  // 2. COMPUTER NETWORKS (subj-cn) - 226 Total PYQs
  //    Organized into 5 official GATE syllabus chapters with subtopics
  // =========================================================================

  // --- Chapter 1: Data Link Layer & Flow/Error Control ---
  makeTopic('cn-ch-dll', 'subj-cn', null, 'Data Link Layer & Flow/Error Control', 'Layering concepts, OSI & TCP/IP models, framing, bit stuffing, CRC polynomials, Hamming code, error detection, Stop-and-Wait, and sliding window protocols.', 1, true),
  makeTopic('cn-3', 'subj-cn', 'cn-ch-dll', 'Sliding Window', 'Stop-and-Wait, Go-Back-N, Selective Repeat efficiency formulas eta = 1/(1+2a) and window sizing.', 1, true, 16),
  makeTopic('cn-10', 'subj-cn', 'cn-ch-dll', 'Error Detection', 'Cyclic Redundancy Check modulo-2 polynomial division, parity checks, Hamming distance.', 2, true),
  makeTopic('cn-sub-sw', 'subj-cn', 'cn-ch-dll', 'Stop and Wait', 'Stop and wait flow control efficiency eta = 1/(1+2a), optimal frame length and timeout calculations.', 3, true, 6),
  makeTopic('cn-sub-crc', 'subj-cn', 'cn-ch-dll', 'CRC Polynomial', 'Cyclic Redundancy Check modulo-2 polynomial division, generator polynomials G(x), remainder bits.', 4, true, 5),
  makeTopic('cn-sub-comm', 'subj-cn', 'cn-ch-dll', 'Communication', 'Data transmission fundamentals, simplex, half-duplex, full-duplex communication channels.', 5, true),
  makeTopic('cn-sub-netflow', 'subj-cn', 'cn-ch-dll', 'Network Flow', 'Network throughput, bottleneck link bandwidth, end-to-end delay and bandwidth-delay product.', 6, true),
  makeTopic('cn-sub-bitstuff', 'subj-cn', 'cn-ch-dll', 'Bit Stuffing', 'HDLC/SDLC framing, zero-bit insertion after five consecutive 1s (01111110 flag pattern).', 7, true, 2),
  makeTopic('cn-sub-hamming', 'subj-cn', 'cn-ch-dll', 'Hamming Code', 'Hamming code parity bit positions, minimum Hamming distance d_min to detect/correct bit errors.', 8, true),
  makeTopic('cn-sub-chan-util', 'subj-cn', 'cn-ch-dll', 'Channel Utilization', 'Channel utilization efficiency, propagation delay vs transmission time ratios.', 9, true),
  makeTopic('cn-sub-datacomm', 'subj-cn', 'cn-ch-dll', 'Data Communication', 'Data communication basics, baud rate vs bit rate, Nyquist and Shannon channel capacity.', 10, true),
  makeTopic('cn-sub-osi', 'subj-cn', 'cn-ch-dll', 'OSI Model', '7-layer OSI reference model, layer encapsulation, protocol data unit (PDU) conversions.', 11, true, 1),
  makeTopic('cn-sub-prob', 'subj-cn', 'cn-ch-dll', 'Probability', 'Packet error probability, bit error rate (BER), geometric distribution in frame retransmissions.', 12, true, 1),

  // --- Chapter 2: Medium Access Control & LAN Technologies ---
  makeTopic('cn-ch-mac', 'subj-cn', null, 'Medium Access Control & LAN Technologies', 'Multiple access protocols, Pure & Slotted ALOHA, CSMA/CD minimum frame size, Ethernet IEEE 802.3, LAN bridges, and switching.', 2, true),
  makeTopic('cn-sub-ethernet', 'subj-cn', 'cn-ch-mac', 'Ethernet', 'IEEE 802.3 Ethernet frame structure, preamble, MAC address format, 10Mbps/100Mbps Ethernet rules.', 1, true),
  makeTopic('cn-sub-lan', 'subj-cn', 'cn-ch-mac', 'LAN Technologies', 'Local Area Network topologies, Token Ring IEEE 802.5 token passing, FDDI, wireless LAN.', 2, true),
  makeTopic('cn-sub-csmacd', 'subj-cn', 'cn-ch-mac', 'CSMA CD', 'CSMA/CD protocol, minimum frame length condition L >= 2*Tp*Bandwidth, exponential backoff.', 3, true),
  makeTopic('cn-12', 'subj-cn', 'cn-ch-mac', 'MAC Protocol', 'Medium Access Control protocols, static channelization (FDMA/TDMA/CDMA) vs dynamic MAC protocols.', 4, true, 4),
  makeTopic('cn-sub-switch', 'subj-cn', 'cn-ch-mac', 'Network Switching', 'Packet switching (datagram vs virtual circuit), circuit switching, message switching latency.', 5, true, 4),
  makeTopic('cn-sub-bridges', 'subj-cn', 'cn-ch-mac', 'Bridges', 'Transparent learning bridges, MAC address learning table, spanning tree protocol (STP) in LANs.', 6, true, 3),
  makeTopic('cn-sub-pure-aloha', 'subj-cn', 'cn-ch-mac', 'Pure Aloha', 'Pure ALOHA throughput S = G * e^(-2G), maximum efficiency 18.4% at G = 0.5.', 7, true, 1),
  makeTopic('cn-sub-slot-aloha', 'subj-cn', 'cn-ch-mac', 'Slotted Aloha', 'Slotted ALOHA throughput S = G * e^(-G), maximum efficiency 36.8% at G = 1.', 8, true, 1),

  // --- Chapter 3: Network Layer (IP Addressing, Subnetting & Routing) ---
  makeTopic('cn-ch-net', 'subj-cn', null, 'Network Layer (IP Addressing, Subnetting & Routing)', 'IPv4/IPv6 addressing, CIDR subnetting, VLSM, IP packet header, fragmentation, distance vector, link state, and ARP/ICMP.', 3, true),
  makeTopic('cn-1', 'subj-cn', 'cn-ch-net', 'Subnetting', 'Classless Inter-Domain Routing (CIDR), prefix matching, subnet mask calculation, and VLSM.', 1, true, 21),
  makeTopic('cn-4', 'subj-cn', 'cn-ch-net', 'Routing', 'Routing algorithms, Dijkstra link-state (OSPF), hierarchical routing, autonomous systems.', 2, true, 14),
  makeTopic('cn-6', 'subj-cn', 'cn-ch-net', 'IP Packet', 'IPv4 header fields, TTL expiry, Total Length, and packet fragmentation offset arithmetic.', 3, true),
  makeTopic('cn-7', 'subj-cn', 'cn-ch-net', 'Network Protocols', 'Core network layer protocols, ARP, ICMP error reporting, NAT translation, IPv6 headers.', 4, true),
  makeTopic('cn-9', 'subj-cn', 'cn-ch-net', 'Distance Vector Routing', 'Bellman-Ford vector updates, Count-to-Infinity problem, split horizon and poison reverse.', 5, true),
  makeTopic('cn-11', 'subj-cn', 'cn-ch-net', 'IP Addressing', 'Classful IPv4 addressing boundaries, special IP ranges, loopback, private IP blocks.', 6, true),
  makeTopic('cn-sub-netlayer', 'subj-cn', 'cn-ch-net', 'Network Layer', 'Network layer packet forwarding, routing table construction, datagram subnet delivery.', 7, true),
  makeTopic('cn-sub-frag', 'subj-cn', 'cn-ch-net', 'Fragmentation', 'IPv4 packet fragmentation offset, MTU boundary slicing, More Fragments (MF) and DF flags.', 8, true, 5),
  makeTopic('cn-sub-arp', 'subj-cn', 'cn-ch-net', 'ARP', 'Address Resolution Protocol (ARP), broadcast request and unicast reply, ARP cache poisoning.', 9, true, 1),
  makeTopic('cn-sub-icmp', 'subj-cn', 'cn-ch-net', 'ICMP', 'Internet Control Message Protocol, Destination Unreachable, Time Exceeded (TTL 0), Echo Ping.', 10, true, 1),
  makeTopic('cn-sub-rout-proto', 'subj-cn', 'cn-ch-net', 'Routing Protocols', 'Interior vs exterior routing protocols: RIP (hop count limit 15), OSPF, BGP path vector.', 11, true, 1),

  // --- Chapter 4: Transport Layer (TCP, UDP & Congestion Control) ---
  makeTopic('cn-ch-trans', 'subj-cn', null, 'Transport Layer (TCP, UDP & Congestion Control)', 'Port multiplexing, sockets, UDP connectionless datagrams, TCP 3-way handshake, flow control, AIMD congestion control, and token bucket.', 4, true),
  makeTopic('cn-2', 'subj-cn', 'cn-ch-trans', 'TCP', '3-way handshake connection setup/teardown, sequence/ACK numbering, TCP flags and header fields.', 1, true),
  makeTopic('cn-8', 'subj-cn', 'cn-ch-trans', 'Congestion Control', 'TCP Slow Start, Congestion Avoidance AIMD, Fast Retransmit, Fast Recovery, and threshold halving.', 2, true),
  makeTopic('cn-sub-sockets', 'subj-cn', 'cn-ch-trans', 'Sockets', 'Socket programming API, socket address binding IP:Port, TCP stream vs UDP datagram sockets.', 3, true),
  makeTopic('cn-sub-udp', 'subj-cn', 'cn-ch-trans', 'UDP', 'User Datagram Protocol header format, checksum, connectionless and unreliable service model.', 4, true),
  makeTopic('cn-sub-token-bkt', 'subj-cn', 'cn-ch-trans', 'Token Bucket', 'Traffic shaping and policing, Token Bucket capacity and token rate, Leaky Bucket queue.', 5, true),
  makeTopic('cn-sub-wrap-time', 'subj-cn', 'cn-ch-trans', 'Wrap Around Time', 'TCP 32-bit sequence number space wrap around time calculation at varying bandwidth speeds.', 6, true),

  // --- Chapter 5: Application Layer Protocols ---
  makeTopic('cn-ch-app', 'subj-cn', null, 'Application Layer Protocols', 'Domain Name System (DNS), HTTP, HTTPS, SMTP, POP3, IMAP, FTP, and DHCP protocols.', 5, true),
  makeTopic('cn-5', 'subj-cn', 'cn-ch-app', 'Application Layer Protocols', 'DNS iterative/recursive resolution, HTTP/1.1 persistent connections, SMTP, FTP, DHCP.', 1, true),

  // =========================================================================
  // 3. DATABASE MANAGEMENT SYSTEM (subj-dbms) - 302 Total PYQs
  //    Organized into 6 GATE syllabus chapters with subtopics
  // =========================================================================

  // --- Chapter 1: ER-Model & Relational Model ---
  makeTopic('db-ch-er', 'subj-dbms', null, 'ER-Model & Relational Model', 'Entity-Relationship model, cardinality ratios, participation, relational database schema, integrity constraints, and foreign keys.', 1, true),
  makeTopic('db-9', 'subj-dbms', 'db-ch-er', 'ER Diagram', 'Entity-Relationship models, entity sets, weak entity sets, cardinality ratios, participation constraints, mapping ER to relational tables.', 1, true),
  makeTopic('db-sub-ref-int', 'subj-dbms', 'db-ch-er', 'Referential Integrity', 'Foreign key constraints, ON DELETE / ON UPDATE CASCADE / SET NULL / RESTRICT semantics.', 2, true),
  makeTopic('db-sub-rel-mod', 'subj-dbms', 'db-ch-er', 'Relational Model', 'Relational database schema, domain constraints, key constraints, primary key rules, relational instances.', 3, true),
  makeTopic('db-sub-db-design', 'subj-dbms', 'db-ch-er', 'Database Design', 'Conceptual, logical, and physical database design lifecycle, mapping constraints.', 4, true),
  makeTopic('db-sub-db-schema', 'subj-dbms', 'db-ch-er', 'Database Schema', 'Relational schema definitions, attribute domains, table schemas, DDL schemas.', 5, true),

  // --- Chapter 2: Relational Algebra & Relational Calculus ---
  makeTopic('db-ch-relalg', 'subj-dbms', null, 'Relational Algebra & Relational Calculus', 'Selection, projection, joins, division, Tuple Relational Calculus (TRC), Domain Relational Calculus (DRC), and safe queries.', 2, true),
  makeTopic('db-3', 'subj-dbms', 'db-ch-relalg', 'Relational Algebra', 'Selection sigma, Projection pi, Cartesian product x, Joins (Theta, Natural, Outer), and Relational Division.', 1, true, 33),
  makeTopic('db-7', 'subj-dbms', 'db-ch-relalg', 'Relational Calculus', 'Tuple Relational Calculus (TRC), Domain Relational Calculus (DRC), quantifiers, and expressive completeness.', 2, true, 13),
  makeTopic('db-sub-nat-join', 'subj-dbms', 'db-ch-relalg', 'Natural Join', 'Natural join condition R * S, common attribute equality filtering, join output tuple cardinality bounds.', 3, true),
  makeTopic('db-sub-trc', 'subj-dbms', 'db-ch-relalg', 'Tuple Relational Calculus', 'Tuple variable expressions { t | P(t) }, existential (exists) and universal (forall) quantifier queries.', 4, true, 3),
  makeTopic('db-sub-safe-q', 'subj-dbms', 'db-ch-relalg', 'Safe Query', 'Safety conditions for relational calculus, domain-independent safe queries.', 5, true),

  // --- Chapter 3: Structured Query Language (SQL) ---
  makeTopic('db-ch-sql', 'subj-dbms', null, 'Structured Query Language (SQL)', 'SQL DDL, DML, DQL (SELECT, FROM, WHERE, GROUP BY, HAVING), nested queries, correlated subqueries, and SQL joins.', 3, true),
  makeTopic('db-1', 'subj-dbms', 'db-ch-sql', 'SQL', 'SELECT clauses, GROUP BY, HAVING, nested correlated subqueries, EXISTS / NOT EXISTS, and NULL 3-valued logic.', 1, true),
  makeTopic('db-11', 'subj-dbms', 'db-ch-sql', 'Joins', 'INNER JOIN, LEFT / RIGHT / FULL OUTER JOIN, CROSS JOIN, multiple table join execution and truth table semantics.', 2, true),
  makeTopic('db-sub-query', 'subj-dbms', 'db-ch-sql', 'Query', 'Complex SQL query formulation, aggregate functions (COUNT, SUM, AVG, MIN, MAX), and HAVING conditions.', 3, true, 3),

  // --- Chapter 4: Database Design & Normalization ---
  makeTopic('db-ch-norm', 'subj-dbms', null, 'Database Design & Normalization', 'Functional dependencies, attribute closure, Armstrong axioms, minimal cover, 1NF, 2NF, 3NF, BCNF, 4NF, and lossless decomposition.', 4, true),
  makeTopic('db-2', 'subj-dbms', 'db-ch-norm', 'Database Normalization', '1NF, 2NF, 3NF, BCNF, Functional Dependencies, Canonical Minimal Cover, Lossless Join decomposition.', 1, true),
  makeTopic('db-10', 'subj-dbms', 'db-ch-norm', 'Candidate Key', 'Attribute closure X+ algorithms, finding all minimal candidate keys and superkeys.', 2, true),
  makeTopic('db-sub-fd', 'subj-dbms', 'db-ch-norm', 'Functional Dependency', 'Functional dependency X -> Y definitions, trivial vs non-trivial FDs, canonical minimal cover algorithms.', 3, true),
  makeTopic('db-sub-armstrong', 'subj-dbms', 'db-ch-norm', 'Armstrong Axioms', 'Inference rules for functional dependencies: Reflexivity, Augmentation, Transitivity, Union, Decomposition, Pseudo-transitivity.', 4, true),
  makeTopic('db-sub-decomp', 'subj-dbms', 'db-ch-norm', 'Decomposition', 'Lossless join decomposition test R1 cap R2 -> (R1 - R2), and dependency preservation testing.', 5, true, 1),
  makeTopic('db-sub-4nf', 'subj-dbms', 'db-ch-norm', 'Multivalued Dependency 4NF', 'Multivalued dependencies X ->> Y, Fourth Normal Form (4NF) validation and decomposition.', 6, true, 1),
  makeTopic('db-sub-norm-forms', 'subj-dbms', 'db-ch-norm', 'Normal Forms', 'Identifying highest normal form: 1NF (atomic values), 2NF (no partial dependency), 3NF (no transitive dependency), BCNF (LHS is superkey).', 7, true, 1),
  makeTopic('db-sub-superkey', 'subj-dbms', 'db-ch-norm', 'Super Key', 'Superkey definitions, counting total number of possible superkeys given candidate keys.', 8, true),

  // --- Chapter 5: Transactions & Concurrency Control ---
  makeTopic('db-ch-trans', 'subj-dbms', null, 'Transactions & Concurrency Control', 'ACID properties, serializability, conflict & view serializability, precedence graphs, 2PL, timestamp ordering, and recovery.', 5, true),
  makeTopic('db-5', 'subj-dbms', 'db-ch-trans', 'Transaction and Concurrency', 'ACID properties, Serializability schedules, View Serializability, Recoverable and Cascadeless schedules, 2PL.', 1, true),
  makeTopic('db-8', 'subj-dbms', 'db-ch-trans', 'Conflict Serializable', 'Conflict operations (R-W, W-R, W-W), Precedence Graphs cycle detection, equivalent serial order.', 2, true, 12),
  makeTopic('db-sub-ts', 'subj-dbms', 'db-ch-trans', 'Timestamp Ordering', 'Timestamp ordering protocol, Read_TS and Write_TS validation, Thomas Write Rule.', 3, true),
  makeTopic('db-sub-2pl', 'subj-dbms', 'db-ch-trans', 'Two Phase Locking Protocol', 'Two-Phase Locking (2PL), Growing Phase, Shrinking Phase, Basic 2PL vs Strict 2PL vs Rigorous 2PL.', 4, true, 1),

  // --- Chapter 6: File Organization, Indexing & B/B+ Trees ---
  makeTopic('db-ch-index', 'subj-dbms', null, 'File Organization, Indexing & B/B+ Trees', 'Primary, secondary, clustered, dense/sparse indexing, B-Tree and B+ Tree node order, capacity, and block access calculations.', 6, true),
  makeTopic('db-4', 'subj-dbms', 'db-ch-index', 'B Tree', 'B/B+ Tree order p, maximum/minimum key bounds, node splits on insertion, disk block I/O calculations.', 1, true),
  makeTopic('db-6', 'subj-dbms', 'db-ch-index', 'Indexing', 'Primary, Secondary, Clustered, and Dense vs Sparse index structures and block access costs.', 2, true),

  // =========================================================================
  // 4. DIGITAL LOGIC (subj-dl) - 313 Total PYQs
  //    Organized into 5 GATE syllabus chapters with subtopics
  // =========================================================================

  // --- Chapter 1: Number Representation & Computer Arithmetic ---
  makeTopic('dl-ch-num', 'subj-dl', null, 'Number Representation & Computer Arithmetic', 'Signed magnitude, 1s/2s complement, overflow, Booth algorithm, and IEEE 754 floating point standard.', 1, true),
  makeTopic('dl-1', 'subj-dl', 'dl-ch-num', 'Number Representation', 'Signed magnitude, 1s complement, 2s complement arithmetic, range formulas, and overflow detection.', 1, true),
  makeTopic('dl-7', 'subj-dl', 'dl-ch-num', 'IEEE 754 Floating Point Representation', 'IEEE 754 Floating Point Standard (32-bit single precision, 64-bit double precision, exponent bias, normalized values).', 2, true, 14),
  makeTopic('dl-sub-fp-rep', 'subj-dl', 'dl-ch-num', 'Floating Point Representation', 'Floating point conversion, normalized mantissa, bias excess-127 representation.', 3, true),
  makeTopic('dl-sub-booth', 'subj-dl', 'dl-ch-num', 'Booths Algorithm', 'Booth multiplication algorithm for signed 2s complement numbers, recoding tables, cycle counts.', 4, true),
  makeTopic('dl-sub-fixed', 'subj-dl', 'dl-ch-num', 'Fixed Point Representation', 'Fixed-point integer and fractional representation, resolution, dynamic range and quantization error.', 5, true),
  makeTopic('dl-sub-array-mult', 'subj-dl', 'dl-ch-num', 'Array Multiplier', 'Combinational array multiplier architecture, full adder cell matrix, worst-case propagation delay.', 6, true),
  makeTopic('dl-sub-bin-codes', 'subj-dl', 'dl-ch-num', 'Binary Codes', 'BCD (8421), Gray Code (reflected binary), Excess-3, self-complementing codes, and parity bit codes.', 7, true, 1),
  makeTopic('dl-sub-num-sys', 'subj-dl', 'dl-ch-num', 'Number System', 'Base-r conversion (binary, octal, hex, arbitrary radix), fractional base conversions.', 8, true, 1),
  makeTopic('dl-sub-endian', 'subj-dl', 'dl-ch-num', 'Little Endian Big Endian', 'Byte ordering in memory: Big-Endian (MSB at lowest address) vs Little-Endian (LSB at lowest address).', 9, true, 1),

  // --- Chapter 2: Boolean Algebra & Logic Gates ---
  makeTopic('dl-ch-bool', 'subj-dl', null, 'Boolean Algebra & Logic Gates', 'Logic gates, Boolean algebra theorems, consensus theorem, circuit delays, and glitch hazards.', 2, true),
  makeTopic('dl-2', 'subj-dl', 'dl-ch-bool', 'Circuit Output Analysis', 'Tracing outputs of combinational and sequential gate circuits, propagation delays, glitch hazards.', 1, true),
  makeTopic('dl-3', 'subj-dl', 'dl-ch-bool', 'Boolean Algebra', 'Boolean theorems, De Morgan laws, Consensus theorem, Duality, and Boolean function simplifications.', 2, true),
  makeTopic('dl-sub-dig-circ', 'subj-dl', 'dl-ch-bool', 'Digital Circuits', 'Multi-level gate networks, propagation delay analysis, fan-in/fan-out, power dissipation.', 3, true),
  makeTopic('dl-sub-func-comp', 'subj-dl', 'dl-ch-bool', 'Functional Completeness', 'Universal gate sets (NAND, NOR, {AND, NOT}, {OR, NOT}, {MUX, constants}), completeness proofs.', 4, true, 7),
  makeTopic('dl-sub-min-gates', 'subj-dl', 'dl-ch-bool', 'Min No Gates', 'Finding minimum number of 2-input NAND / NOR gates to implement Boolean functions.', 5, true),
  makeTopic('dl-sub-dual', 'subj-dl', 'dl-ch-bool', 'Dual Function', 'Duality principle, self-dual Boolean functions, properties and self-dual counting 2^(2^(n-1)).', 6, true, 1),
  makeTopic('dl-sub-hazard', 'subj-dl', 'dl-ch-bool', 'Static Hazard', 'Static-0 and Static-1 hazards detection in 2-level SOP/POS circuits, hazard-free covers with consensus terms.', 7, true),

  // --- Chapter 3: Combinational Logic Optimization ---
  makeTopic('dl-ch-opt', 'subj-dl', null, 'Combinational Logic Optimization', 'K-map minimization, essential prime implicants, minimal SOP/POS forms, and canonical minterms.', 3, true),
  makeTopic('dl-5', 'subj-dl', 'dl-ch-opt', 'K-Map Minimization', 'Karnaugh Map grouping, Essential Prime Implicants, Prime Implicants, and Don\'t Care minimization.', 1, true),
  makeTopic('dl-6', 'subj-dl', 'dl-ch-opt', 'Min Sum of Products Form (SOP)', 'Minimal Sum-of-Products (SOP) expressions, standard vs canonical forms.', 2, true, 16),
  makeTopic('dl-9', 'subj-dl', 'dl-ch-opt', 'Canonical Normal Form', 'Minterms (m-notation) and Maxterms (M-notation), converting non-canonical expressions to canonical.', 3, true, 10),
  makeTopic('dl-sub-pos', 'subj-dl', 'dl-ch-opt', 'Min Products of Sum Form', 'Minimal Product-of-Sums (POS) expressions, maxterm groupings, dual K-map minimization.', 4, true, 2),
  makeTopic('dl-sub-pi', 'subj-dl', 'dl-ch-opt', 'Prime Implicants', 'Finding all Prime Implicants (PI), Essential Prime Implicants (EPI), and redundant implicants.', 5, true, 2),
  makeTopic('dl-sub-cnf', 'subj-dl', 'dl-ch-opt', 'Conjunctive Normal Form', 'Conjunctive Normal Form (CNF) boolean clause structure, product of maxterms conversion.', 6, true, 1),

  // --- Chapter 4: Combinational Circuit Design ---
  makeTopic('dl-ch-circ', 'subj-dl', null, 'Combinational Circuit Design', 'Multiplexers, adders, subtractors, decoders, encoders, memory interfacing, and ROM/PLA.', 4, true),
  makeTopic('dl-8', 'subj-dl', 'dl-ch-circ', 'Multiplexer', 'Implementing Boolean logic functions using 2:1, 4:1, 8:1 Multiplexers and Multiplexer tree expansion.', 1, true),
  makeTopic('dl-10', 'subj-dl', 'dl-ch-circ', 'Adder & Subtractor Circuits', 'Half Adder, Full Adder, Ripple Carry Adder delay, Carry Look-Ahead Adder generation logic.', 2, true),
  makeTopic('dl-sub-mem-int', 'subj-dl', 'dl-ch-circ', 'Memory Interfacing', 'Address bus decoding, Chip Select (CS) logic, RAM/ROM memory module capacity expansion.', 3, true, 5),
  makeTopic('dl-sub-rom', 'subj-dl', 'dl-ch-circ', 'ROM', 'Read Only Memory (ROM) architecture, Programmable Logic Arrays (PLA), Programmable Array Logic (PAL).', 4, true, 4),
  makeTopic('dl-sub-dec', 'subj-dl', 'dl-ch-circ', 'Decoder', 'Binary decoders with enable lines, 2-to-4, 3-to-8 decoder expansion, implementing logic with decoders.', 5, true),
  makeTopic('dl-sub-carry', 'subj-dl', 'dl-ch-circ', 'Carry Generator', 'Carry Generate (G = A*B) and Carry Propagate (P = A XOR B) look-ahead logic equations and delay.', 6, true, 2),
  makeTopic('dl-sub-comb-circ', 'subj-dl', 'dl-ch-circ', 'Combinational Circuit', 'Multi-level combinational circuit analysis, propagation delay path, glitch-free design.', 7, true),

  // --- Chapter 5: Sequential Circuits & Memory ---
  makeTopic('dl-ch-seq', 'subj-dl', null, 'Sequential Circuits & Memory', 'Flip-flops, synchronous & ripple counters, finite state machines, and shift registers.', 5, true),
  makeTopic('dl-4', 'subj-dl', 'dl-ch-seq', 'Digital Counter', 'Synchronous and Asynchronous (Ripple) counters, Mod-N counters, Up/Down counters, ring & Johnson counters.', 1, true, 18),
  makeTopic('dl-11', 'subj-dl', 'dl-ch-seq', 'Flip-Flops & Timing', 'SR, JK, D, T Flip-Flops, race-around condition, Setup and Hold time constraints for max clock frequency.', 2, true),
  makeTopic('dl-sub-ff', 'subj-dl', 'dl-ch-seq', 'Flip Flop', 'Flip-flop excitation tables, characteristic equations, flip-flop conversions (JK to D, T to JK).', 3, true, 7),
  makeTopic('dl-sub-fsm', 'subj-dl', 'dl-ch-seq', 'Finite State Machines', 'Mealy vs Moore synchronous sequential machine modeling, state diagrams, state tables, and state equations.', 4, true),
  makeTopic('dl-sub-sync-async', 'subj-dl', 'dl-ch-seq', 'Synchronous Asynchronous Circuits', 'Clock skew, setup/hold violations, asynchronous ripple state transitions, lockup latches.', 5, true),
  makeTopic('dl-sub-shift', 'subj-dl', 'dl-ch-seq', 'Shift Registers', 'SISO, SIPO, PISO, PIPO shift registers, bidirectional shift registers, and universal shift register design.', 6, true),
  makeTopic('dl-sub-ripple', 'subj-dl', 'dl-ch-seq', 'Ripple Counter Operation', 'Asynchronous ripple counter cumulative propagation delay t_total = n * t_pd, max clock frequency.', 7, true),
  makeTopic('dl-sub-reduction', 'subj-dl', 'dl-ch-seq', 'Reduction', 'State reduction using partitioning and implication tables, eliminating redundant sequential states.', 8, true),

  // =========================================================================
  // 5. OPERATING SYSTEM (subj-os) - 343 Total PYQs
  //    Organized into 6 GATE syllabus chapters with subtopics
  // =========================================================================

  // --- Chapter 1: Processes, Threads & System Calls ---
  makeTopic('os-ch-proc', 'subj-os', null, 'Processes, Threads & System Calls', 'Process states, PCB, user/kernel threads, fork/exec system calls, context switching, and IPC.', 1, true),
  makeTopic('os-9', 'subj-os', 'os-ch-proc', 'Threads', 'User-level threads vs Kernel-level threads, multithreading models, thread control blocks.', 1, true),
  makeTopic('os-sub-fork', 'subj-os', 'os-ch-proc', 'Fork System Call', 'fork() process creation tree calculations, return value 0/PID, parent-child processes.', 2, true, 8),
  makeTopic('os-sub-proc', 'subj-os', 'os-ch-proc', 'Process', '5-state process model (New, Ready, Running, Waiting, Terminated), Process Control Block (PCB).', 3, true, 5),
  makeTopic('os-sub-context', 'subj-os', 'os-ch-proc', 'Context Switch', 'CPU register saving, state restoration, dispatcher latency, preemptive vs non-preemptive switching.', 4, true),
  makeTopic('os-sub-protect', 'subj-os', 'os-ch-proc', 'OS Protection', 'User mode vs Kernel mode, privileged instructions, dual-mode operation, memory protection.', 5, true),
  makeTopic('os-sub-ipc', 'subj-os', 'os-ch-proc', 'Inter Process Communication', 'Shared memory architecture, message passing queues, socket communication, pipes.', 6, true),
  makeTopic('os-sub-syscall', 'subj-os', 'os-ch-proc', 'System Calls', 'System call interface, trap instructions, standard system calls exec(), wait(), exit().', 7, true, 1),

  // --- Chapter 2: CPU Scheduling ---
  makeTopic('os-ch-sched', 'subj-os', null, 'CPU Scheduling', 'Scheduling algorithms FCFS, SJF, SRTF, Round Robin, priority scheduling, and multi-level queues.', 2, true),
  makeTopic('os-2', 'subj-os', 'os-ch-sched', 'Process Scheduling', 'CPU Scheduling algorithms (FCFS, Non-preemptive/Preemptive SJF, Priority Scheduling, Gantt charts).', 1, true, 49),
  makeTopic('os-sub-rr', 'subj-os', 'os-ch-sched', 'Round Robin Scheduling', 'Time quantum sizing, context switch overhead, queue management, turnaround and waiting time.', 2, true),
  makeTopic('os-sub-srtf', 'subj-os', 'os-ch-sched', 'SRTF', 'Shortest Remaining Time First preemptive scheduling, remaining burst time evaluations.', 3, true),

  // --- Chapter 3: Process Synchronization ---
  makeTopic('os-ch-sync', 'subj-os', null, 'Process Synchronization', 'Critical section problem, Peterson algorithm, classical sync, semaphores, and precedence graphs.', 3, true),
  makeTopic('os-1', 'subj-os', 'os-ch-sync', 'Process Synchronization', 'Critical Section criteria (Mutual Exclusion, Progress, Bounded Waiting), Peterson Algorithm, Producer-Consumer.', 1, true, 52),
  makeTopic('os-8', 'subj-os', 'os-ch-sync', 'Semaphore', 'Counting and binary semaphore values, concurrent P/V wait/signal operation sequences and deadlock states.', 2, true),
  makeTopic('os-sub-prec', 'subj-os', 'os-ch-sync', 'Precedence Graph', 'Task precedence graphs, synchronizing concurrent statements S1-Sn using semaphores.', 3, true),

  // --- Chapter 4: Deadlocks & Resource Allocation ---
  makeTopic('os-ch-deadlock', 'subj-os', null, 'Deadlocks & Resource Allocation', 'Necessary deadlock conditions, Resource Allocation Graphs, Banker algorithm, safety and recovery.', 4, true),
  makeTopic('os-6', 'subj-os', 'os-ch-deadlock', 'Resource Allocation', 'Deadlock necessary conditions (Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait), Banker Algorithm.', 1, true, 27),
  makeTopic('os-sub-deadlock-pad', 'subj-os', 'os-ch-deadlock', 'Deadlock Prevention Avoidance Detection', 'Negating Coffman conditions, safe state sequence testing, wait-for graphs and recovery.', 2, true),
  makeTopic('os-sub-banker', 'subj-os', 'os-ch-deadlock', 'Bankers Algorithm', 'Allocation matrix, Max matrix, Need matrix (Need = Max - Allocation), Available vector safety algorithm.', 3, true, 2),
  makeTopic('os-sub-rag', 'subj-os', 'os-ch-deadlock', 'Resource Allocation Graph', 'Resource Allocation Graph (RAG) cycle detection, single vs multiple instance resource deadlock.', 4, true, 1),

  // --- Chapter 5: Memory Management & Virtual Memory ---
  makeTopic('os-ch-mem', 'subj-os', null, 'Memory Management & Virtual Memory', 'Paging, multi-level page tables, TLB, EMAT, page replacement algorithms, and allocation policies.', 5, true),
  makeTopic('os-3', 'subj-os', 'os-ch-mem', 'Virtual Memory', 'Demand paging, Translation Lookaside Buffer (TLB), Effective Memory Access Time (EMAT) calculations, page table lookups.', 1, true, 43),
  makeTopic('os-4', 'subj-os', 'os-ch-mem', 'Page Replacement', 'FIFO, LRU, Optimal page replacement algorithms, Belady Anomaly, page fault counting on reference strings.', 2, true),
  makeTopic('os-10', 'subj-os', 'os-ch-mem', 'Memory Management', 'Single-level and Multi-level paging address translation, Page Table Base Register (PTBR), fragmentation.', 3, true, 9),
  makeTopic('os-sub-demand', 'subj-os', 'os-ch-mem', 'Demand Paging', 'Pure demand paging, page fault service routine, page fault overhead and effective memory access time.', 4, true),
  makeTopic('os-sub-tlb', 'subj-os', 'os-ch-mem', 'Translation Lookaside Buffer', 'TLB hit ratio, TLB miss penalty, multi-level paging EMAT = Hit*(TLB+RAM) + Miss*(TLB+(k+1)*RAM).', 5, true, 2),
  makeTopic('os-sub-ml-page', 'subj-os', 'os-ch-mem', 'Multilevel Paging', 'Hierarchical paging, outer page table, inner page table, page directory index calculations.', 6, true),
  makeTopic('os-sub-lru', 'subj-os', 'os-ch-mem', 'Least Recently Used', 'LRU stack and counter implementations, stack algorithm property, comparing LRU vs FIFO vs Optimal.', 7, true),
  makeTopic('os-sub-bestfit', 'subj-os', 'os-ch-mem', 'Best Fit', 'Contiguous memory allocation policies: Best Fit, First Fit, Worst Fit, Next Fit comparisons.', 8, true),

  // --- Chapter 6: Storage, File Systems & I/O ---
  makeTopic('os-ch-storage', 'subj-os', null, 'Storage, File Systems & I/O', 'Disk geometry, seek times, Unix Inode pointers, disk scheduling algorithms, and I/O handling.', 6, true),
  makeTopic('os-5', 'subj-os', 'os-ch-storage', 'Disk', 'Disk geometry, Sector/Track addressing, rotational latency, transfer rate, and Unix Inode block pointer calculations.', 1, true),
  makeTopic('os-7', 'subj-os', 'os-ch-storage', 'Disk Scheduling', 'FCFS, SSTF, SCAN (Elevator), C-SCAN, LOOK, C-LOOK seek time track movement calculations.', 2, true, 16),
  makeTopic('os-sub-fs', 'subj-os', 'os-ch-storage', 'File System', 'Directory structures, file control blocks, file access methods, file attributes and mounting.', 3, true),
  makeTopic('os-sub-io', 'subj-os', 'os-ch-storage', 'IO Handling', 'Programmed I/O, Interrupt-Driven I/O, I/O subsystem kernel services, device drivers and controllers.', 4, true),
  makeTopic('os-sub-intr', 'subj-os', 'os-ch-storage', 'Interrupts', 'Hardware vs software interrupts, interrupt service routines (ISR), interrupt vector table, priority masking.', 5, true, 6),
  makeTopic('os-sub-dma', 'subj-os', 'os-ch-storage', 'DMA', 'Direct Memory Access controller architecture, bus master, cycle stealing vs burst transfer modes.', 6, true),
  makeTopic('os-sub-linked', 'subj-os', 'os-ch-storage', 'Linked Allocation', 'Linked list allocation of disk blocks, File Allocation Table (FAT), pointer overhead and sequential access.', 7, true, 1),
  makeTopic('os-sub-io-op', 'subj-os', 'os-ch-storage', 'Input Output', 'Memory-mapped I/O vs Port-mapped (isolated) I/O, synchronous vs asynchronous I/O operations.', 8, true, 1),

  // =========================================================================
  // 6. DISCRETE MATHEMATICS (subj-dm) - 390 Total PYQs
  //    Organized into 4 parent categories with subtopics
  // =========================================================================

  // --- Parent: Combinatory ---
  makeTopic('dm-comb', 'subj-dm', null, 'Combinatory', 'Permutations, combinations, recurrence relations, generating functions, and counting techniques.', 1, true),
  makeTopic('dm-1', 'subj-dm', 'dm-comb', 'Combinatory', 'Permutations & Combinations, Binomial theorem, inclusion-exclusion principle.', 1, true),
  makeTopic('dm-2', 'subj-dm', 'dm-comb', 'Recurrence Relation', 'Solving linear homogeneous and non-homogeneous recurrence relations, characteristic roots.', 2, true),
  makeTopic('dm-3', 'subj-dm', 'dm-comb', 'Balls In Bins', 'Distributing distinct/identical objects into distinct/identical bins, stars and bars.', 3, true),
  makeTopic('dm-4', 'subj-dm', 'dm-comb', 'Counting', 'Rule of sum, rule of product, combinatorial counting principles.', 4, true),
  makeTopic('dm-5', 'subj-dm', 'dm-comb', 'Generating Functions', 'Ordinary and exponential generating functions, closed forms for sequence generation.', 5, true),
  makeTopic('dm-6', 'subj-dm', 'dm-comb', 'Summation', 'Sum of powers of integers, geometric and arithmetic-geometric series formulas.', 6, true),
  makeTopic('dm-7', 'subj-dm', 'dm-comb', 'Modular Arithmetic', 'Fermat Little Theorem, modular inverses, Chinese Remainder Theorem basics.', 7, true),
  makeTopic('dm-8', 'subj-dm', 'dm-comb', 'Pigeonhole Principle', 'Generalized pigeonhole principle ceil(N/k), minimum elements to guarantee duplicates.', 8, true, 2),

  // --- Parent: Graph Theory ---
  makeTopic('dm-graph', 'subj-dm', null, 'Graph Theory', 'Connectivity, degree sequences, planarity, coloring, isomorphism, and matching.', 2, true),
  makeTopic('dm-9', 'subj-dm', 'dm-graph', 'Graph Connectivity', 'Connected components, cut vertices, cut edges, bridges, Eulerian paths/circuits, Hamiltonian cycles.', 1, true),
  makeTopic('dm-10', 'subj-dm', 'dm-graph', 'Degree of Graph', 'Handshaking Lemma (Sum of degrees = 2|E|), degree sequences, Havel-Hakimi theorem.', 2, true, 13),
  makeTopic('dm-11', 'subj-dm', 'dm-graph', 'Graph Planarity', 'Planar graphs, Euler formula V - E + F = 2, maximal planar graph edges E <= 3V - 6.', 3, true),
  makeTopic('dm-12', 'subj-dm', 'dm-graph', 'Graph Coloring', 'Vertex chromatic number chi(G), edge chromatic index, four-color theorem bounds, bipartite coloring.', 4, true, 11),
  makeTopic('dm-13', 'subj-dm', 'dm-graph', 'Graph Isomorphism', 'Graph invariant checks: vertex counts, degree multisets, adjacency matrix isomorphism.', 5, true),
  makeTopic('dm-14', 'subj-dm', 'dm-graph', 'Counting', 'Number of simple graphs on n vertices 2^C(n,2), labeled trees Cayley formula n^(n-2).', 6, true, 3),
  makeTopic('dm-15', 'subj-dm', 'dm-graph', 'Graph Matching', 'Maximal vs maximum matchings, Hall Marriage Theorem for bipartite graphs.', 7, true),
  makeTopic('dm-16a', 'subj-dm', 'dm-graph', 'Graph Algorithms', 'Graph traversal connectivity algorithms and path tests.', 8, true),
  makeTopic('dm-16b', 'subj-dm', 'dm-graph', 'Jaccard Coefficient', 'Graph vertex neighborhood similarity metric and link prediction.', 9, true),

  // --- Parent: Mathematical Logic ---
  makeTopic('dm-logic', 'subj-dm', null, 'Mathematical Logic', 'Propositional logic, first-order predicate calculus, inference rules, and logical deductions.', 3, true),
  makeTopic('dm-17', 'subj-dm', 'dm-logic', 'Propositional Logic', 'Truth tables, logical equivalences, Tautology/Contradiction, CNF/DNF, inference rules.', 1, true),
  makeTopic('dm-18', 'subj-dm', 'dm-logic', 'First Order Logic', 'Predicate quantifiers (Forall, Exists), quantifier negation, scope, validity and satisfiability of formulas.', 2, true, 35),
  makeTopic('dm-19', 'subj-dm', 'dm-logic', 'Logical Reasoning', 'Translating complex English statements to predicate calculus and logic deductions.', 3, true),

  // --- Parent: Set Theory & Algebra ---
  makeTopic('dm-set-algebra', 'subj-dm', null, 'Set Theory & Algebra', 'Relations, group theory, functions, posets, lattices, and algebraic structures.', 4, true),
  makeTopic('dm-20', 'subj-dm', 'dm-set-algebra', 'Relations', 'Reflexive, Symmetric, Anti-symmetric, Transitive properties, Equivalence classes, and closures.', 1, true),
  makeTopic('dm-21', 'subj-dm', 'dm-set-algebra', 'Group Theory', 'Groups, Abelian Groups, Subgroups, Cyclic groups, Order of elements, Lagrange Theorem.', 2, true),
  makeTopic('dm-22', 'subj-dm', 'dm-set-algebra', 'Functions', 'Injective (One-to-One), Surjective (Onto), Bijective functions, number of onto functions formulas.', 3, true, 30),
  makeTopic('dm-23', 'subj-dm', 'dm-set-algebra', 'Set Theory', 'Power sets, Cartesian products, set algebra laws, cardinality of sets, De Morgan laws.', 4, true),
  makeTopic('dm-24', 'subj-dm', 'dm-set-algebra', 'Lattice & Boolean Algebra', 'Partially ordered sets as Lattices, Meet (GLB), Join (LUB), Distributive and Complemented Lattices.', 5, true, 10),
  makeTopic('dm-25', 'subj-dm', 'dm-set-algebra', 'Partial Order & Posets', 'Posets, Hasse diagrams, Maximal/Minimal vs Greatest/Least elements, Topological sorting of Posets.', 6, true),
  makeTopic('dm-26', 'subj-dm', 'dm-set-algebra', 'Binary Operation', 'Properties of binary operations: associativity, commutativity, identity, inverse elements.', 7, true),
  makeTopic('dm-27', 'subj-dm', 'dm-set-algebra', 'Number Theory', 'GCD, Euclidean algorithm, prime numbers, Euler Totient function phi(n).', 8, true, 7),
  makeTopic('dm-28', 'subj-dm', 'dm-set-algebra', 'Polynomials', 'Polynomial roots, irreducible polynomials in finite fields.', 9, true),
  makeTopic('dm-29', 'subj-dm', 'dm-set-algebra', 'Countable & Uncountable Sets', 'Countably infinite sets (Integers, Rationals) vs Uncountable sets (Reals, Power set of Naturals).', 10, true, 2),

  // =========================================================================
  // 7. ENGINEERING MATHEMATICS (subj-em) - 306 Total PYQs
  //    Organized into 3 parent categories with subtopics
  // =========================================================================

  // --- Parent: Linear Algebra ---
  makeTopic('em-la', 'subj-em', null, 'Linear Algebra', 'Eigenvalues, eigenvectors, matrix operations, determinants, rank, vector spaces, and linear systems.', 1, true),
  makeTopic('em-1', 'subj-em', 'em-la', 'Eigen Value', 'Characteristic equation |A - lambda*I| = 0, properties of eigenvalues (trace, det), Cayley-Hamilton Theorem.', 1, true, 33),
  makeTopic('em-2', 'subj-em', 'em-la', 'Matrix', 'Matrix multiplication, Transpose, Symmetric, Skew-Symmetric, Orthogonal, Unitary, and Nilpotent matrices.', 2, true),
  makeTopic('em-3', 'subj-em', 'em-la', 'System of Equations', 'Matrix equation AX = B, augmented matrix [A|B], consistency test (Rank(A) vs Rank(A|B)), unique/infinite/no solution.', 3, true, 17),
  makeTopic('em-4', 'subj-em', 'em-la', 'Determinant', 'Properties of determinants, row/column expansion, inverse matrix formula A^-1 = adj(A)/det(A).', 4, true, 12),
  makeTopic('em-5', 'subj-em', 'em-la', 'Rank of Matrix', 'Echelon form, row operations, linearly independent rows/columns, Rank-Nullity Theorem.', 5, true),
  makeTopic('em-6', 'subj-em', 'em-la', 'Vector Space', 'Vector spaces, subspaces, linear independence, basis vectors, and dimension.', 6, true),
  makeTopic('em-7', 'subj-em', 'em-la', 'LU Decomposition', 'Lower-Upper triangular matrix factorizations A = LU, forward and backward substitution.', 7, true),
  makeTopic('em-8', 'subj-em', 'em-la', 'Orthonormality', 'Orthogonal vectors, Gram-Schmidt orthonormalization, vector projections.', 8, true),
  makeTopic('em-9', 'subj-em', 'em-la', 'Statistics', 'Mean, variance, standard deviation, covariance, correlation coefficient.', 9, true),
  makeTopic('em-10', 'subj-em', 'em-la', 'Cartesian Coordinates', 'Dot product, cross product, vector magnitude and geometric representations.', 10, true),

  // --- Parent: Probability ---
  makeTopic('em-prob', 'subj-em', null, 'Probability', 'Axioms of probability, Bayes theorem, discrete & continuous random variables, and distributions.', 2, true),
  makeTopic('em-11', 'subj-em', 'em-prob', 'Probability', 'Axioms of probability, sample spaces, mutually exclusive events, addition rule.', 1, true),
  makeTopic('em-12', 'subj-em', 'em-prob', 'Expectation', 'Expected value E[X], Variance Var(X) = E[X^2] - (E[X])^2, linearity of expectation.', 2, true, 15),
  makeTopic('em-13', 'subj-em', 'em-prob', 'Conditional Probability', 'P(A|B) = P(A cap B) / P(B), Total Probability Theorem, Bayes Rule for posterior probability.', 3, true, 14),
  makeTopic('em-14', 'subj-em', 'em-prob', 'Uniform Distribution', 'Continuous and discrete uniform probability density functions and moments.', 4, true),
  makeTopic('em-15', 'subj-em', 'em-prob', 'Random Variable', 'Discrete and Continuous random variables, cumulative distribution functions (CDF).', 5, true, 10),
  makeTopic('em-16', 'subj-em', 'em-prob', 'Binomial Distribution', 'P(X = k) = C(n,k) p^k (1-p)^(n-k), Mean = n*p, Variance = n*p*(1-p).', 6, true, 6),
  makeTopic('em-17', 'subj-em', 'em-prob', 'Exponential Distribution', 'Probability density f(x) = lambda*e^(-lambda*x), memoryless property P(X > s+t | X > s) = P(X > t).', 7, true, 6),
  makeTopic('em-18', 'subj-em', 'em-prob', 'Independent Events', 'Condition for statistical independence P(A cap B) = P(A) * P(B).', 8, true, 6),
  makeTopic('em-19', 'subj-em', 'em-prob', 'Poisson Distribution', 'P(X = k) = e^-lambda * lambda^k / k!, Mean = lambda, Variance = lambda.', 9, true, 5),
  makeTopic('em-20', 'subj-em', 'em-prob', 'Normal Distribution', 'Gaussian bell curve, standard normal distribution Z = (X - mu) / sigma, symmetry properties.', 10, true, 4),

  // --- Parent: Calculus ---
  makeTopic('em-calc', 'subj-em', null, 'Calculus', 'Limits, continuity, differentiability, maxima/minima, partial derivatives, and integrals.', 3, true),
  makeTopic('em-21', 'subj-em', 'em-calc', 'Limits', 'Evaluation of limits, L\'Hopital Rule for 0/0 and inf/inf indeterminate forms.', 1, true),
  makeTopic('em-22', 'subj-em', 'em-calc', 'Maxima Minima', 'First derivative test, Second derivative test, multivariable extrema using Hessian matrix.', 2, true),
  makeTopic('em-23', 'subj-em', 'em-calc', 'Continuity', 'Left-hand limit = Right-hand limit = Function value at point, intermediate value theorem.', 3, true),
  makeTopic('em-24', 'subj-em', 'em-calc', 'Differentiation', 'Chain rule, product rule, partial derivatives, directional derivatives, gradient.', 4, true),
  makeTopic('em-25', 'subj-em', 'em-calc', 'Integration', 'Indefinite and standard integration techniques, substitution, integration by parts.', 5, true),
  makeTopic('em-26', 'subj-em', 'em-calc', 'Definite Integral', 'Fundamental Theorem of Calculus, properties of definite integrals.', 6, true),

  // =========================================================================
  // 8. GENERAL APTITUDE (subj-ga) - 429 Total PYQs
  //    Organized into 4 official GATE chapters with subtopics
  // =========================================================================

  // --- Chapter 1: Quantitative Aptitude ---
  makeTopic('ga-quant', 'subj-ga', null, 'Quantitative Aptitude', 'Arithmetic, algebra, data interpretation, probability, and quantitative reasoning.', 1, true),
  makeTopic('ga-sub-perm-comb', 'subj-ga', 'ga-quant', 'Permutations & Combinations', 'Permutations, combinations and combinatorial counting principles in aptitude word problems.', 1, true),
  makeTopic('ga-sub-time-work', 'subj-ga', 'ga-quant', 'Time & Work', 'Work and wages, individual & group efficiencies, pipes and cisterns.', 2, true),
  makeTopic('ga-sub-geom', 'subj-ga', 'ga-quant', 'Geometry & Mensuration', 'Triangles, circles, polygons, volume and surface area of 2D/3D shapes.', 3, true),
  makeTopic('ga-sub-spd', 'subj-ga', 'ga-quant', 'Speed Time & Distance', 'Trains, boats and streams, relative speed, races, circular tracks.', 4, true),
  makeTopic('ga-1', 'subj-ga', 'ga-quant', 'Probability', 'Permutations, combinations, coin/dice/card probability word problems.', 5, true),
  makeTopic('ga-sub-num-sys', 'subj-ga', 'ga-quant', 'Number Systems & Divisibility', 'Divisibility rules, unit digit cycles, remainders, factors, LCM and HCF.', 6, true),
  makeTopic('ga-sub-alg-eq', 'subj-ga', 'ga-quant', 'Algebraic Equations', 'Linear and simultaneous equations, word problems, algebraic identities.', 7, true),
  makeTopic('ga-sub-profit', 'subj-ga', 'ga-quant', 'Profit and Loss', 'Cost price, selling price, marked price, discount, profit/loss percentages.', 8, true),
  makeTopic('ga-sub-prog', 'subj-ga', 'ga-quant', 'Progressions (AP & GP)', 'Arithmetic progressions, geometric progressions, sum of series formulas.', 9, true, 12),
  makeTopic('ga-2', 'subj-ga', 'ga-quant', 'Numerical Computation', 'Arithmetic fractions, decimals, powers, roots, simplification.', 10, true),
  makeTopic('ga-3', 'subj-ga', 'ga-quant', 'Ratio Proportion', 'Direct/inverse proportion, mixture problems, partnerships, ages.', 11, true),
  makeTopic('ga-4', 'subj-ga', 'ga-quant', 'Percentage', 'Percentage increase/decrease, profit & loss, discount, simple & compound interest.', 12, true),
  makeTopic('ga-sub-interest', 'subj-ga', 'ga-quant', 'Simple & Compound Interest', 'Simple interest, compound interest compounded annually/half-yearly, SI-CI difference.', 13, true),
  makeTopic('ga-5', 'subj-ga', 'ga-quant', 'Functions', 'Domain, range, composition of functions, polynomial function evaluations.', 14, true),
  makeTopic('ga-6', 'subj-ga', 'ga-quant', 'Tabular Data', 'Interpreting tables, bar charts, pie charts, data sufficiency.', 15, true),
  makeTopic('ga-7', 'subj-ga', 'ga-quant', 'Venn Diagram', '2-set and 3-set Venn diagram word problems, set overlapping counts.', 16, true),
  makeTopic('ga-8', 'subj-ga', 'ga-quant', 'Logarithms', 'Logarithm identities: log(ab) = log a + log b, base change rules.', 17, true, 6),
  makeTopic('ga-9', 'subj-ga', 'ga-quant', 'Quadratic Equations', 'Roots of quadratic equation, discriminant b^2 - 4ac, nature of roots.', 18, true),
  makeTopic('ga-10', 'subj-ga', 'ga-quant', 'Absolute Value', 'Modulus equations |x - a| <= b, solving linear inequalities.', 19, true),

  // --- Chapter 2: Verbal Aptitude ---
  makeTopic('ga-verbal', 'subj-ga', null, 'Verbal Aptitude', 'English vocabulary, reading comprehension, grammar, and verbal reasoning.', 2, true),
  makeTopic('ga-11', 'subj-ga', 'ga-verbal', 'Most Appropriate Word', 'Contextual vocabulary fill-in-the-blanks, collocations, cloze tests.', 1, true),
  makeTopic('ga-12', 'subj-ga', 'ga-verbal', 'Passage Reading', 'Reading comprehension passages, author tone, main idea inference.', 2, true),
  makeTopic('ga-13', 'subj-ga', 'ga-verbal', 'Verbal Reasoning', 'Critical reasoning, strengthening and weakening arguments, logical assumptions.', 3, true),
  makeTopic('ga-14', 'subj-ga', 'ga-verbal', 'Word Pairs', 'Semantic word pair relationships (cause-effect, tool-user, part-whole).', 4, true, 14),
  makeTopic('ga-15', 'subj-ga', 'ga-verbal', 'Synonyms', 'Identifying word meanings and synonyms in technical context.', 5, true),
  makeTopic('ga-sub-cloze', 'subj-ga', 'ga-verbal', 'Sentence Completion & Cloze Test', 'Cloze test paragraph context words, grammatical fitting.', 6, true),
  makeTopic('ga-16', 'subj-ga', 'ga-verbal', 'Tenses', 'Past, present, future tenses, perfect continuous usage.', 7, true),
  makeTopic('ga-17', 'subj-ga', 'ga-verbal', 'Antonyms', 'Opposite words, antonyms in context.', 8, true),
  makeTopic('ga-18', 'subj-ga', 'ga-verbal', 'Grammatical Error', 'Spotting errors in sentence clauses, prepositions, articles.', 9, true),
  makeTopic('ga-sub-prep', 'subj-ga', 'ga-verbal', 'Prepositions & Conjunctions', 'Prepositional phrases, coordinating and subordinating conjunctions.', 10, true),
  makeTopic('ga-19', 'subj-ga', 'ga-verbal', 'English Grammar', 'Subject-verb agreement, modifiers, parallelism, conditional sentences.', 11, true),
  makeTopic('ga-20', 'subj-ga', 'ga-verbal', 'Incorrect Sentence Part', 'Sentence correction, identifying faulty grammatical fragments.', 12, true),
  makeTopic('ga-sub-idioms', 'subj-ga', 'ga-verbal', 'Idioms & Phrases', 'Idiomatic expressions, phrasal verbs, figurative meanings in sentences.', 13, true),

  // --- Chapter 3: Analytical Aptitude ---
  makeTopic('ga-analytical', 'subj-ga', null, 'Analytical Aptitude', 'Logical deduction, coding-decoding, direction sense, and analytical puzzles.', 3, true),
  makeTopic('ga-21', 'subj-ga', 'ga-analytical', 'Logical Reasoning', 'Deductive reasoning, arrangements, blood relations, puzzles.', 1, true),
  makeTopic('ga-22', 'subj-ga', 'ga-analytical', 'Statements Follow', 'Logical conclusions from statements, Venn diagram validations.', 2, true),
  makeTopic('ga-23', 'subj-ga', 'ga-analytical', 'Direction Sense', 'Compass navigation problems, displacement distance calculations.', 3, true),
  makeTopic('ga-sub-blood', 'subj-ga', 'ga-analytical', 'Blood Relations & Family Tree', 'Family tree decoding, coded blood relation statements.', 4, true),
  makeTopic('ga-24', 'subj-ga', 'ga-analytical', 'Sequence Series', 'Number and letter sequence completion, pattern deductions.', 5, true),
  makeTopic('ga-sub-seating', 'subj-ga', 'ga-analytical', 'Seating Arrangements & Puzzles', 'Linear, circular, and matrix grid seating arrangement puzzles.', 6, true),
  makeTopic('ga-25', 'subj-ga', 'ga-analytical', 'Age Relation', 'Algebraic age relationship word equations.', 7, true),
  makeTopic('ga-26', 'subj-ga', 'ga-analytical', 'Code Words', 'Letter substitution ciphers, code transformations.', 8, true),
  makeTopic('ga-27', 'subj-ga', 'ga-analytical', 'Odd One', 'Classification of numbers, words, and shapes to find the outlier.', 9, true),
  makeTopic('ga-28a', 'subj-ga', 'ga-analytical', 'Passage Reading', 'Analytical passage reading and inference questions.', 10, true),
  makeTopic('ga-28b', 'subj-ga', 'ga-analytical', 'Analogy', 'Identifying analogical relationships and completing analogy pairs.', 11, true),
  makeTopic('ga-28c', 'subj-ga', 'ga-analytical', 'Coding Decoding', 'Decoding encrypted messages using letter-position patterns.', 12, true),

  // --- Chapter 4: Spatial Aptitude ---
  makeTopic('ga-spatial', 'subj-ga', null, 'Spatial Aptitude', 'Visual and spatial reasoning: folding, rotation, 3D structures, mirror images.', 4, true),
  makeTopic('ga-29', 'subj-ga', 'ga-spatial', 'Paper Folding', 'Visualizing crease patterns and holes upon unfolding paper.', 1, true),
  makeTopic('ga-30', 'subj-ga', 'ga-spatial', 'Patterns In Two Dimensions', '2D geometric transformations, pattern completion, tessellations.', 2, true),
  makeTopic('ga-31', 'subj-ga', 'ga-spatial', 'Image Rotation', 'Clockwise and counter-clockwise 2D/3D angular rotations.', 3, true),
  makeTopic('ga-32', 'subj-ga', 'ga-spatial', 'Patterns In Three Dimensions', 'Cube surface unrolling, dice net representations.', 4, true),
  makeTopic('ga-33', 'subj-ga', 'ga-spatial', '3D Structure', 'Combining 3D polyhedra, orthographic front/side/top views.', 5, true),
  makeTopic('ga-34', 'subj-ga', 'ga-spatial', 'Assembling', 'Mental assembly of disjointed 2D/3D parts.', 6, true),
  makeTopic('ga-35', 'subj-ga', 'ga-spatial', 'Assembling Pieces', 'Fitting irregular pieces together to form complete shapes.', 7, true),
  makeTopic('ga-36', 'subj-ga', 'ga-spatial', 'Mirror Image', 'Lateral inversion reflections along horizontal and vertical axes.', 8, true),

  // =========================================================================
  // 9. ALGORITHMS (subj-algo)
  //    Organized into 6 official GATE syllabus chapters with subtopics
  // =========================================================================

  // --- Chapter 1: Asymptotic Analysis & Recurrences ---
  makeTopic('alg-ch-asymp', 'subj-algo', null, 'Asymptotic Analysis & Recurrences', 'Asymptotic notations, time and space complexity analysis of loops, master theorem, recursion tree analysis, and algorithmic tracing.', 1, true),
  makeTopic('alg-1', 'subj-algo', 'alg-ch-asymp', 'Identify Function', 'Tracing pseudocode, determining returned values and mathematical functions implemented.', 1, true),
  makeTopic('alg-2', 'subj-algo', 'alg-ch-asymp', 'Recurrence Relation', 'Master Theorem cases T(n) = aT(n/b) + f(n), Akra-Bazzi method, recursion tree analysis.', 2, true),
  makeTopic('alg-4', 'subj-algo', 'alg-ch-asymp', 'Time Complexity', 'Analyzing nested loops, logarithmic steps, best/worst/average case time complexities.', 3, true),
  makeTopic('alg-6', 'subj-algo', 'alg-ch-asymp', 'Asymptotic Notations', 'Big-O, Omega, Theta, Little-o, Little-omega formal definitions and limit comparisons.', 4, true),
  makeTopic('alg-sub-recur', 'subj-algo', 'alg-ch-asymp', 'Recursion', 'Recursion call stack depth, base termination conditions, recursion tree traces.', 5, true),
  makeTopic('alg-sub-des-tech', 'subj-algo', 'alg-ch-asymp', 'Algorithm Design Techniques', 'Greedy vs dynamic vs divide and conquer paradigms, optimal choice heuristics.', 6, true),
  makeTopic('alg-sub-alg-des', 'subj-algo', 'alg-ch-asymp', 'Algorithm Design', 'Correctness proofs, state representations, problem reductions.', 7, true),
  makeTopic('alg-sub-loop-inv', 'subj-algo', 'alg-ch-asymp', 'Loop Invariants', 'Loop termination conditions, invariant assertions, loop bounds verification and algorithmic correctness.', 8, true),
  makeTopic('alg-sub-output', 'subj-algo', 'alg-ch-asymp', 'Output', 'Evaluating iterative loops, pseudocode execution tracing, side effects in algorithmic control flow.', 9, true),
  makeTopic('alg-sub-aliasing', 'subj-algo', 'alg-ch-asymp', 'Aliasing', 'Memory referencing, pointer aliasing, variable side effects during function calls and loop iterations.', 10, true),
  makeTopic('alg-sub-space', 'subj-algo', 'alg-ch-asymp', 'Space Complexity', 'Auxiliary space, recursion stack depth analysis, in-place vs extra memory bounds.', 11, true),
  makeTopic('alg-sub-cs', 'subj-algo', 'alg-ch-asymp', 'Computer Science', 'Core computer science fundamentals, state models, computational limits.', 12, true),

  // --- Chapter 2: Divide and Conquer, Searching & Sorting ---
  makeTopic('alg-ch-sort', 'subj-algo', null, 'Divide and Conquer, Searching & Sorting', 'Comparison sorting lower bounds, divide-and-conquer sorts, binary search, inversions, and stability.', 2, true),
  makeTopic('alg-7', 'subj-algo', 'alg-ch-sort', 'Sorting', 'Comparison lower bound Omega(n log n), sorting classifications, adaptive sorting, stability properties.', 1, true, 22),
  makeTopic('alg-8', 'subj-algo', 'alg-ch-sort', 'Quick Sort', 'Lomuto vs Hoare partitioning, worst case O(n^2) conditions, randomized pivot selection.', 2, true, 15),
  makeTopic('alg-sub-search', 'subj-algo', 'alg-ch-sort', 'Searching', 'Linear search, binary search variations, search in rotated sorted array, peak finding.', 3, true),
  makeTopic('alg-sub-merge', 'subj-algo', 'alg-ch-sort', 'Merge Sort', 'Merge sort divide-and-conquer, recurrence T(n) = 2T(n/2) + O(n), auxiliary O(n) space.', 4, true, 4),
  makeTopic('alg-sub-binsearch', 'subj-algo', 'alg-ch-sort', 'Binary Search', 'Binary search interval halving, logarithmic time complexity O(log n), search boundaries.', 5, true, 4),
  makeTopic('alg-sub-heap-sort', 'subj-algo', 'alg-ch-sort', 'Heap Sort', 'Heap Sort algorithm, in-place O(n log n) worst-case time, Build-Heap initialization.', 6, true, 2),
  makeTopic('alg-sub-ins-sort', 'subj-algo', 'alg-ch-sort', 'Insertion Sort', 'Insertion sort adaptive algorithm, O(n) best-case for nearly sorted lists, O(n^2) worst case.', 7, true, 2),
  makeTopic('alg-sub-sel-sort', 'subj-algo', 'alg-ch-sort', 'Selection Sort', 'Selection sort minimum swaps O(n), comparisons O(n^2), non-adaptive behavior.', 8, true, 2),
  makeTopic('alg-sub-inv', 'subj-algo', 'alg-ch-sort', 'Inversion', 'Counting inversions in an array, relation to bubble sort swaps, modified merge sort O(n log n).', 9, true, 2),
  makeTopic('alg-sub-merging', 'subj-algo', 'alg-ch-sort', 'Merging', 'Merging two sorted arrays of size m and n with m + n - 1 comparisons.', 10, true),
  makeTopic('alg-sub-bubble', 'subj-algo', 'alg-ch-sort', 'Bubble Sort', 'Bubble sort adjacent element swaps, number of passes, best-case optimization flag.', 11, true),
  makeTopic('alg-sub-swap', 'subj-algo', 'alg-ch-sort', 'Number of Swap', 'Minimum number of swaps required to sort an array or convert between permutations.', 12, true),
  makeTopic('alg-sub-maxmin', 'subj-algo', 'alg-ch-sort', 'Maximum Minimum', 'Simultaneous maximum and minimum element finding with 3n/2 - 2 comparisons.', 13, true),

  // --- Chapter 3: Graph Algorithms & Traversals ---
  makeTopic('alg-ch-graph', 'subj-algo', null, 'Graph Algorithms & Traversals', 'Graph traversals, single-source and all-pairs shortest paths, DAG topological ordering, SCCs.', 3, true),
  makeTopic('alg-5', 'subj-algo', 'alg-ch-graph', 'Graph Search', 'Breadth-First Search (BFS), Depth-First Search (DFS), edge classification (tree/back/forward/cross).', 1, true, 23),
  makeTopic('alg-sub-graph-alg', 'subj-algo', 'alg-ch-graph', 'Graph Algorithms', 'Graph representation (adjacency matrix vs list), bipartite matching, cut vertices.', 2, true, 11),
  makeTopic('alg-sub-topo', 'subj-algo', 'alg-ch-graph', 'Topological Sort', 'Kahn in-degree algorithm, DFS-based topological ordering, detecting cycles in directed graphs.', 3, true),
  makeTopic('alg-sub-bfs', 'subj-algo', 'alg-ch-graph', 'Breadth First Search', 'BFS queue-based layer exploration, shortest path in unweighted graphs.', 4, true),
  makeTopic('alg-sub-scc', 'subj-algo', 'alg-ch-graph', 'Strongly Connected Components', 'Kosaraju two-pass DFS algorithm, Tarjan low-link SCC algorithm in directed graphs.', 5, true),
  makeTopic('alg-sub-dfs', 'subj-algo', 'alg-ch-graph', 'Depth First Search', 'DFS recursion stack, discovery and finishing timestamps, parenthesis theorem.', 6, true),
  makeTopic('alg-sub-dag', 'subj-algo', 'alg-ch-graph', 'Directed Acyclic Graph', 'DAG properties, task dependency scheduling, longest path in DAG using DP.', 7, true),

  // --- Chapter 4: Greedy Algorithms & Shortest Paths ---
  makeTopic('alg-ch-greedy', 'subj-algo', null, 'Greedy Algorithms & Shortest Paths', 'Greedy choice property, optimal substructure, minimum spanning trees, Huffman codes, and shortest paths.', 4, true),
  makeTopic('alg-3', 'subj-algo', 'alg-ch-greedy', 'Minimum Spanning Tree', 'Kruskal algorithm with Union-Find O(E log E), Prim algorithm O(E log V), Cut and Cycle properties.', 1, true, 35),
  makeTopic('alg-9', 'subj-algo', 'alg-ch-greedy', 'Shortest Path', 'Single-source shortest paths, all-pairs shortest paths, relaxation property.', 2, true),
  makeTopic('alg-sub-huffman', 'subj-algo', 'alg-ch-greedy', 'Huffman Code', 'Prefix-free codes, optimal merge patterns, constructing Huffman trees, average code length.', 3, true),
  makeTopic('alg-sub-dijkstra', 'subj-algo', 'alg-ch-greedy', 'Dijkstras Algorithm', 'Dijkstra shortest path O((V+E)log V), min-priority queue, non-negative edge weight rule.', 4, true, 5),
  makeTopic('alg-sub-greedy-tech', 'subj-algo', 'alg-ch-greedy', 'Greedy Algorithms', 'Activity selection, interval scheduling, fractional knapsack greedy choice.', 5, true),
  makeTopic('alg-sub-bellman', 'subj-algo', 'alg-ch-greedy', 'Bellman Ford', 'Bellman-Ford negative edge weights, negative cycle detection in O(VE) time.', 6, true, 2),
  makeTopic('alg-sub-prims', 'subj-algo', 'alg-ch-greedy', 'Prims Algorithm', 'Prim algorithm growing tree strategy, key value updates in priority queue.', 7, true),

  // --- Chapter 5: Dynamic Programming ---
  makeTopic('alg-ch-dp', 'subj-algo', null, 'Dynamic Programming', 'Overlapping subproblems, memoization vs tabulation, knapsack, LCS, and matrix chain multiplication.', 5, true),
  makeTopic('alg-10', 'subj-algo', 'alg-ch-dp', 'Dynamic Programming', '0/1 Knapsack, Longest Common Subsequence (LCS), optimal substructure, memoization tables.', 1, true, 10),
  makeTopic('alg-sub-mcm', 'subj-algo', 'alg-ch-dp', 'Matrix Chain Ordering', 'Parenthesization of matrix products, minimum scalar multiplications, O(n^3) DP.', 2, true, 3),

  // --- Chapter 6: Hashing & Tree Structures ---
  makeTopic('alg-ch-hash', 'subj-algo', null, 'Hashing & Tree Structures', 'Hash functions, collision resolution (chaining, open addressing), binary search trees, and binary heaps.', 6, true),
  makeTopic('alg-sub-hashing', 'subj-algo', 'alg-ch-hash', 'Hashing', 'Hash functions, division & multiplication methods, collision frequency and search costs.', 1, true),
  makeTopic('alg-sub-bst', 'subj-algo', 'alg-ch-hash', 'Binary Search Tree', 'BST search, insertion, deletion, inorder successor in algorithmic analysis.', 2, true),
  makeTopic('alg-sub-double-hash', 'subj-algo', 'alg-ch-hash', 'Double Hashing', 'Double hashing probing sequence h(k, i) = (h1(k) + i*h2(k)) mod m.', 3, true, 2),
  makeTopic('alg-sub-lin-probe', 'subj-algo', 'alg-ch-hash', 'Linear Probing', 'Linear probing collision resolution, primary clustering effects.', 4, true),
  makeTopic('alg-sub-bin-heap', 'subj-algo', 'alg-ch-hash', 'Binary Heap', 'Min-Heap and Max-Heap array representations, Build-Heap O(n), Extract-Min O(log n).', 5, true, 1),
  makeTopic('alg-sub-bin-tree', 'subj-algo', 'alg-ch-hash', 'Binary Tree', 'Binary tree structural properties, height, internal vs leaf node relations.', 6, true),
  makeTopic('alg-sub-tree-trav', 'subj-algo', 'alg-ch-hash', 'Tree Traversal', 'Inorder, preorder, postorder, level order tree traversals in algorithms.', 7, true),
  makeTopic('alg-sub-unif-hash', 'subj-algo', 'alg-ch-hash', 'Uniform Hashing', 'Simple Uniform Hashing Assumption (SUHA), expected chain length and probe counts.', 8, true, 1),

  // =========================================================================
  // 10. COMPILER DESIGN (subj-cd) - 242 Total PYQs
  //     Organized into 5 official GATE syllabus chapters with subtopics
  // =========================================================================

  // --- Chapter 1: Lexical Analysis & System Software ---
  makeTopic('cd-ch-lex', 'subj-cd', null, 'Lexical Analysis & System Software', 'Lexical tokenization, DFA generation, compilation phases, assemblers, linkers, macros, and symbol tables.', 1, true),
  makeTopic('cd-7', 'subj-cd', 'cd-ch-lex', 'Compilation Phases', 'Lexical, Syntax, Semantic, Intermediate Code, Optimization, and Target Code generation roles.', 1, true),
  makeTopic('cd-9', 'subj-cd', 'cd-ch-lex', 'Assembler', 'Two-pass assembler design, symbol table generation, pass-1 and pass-2 processing.', 2, true),
  makeTopic('cd-sub-lex', 'subj-cd', 'cd-ch-lex', 'Lexical Analysis', 'Regular definitions, tokens, patterns, lexemes, DFA-based token recognizers.', 3, true),
  makeTopic('cd-sub-macros', 'subj-cd', 'cd-ch-lex', 'Macros', 'Macro processors, macro definitions, macro call expansions, nested macros.', 4, true),
  makeTopic('cd-sub-linker', 'subj-cd', 'cd-ch-lex', 'Linker', 'Linker relocation, symbol resolution, static vs dynamic linking, loaders.', 5, true),
  makeTopic('cd-sub-symtab', 'subj-cd', 'cd-ch-lex', 'Symbol Table', 'Symbol table operations, hash table lookup, attribute storage, scope management.', 6, true),
  makeTopic('cd-sub-tok', 'subj-cd', 'cd-ch-lex', 'Compiler tokenization', 'Counting total tokens in C code snippets, string literal and operator rules.', 7, true),

  // --- Chapter 2: Parsing & Syntax Analysis ---
  makeTopic('cd-ch-parse', 'subj-cd', null, 'Parsing & Syntax Analysis', 'Context-free grammars, LL(1) parsers, FIRST & FOLLOW sets, LR parsers (LR(0), SLR, LALR, CLR), and operator precedence.', 2, true),
  makeTopic('cd-1', 'subj-cd', 'cd-ch-parse', 'Grammar', 'Context-free grammar rules, ambiguity proofs, left recursion elimination, and left factoring.', 1, true),
  makeTopic('cd-2', 'subj-cd', 'cd-ch-parse', 'Parsing', 'Top-down and bottom-up parsing techniques, parser conflict resolution.', 2, true),
  makeTopic('cd-4', 'subj-cd', 'cd-ch-parse', 'LR Parser', 'LR(0), SLR(1), LALR(1), CLR(1) item collections, Shift-Reduce and Reduce-Reduce conflicts, state counts.', 3, true, 20),
  makeTopic('cd-10', 'subj-cd', 'cd-ch-parse', 'Operator Precedence', 'Operator grammars, precedence matrix relations, bottom-up shift-reduce operator parsing.', 4, true),
  makeTopic('cd-sub-ff', 'subj-cd', 'cd-ch-parse', 'First and Follow', 'FIRST and FOLLOW set calculation algorithms, epsilon production rules.', 5, true),
  makeTopic('cd-sub-ambig', 'subj-cd', 'cd-ch-parse', 'Ambiguous Grammar', 'Identifying grammar ambiguity, multiple leftmost derivations and multiple parse trees.', 6, true),
  makeTopic('cd-sub-ll', 'subj-cd', 'cd-ch-parse', 'LL Parser', 'LL(1) parsing table construction, non-LL(1) grammar proofs, predictive parsing.', 7, true, 2),
  makeTopic('cd-sub-viable', 'subj-cd', 'cd-ch-parse', 'Viable Prefix', 'Viable prefix definitions, valid LR items, stack contents during shift-reduce parsing.', 8, true),

  // --- Chapter 3: Syntax-Directed Translation & Intermediate Code Generation ---
  makeTopic('cd-ch-sdt', 'subj-cd', null, 'Syntax-Directed Translation & Intermediate Code Generation', 'Syntax-directed translation (SDT), S-attributed & L-attributed definitions, three-address code, DAGs, ASTs, and backpatching.', 3, true),
  makeTopic('cd-5', 'subj-cd', 'cd-ch-sdt', 'Syntax Directed Translation', 'S-attributed (synthesized only) vs L-attributed definitions, dependency graphs, bottom-up action execution.', 1, true, 19),
  makeTopic('cd-8', 'subj-cd', 'cd-ch-sdt', 'Intermediate Code', 'Three-Address Code (TAC), Quadruples, Triples, Indirect Triples.', 2, true, 11),
  makeTopic('cd-sub-dag', 'subj-cd', 'cd-ch-sdt', 'Directed Acyclic Graph', 'DAG representation of basic blocks, common subexpression identification in DAGs.', 3, true),
  makeTopic('cd-sub-expr', 'subj-cd', 'cd-ch-sdt', 'Expression Evaluation', 'SDT semantic actions for arithmetic expression evaluation and type checking.', 4, true),
  makeTopic('cd-sub-ast', 'subj-cd', 'cd-ch-sdt', 'Abstract Syntax Tree', 'Constructing Abstract Syntax Trees (AST) from parse trees, operator node representations.', 5, true, 1),
  makeTopic('cd-sub-backpatch', 'subj-cd', 'cd-ch-sdt', 'Backpatching', 'Backpatching jump targets for boolean expressions and control flow statements.', 6, true),

  // --- Chapter 4: Runtime Environments & Storage Management ---
  makeTopic('cd-ch-runtime', 'subj-cd', null, 'Runtime Environments & Storage Management', 'Activation records on stack, parameter passing mechanisms, static and dynamic scoping rules.', 4, true),
  makeTopic('cd-3', 'subj-cd', 'cd-ch-runtime', 'Runtime Environment', 'Activation records on the stack, static/dynamic scoping, local variable allocations.', 1, true),
  makeTopic('cd-6', 'subj-cd', 'cd-ch-runtime', 'Parameter Passing', 'Pass by value, pass by reference, pass by copy-restore, and pass by name evaluation.', 2, true),
  makeTopic('cd-sub-scope', 'subj-cd', 'cd-ch-runtime', 'Variable Scope', 'Static lexical scoping vs dynamic scoping execution traces and symbol resolution.', 3, true),

  // --- Chapter 5: Code Optimization & Code Generation ---
  makeTopic('cd-ch-opt', 'subj-cd', null, 'Code Optimization & Code Generation', 'Basic blocks, flow graphs, loop optimizations, data-flow analysis, SSA form, and register allocation.', 5, true),
  makeTopic('cd-sub-opt', 'subj-cd', 'cd-ch-opt', 'Code Optimization', 'Loop invariants, induction variables, strength reduction, dead code elimination.', 1, true),
  makeTopic('cd-sub-reg', 'subj-cd', 'cd-ch-opt', 'Register Allocation', 'Register allocation via graph coloring, Sethi-Ullman minimum register algorithm.', 2, true),
  makeTopic('cd-sub-live', 'subj-cd', 'cd-ch-opt', 'Live Variable Analysis', 'Liveness analysis data-flow equations In[B] = Use[B] U (Out[B] - Def[B]).', 3, true, 3),
  makeTopic('cd-sub-ssa', 'subj-cd', 'cd-ch-opt', 'Static Single Assignment', 'Static Single Assignment (SSA) form, phi-nodes, dominance frontiers.', 4, true, 3),
  makeTopic('cd-sub-bb', 'subj-cd', 'cd-ch-opt', 'Basic Blocks', 'Identifying basic block leaders, partitioning Three-Address Code into basic blocks.', 5, true),

  // =========================================================================
  // 11. DATA STRUCTURES (subj-ds) - 238 Total PYQs
  //     Organized into 4 official GATE syllabus chapters with subtopics
  // =========================================================================

  // --- Chapter 1: Linear Data Structures ---
  makeTopic('ds-ch-linear', 'subj-ds', null, 'Linear Data Structures', 'Arrays, singly & doubly linked lists, stacks, queues, double-ended queues (deque), and infix/prefix/postfix conversions.', 1, true),
  makeTopic('ds-4', 'subj-ds', 'ds-ch-linear', 'Linked List', 'Singly, Doubly, and Circular Linked Lists, in-place reversal, Floyd cycle detection.', 1, true),
  makeTopic('ds-5', 'subj-ds', 'ds-ch-linear', 'Stack', 'LIFO stack operations, parenthesis matching, stack-based function evaluation.', 2, true),
  makeTopic('ds-7', 'subj-ds', 'ds-ch-linear', 'Queue', 'FIFO queues, Circular Queue modulo arithmetic, Double-ended queue (Deque) implementations.', 3, true, 15),
  makeTopic('ds-8', 'subj-ds', 'ds-ch-linear', 'Array', 'Row-Major and Column-Major 2D/3D address calculation formulas.', 4, true),
  makeTopic('ds-sub-infix', 'subj-ds', 'ds-ch-linear', 'Infix Prefix', 'Infix to Postfix/Prefix conversion algorithms, operator stack precedence.', 5, true),
  makeTopic('ds-sub-ds-prim', 'subj-ds', 'ds-ch-linear', 'Data Structures', 'Primitive vs non-primitive data structure representations, memory layouts.', 6, true),
  makeTopic('ds-sub-adt', 'subj-ds', 'ds-ch-linear', 'Abstract Data Type', 'Abstract data type specifications, mathematical models for data types.', 7, true),

  // --- Chapter 2: Trees & Binary Search Trees (BST) ---
  makeTopic('ds-ch-tree', 'subj-ds', null, 'Trees & Binary Search Trees (BST)', 'Binary trees, traversals, BST insertion/deletion, AVL tree rotations, and general N-ary trees.', 2, true),
  makeTopic('ds-1', 'subj-ds', 'ds-ch-tree', 'Binary Tree', 'Inorder, Preorder, Postorder traversals, unique tree reconstructions, height & node count bounds L = I + 1.', 1, true),
  makeTopic('ds-2', 'subj-ds', 'ds-ch-tree', 'Binary Search Tree', 'BST search, insertion, node deletion cases, Inorder successor/predecessor.', 2, true),
  makeTopic('ds-9', 'subj-ds', 'ds-ch-tree', 'Tree', 'N-ary trees, threaded binary trees, tree representations as first-child next-sibling.', 3, true),
  makeTopic('ds-10', 'subj-ds', 'ds-ch-tree', 'AVL Tree', 'AVL height balance factor in {-1, 0, +1}, single & double rotations (LL, RR, LR, RL), minimum nodes for height h.', 4, true, 6),
  makeTopic('ds-sub-tree-trav', 'subj-ds', 'ds-ch-tree', 'Tree Traversal', 'Tree traversal algorithms, level order traversal using FIFO queue.', 5, true),

  // --- Chapter 3: Priority Queues & Binary Heaps ---
  makeTopic('ds-ch-heap', 'subj-ds', null, 'Priority Queues & Binary Heaps', 'Min-Heap and Max-Heap properties, Build-Heap O(n), Extract-Min/Max O(log n), priority queues.', 3, true),
  makeTopic('ds-3', 'subj-ds', 'ds-ch-heap', 'Binary Heap', 'Min-Heap and Max-Heap properties, Build-Heap O(n) algorithm, Extract-Min/Max O(log n), Heapify.', 1, true, 30),
  makeTopic('ds-sub-pq', 'subj-ds', 'ds-ch-heap', 'Priority Queue', 'Priority Queue implementations using arrays, linked lists, and binary heaps.', 2, true),
  makeTopic('ds-sub-time-comp', 'subj-ds', 'ds-ch-heap', 'Time Complexity', 'Amortized time complexity analysis of priority queue operations.', 3, true),

  // --- Chapter 4: Hashing & Hash Tables ---
  makeTopic('ds-ch-hash', 'subj-ds', null, 'Hashing & Hash Tables', 'Open addressing (Linear Probing, Quadratic Probing, Double Hashing), Chaining, load factors, and collision resolution.', 4, true),
  makeTopic('ds-6', 'subj-ds', 'ds-ch-hash', 'Hashing', 'Open addressing (Linear Probing, Quadratic Probing, Double Hashing), Separate Chaining, load factor alpha = n/m.', 1, true, 15),
  makeTopic('ds-sub-unif-hash', 'subj-ds', 'ds-ch-hash', 'Uniform Hashing', 'Simple uniform hashing assumption, expected probe length in open addressing.', 2, true),

  // =========================================================================
  // 12. C-PROGRAMMING (subj-prog) - 132 Total PYQs
  //     Organized into 4 official GATE syllabus chapters with subtopics
  // =========================================================================

  // --- Chapter 1: C Fundamentals, Control Flow & Loops ---
  makeTopic('pr-ch-fund', 'subj-prog', null, 'C Fundamentals, Control Flow & Loops', 'Data types, operator precedence, type conversions, bitwise operators, control structures, loops, and loop invariants.', 1, true),
  makeTopic('pr-1', 'subj-prog', 'pr-ch-fund', 'Programming In C', 'Data types, operator precedence, type conversions, bitwise operators, expressions evaluation.', 1, true),
  makeTopic('pr-7', 'subj-prog', 'pr-ch-fund', 'Output', 'Evaluating complex print statement outputs, format specifiers, side effects in expressions.', 2, true),
  makeTopic('pr-6', 'subj-prog', 'pr-ch-fund', 'Loop Invariants', 'Loop termination conditions, invariant assertions, loop bounds verification.', 3, true),
  makeTopic('pr-8', 'subj-prog', 'pr-ch-fund', 'Identify Function', 'Deducing the closed-form mathematical function or algorithm coded in C snippet.', 4, true),
  makeTopic('pr-sub-goto', 'subj-prog', 'pr-ch-fund', 'Goto', 'Unconditional jump goto statements, label scopes, structured programming flow.', 5, true),
  makeTopic('pr-sub-switch', 'subj-prog', 'pr-ch-fund', 'Switch Case', 'Switch case branching, break statements, fall-through evaluation behavior.', 6, true),
  makeTopic('pr-sub-paradigms', 'subj-prog', 'pr-ch-fund', 'Programming Paradigms', 'Procedural, imperative, modular programming paradigms in C.', 7, true),
  makeTopic('pr-sub-constructs', 'subj-prog', 'pr-ch-fund', 'Programming Constructs', 'Conditional if-else, for/while/do-while iteration constructs.', 8, true),
  makeTopic('pr-sub-type-check', 'subj-prog', 'pr-ch-fund', 'Type Checking', 'Static type checking, implicit type promotions, explicit type casts.', 9, true),

  // --- Chapter 2: Functions, Parameter Passing & Recursion ---
  makeTopic('pr-ch-recur', 'subj-prog', null, 'Functions, Parameter Passing & Recursion', 'Function prototypes, call stacks, parameter passing, recursion execution, and variable binding.', 2, true),
  makeTopic('pr-2', 'subj-prog', 'pr-ch-recur', 'Recursion', 'Recursive stack execution tracing, base cases, static and global variables inside recursive calls.', 1, true),
  makeTopic('pr-5', 'subj-prog', 'pr-ch-recur', 'Parameter Passing', 'Pass by value vs simulated pass by reference via pointer dereferencing.', 2, true),
  makeTopic('pr-10', 'subj-prog', 'pr-ch-recur', 'Functions', 'Scope, lifetime, auto, static, extern, register storage specifiers.', 3, true),
  makeTopic('pr-sub-runtime', 'subj-prog', 'pr-ch-recur', 'Runtime Environment', 'Activation records on the call stack, return address and local frame management.', 4, true),
  makeTopic('pr-sub-var-bind', 'subj-prog', 'pr-ch-recur', 'Variable Binding', 'Static vs dynamic binding, linkage of external identifiers across translation units.', 5, true),

  // --- Chapter 3: Pointers, Arrays & Strings ---
  makeTopic('pr-ch-ptr', 'subj-prog', null, 'Pointers, Arrays & Strings', 'Pointer arithmetic, arrays of pointers, multidimensional arrays, string manipulations, and aliasing.', 3, true),
  makeTopic('pr-3', 'subj-prog', 'pr-ch-ptr', 'Pointers', 'Pointer arithmetic, pointers to pointers, pointer arrays, array decaying, function pointers.', 1, true),
  makeTopic('pr-4', 'subj-prog', 'pr-ch-ptr', 'Array', 'Multidimensional arrays, pointer equivalence a[i] == *(a+i) == i[a], base address offsets.', 2, true, 13),
  makeTopic('pr-sub-strings', 'subj-prog', 'pr-ch-ptr', 'Strings', 'Null-terminated string arrays, string library functions (strcpy, strlen, strcmp).', 3, true, 2),
  makeTopic('pr-sub-aliasing', 'subj-prog', 'pr-ch-ptr', 'Aliasing', 'Pointer aliasing, compiler optimizations with restrict qualifiers, side effects.', 4, true),

  // --- Chapter 4: Structures & Unions ---
  makeTopic('pr-ch-struct', 'subj-prog', null, 'Structures & Unions', 'User-defined data types, structure padding, memory alignment, union overlapping fields.', 4, true),
  makeTopic('pr-9', 'subj-prog', 'pr-ch-struct', 'Structure', 'Memory layout, word alignment, structure padding, sizeof calculations, nested structures.', 1, true),
  makeTopic('pr-sub-union', 'subj-prog', 'pr-ch-struct', 'Union', 'Union memory allocation, largest member size, overlapping memory members.', 2, true),

  // =========================================================================
  // 13. THEORY OF COMPUTATION (subj-toc) - 293 Total PYQs
  //     Organized into 4 official GATE chapters with subtopics
  // =========================================================================

  // --- Chapter 1: Regular Expressions & Finite Automata ---
  makeTopic('toc-ch-reg', 'subj-toc', null, 'Regular Expressions & Finite Automata', 'DFA/NFA, minimization, regular expressions, Arden theorem, non-determinism, regular grammars, and pumping lemma.', 1, true),
  makeTopic('toc-1', 'subj-toc', 'toc-ch-reg', 'Finite Automata', 'DFA and NFA state machines, transition functions, subset construction, modulo language recognizers.', 1, true),
  makeTopic('toc-3', 'subj-toc', 'toc-ch-reg', 'Regular Language', 'Properties of regular languages, closure properties, union/intersection/complement/concatenation.', 2, true),
  makeTopic('toc-6', 'subj-toc', 'toc-ch-reg', 'Regular Expression', 'RegEx identities, Arden Theorem, converting DFAs to regular expressions, non-regular language proofs.', 3, true),
  makeTopic('toc-7', 'subj-toc', 'toc-ch-reg', 'Minimal State Automata', 'DFA state minimization algorithm, Myhill-Nerode equivalence theorem, minimum state bounds.', 4, true),
  makeTopic('toc-sub-nondet', 'subj-toc', 'toc-ch-reg', 'Non Determinism', 'NFA with epsilon transitions, subset construction power set 2^Q, non-deterministic power.', 5, true),
  makeTopic('toc-sub-reg-gram', 'subj-toc', 'toc-ch-reg', 'Regular Grammar', 'Right-linear and left-linear regular grammars, grammar to finite automaton conversions.', 6, true),
  makeTopic('toc-sub-num-states', 'subj-toc', 'toc-ch-reg', 'Number of States', 'Minimum number of states required in DFA for string matching and divisible-by-k languages.', 7, true),
  makeTopic('toc-sub-pumping', 'subj-toc', 'toc-ch-reg', 'Pumping Lemma', 'Pumping Lemma for regular languages w = xyz, pumping length, proving non-regularity.', 8, true),
  makeTopic('toc-sub-fsm', 'subj-toc', 'toc-ch-reg', 'Finite State Machines', 'Mealy and Moore machine output models, state table to state transition diagram conversions.', 9, true),

  // --- Chapter 2: Context-Free Languages & Pushdown Automata ---
  makeTopic('toc-ch-cfl', 'subj-toc', null, 'Context-Free Languages & Pushdown Automata', 'Context-free grammars, pushdown automata, DPDA vs NPDA, ambiguity, and parse trees.', 2, true),
  makeTopic('toc-2', 'subj-toc', 'toc-ch-cfl', 'Context Free Language', 'Context-free grammars, Pushdown Automata, parse trees, inherently ambiguous languages.', 1, true),
  makeTopic('toc-9', 'subj-toc', 'toc-ch-cfl', 'Pushdown Automata', 'Deterministic PDA (DCFL) vs Non-Deterministic PDA (CFL), acceptance by empty stack vs final state.', 2, true, 15),
  makeTopic('toc-sub-cfg', 'subj-toc', 'toc-ch-cfl', 'Context Free Grammar', 'CFG production rules, Chomsky Normal Form (CNF), Greibach Normal Form (GNF), derivation ambiguity.', 3, true, 2),
  makeTopic('toc-sub-dpda', 'subj-toc', 'toc-ch-cfl', 'Dpda', 'Deterministic Pushdown Automata (DPDA), language power DCFL subset of CFL, complementation of DCFL.', 4, true, 1),

  // --- Chapter 3: Language Hierarchy & Closure Properties ---
  makeTopic('toc-ch-class', 'subj-toc', null, 'Language Hierarchy & Closure Properties', 'Chomsky hierarchy, language classification (Regular, DCFL, CFL, CSL, Recursive, RE), and closure tables.', 3, true),
  makeTopic('toc-4', 'subj-toc', 'toc-ch-class', 'Identify Class Language', 'Determining whether a given language L is Regular, DCFL, CFL, CSL, Recursive, or RE.', 1, true),
  makeTopic('toc-10', 'subj-toc', 'toc-ch-class', 'Closure Property', 'Comprehensive closure table under Union, Intersection, Complement, Star, Homomorphism, Inverse.', 2, true),
  makeTopic('toc-sub-countable', 'subj-toc', 'toc-ch-class', 'Countable Uncountable Set', 'Countable languages, Cantor diagonalization, set of all languages 2^(Sigma*) is uncountable.', 3, true, 3),
  makeTopic('toc-sub-medium', 'subj-toc', 'toc-ch-class', 'Medium', 'Medium language complexity recognizers, multi-stack automaton language classes.', 4, true),

  // --- Chapter 4: Turing Machines, Decidability & Reducibility ---
  makeTopic('toc-ch-dec', 'subj-toc', null, 'Turing Machines, Decidability & Reducibility', 'Turing machines, halting problem, decidability/undecidability, Rice theorem, and reductions.', 4, true),
  makeTopic('toc-5', 'subj-toc', 'toc-ch-dec', 'Decidability', 'Decidable vs Undecidable problems for Regular, CFL, and Turing Machines, Halting Problem, Rice Theorem.', 1, true),
  makeTopic('toc-8', 'subj-toc', 'toc-ch-dec', 'Recursive and Recursively Enumerable Languages', 'Turing machine acceptance (halts on yes) vs total Turing machines (halts on all), Chomsky hierarchy.', 2, true, 16),
  makeTopic('toc-sub-reduction', 'subj-toc', 'toc-ch-dec', 'Reduction', 'Mapping reduction A <=m B, proving undecidability and non-RE properties using reductions.', 3, true),
  makeTopic('toc-sub-tm', 'subj-toc', 'toc-ch-dec', 'Turing Machine', 'Single-tape and multi-tape Turing Machines, transition function delta, configuration transitions.', 4, true),
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
