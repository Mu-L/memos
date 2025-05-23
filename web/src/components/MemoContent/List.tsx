import { head } from "lodash-es";
import React from "react";
import { ListNode_Kind, Node, NodeType } from "@/types/proto/api/v1/markdown_service";
import { cn } from "@/utils";
import Renderer from "./Renderer";

interface Props {
  index: string;
  kind: ListNode_Kind;
  indent: number;
  children: Node[];
}

const List: React.FC<Props> = ({ kind, indent, children }: Props) => {
  let prevNode: Node | null = null;
  let skipNextLineBreakFlag = false;

  const getListContainer = () => {
    switch (kind) {
      case ListNode_Kind.ORDERED:
        return "ol";
      case ListNode_Kind.UNORDERED:
        return "ul";
      case ListNode_Kind.DESCRIPTION:
        return "dl";
      default:
        return "div";
    }
  };

  const getAttributes = () => {
    if (kind === ListNode_Kind.ORDERED) {
      const firstChild = head(children);
      if (firstChild?.type === NodeType.ORDERED_LIST_ITEM) {
        return {
          start: firstChild.orderedListItemNode?.number,
        };
      }
    }
    return {};
  };

  return React.createElement(
    getListContainer(),
    {
      className: cn(
        "list-inside break-all",
        kind === ListNode_Kind.ORDERED ? "list-decimal" : kind === ListNode_Kind.UNORDERED ? "list-disc" : "list-none",
      ),
      style: { paddingLeft: `${indent * 6}px` },
      ...getAttributes(),
    },
    children.map((child, index) => {
      if (prevNode?.type !== NodeType.LINE_BREAK && child.type === NodeType.LINE_BREAK && skipNextLineBreakFlag) {
        skipNextLineBreakFlag = false;
        return null;
      }

      prevNode = child;
      skipNextLineBreakFlag = true;
      return <Renderer key={`${child.type}-${index}`} index={String(index)} node={child} />;
    }),
  );
};

export default List;
