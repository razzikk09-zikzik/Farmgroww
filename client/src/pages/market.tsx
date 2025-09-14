import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sprout, Apple, Leaf, TrendingUp, TrendingDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { MarketPrice } from "@shared/schema";

export default function Market() {
  const [category, setCategory] = useState("all");
  const [selectedCrop, setSelectedCrop] = useState<MarketPrice | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [transportForm, setTransportForm] = useState({
    quantity: "",
    location: "",
    notes: ""
  });
  const { toast } = useToast();

  const { data: marketPrices, isLoading } = useQuery<MarketPrice[]>({
    queryKey: ["/api/market", { category }],
  });

  const transportMutation = useMutation({
    mutationFn: async (data: { crop: string; quantity: string; location: string; notes?: string }) => {
      const response = await apiRequest("POST", "/api/market/transport-request", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Transport Request Submitted",
        description: data.message,
      });
      setIsDialogOpen(false);
      setTransportForm({ quantity: "", location: "", notes: "" });
      setSelectedCrop(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit transport request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const getCropIcon = (crop: string) => {
    switch (crop.toLowerCase()) {
      case "rice": return <Sprout className="text-accent h-5 w-5" />;
      case "tomato": return <Apple className="text-destructive h-5 w-5" />;
      case "banana": return <Leaf className="text-accent h-5 w-5" />;
      default: return <Sprout className="text-accent h-5 w-5" />;
    }
  };

  const handleTransportRequest = (crop: MarketPrice) => {
    setSelectedCrop(crop);
    setIsDialogOpen(true);
  };

  const handleTransportSubmit = () => {
    if (!selectedCrop || !transportForm.quantity || !transportForm.location) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    transportMutation.mutate({
      crop: selectedCrop.crop,
      quantity: transportForm.quantity,
      location: transportForm.location,
      notes: transportForm.notes
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Skeleton className="h-8 w-48 mb-6" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Market Dashboard</h1>
        <p className="text-muted-foreground">Current market prices and transport services</p>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <Label htmlFor="category">Filter by Category:</Label>
          <Select value={category} onValueChange={setCategory} name="category">
            <SelectTrigger className="w-[180px]" data-testid="category-filter">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Crops</SelectItem>
              <SelectItem value="grains">Grains</SelectItem>
              <SelectItem value="vegetables">Vegetables</SelectItem>
              <SelectItem value="fruits">Fruits</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Market Prices Table */}
      <Card>
        <CardHeader>
          <CardTitle>Current Market Prices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 text-sm font-medium text-muted-foreground">Crop</th>
                  <th className="text-right py-3 text-sm font-medium text-muted-foreground">Current Price</th>
                  <th className="text-right py-3 text-sm font-medium text-muted-foreground">24h Change</th>
                  <th className="text-center py-3 text-sm font-medium text-muted-foreground">Category</th>
                  <th className="text-right py-3 text-sm font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {marketPrices?.map((price) => (
                  <tr key={price.id} data-testid={`market-row-${price.crop.toLowerCase()}`}>
                    <td className="py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                          {getCropIcon(price.crop)}
                        </div>
                        <span className="font-medium text-foreground">{price.crop}</span>
                      </div>
                    </td>
                    <td className="text-right py-4 font-semibold text-foreground text-lg">
                      {price.price}
                    </td>
                    <td className="text-right py-4">
                      <div className="flex items-center justify-end space-x-1">
                        {price.change > 0 ? (
                          <TrendingUp className="h-4 w-4 text-primary" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-destructive" />
                        )}
                        <span className={`text-sm font-medium ${
                          price.change > 0 ? "text-primary" : "text-destructive"
                        }`}>
                          {price.change > 0 ? "+" : ""}{price.change}%
                        </span>
                      </div>
                    </td>
                    <td className="text-center py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground capitalize">
                        {price.category}
                      </span>
                    </td>
                    <td className="text-right py-4">
                      <Button 
                        size="sm"
                        onClick={() => handleTransportRequest(price)}
                        data-testid={`transport-request-${price.crop.toLowerCase()}`}
                      >
                        Request Transport
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Transport Request Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Transport for {selectedCrop?.crop}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Current Price:</span>
                <span className="text-lg font-semibold text-primary">{selectedCrop?.price}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity*</Label>
              <Input
                id="quantity"
                placeholder="e.g., 10 quintals, 50 kg"
                value={transportForm.quantity}
                onChange={(e) => setTransportForm({ ...transportForm, quantity: e.target.value })}
                data-testid="quantity-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Pickup Location*</Label>
              <Input
                id="location"
                placeholder="Village, District, State"
                value={transportForm.location}
                onChange={(e) => setTransportForm({ ...transportForm, location: e.target.value })}
                data-testid="location-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                placeholder="Special instructions, preferred timing, etc."
                value={transportForm.notes}
                onChange={(e) => setTransportForm({ ...transportForm, notes: e.target.value })}
                data-testid="notes-textarea"
              />
            </div>

            <div className="bg-accent/10 p-3 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> Transport requests are processed within 2-3 hours. 
                You will receive a confirmation call from our logistics partner.
              </p>
            </div>

            <div className="flex space-x-2">
              <Button 
                onClick={handleTransportSubmit}
                disabled={transportMutation.isPending}
                className="flex-1"
                data-testid="submit-transport-request"
              >
                {transportMutation.isPending ? "Submitting..." : "Submit Request"}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
                data-testid="cancel-transport-request"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
