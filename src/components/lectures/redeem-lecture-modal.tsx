"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Heart,
  Package,
  Sparkles,
  Video,
} from "lucide-react";
import { useState } from "react";

interface UserBundle {
  id: string;
  bundleName: string;
  lecturesRemaining: number;
  expiresAt: Date;
}

interface RedeemLectureModalProps {
  isOpen: boolean;
  onClose: () => void;
  lectureId: string;
  lectureName: string;
  userBundles: UserBundle[];
  onRedeem: (bundleId: string, lectureId: string) => Promise<boolean>;
}

export function RedeemLectureModal({
  isOpen,
  onClose,
  lectureId,
  lectureName,
  userBundles,
  onRedeem,
}: RedeemLectureModalProps) {
  const [selectedBundle, setSelectedBundle] = useState<string | null>(null);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [redeemSuccess, setRedeemSuccess] = useState(false);

  const handleRedeem = async () => {
    if (!selectedBundle) return;

    setIsRedeeming(true);
    try {
      const success = await onRedeem(selectedBundle, lectureId);
      if (success) {
        setRedeemSuccess(true);
      }
    } catch (error) {
      console.error("Redeem error:", error);
    } finally {
      setIsRedeeming(false);
    }
  };

  const handleClose = () => {
    setSelectedBundle(null);
    setRedeemSuccess(false);
    onClose();
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("ar-EG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const getDaysRemaining = (date: Date) => {
    return Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  };

  if (redeemSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-green-700 dark:text-green-300">
              تم استبدال المحاضرة بنجاح!
            </h2>
            <p className="text-muted-foreground">
              لديك الآن <strong>7 أيام</strong> للوصول للمحاضرة
              <br />و <strong>3 أرواح</strong> لتمديد الوصول
            </p>
            <div className="flex items-center justify-center gap-4 py-2">
              <div className="flex items-center gap-1">
                <Clock className="w-5 h-5 text-blue-600" />
                <span>7 أيام</span>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3].map((i) => (
                  <Heart
                    key={i}
                    className="w-5 h-5 text-rose-500 fill-rose-500"
                  />
                ))}
              </div>
            </div>
            <Button onClick={handleClose} className="w-full">
              <Video className="w-4 h-4 ms-2" />
              الذهاب للمحاضرة
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            استبدال محاضرة
          </DialogTitle>
          <DialogDescription>
            اختر باقة لاستبدال محاضرة &quot;{lectureName}&quot;
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {userBundles.length === 0 ? (
            <div className="text-center py-8 space-y-4">
              <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
              <p className="text-muted-foreground">
                لا توجد باقات نشطة. اشترِ باقة للوصول للمحاضرات.
              </p>
              <Button variant="outline" onClick={handleClose}>
                شراء باقة
              </Button>
            </div>
          ) : (
            userBundles.map((bundle) => {
              const daysLeft = getDaysRemaining(bundle.expiresAt);
              const isSelected = selectedBundle === bundle.id;

              return (
                <button
                  type="button"
                  key={bundle.id}
                  onClick={() => setSelectedBundle(bundle.id)}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-end ${
                    isSelected
                      ? "border-purple-500 bg-purple-50 dark:bg-purple-950/20"
                      : "border-border hover:border-primary/50"
                  }`}
                  disabled={bundle.lecturesRemaining === 0}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Package
                        className={`w-5 h-5 ${isSelected ? "text-purple-600" : "text-muted-foreground"}`}
                      />
                      <div>
                        <p className="font-bold">{bundle.bundleName}</p>
                        <p className="text-sm text-muted-foreground">
                          تنتهي: {formatDate(bundle.expiresAt)} ({daysLeft} يوم)
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        bundle.lecturesRemaining > 0 ? "default" : "secondary"
                      }
                    >
                      {bundle.lecturesRemaining} متبقية
                    </Badge>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {userBundles.length > 0 && (
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={handleClose}
              className="w-full sm:w-auto"
            >
              إلغاء
            </Button>
            <Button
              onClick={handleRedeem}
              disabled={!selectedBundle || isRedeeming}
              className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {isRedeeming ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent ms-2" />
                  جاري الاستبدال...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 ms-2" />
                  تأكيد الاستبدال
                </>
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
