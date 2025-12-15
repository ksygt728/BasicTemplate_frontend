/**
 * @파일명 : TreeView.tsx
 * @설명 : 트리 형태의 계층 구조를 표시하는 컴포넌트 (조직도, 부서 구조 등)
 * @작성일 : 2025.12.10
 * @기능 : 접기/펼치기, 전체 접기/펼치기, 노드 클릭, 아이콘 커스터마이징
 */

"use client";

import React, { useState, useMemo } from "react";
import { theme } from "@/styles/theme";
import { Button } from "./Button";

export interface TreeNode {
  id: string | number;
  label: string;
  children?: TreeNode[];
  icon?: React.ReactNode;
  data?: any; // 추가 데이터 (예: DepartmentResDto)
  highlighted?: boolean; // 검색 결과 하이라이트용
}

export interface TreeViewProps {
  data: TreeNode[];
  onNodeClick?: (node: TreeNode) => void;
  defaultExpandAll?: boolean;
  showControls?: boolean;
  className?: string;
}

interface TreeNodeItemProps {
  node: TreeNode;
  level: number;
  expandedNodes: Set<string | number>;
  onToggle: (nodeId: string | number) => void;
  onNodeClick?: (node: TreeNode) => void;
}

const TreeNodeItem: React.FC<TreeNodeItemProps> = ({
  node,
  level,
  expandedNodes,
  onToggle,
  onNodeClick,
}) => {
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expandedNodes.has(node.id);

  const nodeStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    paddingLeft: `${level * 24 + 8}px`,
    cursor: "pointer",
    borderRadius: theme.borderRadius.sm,
    transition: theme.effects.transitions.default,
    userSelect: "none",
  };

  const [isHovered, setIsHovered] = useState(false);

  const currentNodeStyle: React.CSSProperties = {
    ...nodeStyle,
    backgroundColor: node.highlighted
      ? "rgba(94, 106, 210, 0.15)" // 하이라이트 색상
      : isHovered
      ? theme.colors.background.overlay
      : "transparent",
    border: node.highlighted
      ? `1px solid ${theme.colors.primary.default}`
      : "1px solid transparent",
  };

  const iconStyle: React.CSSProperties = {
    marginRight: theme.spacing.xs,
    color: theme.colors.text.secondary,
    fontSize: "14px",
    width: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "14px",
    color: node.highlighted
      ? theme.colors.primary.default
      : theme.colors.text.primary,
    fontWeight: node.highlighted
      ? theme.typography.weights.semibold
      : level === 0
      ? theme.typography.weights.semibold
      : "normal",
    flex: 1,
  };

  const folderIconStyle: React.CSSProperties = {
    ...iconStyle,
    color: isExpanded
      ? theme.colors.primary.default
      : theme.colors.text.tertiary,
  };

  return (
    <>
      <div
        style={currentNodeStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => {
          if (hasChildren) {
            onToggle(node.id);
          }
          onNodeClick?.(node);
        }}
      >
        {hasChildren ? (
          <span style={folderIconStyle}>{isExpanded ? "▼" : "▶"}</span>
        ) : (
          <span style={iconStyle}>{node.icon || "📄"}</span>
        )}
        <span style={labelStyle}>{node.label}</span>
        {node.data?.deptCode && (
          <span
            style={{
              fontSize: "12px",
              color: theme.colors.text.tertiary,
              marginLeft: theme.spacing.xs,
            }}
          >
            ({node.data.deptCode})
          </span>
        )}
      </div>
      {hasChildren && isExpanded && (
        <div>
          {node.children!.map((child) => (
            <TreeNodeItem
              key={child.id}
              node={child}
              level={level + 1}
              expandedNodes={expandedNodes}
              onToggle={onToggle}
              onNodeClick={onNodeClick}
            />
          ))}
        </div>
      )}
    </>
  );
};

export const TreeView: React.FC<TreeViewProps> = ({
  data,
  onNodeClick,
  defaultExpandAll = false,
  showControls = true,
  className = "",
}) => {
  // 모든 노드 ID를 수집하는 함수
  const getAllNodeIds = (nodes: TreeNode[]): (string | number)[] => {
    const ids: (string | number)[] = [];
    const traverse = (node: TreeNode) => {
      ids.push(node.id);
      if (node.children) {
        node.children.forEach(traverse);
      }
    };
    nodes.forEach(traverse);
    return ids;
  };

  const allNodeIds = useMemo(() => getAllNodeIds(data), [data]);

  const [expandedNodes, setExpandedNodes] = useState<Set<string | number>>(() =>
    defaultExpandAll ? new Set(allNodeIds) : new Set()
  );

  const handleToggle = (nodeId: string | number) => {
    setExpandedNodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  const handleExpandAll = () => {
    setExpandedNodes(new Set(allNodeIds));
  };

  const handleCollapseAll = () => {
    setExpandedNodes(new Set());
  };

  const containerStyle: React.CSSProperties = {
    backgroundColor: theme.colors.background.surface,
    border: `1px solid ${theme.colors.border.default}`,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    fontFamily: theme.typography.fontFamily,
  };

  const controlsStyle: React.CSSProperties = {
    display: "flex",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    borderBottom: `1px solid ${theme.colors.border.default}`,
  };

  return (
    <div style={containerStyle} className={className}>
      {showControls && (
        <div style={controlsStyle}>
          <Button size="sm" variant="secondary" onClick={handleExpandAll}>
            전체 펼치기
          </Button>
          <Button size="sm" variant="secondary" onClick={handleCollapseAll}>
            전체 접기
          </Button>
        </div>
      )}
      <div>
        {data.map((node) => (
          <TreeNodeItem
            key={node.id}
            node={node}
            level={0}
            expandedNodes={expandedNodes}
            onToggle={handleToggle}
            onNodeClick={onNodeClick}
          />
        ))}
      </div>
    </div>
  );
};
