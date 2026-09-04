"use client";

import { useAuth } from "@/lib/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage your account preferences.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your account details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Email Address</Label>
            <Input disabled value={user?.email || ""} />
            <p className="text-xs text-muted-foreground">Your email is managed by Firebase Auth.</p>
          </div>
          <div className="space-y-2">
            <Label>Currency</Label>
            <Input disabled value="PKR (₨)" />
          </div>
          <Button disabled>Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  );
}
