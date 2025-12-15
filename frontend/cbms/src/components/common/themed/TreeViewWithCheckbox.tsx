/**
 * @파일명 : TreeViewWithCheckbox.tsx
 * @설명 : 체크박스가 있는 트리뷰 컴포넌트 (메뉴 권한 관리용)
 * @작성일 : 2025.12.12
 * @기능 : R/W 체크박스, 접기/펼치기, 계층 구조 표시
 */

"use client";

import React, { useState, useMemo } from "react";
import { theme } from "@/styles/theme";
import { Button } from "./Button";

export interface TreeNodeWithPermission {
  id: string | number;
  label: string;
  children?: TreeNodeWithPermission[];
  data?: {
    menuCd: string;
    menuRw?: string;
    useYn?: string;
    [key: string]: any;
  };
}

export interface TreeViewWithCheckboxProps {
  data: TreeNodeWithPermission[];
  permissions: Record<string, { menuRw: string; useYn: string }>;
  isEditMode?: boolean;
  onPermissionChange: (
    menuCd: string,
    type: "create" | "read" | "update" | "delete" | "useYn",
    checked: boolean
  ) => void;
  onBulkPermissionChange?: (
    type: "create" | "read" | "update" | "delete" | "useYn",
    checked: boolean
  ) => void;
  defaultExpandAll?: boolean;
  showControls?: boolean;
}

interface TreeNodeItemProps {
  node: TreeNodeWithPermission;
  level: number;
  expandedNodes: Set<string | number>;
  onToggle: (nodeId: string | number) => void;
  permissions: Record<string, { menuRw: string; useYn: string }>;
  isEditMode: boolean;
  onPermissionChange: (
    menuCd: string,
    type: "create" | "read" | "update" | "delete" | "useYn",
    checked: boolean
  ) => void;
}

