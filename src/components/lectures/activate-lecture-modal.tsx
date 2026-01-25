"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DEFAULT_SETTINGS } from "@/lib/lives-system";
import { AlertCircle, CheckCircle, Clock, Heart, Play } from "lucide-react";
import { useState } from "react";

interface ActivateLectureModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lectureTitle: string;
  lectureNumber?: number;
  accessDays?: number;
  livesCount?: number;
  livesExpiryDays?: number;
  lifeExtensionDays?: number;
  onConfirm: () => Promise<void> | void;
}

export function ActivateLectureModal({
  open,
  onOpenChange,
  lectureTitle,
  lectureNumber,
  accessDays = DEFAULT_SETTINGS.default_access_days,
  livesCount = DEFAULT_SETTINGS.default_max_lives,
  livesExpiryDays = DEFAULT_SETTINGS.default_lives_expiry_days,
  lifeExtensionDays = DEFAULT_SETTINGS.default_life_extension_days,
  onConfirm,
}: ActivateLectureModalProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [understood, setUnderstood] = useState(false);

  const handleConfirm = async () => {
    if (!understood) return;

    setIsConfirming(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } finally {
      setIsConfirming(false);
      setUnderstood(false);
    }
  };

  const handleClose = () => {
    if (!isConfirming) {
      onOpenChange(false);
      setUnderstood(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Play className="w-5 h-5 text-primary" />
            تفعيل المحاضرة
          </DialogTitle>
          <DialogDescription>
            {lectureNumber && `المحاضرة ${lectureNumber}: `}
            {lectureTitle}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Important notice */}
          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-amber-700 dark:text-amber-400">
                  تنبيه مهم
                </p>
                <p className="text-muted-foreground mt-1">
                  بمجرد التفعيل، سيبدأ العد التنازلي للوصول للمحاضرة ولا يمكن
                  إيقافه.
                </p>
              </div>
            </div>
          </div>

          {/* Access details */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Clock className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium">مدة الوصول</p>
                <p className="text-xs text-muted-foreground">
                  {accessDays} أيام من وقت التفعيل
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Heart className="w-5 h-5 text-rose-500" />
              <div>
                <p className="text-sm font-medium">{livesCount} حياة</p>
                <p className="text-xs text-muted-foreground">
                  كل حياة تمدد الوصول {lifeExtensionDays} أيام (صالحة لـ{" "}
                  {livesExpiryDays} يوم)
                </p>
              </div>
            </div>
          </div>

          {/* Confirmation checkbox */}
          <div className="flex items-start gap-3 pt-2">
            <Checkbox
              id="understood"
              checked={understood}
              onCheckedChange={(checked) => setUnderstood(checked === true)}
              className="mt-0.5"
            />
            <label
              htmlFor="understood"
              className="text-sm text-muted-foreground cursor-pointer"
            >
              أفهم أن العد التنازلي سيبدأ فوراً ولن أتمكن من إيقافه أو استرداد
              التفعيل
            </label>
          </div>
        </div>

        <DialogFooter className="flex-row-reverse gap-2">
          <Button
            onClick={handleConfirm}
            disabled={!understood || isConfirming}
            className="flex-1 sm:flex-none"
          >
            {isConfirming ? (
              <>جاري التفعيل...</>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 me-2" />
                تفعيل الآن
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isConfirming}
            className="flex-1 sm:flex-none"
          >
            إلغاء
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
