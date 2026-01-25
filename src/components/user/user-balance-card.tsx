"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Coins, CreditCard, Plus, Wallet } from "lucide-react";
import Link from "next/link";

interface UserBalanceCardProps {
  coins: number;
  walletBalance?: number;
  className?: string;
  showAddButton?: boolean;
  compact?: boolean;
}

export function UserBalanceCard({
  coins,
  walletBalance = 0,
  className = "",
  showAddButton = true,
  compact = false,
}: UserBalanceCardProps) {
  if (compact) {
    return (
      <TooltipProvider>
        <div className={`flex items-center gap-3 ${className}`}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 dark:bg-amber-900/20 rounded-full">
                <Coins className="w-4 h-4 text-amber-600" />
                <span className="font-bold text-amber-700 dark:text-amber-300">
                  {coins.toLocaleString("ar-EG")}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>رصيد العملات</p>
            </TooltipContent>
          </Tooltip>

          {walletBalance > 0 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 dark:bg-green-900/20 rounded-full">
                  <Wallet className="w-4 h-4 text-green-600" />
                  <span className="font-bold text-green-700 dark:text-green-300">
                    {walletBalance.toLocaleString("ar-EG")} جنيه
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>رصيد المحفظة</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </TooltipProvider>
    );
  }

  return (
    <Card className={`${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            {/* Coins Balance */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/20 rounded-lg">
                <Coins className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">العملات</p>
                <p className="text-xl font-bold">{coins.toLocaleString("ar-EG")}</p>
              </div>
            </div>

            {/* Wallet Balance */}
            {walletBalance > 0 && (
              <>
                <div className="h-10 w-px bg-border" />
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <Wallet className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">المحفظة</p>
                    <p className="text-xl font-bold">{walletBalance.toLocaleString("ar-EG")} جنيه</p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Add Balance Button */}
          {showAddButton && (
            <Link href="/ar/store">
              <Button variant="outline" size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                شحن الرصيد
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Inline balance display for headers/navbars
 */
export function InlineBalance({
  coins,
  className = "",
}: {
  coins: number;
  className?: string;
}) {
  return (
    <Link href="/ar/store">
      <Badge
        variant="outline"
        className={`gap-1.5 px-3 py-1.5 cursor-pointer hover:bg-accent transition-colors ${className}`}
      >
        <Coins className="w-4 h-4 text-amber-600" />
        <span className="font-bold">{coins.toLocaleString("ar-EG")}</span>
      </Badge>
    </Link>
  );
}

