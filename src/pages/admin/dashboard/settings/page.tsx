import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Schema for profile update
const profileSchema = z.object({
  name: z.string().min(1),
  surname: z.string().min(1),
  profilePhoto: z.string().optional(), // base64
});

// Schema for password update
const passwordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6),
  confirmNewPassword: z.string().min(6),
}).refine(data => data.newPassword === data.confirmNewPassword, {
  message: "New passwords do not match",
  path: ["confirmNewPassword"],
});

export default function SettingsPage() {
  const [tab, setTab] = useState("profile");
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [user, setUser] = useState<{ name: string; surname: string; profilePhoto?: string }>({
    name: "John",
    surname: "Doe",
    profilePhoto: "",
  });

  useEffect(() => {
    // Simulate fetch from /auth/me
    setTimeout(() => {
      setUser({
        name: "John",
        surname: "Doe",
        profilePhoto: "",
      });
    }, 500);
  }, []);

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name,
      surname: user.surname,
      profilePhoto: user.profilePhoto,
    },
  });

  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
  });

  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setPreviewImage(base64);
      profileForm.setValue("profilePhoto", base64);
    };
    reader.readAsDataURL(file);
  };

  const handleProfileSubmit = (values: any) => {
    console.log("Submit profile", values);
    // Future PATCH /v1/auth/me
  };

  const handlePasswordSubmit = (values: any) => {
    console.log("Submit password", values);
    // Future POST /v1/auth/me/reset-password
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
                <Input id="name" placeholder={user.name} {...profileForm.register("name")} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="surname">Surname</Label>
                <Input id="surname" placeholder={user.surname} {...profileForm.register("surname")} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="profilePhoto">Profile Photo</Label>
                <Input
                  id="profilePhoto"
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePhotoChange}
                />
                {previewImage && (
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-20 h-20 rounded-full object-cover mt-2"
                  />
                )}
              </div>

              <Button type="submit" className="text-white py-5 rounded-lg">
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
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  type="password"
                  id="newPassword"
                  {...passwordForm.register("newPassword")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                <Input
                  type="password"
                  id="confirmNewPassword"
                  {...passwordForm.register("confirmNewPassword")}
                />
              </div>

              <Button type="submit" className="text-white py-5 rounded-lg">
                Change Password
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}