const TreeNodeItem: React.FC<TreeNodeItemProps> = ({
  node,
  level,
  expandedNodes,
  onToggle,
  permissions,
  isEditMode,
  onPermissionChange,
}) => {
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expandedNodes.has(node.id);
  const [isHovered, setIsHovered] = useState(false);

  const menuCd = node.data?.menuCd || String(node.id);
  const permission = permissions[menuCd];
  const menuRw = permission?.menuRw;
  const useYn = permission?.useYn;

  // menuRw에 따른 체크 상태 결정
  const isCreate = menuRw ? menuRw.includes("C") : false;
  const isRead = menuRw ? menuRw.includes("R") : false;
  const isUpdate = menuRw ? menuRw.includes("U") : false;
  const isDelete = menuRw ? menuRw.includes("D") : false;
  const isUseYn = useYn === "Y";

  const nodeStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    paddingLeft: `${level * 24 + 8}px`,
    borderRadius: theme.borderRadius.sm,
    transition: theme.effects.transitions.default,
    backgroundColor: isHovered
      ? theme.colors.background.overlay
      : "transparent",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "14px",
    color: theme.colors.text.primary,
    fontWeight: level === 0 ? theme.typography.weights.semibold : "normal",
    flex: 1,
    marginRight: theme.spacing.sm,
  };

  const toggleIconStyle: React.CSSProperties = {
    marginRight: theme.spacing.xs,
    color: isExpanded
      ? theme.colors.primary.default
      : theme.colors.text.tertiary,
    fontSize: "12px",
    width: "16px",
    cursor: hasChildren ? "pointer" : "default",
    visibility: hasChildren ? "visible" : "hidden",
    transition: theme.effects.transitions.default,
  };

  const checkboxContainerStyle: React.CSSProperties = {
    display: "flex",
    gap: theme.spacing.md,
    alignItems: "center",
  };

  const checkboxLabelStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing.xs,
    fontSize: "13px",
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    cursor: "pointer",
    userSelect: "none",
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.background.subtle,
    border: `1px solid ${theme.colors.border.default}`,
    transition: theme.effects.transitions.default,
  };

  return (
    <>
      <div
        style={nodeStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <span
          style={toggleIconStyle}
          onClick={(e) => {
            e.stopPropagation();
            if (hasChildren) onToggle(node.id);
          }}
        >
          {hasChildren ? (isExpanded ? "▼" : "▶") : ""}
        </span>

        <span style={labelStyle}>{node.label}</span>

        <div style={checkboxContainerStyle}>
          <label
            style={{
              ...checkboxLabelStyle,
              cursor: isEditMode ? "pointer" : "default",
              backgroundColor: isCreate
                ? isEditMode
                  ? theme.colors.status.success
                  : "rgba(39, 201, 134, 0.5)"
                : theme.colors.background.subtle,
              color: isCreate ? "#FFFFFF" : theme.colors.text.primary,
              borderColor: isCreate
                ? theme.colors.status.success
                : theme.colors.border.default,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="checkbox"
              checked={isCreate}
              disabled={!isEditMode}
              onChange={(e) =>
                onPermissionChange(menuCd, "create", e.target.checked)
              }
              style={{
                cursor: isEditMode ? "pointer" : "default",
                width: "16px",
                height: "16px",
              }}
            />
            C
          </label>
          <label
            style={{
              ...checkboxLabelStyle,
              cursor: isEditMode ? "pointer" : "default",
              backgroundColor: isRead
                ? isEditMode
                  ? theme.colors.primary.default
                  : "rgba(94, 106, 210, 0.5)"
                : theme.colors.background.subtle,
              color: isRead ? "#FFFFFF" : theme.colors.text.primary,
              borderColor: isRead
                ? theme.colors.primary.default
                : theme.colors.border.default,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="checkbox"
              checked={isRead}
              disabled={!isEditMode}
              onChange={(e) =>
                onPermissionChange(menuCd, "read", e.target.checked)
              }
              style={{
                cursor: isEditMode ? "pointer" : "default",
                width: "16px",
                height: "16px",
              }}
            />
            R
          </label>
          <label
            style={{
              ...checkboxLabelStyle,
              cursor: isEditMode ? "pointer" : "default",
              backgroundColor: isUpdate
                ? isEditMode
                  ? "#F59E0B"
                  : "rgba(245, 158, 11, 0.5)"
                : theme.colors.background.subtle,
              color: isUpdate ? "#FFFFFF" : theme.colors.text.primary,
              borderColor: isUpdate ? "#F59E0B" : theme.colors.border.default,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="checkbox"
              checked={isUpdate}
              disabled={!isEditMode}
              onChange={(e) =>
                onPermissionChange(menuCd, "update", e.target.checked)
              }
              style={{
                cursor: isEditMode ? "pointer" : "default",
                width: "16px",
                height: "16px",
              }}
            />
            U
          </label>
          <label
            style={{
              ...checkboxLabelStyle,
              cursor: isEditMode ? "pointer" : "default",
              backgroundColor: isDelete
                ? isEditMode
                  ? theme.colors.status.error
                  : "rgba(239, 68, 68, 0.5)"
                : theme.colors.background.subtle,
              color: isDelete ? "#FFFFFF" : theme.colors.text.primary,
              borderColor: isDelete
                ? theme.colors.status.error
                : theme.colors.border.default,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="checkbox"
              checked={isDelete}
              disabled={!isEditMode}
              onChange={(e) =>
                onPermissionChange(menuCd, "delete", e.target.checked)
              }
              style={{
                cursor: isEditMode ? "pointer" : "default",
                width: "16px",
                height: "16px",
              }}
            />
            D
          </label>
          <label
            style={{
              ...checkboxLabelStyle,
              cursor: isEditMode ? "pointer" : "default",
              backgroundColor: isUseYn
                ? isEditMode
                  ? theme.colors.status.info
                  : "rgba(59, 130, 246, 0.5)"
                : theme.colors.background.subtle,
              color: isUseYn ? "#FFFFFF" : theme.colors.text.primary,
              borderColor: isUseYn
                ? theme.colors.status.info
                : theme.colors.border.default,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="checkbox"
              checked={isUseYn}
              disabled={!isEditMode}
              onChange={(e) =>
                onPermissionChange(menuCd, "useYn", e.target.checked)
              }
              style={{
                cursor: isEditMode ? "pointer" : "default",
                width: "16px",
                height: "16px",
              }}
            />
            사용
          </label>
        </div>
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
              permissions={permissions}
              isEditMode={isEditMode}
              onPermissionChange={onPermissionChange}
            />
          ))}
        </div>
      )}
    </>
  );
};

export const TreeViewWithCheckbox: React.FC<TreeViewWithCheckboxProps> = ({
  data,
  permissions,
  isEditMode = false,
  onPermissionChange,
  onBulkPermissionChange,
  defaultExpandAll = true,
  showControls = true,
}) => {
  // 모든 노드 ID를 수집하는 함수
  const getAllNodeIds = (
    nodes: TreeNodeWithPermission[]
  ): (string | number)[] => {
    const ids: (string | number)[] = [];
    const traverse = (node: TreeNodeWithPermission) => {
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

  // 전체 펼침 상태 확인
  const isAllExpanded = expandedNodes.size === allNodeIds.length;

  // 펼치기/접기 토글
  const handleToggleExpand = () => {
    if (isAllExpanded) {
      setExpandedNodes(new Set());
    } else {
      setExpandedNodes(new Set(allNodeIds));
    }
  };

  // 전체 C 체크 여부 계산
  const allCreateChecked = useMemo(() => {
    const menuCodes = Object.keys(permissions);
    return (
      menuCodes.length > 0 &&
      menuCodes.every((code) => permissions[code]?.menuRw?.includes("C"))
    );
  }, [permissions]);

  // 전체 R 체크 여부 계산
  const allReadChecked = useMemo(() => {
    const menuCodes = Object.keys(permissions);
    return (
      menuCodes.length > 0 &&
      menuCodes.every((code) => permissions[code]?.menuRw?.includes("R"))
    );
  }, [permissions]);

  // 전체 U 체크 여부 계산
  const allUpdateChecked = useMemo(() => {
    const menuCodes = Object.keys(permissions);
    return (
      menuCodes.length > 0 &&
      menuCodes.every((code) => permissions[code]?.menuRw?.includes("U"))
    );
  }, [permissions]);

  // 전체 D 체크 여부 계산
  const allDeleteChecked = useMemo(() => {
    const menuCodes = Object.keys(permissions);
    return (
      menuCodes.length > 0 &&
      menuCodes.every((code) => permissions[code]?.menuRw?.includes("D"))
    );
  }, [permissions]);

  // C 전체 체크/해제 토글
  const handleToggleAllCreate = () => {
    if (onBulkPermissionChange) {
      onBulkPermissionChange("create", !allCreateChecked);
    }
  };

  // R 전체 체크/해제 토글
  const handleToggleAllRead = () => {
    if (onBulkPermissionChange) {
      onBulkPermissionChange("read", !allReadChecked);
    }
  };

  // U 전체 체크/해제 토글
  const handleToggleAllUpdate = () => {
    if (onBulkPermissionChange) {
      onBulkPermissionChange("update", !allUpdateChecked);
    }
  };

  // D 전체 체크/해제 토글
  const handleToggleAllDelete = () => {
    if (onBulkPermissionChange) {
      onBulkPermissionChange("delete", !allDeleteChecked);
    }
  };

  // 전체 UseYn 체크 여부 계산
  const allUseYnChecked = useMemo(() => {
    const menuCodes = Object.keys(permissions);
    return (
      menuCodes.length > 0 &&
      menuCodes.every((code) => permissions[code]?.useYn === "Y")
    );
  }, [permissions]);

  // UseYn 전체 체크/해제 토글
  const handleToggleAllUseYn = () => {
    if (onBulkPermissionChange) {
      onBulkPermissionChange("useYn", !allUseYnChecked);
    }
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

  if (!data || data.length === 0) {
    return (
      <div
        style={{
          ...containerStyle,
          textAlign: "center",
          padding: theme.spacing.xl,
          color: theme.colors.text.secondary,
        }}
      >
        트리 데이터가 없습니다.
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {showControls && (
        <div style={controlsStyle}>
          <Button size="sm" variant="secondary" onClick={handleToggleExpand}>
            {isAllExpanded ? "접기" : "펼치기"}
          </Button>
          {isEditMode && onBulkPermissionChange && (
            <>
              <Button
                size="sm"
                variant="secondary"
                onClick={handleToggleAllCreate}
              >
                {allCreateChecked ? "전체 C 해제" : "전체 C 체크"}
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={handleToggleAllRead}
              >
                {allReadChecked ? "전체 R 해제" : "전체 R 체크"}
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={handleToggleAllUpdate}
              >
                {allUpdateChecked ? "전체 U 해제" : "전체 U 체크"}
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={handleToggleAllDelete}
              >
                {allDeleteChecked ? "전체 D 해제" : "전체 D 체크"}
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={handleToggleAllUseYn}
              >
                {allUseYnChecked ? "전체 사용 해제" : "전체 사용 체크"}
              </Button>
            </>
          )}
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
            permissions={permissions}
            isEditMode={isEditMode}
            onPermissionChange={onPermissionChange}
          />
        ))}
      </div>
    </div>
  );
};
