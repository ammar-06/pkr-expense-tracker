"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function GoalsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Savings Goals</h2>
          <p className="text-muted-foreground">Track your progress towards financial goals.</p>
        </div>
        <Button>Create Goal</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Emergency Fund</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>₨ 50,000 saved</span>
                <span className="text-muted-foreground">Target: ₨ 200,000</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary w-1/4" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
