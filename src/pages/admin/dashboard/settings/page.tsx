import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { passwordSchema, profileSchema } from "@/lib/schemas/profileSchema";
import { useAuthStore } from "@/lib/stores/auth.store";
import { useMe, useUpdateMe, useResetPassword } from "@/api/auth/hook";

export default function SettingsPage() {
  const [tab, setTab] = useState("profile");

  const { user: storedUser, setUser } = useAuthStore();
  const { data: user } = useMe();
  const updateMe = useUpdateMe();
  const resetPassword = useResetPassword();

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      surname: "",
    },
  });

  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
  });

  useEffect(() => {
    if (user) {
      profileForm.reset({
        name: user.name,
        surname: user.surname,
      });
    }
  }, [user]);

  const handleProfileSubmit = async (values: z.infer<typeof profileSchema>) => {
    try {
      const updated = await updateMe.mutateAsync(values);
      setUser(updated);
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error("Failed to update profile.");
    }
  };

  const handlePasswordSubmit = async (values: z.infer<typeof passwordSchema>) => {
    try {
      await resetPassword.mutateAsync(values);
      toast.success("Password changed successfully!");
      passwordForm.reset();
    } catch (err) {
      toast.error("Failed to change password.");
    }
  };

  return (
    <Card className="border-0 shadow-xl rounded-2xl">
      <CardHeader>
        <CardTitle className="text-xl">Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="w-full mb-4 border-b rounded-none">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <form
              onSubmit={profileForm.handleSubmit(handleProfileSubmit)}
              className="space-y-4 max-w-md"
            >
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" {...profileForm.register("name")} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="surname">Surname</Label>
                <Input id="surname" {...profileForm.register("surname")} />
              </div>

              <Button type="submit" className="text-white py-5 rounded-lg w-full">
                Update Profile
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="password">
            <form
              onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}
              className="space-y-4 max-w-md"
            >
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input type="password" id="currentPassword" {...passwordForm.register("currentPassword")} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input type="password" id="newPassword" {...passwordForm.register("newPassword")} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                <Input type="password" id="confirmNewPassword" {...passwordForm.register("confirmNewPassword")} />
              </div>

              <Button type="submit" className="text-white py-5 rounded-lg w-full">
                Change Password
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
