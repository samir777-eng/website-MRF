"use client";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from "./context-menu";

export interface ContextAction {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  shortcut?: string;
  variant?: "default" | "destructive";
  separator?: boolean;
}

interface ContextMenuWrapperProps {
  children: React.ReactNode;
  actions: ContextAction[];
}

export function ContextMenuWrapper({ children, actions }: ContextMenuWrapperProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent>
        {actions.map((action, index) => (
          <div key={index}>
            <ContextMenuItem
              onClick={action.onClick}
              className={action.variant === "destructive" ? "text-destructive" : ""}
            >
              <div className="flex items-center justify-between w-full gap-4">
                <div className="flex items-center gap-2">
                  {action.icon}
                  <span>{action.label}</span>
                </div>
                {action.shortcut && (
                  <span className="text-sm text-muted-foreground">
                    {action.shortcut}
                  </span>
                )}
              </div>
            </ContextMenuItem>
            {action.separator && <ContextMenuSeparator />}
          </div>
        ))}
      </ContextMenuContent>
    </ContextMenu>
  );
}

