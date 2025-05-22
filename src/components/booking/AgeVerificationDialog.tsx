
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AgeVerificationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: (supervisorName: string) => void;
}

export const AgeVerificationDialog = ({
  isOpen,
  onClose,
  onAccept,
}: AgeVerificationDialogProps) => {
  const [supervisorName, setSupervisorName] = useState("");
  const [showNameField, setShowNameField] = useState(false);

  const handleAccept = () => {
    setShowNameField(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (supervisorName.trim()) {
      onAccept(supervisorName);
      setShowNameField(false);
      setSupervisorName("");
    }
  };

  const handleDialogClose = () => {
    setShowNameField(false);
    setSupervisorName("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Age Verification Required</DialogTitle>
          <DialogDescription className="text-left">
            Important: Participants aged between 12 and under 16 must be accompanied
            by a supervising adult during all boating activities, in line with NSW
            Maritime regulations.
          </DialogDescription>
        </DialogHeader>
        {!showNameField ? (
          <DialogFooter className="sm:justify-start">
            <Button type="button" onClick={handleAccept}>
              Accept
            </Button>
            <Button type="button" variant="secondary" onClick={handleDialogClose}>
              Cancel
            </Button>
          </DialogFooter>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="supervisorName">
                Full Name of Supervising Adult (Required for participants under 16
                years old)
              </Label>
              <Input
                id="supervisorName"
                type="text"
                value={supervisorName}
                onChange={(e) => setSupervisorName(e.target.value)}
                placeholder="Enter full name"
                required
                autoFocus
              />
            </div>
            <DialogFooter className="sm:justify-start">
              <Button type="submit" disabled={!supervisorName.trim()}>
                Submit
              </Button>
              <Button type="button" variant="secondary" onClick={() => setShowNameField(false)}>
                Back
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
