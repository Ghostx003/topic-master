import { Topic, TopicTreeNodeType } from '../types/topic';

/**
 * Builds a recursive tree from a flat list of topics.
 */
export function buildTopicTree(
  topics: Topic[],
  subjectId?: string,
  parentId: string | null = null,
  currentDepth: number = 0
): TopicTreeNodeType[] {
  const filtered = topics.filter((t) => {
    const matchesSubject = subjectId ? t.Subject_Id === subjectId : true;
    const matchesParent = t.Parent_Id === parentId;
    return matchesSubject && matchesParent;
  });

  // Sort by Topic_Order or created_at
  filtered.sort((a, b) => (a.Topic_Order ?? 0) - (b.Topic_Order ?? 0));

  return filtered.map((topic) => ({
    ...topic,
    depth: currentDepth,
    children: buildTopicTree(topics, subjectId, topic.id, currentDepth + 1),
  }));
}

/**
 * Flattens a recursive topic tree into a linear list retaining depth metadata.
 */
export function flattenTopicTree(tree: TopicTreeNodeType[]): TopicTreeNodeType[] {
  const result: TopicTreeNodeType[] = [];

  function traverse(nodes: TopicTreeNodeType[]) {
    for (const node of nodes) {
      result.push(node);
      if (node.children && node.children.length > 0) {
        traverse(node.children);
      }
    }
  }

  traverse(tree);
  return result;
}

/**
 * Retrieves all descendant IDs of a given topic (children, grandchildren, etc.).
 */
export function getAllDescendantIds(topics: Topic[], topicId: string): string[] {
  const descendantIds: string[] = [];

  function findChildren(parentId: string) {
    const children = topics.filter((t) => t.Parent_Id === parentId);
    for (const child of children) {
      descendantIds.push(child.id);
      findChildren(child.id);
    }
  }

  findChildren(topicId);
  return descendantIds;
}

/**
 * Gets breadcrumb path from root to current topic.
 */
export function getTopicPath(topics: Topic[], topicId: string): Topic[] {
  const path: Topic[] = [];
  let current = topics.find((t) => t.id === topicId);

  while (current) {
    path.unshift(current);
    if (!current.Parent_Id) break;
    current = topics.find((t) => t.id === current?.Parent_Id);
  }

  return path;
}

/**
 * Gets the direct subtopics for a parent topic.
 */
export function getDirectChildren(topics: Topic[], parentId: string): Topic[] {
  return topics
    .filter((t) => t.Parent_Id === parentId)
    .sort((a, b) => (a.Topic_Order ?? 0) - (b.Topic_Order ?? 0));
}

/**
 * Counts total topics and completed topics recursively for a subject or parent topic.
 */
export function calculateTopicProgress(topics: Topic[], subjectId?: string) {
  const subjectTopics = subjectId ? topics.filter((t) => t.Subject_Id === subjectId) : topics;
  const total = subjectTopics.length;
  const completed = subjectTopics.filter((t) => t.Topic_Tags?.Done || t.Topic_Status === 'Done').length;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
  const totalHours = subjectTopics.reduce((sum, t) => sum + (t.Topic_Study_Hours || 0), 0);

  return {
    total,
    completed,
    percentage,
    totalHours: Number(totalHours.toFixed(1)),
  };
}
