
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface AddTripModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddTripModal = ({ isOpen, onClose }: AddTripModalProps) => {
  const [formData, setFormData] = useState({
    date: '',
    waterway: '',
    duration: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Trip data:', formData);
    onClose();
    setFormData({ date: '', waterway: '', duration: '', notes: '' });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Trip</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="waterway">Waterway</Label>
            <Input
              id="waterway"
              type="text"
              placeholder="e.g., Sydney Harbour"
              value={formData.waterway}
              onChange={(e) => setFormData({...formData, waterway: e.target.value})}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="duration">Duration</Label>
            <Input
              id="duration"
              type="text"
              placeholder="e.g., 2 hours"
              value={formData.duration}
              onChange={(e) => setFormData({...formData, duration: e.target.value})}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any additional details about the trip..."
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
            />
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-water-blue hover:bg-water-blue/90"
            >
              Add Trip
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTripModal;
