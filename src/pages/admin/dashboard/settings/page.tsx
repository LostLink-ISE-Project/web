import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useNavigate } from "react-router-dom";

export default function SettingsPage() {
  const { setUser } = useAuthStore();
  const { data: user } = useMe();
  const updateMe = useUpdateMe();
  const resetPassword = useResetPassword();

  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    reset: resetProfile,
    formState: { errors: profileErrors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      surname: "",
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPasswordForm,
    formState: { errors: passwordErrors },
  } = useForm({
    resolver: zodResolver(passwordSchema),
  });

  useEffect(() => {
    if (user) {
      resetProfile({
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
      
      resetPasswordForm();

      logout();
      navigate("/");
    } catch (err) {
      toast.error("Failed to change password.");
    }
  };

  return (
    <Card className="border-0 shadow-xl rounded-2xl">
      <CardHeader>
        <CardTitle className="text-2xl">Settings</CardTitle>
      </CardHeader>
      <CardContent className="flex md:flex-row flex-col gap-10 md:gap-20 lg:gap-30 w-full justify-between">
        <div className="flex flex-col gap-4 w-full">
          <h2 className="font-semibold text-xl">Profile</h2>

          <form
            onSubmit={handleSubmitProfile(handleProfileSubmit)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...registerProfile("name")} />
              {profileErrors.name && (
                <p className="text-xs text-red-500">{profileErrors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="surname">Surname</Label>
              <Input id="surname" {...registerProfile("surname")} />
              {profileErrors.surname && (
                <p className="text-xs text-red-500">{profileErrors.surname.message}</p>
              )}
            </div>

            <Button type="submit" className="text-white py-5 rounded-lg w-full">
              Update Profile
            </Button>
          </form>
        </div>

        <div className="w-full md:w-0.5 rounded-lg bg-on-surface" />

        <div className="flex flex-col gap-4 w-full">
          <h2 className="font-semibold text-xl">Password</h2>

          <form
            onSubmit={handleSubmitPassword(handlePasswordSubmit)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input type="password" id="currentPassword" {...registerPassword("currentPassword")} />
              {passwordErrors.currentPassword && (
                <p className="text-xs text-red-500">{passwordErrors.currentPassword.message}</p>
              )}
            </div>

            <div className="flex flex-col lg:flex-row justify-between gap-4">
              <div className="space-y-2 w-full">
                <Label htmlFor="newPassword">New Password</Label>
                <Input 
                  type="password" 
                  id="newPassword" 
                  {...registerPassword("newPassword")} 
                />
                {passwordErrors.newPassword && (
                  <p className="text-xs text-red-500">{passwordErrors.newPassword.message}</p>
                )}
              </div>

              <div className="space-y-2 w-full">
                <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                <Input
                  type="password"
                  id="confirmNewPassword"
                  {...registerPassword("confirmNewPassword")}
                />
                {passwordErrors.confirmNewPassword && (
                  <p className="text-xs text-red-500">{passwordErrors.confirmNewPassword.message}</p>
                )}
              </div>
            </div>

            <Button type="submit" className="text-white py-5 rounded-lg w-full">
              Change Password
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
